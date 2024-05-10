import { Component, effect, signal } from '@angular/core';
import { Layer, icon, latLng, marker, tileLayer } from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'unit-tracker';
  markers: Layer[] = [];

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
    ],
    zoom: 10,
    // center is Cairo, Egypt
    center: latLng(30.0444, 31.2357)
  };
  layersControl = {
    // baseLayers: {
    //   'Open Street Map': tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
    //   'Open Cycle Map': tileLayer('https://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { maxZoom: 23, attribution: '...' })
    // },
    // overlays: {
    //   'Big Circle': circle([30.0444, 31.2357], { radius: 5000 }),
    //   'Big Square': polygon([[31.2001, 29.9187], [29.9187, 31.2001], [29.9187, 31.7], [46.8, -121.7]])
    // }
  };

  layers = signal<Layer[]>([]);

  units: any[] = []; // Declare an array to store unit data

  constructor() {
    effect(() => {
      this.units = this.layers().map((layer: any, index) => {
        return {
          id: index + 1,
          lat: layer.getLatLng().lat,
          lng: layer.getLatLng().lng,
          name: `Unit ${index + 1}`,
          iconUrl: 'assets/map-pin.svg'
        };
      });
    });
  }


  ngOnInit(): void {
    const interval = setInterval(() => {
      if (this.layers().length > 10) {
        clearInterval(interval);
        return;
      };
      this.addMarker();
    }, 1000);

  }

  addMarker() {
    let newLat = 30.0444 + 0.1 * (Math.random() - 1);
    let newLng = 31.2357 + 0.1 * (Math.random() - 1);
    newLat = Math.round(newLat * 1000) / 1000;
    newLng = Math.round(newLng * 1000) / 1000;
    const newMarker = marker(
      [newLat, newLng],
      {
        icon: icon({
          iconSize: [50, 82],
          iconAnchor: [13, 41],
          iconUrl: 'assets/map-pin.svg',
        })
      }
    );
    this.layers.update(values => {
      return [...values, newMarker];
    });
  }

  moveMarkers() {
  }
}
