import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, IonicPage } from 'ionic-angular';
import { EventsServiceProvider } from '../../../providers/events-service/events-service';
import * as $ from 'jquery';
import { Calendar } from '@ionic-native/calendar';
import { Platform } from 'ionic-angular';
import { AnnuaireServiceProvider } from '../../../providers/annuaire-service/annuaire-service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SqliteServiceProvider } from '../../../providers/sqlite-service/sqlite-service';
import {ContactServiceProvider} from "../../../providers/contact-service/contact-service";
import {HttpClient} from "@angular/common/http";

@IonicPage({
  name : 'event-detail',
  segment : 'event-detail'
})
@Component({
  selector: 'page-events-details',
  templateUrl: 'details.html'
})
export class EventDetailsPage {
    id_ent: any;
    id_event : number;
  way : string;
  event : any;
  day : string;
  month : string;
  summary : string;
  year : string;
  hour : string;
  minutes : string;
  custom : any;
  org_title : string;
  loc_title : string;
  loc_address : string;
  token : string;
  marker1 : any;

  contact_id : any;
  contact_name : string;
  contact_ent : string;
  contact_fonction : string;
  id_user: number;
  id_receiver:number;
  id_sender:number;


  listMonth: string[]=[];
  listJour: string[]=[];
  date: string;
  unix_time: any;
  description: any;
  lieu: string;
  responserdv: any;

  rdv : any = [];
  validRdv: any = [];
  waitRdv: any = [];
  refuseRdv : any = [];
  allRdv : any = [];

  bgImage: string;
  event_user_response: number = 0;
  usersEvents: number = 0;
  usersEventsLength: any = [];
  userNb: number = 0;
  participations: boolean = false;
  comments: boolean = false;

