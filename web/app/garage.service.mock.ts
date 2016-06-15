import { Injectable } from '@angular/core';
import { Garage } from './garage';

@Injectable()
export class MockGarageService {

    getGarageDoorState(): Promise<Garage> {
        return Promise.resolve({
            isOpen: true,
            timestamp: new Date().toISOString()
        });
    }
}