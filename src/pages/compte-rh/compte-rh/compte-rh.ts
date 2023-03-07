import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, IonicPage, ToastController} from "ionic-angular";
import {ContentserviceProvider} from "../../../providers/contentservice/contentservice";
import {AnnuaireServiceProvider} from "../../../providers/annuaire-service/annuaire-service";
import * as $ from 'jquery';
import { Chart } from 'chart.js';
import {HomeServiceProvider} from "../../../providers/home-service/home-service";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";

@IonicPage()
@Component({
    selector: 'page-compte-rh',
    templateUrl: 'compte-rh.html',
})
export class CompteRhPage {

  @ViewChild('doughnutCanvas') doughnutCanvas;
  user: any;
  ent: any;
  solde: any = [];
  solde_absence: any = [];
  solde_today: any;
  soldehistorique: any;
  solde_restant: number;
  solde_pris: number;
  solde_acquis: number;
  annee: any;
  annee_libelle: any;
  today_annee: any;
  private doughnutChart: any;
  soldeRhCat: any;
  rhCatUser: any;
  rhCat: any;
  demandes: any = [];
  total: string = "";
  cat: any;
  datetoday: any;
  rtt_user: any;
  conge_user: any;
  demandeconge: any[] = [];
  demandeabsence: any[] = [];
  catsUser: any = [];
  tabs_list: any = [];
  _i: number = 0;
  _i_abs: number = 0;
  _id_abs : any = [];
  labelsabsences: any = ['Pris','Restants'];
  current_abs: any;
  abs: boolean = false;
  right_all: boolean = false;
  right_list: boolean = false;


