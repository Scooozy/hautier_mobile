import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import * as $ from 'jquery';

@IonicPage()
@Component({
  selector: 'page-carte',
  templateUrl: 'carte.html'
})
export class CartePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

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
    this.navCtrl.setRoot('home-home', {});
  }

}
