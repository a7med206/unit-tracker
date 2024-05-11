import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home.component';
import { UnitsListComponent } from './units-list/units-list.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    LeafletModule,
    NgbModule,
    NgbPopoverModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomeComponent,
    UnitsListComponent

  ]
})
export class HomeModule { }
