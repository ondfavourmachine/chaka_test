import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, PartialObserver } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { backUp } from 'src/backUp';
import { environment } from 'src/environments/environment';

export interface Stock {
  close: number
  date: string
  high: number
  low: number
  name: string
  open: number
  symbol: string,
  percentageLossOrGain?: number;
  pLossColor?: any,
}
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  getCurrentDate = () => new Date(Date.now()).toISOString().split('T')[0];
  constructedStocks: Stock[] = [];
  envkey = environment.external_api_key2;
  stocksSubject = new BehaviorSubject([]) as any;
  stocks$ = this.stocksSubject.asObservable();
  activeStocks = `https://www.alphavantage.co/query?function=LISTING_STATUS&date=${this.getCurrentDate()}&apikey=${environment.external_api_key}`
  constructor(
    private http: HttpClient
  ) { }



   broadCastStock(anything: Stock[]) {
     this.stocksSubject.next(anything);
   }

  fetchStocks(): Observable<any>{
    const url = `http://api.marketstack.com/v1/tickers?access_key=${this.envkey}&limit=15`;
    return this.http.get(url).pipe(
      pluck('data'),
      map((elem: unknown ) => {
        return ( elem as Array<Record<string, any>>).map(elem => ({name : elem.name, symbol: elem.symbol}))
      })
    )
  }


  getLatestEndOfDayHighAndLowForAStock(stockSymbol: string){
    const url = `http://api.marketstack.com/v1/eod/latest?access_key=${this.envkey}&symbols=${stockSymbol}&limit=1`;
    return this.http.get(url)
    .pipe(
      pluck('data'),
      map((elem: unknown) => {
        const {date, close, high, low, open, symbol} = (elem as Array<Record<string, any>>)[0];
        return { date, close, high, low, open, symbol};
      })
    )
    .toPromise();
  }

  retreivelatestStockData(){
    const pObs : PartialObserver<{name: string, symbol: string}[]> = {
      next: val => this.constructDataForDisplay(val),
      error: error =>{
        const backUpJson = backUp();
        this.constructDataForDisplay(undefined, backUpJson);
      }
    }
    this.fetchStocks().subscribe(pObs);
  }

 async constructDataForDisplay(stocks?: Array<{name: string, symbol: string }>, backUp?: Array<any>){
   const calcPerc = (close: number, open: number) => (close - open) / 100;
   const arrayToUse = stocks  != undefined ? stocks : backUp;
    for await (const stock of (arrayToUse as Array<any>)) {
      let res;
       try {
        res = await this.getLatestEndOfDayHighAndLowForAStock(stock.symbol); 
        stocks != undefined ? this.constructedStocks.push({...res, name: stock.name}) : this.constructedStocks.push({date: res.date,close: res.close,high: res.high,open: res.open,low: res.low,symbol: res.symbol,name: stock.name}) ;
       } catch (error) {
        this.constructedStocks.push({date: stock.date,close: stock.close, high: stock.high,open: stock.open,low: stock.low,symbol: stock.symbol, name: stock.name});
       }
      
    }
    // this.constructedStocks.forEach(elem => elem.percentageLossOrGain = calcPerc(elem.close, elem.open))
    localStorage.setItem('stocks_info', JSON.stringify(this.constructedStocks));
    this.broadCastStock(this.constructedStocks);
  }
}
