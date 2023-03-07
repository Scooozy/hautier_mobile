import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, ToastController, LoadingController, IonicPage } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { Nav } from 'ionic-angular';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import * as $ from 'jquery';
import { AlertController } from 'ionic-angular';
import { ContactServiceProvider } from "../../../providers/contact-service/contact-service";
import { AnnuaireServiceProvider } from '../../../providers/annuaire-service/annuaire-service';
import { HttpClient } from '@angular/common/http/';
import { HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import {InAppBrowser} from "@ionic-native/in-app-browser";

@IonicPage()
@Component({
  selector: 'page-detaildem-contact',
  templateUrl: 'detaildem.html'
})

export class DetaildemContactPage {
  @ViewChild(Nav) nav: NavController;
  @ViewChild(Content) content: Content;
  userContact: number;
  user: any;
  prenoms: string;
  name: string;
  details: any;
  map: any;
  sujet: string;
  publication: string;
  icon_trait: string;
  txt_trait: string;
  description: string;
  demande: any;
  responses: any = [];
  date: string;
  heure: string;
  demandes: any;
  responses_first: any = [];
  nulldata = false;
  displayed: number = 0;
  teamcolor1: string = null;
  teamcolor2: string = null;
  fsccolor1: string = null;
  fsccolor2: string = null;
  ancre: boolean = true;
  offsetTop: any;
  idSender: number;
  idReceiver: number;
  userReceiver: any;
  namereceiver: string;
  imageURI: any;
  imageMessage: string = "";
  typeMessagerie: string = "";
  id_groupe: any = null;
  reloadResponses: any;
  gpName: string = "";
  cordova:any;
  imageUrl: string = "";
  message: string = "";
  userSender: any = "";
  namesender: any = "";
  load: boolean = true;
  video_post: any;
  type_video: any;

  constructor(public navCtrl: NavController, private storage: Storage, public Sqlite: SQLite, public annuaire: AnnuaireServiceProvider,
              public contactSrv: ContactServiceProvider, public alertCtrl: AlertController,private camera:Camera,
              private transfer:FileTransfer, public loadingCtrl:LoadingController,public toastCtrl:ToastController,
              public navParams: NavParams, private http: HttpClient, private push: Push,private file: File,
              private fileTransfer: FileTransferObject, private androidPermissions: AndroidPermissions, public appBrowser : InAppBrowser) {

    this.typeMessagerie = this.navParams.get("type");
    this.pushSetup();

    this.storage.get('fsccolor1').then((val) =>{
      this.fsccolor1 = val;
    });
    this.storage.get('fsccolor2').then((val) =>{
      this.fsccolor2 = val;
    });
    this.storage.get('teamcolor1').then((val) =>{
      this.teamcolor1 = val;
    });
    this.storage.get('teamcolor2').then((val) =>{
      this.teamcolor2 = val;
    });
  }

  ionViewDidLoad() {
    $("#send-msg-input-dem").focusin(function(){
      $('.img-cross-delete, .preloadImg').hide();
    });
    $("#send-msg-input-dem").focusout(function(){
      $('.img-cross-delete, .preloadImg').show();
    });
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
    clearInterval(this.reloadResponses);
  }

  public getUser(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {})
      .then(res => {
        this.userContact = res.rows.item(0).id_user;
        if(this.typeMessagerie == "user"){
          this.getDemande(this.userContact, this.navParams.get('param'));
          this.saveViewMsgNotif(this.userContact, this.navParams.get('param'));
        }else{
          this.id_groupe = this.navParams.get('param');
          this.gpName = this.navParams.get('name');
          this.getDemandeGroupe(this.userContact, this.navParams.get('param'));
          this.saveViewMsgGroup(this.userContact, this.navParams.get('param'));
        }
      });
    });
  }

  pushSetup(){
    const options: PushOptions = {
      android: {
        senderID:'714756472177'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      }
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) =>{
      if(notification.additionalData.foreground){
        if(notification.additionalData.param1 == this.idReceiver){
          console.log("id sender == id receiver");
        }else{
          console.log("id different");
        }
      }
    });
  }

  public sendNotification(fcm,response) {
    let body = {
      "notification":{
        "title":this.name,
        "body":response,
        "sound":"default",
        "icon":"fcm_push_icon"
      },
      "data":{
        "param1":this.idSender,
        "param2":this.idReceiver,
        "Message":"TEST MESSAGE PARAMS"
      },
      "to":fcm,
      "priority":1,
      "restricted_package_name":""
    };
    let options = new HttpHeaders().set('Content-Type','application/json');
    this.http.post("https://fcm.googleapis.com/fcm/send",body,{
      headers: options.set('Authorization', 'key=AAAApmrOPXE:APA91bEvFQYflu0B5UJxLhtxXHUyyIWX98eeoyVS6OqFW8Kul37-6PwnsrURGL9EL2uygJExXgkOYCWS0mWtj07dCv4IhvhydL5KyXx3AhR2N5hWD_JZaaoxZy_GzhB1lWavdvdaEjiP'),
    }).subscribe(
      (value) => console.log("Succes",value),
      (err) => console.log("Fail",err),
      () => console.log("Complete")
    );
  }

  public loadColor(){
    let self = this;
    let load = setInterval(function(){
      if(self.fsccolor1 != null && self.fsccolor2 != null && self.teamcolor1 != null && self.teamcolor2 != null)
      {
        clearInterval(load);
        self.storage.get('fsc').then((val) => {
          if(val){
            $('.friend .chat-message').css("background",self.fsccolor2);
            $('.self .chat-message').css("background",self.fsccolor1);
          }else{
            $('.friend .chat-message').css("background",self.teamcolor2);
            $('.self .chat-message').css("background",self.teamcolor1);
          }
        });
      }
    },50);
  }

  public getDemande(user, demande){
    this.contactSrv.getMessageDemande(demande).subscribe( data => {
      this.demande = data;
      this.demande = this.demande[0];
      this.sujet = this.demande.sujet;
      this.description = this.demande.demande;

      if(this.userContact == this.demande.user_id_sender){
        this.idSender = this.demande.user_id_sender;
        this.idReceiver = this.demande.user_id_receiver;
      }else{
        this.idReceiver = this.demande.user_id_sender;
        this.idSender = this.demande.user_id_receiver;
      }

      this.getReceiverInfo(demande);
      this.getInfoUser(user);
    });
  }

  private getReceiverInfo(demande){
    this.annuaire.getEmployeById(this.idReceiver).subscribe(data => {
      this.userReceiver = data;
      this.userReceiver = this.userReceiver[0];
      this.namereceiver = this.userReceiver.prenom+" "+this.userReceiver.nom;
      this.getSenderInfo(demande);
    });
  }

  private getSenderInfo(demande){
    this.annuaire.getEmployeById(this.idSender).subscribe(data => {
      this.userSender = data;
      this.userSender = this.userSender[0];
      this.namesender = this.userSender.prenom+" "+this.userSender.nom;
      this.getReponses(demande);
    });
  }

  public getDemandeGroupe(user, id_groupe){
    this.contactSrv.getGroupeById(id_groupe).subscribe( data => {
      this.demande = data;
      this.demande = this.demande[0];
      this.getInfoUser(user);
      this.getReponsesGroupes(id_groupe);
    });
  }

  public getReponses(demande){
    this.contactSrv.getMessageReponse(demande).subscribe( data => {
      if(this.responses.length != data.length){
        this.responses = data.reverse();
        this.displayed = 20;
        if(this.displayed > this.responses.length){
          this.displayed = this.responses.length;
        }
        for(var i = 0; i < this.displayed; i++){
          this.responses_first.unshift(this.responses[i]);
        }
        this.load = false;
      }else{
        this.load = false;
      }
    })
  }

  public getReponsesGroupes(id_groupe){
    this.contactSrv.getMessageGroupe(id_groupe).subscribe( data => {
      if(this.responses.length != data.length){
        this.responses = data.reverse();
        this.displayed = 20;
        if(this.displayed > this.responses.length){
          this.displayed = this.responses.length;
        }
        for(var i = 0; i < this.displayed; i++){
          this.responses_first.unshift(this.responses[i]);
        }
        this.load = false;
      }else{
        this.load = false;
      }
    })
  }

  // REMOVE ALL HTMLTAGS FROM STRING
  private strip_tags(str, allow){
    // making sure the allow arg is a string containing only tags in lowercase (<a><b><c>)
    allow = (((allow || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');

    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
    var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return str.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
      return allow.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 :'';
    });
  }

  public getInfoUser(user){
    this.annuaire.getEmployeById(user).subscribe(data => {
      this.user = data;
      this.user = this.user[0];
      this.name = this.user.prenom+" "+this.user.nom;
    });
  }

  public goBack(){
    clearInterval(this.reloadResponses);
    if(this.navParams.get("origin") == "messagerie"){
      this.navCtrl.setRoot('DemandesContactPage',{});
    }else if(this.navParams.get("origin") == "groupes"){
      this.navCtrl.setRoot('AnnuaireGroupesPage',{});
    } else if(this.navParams.get("origin") == "event"){
      this.navCtrl.setRoot('event-detail', {
        idEvent: this.navParams.get("id_rdv"),
        type : 'event'
      });
    }else if(this.navParams.get("origin") == "rdv"){
      this.navCtrl.setRoot('event-detail', {
        idEvent: this.navParams.get("id_rdv"),
        type : 'rdv',
        originPage: "rendez-vous"
      });
    }else if(this.navParams.get("origin") == "user"){
      var id = "";
      if(this.userContact == this.demande.user_id_sender){
        id = this.demande.user_id_receiver;
      }else{
        id = this.demande.user_id_sender;
      }
      this.navCtrl.setRoot('place-detail', {
        param: id,
        idCat: 'team',
        image: null
      });
    }else{
      this.navCtrl.setRoot('DemandesContactPage', {});
    }
  }

  public formatDate(date) {
    var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear(),
    hour = '' + d.getHours(),
    min = '' +d.getMinutes();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hour.length < 2) hour = '0' + hour;
    if (min.length < 2) min = '0' + min;

    return [year, month, day].join('-')+" "+[hour, min].join(':');
  }

  //Fonction pour recup une image pour les post
  getImg(){
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
  uploadFile() {
    this.imageMessage= "";
    $('.preloadImg').remove();
    let loader = this.loadingCtrl.create({
      content: "Enregistrement de la photo ..."
    });
    loader.present();const fileTransfer: FileTransferObject = this.transfer.create();
      let id_img = this.makeid();
      let name_file = id_img+".jpg";
      this.imageMessage = name_file;

      let options: FileUploadOptions = {
          chunkedMode: false,
          fileKey: 'file',
          fileName: name_file,
          params:{operatiune:'uploadpoza'}
      };
      fileTransfer.upload(this.imageURI, 'https://hautier.teamsmart.fr/images/messagerie/upload.php', options)
          .then((data) => {
              $('.input-msg').append("<img class='preloadImg' src='https://hautier.teamsmart.fr/images/messagerie/"+name_file+"'/>");
              $('.img-cross-delete').show();
              loader.dismiss();
          }, (err) => {
              loader.dismiss();
              //this.presentToast("La photo n'a pas pu être enregistré");
          });

  }

  public removeImg(){
    $('.img-cross-delete').hide();
    $('.preloadImg').remove();
    this.imageMessage = "";
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

  public sendResponse() {
    let loader = this.loadingCtrl.create({
      content: "Envoi du message ..."
    });
    var message = this.message;
    if (message != "" || $('#send-msg-dem').find('.input-msg').find('img').length != 0) {
      loader.present();
      var params = [];
      message = this.message.replace('\\r\\n', '<br/>');
      params.push({
        demande_id: this.navParams.get('param'),
        id_sender: this.idSender,
        id_receiver: this.idReceiver,
        response : message,
        image: this.imageMessage
      });
      this.contactSrv.postMessageReponse(JSON.stringify(params)).then(response => {
        //this.response = response;
        this.contactSrv.postMessageNotif(JSON.stringify(params)).then(response =>{});

        this.ancre = true;

        this.responses.unshift({
          id_sender : this.userContact,
          response : message,
          date : this.formatDate(new Date()),
          image: this.imageMessage,
          video: this.video_post,
          type_video: this.type_video
        });

        this.responses_first.push({
          id_sender : this.userContact,
          response : message,
          date : this.formatDate(new Date()),
          image: this.imageMessage,
          video: this.video_post,
          type_video: this.type_video
        });

        this.displayed++;

        //var date_width = "";
        //date_width = $('.date-reponse-dem').width();
        this.message = "";
        this.imageMessage= "";
        $('.preloadImg').remove();
        loader.dismiss();
      }).catch( err => {
        loader.dismiss();
        this.sendResponse();
      });
    }
  };

  public sendResponseGroupe() {
    let loader = this.loadingCtrl.create({
      content: "Envoi du message ..."
    });
    var message = this.message;
    if (message != "" || $('#send-msg-dem').find('.input-msg').find('img').length != 0) {
      loader.present();
      message = this.message.replace('\\r\\n', '<br/>');
      var params = [];
      params.push({
        id_groupe: this.navParams.get('param'),
        id_user: this.userContact,
        response : message,
        image: this.imageMessage,
        video: this.video_post,
        type_video: this.type_video
      });
      this.contactSrv.postMessageGroupe(JSON.stringify(params)).then(response => {
        //this.response = response;
        this.contactSrv.postMessageGroupeNotif(JSON.stringify(params)).then(response => {});

        this.responses.unshift({
          id_sender : this.userContact,
          response : message,
          date : this.formatDate(new Date()),
          image: this.imageMessage,
          video: this.video_post,
          type_video: this.type_video
        });

        this.responses_first.push({
          id_groupe : this.navParams.get('param'),
          id_user : this.userContact,
          response : message,
          date : this.formatDate(new Date()),
          image: this.imageMessage,
          video: this.video_post,
          type_video: this.type_video,
          img_user: this.user.image
        });

        this.displayed++;

        this.message = "";
        this.imageMessage= "";
        $('.preloadImg').remove();
        $('.img-cross-delete,.video-cross-delete').hide();
        loader.dismiss();
      }).catch( err => {
        loader.dismiss();
        this.sendResponseGroupe();
      });
    }

  };

  private saveViewMsgNotif(user, id){
    this.contactSrv.saveViewMsgNotif(user, id).subscribe();
  };

  private saveViewMsgGroup(user, id){
    this.contactSrv.saveViewMsgGroup(user, id).subscribe();
  }

  public addPeopleInGroupe(){
    var id_groupe = this.navParams.get('param');
    let dataInputs = [];
    this.contactSrv.getUserOfGroupe(id_groupe).subscribe(UserOfGroup =>{
      this.annuaire.getAllTeamAllEnt().subscribe(data => {
        data.sort(function(a,b) {return (a.prenom > b.prenom) ? 1 : ((b.prenom > a.prenom) ? -1 : 0);} );
        let cpt = 0;
        for(let i = 0; i < data.length; i++)  {
          let inspect = true;
          for(let e = 0; e < UserOfGroup.length; e++){
            if(UserOfGroup[e].id_user == data[i].id){
              inspect = false;
            }
          }
          if(inspect){
            dataInputs[cpt] = {};
            dataInputs[cpt].label = data[i].prenom+" "+data[i].nom;
            dataInputs[cpt].type = 'checkbox';
            dataInputs[cpt].value = data[i].id;
            cpt++;
          }
        }

        let alert = this.alertCtrl.create({
          title: 'Ajout d\'un membre',
          message: 'Ajouter les membres que vous souhaitez à votre groupe',
          inputs : dataInputs,
          buttons: [{
            text: 'Annuler',
            role: 'cancel'
          }, {
            text: 'Ajouter les membres',
            handler: data => {
              if(data.length != 0){
                let params = [];
                for(let e = 0; e<data.length;e++){
                  params.push({
                    id_groupe: id_groupe,
                    id_user: data[e],
                  });
                }
                this.contactSrv.postUserGroupeAuto(JSON.stringify(params)).then(response => {
                  this.notifUsers(id_groupe);
                });
              }else{
                let toast = this.toastCtrl.create({
                  message: 'Veuillez sélectionner au moins un membre dans votre groupe.',
                  duration: 3000,
                  position: 'bottom'
                });
                toast.present();
                this.addPeopleInGroupe();
              }
            }
          }]
        });
        alert.present();
      });
    });
  }

  private notifUsers(group){
    this.contactSrv.getUserOfGroupeFCM(group).subscribe(data =>{
      for(var i = 0; i < data.length; i++){
        if(data[i].id_user != this.userContact){
          var msg = "Vous venez d'être ajouter dans le groupe "+data[i].nom;
          this.sendAddedNotification(data[i].code_fcm,msg,data[i].nom,data[i].id_user);
        }
      }
    });
  }

  public sendAddedNotification(fcm,response,group_name,receiver) {
    let body = {
      "notification":{
        "title":this.name,
        "body":response,
        "sound":"default",
        "icon":"fcm_push_icon"
      },
      "data":{
        "param1":this.userContact,
        "param2":receiver,
        "Message":"TEST MESSAGE PARAMS"
      },
      "to":fcm,
      "priority":"high",
      "restricted_package_name":""
    };
    let options = new HttpHeaders().set('Content-Type','application/json');
    this.http.post("https://fcm.googleapis.com/fcm/send",body,{
      headers: options.set('Authorization', 'key=AAAApmrOPXE:APA91bEvFQYflu0B5UJxLhtxXHUyyIWX98eeoyVS6OqFW8Kul37-6PwnsrURGL9EL2uygJExXgkOYCWS0mWtj07dCv4IhvhydL5KyXx3AhR2N5hWD_JZaaoxZy_GzhB1lWavdvdaEjiP'),
    }).subscribe(
      (value) => console.log("Succes",value),
      (err) => console.log("Fail",err),
      () => console.log("Complete")
    );
  }

  public downloadImg(){
    var url = this.imageUrl;
    var file = this.file;

    var loader = this.loadingCtrl.create({content: "Téléchargement en cours ..."});
    loader.present();

    //REQUEST CREATION
    let oReq = new XMLHttpRequest();

    //SENDING REQUEST
    oReq.open("GET", url, true);
    oReq.responseType = "blob"; // blob pls

    var self = this;
    //IF DATA RECEIVED THEN  WRITE FILE
    oReq.onload = function(oEvent) {

      //SAVE TEMP FILE IN APP FOLDER
      file.writeFile(file.dataDirectory, 'tmp.jpg', oReq.response, { replace: true }).then( data => {

        //COPY TMP FILE INTO USER GALLERY
        (<any>window).cordova.plugins.imagesaver.saveImageToGallery(file.dataDirectory+'tmp.jpg', onSaveImageSuccess, onSaveImageError);

        //ON SUCCESS
        function onSaveImageSuccess(){
          loader.dismiss();
          self.presentToast("L'image a bien été enregistrée.");

        }

        //ON FAIL
        function onSaveImageError(error) {
          loader.dismiss();
          self.presentToast("L'enregistrement de l'image a rencontré un problème...");
        }
      });
    };
    oReq.send();
  }

  private presentNotif(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom',
      showCloseButton: false
    });

    toast.present();
  }

  private getDownloadDate(){
    var now = new Date();
    let day:any = now.getDate();
    if(day < 10){
      day = "0"+day;
    }
    let month:any = now.getMonth();
    if(month < 10){
      month = "0"+month;
    }
    let hour: any = now.getHours();
    if(hour < 10){
      hour = "0"+hour;
    }
    let minutes: any = now.getMinutes();
    if(minutes < 10){
      minutes = "0"+minutes;
    }
    let secondes: any = now.getSeconds();
    if(secondes < 10){
      secondes = "0"+secondes;
    }
    return now.getFullYear()+''+month+''+day+'-'+hour+''+minutes+''+secondes;
  }

  public closeImg(){
    $('.img-bg-post').hide();
  }

  public linkify(inputText) {

    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    inputText = inputText.replace(replacePattern1, '<span class="href-linkify" data-href="$1">$1</span>');

    //URLs starting with "". (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    inputText = inputText.replace(replacePattern2, '$1<span class="href-linkify" data-href="http://$2" >http://$2</span>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\-_]+?(\.[a-zA-Z]{2,6})+)/gim;
    inputText = inputText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return inputText;
  }

  public clickLink(href){
    if(href != "" && href != null && href != undefined){
      this.appBrowser.create(href,'_system');
    }
  }

  public displayText(reponse){
    return this.linkify(this.strip_tags(reponse,'').replace(new RegExp('\n','g'), '<br/>'))
  }

  public canDisplayDate(i){
    if(this.responses_first[i-1] != undefined){
      var next_date = this.responses_first[i-1].date.split(' ');
      var current_date = this.responses_first[i].date.split(' ');
      if(next_date[0] != current_date[0]){
        return true;
      }else{
        return false;
      }
    }else if(this.responses_first.length == this.responses.length){
      return true;
    }else{
      return false;
    }
  }

  public dateMessageFormat(date,i){
    if(i == 0){
      return this.formatDay(date);
    } else {
      let index = parseInt(i) - 1;
      return this.formatDay(date);
    }
  }

  public formatDay(jour) {
    let d = new Date(jour);
    var monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    if(d.toString() == "Invalid Date"){
      let date = jour.split(" ");
      let date1 = date[0].split('-');
      let heure = date[1].split(':');
      d = new Date(date1[0], date1[1]-1, date1[2], heure[0], heure[1]);
    }

    var day = d.getDate();
    var monthIndex = d.getMonth();
    var year = d.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

  public doInfinite(infiniteScroll){
    setTimeout(() => {
      var max = 0;
      if(this.displayed+10 <= this.responses.length){
        max = this.displayed+10;
      }else{
        max = this.responses.length;
      }
      for (let i = this.displayed; i < max; i++) {
        this.responses_first.unshift(this.responses[i]);
      }
      this.displayed = max;
      infiniteScroll.complete();
    }, 500);
  }

  public allMessageLoad(){
    if(this.responses_first.length == this.responses.length){
      return true;
    } else {
      return false;
    }
  }


  public formatTime(time){
    var d = new Date(time); // for now
    if(d.toString() == "Invalid Date"){
      let date = time.split(" ");
      let date1 = date[0].split('-');
      let heure = date[1].split(':');
      d = new Date(date1[0], date1[1]-1, date1[2], heure[0], heure[1]);
    }
    var h = (d.getHours()<10?'0':'') + d.getHours();
    var m = (d.getMinutes()<10?'0':'') + d.getMinutes();
    return h + ':' + m;
  }

  public ancreToBottom(i){
    if(i == this.responses_first.length-1 && this.ancre){
      this.offsetTop = $("#ancreBottom").offset().top;
      this.ancre = false;
      $('.scroll-content').animate({
        scrollTop: $("#ancreBottom").offset().top
      }, 100);
    }
    //this.content.scrollToBottom(200);
  }

  public displayUserName(nom, prenom){
    return prenom+' '+(nom.toUpperCase()).charAt(0);
  }

}
