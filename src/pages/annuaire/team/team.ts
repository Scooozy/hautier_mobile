import { Component, ViewChild, Directive } from '@angular/core';
import { NavController, NavParams, Select, Platform, MenuController, IonicPage } from 'ionic-angular';
import { Nav } from 'ionic-angular';
import { AnnuaireServiceProvider } from '../../../providers/annuaire-service/annuaire-service';
import { ContactServiceProvider } from '../../../providers/contact-service/contact-service';
import { SqliteServiceProvider } from '../../../providers/sqlite-service/sqlite-service';
import { FavorisServiceProvider } from '../../../providers/favoris-service/favoris-service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as $ from 'jquery';
import { HTTP } from '@ionic-native/http';
import {Vibration} from '@ionic-native/vibration';

@IonicPage()
@Component({
  selector: 'page-team',
  templateUrl: 'team.html'
})
@Directive({
  selector: '[longPress]'
})
export class TeamPage {
  @ViewChild(Nav) nav: NavController;
  @ViewChild('SelectCat') monSelectCat: Select;
  grid: any;
  showFil: boolean;

  places : any;
  nbPlaces : number;
  token : string;
  marker1 : any;
  template : string;
  content : any;
  categ : any;
  placeFilter : any;
  idCategorie : any;
  diamond : string;
  diamonds: any = [];
  id_user: number;
  inCat: string = "";
  senderTitle: string;

  ent:any;
  ent_select: any;
  ents:any;
  fsc:boolean;

  flag: boolean = false;
  fav: any= [];

  longpress: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public annuaire: AnnuaireServiceProvider,
    public sqlite: SqliteServiceProvider,public favorisSrv:FavorisServiceProvider, public vibration:Vibration,public contactSrv:ContactServiceProvider ,public menu: MenuController, public Sqlite: SQLite, public http: HTTP, public platform: Platform) {

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

  public getUser(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', [])
      .then(res => {
        this.id_user = res.rows.item(0).id_user;
        this.senderTitle = res.rows.item(0).prenom+" "+res.rows.item(0).nom;
        this.Sqlite.create({
          name: 'ionicdb.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM ent_selected', [])
            .then(result => {
              if (result.rows.length != 0) {
                this.ent_select = result.rows.item(0).id_ent;
                this.getEntreprise(this.id_user);
              }
            });
        });
      });
    });
  }

  public goToTW(tw, index){
    console.log(tw);
    this.navCtrl.setRoot('place-detail', {
      param: tw,
      idCat: 'annuaire',
      prov: 'team',
      image: this.places[index].image
    });
  }

  private getTeam(id_ent){
    this.annuaire.getTeam(id_ent).subscribe(data => {
      this.places = data;
      console.log('DATA',data);
      this.nbPlaces = data.length;
      if(this.nbPlaces != 0){
        this.places.sort(function(a,b) {return (a.prenom > b.nom) ? 1 : ((b.prenom > a.nom) ? -1 : 0);} );
      }
      $('#loader, #load').hide();
    });
  }

  getEntreprise(user){
    this.annuaire.getEntreprise(user).subscribe(data => {
      this.ent = data[0];
      this.getServices(this.ent.loc_id);
      this.getTeam(this.ent.loc_id);
    });
  }

  getServices(ent){
    this.annuaire.getServicesEnt(ent).subscribe(data => {
      this.categ = data;
    });
  }

  public goBack() {
    this.navCtrl.setRoot('home-home');
  }

  public backToFormualaire(){
    this.flag = false;
  }

}
