import { Component, OnInit } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar';

import { GarageService } from './garage.service';
import { Garage } from './garage';

import * as moment from 'moment';

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [GarageService],
  directives: [
    MD_CARD_DIRECTIVES,
    MD_TOOLBAR_DIRECTIVES,
    MD_LIST_DIRECTIVES,
  ],
})

export class AppComponent implements OnInit {
  garage: Garage;

  ngOnInit() {
    this.getGarageDoorState();
  }

  constructor(private garageService: GarageService) {
  }

  getGarageDoorState() {
    this.garageService.getGarageDoorState()
      .subscribe(garageState => {
        this.garage = garageState.json() 
      });
  }

  getGarageStateLabel() {
    return (this.garage.isOpen === true) ? "Open" : "Closed"
  }

  getHumanizeLastUpdated() {
    return moment(this.garage.timestamp).from(moment())
  }
}
