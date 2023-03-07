import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, IonicPage } from 'ionic-angular';
import * as $ from 'jquery';
import {SQLite} from "@ionic-native/sqlite";
import { SqliteServiceProvider } from '../../providers/sqlite-service/sqlite-service';
import { AnnuaireServiceProvider } from '../../providers/annuaire-service/annuaire-service';
import { ContactServiceProvider } from '../../providers/contact-service/contact-service';
import { ContentserviceProvider } from '../../providers/contentservice/contentservice';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http/';
import { HttpHeaders } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-inscription',
  templateUrl: 'inscription.html'
})

export class InscriptionPage {
  company_fields : any;
  socials_fields : any;
  user_fields : any;
  companies: any = [];
  niveau1: any = [];

  constructor(public navCtrl: NavController,private storage: Storage, public annuaire:AnnuaireServiceProvider,
    public Sqlite: SQLite, public sqlite: SqliteServiceProvider, public navParams: NavParams,
    public alertCtrl: AlertController, public contentSrv: ContentserviceProvider,private http: HttpClient, public contactSrv:ContactServiceProvider) {

    var int = setInterval(function () {
      if($('#form-0').length != 0 && $('#form-1').length != 0){
        if(navParams.get('param') == 0){
          $('#form-0').show();
          $('#form-1').remove();
        }else{
          $('#form-1').show();
          $('#form-0').remove();
        }
        $('#load, #loader').hide();
        clearInterval(int);
      }
    },50);

    this.company_fields = ['name','street','postcode','city','email','phone'];
    this.socials_fields = ['tw','fb','insta','link'];
    this.user_fields = ['name','f_name','username','pwd','pwd1','email','sex','company'];

    this.getLvl2List();
    this.getLvl1List();

  }

  private getLvl2List(){
    this.annuaire.getAllLvl2List().subscribe(data =>{
      this.companies = data;
    });
  }

  private getLvl1List(){
    this.annuaire.getAllLvl1List().subscribe(data =>{
      this.niveau1 = data;
    });
  }

  public saveMe(){
    if(this.navParams.get('param') == 0){
      this.saveUser();
    }else{
      this.saveCompany();
    }
  }

