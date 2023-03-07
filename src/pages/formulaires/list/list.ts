import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContentserviceProvider } from "../../../providers/contentservice/contentservice";
import { AnnuaireServiceProvider } from "../../../providers/annuaire-service/annuaire-service";
import * as $ from 'jquery';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";

@IonicPage({
  name : 'form-list',
  segment : 'form-list'
})
@Component({
    selector: 'page-form-list',
    templateUrl: 'list.html',
})
export class FormsListPage {
    user: any;
    cli: any;
    forms: any = [];
    forms_1: any = [];
    forms_2: any = [];
    forms_3: any = [];
    forms_1_length: number = 0;
    forms_2_length: number = 0;
    forms_3_length: number = 0;

    constructor(public navCtrl: NavController, public navParams: NavParams, private contentSrv: ContentserviceProvider,
                private annuaireSrv : AnnuaireServiceProvider, public Sqlite: SQLite) {

        this.getUser();

    }

    //Get le user connecté
    public getUser(){
      this.Sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM connectContact', {})
          .then(res => {
            this.user = res.rows.item(0).id_user;
            this.Sqlite.create({
              name: 'ionicdb.db',
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('SELECT * FROM ent_selected', {})
                .then(result => {
                  if (result.rows.length != 0) {
                    this.cli = result.rows.item(0).id_ent;
                    this.getForms();
                  }
                });
            });
          });
      });
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

    //Retour sur la home
    public goBack() {
        this.navCtrl.setRoot('home-home');
    }

    public getForms(){
        this.contentSrv.getFormsCli(this.cli).subscribe(data => {
            this.forms = data;
            console.log('FORMS');
            console.log(data);
            for(var i = 0; i < this.forms.length; i++){
              if(this.forms[i].type == 1){
                this.forms_1[this.forms_1.length] = this.forms[i];
              }else if(this.forms[i].type == 2){
                this.forms_2[this.forms_2.length] = this.forms[i];
              }else if(this.forms[i].type == 3){
                this.forms_3[this.forms_3.length] = this.forms[i];
              }
            }
            this.forms_1_length = this.forms_1.length;
            this.forms_2_length = this.forms_2.length;
            this.forms_3_length = this.forms_3.length;
        });
    }

    public getDetail(id_form){
        this.navCtrl.setRoot('form-detail', {
            id_form: id_form,
            cli : this.cli,
            user : this.user,
            origin: 'formslist'
        });
    }

    public setTab(type){
      $('.tabs').hide();
      $('.tab-'+type).show();
      $('.filter_tab').removeClass('active_tab');
      $('.filter_tab_'+type).addClass('active_tab');
    }
}
