import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { UseAngularMaterialComponent } from '../use-angular-material/use-angular-material.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  stocks: any[] = [];
  constructor(
    private apiservice: ApiService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.apiservice.stocks$.subscribe(
      (val: any[]) => {
        const stocks = JSON.parse(localStorage.getItem('stocks_info') as string);
        debugger
        if (val.length < 1 &&  !Array.isArray(stocks)) {
          this.apiservice.retreivelatestStockData()
        }else{
          console.log(stocks);
          this.stocks = stocks;
        }
      },
      (err: any) => console.log(err)
    )
  }

  showMatDialog(){
    const dialog = this.dialog.open(UseAngularMaterialComponent, {width: '70vw', height: '90vh', panelClass: 'user-angular-material'});
  }

}
