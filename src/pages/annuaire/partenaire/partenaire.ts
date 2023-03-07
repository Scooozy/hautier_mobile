import { Component, ViewChild, Directive } from '@angular/core';
import {NavController, NavParams, Select, IonicPage } from 'ionic-angular';
import { Nav } from 'ionic-angular';
import { AnnuaireServiceProvider } from '../../../providers/annuaire-service/annuaire-service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as $ from 'jquery';

@IonicPage()
@Component({
  selector: 'page-partenaire',
  templateUrl: 'partenaire.html'
})
@Directive({
  selector: '[longPress]'
})
export class PartenairePage {
  @ViewChild(Nav) nav: NavController;
  @ViewChild(Select) select: Select;
  @ViewChild('SelectFav') monSelectFav: Select;

  id_user: number;
  ent_selected: number;
  partenaires: any = [];
  partenairesLength: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private Sqlite: SQLite,
              private annuaire: AnnuaireServiceProvider) {

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
        this.Sqlite.create({
          name: 'ionicdb.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM ent_selected', {})
            .then(result => {
              if (result.rows.length != 0) {
                this.ent_selected = result.rows.item(0).id_ent;
                this.getPartenaires();
              }
            });
        });
        /************************/
        /****** A DEPLACER ******/
        /************************/
        $('#load, #loader').hide();
      });
    });
  }

  private getPartenaires(){
    this.annuaire.getPartenairesEnt(this.ent_selected).subscribe(data =>{
      this.partenaires = data;
      this.partenairesLength = this.partenaires.length;
    });
  }

  //Retour sur la home
  public goBack() {
    this.navCtrl.setRoot('home-home');
  }

  public goToPlace(loc_id, i){
    this.navCtrl.setRoot('PartenairedetailPage', {
      param: loc_id,
      origin: 'partenaire',
      title: this.partenaires[i].title,
      image: this.partenaires[i].image,
    });
  }

}