  public saveCompany(){
    var inspect = true;

    for(var i = 0; i < this.company_fields.length; i++){
      if($('#'+this.company_fields[i]).val() == ""){
        $('#'+this.company_fields[i]).css('border','1px solid red');
        inspect = false;
      }else{
        $('#'+this.company_fields[i]).css('border','none');
      }
    }

    if(inspect){
      var inspect2 = ($('#postcode').val()).length;
      if(inspect2 == 5){
        $('#postcode').css('border','none');
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(re.test($('#email').val())){
          $('#email').css('border','none');
          var reg = new RegExp("^((\\+\\d{1,3}(-| )?\\(?\\d\\)?(-| )?\\d{1,3})|(\\(?\\d{2,3}\\)?))(-| )?(\\d{3,4})(-| )?(\\d{4})(( x| ext)\\d{1,5}){0,1}$");
          if($('#phone').val() != "" && reg.test($('#phone').val())){
            $('#phone').css('border','none');
            //var inspect1 = this.inspectColors();
            var inspect1 ="";
            if(inspect1 == ""){
              var inspect3 = true;
              if($('#niveau1').val() == ""){
                inspect3 = false;
                $('#niveau1').css('border','1px solid red');
              }else{
                $('#niveau1').css('border','none');
              }
              /*for(i = 0; i < this.socials_fields.length; i++){
                if(this.socials_fields[i] == "tw" || this.socials_fields[i] == "fb" || this.socials_fields[i] == "insta" || this.socials_fields[i] == "link"){
                  if(($('#'+this.socials_fields[i]).val()).substring(0,4) == "http" || ($('#'+this.socials_fields[i]).val()).substring(0,3) == "www"){
                    $('#'+this.socials_fields[i]).css('border','1px solid red');
                    inspect3 = false;
                  }else{
                    $('#'+this.socials_fields[i]).css('border','none');
                  }
                }
              }*/
              if(inspect3){
                var params = [];
                params.push({
                  name: $('#name').val(),
                  street: $('#street').val(),
                  postcode: $('#postcode').val(),
                  city: $('#city').val(),
                  bio: $('#bio').val(),
                  email: $('#email').val(),
                  phone: $('#phone').val(),
                  url: $('#url').val(),
                  color1: '',
                  color2: '',
                  tw: '',
                  fb: '',
                  insta: '',
                  link: '',
                  niveau1: $('#niveau1').val()
                });
                this.contentSrv.postCompany(JSON.stringify(params)).then(data =>{
                  let response = data;
                  if(response != null){
                    let alert = this.alertCtrl.create({
                      title: 'Oups...',
                      message: "L'envoi du formualire a rencontré un problème...",
                      buttons: ['Fermer']
                    });
                    alert.present();
                  }else{
                    let alert = this.alertCtrl.create({
                      title: 'Enregistré !',
                      message: "Votre demande d'ajout a été enregistrée! Vous recevrez un mail de confirmation lorsque les administrateurs auront approuvé l'enregistrement.",
                      buttons: ['Continuer']
                    });
                    //alert.present();
                    this.navCtrl.setRoot('ConnexionPage',{});
                  }
                });
              }else{
                this.displayAlertMsg("Les champs de réseaux sociaux ne doivent pas contenir de liens mais le nom du compte.");
              }
            }else{
              this.displayAlertMsg(inspect1);
            }
          }else{
            $('#phone').css('border','1px solid red');
            this.displayAlertMsg("Le numéro de téléphone n'est pas valide");
          }
        }else{
          $('#email').css('border','1px solid red');
          this.displayAlertMsg("L'adresse email n'est pas valide");
        }
      }else{
        this.displayAlertMsg("Le code postal n'est pas valide. Il doit contenor 5 chiffres.");
        $('#postcode').css('border','1px solid red');
      }
    }else{
      this.displayAlertMsg("Tous les champs obligatoires doivent être saisis.")
    }

  }

  public inspectColors(){
    var color1 = ($('#color1').val()).substring(0, 1);
    var color2 = ($('#color2').val()).substring(0, 1);
    if(color1 != "#" && color2 != "#" && $('#color1').val() != "" && $('#color2').val() != ""){
      return "Vos deux couleurs ne sont pas valides.</p><p> Exemple à saisir :</p><p> #000000 -> noir #FFFFFF -> blanc."
    }else if(color1 != "#" && $('#color1').val() != ""){
      return "Votre couleur 1 n'est pas valide. </p><p> Exemple à saisir :</p><p> #000000 -> noir #FFFFFF -> blanc."
    }else if(color2 != "#" && $('#color2').val() != ""){
      return "Votre couleur 2 n'est pas valide. </p><p> Exemple à saisir :</p><p> #000000 -> noir #FFFFFF -> blanc."
    }else{
      return "";
    }
  }

  public displayAlertMsg(txt){
    let alert = this.alertCtrl.create({
      title: 'Attention !',
      message: "<p id='intro-connect'>"+txt+"</p>",
      buttons: ['Fermer']
    });
    alert.present();
  }

