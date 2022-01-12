import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'chaka-test-app';
 
  constructor(private apiservice: ApiService){
    
  }

  ngOnInit(): void {

    this.apiservice.stocks$.subscribe(
      (val: any[]) => console.log(val),
      (err: any) => console.log(err)
    )
    // this.retreivelatestStockData();
  }

 

 
}
