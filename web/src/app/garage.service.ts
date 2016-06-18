import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Garage } from './garage';

@Injectable()
export class GarageService {

    private garageStateEventSource;
    private garageDoorStateUrl = "http://raspberrypi.local:3000/v2/garage/state";

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
        return this.http.get(this.garageDoorStateUrl).toPromise()
            .then(this.extractData);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}