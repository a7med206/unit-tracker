import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  computed,
  effect,
  signal,
} from '@angular/core';
import { Guid } from 'guid-typescript';
import { Marker, latLng, tileLayer } from 'leaflet';
import {
  BehaviorSubject,
  Observable,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
} from 'rxjs';
import { Unit } from '../models/unit';
import { UnitsService } from '../services/units.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('search') searchInputRef!: ElementRef;
  searchInput$!: Observable<string>;
  title = 'unit-tracker';
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
    ],
    zoom: 15,
    center: latLng(30.049, 31.242),
  };

  markerMap = signal<{ [id: string]: Marker }>({});
  layers = computed(() => Object.values(this.markerMap()));
  units = new BehaviorSubject<Unit[]>([]);

  constructor(private unitsService: UnitsService) {
    effect(() => {
      this.units.next(
        Object.keys(this.markerMap()).map((key: string, index) => {
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
      // Apply a debounce time of 750ms
      debounceTime(750),
      // Ensure only distinct values are emitted
      distinctUntilChanged()
    );

    searchInput$.subscribe((searchValue: string) => {
      const newUnits = this.units.getValue().map((unit) => {
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
