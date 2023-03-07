import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HomeServiceProvider} from "../../providers/home-service/home-service";
import * as $ from 'jquery';
import {DomSanitizer} from "@angular/platform-browser";
import {SqliteServiceProvider} from "../../providers/sqlite-service/sqlite-service";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";

@IonicPage()
@Component({
  selector: 'page-didactitiel',
  templateUrl: 'didactitiel.html',
})
export class DidactitielPage {
  didactitiel: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private homeSrv: HomeServiceProvider, private sanitizer: DomSanitizer,
              private sqliteSrv: SqliteServiceProvider, public Sqlite: SQLite) {
    this.getDidactitiel()
  }

  ionViewWillEnter(){
      let self = this;
      //Add click on class myBackArrow
      $(function() {
          $(".myBackArrow").click(function() {
              self.goBack();
          });
          $('ion-header, ion-footer').hide();
      });
  }

  ionViewWillLeave(){
      //Remove all delegated click handlers
      $(".myBackArrow").off();
      $('page-annuaire ion-content').css('top','0px');
      $('ion-header, ion-footer').show();
  }

  //Retour sur la home
  public goBack() {
      this.navCtrl.setRoot('home-home');
  }

  private getDidactitiel(){
    this.homeSrv.getDidactitiel().subscribe(data => {
      this.didactitiel = data;
      for (let i = 0; i < this.didactitiel.length; i++) {
        this.didactitiel[i].html = this.sanitizer.bypassSecurityTrustHtml(this.didactitiel[i].html);
      }
      console.log(this.didactitiel);
    });
  }

  private goToHome(){
      this.Sqlite.create({
          name: 'ionicdb.db',
          location: 'default'
      }).then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM didactitiel', {})
              .then(res => {
                  console.log(res.rows.item(0));
                  if(res.rows.item(0) == undefined){
                      this.sqliteSrv.insertDidactitiel();
                      this.navCtrl.setRoot('home-home');
                  } else if(res.rows.item(0).vu == 0){
                      alert('DIDACTITIEL 2');
                      this.sqliteSrv.updateDidactitiel();
                      this.navCtrl.setRoot('home-home');
                  } else {
                      this.navCtrl.setRoot('home-home');
                  }
              });
      });

  }

}
