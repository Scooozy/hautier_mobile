import {Http, Response} from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import {Platform} from "ionic-angular";

/*
  Generated class for the AnnuaireServiceProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
  @Injectable()
  export class EventsServiceProvider {
    data : any;
    httpOptions: any = {
      headers: new HttpHeaders({
        'Cache-Control':  'private, no-store, max-age=0'
      })
    };

    constructor(private http: Http, public Http: HttpClient, public platform : Platform) {
      console.log('Hello EventsServiceProvider Provider');
    }

    public getCategories(){
      return this.http.get("https://hautier.teamsmart.fr/webservice/agenda/categories")
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getLvl1Checked(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/agenda/lvl1checked/"+id)
          .do((res : Response ) => console.log(res))
          .map((res : Response ) => res.json());
    }

    public unpublishEvent(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/agenda/unpublishEvent/"+id)
          .do((res : Response ) => console.log(res))
          .map((res : Response ) => res.json());
    }

    public getUserResponse(user, event){
      return this.http.get("https://hautier.teamsmart.fr/webservice/agenda/userresponse/"+user+'/'+event)
          .do((res : Response ) => console.log(res))
          .map((res : Response ) => res.json());
    }

    public getUsersResponse(event){
      return this.http.get("https://hautier.teamsmart.fr/webservice/agenda/usersresponse/"+event)
          .do((res : Response ) => console.log(res))
          .map((res : Response ) => res.json());
    }

    public getEventCategories(type,id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/agenda/eventcategories/"+type+"/"+id)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public getCategoriesLvl2(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/agenda/categorie/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getEvents(){
      return this.http.get("https://hautier.teamsmart.fr/webservice/agenda/agenda")
          .do((res : Response ) => console.log(res))
          .map((res : Response ) => res.json());
    }

    public getEventsDay(params){
      return this.http.get("https://hautier.teamsmart.fr/webservice/agenda/agendaday/"+params)
          .do((res : Response ) => console.log(res))
          .map((res : Response ) => res.json());
    }

    public getEntEvents(ent){
      return this.http.get("https://hautier.teamsmart.fr/webservice/agenda/entevents/"+ent)
          .do((res : Response ) => console.log(res))
          .map((res : Response ) => res.json());
    }

    public getEventsDayUser(params){
      return this.http.get("https://hautier.teamsmart.fr/webservice/agenda/agendadayuser/"+params)
          .do((res : Response ) => console.log(res))
          .map((res : Response ) => res.json());
    }

    public getEventsMonth(mois){
      return this.http.get("https://hautier.teamsmart.fr/webservice/agenda/agendamonth/"+mois)
          .do((res : Response ) => console.log(res))
          .map((res : Response ) => res.json());
    }

    public getEventsMonthUser(params){
      return this.http.get("https://hautier.teamsmart.fr/webservice/agenda/agendamonthuser/"+params)
          .do((res : Response ) => console.log(res))
          .map((res : Response ) => res.json());
    }

    public getEvent(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/agenda/event/"+id)
          .do((res : Response ) => console.log(res))
          .map((res : Response ) => res.json());

    }

    public getCustom(id){
        return this.http.get("https://hautier.teamsmart.fr/webservice/agenda/eventcustom/"+id)
          .do((res : Response ) => console.log(res))
          .map((res : Response ) => res.json());
    }

    public getAllEntEvents(ent,user){
      return this.http.get("https://hautier.teamsmart.fr/webservice/agenda/allentevents/"+ent+"/"+user)
          .do((res : Response ) => console.log(res))
          .map((res : Response ) => res.json());
    }

    public getUserAdminEntEvent(user){
      return this.http.get("https://hautier.teamsmart.fr/webservice/agenda/useradminentevent/"+user)
          .do((res : Response ) => console.log(res))
          .map((res : Response ) => res.json());
    }

    public postEvent(params){
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/agenda/event", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
          .toPromise()
          .then((response) => {
            console.log('API Response in postRDV comfirmed: ', response);
            resolve(response);
          })
          .catch((error) => {
            console.error('API Error : ', error.status);
            console.error('API Error : ', JSON.stringify(error));
            reject(error.json());
          });
      });
    }

    public updateUserResponse(params){
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/agenda/updateUserResponse", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
          .toPromise()
          .then((response) => {
            console.log('API Response in postRDV comfirmed: ', response);
            resolve(response);
          })
          .catch((error) => {
            console.error('API Error : ', error.status);
            console.error('API Error : ', JSON.stringify(error));
            reject(error.json());
          });
      });
    }

    public postUserResponse(params){
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/agenda/userResponse", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
          .toPromise()
          .then((response) => {
            console.log('API Response in postRDV comfirmed: ', response);
            resolve(response);
          })
          .catch((error) => {
            console.error('API Error : ', error.status);
            console.error('API Error : ', JSON.stringify(error));
            reject(error.json());
          });
      });
    }

  }
