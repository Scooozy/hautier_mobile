import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import * as $ from 'jquery';
import {ContactServiceProvider} from "../../providers/contact-service/contact-service";

@IonicPage()
@Component({
  selector: 'page-forgot-pwd',
  templateUrl: 'forgot-pwd.html',
})
export class ForgotPwdPage {
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
      if(this.login != "" && this.email != ""){
        this.checkUser(this.login, this.email);
      }else{
        this.displayAlert('Attention !',"Le login et l'adresse email doivent être saisis");
      }
    }else if(this.inspectConfirm == 1){
      if(this.secret_code != ""){
        this.checkSecretCode(this.secret_code);
      }else{
        this.displayAlert('Attention !',"Le code secret doit être saisie");
      }
    }else{
      if(this.mdp != "" && this.mdp1 != ""){
        if(this.mdp == this.mdp1){
          var inspect = this.checkStringChars(this.mdp);
          if(!inspect) {
            this.postNewPassword(this.mdp);
          }else{
            this.displayAlert('Attention !',"Le mot de passe ne doit pas contenir les caractères suivant: ?, #, &, /, ', \"");
          }
        }else{
          this.displayAlert('Attention !',"Le mot de passe et sa confirmation doivent être identiques");
        }
      }else{
        this.displayAlert('Attention !',"Le mot de passe et sa confirmation doivent être saisis");
      }
    }
  }

  private checkStringChars(mdp){
    var format = /[ &#/'"?]/;
    return format.test(mdp);
  }

  private checkUser(username, email){
    this.contactSrv.getCheckUser(username, email).subscribe(data =>{
      if(data.length != 0){
        this.user_info = data[0];
        this.inspectConfirm = 1;
        this.displayAlert('',"Un code secret de sécurité vous a été envoyé par email. Il vous permettra de passer à l'étape suivante.");
        $('#secret-code').show();
      }else{

        this.displayAlert("Oups...",'Aucun utilisateur ne correspond à votre identifiant et mot de passe. Veuillez vérifier les informations renseignées.')
      }
    })
  }

  private checkSecretCode(secret_code){
    this.contactSrv.getCheckSecretCode(this.user_info.id, secret_code).subscribe(data =>{
      if(data.length != 0){
        this.inspectConfirm = 2;
        $('#mdp, #mdp1').show();
      }else{
        this.displayAlert("Oups...",'Le code ne correspond pas à celui que nous vous avons envoyé. Veuillez vérifier les informations renseignées.')
      }
    })
  }

  private postNewPassword(pwd){
    let params = [];
    params.push({
      user_id: this.user_info.id,
      pwd: pwd,
    });
    this.contactSrv.postNewPassword(JSON.stringify(params)).then(response => {
      this.navCtrl.setRoot('ConnexionPage',{});
      this.displayAlert('Terminé !',"Votre mot de passe à été modifié!");
    });
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
