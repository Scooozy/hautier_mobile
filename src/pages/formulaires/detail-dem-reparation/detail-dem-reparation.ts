import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, AlertController} from 'ionic-angular';
import { ContentserviceProvider } from "../../../providers/contentservice/contentservice";
import {DomSanitizer} from "@angular/platform-browser";
import * as $ from 'jquery';

@IonicPage()
@Component({
    selector: 'page-form-detaildemreparation',
    templateUrl: 'detail-dem-reparation.html',
})
export class FormsDetailDemReparationPage {

    user: any;
    id_demande: any;
    id_form: any;
    cli : any;
    demandeReparation: any [];
    fields: any = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, private contentSrv: ContentserviceProvider,
                private sanitizer : DomSanitizer, private toastCtrl:ToastController, private alertCtrl : AlertController) {

       this.user = this.navParams.get('user');
       this.id_demande = this.navParams.get('id_demande');
       this.id_form = this.navParams.get('id_form');
       this.cli = this.navParams.get('cli');

       this.getDemandeReparation(this.id_demande);
       this.getFormField(this.id_form);
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

    public goBack() {
        this.navCtrl.setRoot('form-detail', {
            id_form: 1,
            cli : this.cli,
            user : this.user,
            origin: 'home'
        });
    }

    public getDemandeReparation(id){
        this.contentSrv.getDemandeReparation(id).subscribe(data => {
            this.demandeReparation = data;
        });
    }

    public getFormField(id){
        this.contentSrv.getFormFields(id).subscribe(data => {
            this.fields = data;
        });
    }

    public getField(id){
        let name;
        for (let i = 0; i < this.fields.length; i++) {
            if(this.fields[i].id == id){
                name = this.fields[i].name;
            }
        }
        return name;
    }




}
