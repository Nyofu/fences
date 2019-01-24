import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController, Platform, LoadingController, ToastController } from 'ionic-angular';
import { google } from 'google-maps';
// import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation;
// import { Geolocation } from '@ionic-native/geolocation/';
// import { Geolocation } from 'ionic-native';
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
    private platform: Platform
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
        console.log("Click MAP on", data);
        var latlng = { lat: data[0].lat, lng: data[0].lng };
        this.points.push(latlng);
        let marker: Marker = this.map.addMarkerSync({
          title: '@ionic-native/google-maps plugin!',
          snippet: 'This plugin is awesome!',
          position: latlng,
          // animation: GoogleMapsAnimation.BOUNCE,

        });

        this.map.addPolyline({
          points: this.points,
          color: "orange",
          width: 2
        });




        console.log("finding data lat", data[0].lat);
        console.log("finding data lng", data[0].lng);

      }
    );
  }

  addPolly() {
    this.map.clear();
    // Construct the polygon.
    this.map.addPolygon({
      'points': this.points,
      'strokeColor': "blue",
      // 'holes': this.drawCircle(loc,10,-1), //when adding this I lose the overlay and the hole is not drawn. When I remove it, it starts to work again but without a hole.
      'strokeWidth': 4,
      'fillColor': "#222222"
    });
    this.points = new Array();
  }

  clearMap() {
    this.points = new Array();
    this.map.clear();
    // this.map.off();
    // this.map.of
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
    //   public boolean contains(Point test) {
    //     int i;
    //     int j;
    //     boolean result = false;
    //     for (i = 0, j = points.length - 1; i < points.length; j = i++) {
    //       if ((points[i].y > test.y) != (points[j].y > test.y) &&
    //           (test.x < (points[j].x - points[i].x) * (test.y - points[i].y) / (points[j].y-points[i].y) + points[i].x)) {
    //         result = !result;
    //        }
    //     }
    //     return result;
    //   }
    // }
  }


  holdMap(){

  }
}