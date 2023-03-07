import {Component, ViewChild} from '@angular/core';
import {
  NavController, NavParams, ModalController, Platform, AlertController, Select, IonicPage,
  ToastController
} from 'ionic-angular';
import { EventsServiceProvider } from '../../../providers/events-service/events-service';
import { SqliteServiceProvider } from '../../../providers/sqlite-service/sqlite-service';
import { AnnuaireServiceProvider } from '../../../providers/annuaire-service/annuaire-service';
import { MeteoServiceProvider } from '../../../providers/meteo-service/meteo-service';
import { Toast } from '@ionic-native/toast';
import * as $ from 'jquery';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';
import { Calendar } from '@ionic-native/calendar';
import {HomeServiceProvider} from "../../../providers/home-service/home-service";

@IonicPage()
@Component({
  selector: 'page-events-list',
  templateUrl: 'liste.html'
})

export class EventsListPage {
  @ViewChild('SelectCat') selectCat: Select;
  agenda : any;
  nom : string;
  free : string;
  child : string;
  categ : string;
  _map : boolean;
  id_user: number;
  ent_selected: number;
  //Events du jours
  eventsDay : any = [];
  //Events du mois
  eventsMonth: any = [];
  eventsFull: any;
  //Tous les events
  allEvents: any;
  //Affichage du jour dans le html (filtre mois)
  //Time en Unix set par defaut aujourd'hui 00h00
  unix_time: number;
  //Time du début de mois set au premier du mois à minuit
  //Liste des mois (pour traduction)
  listMonth: any;
  listDay: any;
  //Affichage des jours et mois dans le html
  day: number[] = [];
  day_number: any;
  day_month : string;
  day_year: number;
  day_name: string;
  //Affiche mois dans html (filtre mois)
  month: string[] = [];

  date: Date = new Date();
  type: 'string';

  filter: number = 0;
  fsc: boolean;

  calendars: any;
  meteo: any;
  temp:any;
  summary:any;
  categories:any;
  eventsLength: number = 0;
  eventsDayLength: number = 0;
  eventsMonthLength: number = 0;
  today: string;

  catSelected: any;
  right_add: boolean = false;

