import { Component, ViewChild } from '@angular/core';
import { NavController, MenuController, AlertController, NavParams, IonicPage } from 'ionic-angular';
import { Nav } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as $ from 'jquery';
import { ContactServiceProvider } from "../../../providers/contact-service/contact-service";
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
  selector: 'page-add-suggestion-contact',
  templateUrl: 'addSuggestion.html'
})

export class AddSuggestionContactPage {
  @ViewChild(Nav) nav: NavController;
  userContact: number;
  files:any;
  _files:any;
  mois:any;
  jour:any;
  params: any;
  response : any;
  today: any;
  categories: any;
  subject: any;
  desc: any;
  date: any;
  location: any;

  constructor(public navCtrl: NavController, private navParams: NavParams, public Sqlite: SQLite,
              public contactSrv: ContactServiceProvider, public menu: MenuController, public alertCtrl: AlertController,
              public file: File) {

    this.menu.swipeEnable(false);
    this.files = [];
    this.getImgs();
    this.getUser();
    this.getCategories(1);
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
        this.userContact = res.rows.item(0).id_user;
      });
    });
  }

  public getCategories(form){
    this.contactSrv.getCategoriesSuggestions(form).subscribe( data => {
      this.categories = data;
    });
  }

  public goBack(){
    this.navCtrl.setRoot('SuggestionsContactPage',{
      param:this.navParams.get('param')
    });
  }

  public changeCat() {
    $('.imgsD').removeAttr('activeImg');
    $('.imgsD').css('display','none');
    $('.'+$('#cat').find('option:selected').attr('id')).css('display','inline-block');
    if($('#cat').find('option:selected').attr('id') == "all"){
      $('#sugg1 p').css('display','none');
    }else{
      $('#sugg1 p').css('display','block');
    }
  };

  public getImgs(){
    this.contactSrv.getImgs().subscribe(data =>{
      this._files = data;
      for(var i = 0; i < this._files.length; i++) {
        var nameImg = this._files[i].split('/');
        var testImg = nameImg[(nameImg.length)-1].split('-');
        if((testImg[0] == "event" || testImg[0] == "sport" || testImg[0] == "co")){
          this.files.push({
            path : this._files[i],
            pre :  testImg[0]
          });
        }
      }
      var today = new Date();
      var annee = today.getFullYear();
      this.mois = (today.getMonth())+1;
      if(this.mois < 10){
        this.mois = "0"+this.mois;
      }
      this.jour = today.getDate();
      if(this.jour < 10){
        this.jour = "0"+this.jour;
      }
      this.today = annee+'-'+this.mois+'-'+this.jour;
      this.date = annee+'-'+this.mois+'-'+this.jour;

      $('#load, #loader, .imgsD').hide();
      var self = this;
      var int = setInterval(function () {
        if($('.imgsD').length != 0){
          clearInterval(int);
          for(var i = 0; i < self.files.length; i++) {
            var nameImg = self.files[i].path.split('/');
            var testImg = nameImg[(nameImg.length)-1].split('-');
            if((testImg[0] == "event" || testImg[0] == "sport" || testImg[0] == "co")){
              $('#imgD-'+i).css("background", "url('https://hautier.teamsmart.fr/"+self.files[i].path+"')");
            }
          }
        }
      },200);
    });
  }

  public setActive(i){
    $(".imgsD").removeClass("activeImg");
    $("#imgD-"+i).addClass("activeImg")
  }

  public verifForm(){
    var inspect = true;
    var inspect1 = true;
    var cat = $('#cat');
    var subject = this.subject;
    var subject_css =  $('#subject');
    var desc = $('#desc');
    //var date = this.date;
      ///var date_css =  $('#date');
    //var loc = this.location;
      //var loc_css =  $('#location');
    if(cat.find(":selected").val() == ""){
      cat.css('border-color','red');
      inspect = false;
    }else{
      cat.css('border-color','lightgrey');
    }
    if(subject == ""){
      subject_css.css('border-color','red');
      inspect = false;
    }else{
      subject_css.css('border-color','lightgrey');
    }
    if(desc == ""){
      desc.css('border-color','red');
      inspect = false;
    }else{
      desc.css('border-color','lightgrey');
    }
    /*if(cat.find(":selected").val() == 1 || cat.find(":selected").val() == 3){
      if(date_css.val() == ""){
        date_css.css('border-color','red');
        inspect = false;
      }else{
        date_css.css('border-color','lightgrey');
      }
    }


    var da = new Date(this.today);
    var db = new Date(date);
    if(da > db){
      date_css.css('border-color','red');
      inspect1 = false;
    }else{
      date_css.css('border-color','lightgrey');
    }*/

    if(inspect){
      this.sendDatas();
    }else if(!inspect1){
      let alert = this.alertCtrl.create({
        title: 'Attention !',
        message: "La date n'est pas valide.",
        buttons: ['Fermer']
      });
      alert.present();
    }else{
      let alert = this.alertCtrl.create({
        title: 'Attention !',
        message: "Tous les champs doivent être saisis.",
        buttons: ['Fermer']
      });
      alert.present();
    }
  }

  public sendDatas(){
    var cat = $('#cat');
    var subject = this.subject;
    var desc = $('#desc');
    //var loc = this.location;
    this.params = [];
    //var idImg = $('.activeImg').attr('id').split('-');
    //var fileName = (this.files[idImg[1]].path).split('/');
    this.params.push({
      categorie : cat.find(":selected").val(),
      subject : subject,
      description : desc.val(),
      //date : this.date,
      //location : loc,
      user_id : this.userContact,
      img : '',
      form : 1
    });
    console.log(this.params);
    this.contactSrv.postSuggestion(JSON.stringify(this.params)).then(data => {
      this.response = data;
      if(this.response == null){
        let alert = this.alertCtrl.create({
          title: 'Enregistré !',
          message: "Votre suggestion a été enregistrée avec succès !",
          buttons: ['Fermer']
        });
        alert.present();
      }
      this.navCtrl.setRoot('SuggestionsContactPage',{
        param : 0
      });
    });
  };


}
