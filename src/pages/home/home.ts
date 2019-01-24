import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import {enableProdMode} from '@angular/core';
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
const CAMERA_DEFAULT_LAT = 47.497912;
const CAMERA_DEFAULT_LONG = 19.040235;
const CAMERA_DEFAULT_ZOOMLEVEL = 8;


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
  // private devLat;
  // private devLng;
  
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
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyBweCJqV46YsLWa-LtLUFfDcDmvsl8aFxs',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyBweCJqV46YsLWa-LtLUFfDcDmvsl8aFxs'
    });
    let mapOptions: GoogleMapOptions = {
      // camera: {
      //    target: {
      //      lat: 43.0741904,
      //      lng: -89.3809802
      //    },
      //    zoom: 10,
      //    tilt: 0,
      //  },
      // disableDoubleClickZoom: true,
      // draggable: false,
      // scrollwheel: false,
      // panControl: false,
      // controls : {
      //   compass : true,
      //   myLocationButton : true,
      //   myLocation: true,
      //   indoorPicker : false,
      //   zoom : false,
      //   mapToolbar : false
      // },

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
        zoom: CAMERA_DEFAULT_ZOOMLEVEL
      },
      preferences: {
        building: true
      }
    };

    this.map = GoogleMaps.create('map', mapOptions);

    this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(
      (data) => {
          console.log("Click MAP on",data);
          var myLatLng = {lat: data[0].lat, lng: data[0].lng};
          this.points.push(myLatLng);
          let marker: Marker = this.map.addMarkerSync({
            title: '@ionic-native/google-maps plugin!',
            snippet: 'This plugin is awesome!',
            position: myLatLng,
            animation: GoogleMapsAnimation.BOUNCE
          });
        
          console.log("finding data lat", data[0].lat);
          console.log("finding data lng", data[0].lng);
       
      }
    );
  }

  addPolly(){
            // Construct the polygon.
            this.map.addPolygon({
              'points': this.points,
              'strokeColor': "blue",
              // 'holes': this.drawCircle(loc,10,-1), //when adding this I lose the overlay and the hole is not drawn. When I remove it, it starts to work again but without a hole.
              'strokeWidth': 4,
              // 'fillColor': "#222222"
            });
  }

  clearMap(){
    this.points = new Array();
    this.map.clear();
    // this.map.off();
    // this.map.of
  }
  

  addInfoWindow(marker, content){
 
  let infoWindow = new google.maps.InfoWindow({
    content: content
  });
 
  google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
  });
}
}