import { Component, OnInit, NgZone } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar';
import { provide }    from '@angular/core';

import { MockGarageService } from './garage.service.mock';
import { GarageService } from './garage.service';
import { Garage, Widget } from './garage';

import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [GarageService],
  //providers: [provide(GarageService, { useClass: MockGarageService })], //setting up Dependency injection here?  
  directives: [
    MD_CARD_DIRECTIVES,
    MD_TOOLBAR_DIRECTIVES,
    MD_LIST_DIRECTIVES,
  ],
})

export class AppComponent implements OnInit {
  widgets: [Widget];
  timestamp: String;
  zone: NgZone;

  ngOnInit() {
    this.getGarageDoorState();
    this.garageService.setupGarageStateEventSource((garage) => {
      this.zone.run(() => {
        this.widgets = this.mapGarageToWidgets(garage);
        this.timestamp = garage.timestamp;
      });
    });
  }

  constructor(private garageService: GarageService) {
    this.zone = new NgZone({ enableLongStackTrace: false });
  }

  getGarageDoorState() {
    this.garageService.getGarageDoorState()
      .then(garage => {
        this.widgets = this.mapGarageToWidgets(garage);
      });
  }

  mapGarageToWidgets(garage: Garage): [Widget] {
    return [
      {
        name: 'garage',
        state: garage.isOpen,
        warnUserState: true,
        fontAwesomeIcon: 'fa-car',
        stateLabel: (garage.isOpen === true) ? "Open" : "Closed",
        nameLabel: 'Door'
      }, {
        name: 'light',
        state: garage.isGarageLightSwitchOn,
        warnUserState: true,
        fontAwesomeIcon: 'fa-lightbulb-o',
        stateLabel: (garage.isGarageLightSwitchOn === true) ? "On" : "Off",
        nameLabel: 'Light'
      }
    ]
  }

  setCardIconClass(widget: Widget) {
    var classes = {};
    classes[widget.fontAwesomeIcon] = true;
    return classes;
  }

  getHumanizeLastUpdated() {
    if (this.timestamp) {
      return moment(this.timestamp).format('ll LTS'); //.from(moment())
    }
    return "";
  }

  onSelect(widget: Widget) {
    this.garageService.toggleWidget(widget);
  }
}
