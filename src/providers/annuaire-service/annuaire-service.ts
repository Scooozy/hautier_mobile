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
  export class AnnuaireServiceProvider {
    data : any;
    httpOptions: any = {
      headers: new HttpHeaders({
        'Cache-Control':  'private, no-store, max-age=0'
      })
    };

    constructor(private http: Http, public Http: HttpClient, public platform : Platform) {}

    public getAllTeamAllEnt(){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/AllteamAllEnt")
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getAllowedUsers(cli,user){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/allowedusers/"+cli+"/"+user)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public getAllLvl2List(){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/alllvl2list")
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public getAllLvl1List(){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/alllvl1list")
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public getAllTeam(id_ent){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/Allteam/"+id_ent)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getTeam(id_ent){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/team/"+id_ent)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getLvl2ListMessagerie(id_cli,id_user){
        return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/lvl2listmessagerie/"+id_cli+"/"+id_user)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getTeamValidation(id_ent){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/teamvalidation/"+id_ent)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getTeamFilterFav(id_fav){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/teamfilterfav/"+id_fav)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getTeamFilter(id_ent,id_service){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/teamfilter/"+id_ent+"/"+id_service)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getAllTeamFilter(id_service){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/allteamfilter/"+id_service)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getAdmin(id_ent){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/adminteam/"+id_ent)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getCategories(cat){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/categories/"+cat)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getServicesUser(id_ent,id_user){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/servicesemploye/"+id_ent+"/"+id_user)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getServiceTW(tw){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/servicetw/"+tw)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public getServicesEnt(id_ent){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/servicesbyent/"+id_ent)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getCategoriesFilter(cat){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/placesfilter/"+cat)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getPlace(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/place/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getEmployes(){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/allemployes/")
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getEmploye(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/employe/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public GetEntrepriseEmploye(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/EntrepriseEmploye/"+id)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public getEmployeById(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/employebyid/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getAllPostFiliale(){
        return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/allpostfiliale")
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getFullEmployeById(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/fullemployebyid/"+id)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public getPlaceByCreated(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/placeidcreated/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getCategoriePlace(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/categorieplace/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getCategorieEmploye(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/categorieemploye/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getCustomFields(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/customfield/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getEvents(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/agenda/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getMenuCantine(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/menu/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getAllPlaces(){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/allplaces")
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getAllCategories(){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/allcategories")
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getlevelOnePlaces(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/leveloneplace/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getEntreprises(){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/entreprises")
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getEntreprise(id_user){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/entreprise/"+id_user)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getOneEntreprise(id_user){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/oneentreprise/"+id_user)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public getEntreprise1(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/entreprise1/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getService(id_user){
        return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/service/"+id_user)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getClubs(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/clubs/"+id)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public getServices(){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/services")
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getIdEntByUser(id_user){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/IdEntByUser/"+id_user)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getEntreprisesEmploye(id_ent){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/employe/"+id_ent)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getPartenairesEnt(id_ent){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/partenairesent/"+id_ent)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public getPartenairesEntFixe(id_ent){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/partenairesentfixe/"+id_ent)
          .do((res : Response ) => console.log(res))
          .map((res : Response ) => res.json());
    }

    public getAdminEnt(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/adminent/"+id)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public getLvl1List(id_ent){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/lvl1list/"+id_ent)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public getLvl2ListService(service){
        return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/lvl2listservice/"+service)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getLvl2List(id_ent){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/lvl2list/"+id_ent)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public getLvl2ListRDV(cli,user){
        return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/lvl2listrdv/"+cli+"/"+user)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getLvl2ListFromLvl1(id_ent){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/lvl2listfromlvl1/"+id_ent)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public getAllLvl2ListFromLvl1(id_ent){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/alllvl2listfromlvl1/"+id_ent)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public getTWListService(service){
        return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/twlistservice/"+service)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getTWList(id_ent){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/twlist/"+id_ent)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public postBio(params){
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/annuaire/descriptionplace", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });
    }

    public postGroupes(params){


      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/annuaire/serviceemploye", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) => {
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

    public postTel(params){


      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/annuaire/telEmploye", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) => {
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

    public postMail(params){


      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/annuaire/mailemploye", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) => {
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

    public postTwitter(params){

      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/annuaire/twitteremploye", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) => {
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

    public postFacebook(params){


      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/annuaire/facebookemploye", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) => {
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

    public postInsta(params){


      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/annuaire/instagramemploye", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) => {
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

    public postLinkedin(params){


      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/annuaire/linkedinemploye", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) => {
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

    public getRdv(){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/allrdv")
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getRdvById(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/rdvbyid/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getUserRdv(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/allrdvbyuser/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }


    public getUserRdvByDay(id, time){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/allrdvbyuserbyday/"+id+"/"+time)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getUserRdvByMonth(id, time){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/allrdvbyuserbymonth/"+id+"/"+time)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getSenderRdv(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/allrdvbysender/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getSenderRdvByDay(id, time){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/allrdvbysenderbyday/"+id+"/"+time)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getSenderRdvByMonth(id, time){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/allrdvbysenderbymonth/"+id+"/"+time)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getReceiverRdv(id){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/allrdvbyreceiver/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getReceiverRdvByDay(id, time){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/allrdvbyreceiverbyday/"+id+"/"+time)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getReceiverRdvByMonth(id, time){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/allrdvbyreceiverbymonth/"+id+"/"+time)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public GetMyEntClient(user){
      return this.http.get("https://hautier.teamsmart.fr/webservice/connect/myentclient/"+user)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public GetMenuClient(user){
      return this.http.get("https://hautier.teamsmart.fr/webservice/connect/menuclients/"+user)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public postRdv(params){
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/annuaire/rdv", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) => {
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

    public postRdvComfirmed(params){


      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/annuaire/rdvcomfirmed", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) => {
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

    public getAllPost(id_ent){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/allpost1/"+id_ent)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getAllPostByEnt(id_ent){
        return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/allpostbyent/"+id_ent)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getFiliale(id_user){
        return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/filiale/"+id_user)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getAllPostUser(id_user,cli){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/allpostuser1/"+id_user+"/"+cli)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getAllPostEnt(id_ent,selected){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/allpostent1/"+id_ent+"/"+selected)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public postMesPost(params){

      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/annuaire/mespost1", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) => {
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

      public postMesOffres(params){

          return new Promise((resolve, reject) => {
              this.Http.post("https://hautier.teamsmart.fr/webservice/annuaire/partenairemespost", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
                  .toPromise()
                  .then((response) => {
                      resolve(response);
                  })
                  .catch((error) => {
                      console.error('API Error : ', error.status);
                      console.error('API Error : ', JSON.stringify(error));
                      this.postMesOffres(params);
                  });
          });
      }

    public getAllPostPartenaire(){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/allpostpartenaire")
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getAllPostPartenaireEnt(id_ent,cli){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/allpostpartenaireent/"+id_ent+"/"+cli)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public postPartenaireMesPost(params){

      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/annuaire/partenairemespost", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });
    }

    public postDataEnt(params){

      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/annuaire/dataent", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });
    }

    public postPublishedEmploye(params){

      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/annuaire/publishedemploye", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });
    }

    public postRefuseEmploye(params){
      console.log('set post in AnnuaireServiceProvider');

      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/annuaire/refuseemploye", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) =>
        {
          console.log('API Response in postRefuseEmploye: ', response);
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

      public postDeleteEmploye(params){
          console.log('set post in AnnuaireServiceProvider');

          return new Promise((resolve, reject) => {
              this.Http.post("https://hautier.teamsmart.fr/webservice/annuaire/deleteemploye", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
                  .toPromise()
                  .then((response) =>
                  {
                      console.log('API Response in postDeleteEmploye: ', response);
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

    public postPublishedEnt(params){
      console.log('set post in AnnuaireServiceProvider');

      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/annuaire/publishedent", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
          .toPromise()
          .then((response) => {
            console.log('API Response in postPublishedEnt: ', response);
            resolve(response);
          })
          .catch((error) => {
            console.error('API Error : ', error.status);
            console.error('API Error : ', JSON.stringify(error));
            reject(error.json());
          });
      });
    }

    public postRefuseEnt(params){
      console.log('set post in AnnuaireServiceProvider');

      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/annuaire/refuseent", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
          .toPromise()
          .then((response) => {
            console.log('API Response in postRefuseEnt: ', response);
            resolve(response);
          })
          .catch((error) => {
            console.error('API Error : ', error.status);
            console.error('API Error : ', JSON.stringify(error));
            reject(error.json());
          });
      });
    }


    public postImageProfil(params){
      console.log('set post in AnnuaireServiceProvider',params);

      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/annuaire/ImageProfil", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) =>
        {
          console.log('API Response in postnameimg: ', response);
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

    public postImageProfilEnt(params){
      console.log('set post in AnnuaireServiceProvider',params);

      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/annuaire/ImageProfilEnt", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) =>
        {
          console.log('API Response in postnameimgEnt: ', response);
          resolve(response);
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      })
    }

    public getEmployeTuileFav(id_user,id_tuile_fav){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/employetuilefav/"+id_user+"/"+id_tuile_fav)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
    }

    public getUserAdminEntreprises(user){
      return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/useradminent/"+user)
          .do((res : Response ) => console.log(res))
          .map((res : Response ) => res.json());
    }

    public PostEmployeTuileFav(params){
      console.log('set post in AnnuaireServiceProvider',params);

      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/annuaire/EmployeTuileFav", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .toPromise()
        .then((response) =>
        {
          console.log('API Response in post employe tuile: ', response);
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

    public getPartenaireAdmin(id_user, id_part){
        return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/adminpartenaire/"+id_user+"/"+id_part)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getUserClient(id_user){
        return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/userclient/"+id_user)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getFile(){
        return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/file")
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public checkPassword(id_user, password){
        return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/checkpassword/"+id_user+"/"+password)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public newPassword(id_user, password){
        return this.http.get("https://hautier.teamsmart.fr/webservice/annuaire/newpassword/"+id_user+"/"+password)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }



  }
