import { Component, ViewChild, Directive } from '@angular/core';
import {NavController, NavParams, Select, Platform, AlertController, ToastController, IonicPage} from 'ionic-angular';
import { Nav } from 'ionic-angular';
import { AnnuaireServiceProvider } from '../../../providers/annuaire-service/annuaire-service';
import {HomeServiceProvider} from '../../../providers/home-service/home-service';
import { FavorisServiceProvider } from '../../../providers/favoris-service/favoris-service';
import { SqliteServiceProvider } from '../../../providers/sqlite-service/sqlite-service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as $ from 'jquery';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-annuaire',
  templateUrl: 'annuaire.html'
})
@Directive({
  selector: '[longPress]'
})
export class AnnuairePage {
  @ViewChild(Nav) nav: NavController;
  @ViewChild(Select) select: Select;
  @ViewChild('SelectFav') monSelectFav: Select;

  fav: any = "Tous les centres d'interet";
  nbPlaces: number = 0;
  grid: any = [];
  id_user: number = 0;
  ent_selected : number = 1;

  places: any;
  _places: any = [];
  lvl1: any = [];
  lvl2: any = [];
  tw: any = [];

  listFavoris: any;

  type_display: boolean = true;
  type: string = 'hexagon';
  all: boolean = true;

  flag: boolean = false;
  favoris: any;

  diamonds: any = [];
  id_list_fav: number;

  filter_name: string = "";

  tab_n1: boolean = false;
  tab_n2: boolean = false;
  tab_tw: boolean = false;

  timeout: any = null;
  search: string = "";
  load: boolean = true;
  all_tw: any = [];

  constructor(public navCtrl: NavController, private storage: Storage, public navParams: NavParams,
              public annuaire: AnnuaireServiceProvider, public sqlite: SqliteServiceProvider, public alertCtrl:AlertController,
              public homeSrv:HomeServiceProvider, public Sqlite: SQLite, public http: HTTP, public platform: Platform,
              public favorisSrv:FavorisServiceProvider, public toastCtrl: ToastController) {

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
    $('page-annuaire ion-content').css('top','0px');
  }

  //Get le user connecté
  public getUser(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {})
      .then(res => {
        this.id_user = res.rows.item(0).id_user;
        this.homeSrv.getHasRight(this.id_user,24).subscribe(data =>{
          if(!data){
            let toast = this.toastCtrl.create({
              message: "Vous n'avez pas les droits d'accès à cette fonctionnalité.",
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
            this.navCtrl.setRoot('home-home',{});
          }
        });
        this.Sqlite.create({
          name: 'ionicdb.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM ent_selected', {})
            .then(result => {
              if (result.rows.length != 0) {
                this.ent_selected = result.rows.item(0).id_ent;
                //this.getEnt(this.ent_selected);
                this.getService(this.id_user);
              }
            });
        });
        /************************/
        /****** A DEPLACER ******/
        /************************/
        this.load = false;
      });
    });
  }

  private getService(id_user){
    $('page-annuaire ion-content').css('top','150px');
    this.annuaire.getService(id_user).subscribe(data => {
        if(data.length > 1){
            this.getLvl2List();
            this.getTWList();
            this.tab_n1 = true;
            this.tab_n2 = true;
            this.tab_tw = true;
        } else {
            let id_service = data[0].loc_id;
            this.getLvl2ListService(id_service);
            this.getTWListService(id_service);
            this.tab_n1 = true;
            this.tab_n2 = true;
            this.tab_tw = true;
        }
    });
  }

  private getEnt(id_ent){
    this.annuaire.getEntreprise1(id_ent).subscribe(data => {
      $('page-annuaire ion-content').css('top','170px');
      if (data[0].niveau2 == 1) {
        this.getTWList();
        this.tab_n2 = true;
        this.tab_tw = true;
        $('.tw-list').show();
        $('page-annuaire ion-content').css('top','100px');
      } else if (data[0].niveau1 == 1) {
        this.getLvl2List();
        this.getTWList();
        this.tab_n2 = true;
        this.tab_n1 = true;
        this.tab_tw = true;
      } else if (data[0].client == 1) {
        //this.getLvl1List();
        this.getLvl2List();
        this.getTWList();
        this.tab_n2 = true;
        this.tab_n1 = true;
        this.tab_tw = true;
      }
    });
  };

  private getLvl1List(){
    this.annuaire.getLvl1List(this.ent_selected).subscribe(data =>{
      this.lvl1 = data;
    });
  }

  private getLvl2ListService(id_service){
      this.annuaire.getLvl2ListService(id_service).subscribe(data =>{
          this.lvl2 = data;
      });
  }


  private getLvl2List(){
    this.annuaire.getLvl2List(this.ent_selected).subscribe(data =>{
      this.lvl2 = data;
    });
  }

  private getTWListService(id_service){
    this.annuaire.getTWListService(id_service).subscribe(data =>{
      this.tw = data;
      this.all_tw = data;
    });
  }

  private getTWList(){
    this.annuaire.getTWList(this.ent_selected).subscribe(data =>{
      this.tw = data;
      this.all_tw = data;
    });
  }

  public displayList(param){
    $('.tabs').removeClass('active');
    $('.tabs-list').hide();
    $('.'+param).addClass('active');
    $('.'+param+'-list').show();
  }

  //Retour sur la home
  public goBack() {
    this.navCtrl.setRoot('home-home');
  }

  public goToPlace(loc_id){
    this.navCtrl.setRoot('DetailEntreprisePage', {
      param: loc_id,
      origin: 'annuaire'
    });
  }

  public goToTW(tw, index){
    this.navCtrl.setRoot('place-detail', {
      param: tw,
      idCat: 'annuaire',
      prov: 'annuaire',
      image: this.tw[index].image
    });
  }

  public addTile(loc_id){

    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM home_diamond WHERE user_id = ? AND ent_diamond = ?', [this.id_user, this.ent_selected])
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
            this.sqlite.saveDiamond(0,0,link, icon, title, idBox, id_line, id_bdd, on_click, color, on_drag, on_drop, on_drag_success, on_drop_success,this.ent_selected,this.id_user);
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

  public searchTW(){
    clearTimeout(this.timeout);
    if(this.search != ""){
      var self = this;
      var search = this.search.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      this.timeout = setTimeout(function () {
        self.load = true;
        let curr_list = self.all_tw;
        self.tw = [];
        for(var i = 0; i < curr_list.length; i++){
          var name = (curr_list[i].nom+" "+curr_list[i].prenom).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          if(name.indexOf(search) !== -1){
            self.tw.push(curr_list[i]);
          }
        }
        self.load = false;
      }, 500);
    }else{
      this.tw = this.all_tw;
    }
  }

}
