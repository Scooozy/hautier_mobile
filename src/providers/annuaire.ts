import { Http } from '@angular/http';

export class AnnuaireService1 {

  constructor(public http: Http) {
    //empty
  }

  public getPlaces(cat){
    return this.http.get("https://www.villedoux.fr/webservice/annuaire/places/"+cat);
  }

}

