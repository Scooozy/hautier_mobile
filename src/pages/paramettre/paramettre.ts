import {Component, ɵConsole} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HomeServiceProvider} from "../../providers/home-service/home-service";
import * as $ from 'jquery';


@IonicPage()
@Component({
  selector: 'page-paramettre',
  templateUrl: 'paramettre.html',
})
export class ParamettrePage {

    user: any;
    parametters: any;
    params_model: any[] = [];
    notifications: any;
    toggleAll: any;
    flag: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public homeprovider : HomeServiceProvider) {
    this.user = navParams.get("user");
    this.initParametters();
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

    private initParametters(){
      this.homeprovider.getParametters().subscribe((data => {
          this.parametters = data;
      }));
      this.homeprovider.getNotifications(this.user).subscribe((data => {
          this.notifications = data;
          for (let i = 0; i < this.parametters.length ; i++) {
              if(this.isActive(this.parametters[i]['id'])){
                  this.params_model.push(true);
              }else {
                  this.params_model.push(false);
              }
              if(this.params_model.indexOf(true) == -1){
                  this.toggleAll = false;
              } else {
                  this.toggleAll = true;
              }
          }
      }));
  }

  setParametter(id_parametter, isActive){
      this.checkAllFalse();
      this.checkOneTrue();
      this.saveParametters(id_parametter,isActive);
  }

  isActive(id_param){
      let active = false;
      for (let i = 0; i < this.notifications.length; i++) {
          if(this.notifications[i]['id_parametter'] == id_param && this.notifications[i]['isActive'] == "1"){
              active = true;
          }
      }
      return active;
  }

  /*activeAll(){
      if(this.toggleAll == true){
          for (let i = 0; i < this.parametters.length ; i++) {
              this.params_model[i] = true;
              this.saveParametters(this.parametters[i].id, true);
          }
      } else {
          for (let i = 0; i < this.parametters.length ; i++) {
              this.params_model[i] = false;
              this.saveParametters(this.parametters[i].id, false);
          }
        }

  }*/

  checkAllFalse(){
      if (this.params_model.indexOf(true) == -1){
          this.toggleAll = false;
      }
  }

  checkOneTrue(){
      if (this.params_model.indexOf(true) != -1 ) {
          this.toggleAll = true;
      }
  }

  saveParametters(id_parametter, isActive){
      let params = [];
      params.push({
          id_user: this.user,
          id_parametter: id_parametter,
          isActive: isActive
      });
      this.homeprovider.postNotificationParametter((JSON.stringify(params))).then(data => {});
  }

}
