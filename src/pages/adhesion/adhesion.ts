import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, Alert} from 'ionic-angular';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ContentserviceProvider} from "../../providers/contentservice/contentservice";
import * as $ from 'jquery';


@IonicPage()
@Component({
  selector: 'page-adhesion',
  templateUrl: 'adhesion.html',
})
export class AdhesionPage {

  private user: any;
  private adhesionForm : FormGroup;
  private clubs: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private formBuilder: FormBuilder, private alertCtrl: AlertController,
              private contentSrv: ContentserviceProvider, private nav: NavController) {

      this.user = navParams.get("user");
      this.getClubEntreprise();
      this.adhesionForm = this.formBuilder.group({
          code: [''],
      });
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdhesionPage');
  }

    addAdhesion(code){
        this.contentSrv.getAddCodeClub(code, this.user).subscribe(data => {
            console.log(data);
            if(data == "Bienvenue"){
                this.getClubEntreprise();
                let alert = this.alertCtrl.create({
                    title: 'Adhésion',
                    subTitle: "Bienvenue",
                    buttons: ['OK']
                });
                alert.present();
            } else if (data == "Erreur code") {
                let alert = this.alertCtrl.create({
                    title: 'Erreur Code',
                    subTitle: "Désolé, ce code n'existe pas.",
                    buttons: ['OK']
                });
                alert.present();
            } else if (data == "Deja adherent"){
                let alert = this.alertCtrl.create({
                    title: 'Déjà adhérent',
                    subTitle: "Désolé, vous déjà adhérent.",
                    buttons: ['OK']
                });
                alert.present();
            }

        })
    }

    getClubEntreprise(){
        this.contentSrv.getClubEntreprise(this.user).subscribe(data => {
            console.log(data);
            this.clubs = data;

        })
    }

    addClub() {
        let alert = this.alertCtrl.create({
            title: 'Ajouter un club',
            inputs: [
                {
                    name: 'code',
                    placeholder: 'Code client'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'OK',
                    handler: data => {
                        console.log(data.code.replace(/\s/g, ""));
                        if(data.code.replace(/\s/g, "") != ""){
                            this.addAdhesion(data.code);
                        }
                    }
                }
            ]
        });
        alert.present();
    }


}
