import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DailyStockTrade } from './schemas/daily-stock-trade.schema';
import { StocksRepository } from './stocks.repository';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' }, transports: ['websocket'] }) // 允許 CORS
export class StocksService implements OnModuleDestroy {
  @WebSocketServer()
  server: Server;

  private stockIntervals = new Map<string, NodeJS.Timeout>();
  private lastTradePrice = {}; // 儲存最後成交價
  private lastTradeVolume = {}; // 儲存最後成交量

  constructor(
    @InjectModel(DailyStockTrade.name)
    private stockTradeModel: Model<DailyStockTrade>,
    private readonly stocksRepository: StocksRepository,
  ) {}

  @SubscribeMessage('subscribeStock')
  async handleStockSubscription(client: any, payload: { stockId: string }) {
    const { stockId } = payload;

    // 如果已經在監聽這支股票，先清除舊的 Interval
    if (this.stockIntervals.has(stockId)) {
      clearInterval(this.stockIntervals.get(stockId));
    }

    // 設置新的 Interval，每 5 秒查詢一次該股票
    const interval = setInterval(() => this.fetchStockData(stockId), 5000);
    this.stockIntervals.set(stockId, interval);

    client.emit('subscribed', { stockId, message: '訂閱成功' });
  }

  async fetchStockData(stockId: string) {
    const url = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_${stockId}.tw`;

    try {
      const response = await axios.get(url);
      const data = response.data;

      if (data?.msgArray?.length > 0) {
        const stockInfo = data.msgArray[0];
        const currentPrice =
          stockInfo.z !== '-'
            ? stockInfo.z
            : (this.lastTradePrice[stockId] ?? null);

        const currentVolume =
          stockInfo.tv !== '-'
            ? stockInfo.tv
            : (this.lastTradeVolume[stockId] ?? null);

        console.log('currentPrice:', currentPrice);
        const tradeRecord: DailyStockTrade = {
          stockId,
          lastTradeDate: stockInfo.d, // 交易日期
          lastTradeTime: stockInfo.t, // 交易時間
          openingPrice: stockInfo.o, // 開盤價
          highestPrice: stockInfo.h, // 最高價
          lowestPrice: stockInfo.l, // 最低價
          previousClose: stockInfo.y, // 昨收價
          currentPrice: currentPrice, // 當盤成交價
          currentVolume: currentVolume, // 當盤成交量,
        };

        if (currentPrice && stockInfo.z !== '-') {
          this.lastTradePrice[stockId] = currentPrice; // 更新最後成交價
        }

        if (currentVolume && stockInfo.tv !== '-') {
          this.lastTradeVolume[stockId] = currentVolume; // 更新最後成交量
        }

        // 存入 MongoDB
        // await new this.stockTradeModel(tradeRecord).save();
        this.stocksRepository.insertStockData([tradeRecord]);

        // 廣播給所有訂閱的客戶端
        this.server.emit(`stockData:${stockId}`, tradeRecord);
      }
    } catch (error) {
      console.error(`無法取得股票資料 (${stockId}):`, error.message);
    }
  }

  async getStockHistory(stockId: string) {
    return this.stockTradeModel.find({ stockId }).sort({ tradeTime: 1 }).exec();
  }

  onModuleDestroy() {
    this.stockIntervals.forEach((interval) => clearInterval(interval));
  }
}
