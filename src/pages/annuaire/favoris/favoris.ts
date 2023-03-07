import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Select, Platform, IonicPage } from 'ionic-angular';
import { Nav } from 'ionic-angular';
import { AnnuaireServiceProvider } from '../../../providers/annuaire-service/annuaire-service';
import { FavorisServiceProvider } from '../../../providers/favoris-service/favoris-service';
import { SqliteServiceProvider } from '../../../providers/sqlite-service/sqlite-service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as $ from 'jquery';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-annuaire-favoris',
  templateUrl: 'favoris.html'
})
export class AnnuaireFavorisPage {
  @ViewChild(Nav) nav: NavController;
  @ViewChild('Select') monSelectCat: Select;

  fav: any;
  favData: any = [];
  nbPlaces: number = 0;
  grid: any = [];
  id_user: number = 0;

  inCat: any;
  cat:string;

  constructor(public navCtrl: NavController, private storage: Storage, public navParams: NavParams, public annuaire: AnnuaireServiceProvider,
    public sqlite: SqliteServiceProvider, public Sqlite: SQLite, public http: HTTP, public platform: Platform, public favorisSrv:FavorisServiceProvider) {
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
      db.executeSql('SELECT * FROM connectContact', {})
      .then(res => {
        this.id_user = res.rows.item(0).id_user;
        this.getFav(this.id_user);
      });
    });
  }

  public getFav(id_user){
    this.favorisSrv.getUserFavoris(id_user).subscribe(data =>{
      this.fav = data;
      this.nbPlaces = data.length;
      for(let i = 0; i< this.fav.length; i++){
        if(this.fav[i].id_employe != 0){
          this.annuaire.getEmployeById(this.fav[i].id_employe).subscribe(data2 =>{
            this.favData.push({
              id: data2[0].id,
              type: 'team',
              name: data2[0].prenom+" "+data2[0].nom,
              src: data2[0].image,
              is_entreprise: this.fav[i].is_entreprise
            });
          });
        }else if(this.fav[i].id_ent != 0){
          this.annuaire.getEntreprise1(this.fav[i].id_ent).subscribe(data2 =>{
            this.favData.push({
              id: data2[0].id,
              type: 'ent',
              name: data2[0].title,
              src: data2[0].image,
              is_entreprise: this.fav[i].is_entreprise
            });
          });
        }
      }
      var self = this;
      var load = setInterval(function(){
        if(self.favData != undefined)
        {
          if(self.favData.length == self.fav.length){
            self.generateFullGrid();
            clearInterval(load);
          }
        }
      },50);
    });
  }

  public generateFullGrid() {
    this.grid = [];
    var nb_tiles = this.nbPlaces;
    var ko = 0;
    var ko_if = ko;
    var line = '';
    for (var i = 0; i < nb_tiles; i++) {
      if (ko == 2 || ko == ko_if + 4) {
        line = "ko";
        ko_if = ko;
        ko++;
      } else {
        line = "ok";
        ko++;
      }
      var diamond = 'empty_diamond';
      var clic = this.favData[i].id;
      var title = this.favData[i].name;
      var type = this.favData[i].type;
      var is_entreprise = this.favData[i].is_entreprise
      var src = this.favData[i].src
      this.grid.push({
        id: "" + i,
        idBox: "box" + i,
        title: title,
        drag: "",
        drop: "",
        id_line: "" + line,
        clic: "" + clic,
        diamond: "" + diamond,
        dropsuccess: "",
        dragsuccess: "",
        type: type,
        is_entreprise: is_entreprise,
        src: src
      });
    }

    var id_line = 2;
    var id_line1 = 0;
    for (i = 0; i < this.grid.length; i++) {
      if (id_line == i) {
        this.grid[i].id_line = 'ko';
        id_line = id_line + 3;
      } else {
        this.grid[i].id_line = 'ok';
      }
      if (id_line1 == i) {
        this.grid[i].id_line = 'ok okl';
        id_line1 = id_line1 + 3;
      }
    }

    this.setImage();
    $('#load, #loader').hide();
  }

  //Ouvre le filtre
  public openFilter(){
    this.monSelectCat.open();
  }

  public setCat(){
    if(this.cat != "Toutes les catégories"){
      this.FilterCat(String(this.cat));
    }else{
      this.favData = [];
      this.getFav(this.id_user);
    }
    $("#filtre").css("display", "none");
    $("#accessFiltre").css("top", "13px");
  }

  private FilterCat(categorie){
      //get all fav
      this.favData = [];
      this.favorisSrv.getUserFavoris(this.id_user).subscribe(data =>{
        this.fav = data;
        this.nbPlaces = data.length;
        for(let i = 0; i< this.fav.length; i++){
          if(this.fav[i].id_employe != 0){
            this.annuaire.getEmployeById(this.fav[i].id_employe).subscribe(data2 =>{
              this.favData.push({
                id: data2[0].id,
                type: 'team',
                name: data2[0].prenom+" "+data2[0].nom,
                src: data2[0].image,
                is_entreprise: this.fav[i].is_entreprise
              });
            });
          }else if(this.fav[i].id_ent != 0){
            this.annuaire.getEntreprise1(this.fav[i].id_ent).subscribe(data2 =>{
              this.favData.push({
                id: data2[0].id,
                type: 'ent',
                name: data2[0].title,
                src: data2[0].image,
                is_entreprise: this.fav[i].is_entreprise
              });
            });
          }
        }

        var self = this;
        var load = setInterval(function(){
          if(self.favData != undefined)
          {
            if(self.favData.length == self.fav.length){
              //filtre data
              let buffer = [];
              for(let i = 0; i<self.favData.length; i++){
                if(self.favData[i].type == categorie){
                  buffer.push(self.favData[i]);
                }
              }
              self.favData = buffer;
              self.nbPlaces = self.favData.length;
              self.generateFullGrid();
              clearInterval(load);
            }
          }
        },50);
      });
    }

    public setImage(){
      let self = this;
      var load2 = setInterval(function(){
        if($('.hexa').length > 0 && $('.hexa') != undefined) {
          for (let i = 0; i < self.favData.length; i++) {
            if(self.favData[i].type == 'ent'){
              if(self.favData[i].src != ""){
                $('#hexagon_'+self.favData[i].id+' .hex1 .hex2 img').attr("src", 'https://hautier.teamsmart.fr/images/jevents/jevlocations/'+self.favData[i].src);
              }else{
                $('#person-'+self.favData[i].id).css("display","block");
                $('#'+i).css('margin-top','0px');
              }
            }else{
              if(self.favData[i].src != ""){
                $('#hexagon_'+self.favData[i].id+' .hex1 .hex2 img').attr("src", 'https://hautier.teamsmart.fr/images/entreprise/profils/'+self.favData[i].src);
              }else{
                $('#person-'+self.favData[i].id).css("display","block");
                $('#'+i).css('margin-top','0px');
              }
            }

          }
        }
        clearInterval(load2);
      },50);
    }


    public savePlace(id, type, src, is_entreprise){
      if(type == 'ent' && is_entreprise == 0){
        this.navCtrl.setRoot('place-detail', {
          param: id,
          idCat: 'partenaire',
          image: src,
          prov: 'fav'
        });
      }else if(type == 'ent' && is_entreprise == 1){
        this.navCtrl.setRoot('DetailEntreprisePage', {
          param: id,
          id_categorie: 0,
          origin: 'fav'
        });
      }else{
        this.navCtrl.setRoot('place-detail', {
          param: id,
          idCat: 'team',
          image: null,
          prov: 'fav'
        });
      }
    }
    public goBack() {
      this.navCtrl.setRoot('home-home');
    }

  }
