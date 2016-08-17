import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Garage, Widget } from './garage';
import { environment } from './environment';

@Injectable()
export class GarageService {

    private garageStateEventSource;
    private baseUrl = "/v2/";
    private garageDoorStateUrl = "garage/state";

    constructor(private http: Http) {
        this.garageStateEventSource = new EventSource('/events/garage');
    }

    setupGarageStateEventSource(onGarageStateUpdated: (garage: Garage) => void) {
        this.garageStateEventSource.onmessage = (event) => {
            var garage  = JSON.parse(event.data);        
            onGarageStateUpdated(garage);
        };         
    }

    getGarageDoorState(): Promise<Garage> {
        return this.http.get(this.getHost() + this.baseUrl + this.garageDoorStateUrl).toPromise()
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

    private getHost(): string {
        let host = environment.apiHost;
        return host;
    }

    private extractData(res: Response): Garage {
        let body = res.json();
        return body || {};
    }
}