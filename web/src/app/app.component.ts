import { Component, OnInit, NgZone } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar';
import { provide }    from '@angular/core';

import { MockGarageService } from './garage.service.mock';
import { GarageService } from './garage.service';
import { Garage } from './garage';

import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [GarageService],
  //providers: [ provide(GarageService, { useClass: MockGarageService }) ], //setting up Dependency injection here?  
  directives: [
    MD_CARD_DIRECTIVES,
    MD_TOOLBAR_DIRECTIVES,
    MD_LIST_DIRECTIVES,
  ],
})

export class AppComponent implements OnInit {
  garage: Garage;
  zone: NgZone;

  ngOnInit() {
    this.getGarageDoorState();
    this.garageService.setupGarageStateEventSource((garage) => {
      this.zone.run(() => {
        this.garage = garage;
      });
    });
  }

  constructor(private garageService: GarageService) {
    this.zone = new NgZone({ enableLongStackTrace: false });
  }

  getGarageDoorState() {
    this.garageService.getGarageDoorState()
      .then(garageState => {
        this.garage = garageState;
      });
  }

  getGarageStateLabel() {
    return (this.garage.isOpen === true) ? "Open" : "Closed"
  }

  getHumanizeLastUpdated() {
    return moment(this.garage.timestamp).format('ll LTS'); //.from(moment())
  }

  onSelect() {
    console.log("Yo");
  }

}
