import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DateTime } from 'luxon';
import * as numeral from 'numeral';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TWSE_MODEL_TOKEN, TwseDocument } from './schemas/twse.schema';

@Injectable()
export class TwseScraperService {
  constructor(
    @InjectModel(TWSE_MODEL_TOKEN) private twseModel: Model<TwseDocument>,
    private httpService: HttpService,
  ) {}

  // API：取得上是公司股票清單
  async fetchListedStocks(options?: { market: 'TSE' | 'OTC' }) {
    const url =
      options?.market === 'OTC'
        ? 'https://isin.twse.com.tw/isin/class_main.jsp?market=2&issuetype=4'
        : 'https://isin.twse.com.tw/isin/class_main.jsp?market=1&issuetype=1';

    // 取得 HTML 並轉換為 Big-5 編碼
    const page = await firstValueFrom(
      this.httpService.get(url, { responseType: 'arraybuffer' }),
    ).then((response) => iconv.decode(response.data, 'big5'));

    // 使用 cheerio 載入 HTML 以取得表格的 table rows
    const $ = cheerio.load(page);
    const rows = $('.h4 tr');

    // 遍歷每個 table row 並將其轉換成我們想要的資料格式
    const data = rows
      .slice(1)
      .map((i, el) => {
        const td = $(el).find('td');
        return {
          symbol: td.eq(2).text().trim(), // 股票代碼
          name: td.eq(3).text().trim(), // 股票名稱
          market: td.eq(4).text().trim(), // 市場別
          industry: td.eq(6).text().trim(), // 產業別
        };
      })
      .toArray();

    return data;
  }

  // API：取得上市股票本益比、股價淨值比、殖利率
  async fetchEquitiesValues(date: string) {
    // 將 `date` 轉換成 `yyyyMMdd` 格式
    const formattedDate = DateTime.fromISO(date).toFormat('yyyyMMdd');

    // 建立 URL 查詢參數
    const query = new URLSearchParams({
      response: 'json', // 指定回應格式為 JSON
      date: formattedDate, // 指定資料日期
      selectType: 'ALL', // 指定分類項目為全部
    });
    const url = `https://www.twse.com.tw/exchangeReport/BWIBBU_d?${query}`;

    // 取得回應資料
    const responseData = await firstValueFrom(this.httpService.get(url)).then(
      (response) => (response.data.stat === 'OK' ? response.data : null),
    );

    // 若該日期非交易日或尚無成交資訊則回傳 null
    if (!responseData) return null;

    // 整理回應資料
    const data = responseData.data.reduce((tickers, row) => {
      const [
        symbol,
        name,
        dividendYield,
        dividendYear,
        peRatio,
        pbRatio,
        fiscalYearQuarter,
      ] = row;
      const ticker = {
        date,
        symbol,
        name,
        fiscalYearQuarter, // 財報年/季
        peRatio: numeral(peRatio).value(), // 本益比
        pbRatio: numeral(pbRatio).value(), // 股價淨值比
        dividendYield: numeral(dividendYield).value(), // 殖利率
        dividendYear: numeral(dividendYear).value(), // 股利年度
      };
      return [...tickers, ticker];
    }, []);

    return data;
  }

  // async onApplicationBootstrap() {
  //   const tse = await this.fetchListedStocks({ market: 'TSE' });
  //   // console.log(tse); // 顯示上市公司股票清單

  //   const otc = await this.fetchListedStocks({ market: 'OTC' });
  //   // console.log(otc); // 顯示上櫃公司股票清單
  // }
}