  constructor(public navCtrl: NavController,public calendar:Calendar, public navParams: NavParams, public toast: Toast,
              public eventsSrv: EventsServiceProvider, public meteoSrv:MeteoServiceProvider,private plt: Platform,
              private storage:Storage, public annuaire:AnnuaireServiceProvider, public modalCtrl: ModalController,
              public sqlite: SqliteServiceProvider, public Sqlite: SQLite, public alertCtrl: AlertController,
              private homeSrv: HomeServiceProvider, private toastCtrl: ToastController) {
    this.getUser();
    //Défintion unix_time à aujourd'hui a 00h00
    let date_day = new Date();
    date_day.setHours(0,0,0,0);
    let day: any = date_day.getDate();
    if(day < 10){
      day = "0"+day;
    }
    let month: any = date_day.getMonth()+1;
    if(month < 10){
      month = "0"+month;
    }
    this.today = date_day.getFullYear() + '-'+month+'-'+day;
    this.unix_time = Math.round(date_day.getTime()/1000.0);
    //Initialisation date debut de mois
    this.listMonth = ['Janvier','Fevrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Decembre'];
    this.listDay = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
    //this.setDate();
    this.getCategories();
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

  private getCategories(){
    this.eventsSrv.getEventCategories('all',this.id_user).subscribe(data =>{
      this.categories = data;
    });
  }

  //Ouvre le filtre
  public openFilter(){
    this.selectCat.open();
  }

  private getUser(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {})
        .then(res => {
          this.id_user = res.rows.item(0).id_user;
          this.homeSrv.getHasRight(this.id_user,107).subscribe(data => {
            if(!data){
              let toast = this.toastCtrl.create({
                message: 'Vous n\'avez pas les droits d\'accès à cette fonctionnalité.',
                duration: 3000,
                position: 'bottom'
              });

              toast.present();
              this.navCtrl.setRoot('home-home',{});
            }else{
              this.homeSrv.getHasRight(this.id_user,108).subscribe(data => {
                this.right_add = data;
              });
            }
          });
          this.Sqlite.create({
            name: 'ionicdb.db',
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('SELECT * FROM ent_selected', {}).then(res => {
              this.ent_selected = res.rows.item(0).id_ent;
              this.getAllEntEvents();
            })
          });
          this.annuaire.getEmployeById(this.id_user).subscribe(data => {
            var load = setInterval(function(){
              if($('#img_avatar')!=undefined) {
                if(data[0].image) {
                  $("#img_avatar").css("background-image","url('https://hautier.teamsmart.fr/images/entreprise/profils/"+data[0].image+"')");
                }else{
                  $("#img_avatar ion-icon").css("display", "block");
                }
                clearInterval(load);
              }
            },50);
          });
          this.displayDate();
        });
    });
  }

  private displayDate(){
    var date = new Date(this.unix_time*1000);
    this.day_number = date.getDate();
    if(this.day_number < 10){
      this.day_number = "0"+this.day_number;
    }
    this.day_name = this.listDay[date.getDay()];
    this.day_month = this.listMonth[date.getMonth()];
    this.day_year = date.getFullYear();
  }

  private getAllEntEvents(){
    this.eventsSrv.getAllEntEvents(this.ent_selected, this.id_user).subscribe(data => {
      this.allEvents = data;
      this.eventsLength = this.allEvents.length;
      this.sortDayMonth();
    });
  }

  private sortDayMonth(){
    this.eventsDay = [];
    this.eventsMonth = [];
    this.sortDay();
    this.sortMonth();
    $('#load, #loader').hide();
  }

  private sortDay(){
    for(var i = 0; i < this.allEvents.length; i++){
      if(this.today == this.allEvents[i].datedebut){
        this.eventsDay.push(this.allEvents[i]);
      }
    }
    this.eventsDayLength = this.eventsDay.length;
    if(this.eventsDayLength == 0){
      this.showMonth();
    }
  }

  private sortMonth(){
    var today = this.today.split('-');
    var month = today[0]+'-'+today[1];
    for(var i = 0; i < this.allEvents.length; i++){
      var date = this.allEvents[i].datedebut.split('-');
      if(month == date[0]+'-'+date[1]){
        this.eventsMonth.push(this.allEvents[i]);
      }
    }
    this.eventsMonthLength = this.eventsMonth.length;
    if(this.eventsMonthLength == 0){
      this.openCalendar();
    }
  }

  public navDays(time){
    this.unix_time = this.unix_time+time;
    let date_day = new Date(this.unix_time*1000);
    date_day.setHours(0,0,0,0);
    let day: any = date_day.getDate();
    if(day < 10){
      day = "0"+day;
    }
    let month: any = date_day.getMonth()+1;
    if(month < 10){
      month = "0"+month;
    }
    this.today = date_day.getFullYear() + '-'+month+'-'+day;
    this.displayDate();
    this.sortDayMonth();
  }

  //Convert Date to readable date
  public transformDate(dateString) {
    if(dateString != undefined && dateString != null){
      let d = new Date(dateString.replace(/-/g, "/"));
      var datestring = ("0" + d.getDate()).slice(-2) + " " +this.listMonth[d.getMonth()]+ " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
      return datestring;
    }
  }

  private cutName(string){
    if(string.length >31){
      return string.substring(0, 29) + '...';
    }else{
      return string;
    }
  }

  public AddEvent(){
    this.navCtrl.setRoot('events-formulaire');
  }

  public goBack() {
    this.navCtrl.setRoot('home-home');
  }

  public goToUser(){
    this.navCtrl.setRoot('place-detail', {
      param: this.id_user,
      idCat: "team",
      prov: "agenda",
      data_agenda: this.navParams.get('param')
    });
  }

  public goToDetailEvent(id, way){
    this.navCtrl.setRoot('event-detail', {
      idEvent: id,
      type : way,
      id : this.navParams.get('param'),
      my_user_id: this.id_user
    });
  }

  public setFilter(){
    var id =  this.catSelected;
    if(id == '0'){
      $('.agenda-item').show();
    }else{
      $('.agenda-item').hide();
      $('.event-cat-'+id).show();
    }
  }

  // Affiche tous les événements
  public openCalendar() {
    $('#calendar_day, #calendar_month').hide();
    $('#calendar_full').show();
    $('#filter_mois, #filter_jour').css("border-bottom-style","none");
    $('#filter_mois, #filter_jour').css("color","black");
    $('#filter_full').css("border-bottom-style","solid");
    $('#filter_full').css("color","#FFC107");
  }

  // Affiche tous les événements du mois
  public showMonth(){
    $('#calendar_day, #calendar_full').hide();
    $('#filter_jour, #filter_full').css("border-bottom-style","none");
    $('#filter_jour, #filter_full').css("color","black");
    $('#calendar_month').show();
    $('#filter_mois').css("border-bottom-style","solid");
    $('#filter_mois').css("color","#FFC107");
  }

  // Affiche tous les événements du jour
  public showDay(){
    $('#calendar_day').show();
    $('#filter_mois, #filter_full').css("border-bottom-style","none");
    $('#filter_mois, #filter_full').css("color","black");
    $('#calendar_month, #calendar_full').hide();
    $('#filter_jour').css("border-bottom-style","solid");
    $('#filter_jour').css("color","#FFC107");

  }

  private unpublishEvent(type,i){
    var id = null;
    if(type == 'day'){
      id = this.eventsDay[i].evdet_id;
    }else if(type == 'month'){
      id = this.eventsMonth[i].evdet_id;
    }else if(type == 'full'){
      id = this.allEvents[i].evdet_id;
    }
    this.eventsSrv.unpublishEvent(id).subscribe(data =>{
      this.getAllEntEvents();
    });
  }

  private setEventPage(type,i){
    var id = null;
    if(type == 'day'){
      id = this.eventsDay[i].evdet_id;
    }else if(type == 'month'){
      id = this.eventsMonth[i].evdet_id;
    }else if(type == 'full'){
      id = this.allEvents[i].evdet_id;
    }
    this.navCtrl.setRoot('events-formulaire',{
      ev_id : id,
      loc_id : this.ent_selected,
    })
  }

  public eventOptions(type,i){
    let alert = this.alertCtrl.create({
      title: 'Options',
      message: 'Que souhaitez-vous faire avec cet événement ?',
      buttons: [{
          text: 'Modifier',
          handler: () => {
            this.setEventPage(type,i);
          }
        }, {
          text: 'Supprimer',
          handler: () => {
            this.unpublishEvent(type,i);
          }
        }
      ]
    });
    alert.present();
  }

}
