import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams, ToastController, IonicPage} from 'ionic-angular';
import { EventsServiceProvider } from '../../../providers/events-service/events-service';
import { SqliteServiceProvider } from '../../../providers/sqlite-service/sqlite-service';
import { Toast } from '@ionic-native/toast';
import * as $ from 'jquery';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {AnnuaireServiceProvider} from "../../../providers/annuaire-service/annuaire-service";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {Camera} from "@ionic-native/camera";

@IonicPage({
  name : 'events-formulaire',
  segment : 'events-formulaire'
})
@Component({
  selector: 'page-events-formulaire',
  templateUrl: 'formulaire.html'
})

export class EventsFormulairePage {
  setTitle : boolean = false;
  categories : any;
  categorieslvl2 : any;
  children: boolean;
  pmr: boolean;
  free: boolean;
  diamonds: any;
  dd: any;
  user: number;
  ent: number = 1;
  imageMessage: any = "";
  imageURI: any;
  titre: any;
  lieu: any;
  datedebut: any;
  heuredebut: any;
    datefin: any;
    heurefin: any;


  event: any;
  day: string;
  month: string;
  summary: string;
  year: string;
  hour: string;
  minutes: string;
  loc_title: string;
  loc_address: string;
  start: any;
  end: any;
  contact_id: string;
  catid: string;
  description: string;
  lvl1list: any = [];
  lvl1titlechecked: boolean = true;
  selectedLvl1: any;
  eventType: string = "";
  participations : boolean = false;
  comments : boolean = false;
  entLocation : string = "";
  adminEnt : any = [];
  adminEntLength: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toast: Toast,
              public eventsSrv: EventsServiceProvider, public sqlite: SqliteServiceProvider, public Sqlite: SQLite,
              public alertCtrl: AlertController, public annuaire: AnnuaireServiceProvider, private camera:Camera,
              private transfer:FileTransfer, public loadingCtrl:LoadingController,public toastCtrl:ToastController) {
    this.setTitle = false;
    this.entLocation = this.navParams.get('loc_id');
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

  public goBack() {
    this.navCtrl.setRoot('EventsListPage');
  }

  public getEntSelected(){
      this.Sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM ent_selected', {}).then(res => {
          if (res.rows.length != 0) {
            this.ent = res.rows.item(0).id_ent;
            this.getLvl1List();
            this.getUserAdminEnt();
          }
        });
      });
  }

  private getUserAdminEnt(){
    this.eventsSrv.getUserAdminEntEvent(this.user).subscribe(data => {
      this.adminEnt = data;
      this.adminEntLength = this.adminEnt.length;

      if(this.navParams.get('ev_id') != undefined && this.navParams.get('ev_id') != null){
        this.getEvent(this.navParams.get('ev_id'));
      }else{
        this.getCurrentDate();
        if(this.adminEnt.length != 0){
          this.getCategories('all',this.user);
          this.eventType = 'all';
        }else if(this.navParams.get('lvl1') != undefined && this.navParams.get('lvl1') != '' && this.navParams.get('lvl1') != null){
          this.getCategories('lvl1',this.navParams.get('lvl1'));
          this.eventType = 'lvl1';
        }else if(this.navParams.get('lvl2') != undefined && this.navParams.get('lvl2') != '' && this.navParams.get('lvl2') != null){
          this.getCategories('lvl2',this.navParams.get('lvl2'));
          this.eventType = 'lvl2';
        }else if(this.navParams.get('cli') != undefined && this.navParams.get('cli') != '' && this.navParams.get('cli') != null){
          this.getCategories('cli',this.navParams.get('cli'));
          this.eventType = 'cli';
        }else {
          console.log(this.user);
          this.getCategories('tw',this.user);
          this.eventType = 'tw';
        }
      }
    });
  }

  private getEvent(id){
    this.eventsSrv.getEvent(id).subscribe(data => {
      this.event = data[0];
      this.day = this.event.day;
      this.month = this.event.month;
      this.summary = this.event.summary;
      this.lieu = this.event.lieu;
      this.year = this.event.year;
      this.hour = this.event.hour;
      this.minutes = this.event.minutes;
      this.loc_title = this.event.loc_title;
      this.loc_address = this.event.loc_address;
      this.start = this.event.dtstart;
      this.end = this.event.dtend;
      this.contact_id = this.event.created_by;
      this.catid = this.event.idcat;
      this.description = this.event.description.replace(new RegExp('\n','g'), '<br/>');
      this.imageMessage = this.event.img;
      if(this.event.participations == 0){
        this.participations = false;
      }else{
        this.participations = true;
      }
      if(this.event.comments == 0){
        this.comments = false;
      }else{
        this.comments = true;
      }

      this.getCategories(this.event.type,this.user);

      if(this.imageMessage != ""){
        $('.add-img-preview').append("<img class='preloadImg' src='https://hautier.teamsmart.fr/"+this.imageMessage+"'/>");
        $('.img-cross-delete').show();
        $('.add-img-preview').find('p').hide();
      }
      $('#select-cat').val(this.catid);
      $('.adminent').val(this.event.location);
      let start: any = (new Date(this.start*1000));
      var day = ("0" + start.getDate()).slice(-2);
      var month = ("0" + (start.getMonth() + 1)).slice(-2);
      var hour = ("0" + start.getHours()).slice(-2);
      var minutes = ("0" + start.getMinutes()).slice(-2);
      start = start.getFullYear()+"-"+(month)+"-"+(day) ;
      $('#datedebut').val(start);
      $('#heuredebut').val(hour+':'+minutes);
      let end : any = new Date(this.end*1000);
      day = ("0" + end.getDate()).slice(-2);
      month = ("0" + (end.getMonth() + 1)).slice(-2);
      hour = ("0" + end.getHours()).slice(-2);
      minutes = ("0" + end.getMinutes()).slice(-2);
      end = end.getFullYear()+"-"+(month)+"-"+(day) ;
      $('#datefin').val(end);
      $('#heurefin').val(hour+':'+minutes);
    });
  }

  private getLvl1List(){
    this.annuaire.getLvl1List(this.ent).subscribe(data => {
      for(var i = 0; i < data.length; i++){
        this.lvl1list.push({
          loc_id : data[i].loc_id,
          title : data[i].title,
          check: false,
          class: 'checked-lvl1'
        });
      }
      this.lvl1titlechecked = true;
      if(this.navParams.get('ev_id') != undefined && this.navParams.get('ev_id') != null){
        this.getLvl1Checked(this.navParams.get('ev_id'));
      }else{
        this.checkOptions();
      }
    });
  }

  public checkLvl1(){
    var checked = $('.lvl1-list').val();
    for(var u = 0; u < this.lvl1list.length; u++){
      this.lvl1list[u].check = false;
      this.lvl1list[u].class = "";
      for(var i = 0; i < checked.length; i++){
        if(checked[i] == this.lvl1list[u].loc_id){
          this.lvl1list[u].check = true;
          this.lvl1list[u].class = "checked-lvl1";
        }
      }
    }
    /*if(this.lvl1list[i].check){
      this.lvl1list[i].check = false;
      this.lvl1list[i].class = "";
    }else{
      this.lvl1list[i].check = true;
      this.lvl1list[i].class = "checked-lvl1";
    }*/
  }

  private checkOptions(){
    for(var i = 0; i < this.lvl1list.length; i++){
      if(this.lvl1list[i].check){
        $('.lvl1-list').find('#lvl1-'+this.lvl1list[i].loc_id).attr('selected',true);
      }
    }
  }

  private getLvl1Checked(id){
    this.eventsSrv.getLvl1Checked(id).subscribe(data =>{
      for(var i = 0; i < this.lvl1list.length; i++){
        this.lvl1list[i].check = false;
        this.lvl1list[i].class = "";
        for(var u = 0; u < data.length; u++){
          if(this.lvl1list[i].loc_id == data[u].n1){
            this.lvl1list[i].check = true;
            this.lvl1list[i].class = "checked-lvl1";
          }
        }
        this.lvl1titlechecked = false;
      }
      this.checkOptions();
    });
  }

  // Création de la date d'aujourd'hui pour remplir les champs par défaut
  private getCurrentDate(){
    var date = new Date();
    let day : any = date.getDate();
    if(day < 10){
      day = "0"+day;
    }
    var month : any = date.getMonth()+1;
    if(month < 10){
      month = "0"+month;
    }
    this.dd = date.getFullYear()+'-'+month+'-'+day;
  }

  private getCategories(type,id){
    this.eventsSrv.getEventCategories(type,id).subscribe(data =>{
      this.categories = data;
      var self = this;
      var load = setInterval(function () {
        if($('#select-cat').find('option').length != 0 && this.heuredebut.length != 0 && this.heurefin.length != 0){
          $('#select-cat').val(self.catid);
          $('#heuredebut, #heurefin').removeAttr('type');
          $('#heuredebut, #heurefin').attr('type','time');
          clearInterval(load);
        }
      },100);
    });
  }

  private getUser(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {})
        .then(res => {
          this.user = res.rows.item(0).id_user;
          this.getEntSelected();
        });
    });
  }

  // Enregistrement de l'événement
  public saveEvent(){
    var inspect = true;

    // Vérification du titre
    if(this.titre == ""){
      inspect = false;
      $('#name').css("border","1px solid red");
    }else{
      $('#name').css("border","1px solid #d6d6d6")
    }

    if($('#select-cat').val() != "244" && $('#select-cat').val() != "243"){
      // Vérification de l'entite admin
      if($('.adminent').val() == ""){
        inspect = false;
        $('.adminent').css("border","1px solid red");
      }else{
        $('.adminent').css("border","1px solid #d6d6d6")
      }
    }

    // Vérification du lieu
    if(this.lieu == ""){
      inspect = false;
      $('#lieu').css("border","1px solid red");
    }else{
      $('#lieu').css("border","1px solid #d6d6d6")
    }

    // Vérification de la catégorie
    if($('#select-cat').val() == ""){
      inspect = false;
      $('#select-cat').css("border","1px solid red");
    }else{
      $('#select-cat').css("border","1px solid #d6d6d6")
    }

    // Vérification de la date de début
    if($('#datedebut').val() == ""){
      inspect = false;
      $('#datedebut').css("border","1px solid red");
    }else{
      $('#datedebut').css("border","1px solid #d6d6d6");
    }

    if($('#heuredebut').css == ""){
      inspect = false;
      $('#heuredebut').css("border","1px solid red");
    }else{
      $('#heuredebut').css("border","1px solid #d6d6d6");
    }

    let start: any = new Date();
    var day = ("0" + start.getDate()).slice(-2);
    var month = ("0" + (start.getMonth() + 1)).slice(-2);
    var hour = ("0" + start.getHours()).slice(-2);
    var minutes = ("0" + start.getMinutes()).slice(-2);
    var now = start.getFullYear()+"-"+(month)+"-"+(day)+"T"+hour+":"+minutes;
    var dtstart = Date.parse($('#datedebut').val()+'T'+$('#heuredebut').val());

    console.log(dtstart > Date.parse(now));
    console.log(dtstart + ' > ' + Date.parse(now));
    console.log($('#datedebut').val()+' '+$('#heuredebut').val() + ' > ' + new Date());
    if(dtstart > Date.parse(now)){
      $('#datedebut, #heuredebut').css("border","1px solid #d6d6d6");
    }else{
      inspect = false;
      $('#datedebut, #heuredebut').css("border","1px solid red");
    }

    // Vérification de la date de début
    if($('#datefin').val() == ""){
      inspect = false;
      $('#datefin').css("border","1px solid red");
    }else{
      $('#datefin').css("border","1px solid #d6d6d6");
    }

    if($('#heurefin').val() == ""){
      inspect = false;
      $('#heurefin').css("border","1px solid red");
    }else{
      $('#heurefin').css("border","1px solid #d6d6d6");
    }

    var dtend = Date.parse($('#datefin').val()+'T'+$('#heurefin').val());

    console.log('CONDITION 1');
    console.log(dtend > Date.parse(now));
    console.log(dtend + ' > ' + Date.parse(now));
    console.log($('#datefin').val()+' '+$('#heurefin').val() + ' > ' + new Date());
    console.log('CONDITION 2');
    console.log(dtend > dtstart);
    console.log(dtend + ' > ' + dtstart);
    console.log($('#datefin').val()+' '+$('#heurefin').val() + ' > ' + $('#datedebut').val()+' '+$('#heuredebut').val());
    if(dtend > Date.parse(now) && dtend > dtstart){
      $('#datefin, #heurefin').css("border","1px solid #d6d6d6");
    }else{
      inspect = false;
      $('#datefin, #heurefin').css("border","1px solid red");
    }

    // Vérification de la description
    if($('#desc').val() == ""){
      inspect = false;
      $('#desc').css("border","1px solid red");
    }else{
      $('#desc').css("border","1px solid #d6d6d6");
    }

    if(inspect){
        let loader = this.loadingCtrl.create({
            content: "Ajout de l'événement ..."
        });
        loader.present();
      var params = [];
      params.push({
        title: this.titre,
        lieu: this.lieu,
        dd: $('#datedebut').val()+' '+$('#heuredebut').val(),
        df: $('#datefin').val()+' '+$('#heurefin').val(),
        desc : $('#desc').val().replace('\\r\\n', '<br/>'),
        cat : $('#select-cat').val(),
        img : this.imageMessage,
        ent : this.entLocation,
        cli : this.ent,
        user : this.user,
        id : this.navParams.get('ev_id'),
        type : this.eventType,
        comments : this.comments,
        participations : this.participations
      });
      console.log(params);
      for(var i = 0; i < this.lvl1list.length; i++){
        if(this.lvl1list[i].check){
          params[0]["cb-"+this.lvl1list[i].loc_id]= 'checked';
        }
      }

      this.eventsSrv.postEvent(JSON.stringify(params)).then(data => {
        let response = data;
        if(response != null){
          let alert = this.alertCtrl.create({
            title: 'Oups...',
            message: "L'envoi de la réponse a connu un problème...",
            buttons: ['Fermer']
          });
          alert.present();
        }else{
          loader.dismiss();
          this.navCtrl.setRoot('EventsListPage');
        }
      })
    }

  }

  public selectAdmin(){
    this.entLocation = $('.adminent').val();
  }

  public selectCat(){
    if($('#select-cat').val() == "244" || $('#select-cat').val() == "243"){
      this.entLocation = null;
      $('.adminent').val('');
      $('.adminent, .lvl1-list, .lvl1-list-label').hide();
    }else{
      $('.adminent, .lvl1-list, .lvl1-list-label').show();
    }
  }

  //Convert Date to readable date
  public dateForEvent(dateString) {
    let d = new Date(dateString);
    if(d.toString() == "Invalid Date"){
      let date = (dateString).split(" ");
      let date1 = date[0].split('-');
      let heure = date[1].split(':');
      d = new Date(date1[0], date1[1]-1, date1[2], heure[0], heure[1], heure[2]);
    }

    var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    return datestring;
  }

  //Fonction pour recup une image pour les post
  public addEventImg(){
    let cameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    };
    this.camera.getPicture(cameraOptions).then((imageData) => {
      this.imageURI = imageData;
      this.uploadFile();
    }, (err) => {
      console.log(err);
    });
  }

  //Fonction pour mettre la photo sur le serveur
  private uploadFile() {
    this.imageMessage= "";
    $('.preloadImg').remove();
    let loader = this.loadingCtrl.create({
      content: "Chargement de la photo ..."
    });
    loader.present();
    const fileTransfer: FileTransferObject = this.transfer.create();
    let id_img = this.makeid();
    let name_file = id_img+".jpg";
    this.imageMessage = name_file;

    let options: FileUploadOptions = {
      chunkedMode: false,
      fileKey: 'file',
      fileName: name_file,
      params:{operatiune:'uploadpoza'}
    };
    fileTransfer.upload(this.imageURI, 'https://hautier.teamsmart.fr/images/jevents/upload.php', options)
      .then((data) => {
        $('.add-img-preview').append("<img class='preloadImg' src='https://hautier.teamsmart.fr/images/jevents/"+name_file+"'/>");
        $('.img-cross-delete').show();
        $('.add-img-preview').find('p').hide();
        loader.dismiss();
      }, (err) => {
        loader.dismiss();
        this.presentToast("La photo n'a pas pu être enregistré");
      });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  //Function chaine string aléatoire pour identifiant image
  public makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 25; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  public removeImg(){
    $('.img-cross-delete').hide();
    $('.preloadImg').remove();
  }

}
