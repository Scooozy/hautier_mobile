import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HomeServiceProvider} from "../../providers/home-service/home-service";
import {DomSanitizer} from "@angular/platform-browser";
import * as $ from 'jquery';

@IonicPage()
@Component({
  selector: 'page-cgu',
  templateUrl: 'cgu.html',
})
export class CguPage {
    cgr: any = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private homeSrv : HomeServiceProvider, private sanitizer: DomSanitizer) {
      this.getCGR();
  }

  private getCGR() {
      this.homeSrv.getCGR().subscribe(data => {
          this.cgr = data[0];
          this.cgr.html = this.sanitizer.bypassSecurityTrustHtml(this.cgr.html);
      })
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
        $('page-annuaire ion-content').css('top','0px');
    }

    //Retour sur la home
    public goBack() {
        this.navCtrl.setRoot('home-home');
    }


}
