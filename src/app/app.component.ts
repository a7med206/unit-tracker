import {
  Component,
  ElementRef,
  ViewChild,
  computed,
  effect,
  signal,
} from '@angular/core';
import { Guid } from 'guid-typescript';
import { Marker, icon, latLng, tileLayer } from 'leaflet';
import {
  BehaviorSubject,
  Observable,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
} from 'rxjs';
import { Unit } from './models/unit';
import { UnitsService } from './services/units.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('search') searchInputRef!: ElementRef;
  searchInput$!: Observable<string>;
  title = 'unit-tracker';
  // Create a mapping between marker IDs and marker instances

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
    ],
    zoom: 15,
    // center is Cairo, Egypt
    center: latLng(30.049, 31.242),
  };
  // layersControl = {
  //   // baseLayers: {
  //   //   'Open Street Map': tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
  //   //   'Open Cycle Map': tileLayer('https://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { maxZoom: 23, attribution: '...' })
  //   // },
  //   // overlays: {
  //   //   'Big Circle': circle([30.0444, 31.2357], { radius: 5000 }),
  //   //   'Big Square': polygon([[31.2001, 29.9187], [29.9187, 31.2001], [29.9187, 31.7], [46.8, -121.7]])
  //   // }
  // };

  markerMap = signal<{ [id: string]: Marker }>({});
  // Declare a signal to store layers data
  layers = computed(() => Object.values(this.markerMap()));
  // units: Unit[] = [];
  units = new BehaviorSubject<Unit[]>([]);

  constructor(private unitsService: UnitsService) {
    effect(() => {
      this.units.next(
        Object.keys(this.markerMap()).map((key: string, index) => {
          console.log(key, this.markerMap()[key]);
          return this.unitsService.saveUnit(key, this.markerMap()[key], index);
        })
      );
    });
  }

  ngOnInit(): void {
    this.getUnits();
  }

  ngAfterViewInit(): void {
    const inputElement: HTMLInputElement = this.searchInputRef.nativeElement;
    const searchInput$: Observable<string> = fromEvent(
      inputElement,
      'input'
    ).pipe(
      map((event: Event) => (event.target as HTMLInputElement).value),
      // Apply a debounce time of 500ms
      debounceTime(750),
      // Ensure only distinct values are emitted
      distinctUntilChanged()
    );

    searchInput$.subscribe((searchValue: string) => {
      const newUnits =this.units.getValue().map((unit) => {
        const marker = this.markerMap()[unit.id];
        if (searchValue.trim()) {
          unit = this.unitsService.applySearchFilter(unit, searchValue, marker);
        } else {
          unit = this.unitsService.resetMarkerIconAndOpacity(unit, marker);
        }
        return unit;
      });
      this.units.next(newUnits);
    });
  }

  getUnits() {
    this.unitsService
      .getUnits()
    .pipe(map((data: any) => this.transformUnits(data)))
      .subscribe((data: any) => {
        data.forEach((unit: Unit) => this.addMarker(unit));
        this.updateUnitsLocation();
      });
    }

    updateUnitsLocation() {
    // Update units location every 2-5 seconds
    setInterval(() => {
      this.units.getValue().forEach((unit) => {
        const marker = this.markerMap()[unit.id];
        if (marker) this.unitsService.updateUnitPosition(unit, marker);
      });
    }, Math.floor(Math.random() * (5000 - 2000) + 2000));
  }

  transformUnits(data: any[]): Unit[] {
    return data.map((unit: any) => ({
      ...unit,
      id: Guid.create().toString(),
      selected: false,
    }));
  }

  addMarker(unit: Unit) {
    const newLayer = this.unitsService.addMarker(unit);
    this.markerMap.update((values) => {
      return { ...values, [unit.id]: newLayer };
    });
  }


}