  constructor(public navParams: NavParams, public navCtrl: NavController,private annuaire:AnnuaireServiceProvider,
              public eventsSrv: EventsServiceProvider, public calendar: Calendar, public platform: Platform,
              public Sqlite: SQLite, public alertCtrl:AlertController, public sqlite: SqliteServiceProvider,
              public contactSrv: ContactServiceProvider, private http: HttpClient) {

    this.listMonth = ['Janvier','Fevrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Decembre'];
    this.listJour = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']

    this.id_event = this.navParams.get('idEvent');
    this.way = this.navParams.get('type');
    this.id_ent = this.navParams.get('id_ent');
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

  ionViewDidLoad(){
    this.getUser();
  }

  ionViewWillLeave(){
    //Remove all delegated click handlers
    $(".myBackArrow").off();
  }

  private getRdv(id){
    this.annuaire.getRdvById(id).subscribe(data =>{
      this.event = data[0];
      this.summary = this.event.title;
      this.description = this.event.description;
      this.date =this.transformDate(this.event.date);
      this.unix_time = this.event.unix_time;
      this.lieu = this.event.lieu;

      this.id_receiver = this.event.id_receiver;
      this.id_sender = this.event.id_sender;

      if(this.id_user == this.id_receiver){
        this.contact_id = String(this.id_sender);
        $('#btn-rdv').show();
      }else{
        this.contact_id = String(this.id_receiver);
        $('#btn-rdv-1').show();
      }

      this.annuaire.getFullEmployeById(this.contact_id).subscribe(data1 => {
        this.contact_ent = data1[0].title;
        this.contact_name = data1[0].prenom+' '+data1[0].nom;
        this.contact_fonction = data1[0].fonction;
        this.bgImage = "https://hautier.teamsmart.fr/images/entreprise/profils/"+data1[0].image;


        if(this.event.confirmed == 1){
          $('.ok_rdv:first').css('background','#4CAF50');
          $('.ok_rdv:last').css('background','lightgray');
          //this.comfirmed(this.navParams.get('idEvent'),0);
          $('#attente, #decline').hide();
        }else if(this.event.confirmed == 0){
          $('.ok_rdv:last').css('background','#007BC0');
          $('.ok_rdv:first').css('background','lightgray');
          //this.comfirmed(this.navParams.get('idEvent'),1);
          $('#attente, #valide').hide();
        }else{
          $('#valide, #decline').hide();
        }

      });

      if(this.event.description.length != 0) {
        $("#event-desc").html(this.event.description);
      }else{
        $("#event-desc").html("Aucune information à afficher.");
      }
      $("#event-content").css('top', '135px');
      $("#open-agenda").css('top', '12px');

      $('#load, #loader').hide();
    });
  }

  public optionRDV(arg){
    if(arg == 0){
      $('.ok_rdv:first').css('background','#4CAF50');
      $('.ok_rdv:last').css('background','lightgray');
      this.comfirmed(this.navParams.get('idEvent'),0);
    }else{
      $('.ok_rdv:last').css('background','#007BC0');
      $('.ok_rdv:first').css('background','lightgray');
      this.comfirmed(this.navParams.get('idEvent'),1);
    }
  }

  //Lors du clique pour valider un rdv
  public comfirmed(id, comfirmed){
    this.responserdv = [];
    if(comfirmed == 1){
      this.responserdv.push({
        id: id,
        comfirmed: 0,
          id_sender: this.id_sender
      });
    }else{
      this.responserdv.push({
        id: id,
        comfirmed: 1,
          id_sender: this.id_sender
      });
    }
    //Envoi comfirmed
    this.annuaire.postRdvComfirmed(JSON.stringify(this.responserdv)).then(data => {
      this.rdv = [];
      this.validRdv = [];
      this.waitRdv = [];
      this.refuseRdv = [];
      this.allRdv = [];
    });
  }

  public setResponse(id_response,type){
    $('.event-content').find('#event-content').find('.participation').find(".response").css("background","#fff");
    $('.event-content').find('#event-content').find('.participation').find(".response").css("color","#E90000");
    $("#response_"+id_response).css("background","#E90000");
    $("#response_"+id_response).css("color","#fff");

    if(type != 'init'){
      var params = [];
      params.push({
        user : this.id_user,
        event : this.id_event,
        response : id_response
      });
      if(this.event_user_response == 0){
        this.eventsSrv.postUserResponse(JSON.stringify(params)).then(res =>{
          this.getUsersResponses();
          this.event_user_response = id_response;
        });
      }else{
        this.eventsSrv.updateUserResponse(JSON.stringify(params)).then(res =>{
          this.getUsersResponses();
          this.event_user_response = id_response;
        });
      }
    }
  }

  //Convert Date to readable date
  public transformDate(dateString) {
    let d = new Date(dateString.replace(/-/g, "/"));
    var datestring = ("0" + d.getDate()).slice(-2) + " " +this.listMonth[d.getMonth()]+ " "+ d.getFullYear() + " - " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    return datestring;
  }

  private getEvent(){
    this.eventsSrv.getEvent(this.id_event).subscribe(data =>{
      this.event = data;
      this.event = this.event[0];
      this.day = this.event.day;
      this.month = this.event.month;
      this.summary = this.event.summary;
      this.year = this.event.year;
      this.hour = this.event.hour;
      this.minutes = this.event.minutes;
      this.loc_title = this.event.loc_title;
      this.loc_address = this.event.loc_address;
      this.unix_time = this.event.dtstart;
      this.contact_id = this.event.created_by;
      this.lieu = this.event.lieu;
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

      this.getUserResponse();
      this.getUsersResponses();

      if(this.id_user == this.contact_id){
        $('.open-message').remove();
      }

      if(this.event.img){
        $('#img_event').css("backgroundImage", "url('https://hautier.teamsmart.fr/"+this.event.img+"')");
      }else{
        $('#img_event').hide();
        $('#event-content').css('margin-top','50px');
      }

      if(this.event.loc_lat == null || this.event.loc_long == null){
        $('#event-place').css('display','none');
      }

      if(this.event.description.length != 0) {
        $("#event-desc").html(this.event.description);
      }else{
        $("#event-desc").html("Aucune information à afficher.");
      }

      $('#load, #loader').hide();

    });
  }

  private getUsersResponses(){
    this.eventsSrv.getUsersResponse(this.id_event).subscribe(data =>{
      this.usersEventsLength = data.length;
      this.usersEvents = data;
      if(this.usersEventsLength != 0){
        this.userNb = this.usersEvents[0].nbUsers;
      }
    });
  }

  private getUserResponse(){
    this.eventsSrv.getUserResponse(this.id_user, this.id_event).subscribe(data =>{
      console.log('USER RESPONSE');
      console.log(data);
      if(data.length != 0){
        this.event_user_response = data[0].response;
        this.setResponse(this.event_user_response,'init');
      }
    });
  }

  private getCustom(){
    this.eventsSrv.getCustom(this.id_event).subscribe(data =>{
      this.custom = data;
      this.custom = this.custom[0];
      this.org_title = this.custom.org_title;
      $('#load, #loader').hide();
    });
  }

  public goBack() {
    if(this.navParams.get('originPage') == "detail_ent"){
        this.navCtrl.setRoot('DetailEntreprisePage', {
          param: this.id_ent
        });
    }
    if(this.way != 'list'){
      if(this.navParams.get('originPage') == "rendez-vous"){
        this.navCtrl.setRoot('RendezVousEventPage');
      }else{
        this.navCtrl.setRoot('EventsListPage', {
          param: this.navParams.get('id')
        });
      }
    }else {
      this.navCtrl.setRoot('EventsListPage', {
        param: this.navParams.get('id')
      });
    }
  };

  public getDate(tmstp){
    var date = new Date(tmstp*1000);
    var year = date.getFullYear();
    var month = "0" + date.getMonth();
    var day = "0" + date.getDate();
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    var formattedTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
  }

  public openAgenda(){
    this.calendar.createEventInteractively(this.summary, this.loc_address, "Ajouté depuis l'application.", new Date(this.getDate(this.unix_time)), new Date(this.getDate(this.event.dtend))).then(
      (msg) => { console.log('msg' + msg); },
      (err) => { console.log('err' + err); }
      );
  }


  //Fonction pour recup le user connecté
  public getUser(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {})
      .then(res => {
        this.id_user = res.rows.item(0).id_user;
        if(this.way == "event"){
          this.getEvent();
          //this.getCustom();
        }else if(this.way == "rdv"){
          this.getRdv(this.id_event);
        }
      });
    });
  }

  public openProfil(){
    this.navCtrl.setRoot('place-detail',{
      param: this.contact_id,
      idCat: 'team'
    });
  }

  //Function pour enoyer un message
  public goToMessage(){

    this.contactSrv.getMessageDemandeBySenderReceiver(this.id_user,this.contact_id).subscribe(data => {
      if(data.length == 0){
        var params = [];
        params.push({
          user_id_sender: this.id_user,
          user_id_receiver: this.contact_id,
          name_sender: this.event.name_sender,
          name_receiver: this.contact_name,
          demande : "demande",
          sujet : "sujet",
        });
        this.contactSrv.postMessageDemande(JSON.stringify(params)).then(response => {
          this.contactSrv.getMessageDemandeBySenderReceiver(this.id_user,this.contact_id).subscribe(data2 => {
            this.navCtrl.setRoot('DetaildemContactPage',{
              param: data2[0].id,
              id_sender: data2[0].user_id_sender,
              id_receiver: data2[0].user_id_receiver,
              page_sender: "detail_user",
              paramRetour: this.navParams.get("param"),
              idCat: this.navParams.get("idCat"),
              type: 'user',
              id_rdv: this.id_event,
              origin: this.way
            });
          });

        });
      }else{
        this.navCtrl.setRoot('DetaildemContactPage',{
          param: data[0].id,
          id_sender: data[0].user_id_sender,
          id_receiver: data[0].user_id_receiver,
          page_sender: "detail_user",
          paramRetour: this.navParams.get("param"),
          idCat: this.navParams.get("idCat"),
          type: 'user',
          id_rdv: this.id_event,
          origin: this.way
        });
      }
    });

  }


}
