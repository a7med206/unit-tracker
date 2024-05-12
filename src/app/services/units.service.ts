import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IconOptions, Marker, icon } from 'leaflet';
import { Observable } from 'rxjs';
import { Unit } from '../models/unit';

@Injectable({
  providedIn: 'root'
})
export class UnitsService {

  constructor(private http: HttpClient) { }


  getUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>('assets/units.json');
  }


  saveUnit(key: string, value: Marker, index: number): Unit {
    const iconUrl = value?.options?.icon?.options.iconUrl;
    const unit: Unit = {
      id: key,
      lat: value.getLatLng().lat,
      lng: value.getLatLng().lng,
      name: `Unit ${index + 1}`,
      iconUrl: iconUrl ? iconUrl : 'assets/map-pin.svg',
      selected: true,
    };
    return unit;
  }



  addMarker(unit: Unit): Marker {
    let lat = unit.lat;
    let lng = unit.lng;
    const newIcon = this.setFilteredIcon(unit.selected, unit.iconUrl);
    const newLayer = new Marker([lat, lng], {
      icon: icon(newIcon),
      opacity: unit.selected ? 1 : 0.7,
    });
    newLayer.bindTooltip(`
      <div>
      <strong>${unit.name}</strong><br>
      id: ${unit.id} <br>
        <span>Latitude: ${unit.lat}</span><br>
        <span>Longitude: ${unit.lng}</span>
      </div>
    `);
    return newLayer;
  }


  applySearchFilter(unit: Unit, searchValue: string, marker: any): Unit {
    if (this.isUnitMatch(unit, searchValue)) {
      unit.selected = true;
      marker.setIcon(icon(this.setFilteredIcon(true, unit.iconUrl)));
      marker.setOpacity(1);
    } else {
      unit.selected = false;
      this.resetMarkerIconAndOpacity(unit, marker);
    }
    return unit;
  }


  resetMarkerIconAndOpacity(unit: Unit, marker: any): Unit {
    unit.selected = false;
    if (marker) {
      marker.setIcon(icon(this.setFilteredIcon(false, unit.iconUrl)));
      marker.setOpacity(0.7);
    }
    return unit;
  }



  setFilteredIcon(selected: boolean = false, iconUrl?: string): IconOptions {
    const colors = ['green', 'yellow', 'red', 'purple', 'blue', 'orange', 'pink'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newIconUrl = `http://maps.google.com/mapfiles/ms/icons/${randomColor}-dot.png`;
    return {
      iconSize: selected ? [50, 82] : [25, 41],
      iconAnchor: selected ? [26, 82] : [13, 41],
      iconUrl: iconUrl ? iconUrl : newIconUrl,
    };
  }

  isUnitMatch(unit: Unit, searchValue: string): boolean {
    const lowerCaseSearchValue = searchValue.toLowerCase();
    return (
      unit.name.toLowerCase().includes(lowerCaseSearchValue) ||
      unit.id.toLowerCase().includes(lowerCaseSearchValue) ||
      unit.lat.toString().includes(searchValue) ||
      unit.lng.toString().includes(searchValue)
    );
  }


  generateRandomOffset(): number {
    return Math.random() * (0.001 - -0.001) + -0.001;
  }


  updateUnitPosition(unit: Unit, marker: any): void {
    const newLat = unit.lat + this.generateRandomOffset();
    const newLng = unit.lng + this.generateRandomOffset();
    unit.lat = newLat;
    unit.lng = newLng;
    marker.setLatLng([newLat, newLng]);
  }
}
