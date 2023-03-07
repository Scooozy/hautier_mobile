import { Component, ViewChild,Directive } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import { Nav } from 'ionic-angular';
import { AnnuaireServiceProvider } from '../../../providers/annuaire-service/annuaire-service';
import { SqliteServiceProvider } from '../../../providers/sqlite-service/sqlite-service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as $ from 'jquery';
import { FavorisServiceProvider } from '../../../providers/favoris-service/favoris-service';

@IonicPage()
@Component({
  selector: 'page-listEntreprises',
  templateUrl: 'listEntreprises.html'
})
@Directive({
  selector: '[longPress]'
})
export class ListEntreprisesPage {
  @ViewChild(Nav) nav: NavController;
  grid: any = [];
  showFil: boolean = false;

  places : any;
  nbPlaces : number;
  token : string;
  marker1 : any;
  template : string;
  content : any;
  categ : any;
  placeFilter : any;
  idCategorie : any = this.navParams.get('param');
  diamond : string;
  diamonds: any = [];
  id_user: number;
  flag: boolean = false;
  fav:any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public annuaire: AnnuaireServiceProvider,
    public sqlite: SqliteServiceProvider, public Sqlite: SQLite, public favorisSrv:FavorisServiceProvider) {

    this.getPlaces();
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

  getPlaces(){
    this.annuaire.getEntreprises().subscribe(data => {
      this.places = data;
      this.places.sort(function(a,b) {return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0);} );
      this.nbPlaces = data.length;
      if(this.nbPlaces == 0){
        $('#place-none-info').css('display','block');
      }else if(this.nbPlaces == 1){
        this.generateFullGrid();
        this.savePlace(this.places[0].id);
      }else{
        this.generateFullGrid();
        var self = this;
        var load = setInterval(function(){
          if($('.hexa')!=undefined && $('.hexa').length >0) {
            for (let i = 0; i < self.places.length; i++) {
              if (self.places[i].image != "") {
                $('#hexagon_' + self.places[i].loc_id + ' .hex1 .hex2 img').attr("src", "https://hautier.teamsmart.fr/images/jevents/jevlocations/" + self.places[i].image);
              } else {
                $('#person-' + self.places[i].loc_id).css("display", "block");
                $('#' + i).css('margin-top', '0px');
              }

              if($('#'+i).text().length >= 35){
                $('#'+i).css('font-size','8px');
              }else if($('#'+i).text().length >= 31){
                $('#'+i).css('font-size','9px');
              }else if($('#'+i).text().length >= 27){
                $('#'+i).css('font-size','10px');
              }else if($('#'+i).text().length >= 17){
                $('#'+i).css('font-size','11px');
              }else if($('#'+i).text().length >= 10 && $('#'+i).text().trim().indexOf(' ') == -1){
                $('#'+i).css('font-size','9px');
              }else if($('#'+i).text().length >= 6 && $('#'+i).text().trim().indexOf(' ') == -1 && $('#'+i).text() === $('#'+i).text().toUpperCase()){
                $('#'+i).css('font-size','9px');
              }
            }
            clearInterval(load);
          }
        },50);
        $('#loader, #load').hide();
      }
    });
  }

  public getUser(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {})
      .then(res => {
        this.id_user = res.rows.item(0).id_user;
      });
    });
  }

  public addFavoris(id_receiver){
    let param = [];
    param.push({
      id_user:this.id_user,
      id_ent: id_receiver,
      id_employe:0,
      is_entreprise: 1
    });
    this.favorisSrv.postUserFavoris(JSON.stringify(param)).then(response => {
      this.getFav(this.id_user);
    });


  }

  public pressed(id_tuile) {
    this.flag = true;
    this.getFav(this.id_user);
  }
  public released() {
  }

  public getFav(id_user){
    this.favorisSrv.getUserFavoris(id_user).subscribe(data =>{
      this.fav = data;

      for(let i=0; i<this.places.length;i++){
        $('.icon-hexa-star-'+this.places[i].loc_id).css('color', 'black');
        $('.icon-hexa-star-'+this.places[i].loc_id).addClass('icon-favori');
        $('.icon-hexa-star-'+this.places[i].loc_id).removeClass('icon-favoris-plein');
      }

      for(let i = 0; i< this.fav.length; i++){
        if(this.fav[i].id_ent != 0){
          $('.icon-hexa-star-'+this.fav[i].id_ent).css('color', '#fce300');
          $('.icon-hexa-star-'+this.fav[i].id_ent).removeClass('icon-favori');
          $('.icon-hexa-star-'+this.fav[i].id_ent).addClass('icon-favoris-plein');
        }
      }
    });
  }

  public backToFormualaire(){
    this.flag = false;
  }

  public goBack() {
    this.navCtrl.setRoot('home-home');
  }

  // Génère la grille avec seulement des tuiles vides
  generateFullGrid() {
    var nb_tiles = this.nbPlaces;
    var ko = 0;
    var ko_if = ko;
    var line = '';
    for (var i = 0; i < nb_tiles; i++) {
      if(this.places[i].entreprise == 1){
        if (ko == 2 || ko == ko_if + 4) {
          line = "ko";
          ko_if = ko;
          ko++;
        } else {
          line = "ok";
          ko++;
        }
        var diamond = 'empty_diamond';
        var clic = this.places[i].loc_id;
        var title = this.places[i].title;
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
          dragsuccess: ""
        });
      }


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

    $('#load, #loader').hide();
  }


  public savePlace(id){
    var self = this;
    this.navCtrl.setRoot('DetailEntreprisePage', {
      param: id,
      id_categorie: this.idCategorie,
      origin: 'liste'
    });
  }
}
