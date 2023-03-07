import { Component, ViewChild } from '@angular/core';
import { LoadingController, NavController, NavParams, ToastController, AlertController, IonicPage} from 'ionic-angular';
import { Nav } from 'ionic-angular';
import * as $ from 'jquery';
import { AnnuaireServiceProvider } from '../../../providers/annuaire-service/annuaire-service';
import { Storage } from '@ionic/storage';
import { ContactServiceProvider } from "../../../providers/contact-service/contact-service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RendezVousEventPage} from "../rendez_vous/rendez_vous";

@IonicPage()
@Component({
  selector: 'page-appointment',
  templateUrl: 'appointment.html'
})
export class AppointmentPage {
  id_cli: any;
  subject: any;
  @ViewChild(Nav) nav: NavController;
  load: boolean = true;
  id_receiver: number = 0;
  id_sender: number;
  title: any;
  desc: any;
  lieu: any;
  unix_time: any;
  date : any;
  receiverTitle: any;
  senderTitle: any;

  response: any = [];

  originPage: string;

  teamcolor1: string = null;
  teamcolor2: string = null;
  fsccolor1: string = null;
  fsccolor2: string = null;

  ent: any;
  contact: any;
  filtreTeam: boolean = false;

  jourRDV: any;
  moisRDV:any;
  anneeRDV:any;
  heureRDV:any;
  minuteRDV:any;

  sender:any;
  receiver:any;
  id_ent: any;

  constructor(public navParams: NavParams, private storage: Storage,private contactSrv: ContactServiceProvider,
              public annuaire:AnnuaireServiceProvider, public navCtrl: NavController,public alertCtrl: AlertController,
              private toast: ToastController, private http: HttpClient, private loadingCtrl: LoadingController) {

    this.originPage = this.navParams.get("originPage");
    this.id_sender = this.navParams.get("idSender");
    this.id_receiver = this.navParams.get("idTW");
    this.id_ent = this.navParams.get("id_ent");
    this.id_cli = this.navParams.get("id_cli");
    if(this.id_ent != null && this.id_ent != undefined){
      this.setHiddenEnt();
    }
    this.contactSrv.getFCMByUSer(this.id_sender).subscribe(data =>{
      this.sender = data;
    });
    if(this.originPage == "detail"){
      this.id_receiver = this.navParams.get("idReceiver");
      this.getData();
    }else{
      if(this.id_ent != null && this.id_ent != undefined){
        this.getData();
      }
      //this.getContact();
      this.getEnt();
      //this.getTeam(this.id_ent);
    }


    var today = new Date();
    var annee = today.getFullYear();
    let mois = (today.getMonth())+1;
    let mois2 = "";
    if(mois < 10){
      mois2 = "0"+mois;
    }
    let jour = today.getDate();
    let jour2 = "";
    if(jour < 10){
      jour2 = "0"+jour;
    }
    $('#date').val(annee+'-'+mois2+'-'+jour2);
    $('#time').val('00:00');
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

    let t = new Date();
    this.anneeRDV = t.getFullYear();
    this.moisRDV = (t.getMonth())+1;
    if(this.moisRDV < 10){
      this.moisRDV = "0"+this.moisRDV;
    }
    this.jourRDV = t.getDate();
    if(this.jourRDV < 10){
      this.jourRDV = "0"+this.jourRDV;
    }

    this.heureRDV = t.getHours();
    if(this.heureRDV < 10){
      this.heureRDV = "0"+this.heureRDV;
    }

    this.minuteRDV = t.getMinutes();
    if(this.minuteRDV < 10){
      this.minuteRDV = "0"+this.minuteRDV;
    }

    this.minuteRDV = Math.ceil(parseInt(this.minuteRDV)/10)*10;
    if(this.minuteRDV == 60){
      this.minuteRDV = 0;
      this.heureRDV = parseInt(this.heureRDV)+1;
    }

    if(parseInt(this.minuteRDV) < 10){
      this.minuteRDV = "0"+this.minuteRDV;
    }

    if(parseInt(this.heureRDV) < 10){
      this.heureRDV = "0"+this.heureRDV;
    }

    $('#date').val(this.anneeRDV+'-'+this.moisRDV+'-'+this.jourRDV);
    $('#time').val(this.heureRDV+":"+this.minuteRDV);
  }

  ionViewWillLeave(){
    //Remove all delegated click handlers
    $(".myBackArrow").off();
  }


  getEntreprise(user){
    this.annuaire.getEntreprise(user).subscribe(data => {
      this.id_ent = data[0].loc_id;
    });
  }

  private getData(){
    this.annuaire.getEmployeById(this.id_receiver).subscribe(data => {
      this.receiverTitle = data[0].prenom+" "+data[0].nom;
    });
    this.annuaire.getEmployeById(this.id_sender).subscribe(data =>{
      this.senderTitle = data[0].prenom+" "+data[0].nom;
    });
  }

