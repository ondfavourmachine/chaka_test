import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, PartialObserver } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  getCurrentDate = () => new Date(Date.now()).toISOString().split('T')[0];
  constructedStocks: any[] = [];
  envkey = environment.external_api_key2;
  stocksSubject = new BehaviorSubject([]) as any;
  stocks$ = this.stocksSubject.asObservable();
  activeStocks = `https://www.alphavantage.co/query?function=LISTING_STATUS&date=${this.getCurrentDate()}&apikey=${environment.external_api_key}`
  constructor(
    private http: HttpClient
  ) { }



   broadCastStock(anything: any[]) {
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
      error: error => console.log(error)
    }
    this.fetchStocks().subscribe(pObs);
  }

 async constructDataForDisplay(stocks: Array<{name: string, symbol: string }>){
  //  console.log(stocks);
    for await (const stock of stocks) {
       const res = await this.getLatestEndOfDayHighAndLowForAStock(stock.symbol); 
       this.constructedStocks.push({...res, name: stock.name});
    }

    localStorage.setItem('stocks_info', JSON.stringify(this.constructedStocks));
  }
}
