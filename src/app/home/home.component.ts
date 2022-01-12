import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService, Stock } from '../services/api.service';
import { UseAngularMaterialComponent } from '../use-angular-material/use-angular-material.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  stocks: Stock[] = [];
  constructor(
    private apiservice: ApiService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.apiservice.stocks$.subscribe(
      (val: any[]) => {
        let stocks = JSON.parse(localStorage.getItem('stocks_info') as string);
        if (val.length < 1 && !Array.isArray(stocks)) {
          this.apiservice.retreivelatestStockData();
        }else{
          const calcPerc = (close: number, open: number) => (close - open);
          stocks = (stocks as Stock[]).filter((elem: Object & Stock) => elem.hasOwnProperty('close'));
          stocks =  (stocks as Stock[]).map(elem => ({...elem, 
            percentageLossOrGain: calcPerc(elem.close, elem.open).toFixed(2),
          }));
          this.stocks = (stocks as Stock[]).map(elem => ({...elem, pLossColor: elem.percentageLossOrGain?.toString().includes('-') ? 'red': 'green'}));
          // console.log(this.stocks);
          
        }
      },
      (err: any) => console.log(err)
    )
  }

  showMatDialog(){
    const dialog = this.dialog.open(UseAngularMaterialComponent, {width: '70vw', height: '90vh', panelClass: 'user-angular-material'});
  }

}
