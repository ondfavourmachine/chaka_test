import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UseAngularMaterialComponent } from '../use-angular-material/use-angular-material.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  showMatDialog(){
    const dialog = this.dialog.open(UseAngularMaterialComponent, {width: '70vw', height: '90vh', panelClass: 'user-angular-material'});
  }

}
