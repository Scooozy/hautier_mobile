import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { Nav } from 'ionic-angular';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import * as $ from 'jquery';
import leaflet from 'leaflet';
import { AlertController } from 'ionic-angular';
import { ContactServiceProvider } from "../../../providers/contact-service/contact-service";

@IonicPage()
@Component({
  selector: 'page-detailsig-contact',
  templateUrl: 'detailsig.html'
})

export class DetailsigContactPage {
  @ViewChild(Nav) nav: NavController;
  userContact: number;
  user: any;
  prenoms: string;
  name: string;
  details: any;
  map: any;
  sujet: string;
  publication: string;
  icon_trait: string;
  txt_trait: string;
  description: string;

  constructor(public navCtrl: NavController, public Sqlite: SQLite, public contactSrv: ContactServiceProvider,
              public alertCtrl: AlertController, public navPrams: NavParams) {
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
    $(".myBackArrow").off();
  }

  public goBack(){
    this.navCtrl.setRoot('SignalementsContactPage',{});
  }

  public getUser(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {})
        .then(res => {
          this.userContact = res.rows.item(0).id_user;
          this.getSignalement(this.navPrams.get('param'));
          $('#triangle-bottomright').css('border-left',$('#sign-details-map').width()+'px solid transparent');
        });
    });
  }

  // Création de la carte à afficher sur la page
  public createMap = function() {
    var x = parseFloat("46.160329");
    var y = parseFloat("-1.151139");
    var token = "sk.eyJ1Ijoib2FsZXhnZyIsImEiOiJjaXljcXpxYzYwMDloMnFsd2lsdW5zOHBiIn0.b3kAsiwvjwY1YyMIMh8Whw";
    //var sec = 0;
    //Creation of the map, assigned to the div mapHome
    this.map = leaflet.map('sign-details-map').setView([x, y], 14);
    //Create the TileLayer is obligatory in Leaflet(the maps api we are using), witout the tile the map will not be shown
    leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 20,
      id: 'mapbox.streets',
      accessToken: token
    }).addTo(this.map);
    this.details.location = this.details.location.replace("(","");
    this.details.location = this.details.location.replace(")","");
    var latLng = this.details.location.split(',');
    this.showMarkers(latLng[0], latLng[1], this.details.categorie);
  };

  public getSignalement(id){
    this.contactSrv.getSignalement(id).subscribe( data => {
      this.details = data[0];
      this.sujet = this.details.title;
      this.description = this.details.description;
      this.publication = this.details.date;
      if(this.details.img != ''){
        var url = "https://hautier.teamsmart.fr/images/signalements/";
        $('#img-detail-sign').attr("src",url+""+this.details.img);
      }
      this.getInfoUser(this.details.user_id);
      this.createMap();
    });
  }

  // Affichage du marker sur la carte
  public showMarkers(lat, long, cat) {
    // Affichage de la bulle du marker avec le nom, et l'adresse de l'élément de l'annuaire
    let markerGroup = leaflet.featureGroup();
    let popupLink='<p>'+this.details.sujet+'</p>';
    let marker1 = leaflet.marker([parseFloat(lat), parseFloat(long)])
      .addTo(this.map);
    markerGroup.addLayer(marker1);
    this.map.addLayer(markerGroup);
    this.map.panTo(new leaflet.LatLng(parseFloat(lat), parseFloat(long)));
  };

  public getInfoUser(id){
    this.contactSrv.getInfoUser(id).subscribe(data => {
      this.user = data;
      this.user = this.user[0];
      this.prenoms = this.user.prenoms;
      this.name = this.user.name;
      if(this.user.image != ""){
        var url = "https://hautier.teamsmart.fr/images/entreprise/profils/";
        $('#img-user-sign').attr("src",url+""+this.user.image);
      }else{
        $('#img-user-sign-none').css('display','inline-block');
        $('#img-user-sign-box').css('display','none');
      }
      $('#loader, #load').hide();
    })
  }

  public backToSuggs(){
    this.navCtrl.setRoot('SignalementsContactPage',{});
  }

}
