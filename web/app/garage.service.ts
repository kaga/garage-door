import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

import { Garage } from './garage';

@Injectable()
export class GarageService {

    private garageDoorStateUrl = "http://raspberrypi.local:3000/v2/garage/state";

    constructor(private http: Http) {

    }

    getGarageDoorState() {
        return this.http.get(this.garageDoorStateUrl)

                //.map(this.extractData);
            
        /*return Promise.resolve({
            isOpen: false,
            lastUpdated: new Date()
        });*/
    }

    private extractData(res: Response) {
        let body = res.json();
        return body.data || {};
    }
}