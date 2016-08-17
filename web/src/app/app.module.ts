import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { AppComponent }   from './';

import {MdButtonModule} from '@angular2-material/button/button';
import {MdListModule} from '@angular2-material/list/list';
import {MdCardModule} from '@angular2-material/card/card';
import {MdIconModule} from '@angular2-material/icon/icon';
import {MdToolbarModule} from '@angular2-material/toolbar/toolbar';
import {MdRippleModule} from '@angular2-material/core/ripple/ripple';
import {PortalModule} from '@angular2-material/core/portal/portal-directives';
import {OverlayModule} from '@angular2-material/core/overlay/overlay-directives';
import {RtlModule} from '@angular2-material/core/rtl/dir';

import { HTTP_PROVIDERS } from '@angular/http';
import { GarageService } from './garage.service';

@NgModule({
  imports: [
    BrowserModule,
    MdButtonModule,
    MdCardModule,
    MdIconModule,
    MdListModule,
    MdRippleModule,
    MdToolbarModule,
    OverlayModule,
    PortalModule,
    RtlModule
  ],
  declarations: [AppComponent],
  entryComponents:    [AppComponent],
  providers: [HTTP_PROVIDERS, GarageService]
})

export class AppModule {
  constructor(private _appRef: ApplicationRef) { }

  ngDoBootstrap() {
    this._appRef.bootstrap(AppComponent);
  }
}