import { Injectable } from '@angular/core';
import { Garage, Widget } from './garage';

@Injectable()
export class MockGarageService {
    private widgets = {
        'door': true,
        'light': true,
    }

    getGarageDoorState(): Promise<Garage> {
        return Promise.resolve({
            isOpen: this.widgets.door,
            timestamp: new Date().toISOString(),
            isGarageLightSwitchOn: this.widgets.light
        });
    }

    toggleWidget(widget: Widget) {
        this.widgets[widget.name] = !this.widgets[widget.name];    
    }

    setupGarageStateEventSource(onGarageStateUpdated: (garage: Garage) => void) {
        setInterval(() => {
            onGarageStateUpdated({
                isOpen: this.widgets.door,
                timestamp: new Date().toISOString(),
                isGarageLightSwitchOn: this.widgets.light
            })
        }, 5000);
    }
}