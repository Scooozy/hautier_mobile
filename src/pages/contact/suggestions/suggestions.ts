import { Component, ViewChild } from '@angular/core';
import {NavController, NavParams, IonicPage, ToastController} from 'ionic-angular';
import { Nav } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as $ from 'jquery';
import { AlertController } from 'ionic-angular';
import { ContactServiceProvider } from "../../../providers/contact-service/contact-service";
import {HomeServiceProvider} from "../../../providers/home-service/home-service";

@IonicPage()
@Component({
  selector: 'page-suggestions-contact',
  templateUrl: 'suggestions.html'
})

export class SuggestionsContactPage {
  @ViewChild(Nav) nav: NavController;
  userContact: number;
  user: any;
  name: string;
  prenoms: string;
  suggestions: any = [];
  userReponses: any;
  categories: any;
  title:string;
  icon:string;
  right_add: boolean = false;
  right_see_others: boolean = false;
  cptsuggestion: number = 0;

  constructor(public navCtrl: NavController, private navParams: NavParams, public Sqlite: SQLite, private toastCtrl: ToastController,
              public contactSrv: ContactServiceProvider, public alertCtrl: AlertController, private homeSrv: HomeServiceProvider) {
    this.getConnected();
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

  public getConnected(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {})
      .then(res => {
        if (res.rows.length != 0){
          if(res.rows.item(0).connected == 0) {
            this.navCtrl.setRoot('ConnectContactPage', {});
          }else{
            this.userContact = res.rows.item(0).id_user;
            this.homeSrv.getHasRight(this.userContact,37).subscribe(data =>{
              if(!data){
                let toast = this.toastCtrl.create({
                  message: "Vous n'avez pas les droits d'accès à cette fonctionnalité.",
                  duration: 3000,
                  position: 'bottom'
                });
                toast.present();
                this.navCtrl.setRoot('home-home',{});
              }else{
                this.homeSrv.getHasRight(this.userContact,38).subscribe(data =>{
                  this.right_add = data;
                });
                this.homeSrv.getHasRight(this.userContact,101).subscribe(data =>{
                  this.right_see_others = data;
                });
              }
            });
            this.getCategories(1);
            this.getSuggestions(1,this.userContact);
          }
        }else{
          this.navCtrl.setRoot('ConnectContactPage', {});
        }
      });
    });
  }

  public increaseCPT(){
    this.cptsuggestion++;
  }

  public goBack() {
    this.navCtrl.setRoot('home-home');
  }

  public getCategories(form){
    this.contactSrv.getCategoriesSuggestions(form).subscribe(data => {
      this.categories = data;
    });
  }

  public getSuggestions(form,user){
    this.contactSrv.getSuggestions(form,user).subscribe(sugestions => {
      this.suggestions = sugestions;
      this.title = 'Suggérez ...';
      this.icon = 'icon-suggestion';
      for(var i = 0; i < this.suggestions.length; i++){
        if(this.suggestions[i].date != undefined && this.suggestions[i].date != ""){
          var date = new Date();
          var date1 = new Date(this.suggestions[i].date);
          if(date > date1) {
            //jQuery('#item-list-sugg'+$scope.suggestions[i].id).css('display','none');
            this.suggestions.splice(i, 1);
          }
        }
      }
      if(this.suggestions.length != 0){
        $('#sugg-list h5').css('display','none');
      }else{
        if(this.navParams.get('param') == 0){
          $('#sugg-nope').show();
        }else{
          $('#concour-nope').show();
        }
      }
      var t = 0;
      var self = this;
      var int =  setInterval(
        function () {
          for(var i = 0; i < self.suggestions.length; i++){
            if(self.userContact == self.suggestions[i].user_id) {
              $('#item-list-sugg'+self.suggestions[i].id+' p').css('color','#007BC0');
            }
          }
          t++;
          if(t == 2){
            clearInterval(int);
            $('#load, #loader').hide();
          }
        },500
        );
    });
  }

  public suggDetail(id) {
    this.navCtrl.setRoot('DetailsugContactPage',{
      id: id,
      way : this.navParams.get('param')
    });
  };

  public openForm(){
    this.navCtrl.setRoot('AddSuggestionContactPage',{
      param: this.navParams.get('param')
    });
  }

}
