import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController} from "ionic-angular";
import * as $ from 'jquery';
import {ContentserviceProvider} from "../../../providers/contentservice/contentservice";
import {MeteoServiceProvider} from "../../../providers/meteo-service/meteo-service";

@IonicPage()
@Component({
    selector: 'page-demande-conge',
    templateUrl: 'demande.html',
})
export class DemandeCongesPage {

  user: any = "";
  userinfo: any = "";
  cats: any[] = [];
  catsUser: any[] = [];
  ent: any;
  solde_restant: any = null;
  soldeconge: any;
  solde_absence: any;
  max: boolean;
  datetoday: any;
  nosolde: boolean = false;
  samedi: any;
  joursferies: any;
  solde_samedi: any;
  nb_samedi: any;
  note: string = "";
  all_day: boolean = false;
  morning: boolean = false;
  afternoon: boolean = false;
  cat: any = "";
  errors: any = [];
  type: any = 0;
  demi: any = 0;
  nb_jours: any = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private contentSrv: ContentserviceProvider,
              private alertCtrl: AlertController, private meteoSrv: MeteoServiceProvider, private toastCtrl: ToastController) {

    this.user = this.navParams.get("user");
    this.ent = this.navParams.get("ent");
    //this.getJourFerier();
    this.getRhAbsenceCat(this.ent,this.user);
    this.getRhCatUser(this.ent,this.user);
    /*this.getRHAbsenceSolde(this.user, this.ent);
    this.getSoldeConge(this.user, this.ent);
    this.getUserInfo(this.user);*/
    this.getCurrentDate();

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
      this.navCtrl.setRoot('CompteRhPage',{});
    }

    public getSoldeConge(user, ent){
      this.contentSrv.getSoldeUser(user, ent).subscribe(data => {
        if(data.length > 0){
          this.nosolde = false;
          this.soldeconge = data;
          this.samedi = this.soldeconge[0].samedi;
          this.type = "Conge";
        } else {
          this.nosolde = true;
        }
      });
    }

    public getRHAbsenceSolde(user,cli){
      this.contentSrv.getRhAbsenceCatUser(user,cli).subscribe(data => {
        this.solde_absence = data;
      });
    }

    public getUserInfo(user){
        this.contentSrv.getUserInfo(user).subscribe(data => {
            this.userinfo = data[0];
        });
    }

    public getRhAbsenceCat(ent,user){
        this.contentSrv.getRhAbsenceCat(ent,user).subscribe(data => {
            this.cats = data;
        });
    }

    public getRhCatUser(ent,user){
      this.contentSrv.getCategorieDemande(ent,user).subscribe(data => {
        this.catsUser = data;
      });
    }

    public getJourFerier(){
      this.meteoSrv.getJourFerier().subscribe(data => {
          this.joursferies = data;
      });
    }

    public sendDemande(){
      let reponses : any = [{
        categorie_id : this.cat,
        type : this.type,
        demi : this.demi,
        date_debut : $('#datedebut').val(),
        date_fin : ($('#datefin').val() == null || $('#datefin').val() == undefined)?$('#datedebut').val():$('#datefin').val(),
        user_id : this.user,
        cli_id: this.ent,
        nb_jours: this.nb_jours
      }];
      this.contentSrv.sendDemande(JSON.stringify(reponses)).then(data => {
        if(data){
          this.goBack();
        }else{
          this.presentToast("Un problème a été rencontré lors de l'enregistrement.")
        }
      });
    }


    public days_between(date1, date2) {

        // split the date into days, months, years array
        let x : any = date1.split('-')
        let y : any = date2.split('-')

        // create date objects using year, month, day
        let a : any = new Date(x[0],x[1],x[2]);
        let b : any = new Date(y[0],y[1],y[2]);

        // calculate difference between dayes
        var c : any = b - a

        // convert from milliseconds to days
        // multiply milliseconds * seconds * minutes * hours
        var d : any = c / (1000 * 60 * 60 * 24)

        // show what you got
        return d + 1;

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
        this.datetoday = date.getFullYear()+'-'+month+'-'+day;
    }

    private nb_jour(date1,date2){

        var datedebut = new Date(date1);
        var datefin = new Date(date2);
        var nb = 0;
        var solde_samedi = this.samedi;
        var nb_samedi = 0;
        if(datefin.getDay() == 5){
            datefin = new Date(datefin.setDate(datefin.getDate()+1));
            datefin = new Date(datefin.setDate(datefin.getDate()+1));
        }
        if(datedebut.getDay() == 6){
            datedebut = new Date(datedebut.setDate(datedebut.getDate()+1));
            datedebut = new Date(datedebut.setDate(datedebut.getDate()+1));
        }
        if(datedebut.getDay() == 0){
            datedebut = new Date(datedebut.setDate(datedebut.getDate()+1));
        }
        var ferie;
        while (datedebut.getTime() <= datefin.getTime()) {
            ferie = false;
            for (let i = 0; i < this.joursferies.length; i++) {
                let jour = new Date(this.joursferies[i]["date"]);
                if (datedebut.getTime() == jour.getTime()){
                    ferie = true;
                }
            }
            if(ferie == false){
                if(datedebut.getDay() != 0){
                    if(solde_samedi > 0 && datedebut.getDay() == 6){
                        nb += 1;
                        solde_samedi = solde_samedi - 1;
                        nb_samedi += 1;
                        //alert('test');
                    } else if (datedebut.getDay() != 6){
                        nb += 1
                    }

                }
            }
            datedebut = new Date(datedebut.setDate(datedebut.getDate()+1))
        }
        this.samedi = solde_samedi;
        this.nb_samedi = nb_samedi;

        return nb;

    }

  // Fonction de fait des toasts
  private presentToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {});

    toast.present();
  }

  public checkForm(){
    this.errors = [];
    if(this.cat == ""){
      this.errors.push("La categorie est obligatoire");
    }
    if(!this.all_day && !this.morning && !this.afternoon){
      this.errors.push("La durée est obligatoire");
    }

    if(this.errors.length == 0){
      this.calculSolde();
    }
  }

  private calculSolde(){
    let params : any = [{
      categorie_id : this.cat,
      type : this.type,
      demi : this.demi,
      date_debut : $('#datedebut').val(),
      date_fin : $('#datefin').val(),
      user_id : this.user,
      cli_id: this.ent
    }];
    this.contentSrv.calculSolde(JSON.stringify(params)).then(_res => {
      let res: any = _res;
      this.errors = [];

      let cat_selected : any = this.catsUser.filter(cat => cat.id == this.cat);
      cat_selected = cat_selected[0];
      if(!res.inspect){
          this.errors.push(`La date de rénitialisation (${new Date(res.date_reset).toLocaleDateString(undefined)}) est compris dans votre demande il faut faire 2 demandes différentes`);
      } else if(res.nb_jours == 0) {
          this.errors.push(`Période non valide`);
      } else if(res.restant_2 - res.nb_jours < 0 && cat_selected.max_day == 1){
          this.errors.push('Solde insufisant');
      }

      if(this.errors.length == 0){
        this.nb_jours = res.nb_jours;
        this.sendDemande();
      }
    });
  }

  public changeCat(){
    this.errors = [];
    let cat: any = this.catsUser.filter(c => c.id == this.cat);
    var date = new Date();
    date.setDate(date.getDate() + parseInt(cat[0].nb_day_demande));
    let day : any = date.getDate();
    if(day < 10){
        day = "0"+day;
    }
    var month : any = date.getMonth()+1;
    if(month < 10){
        month = "0"+month;
    }
    this.datetoday = date.getFullYear()+'-'+month+'-'+day;
  }

  public changeType(type,demi){
    this.errors = [];
    this.type = type;
    this.demi = demi;
    if(type == 2){
      this.all_day = true;
      this.morning = false;
      this.afternoon = false;
    }else if(demi == 1){
      this.morning = true;
      this.all_day = false;
      this.afternoon = false;
    }else if(demi == 2){
      this.afternoon = true;
      this.all_day = false;
      this.morning = false;
    }
  }
  
}
