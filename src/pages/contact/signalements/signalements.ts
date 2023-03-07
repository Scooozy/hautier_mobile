import { Component, ViewChild } from '@angular/core';
import {NavController, IonicPage, ToastController} from 'ionic-angular';
import { Nav } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as $ from 'jquery';
import leaflet from 'leaflet';
import { AlertController } from 'ionic-angular';
import { ContactServiceProvider } from "../../../providers/contact-service/contact-service";
import {HomeServiceProvider} from "../../../providers/home-service/home-service";

@IonicPage()
@Component({
  selector: 'page-signalements-contact',
  templateUrl: 'signalements.html'
})

export class SignalementsContactPage {
  @ViewChild(Nav) nav: NavController;
  userContact: number;
  ent_selected: number;
  user: any;
  name: string;
  prenoms: string;
  signalements: any;
  userReponses: any;
  map: any;
  markers: any = [];
  right_add: number = 0;
  right_mine: number = 0;
  right_others: number = 0;

  constructor(public navCtrl: NavController, public Sqlite: SQLite, public contactSrv: ContactServiceProvider,
              public alertCtrl: AlertController, private homeSrv: HomeServiceProvider, private toastCtrl: ToastController) {
    this.getUser();
  }

  ionViewWillEnter(){
    let self = this;
    //Add click on class myBackArrow
    $(function() {
      $(".myBackArrow").click(function() {
        self.goBack();
      });
    });
  }

  ionViewWillLeave(){
    //Remove all delegated click handlers
    $(".myBackArrow").off();
  }

  public goBack(){
    this.navCtrl.setRoot('home-home',{});
  }

  //Get le user connecté
  public getUser(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {})
        .then(res => {
          this.createMap();
          this.userContact = res.rows.item(0).id_user;
          this.homeSrv.getHasRight(this.userContact, 102).subscribe(data => {
            if(!data){
              let toast = this.toastCtrl.create({
                message: "Vous n'avez pas les droits d'accès à cette fonctionnalité.",
                duration: 3000,
                position: 'bottom'
              });
              toast.present();
              this.navCtrl.setRoot('home-home',{});
            }else{
              this.homeSrv.getHasRight(this.userContact, 70).subscribe(data => {
                this.right_add = data;
                this.homeSrv.getHasRight(this.userContact, 68).subscribe(data => {
                  this.right_others = data;
                  this.homeSrv.getHasRight(this.userContact, 69).subscribe(data => {
                    this.right_mine = data;
                    this.Sqlite.create({
                      name: 'ionicdb.db',
                      location: 'default'
                    }).then((db: SQLiteObject) => {
                      db.executeSql('SELECT * FROM ent_selected', {})
                        .then(result => {
                          if (result.rows.length != 0) {
                            this.ent_selected = result.rows.item(0).id_ent;
                            this.getSignalements();
                          }
                        });
                    });
                  });
                });
              });
            }
          });
        });
    });
  }

  // Création de la carte à afficher sur la page
  public createMap = function() {
    var x = parseFloat("46.1738756");
    var y = parseFloat("-1.2091831");
    var token = "sk.eyJ1Ijoib2FsZXhnZyIsImEiOiJjaXljcXpxYzYwMDloMnFsd2lsdW5zOHBiIn0.b3kAsiwvjwY1YyMIMh8Whw";
    //var sec = 0;
    //Creation of the map, assigned to the div mapHome
    this.map = leaflet.map('sign-map').setView([x, y], 14);
    //Create the TileLayer is obligatory in Leaflet(the maps api we are using), witout the tile the map will not be shown
    leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 20,
      id: 'mapbox.streets',
      accessToken: token
    }).addTo(this.map);

  };

  public getSignalements(){
    this.contactSrv.getUserSignalements(this.ent_selected,this.userContact).subscribe(data => {
      this.signalements = data;
      if(this.signalements.length != 0){
        $('#sign-list h5').css('display','none');
      }else{
        this.setOption(0);
      }
      for(var i = 0; i < this.signalements.length; i++){
        if(this.signalements[i].location != undefined && ((this.right_mine && this.userContact == this.signalements[i].user_id) || this.right_others)){
          this.signalements[i].location = this.signalements[i].location.replace("(","");
          this.signalements[i].location = this.signalements[i].location.replace(")","");
          if(this.signalements[i].description != undefined && this.signalements[i].description.length > 55){
            this.signalements[i].description = this.signalements[i].description.substring(0, 47) + '...';
          }
          var latlng = this.signalements[i].location.split(",");
          this.showMarkers(latlng[0],latlng[1],this.signalements[i].categorie, i);
        }
      }
    });
    $('#triangle-topleft').css('border-right',$('#sign-map').width()+'px solid transparent');
    $('#load, #loader').hide();
  }

  // Affichage du marker sur la carte
  public showMarkers(lat, long, cat, index) {
    // Affichage de la bulle du marker avec le nom, et l'adresse de l'élément de l'annuaire
    let markerGroup = leaflet.featureGroup();
    let popupLink='<p>'+this.signalements[index].sujet+'</p>';
    let marker1 = leaflet.marker([parseFloat(lat), parseFloat(long)])
      .addTo(this.map);
    this.markers[this.markers.length] = marker1;
    markerGroup.addLayer(marker1);
    this.map.addLayer(markerGroup);
    var group = new leaflet.featureGroup(this.markers);
    this.map.fitBounds(group.getBounds());
  };

  public setOption(option) {
    if(option == 1){
      $("#by-location").css("color","#007BC0");
      $("#by-list").css("color","lightgrey");
      $("#sign-map, #triangle-topleft").show();
      $("#sign-list").hide();
    }else{
      if(option == 0){
        $("#by-location").css("color","lightgrey");
        $("#by-list").css("color","#007BC0");
        $("#sign-map, #triangle-topleft").hide();
        $("#sign-list").show();
      }
    }
  };

  public signDetail(id){
    this.navCtrl.setRoot('DetailsigContactPage', {
      param : id
    })
  }

  public openForm(){
    this.navCtrl.setRoot('AddSignalementContactPage', {});
  }

}
