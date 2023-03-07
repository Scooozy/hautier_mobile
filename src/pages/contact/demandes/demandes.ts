import { Component, ViewChild } from '@angular/core';
import { NavController, Events, ToastController, IonicPage } from 'ionic-angular';
import { Nav } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as $ from 'jquery';
import { AlertController } from 'ionic-angular';
import { ContactServiceProvider } from "../../../providers/contact-service/contact-service";
import { AnnuaireServiceProvider } from "../../../providers/annuaire-service/annuaire-service";
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@IonicPage()
@Component({
  selector: 'page-demandes-contact',
  templateUrl: 'demandes.html'
})

export class DemandesContactPage {
  @ViewChild(Nav) nav: NavController;
  userContact: number;
  cli: number;
  user: any;
  name: string;
  prenoms: string;
  demandes: any = [];
  demandesGroupe: any = [];
  userReponses: any;
  notif: any;
  grlength: number = 0;
  msglength: number = 0;
  notif_group: boolean = false;
  notif_tw: boolean = false;

  dataNotification: any = [];

  displayMsgModal: boolean = false;
  groupName: string = "";
  allUsers: any = [];
  users: any = [];
  displaying: any = false;
  usersSelected: any = [];
  timeout: any = null;
  search: string = "";

  constructor(public navCtrl: NavController, private storage:Storage, public Sqlite: SQLite, public contactSrv: ContactServiceProvider,
              public alertCtrl: AlertController,public toastCtrl:ToastController,private annuaire:AnnuaireServiceProvider,
              public events: Events,private http: HttpClient) {
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
    $('ion-footer').show();
    $(".myBackArrow").off();
  }

