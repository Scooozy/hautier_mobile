import { Component, ViewChild, Directive } from '@angular/core';
import { NavController, NavParams, Select, Platform, AlertController, IonicPage } from 'ionic-angular';
import { Nav } from 'ionic-angular';
import { AnnuaireServiceProvider } from '../../../providers/annuaire-service/annuaire-service';
import { HomeServiceProvider } from '../../../providers/home-service/home-service';
import { FavorisServiceProvider } from '../../../providers/favoris-service/favoris-service';
import { SqliteServiceProvider } from '../../../providers/sqlite-service/sqlite-service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as $ from 'jquery';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-annuaire-centres_interet',
  templateUrl: 'centres_interet.html'
})
@Directive({
  selector: '[longPress]'
})
export class AnnuaireCentresInteretPage {
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

  listFavoris: any;

  type_display: boolean = true;
  type: string = 'hexagon';
  all: boolean = true;

  flag: boolean = false;
  favoris: any;

  diamonds: any = [];
  id_list_fav: number;

  filter_name: string = "";

  constructor(public navCtrl: NavController, private storage: Storage, public navParams: NavParams, public annuaire: AnnuaireServiceProvider,
    public sqlite: SqliteServiceProvider, public alertCtrl:AlertController,public homeSrv:HomeServiceProvider, public Sqlite: SQLite, public http: HTTP, public platform: Platform, public favorisSrv:FavorisServiceProvider) {
    this.getCentresInteret();
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
        this.getTeam();
      });
    });
  }

  //Get les centres d'interet
  public getCentresInteret(){
    this.favorisSrv.getAllFavoris().subscribe(data =>{
      this.listFavoris = data;
    });
  }

  //Get tous les membres de toues les teams
  public getTeam(){
    this.annuaire.getAllTeamAllEnt().subscribe(data => {
      this.places = data;
      this.nbPlaces = data.length;
      if(this.nbPlaces == 0){
        $('#place-none-info').css('display','block');
        $('#loader, #load').hide();
      }else{
        this.places.sort(function(a,b) {return (a.prenom > b.prenom) ? 1 : ((b.prenom > a.prenom) ? -1 : 0);} );
        if(this.filter_name != ""){
          this.getFilterName();
        }
        this.generateFullGrid();
        var self = this;
        if(this.type == 'hexagon'){
          let load = setInterval(function(){
            if($('.imgHex')!=undefined && $('.imgHex').length >0){
              for (let i = 0; i < self.places.length; i++) {
                if(self.places[i].image != ""){
                  $('#hexagon_'+self.places[i].id_employe+' .hex1 .hex2 .imgHex').attr("src", "https://hautier.teamsmart.fr/images/entreprise/profils/"+self.places[i].image);
                }else{
                  $('#person-'+self.places[i].id_employe).css("display","block");
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
        }else{
          let load = setInterval(function(){
            if($('.back_avatar')!=undefined && $('.back_avatar').length >0) {
              for (let i = 0; i < self.places.length; i++) {
                if(self.places[i].image != ""){
                  $('#avatar_'+self.places[i].id_employe).css("background-image", "url(https://hautier.teamsmart.fr/images/entreprise/profils/"+self.places[i].image+")");
                }else{
                  $('#person-'+self.places[i].id_employe).css("display","block");
                  $('#'+i).css('margin-top','0px');
                }
              }
              clearInterval(load);
            }
          },(50));
        }
        $('#loader, #load').hide();
      }
    });
  }

  //Change affichage entre list et hexagon
  public changeDisplay(type){
    if(type == 'hexagon'){
      this.type = 'hexagon';
      $(".display_list").removeClass("selected");
      $(".display_hexa").addClass("selected");
      this.type_display = true;
      this.setImg(this.type);
      this.getFav(this.id_user);
    }else{
      this.type = 'list';
      $(".display_hexa").removeClass("selected");
      $(".display_list").addClass("selected");
      this.type_display = false;
      this.flag = false;
      this.setImg(this.type);
      this.getFav(this.id_user);
    }
  }

  //set le image des lists
  public setImg(type){
    var self = this;
    //if toute categories id = id_employe if filtre actif id = id
    //if toutes les catégories
    if(this.all == true){
      if(type == 'hexagon'){
        let load = setInterval(function(){
          if($('.imgHex')!=undefined && $('.imgHex').length >0) {
            for (let i = 0; i < self.places.length; i++) {
              if(self.places[i].image != ""){
                $('#hexagon_'+self.places[i].id_employe+' .hex1 .hex2 .imgHex').attr("src", "https://hautier.teamsmart.fr/images/entreprise/profils/"+self.places[i].image);
              }else{
                $('#person-'+self.places[i].id_employe).css("display","block");
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
      }else{
        let load = setInterval(function(){
          if($('.back_avatar')!=undefined && $('.back_avatar').length >0) {
            for (let i = 0; i < self.places.length; i++) {
              if(self.places[i].image != ""){
                $('#avatar_'+self.places[i].id_employe).css("background-image", "url(https://hautier.teamsmart.fr/images/entreprise/profils/"+self.places[i].image+")");
              }else{
                $('#person-'+self.places[i].id_employe).css("display","block");
                $('#'+i).css('margin-top','0px');
              }
            }
            clearInterval(load);
          }
        },(50));
      }
    }else{//Si filtre actif
      if(type == 'hexagon'){
        let load = setInterval(function(){
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
      }else{
        let load = setInterval(function(){
          if($('.back_avatar')!=undefined && $('.back_avatar').length >0) {
            for (let i = 0; i < self.places.length; i++) {
              if(self.places[i].image != ""){
                $('#avatar_'+self.places[i].id).css("background-image", "url(https://hautier.teamsmart.fr/images/entreprise/profils/"+self.places[i].image+")");
              }else{
                $('#person-'+self.places[i].id).css("display","block");
                $('#'+i).css('margin-top','0px');
              }
            }
            clearInterval(load);
          }
        },(50));
      }
    }
  }

  public pressed(id_tuile) {
    this.flag = true;
    this.getFav(this.id_user);
  }


  public released() {
  }

  public getFav(id_user){
    this.favorisSrv.getUserFavoris(id_user).subscribe(data =>{
      this.favoris = data;
      for(let e=0; e<this.places.length;e++){
        $('.icon-hexa-star-'+this.places[e].id_employe).css('color', 'black');
        $('.icon-hexa-star-'+this.places[e].id_employe).addClass('icon-favori');
        $('.icon-hexa-star-'+this.places[e].id_employe).removeClass('icon-favoris-plein');
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

  //Function pour la création de la tuile sur la home
  public addOnHome(id_user){

    let alert = this.alertCtrl.create({
      title: 'Ajout d\'une tuile',
      message: 'Ajouter une tuile à votre accueil afin de regrouper les personnes que vous souhaitez.',
      inputs: [{
        name: 'nom',
        placeholder: 'Nom de la tuile'
      }],
      buttons: [{
        text: 'Annuler',
        role: 'cancel'
      },{
        text: 'Créer',
        handler: data => {
          this.getIdFavSaveTuile(data.nom,id_user);
        }
      }]
    });
    alert.present();
  }


  public addToFavoris(id_user){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM home_diamond', {})
      .then(res => {
        this.diamonds = [];
        for (let e = 0; e < res.rows.length; e++) {
          this.diamonds.push(res.rows.item(e));
        }

        let inputData = [];
        let compteur = 0;
        for(let i= 0; i<this.diamonds.length; i++)  {
          if(this.diamonds[i].id_tuile == null){
            inputData[compteur] = {};
            inputData[compteur].label = this.diamonds[i].title;
            inputData[compteur].type = 'radio';
            inputData[compteur].value = this.diamonds[i].id_list_fav;
            compteur = compteur + 1;
          }
        }
        if(inputData.length>0){
          let alert = this.alertCtrl.create({
            title: 'Ajout à mes favoris',
            message: 'Voulez-vous ajouter cette employé à l\'une de vos listes de favoris ?',
            cssClass: "alertCtrl",
            inputs: inputData,
            buttons: [{
              text: 'Ajouter à ma liste',
              handler: data => {
                if(data != undefined){
                  this.addEmployeInTuilefav(id_user,data);
                }else{
                  this.addToFavoris(id_user);
                }

              }
            },{
              text: 'Créer une liste',
              handler: data => {
                this.addOnHome(id_user);
              }
            },{
              text: 'Annuler',
              role: 'cancel'
            }]
          });
          alert.present();
        }else{
          this.addOnHome(id_user);
        }
      });
    });
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
      if(this.places[i] != undefined){
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
        clic = this.places[i].id_employe;
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
    this.getFav(this.id_user);
    $('#load, #loader').hide();
  }

  //Ouvre le filtre
  public openFilter(){
    this.monSelectFav.open();
  }

  public openSearch(){
    this.presentPrompt();
  }

  private presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Recherche',
      inputs: [{
          name: 'nom',
          placeholder: 'Nom',
          value: this.filter_name
      }],
      buttons: [{
        text: 'Réinitialiser',
        role: 'cancel',
        handler: data => {
          this.filter_name = "";
          if(this.fav != "Tous les centres d'interet"){
            this.all = false;
            this.FilterCat(this.fav);
          }else{
            this.all = true;
            this.getTeam();
          }
        }
      },{
        text: 'Valider',
        handler: data => {
          this.filter_name = data.nom;
          if(this.fav != "Tous les centres d'interet"){
            this.all = false;
            this.FilterCat(this.fav);
          }else{
            this.all = true;
            this.getTeam();
          }
        }
      }]
    });
    alert.present();
  }

  //Action lors du choix dans le filtre
  public setCat(){
    if(this.fav != "Tous les centres d'interet"){
      this.all = false;
      this.FilterCat(this.fav);
    }else{
      this.all = true;
      this.getTeam();
    }
    $("#filtre").css("display", "none");
    $("#accessFiltre").css("top", "13px");
  }

  //Filtre les membres des teams par le centre d'interet
  private FilterCat(id_fav){
    this.annuaire.getTeamFilterFav(id_fav).subscribe(data => {
      this.places = data;
      this.nbPlaces = data.length;
      this.places.sort(function(a,b) {return (a.prenom > b.prenom) ? 1 : ((b.prenom > a.prenom) ? -1 : 0);} );
      if(this.filter_name != ""){
        this.getFilterName();
      }
      this.generateFullGrid();
      this.setImg(this.type);
    });
  }

  private getFilterName(){
    this._places = [];
    for(var u = 0; u < this.places.length; u++){
      if(this.places[u].nom.toLowerCase().indexOf(this.filter_name.toLowerCase()) != -1 || this.places[u].prenom.toLowerCase().indexOf(this.filter_name.toLowerCase()) != -1){
        this._places[this._places.length] = this.places[u];
      }
    }
    this.places = this._places;
  }

  public getIdFavSaveTuile(tile,id_user){
    this.storage.get('id_fav').then(dataIdFav => {
      if(dataIdFav) {
        this.storage.set('id_fav', dataIdFav + 1);
        this.id_list_fav = dataIdFav + 1;
      } else {
        this.storage.set('id_fav', dataIdFav+1);
        this.id_list_fav = dataIdFav+1;
      }
      this.Sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM ent_selected', {})
          .then(result => {
            if (result.rows.length != 0) {
              this.ent_selected = result.rows.item(0).id_ent;
            }
            this.savePlaceTuile(tile,id_user, this.ent_selected);
          });
      });
    });
  }

  public addEmployeInTuilefav(id_user,id_fav){
    let param = [];
    this.storage.get('id_fav').then(dataIdFav => {
      if(dataIdFav) {
        this.id_list_fav = dataIdFav;
        if(id_fav == null){
          param.push({
            id_user_list_fav: this.id_user,
            id_tuile_fav: this.id_list_fav,
            id_user:id_user
          });
        }else{
          param.push({
            id_user_list_fav: this.id_user,
            id_tuile_fav: id_fav,
            id_user:id_user
          });
        }
        this.annuaire.PostEmployeTuileFav(JSON.stringify(param)).then(response =>{
          console.log("post employe tuile fav")
        });
      } else {
        this.storage.set('id_fav',1);
        this.id_list_fav = dataIdFav;
        let param = [];
        param.push({
          id_user_list_fav: this.id_user,
          id_tuile_fav: this.id_list_fav,
          id_user:id_user
        });
        this.annuaire.PostEmployeTuileFav(JSON.stringify(param)).then(response =>{
          console.log("post employe tuile fav")
        });
      }
    });
  }

  public savePlaceTuile(tile,id_user, ent_selected){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM home_diamond', {})
      .then(res => {
        this.diamonds = [];
        for (var i = 0; i < res.rows.length; i++) {
          this.diamonds.push({
            id : res.rows.item(i).id
          })
        }
        var len = this.diamonds.length;
        var title = tile;
        var idBox = "box" + len;
        var ko = 0;
        var ko_if = ko;
        var addition = 2;
        if (len == 0) {
          var line = "ok";
        } else {
          for (i = 0; i <= len; i++) {
            if (ko == 2 || ko == ko_if + addition) {
              let line = "ko";
              ko_if = ko;
              ko++;
              addition = 4;
            } else {
              let line = "ok";
              ko++;
            }
          }
        }
        var color = "hexa-bleu";
        var id_line = line;
        var id_bdd = "";
        var on_click = "list_fav,"+this.id_list_fav+","+title;
        var on_drag = "true";
        var on_drop = "true";
        var on_drag_success = "onDragComplete($data,$event)";
        var len1 = len + 1;
        var on_drop_success = "onDropCompleteRemove($data,$event," + len1 + ")";
        var link = "placeDetails";
        this.sqlite.saveDiamond(null,this.id_list_fav,link, "icon-association", title, idBox, id_line, id_bdd, on_click, color, on_drag, on_drop, on_drag_success, on_drop_success, ent_selected,this.id_user);
        let param = [];
        param.push({
          title: title,
          id_user: this.id_user,
          id_fav:this.id_list_fav
        });
        this.homeSrv.postTuileFav(JSON.stringify(param)).then(response =>{
          this.addEmployeInTuilefav(id_user,null);
        });
        this.navCtrl.setRoot('home-home', {
          param: id_bdd
        });
      });
    });
  }

  //Aller sur le detail de l'employe
  public savePlace(id){
    this.navCtrl.setRoot('place-detail', {
      param: id,
      idCat: 'team',
      image: null,
      prov:'c_interet'
    });
  }

  //Retour sur la home
  public goBack() {
    this.navCtrl.setRoot('home-home');
  }
}
