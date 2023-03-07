import { Component, ViewChild, Directive } from '@angular/core';
import {NavController, NavParams, Select, Platform, MenuController, ToastController, IonicPage} from 'ionic-angular';
import { Nav } from 'ionic-angular';
import { AnnuaireServiceProvider } from '../../../providers/annuaire-service/annuaire-service';
import { ContactServiceProvider } from '../../../providers/contact-service/contact-service';
import { SqliteServiceProvider } from '../../../providers/sqlite-service/sqlite-service';
import { FavorisServiceProvider } from '../../../providers/favoris-service/favoris-service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as $ from 'jquery';
import { HTTP } from '@ionic-native/http';
import {Vibration} from '@ionic-native/vibration';

@IonicPage({
  name : 'place-formulaire',
  segment : 'place-formulaire'
})
@Component({
  selector: 'page-formulaire',
  templateUrl: 'formulaire.html'
})
@Directive({
  selector: '[longPress]'
})
export class FormulairePage {
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public Sqlite: SQLite,
              public annuaire: AnnuaireServiceProvider, public sqlite: SqliteServiceProvider, public platform: Platform,
              public vibration:Vibration,public contactSrv:ContactServiceProvider ,public menu: MenuController,
              public favorisSrv:FavorisServiceProvider, public http: HTTP, public toastCtrl: ToastController) {

    this.grid = [];
    this.showFil = false;

    this.idCategorie = this.navParams.get('param');
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

  ionViewDidLoad(){
    this.inCat  =  $("#select-categ").val();
    if(this.idCategorie == "team"){
      $('.titre h2').html('Ma team');
    }else if(this.idCategorie == 'partenaire'){
      $('.titre h2').html('Annuaire des partenaires');
    }
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
      db.executeSql('SELECT * FROM connectContact', {})
      .then(res => {
        this.id_user = res.rows.item(0).id_user;
        this.senderTitle = res.rows.item(0).prenom+" "+res.rows.item(0).nom;
        this.Sqlite.create({
          name: 'ionicdb.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM ent_selected', {})
            .then(result => {
              if (result.rows.length != 0) {
                this.ent_select = result.rows.item(0).id_ent;
                this.getLvl1List();
              }
            });
        });
      });
    });
  }

  private getLvl1List(){
    this.annuaire.getLvl1List(this.ent_select).subscribe(data =>{
      this.places = data;
      $('#load, #loader').hide();
    });
  }

  public goBack() {
    this.navCtrl.setRoot('CategoriesPage');
  }

  public addTile(loc_id){

    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM home_diamond WHERE user_id = ? AND ent_diamond = ?', [this.id_user, this.ent_select])
        .then(res => {
          this.diamonds = [];
          var inspect = true;
          for (var i = 0; i < res.rows.length; i++) {
            if(res.rows.item(i).on_click == 'detail_ent,'+loc_id){
              inspect = false;
            }
            this.diamonds.push({
              id : res.rows.item(i).id
            })

          }
          if(inspect){
            var len = this.diamonds.length;
            var title = '';
            var icon = '';
            var idBox = "box" + len;
            var ko = 0;
            var ko_if = ko;
            var addition = 2;
            var line;
            if (len == 0) {
              line = "ok";
            } else {
              for (i = 0; i <= len; i++) {
                if (ko == 2 || ko == ko_if + addition) {
                  line = "ko";
                  ko_if = ko;
                  ko++;
                  addition = 4;
                } else {
                  line = "ok";
                  ko++;
                }
              }
            }
            var color = 'hexa-gris';
            var id_line = line;
            var id_bdd = loc_id;
            var on_click = 'detail_ent,'+loc_id;
            var on_drag = "true";
            var on_drop = "true";
            var on_drag_success = "onDragComplete($data,$event)";
            var len1 = len + 1;
            var on_drop_success = "onDropCompleteRemove($data,$event," + len1 + ")";
            var link = "placeDetails";
            this.sqlite.saveDiamond(0,0,link, icon, title, idBox, id_line, id_bdd, on_click, color, on_drag, on_drop, on_drag_success, on_drop_success,this.ent_select,this.id_user);
            this.navCtrl.setRoot('home-home', {});
          }else{
            let toast = this.toastCtrl.create({
              message: "L'élément sélectionné existe déjà sur la page d'accueil",
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
          }
        });
    });
  }

}
