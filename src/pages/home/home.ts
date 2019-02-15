import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController, Platform, LoadingController, ToastController } from 'ionic-angular';
import { google } from 'google-maps';
// import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';

import {
  GoogleMaps,
  GoogleMap,
  Marker,
  LatLng,
  GoogleMapsEvent,
  Environment,
  GoogleMapsAnimation,
  GoogleMapOptions
} from '@ionic-native/google-maps';

declare var google;

const point = {
  url: './assets/marker/point.png',
  size: {
    width: 24,
    height: 24
  }
};

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit {

  @ViewChild('map') mapElement: ElementRef;
  private map: GoogleMap;
  start = 'chicago, il';
  end = 'chicago, il';
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  private points = new Array();
  inPoly: boolean = false;
  isTracking: boolean = false;
  canTrack: boolean = false;
  hasPoly: boolean = false;


  geoData: String = "Starting";



  // points = [
  //   {lat: 85,lng: 90},  
  //   {lat: 85,lng: 0.1}, 
  //   {lat: 85,lng: -90}, 
  //   {lat: 85,lng: -179.9}, 
  //   {lat: 0,lng: -179.9}, 
  //   {lat: -85,lng: -179.9}, 
  //   {lat: -85,lng: -90}, 
  //   {lat: -85,lng: 0.1}, 
  //   {lat: -85,lng: 90}, 
  //   {lat: -85,lng: 179.9},  
  //   {lat: 0,lng: 179.9},
  //   {lat: 85,lng: 179.9} ];



  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private geolocation: Geolocation,
    private vibration: Vibration
  ) { }

  async ngOnInit() {
    // Since ngOnInit() is executed before `deviceready` event,
    // you have to wait the event.
    await this.platform.ready();
    await this.initMap();
  }
  initMap() {
    // enableProdMode();
    Environment.setEnv({

    });
    let mapOptions: GoogleMapOptions = {
      mapType: "MAP_TYPE_NORMAL",
      controls: {
        compass: true,
        myLocation: true,
        myLocationButton: true,
        zoom: true
      },
      gestures: {
        scroll: true,
        tilt: false,
        rotate: false,
        zoom: true
      },
      camera: {
        target: {
          lat: 47.2529,
          lng: -122.4443
        },
        zoom: 8
      },
      preferences: {
        building: true
      }
    };

    this.map = GoogleMaps.create('map', mapOptions);

    var POINT_ICON = {
      path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
      fillColor: '#FF0000',
      fillOpacity: .6,
      anchor: new google.maps.Point(0, 0),
      strokeWeight: 0,
      scale: .2
    }


    this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(
      (data) => {

        if (!this.isTracking) {
          console.log("Click MAP on", data);
          var latlng = { lat: data[0].lat, lng: data[0].lng };
          this.points.push(latlng);

          let marker: Marker = this.map.addMarkerSync({
            title: '@ionic-native/google-maps plugin!',
            snippet: 'This plugin is awesome!',
            position: latlng,
            icon: {
              url: "assets/marker/point.png",
              size: { width: 8, height: 8 }
            }
            // animation: GoogleMapsAnimation.BOUNCE,

          });

          this.map.addPolyline({
            points: this.points,
            color: "orange",
            width: 2
          });

        }
      }
    );

  }

  addPolly() {
    this.map.clear();
    // Construct the polygon.
    // window.addEventListener('canTrack', (e) => {
    console.log('point list size', this.points.length);
    if (this.points.length < 3) {
      this.canTrack = false;
      return;
    }
    else {
      this.canTrack = true;
    }
    // }, false);
    this.map.addPolygon({
      'points': this.points,
      'strokeColor': "blue",
      // 'holes': this.drawCircle(loc,10,-1), //when adding this I lose the overlay and the hole is not drawn. When I remove it, it starts to work again but without a hole.
      'strokeWidth': 3,
      'fillColor': "#222222"
    });

    this.hasPoly = true;
  }

  clearMap() {
    this.points = new Array();
    this.map.clear();
    this.canTrack = false;
    this.inPoly = false;
    this.isTracking = false;
    this.hasPoly = false;

  }


  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  track() {
    window.addEventListener('isTracking', (e) => {
      console.log('switched to offline mode');
      this.isTracking = !this.isTracking;
    }, false);
    console.log("Is Tracking", this.isTracking);

    var x; //= 47.22863421095808;
    var y; //= -122.50879230247466;

    let GPSoptions = { enableHighAccuracy: true };
    let watch = this.geolocation.watchPosition(GPSoptions);

    watch.subscribe((data) => {
      x = data.coords.latitude;
      y = data.coords.longitude
      // console.log(data.coords.latitude +", " + data.coords.longitude);
      this.geoData = "lat: " + x + " | lng: " + y + "<br>";
      this.inPoly = false;
      console.log("in track poly size:", this.points.length);

      console.log("x|lat :" + x + "y|lng :" + y);
      for (var i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
        var xi = this.points[i].lat;
        var yi = this.points[i].lng;

        var xj = this.points[j].lat;
        var yj = this.points[j].lng;

        var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        console.log("inPoly:", this.inPoly);
        if (intersect) {
          this.inPoly = !this.inPoly;
          window.addEventListener('withinPoly', (e) => {
            console.log('in poly');
            this.inPoly;
          }, false);
        }
      }
    });
  }
}