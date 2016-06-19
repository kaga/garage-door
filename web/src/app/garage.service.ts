import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Garage, Widget } from './garage';

@Injectable()
export class GarageService {

    private garageStateEventSource;
    private baseUrl = "http://raspberrypi.local:3000/v2/";
    private garageDoorStateUrl = "garage/state";

    constructor(private http: Http) {
        this.garageStateEventSource = new EventSource('http://raspberrypi.local:3000/events/garage');
    }

    setupGarageStateEventSource(onGarageStateUpdated: (garage: Garage) => void) {
        this.garageStateEventSource.onmessage = (event) => {
            var garage  = JSON.parse(event.data);        
            onGarageStateUpdated(garage);
        };         
    }

    getGarageDoorState(): Promise<Garage> {
        return this.http.get(this.baseUrl + this.garageDoorStateUrl).toPromise()
            .then(this.extractData);
    }

    toggleWidget(widget: Widget) {
        var url = this.baseUrl + widget.name + '/toggle';
        this.http.post(url, "").toPromise()
            .then((message) => {
                console.log(message);
            })
            .catch((error) => {
                console.error(error);
            })
    } 

    private extractData(res: Response): Garage {
        let body = res.json();
        return body || {};
    }
}