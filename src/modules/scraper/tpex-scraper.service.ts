import * as numeral from 'numeral';
import { DateTime } from 'luxon';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class TpexScraperService {
  constructor(private httpService: HttpService) {}

  async fetchEquitiesValues(date: string) {
    // `date` 轉換成 `民國年/MM/dd` 格式
    const dt = DateTime.fromISO(date);
    const year = dt.get('year') - 1911;
    const formattedDate = `${year}/${dt.toFormat('MM/dd')}`;

    // 建立 URL 查詢參數
    const query = new URLSearchParams({
      l: 'zh-tw', // 指定語系為正體中文
      o: 'json', // 指定回應格式為 JSON
      d: formattedDate, // 指定資料日期
    });

    const url = `https://www.tpex.org.tw/web/stock/aftertrading/peratio_analysis/pera_result.php?${query}`;

    // 取得回應資料
    const responseData = await firstValueFrom(this.httpService.get(url)).then(
      (response) =>
        response.data.tables[0].totalCount > 0 ? response.data.tables[0] : null,
    );

    // 若該日期非交易日或尚無成交資訊則回傳 null
    if (!responseData) return null;

    // 整理回應資料
    const data = responseData.data.reduce((tickers, row) => {
      const [
        symbol,
        name,
        peRatio,
        dividendPerShare,
        dividendYear,
        dividendYield,
        pbRatio,
      ] = row;
      const ticker = {
        date,
        symbol,
        name,
        dividendPerShare: numeral(dividendPerShare).value(), // 每股股利
        peRatio: numeral(peRatio).value(), // 本益比
        pbRatio: numeral(pbRatio).value(), // 股價淨值比
        dividendYield: numeral(dividendYield).value(), // 殖利率
        dividendYear: dividendYear + 1911, // 股利年度
      };
      return [...tickers, ticker];
    }, []);

    return data;
  }
}
