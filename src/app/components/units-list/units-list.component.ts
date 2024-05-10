import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-units-list',
  templateUrl: './units-list.component.html',
  styleUrls: ['./units-list.component.scss'],
  providers: [NgbDropdownConfig]
})
export class UnitsListComponent implements OnInit {
  @Input() items: any[] = [];
  unites: any[] = [];

  selectedItems: any[] = [];
  constructor(config: NgbDropdownConfig) {
    config.placement = 'bottom-start';
    config.autoClose = false;
  }

  selectItem(e: Event, item: any) {
    e.stopPropagation();
    e.preventDefault();
    item.selected = !item.selected;
    if (item.selected) this.selectedItems.push(item);
    else this.selectedItems = this.selectedItems.filter(selectedItem => selectedItem.id !== item.id);
  }

  ngOnInit(): void {

  }

  onScroll(e: Event) {
    e.stopPropagation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // filter items to get only units that's not in units array
    this.items.forEach(item => {
      const index = this.unites.findIndex(unit => unit.id === item.id);
      if (index === -1) this.unites.push({ ...item, selected: false });

    });

  }

}