  public verifForm(){
    var inspect = true;
    var inspect1 = true;
    var subject = this.subject;
    var subject_css = $('#subject');
    var user = $('#select-contact');
    var desc = $('#desc');
    var lieu = this.lieu;
    var lieu_css = $('#lieu');
    var date = $('#date');
    var time = $('#time');
    if(this.id_receiver == null){
      if(this.id_receiver == null || this.id_receiver == undefined || this.id_receiver == 0){
        user.css('border-color','red');
        inspect = false;
      }else{
        user.css('border-color','lightgrey');
      }
    }
    if(subject == ""){
      subject_css.css('border-color','red');
      inspect = false;
    }else{
      subject_css.css('border-color','lightgrey');
      this.title = subject;
    }
    if(desc.val() == ""){
      desc.css('border-color','red');
      inspect = false;
    }else{
      desc.css('border-color','lightgrey');
      this.desc = desc.val();
    }
    if(lieu == ""){
      lieu_css.css('border-color','red');
      inspect = false;
    }else{
      lieu_css.css('border-color','lightgrey');
      this.lieu = lieu;
    }
    if(date.val() == ""){
      date.css('border-color','red');
      inspect = false;
    }else{
      date.css('border-color','lightgrey');
    }
    if(time.val() == ""){
      time.css('border-color','red');
      inspect = false;
    }else{
      time.css('border-color','lightgrey');
    }

    var da = new Date();
    var db = new Date(date.val());
    this.date = date.val()+" "+time.val()+":00";
    let date_day = new Date(this.date);
    this.unix_time = Math.round(date_day.getTime()/1000.0);

    if(da > db){
      date.css('border-color','red');
      inspect1 = false;
    }else{
      date.css('border-color','lightgrey');
    }

    if(inspect){
      this.contactSrv.getFCMByUSer(this.id_receiver).subscribe(data =>{
        this.receiver = data;
        this.sendDatas();
      });
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

  private sendDatas(){
      let loader = this.loadingCtrl.create({
          content: "Ajout de l'événement ..."
      });
      loader.present();
    this.response.push({
      id_sender : this.id_sender,
      id_receiver : this.id_receiver,
      name_sender: this.senderTitle,
      name_receiver: this.receiverTitle,
      title: this.title,
      description: this.desc.replace('\\r\\n', '<br/>'),
      date: this.date,
      unix_time: this.unix_time,
      lieu: this.lieu
    });

    //Envoi rdv
    this.annuaire.postRdv(JSON.stringify(this.response)).then(data => {
      let response = data;
      if(response != null){
        let alert = this.alertCtrl.create({
          title: 'Oups...',
          message: "L'envoi de la réponse a connu un problème...",
          buttons: ['Fermer']
        });
        alert.present();
      }else{
        for(var i = 0; i < this.receiver.length; i++){
          loader.dismiss();
          this.sendNotification(this.receiver[i].code_fcm,'Nouvelle demande de rendez-vous.');
        }
      }
    });
    if(this.navParams.get("originPage") == "detail"){
      //Redirige vers la page détails
      this.navCtrl.setRoot('place-detail',{
        idCat: this.navParams.get("idCat"),
        param: this.navParams.get("param")
      });
      //Redirige vers la liste de rdv
    }else{
      this.navCtrl.setRoot('RendezVousEventPage');
    }
  }

  public sendNotification(fcm,response) {
    let body = {
      "notification":{
        "title":this.senderTitle,
        "body": "Nouvelle demande de rendez-vous.",
        "sound":"default",
        "icon":"fcm_push_icon"
      },
      "data":{
        "param1":this.id_sender,
        "param2":this.id_receiver
      },
      "to":fcm,
      "priority":"high",
      "restricted_package_name":""
    };
    let options = new HttpHeaders().set('Content-Type','application/json');
    this.http.post("https://fcm.googleapis.com/fcm/send",body,{
      headers: options.set('Authorization', 'key=AAAApmrOPXE:APA91bEvFQYflu0B5UJxLhtxXHUyyIWX98eeoyVS6OqFW8Kul37-6PwnsrURGL9EL2uygJExXgkOYCWS0mWtj07dCv4IhvhydL5KyXx3AhR2N5hWD_JZaaoxZy_GzhB1lWavdvdaEjiP'),
    })
      .subscribe(
        (value) => console.log("Succes",value),
        (err) => console.log("Fail",err),
        () => console.log("Complete")
      );
  }

  public getContact(){
    this.annuaire.getTWList(this.id_cli).subscribe(data =>{
      this.contact = data;
    });
  }

  public getEnt(){
    this.annuaire.getLvl2ListRDV(this.id_cli,this.id_sender).subscribe(data => {
      this.ent = data;
      this.ent.sort(function(a,b) {return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0);} );
      var enttest = [];
      for(let i=0; i<this.ent.length;i++){
          if(this.ent[i].entreprise==1){
              enttest.push(this.ent[i]);
          }
      }
      this.load = false;
    });
  }

  public setContact(){
    this.id_receiver =  $("#select-contact").val();
    this.getData();
  }

  public setFiltreEnt(){
    let id_ent = $("#select-filtre-ent").val();
    this.annuaire.getTeam(id_ent).subscribe(data => {
      this.contact = data;
      $("#select-contact").val($("#select-contact option:first").val());
      this.id_receiver = null;
      this.filtreTeam = true;
    });
  }

  public getTeam(ent){
    this.annuaire.getTeam(ent).subscribe(data => {
        this.contact = data;
        $("#select-contact").val($("#select-contact option:first").val());
        this.id_receiver = null;
        this.filtreTeam = true;
    });
  }

  public setHiddenEnt(){
    let id_ent =  this.id_ent;
    this.annuaire.getTeam(id_ent).subscribe(data => {
      this.contact = data;
      $("#select-contact").val($("#select-contact option:first").val());
      this.id_receiver = null;
      this.filtreTeam = true;
    });
  }


  public goBack() {
    if(this.navParams.get("originPage") == "detail"){
      //Redirige vers la page détails
      this.navCtrl.setRoot('place-detail',{
        idCat: this.navParams.get("idCat"),
        param: this.navParams.get("param")
      });
      //Redirige vers la liste de rdv
    }else{
      this.navCtrl.setRoot('RendezVousEventPage',{
          id_cli: this.navParams.get("id_cli"),
          id_ent: this.navParams.get("id_ent")
      });
    }
  }
}
