import {Http, Response} from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

/*
  Generated class for the AnnuaireServiceProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MeteoServiceProvider {
  data : any;

  constructor(private http: Http) {
    console.log('Hello AnnuaireServiceProvider Provider');
  }

  public getCities(){
    return this.http.get("https://hautier.teamsmart.fr/webservice/ville/villes")
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
  }

  public getMeteo(id){
    return this.http.get("https://hautier.teamsmart.fr/webservice/meteo/meteo/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
  }

  public getDanger(user){
    return this.http.get("https://hautier.teamsmart.fr/webservice/news/danger/" + user)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
  }

  public getDangers(user){
    return this.http.get("https://hautier.teamsmart.fr/webservice/news/dangers/" + user)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
  }

  public getDonneeMeteo(lat,long){
      return this.http.get("https://www.prevision-meteo.ch/services/json/lat="+lat+"lng="+long)
          .do((res : Response ) => console.log(res))
          .map((res : Response ) => res.json());
  }

  public getJourFerier(){
      return this.http.get("https://jours-feries-france.antoine-augusti.fr/api/2019")
          .do((res : Response ) => console.log(res))
          .map((res : Response ) => res.json());
  }

}
