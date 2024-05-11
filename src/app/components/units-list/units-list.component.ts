import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Unit } from '../../models/unit';

@Component({
  selector: 'app-units-list',
  templateUrl: './units-list.component.html',
  styleUrls: ['./units-list.component.scss'],
  providers: [NgbDropdownConfig]
})
export class UnitsListComponent implements OnInit {
  @Input() items?: Unit[] | null = [];
  @ViewChild('p') popOver: any;
  units: Unit[] | null = [];

  selectedItems: any[] = [];
  constructor(config: NgbDropdownConfig) {
    config.placement = 'bottom-start';
    config.autoClose = false;

  }

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    this.popOver.open();
  }

  onScroll(e: Event) {
    e.stopPropagation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // filter items to get only units that's been added to the map
    if (this.items) {
      this.units = this.items?.filter((item) => item.selected);
      if (this.units.length === 0) this.units = this.items;
    }

  }

}
