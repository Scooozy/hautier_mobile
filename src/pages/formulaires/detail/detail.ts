import { Component } from '@angular/core';
import {NavController, NavParams, ToastController, AlertController, IonicPage} from 'ionic-angular';
import { ContentserviceProvider } from "../../../providers/contentservice/contentservice";
import {DomSanitizer} from "@angular/platform-browser";
import * as $ from 'jquery';
import {HomeServiceProvider} from "../../../providers/home-service/home-service";

@IonicPage({
  name : 'form-detail',
  segment : 'form-detail'
})
@Component({
    selector: 'page-form-detail',
    templateUrl: 'detail.html',
})
export class FormsDetailPage {
    title: any = "";
    formulaire: any;
    fields: any;
    form: any;
    cli: any;
    user: any;
    id_form: any;
    options: any;
    params: string = "";
    demandesReparation: any[] = [];
    right_list: boolean = true;

    constructor(public navCtrl: NavController, public navParams: NavParams, private contentSrv: ContentserviceProvider,
                private sanitizer : DomSanitizer, private toastCtrl:ToastController, private alertCtrl : AlertController,
                private homeSrv: HomeServiceProvider) {

        this.user = this.navParams.get("user");
        this.cli = this.navParams.get("cli");
        this.id_form = this.navParams.get("id_form");
        if(this.id_form == 1){
          this.homeSrv.getHasRight(this.user,22).subscribe(data => {
            if(!data){
              this.presentToast('Vous n\'avez pas les droits d\'accès à cette fonctionnalité.');
              this.navCtrl.setRoot('home-home',{});
            }else{
              this.homeSrv.getHasRight(this.user,19).subscribe(data => {
                this.right_list = data;
              });
            }
          });
        }else if(this.id_form == 2){
          this.homeSrv.getHasRight(this.user,48).subscribe(data => {
            if(!data){
                this.presentToast('Vous n\'avez pas les droits d\'accès à cette fonctionnalité.');
              this.navCtrl.setRoot('home-home',{});
            }
          });
        }
        this.getGenerateForm(this.id_form,this.user);
        this.getFormFields(this.id_form);
        this.getFormulaire(this.id_form).then((data) => {
            this.formulaire = data;
            this.title = this.formulaire.title;
        });
        this.getDemandesReparations();
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
        if(this.navParams.get('origin') == 'checklist'){
            this.navCtrl.setRoot('form-detail', {
                id_form: 2,
                cli : this.cli,
                user : this.user,
                origin: 'home'
            });
        }else if(this.navParams.get('origin') == 'home'){
            this.navCtrl.setRoot('home-home',{});
        }else{
            this.navCtrl.setRoot('form-list',{
                user: this.user,
            });
        }
    }



    public getFormulaire(id_form){
        return new Promise(resolve => {
           this.contentSrv.getForm(id_form).subscribe(data => {
               resolve(data[0]);
           })
        });
    }

    public getGenerateForm(form,user){
        this.contentSrv.getGenerateForm(form,user).subscribe(data => {
            this.form = this.sanitizer.bypassSecurityTrustHtml(data);
        })
    }

    public getFormFields(form){
        this.contentSrv.getFormFields(form).subscribe(data => {
            this.fields = data;
        })
    }

    public getFieldOptions(id_field){
        return new Promise((resolve) => {
            this.contentSrv.getFieldOptions(id_field).subscribe(data => {
                resolve(data);
            })
        });
    }

    public presentToast(txt){
        let toast = this.toastCtrl.create({
        message: txt,
        duration: 3000,
        position: 'bottom'
        });

        toast.present();
    }

    public sendReponse(){

        if(this.id_form == 2){
            var dc = new Date($('#Date').val());
            var dt = new Date();
            if(dc > dt){
                this.presentToast('La date de la checklist ne peut pas être une date future');
                return false;
            }
        }

        let reponses = $('#form').serializeArray();
        this.contentSrv.sendReponses(JSON.stringify(reponses),this.user,this.id_form).then(data => {
            if(data != null) {
              if(this.id_form == 2){
                this.presentToast('Checklist enregistrée.');
                  if(reponses.length == 11){
                      this.contentSrv.saveStatutCheckList(data,this.user,1).subscribe(data => {
                          this.navCtrl.setRoot('home-home',{});
                      });
                  } else {
                    this.contentSrv.saveStatutCheckList(data,this.user,0).subscribe(data => {
                        console.log('saveStatutCheckList');
                    });
                    let alert = this.alertCtrl.create({
                      title: 'Checklist',
                      message: 'Vous n’avez pas coché tous les éléments, souhaitez-vous créer une demande de réparation ? ',
                      buttons: [{
                          text: 'Oui',
                          handler: () => {
                            this.navCtrl.setRoot('form-detail', {
                              id_form: 1,
                              cli : this.cli,
                              user : this.user,
                              origin: 'checklist',
                              id_checklist: data
                            });
                          }
                        }, {
                          text: 'Non',
                          role: 'cancel',
                          handler: () => {
                            this.navCtrl.setRoot('home-home',{});
                          }
                        }
                      ]
                    });
                    alert.present();
                  }
              } else if (this.id_form == 1){
                this.presentToast('Votre demande a été envoyée.');
                  this.contentSrv.sendMailDemandeReparation(this.user,data).subscribe(data => {
                      console.log(data);
                  });
                  var id_checklist = this.navParams.get("id_checklist");
                  if(id_checklist != null && id_checklist != "" && id_checklist != undefined){
                      this.contentSrv.getLinkChecklistDemRepa(id_checklist,data).subscribe(data => {
                          console.log(data,"DATA");
                      });
                  }
                  this.navCtrl.setRoot('home-home',{});
              } else {
                  this.navCtrl.setRoot('form-list', {});
              }

            } else if(this.id_form == 2) {
                let alert = this.alertCtrl.create({
                  title: 'Checklist',
                  message: 'Vous avez déjà validé une checklist de départ à la date sélectionnée. Nous ne pouvons pas enregistrer votre nouvelle demande.',
                  buttons: [{
                      text: 'OK',
                      role: 'cancel'
                    }
                  ]
                });
                alert.present();
            }
        });
    }

    public setTab(type){

        if(type == 1){
            $('#demandes').hide();
            $('#app1').show();
        } else {
            $('#demandes').show();
            $('#app1').hide();
        }
        $('.filter_tab').removeClass('active_tab');
        $('.filter_tab_'+type).addClass('active_tab');
    }

    public getDemandesReparations() {
        this.contentSrv.getDemandesReparations(this.user).subscribe(data => {
            this.demandesReparation = data;
        });
    }

    public goDemandeReparation(){
        this.navCtrl.setRoot('form-detail', {
            id_form: 1,
            cli : this.cli,
            user : this.user,
            origin: 'checklist'
        });
    }

    public goDetailReparation(id){
        this.navCtrl.setRoot('FormsDetailDemReparationPage', {
            id_form: 1,
            cli : this.cli,
            user : this.user,
            id_demande : id
        });
    }




}