  rh_add: boolean = false;
  curr_max_solde: number = 0;
  empty_msg: boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams, private contentSrv: ContentserviceProvider,
              private annuaireSrv: AnnuaireServiceProvider, private homeSrv: HomeServiceProvider,
              private toastCtrl: ToastController, private Sqlite: SQLite) {

    this.getUser();
  }

  ionViewDidLoad(){
    var self = this;
    // C'est dégueulasse mais c'est la seule solution
    var load = setInterval(function(){
      if($('.container-graph-conge').length != 0 && $('#conge-tab').length != 0){
        self.getCurrentDate();
        self.getRhAbsenceCatUser(self.user, self.ent);
        self.getRhAbsenceCatUserLink(self.user);
        self.getRhAbsenceCat(self.ent,self.user);
        self.getDemande(self.user);
        self.getSoldeHistorique(self.user);
        self.getSoldeConges(self.user, self.ent);
        self.getRhCatUser(self.user);
        self.getRHAbsenceSolde(self.user, self.ent);
        clearInterval(load);
      }
    },200);
  }

  ionViewWillEnter(){
      $('.back_arrow').css("visibility","hidden");
      $('.forward_arrow').css("visibility","hidden");
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

  private getUser(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', []).then(res => {
        this.user = res.rows.item(0).id_user;
        this.hasRight();
        this.getEntSelected();
      });
    });
  }

  private getEntSelected(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM ent_selected', []).then(res => {
        this.ent = res.rows.item(0).id_ent;
        this.checkCongesParameters();
      });
    });
  }
  
  private checkCongesParameters(){
    this.contentSrv.getCongeParameters(this.user, this.ent).subscribe(data => {
      if(data.type_conges == 0 || data.periode_day == 0 || data.periode_month == 0){
        this.presentToast("Impossible d'accéder à votre compte RH, un manager doit le configurer");
        this.goBack();
      }
    })
  }

  private hasRight(){
    this.homeSrv.getHasRight(this.user,105).subscribe( data => {
      if(!data){
        this.presentToast("Vous n'avez pas les droits d'accès à cette fonctionnalité.");
        this.navCtrl.setRoot('home-home',{});
      }else{
        this.homeSrv.getHasRight(this.user,51).subscribe( data => {
          this.rh_add = data;
        });
        this.homeSrv.getHasRight(this.user,52).subscribe( data => {
          this.right_list = data;
        });
      }
    });
  }

  public isAllow(){
    if(this.rh_add){
      return true;
    }else{
      return false;
    }
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

  public getRhCatUser(user){
    this.contentSrv.getRhCatUser(user).subscribe(data => {
      this.catsUser = data;
      var ids = [];
      for (const cat of this.catsUser) {
        this._id_abs.push({
          'cat': cat.categorie_id,
          '_id': 0
        });
        if(!ids.some(c => c == cat.categorie_id)){
          this.tabs_list.push(cat);
          ids.push(cat.categorie_id);
        }
      }
    });
  }

  public getSoldeConges(user, cli){
    this.contentSrv.getSoldeUser(user, cli).subscribe(data => {
      this.solde_today = data;
      this.displayChart(this._i);
    });
  }

  public getRHAbsenceSolde(user, cli){
    this.contentSrv.getRhAbsenceCatUser(user, cli).subscribe(data => {
      this.solde_absence = data;
      console.log('SOLDE_ABSENCE',this.solde_absence)
    });
  }

  public displayChart(index){
    this.current_abs = 0;
    this.abs = false;
    if(index != 0){
      if(index == '-'){
        this._i--;
        if(this._i == 0){
          this.annee_libelle = 'Année n (en cours)';
          $('.forward_arrow').css("visibility","hidden");
          $('.back_arrow').css("visibility","visible");
        }
      }else{
        this._i++;
        if(this._i == 1){
          this.annee_libelle = 'Année n-'+this._i;
          $('.back_arrow').css("visibility","hidden");
          $('.forward_arrow').css("visibility","visible");
        }
      }
    }else{
      this.annee_libelle = 'Année n (en cours)';
      if(this.solde_today.length > 1){
        $('.back_arrow').css("visibility","visible");
      }else{
        $('.back_arrow').css("visibility","hidden");
      }
      $('.forward_arrow').css("visibility","hidden");
    }
    this.demandes = [];
    this.total = "";
    var i = this._i;
    if(this.solde_today.length == 1){
      i = 0;
    }
    console.log("demandeconge",this.demandeconge);
    console.log("this.solde_today[i] != undefined",this.solde_today[i]);
    if(this.solde_today[i] != undefined){
      console.log("this.solde_today[i].annee_type == this._i",this.solde_today[i].annee_type + ' == ' + this._i);
      if(this.solde_today[i].annee_type == this._i){
        this.empty_msg = false;
        for (const demandeconge of this.demandeconge) {
          console.log("demandeconge.annee == this.solde_today[i].annee",demandeconge.annee + ' == ' + this.solde_today[i].annee);
          if(demandeconge.annee == this.solde_today[i].annee){
            console.log("IN demandes.push()");
            this.demandes.push(demandeconge);
          }
        }
        this.conge_user = true;
        $('#graph_solde').show();
        var solde_acquis = this.solde_today[i].solde;
        var solde_pris = this.solde_today[i].pris;
        var solde_restant = solde_acquis - solde_pris;
        let dataset = [solde_pris,solde_restant];
        let backgroundColor = ['#678E9B', '#D85756'];
        this.total = solde_acquis;
        let labels =  ['Pris : ' + solde_pris,'Restants : ' + solde_restant];
        this.setChart(dataset,backgroundColor,labels);
      }else{
        $('.back_arrow').css("visibility","visible");
        this.empty_msg = true;
      }
    }else{
      this.empty_msg = true;
    }
  }


  public getSoldeHistorique(user){
      this.contentSrv.getSoldeHistoriqueUser(user).subscribe(data => {
          this.soldehistorique = data;
      });
  }

  public getRhAbsenceCatUser(user, cli){
      this.contentSrv.getRhAbsenceCatUser(user, cli).subscribe(data => {
          this.soldeRhCat = data;
      });
  }

  public getEnt(user){
      this.annuaireSrv.getEntreprise(user).subscribe(data => {
          this.ent = data;
      });
  }

  public getRhAbsenceCat(ent,user){
      this.contentSrv.getRhAbsenceCat(ent,user).subscribe(data => {
          this.rhCat = data;
      });
  }

  public getRhAbsenceCatUserLink(user){
      this.contentSrv.getRhAbsenceCatUserLink(user).subscribe(data => {
          this.rhCatUser = data;
          for (let i = 0; i < data.length ; i++) {
              if(data[i].id_cat == "2"){
                  this.rtt_user = true;
              } else {
                  this.rtt_user = false;
              }
          }

      });
  }

  public getDemande(user){
    this.contentSrv.getDemandeConge(user).subscribe(data => {
      for (let i = 0; i < data.length; i ++){
        if (data[i].categorie_id == "0"){
          this.demandeconge.push(data[i]);
        } else {
          this.demandeabsence.push(data[i]);
        }
      }
    });
  }

  public checkYear(year){
    let res = false;
    if(this.soldehistorique.length > 0){
      for (let i = 0; i < this.soldehistorique.length ; i++) {
        if(year - 1 == this.soldehistorique[i].year){
            res = true;
        }
      }
    }
    return res;
  }

  public addDemande(){
    this.navCtrl.setRoot('DemandeCongesPage',{
      user: this.user,
      ent: this.ent
    });
  }

  public setChart(data,backgroundColor,labels){
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: data,
          backgroundColor: backgroundColor
        }],
        labels: labels
      },
      options: {
        legend: {
          display: true
        },
        rotation: 0.8 * Math.PI,
        circumference: 1.4 * Math.PI,
        responsive: true,
        cutoutPercentage: 90,
        elements: {
          center: {
            text: "",
            color: '#000000'
          }
        }
      }
    });
    Chart.pluginService.register({
      beforeDraw: function (chart) {
        var width = chart.chart.width,
          height = chart.chart.height,
          ctx = chart.chart.ctx;

        ctx.restore();
        var fontSize = (height / 114).toFixed(2);
        ctx.font = fontSize + "em sans-serif";

        var text = '',
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 2.3;

        ctx.fillText(text, textX, textY);
        ctx.save();
      }
    });
    Chart.pluginService.register({
      beforeDraw: function (chart) {
        var width = chart.chart.width,
          height = chart.chart.height,
          ctx = chart.chart.ctx;

        //ctx.restore();
        var fontSize = (height / 114).toFixed(2);
        ctx.font = fontSize + "em sans-serif";

        var text = '',
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 1.7;

        ctx.fillText(text, textX, textY);
        ctx.save();
      }
    });
  }


  public displaySolde(param,i){
      $('.tab-box').find('.tabs').removeClass('active');
      if(param == 'conge') {
        this.curr_max_solde = 0;
        $('.tab-box').find('.con').addClass('active');
        this.displayChart(this._i);
      }else{
        this.curr_max_solde = this.catsUser[i].max;
        $('.tab-box').find('#cat-'+param).addClass('active');
        this.displayChartAbs(0, param)
      }

  }

  public selectChart(param){
    if(this.abs){
      this.displayChartAbs(param,this.current_abs);
    }else{
      this.displayChart(param);
    }
  }

  public displayChartAbs(index, id){
    this.current_abs = id;
    this.abs = true;
    this.empty_msg = false;
    if(index != 0){
      if(index == '-'){
        this._i_abs--;
        this.annee_libelle = 'Année n (en cours)';
        $('.forward_arrow').css("visibility","hidden");
        $('.back_arrow').css("visibility","visible");
      }else{
        this._i_abs++;
        this.annee_libelle = 'Année n-'+this._i_abs;
        $('.back_arrow').css("visibility","hidden");
        $('.forward_arrow').css("visibility","visible");
      }
    }else{
      this._i_abs = 0;
      for(let i = 0; i < this._id_abs.length; i++){
        this._id_abs[i]['_id'] = 0;
      }
      this.annee_libelle = 'Année n (en cours)';
      var sa = this.solde_absence.filter(_sa => _sa.categorie_id == id && _sa.annee_type == this._i_abs);
      var sa1 = this.solde_absence.filter(_sa => _sa.categorie_id == id && _sa.annee_type != this._i_abs);
      if(sa.length > 1 || sa1.length != 0){
        $('.back_arrow').css("visibility","visible");
      }else{
        $('.back_arrow').css("visibility","hidden");
      }
      $('.forward_arrow').css("visibility","hidden");
    }
    console.log('this.demandeabsence',this.demandeabsence);
    console.log('abs.annee_type == this._i_abs',this._i_abs);
    this.demandes = this.demandeabsence.filter(abs => abs.annee_type == this._i_abs);
    var datasAbsence = [];
    datasAbsence = [0,0];
    for(var u = 0; u < this.solde_absence.length; u++){
      for(let i = 0; i < this._id_abs.length; i++){
        if(this._id_abs[i]['cat'] == id && this.solde_absence[u].categorie_id == id && this.solde_absence[u].annee_type == this._i_abs){
          datasAbsence = [this.solde_absence[u].pris,parseInt(this.solde_absence[u].solde) - parseInt(this.solde_absence[u].pris)];
        }
      }
    }
    let labels =  ['Pris : ' + datasAbsence[0],'Restants : ' + datasAbsence[1]];
    let backgroundColor = ['#678E9B', '#D85756'];
    this.setChart(datasAbsence,backgroundColor,labels);
    if(datasAbsence[0] == 0 && datasAbsence[1] == 0){
      this.empty_msg = true;
      this.total = "";
    }else{
      this.total = (parseFloat(datasAbsence[0]) + parseFloat(datasAbsence[1])) + ' jours';
    }
  }

  public getLibelleCat(cat,cat_id){
    let id_cat;
    if(cat == null || cat == undefined){
      id_cat = cat_id;
    }else{
      id_cat = cat;
    }
    if(id_cat == "0"){
      return "Congé";
    }else {
      for(var i = 0; i < this.catsUser.length; i++){
        if(this.catsUser[i].categorie_id == id_cat){
          return this.catsUser[i].title;
        }
      }
    }
  }

  public getStatut(statut){
      switch (statut) {
          case "-1" :
              return "Refuser";
          case "0" :
              return "En Attente";
          case "1" :
              return "Pris";
      }
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

}
