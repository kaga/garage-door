import { Injectable } from '@angular/core';
//import When = require('when'); 

@Injectable()
export class GarageService {
    getGarageDoorState() {
        return Promise.resolve({
            isOpen: true,
            lastUpdated: new Date()
        });     
    }
}