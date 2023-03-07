import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { Nav } from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';
import * as $ from 'jquery';
import { Chart } from 'chart.js';
import { AlertController } from 'ionic-angular';
import { ContactServiceProvider } from "../../../providers/contact-service/contact-service";

@IonicPage()
@Component({
  selector: 'page-results-contact',
  templateUrl: 'results.html'
})

export class ResultsContactPage {
  @ViewChild(Nav) nav: NavController;
  @ViewChild('doughnutCanvas') doughnutCanvas;
  doughnutChart: any;
  userContact: number;
  sondage: any;
  name: string;
  datedebut: string;
  datefin: string;
  date: any;
  reponses: any;
  dataContainer: Object;
  dataChart : any = [];
  dataLabels : any = [];
  dataTypes : any = "pie";
  canvas: any;
  ctx: any;
  total: string;

  constructor(public navCtrl: NavController, public Sqlite: SQLite, public contactSrv: ContactServiceProvider,
    public alertCtrl: AlertController, public navParam: NavParams) {
    this.getSondage(this.navParam.get('param'));
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

  public getSondage(id){
    this.contactSrv.getSondage(id).subscribe(data => {
      this.sondage = data;
      this.sondage = this.sondage[0];
      this.name = this.sondage.question;
      var mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
      this.date = this.sondage.datedebut.split('-');
      this.datedebut = this.date[2] + ' ' + mois[this.date[1]-1];
      this.date = this.sondage.datefin.split('-');
      this.datefin = this.date[2] + ' ' + mois[this.date[1]-1];
      this.getReponses(id);
      $('#loader, #load').hide();
    });
  }

  public getReponses(id){
    this.contactSrv.getLesReponses(id).subscribe(data => {
      this.reponses = data;
      var _self = this;
      var int = setInterval(function () {
        if($('#results-name-sondage').height() != 0){
          var screen = $('#results-name-sondage').width();
          $('li').css('width',(screen/(_self.reponses.length))+'px');
          $('ul li:nth-child('+_self.reponses.length+')').css('border-right','none');
          var colors = ['#007BC0', '#4d6073', '#62b0ad', '##d8d8d8', '#727272'];
          for(var ii = 0; ii < _self.reponses.length; ii++){
            $('#reponse-'+ii+' .hr-sondage').css('border', '1px solid '+colors[ii]);
            $('#reponse-'+ii+' .ion-arrow-up-b').css('color', colors[ii]);
          }
          clearInterval(int);
        }
      },100);
      var pourcent = [];
      var labels = [];
      for(var i = 0; i < this.reponses.length; i++){
        this.reponses[i].pourcent = ((this.reponses[i].nb_responses * 100) / this.sondage.nb_total).toFixed(2);
        pourcent[i] = this.reponses[i].pourcent;
        labels[i] = "Taux de votes";
      }
      this.total = "Participants : " + this.sondage.nb_total;
      this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: pourcent,
            backgroundColor: ['#007BC0', '#4d6073', '#62b0ad', '#d8d8d8', '#727272']
          }]
        },
        options: {
          legend: {
            display: false
          },
          rotation: 0.8 * Math.PI,
          circumference: 1.4 * Math.PI,
          responsive: true,
          cutoutPercentage: 90,
          elements: {
            center: {
              text: '',
              color: '#000000'
            }
          }
        }
      });
      Chart.pluginService.register({
        beforeDraw: function(chart) {
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
        beforeDraw: function(chart) {
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
    })
  }

  public goBack(){
    this.navCtrl.setRoot('SondageContactPage',{});
  }

}
