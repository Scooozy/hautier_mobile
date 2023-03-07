import { Component, ViewChild, Directive } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, IonicPage } from 'ionic-angular';
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
  selector: 'page-annuaire-fav-centres_interet',
  templateUrl: 'fav_centres_interet.html'
})
@Directive({
  selector: '[longPress]'
})
export class AnnuaireFavCentresInteretPage {
  @ViewChild(Nav) nav: NavController;

  nbPlaces: number = 0;
  grid: any = [];
  id_user: number = 0;
  title: string;

  places: any;
  favoris: any = [];
  flag: boolean = false;


  constructor(public navCtrl: NavController, private storage: Storage, public navParams: NavParams, public annuaire: AnnuaireServiceProvider,
    public sqlite: SqliteServiceProvider, public alertCtrl:AlertController, public Sqlite: SQLite, public http: HTTP, public platform: Platform, public favorisSrv:FavorisServiceProvider) {
    this.title = this.navParams.get("title");
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

  //Get le user connecté
  public getUser(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {})
      .then(res => {
        this.id_user = res.rows.item(0).id_user;
        this.getTeam(this.id_user,this.navParams.get("id_fav_tuile"));
      });
    });
  }

  //Filtre les membres des teams par le centre d'interet
  private getTeam(id_user,id_fav_tuile){
    this.annuaire.getEmployeTuileFav(id_user,id_fav_tuile).subscribe(data => {
      this.places = data;
      this.nbPlaces = data.length;
      this.places.sort(function(a,b) {return (a.prenom > b.prenom) ? 1 : ((b.prenom > a.prenom) ? -1 : 0);} );
      this.generateFullGrid();
      var self = this;
      var load = setInterval(function(){
        if($('.imgHex')!=undefined && $('.imgHex').length >0) {
          for (let i = 0; i < self.places.length; i++) {
            if(self.places[i].image != ""){
              $('#hexagon_'+self.places[i].id+' .hex1 .hex2 .imgHex').attr("src", "https://hautier.teamsmart.fr/images/entreprise/profils/"+self.places[i].image);
            }else{
              $('#person-'+self.places[i].id).css("display","block");
              $('#'+i).css('margin-top','0px');
            }
            if($('#'+i).text().length >= 17){
              $('#'+i).css('font-size','11px');
            }else if($('#'+i).text().length >= 27){
              $('#'+i).css('font-size','10px');
            }else if($('#'+i).text().length >= 31){
              $('#'+i).css('font-size','9px');
            }else if($('#'+i).text().length >= 35){
              $('#'+i).css('font-size','8px');
            }
          }
          clearInterval(load);
        }
      },(50));
    });
  }

  public pressed(id_tuile) {
    this.flag = true;
    this.getFav(this.id_user);
  }


  public released() {
    console.log('in released');
  }

  public getFav(id_user){
    this.favorisSrv.getUserFavoris(id_user).subscribe(data =>{
      this.favoris = data;
      for(let e=0; e<this.places.length;e++){
        $('.icon-hexa-star-'+this.places[e].id).css('color', 'black');
        $('.icon-hexa-star-'+this.places[e].id).addClass('icon-favori');
        $('.icon-hexa-star-'+this.places[e].id).removeClass('icon-favoris-plein');
      }

      for(let i = 0; i< this.favoris.length; i++){
        $('.icon-hexa-star-'+this.favoris[i].id_employe).css('color', '#fce300');
        $('.icon-hexa-star-'+this.favoris[i].id_employe).removeClass('icon-favori');
        $('.icon-hexa-star-'+this.favoris[i].id_employe).addClass('icon-favoris-plein');
      }
    });
  }

  public addFavoris(id_receiver){
    let param = [];
    param.push({
      id_user:this.id_user,
      id_ent:0,
      id_employe:id_receiver,
      is_entreprise: 0
    });
    this.favorisSrv.postUserFavoris(JSON.stringify(param)).then(response => {
      this.getFav(this.id_user);
    });
  }

  public backToFormualaire(){
    this.flag = false;
  }

  //Genere la grill pour les hexagons
  generateFullGrid() {
    this.grid = [];
    var nb_tiles = this.nbPlaces;
    var ko = 0;
    var ko_if = ko;
    var line = '';
    var clic = null;
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
      var title = "";
      clic = this.places[i].id;
      if(clic == undefined){
        clic = this.places[i].id;
      }
      title = this.places[i].prenom+" "+this.places[i].nom;

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

  public savePlace(id_user){
    this.navCtrl.setRoot('place-detail', {
      param: id_user,
      idCat: 'team',
      image: null
    });
  }

  //Retour sur la home
  public goBack() {
    this.navCtrl.setRoot('home-home');
  }
}
