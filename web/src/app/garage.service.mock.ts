import { Injectable } from '@angular/core';
import { Garage } from './garage';

@Injectable()
export class MockGarageService {
    private isOpen = true;

    getGarageDoorState(): Promise<Garage> {
        return Promise.resolve({
            isOpen: true,
            timestamp: new Date().toISOString()
        });
    }

    setupGarageStateEventSource(onGarageStateUpdated: (garage: Garage) => void) {        
        setInterval(() => {
            onGarageStateUpdated({
                isOpen: this.isOpen,
                timestamp: new Date().toISOString()
            })
        }, 5000);
    }
}