import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Garage } from './garage';

@Injectable()
export class GarageService {

    private garageDoorStateUrl = "http://raspberrypi.local:3000/v2/garage/state";

    constructor(private http: Http) {

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