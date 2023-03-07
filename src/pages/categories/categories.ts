import { Component } from '@angular/core';
import { NavController,ToastController,IonicPage } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SqliteServiceProvider } from '../../providers/sqlite-service/sqlite-service';
import { HomeServiceProvider } from '../../providers/home-service/home-service';
import { Storage } from '@ionic/storage';
import * as $ from 'jquery';

@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html'
})
export class CategoriesPage {
  categ: any = [];
  diamonds: any = [];
  fsc: boolean;
  ent_select: number = 1;
  user: any;

  constructor(public navCtrl: NavController,public homeSrv:HomeServiceProvider, private storage:Storage,
              private toastCtrl: ToastController,  public Sqlite: SQLite, public sqlite: SqliteServiceProvider,) {

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

  private getEntTiles(ent,user){
    this.homeSrv.getEntTiles(ent,user).subscribe(data=>{
      let e = 0;
      for(var i=0; i<data.length; i++)  {
        if(data[i].id_list_fav == 0){
          if(e == 0){
            data[i].id_line = "ok okl";
            e++;
          }else if(e == 1){
            data[i].id_line = "ok";
            e++;
          }else if(e == 2){
            data[i].id_line = "ko_cat";
            e=0;
          }
          this.categ.push(data[i]);
        }
      }
      $('#load, #loader').hide();
    });
  }

  private getUser(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {}).then(res => {
        if (res.rows.length != 0) {
          if (res.rows.item(0).connected == 0) {
            this.navCtrl.setRoot('ConnexionPage', {});
          }else{
            this.user = res.rows.item(0).id_user;
            this.Sqlite.create({
              name: 'ionicdb.db',
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('SELECT * FROM ent_selected', {})
                .then(result => {
                  if (result.rows.length != 0) {
                    this.ent_select = result.rows.item(0).id_ent;
                    this.getEntTiles(this.ent_select,this.user);
                  }
                });
            });
          }
        } else {
          this.navCtrl.setRoot('ConnexionPage', {});
        }
      });
    });
  }

  goTo(index,id_tuile, icon, title){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('SELECT * FROM home_diamond WHERE id_tuile = ? AND user_id = ? AND ent_diamond = ?', [id_tuile, this.user, this.ent_select])
      .then(res => {
        if(res.rows.item(0) != undefined){
          let toast = this.toastCtrl.create({
            message: 'La tuile sélectionnée existe déjà sur la page d\'accueil',
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        }else{
          if(this.categ[index].param == "niveau1"){
            this.navCtrl.setRoot('place-formulaire', {
              param: this.categ[index].param
            });
          }else{
            this.savePlace(this.categ[index],this.ent_select);
          }
        }
      });
    });
  }

  public goBack() {
    this.navCtrl.setRoot('home-home');
  }

  public savePlace(tile,ent_select){
    var params = tile.params.split('/');

    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM home_diamond WHERE user_id = ? AND ent_diamond = ?', [this.user, this.ent_select])
      .then(res => {
        this.diamonds = [];
        for (var i = 0; i < res.rows.length; i++) {
          this.diamonds.push({
            id : res.rows.item(i).id
          })

        }
        var len = this.diamonds.length;
        var title = tile.label;
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
        var color = params[0];
        var id_line = line;
        var id_bdd = "";
        var on_click = params[2]+"," + params[3];
        var on_drag = "true";
        var on_drop = "true";
        var on_drag_success = "onDragComplete($data,$event)";
        var len1 = len + 1;
        var on_drop_success = "onDropCompleteRemove($data,$event," + len1 + ")";
        var link = "placeDetails";
        this.sqlite.saveDiamond(tile.id,0,link, params[5], title, idBox, id_line, id_bdd, on_click, color, on_drag, on_drop, on_drag_success, on_drop_success,ent_select,this.user);
        this.navCtrl.setRoot('home-home', {
          param: id_bdd
        });
      });
    });
  }
}
