import {Http, RequestOptions, Response, Headers} from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

/*
  Generated class for the AnnuaireServiceProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
  @Injectable()
  export class FavorisServiceProvider {
    data : any;

    constructor(private http: Http, public Http: HttpClient) {
      console.log('Hello FavorisServiceProvider Provider');
    }

    public getAllFavoris(){
      console.log('Get favoris in FavorisServiceProvider');
      return this.http.get("https://hautier.teamsmart.fr/webservice/favoris/allfavoris")
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getFavorisUserPro(id){
      console.log('Get favoris user pro in FavorisServiceProvider');
      return this.http.get("https://hautier.teamsmart.fr/webservice/favoris/allfavorisuserpro/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getFavorisUserAma(id){
      console.log('Get favoris user amateur in FavorisServiceProvider');
      return this.http.get("https://hautier.teamsmart.fr/webservice/favoris/allfavorisuserama/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public postFavoris(params){
      console.log('set favoris in FavorisServiceProvider data params',params);
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/favoris/fav", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) =>
        {
          console.log('API Response in postFavoris: ', response);
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

    public getUserFavoris(id_user){
      console.log('Get favoris user amateur in FavorisServiceProvider');
      return this.http.get("https://hautier.teamsmart.fr/webservice/favoris/userfavoris/"+id_user)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public postUserFavoris(params){
      console.log('set favoris in FavorisServiceProvider');
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/favoris/userfavoris", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) =>
        {
          console.log('API Response in postUserFavoris: ', response);
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
  }
