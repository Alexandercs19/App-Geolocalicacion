import { Component, OnInit } from '@angular/core';
import { CoordInfor } from 'models/coord-info.module';
import { Marker } from 'models/marker.module';
import { MapControllerService } from '../services/map-controller.service';

declare var google;
@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  map = null;
  marker: Marker = null;
  coordInfo: CoordInfor = null;

  constructor(private mapController: MapControllerService) { }

  ngOnInit() {
    this.marker = this.mapController.getMarker();
    this.loadMap();
  }

  loadMap() {
    const mapEle: HTMLElement = document.getElementById('map');

    const myLatLng = {
      lat: this.marker.position.lat,
      lng: this.marker.position.lng
    };

    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 15
    });
  
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.addMarker(this.marker);
      mapEle.classList.add('show-map');
    });
  }

  addMarker(marker: Marker) {
    var mapMarker = new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title,
      disableDefaultUI: true
    });
    this.addInfoToMarker(marker, mapMarker);
    return mapMarker;
  }

  addInfoToMarker(marker: Marker, mapMarker: any) {
    this.mapController.getHttpData(marker).subscribe((coordData: any) => {
      this.coordInfo = {
        country: coordData.items[0].address.countryName,
        city: coordData.items[0].address.city,
        marker: marker
      };

      let infoWindowContent = `
      <div id="content" style="color: black;">
        <h2 id="firstHeading" class="firstHeading"> ${marker.title} </h2>
        <p>Pais: ${this.coordInfo.country} </p>
        <p>Ciudad: ${this.coordInfo.city} </p>
      </div>
      `;

      let infoWindow = new google.maps.InfoWindow({content: infoWindowContent});

      mapMarker.addListener('click', () => {
        infoWindow.open(this.map, mapMarker);
      });

    });
  }

}