  public saveUser(){
    var inspect = true;

    for(var i = 0; i < this.user_fields.length; i++){
      if($('#'+this.user_fields[i]).val() == ""){
        $('#'+this.user_fields[i]).css('border','1px solid red');
        inspect = false;
      }else{
        $('#'+this.user_fields[i]).css('border','none');
      }
    }

    if(inspect){
      if($('#pwd').val() == $('#pwd1').val()){
        $('#pwd, #pwd1').css('border','none');
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(re.test($('#email').val())){
          $('#email').css('border','none');
          var reg = new RegExp("^((\\+\\d{1,3}(-| )?\\(?\\d\\)?(-| )?\\d{1,3})|(\\(?\\d{2,3}\\)?))(-| )?(\\d{3,4})(-| )?(\\d{4})(( x| ext)\\d{1,5}){0,1}$");
          if(reg.test($('#phone').val()) || $('#phone').val() == ""){
            $('#phone').css('border','none');
            var inspect3 = true;
            for(i = 0; i < this.socials_fields.length; i++){
              if(this.socials_fields[i] == "tw" || this.socials_fields[i] == "fb" || this.socials_fields[i] == "insta" || this.socials_fields[i] == "link"){
                if(($('#'+this.socials_fields[i]).val()).substring(0,4) == "http" || ($('#'+this.socials_fields[i]).val()).substring(0,3) == "www"){
                  $('#'+this.socials_fields[i]).css('border','1px solid red');
                  inspect3 = false;
                }else{
                  $('#'+this.socials_fields[i]).css('border','none');
                }
              }
            }
            if(inspect3) {
              var params = [];
              params.push({
                name: $('#name').val(),
                f_name: $('#f_name').val(),
                username: $('#username').val(),
                pwd: $('#pwd').val(),
                bio: $('#bio').val(),
                email: $('#email').val(),
                phone: $('#phone').val(),
                sex: $('#sex').val(),
                company: $('#company').val(),
                tw: $('#tw').val(),
                fb: $('#fb').val(),
                insta: $('#insta').val(),
                link: $('#link').val()
              });
              this.contentSrv.postUser(JSON.stringify(params)).then(data => {
                let response = data;
                if (response != null) {
                  let alert = this.alertCtrl.create({
                    title: 'Oups...',
                    message: "L'envoi du formualire a rencontré un problème...",
                    buttons: ['Fermer']
                  });
                  alert.present();
                } else {
                  let alert = this.alertCtrl.create({
                    title: 'Enregistré !',
                    message: "Votre demande d'ajout a été enregistrée! Vous recevrez un mail de confirmation lorsque les administrateurs auront approuvé l'enregistrement.",
                    buttons: ['Continuer']
                  });
                  alert.present();
                  this.navCtrl.setRoot('ConnexionPage', {});
                }
              });
            }
          }else{
            this.displayAlertMsg("Le numéro de téléphone n'est pas valide.");
            $('#phone').css('border','1px solid red');
          }
        }else{
          this.displayAlertMsg("L'adresse email n'est pas valide.");
          $('#email').css('border','1px solid red');
        }
      }else{
        this.displayAlertMsg("Les mots de passes doivent être identiques.");
        $('#pwd, #pwd1').css('border','1px solid red');
      }
    }else{
      this.displayAlertMsg("Tous les champs obligatoires doivent être saisis.")
    }
  }

  public backToCo(){
    this.navCtrl.setRoot('ConnexionPage',{});
  }

  public sendNotification(fcm) {
    let body = {
      "notification":{
        "title":"Demande d'inscription",
        "body":"Vous avez reçu une demande d'inscription dans votre team",
        "sound":"default",
        "icon":"fcm_push_icon"
      },
      "to":fcm,
      "priority":"high",
      "restricted_package_name":""
    }
    let options = new HttpHeaders().set('Content-Type','application/json');
    this.http.post("https://fcm.googleapis.com/fcm/send",body,{
      headers: options.set('Authorization', 'key=AAAApmrOPXE:APA91bEvFQYflu0B5UJxLhtxXHUyyIWX98eeoyVS6OqFW8Kul37-6PwnsrURGL9EL2uygJExXgkOYCWS0mWtj07dCv4IhvhydL5KyXx3AhR2N5hWD_JZaaoxZy_GzhB1lWavdvdaEjiP'),
    })
    .subscribe(
      (value) => console.log("Succes",value),
      (err) => console.log("Fail",err),
      () => console.log("Complete")
      );
  }

}
