import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgbAlertModule, NgbModule, NgbPaginationModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UnitsListComponent } from './components/units-list/units-list.component';

@NgModule({
  declarations: [
    AppComponent,
    UnitsListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,
    NgbModule,
    NgbPaginationModule,
    NgbAlertModule,
    HttpClientModule,
    NgbPopoverModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