  public getConnected(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {})
      .then(res => {
        this.userContact = res.rows.item(0).id_user;
        this.getDemandes(this.userContact);
        this.getDemandesGroupe(this.userContact);
        this.Sqlite.create({
          name: 'ionicdb.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM ent_selected', {})
            .then(result => {
              if (result.rows.length != 0) {
                this.cli = result.rows.item(0).id_ent;
                this.getUsers();
              }
            });
        });
      });
    });
  }

  private getUsers(){
    this.annuaire.getAllowedUsers(this.cli, this.userContact).subscribe(data => {
      this.allUsers = data;
      this.users = data;
    });
  }

  public goBack() {
    this.navCtrl.setRoot('home-home');
  }

  public getDemandes(user){
    this.contactSrv.getMessagesDemande(user).subscribe(data => {
      //this.demandes = data;
      this.demandes = [];
      for(let i = 0; i<data.length; i++){
        this.demandes.push(data[i]);
        this.demandes[i].msg = this.strip_tags(this.demandes[i].msg,'');
      }
      this.msglength = this.demandes.length;
      if(this.demandes.length != 0){
        this.storage.get('id_user_sender_notification').then((val) => {
          if(JSON.parse(val) != null){
            data = JSON.parse(val);
            for(let i = 0; i<data.length;i++){
              this.dataNotification.push(data[i]);
              //$('#notif_'+data[i]).addClass( "isNotif" );
              $('#notif_'+data[i]).css('display','block');
            }
          }else{
            this.storage.set('nbNotif', 0 );
          }

        });
      }
      $('#load, #loader').hide();
    });
  }

  public getDemandesGroupe(user){
    this.contactSrv.getGroupeByUser(user).subscribe(data => {
      //this.demandes = data;
      this.demandesGroupe = [];
      for(let i = 0; i<data.length; i++){
        this.demandesGroupe.push(data[i]);
        this.demandesGroupe[i].msg = this.strip_tags(this.demandesGroupe[i].msg,'');
      }
      this.grlength = this.demandesGroupe.length;
      $('#load, #loader').hide();
    });
  }

  // REMOVE ALL HTMLTAGS FROM STRING
  private strip_tags(str, allow){
    if(str == null){
      return "Aucun message";
    }else{
      // making sure the allow arg is a string containing only tags in lowercase (<a><b><c>)
      allow = (((allow || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');

      var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
      var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
      return str.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
        return allow.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 :'';
      });
    }
  }

  public demDetail(id, index, type,name){
    this.dataNotification = this.remove_duplicates(this.dataNotification);
    if(type == 'user'){
      if(this.userContact == this.demandes[index].user_id_sender){
        let indexOfArray = this.dataNotification.indexOf(this.demandes[index].user_id_receiver);
        if (indexOfArray > -1) {
          this.dataNotification.splice(indexOfArray, 1);
        }
      }else{
        let indexOfArray = this.dataNotification.indexOf(this.demandes[index].user_id_sender);
        if (indexOfArray > -1) {
          this.dataNotification.splice(indexOfArray, 1);
        }
      }
      this.storage.set('id_user_sender_notification', JSON.stringify(this.dataNotification));
      this.storage.set('nbNotif', 0 );
      this.navCtrl.setRoot('DetaildemContactPage',{
        param: id,
        id_sender:this.demandes[index].user_id_sender,
        id_receiver:this.demandes[index].user_id_receiver,
        type: type,
        origin: "messagerie",
        name: name
      });
    }else{
      this.navCtrl.setRoot('DetaildemContactPage',{
        param: id,
        id_sender:null,
        id_receiver:null,
        type: type,
        origin: "messagerie",
        name: name
      });
    }

  }

  public remove_duplicates(arr) {
    var obj = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
      obj[arr[i]] = true;
    }
    for (var key in obj) {
      ret_arr.push(key);
    }
    return ret_arr;
  }

  public openForm(){
    this.navCtrl.setRoot('AddDemandeContactPage',{});
  }

  public createGroupe(){
    let alert = this.alertCtrl.create({
      title: "Création d'un groupe",
      message: 'Créer un groupe et ajouter les membres que vous souhaitez pour communiquer avec eux.',
      inputs: [{
        name: 'nom',
        placeholder: 'Nom du groupe'
      }],
      buttons: [{
        text: 'Annuler',
        role: 'cancel'
      },{
        text: 'Créer le groupe',
        handler: data => {
          if(data.nom != ""){
            let params = [];
            params.push({
              nom: data.nom,
              is_public: 0,
              user : this.userContact
            });
            this.contactSrv.postGroupe(JSON.stringify(params)).then(response => {
              this.addPeopleInGroupe(response,"init");
            });
          }else{
            let toast = this.toastCtrl.create({
              message: 'Veuillez saisir le nom de votre groupe.',
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
            this.createGroupe();
          }
        }
      }]
    });
    alert.present();
  }

  public selectGroupe(){
    let dataInputs = [];
    this.contactSrv.getGroupeByUser(this.userContact).subscribe(data => {
      data.sort(function(a,b) {return (a.prenom > b.prenom) ? 1 : ((b.prenom > a.prenom) ? -1 : 0);} );
      for(var i=0; i<data.length; i++)  {
        dataInputs[i] = {};
        dataInputs[i].label = data[i].nom;
        dataInputs[i].type = 'radio';
        dataInputs[i].value = data[i].id;
      }

      let alert = this.alertCtrl.create({
        title: 'Sélection d\'un groupe',
        message: 'Sélectionner le groupe où vous souhaitez ajouter des membres',
        inputs : dataInputs,
        buttons: [{
          text: 'Annuler',
          role: 'cancel'
        }, {
          text: 'Valider',
          handler: data => {
            if(data.length != 0){
              this.addPeopleInGroupe(data,"noInit");
            }else{
              let toast = this.toastCtrl.create({
                message: 'Veuillez sélectionner un groupe.',
                duration: 3000,
                position: 'bottom'
              });
              toast.present();
              this.selectGroupe();
            }
          }
        }]
      });
      alert.present();
    });
  }

  public addPeopleInGroupe(id_groupe,when){
    let dataInputs = [];
    this.contactSrv.getUserOfGroupe(id_groupe).subscribe(UserOfGroup =>{
      this.annuaire.getAllowedUsers(this.cli, this.userContact).subscribe(data => {
        data.sort(function(a,b) {return (a.prenom > b.prenom) ? 1 : ((b.prenom > a.prenom) ? -1 : 0);} );
        let cpt = 0;
        for(let i=0; i<data.length; i++)  {
          for(let e=0; e<UserOfGroup.length;e++){
            if(data[i].id_employe == UserOfGroup[e].id_user || data[i].id_employe == this.userContact){
              e=UserOfGroup.length;
            }
            if(e == UserOfGroup.length-1 && this.userContact != data[i].id){
              dataInputs[cpt] = {};
              dataInputs[cpt].label = data[i].prenom+" "+data[i].nom;
              dataInputs[cpt].type = 'checkbox';
              dataInputs[cpt].value = data[i].id;
              cpt++;
            }
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
                  this.getDemandesGroupe(this.userContact);
                  this.notifUsers(id_groupe);
                });
              }else{
                let toast = this.toastCtrl.create({
                  message: 'Veuillez sélectionner au moins un membre dans votre groupe.',
                  duration: 3000,
                  position: 'bottom'
                });
                toast.present();
                this.addPeopleInGroupe(id_groupe,"init");
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
          this.sendNotification(data[i].code_fcm,msg,data[i].nom,data[i].id_user);
        }
      }
    });
  }

  public sendNotification(fcm,response,group_name,receiver) {
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

  public displayList(param){
    if(param == 'tw'){
      $('#dem-list').show();
      $('#dem-gr-list').hide();
      $('.gr').removeClass('active');
      $('.tw').addClass('active');
      $('#add-sugg').show();
      $('#add-group').hide();
    }else{
      $('#dem-list').hide();
      $('#dem-gr-list').show();
      $('.gr').addClass('active');
      $('.tw').removeClass('active');
      $('#add-group').show();
      $('#add-sugg').hide();
    }
  }

  public getGroupNotif(){
    this.notif_group = true;
  }

  public getTWNotif(){
    this.notif_tw = true;
  }

  public displayModal(){
    if(!this.displaying){
      this.displaying = true;
      $('.msg-modal').find('.msg-modal-form').slideToggle();
    }
  }

  public isSelected(user){
    if(this.usersSelected.some(item => item.id == user.id)){
      return true;
    }else{
      return false;
    }
  }

  public openModal(){
    this.displayMsgModal = true;
    this.displaying = false;
    $('ion-footer').hide();
  }

  public closeModal(){
    $('.msg-modal').find('.msg-modal-form').slideToggle();
    $('ion-footer').show();
    this.displayMsgModal = false;
    this.groupName = "";
  }

  public userFilter(){
    clearTimeout(this.timeout);
    var self = this;
    this.timeout = setTimeout(function () {
      self.users = $.grep(self.allUsers, function( a ) {
        var name = (a.prenom + ' ' + a.nom).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        var search = self.search.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return name.indexOf(search) !== -1
      });
    },(500));
  }

  public selectUser(user, i){
    if(this.usersSelected.some(item => item.id == user.id)){
      this.usersSelected = $.grep(this.usersSelected, function( a ) {
        return a.id !== user.id;
      });
    }else{
      this.usersSelected.unshift({
        id: user.id,
        image: user.image,
        nom: user.nom,
        prenom: user.prenom
      });
    }
  }

  public saveGroup(){
    var params = [];
    params.push({
      nom: this.groupName,
      is_public: 0,
      user : this.userContact
    });
    this.contactSrv.postGroupe(JSON.stringify(params)).then(id_groupe => {
      for(let e = 0; e < this.usersSelected.length; e++){
        params.push({
          id_groupe: id_groupe,
          id_user: this.usersSelected[e].id,
        });
      }
      this.contactSrv.postUserGroupeAuto(JSON.stringify(params)).then(response => {
        this.getDemandesGroupe(this.userContact);
        this.notifUsers(id_groupe);
        this.closeModal();
      });
    });
  }

}
