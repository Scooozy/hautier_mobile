import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {ContactServiceProvider} from "../../providers/contact-service/contact-service";
import * as $ from 'jquery';

@IonicPage()
@Component({
  selector: 'page-forgot-id',
  templateUrl: 'forgot-id.html',
})
export class ForgotIdPage {

    inspectConfirm: number = 0;
    user_info: any = [];
    login: any;
    email: any;
    secret_code: any;
    mdp: any;
    mdp1: any;



    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
                public contactSrv: ContactServiceProvider, private loadingCtrl: LoadingController) {
    }


    public backToCo(){
        this.navCtrl.setRoot('ConnexionPage',{});
    }

    public confirmForms(){
        if(this.inspectConfirm == 0){
            if(this.email != ""){
                this.checkMail(this.email);
            }else{
                this.displayAlert('Attention !',"L'adresse email doivent être saisis");
            }
        }
    }

    private checkMail(email){
        this.contactSrv.getCheckUserMail(email).subscribe(data =>{
            if(data == true){
                this.displayAlert('',"Votre identifiant vous a été envoyé par l'adresse mai.");
                this.backToCo();
            }else{

                this.displayAlert("Oups...","Aucun identifiant ne correspond à l'adresse mail. Veuillez vérifier l'adresse mail renseignée.")
            }
        })
    }

    private displayAlert(title, txt){
        let alert = this.alertCtrl.create({
            title: title,
            message: txt,
            buttons: ['Fermer']
        });
        alert.present();
    }

    public scrollToMe() {
        $('.scroll-content').animate({
            scrollTop: $("#login").offset().top
        }, 1000);
    };

}
