import {Http, Response} from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { AlertController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';

/*
  Generated class for the FamilyServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
  @Injectable()
  export class ContactServiceProvider {

    headers : any = {
          'Cache-Control':  'no-cache, private, no-store, max-age=0'
    };

    constructor(public http: Http, public Http: HttpClient, public alertCtrl: AlertController, public toast: Toast) {
      console.log('Hello ContactServiceProvider Provider');
    }

    public getConnected(login, mdp){
      return this.http.get("https://hautier.teamsmart.fr/webservice/connect/connectedc/"+login+"/"+mdp)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getCategories(form){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/catsug/"+form)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getCategoriesSuggestions(form){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/categoriessuggestions/"+form)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getSignalementsCategories(cli){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/SignalementsCategories/"+cli)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public getInfoUser(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/infouser/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getSondageList(user){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/sondagelist/"+user)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getUserReponses(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/userreponses/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getSondage(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/sondage/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getLesReponses(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/lesreponses/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public postLesReponses(params){

      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/contact/lesreponses", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) => {
          console.log('API Response : ', response);
          resolve(response);
        })
        .catch((error) => {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });

    }

    public getSuggestions(form,user){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/suggestions/"+ form + "/" + user,this.headers)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getContribution(id, user){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/contribution/"+id+"/"+user)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getLikes(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/likes/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public postLike(params){
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/contact/like", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) =>
        {
          console.log('API Response : ', response);
          resolve(response);
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });
    }

    public postParticipate(params){
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/contact/participate", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) =>
        {
          console.log('API Response : ', response);
          resolve(response);
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });
    }

    public postMayBe(params){

      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/contact/maybe", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) =>
        {
          console.log('API Response : ', response);
          resolve(response);
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });
    }

    public postNoParticipate(params){
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/contact/noparticipate", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) =>
        {
          console.log('API Response : ', response);
          resolve(response);
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });
    }

    public getImgs(){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/imgs")
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public postSuggestion(params){
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/contact/suggestion", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) =>
        {
          console.log('API Response : ', response);
          resolve(response);
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
          let alert = this.alertCtrl.create({
            title: 'Oups...',
            message: "L'envoi du formulaire a connu un problème...",
            buttons: ['Fermer']
          });
          alert.present();
        });
      });
    }

    public getSignalements(cli){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/signalements/"+cli)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getUserSignalements(cli,id_user){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/usersignalements/"+cli+"/"+id_user)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getSignalement(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/signalement/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public postSignalement(params){
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/contact/signalement", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) => {
          console.log('API Response : ', response);
          resolve(response);
        })
        .catch((error) => {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
          let alert = this.alertCtrl.create({
            title: 'Oups...',
            message: "L'envoi du formulaire a connu un problème...",
            buttons: ['Fermer']
          });
          alert.present();
        });
      });
    }

    public getDemandes(user){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/demandes/"+user)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getDemande(id, user){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/demande/"+id+"/"+user)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getDemandeNotif(user){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/demandenotif/"+user)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getDemandeNotif1(id, user){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/demandenotif1/"+user+"/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }


    public getReponses(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/reponses/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public postDemande(params){
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/contact/demande", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) =>
        {
          console.log('API Response : ', response);
          resolve(response);
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
          let alert = this.alertCtrl.create({
            title: 'Oups...',
            message: "L'envoi du formulaire a connu un problème...",
            buttons: ['Fermer']
          });
          alert.present();
        });
      });
    }

    public postReponse(params){
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/contact/reponse", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) =>
        {
          console.log('API Response : ', response);
          resolve(response);
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
          let alert = this.alertCtrl.create({
            title: 'Oups...',
            message: "L'envoi du formulaire a connu un problème...",
            buttons: ['Fermer']
          });
          alert.present();
        });
      });
    }

    public setDemandeNotif(id, user){
      console.log("https://hautier.teamsmart.fr/webservice/contact/setdemandenotif/"+id+"/"+user);
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/setdemandenotif/"+id+"/"+user)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public postProfilImage(params){
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/contact/profilimg", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) =>
        {
          console.log('API Response : ', response);
          resolve(response);
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
          let alert = this.alertCtrl.create({
            title: 'Oups...',
            message: "L'enregistrement de la photo a rencontré un problème...",
            buttons: ['Fermer']
          });
          alert.present();
        });
      });
    }


    public getMessagesDemande(id_user){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/messagesdemande/"+id_user)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }


    public getMessageDemande(id_demande){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/messagedemande/"+id_demande)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getMessageDemandeBySenderReceiver(id_sender, id_receiver){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/MessageDemandeBySenderReceiver/"+id_sender+"/"+id_receiver)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getMessageReponse(id_demande){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/messagereponse/"+id_demande)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public postMessageReponse(params){
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/contact/messagereponse", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) =>
        {
          console.log('API Response postMessage : ', response);
          resolve(response);
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject("error");
        });
      });
    }

    public postMessageNotif(params){
        return new Promise((resolve, reject) => {
            this.Http.post("https://hautier.teamsmart.fr/webservice/contact/messagenotif", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
                .toPromise()
                .then((response) =>
                {
                    console.log('API Response postMessage : ', response);
                    resolve(response);
                })
                .catch((error) =>
                {
                    console.error('API Error : ', error.status);
                    console.error('API Error : ', JSON.stringify(error));
                    reject(error.json());
                });
        });
    }

      public postMessageGroupeNotif(params){
          return new Promise((resolve, reject) => {
              this.Http.post("https://hautier.teamsmart.fr/webservice/contact/messagegroupenotif", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
                  .toPromise()
                  .then((response) =>
                  {
                      console.log('API Response postMessage : ', response);
                      resolve(response);
                  })
                  .catch((error) =>
                  {
                      console.error('API Error : ', error.status);
                      console.error('API Error : ', JSON.stringify(error));
                      reject(error.json());
                  });
          });
      }

    public postMessageDemande(params){
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/contact/messagedemande", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) =>
        {
          console.log('API Response postDemande : ', response);
          resolve(response);
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });
    }

    public getAllFCM(){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/allfcm")
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getputByUSer(id_user){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/fcmbyuser/"+id_user)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public postFCM(params){
      console.log("params in postFCM");
      console.log(params);
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/contact/fcm", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) =>
        {
          console.log('API Response postFCM : ', response);
          resolve(response);
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });
    }

    public deleteFCM(fcm){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/deletefcm/"+fcm)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }


    public getAllGroupes(){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/AllGroupes")
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getGroupesPublic(){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/GroupesPublic")
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getGroupeById(id_groupe){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/GroupeById/"+id_groupe)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getGroupeByUser(id_user){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/GroupeByUser/"+id_user)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getCheckUser(username, email){
      return this.http.get("https://hautier.teamsmart.fr/webservice/connect/checkuser/"+username+'/'+email)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

      public getCheckUserMail(email){
          return this.http.get("https://hautier.teamsmart.fr/webservice/connect/checkusermail/"+email)
              .do((res : Response ) => console.log(res))
              .map((res : Response ) => res.json());
      }

    public getCheckSecretCode(user_id, code){
      return this.http.get("https://hautier.teamsmart.fr/webservice/connect/checksecretcode/"+user_id+'/'+code)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public postNewPassword(params){
      console.log(params);
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/connect/newpassword", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
          .toPromise()
          .then((response) =>
          {
            console.log('API Response post newPassword : ', response);
            resolve(response);
          })
          .catch((error) =>
          {
            console.error('API Error : ', error.status);
            console.error('API Error : ', JSON.stringify(error));
            reject(error.json());
          });
      });
    }

    public getUserOfGroupe(id_groupe){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/UserGroupeById/"+id_groupe)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getUserOfGroupeFCM(group){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/UserGroupeFCM/"+group)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public postGroupe(params){
      console.log("params in post groupe");
      console.log(params);
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/contact/groupe", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) =>
        {
          console.log('API Response postgroupe : ', response);
          resolve(response);
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });
    }

    public postUserGroupeAuto(params){
      console.log("params in post usergroupeAuto");
      console.log(params);
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/contact/usergroupeauto", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) =>
        {
          console.log('API Response post usergroupeAuto : ', response);
          resolve(response);
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });
    }

    public postUserGroupe(params){
      console.log("params in post usergroupe");
      console.log(params);
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/contact/usergroupe", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) =>
        {
          console.log('API Response post usergroupe : ', response);
          resolve(response);
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });
    }

    public getMessageGroupe(id_groupe){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/messagegroupeuser/"+id_groupe)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

      public getFCMByUSer(id_user){
          return this.http.get("https://hautier.teamsmart.fr/webservice/contact/fcmbyuser/"+id_user)
              .do((res : Response ) => console.log(res))
              .map((res : Response ) => res.json());
      }

    public getMsgNotifs(user){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/msgnotifs/"+user)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public saveViewMsgNotif(user, id){
      console.log(user, id);
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/viewnotifmsg/"+user+"/"+id)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public saveViewMsgGroup(user, id){
      console.log(user, id);
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/viewnotifgroup/"+user+"/"+id)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public postMessageGroupe(params){
      console.log("params in post messagegroupe");
      console.log(params);
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/contact/messagegroupe", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) =>
        {
          console.log('API Response post messagegroupe : ', response);
          resolve(response);
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject("error");
        });
      });
    }

    public likeContribution(id_suggestion,id_user,id){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/likecontribution/"+id_suggestion+"/"+id_user+"/"+id)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getReponseSondage(id_sondage, id_user){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/reponsesondage/"+id_sondage+"/"+id_user)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }


  }
