import {Http, RequestOptions, Response} from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import {HttpClient,HttpHeaders} from "@angular/common/http";

/*
  Generated class for the ContentserviceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
@Injectable()
export class ContentserviceProvider {

  constructor(public http: Http, public Http: HttpClient) {
    console.log('Hello ContentserviceProvider Provider');
  }

  public getConnect(login, mdp){
    return this.http.get("https://hautier.teamsmart.fr/webservice/connect/connected2/"+login+"/"+mdp)
    .do((res : Response ) => console.log(res))
    .map((res : Response ) => res.json());
  }

  public getGroup(id_user){
    return this.http.get("https://hautier.teamsmart.fr/webservice/connect/group/"+id_user)
    .do((res : Response ) => console.log(res))
    .map((res : Response ) => res.json());
  }

  public getFSCColors(){
    return this.http.get("https://hautier.teamsmart.fr/webservice/connect/fsccolor")
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
  }

  public getNewUserEnt(user){
    return this.http.get("https://hautier.teamsmart.fr/webservice/connect/newuserent/"+user)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
  }

  public getNewEnt(user){
    return this.http.get("https://hautier.teamsmart.fr/webservice/connect/newent/"+user)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
  }

  public getAdminEntUser(user){
    return this.http.get("https://hautier.teamsmart.fr/webservice/connect/adminentuser/"+user)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
  }

  public getTeamColors(id){
    return this.http.get("https://hautier.teamsmart.fr/webservice/connect/teamcolor/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
  }

  public postCompany(params){
    return new Promise((resolve, reject) => {
      this.Http.post("https://hautier.teamsmart.fr/webservice/connect/saveCompany", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
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

  public postUser(params){
    return new Promise((resolve, reject) => {

      //this.Http.post("https://hautier.teamsmart.fr/webservice/connect/saveUser", "data="+params, { headers: headers})
      this.Http.post("https://hautier.teamsmart.fr/webservice/connect/saveUser", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
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

    public getNotificationTest(){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/notificationtest/")
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getAddCodeClub(code,id_user){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/addcodeclub/"+code+"/"+id_user)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getClubEntreprise(id_user){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/clubentreprise/"+id_user)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getFormsCli(id_cli){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/formscli/"+id_cli)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getForm(id_form){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/form/"+id_form)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getFormFields(id_form){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/formfields/"+id_form)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getFieldOptions(id_field){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/fieldoptions/"+id_field)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getGenerateForm(id_form,id_user){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/generateform/"+id_form+"/"+id_user)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public saveStatutCheckList(id_reponse,id_user,statut){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/statutchecklist/"+id_reponse+"/"+id_user+"/"+statut)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getDemandesReparations(id_user){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/demandesreparations/"+id_user)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getToolBoxCat(){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/toolboxcat")
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public sendReponses(params,id_user,id_form){
        return new Promise((resolve, reject) => {
            this.Http.post("https://hautier.teamsmart.fr/webservice/contact/responseformulaire/" + id_form + "/" + id_user, "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
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

    public getSoldeUser(user, cli){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/soldeuser/"+user+"/"+cli)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
    }

    public getSoldeHistoriqueUser(user){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/soldehistoriqueuser/"+user)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getRhAbsenceCat(cli,user){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/rhabsencecat/"+cli+"/"+user)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getDemandeConge(user){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/demandeconge/"+user)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getRhAbsenceCatUser(user,cli){
      return this.http.get("https://hautier.teamsmart.fr/webservice/contact/rhabsencecatuser/"+user+"/"+cli)
          .do((res : Response ) => console.log(res))
          .map((res : Response ) => res.json());
    }

    public getRhCatUser(user){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/rhcatuser/"+user)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getRhAbsenceCatUserLink(user){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/rhabsencecatuserlink/"+user)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getUserInfo(user){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/userinfo/"+user)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public sendMailDemandeReparation(user,id_reponse){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/maildemandereparation/"+user+"/"+id_reponse)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getDemandeReparation(id){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/demandereparation/"+id)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

    public getLinkChecklistDemRepa(id_checklist,id_demrep){
        return this.http.get("https://hautier.teamsmart.fr/webservice/contact/linkchecklistdemrep/"+id_checklist+"/"+id_demrep)
            .do((res : Response ) => console.log(res))
            .map((res : Response ) => res.json());
    }

  public getUserAccess(id){
    return this.http.get("https://hautier.teamsmart.fr/webservice/connect/useraccess/"+id)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
  }

  public getCongeParameters(user,cli){
    return this.http.get("https://hautier.teamsmart.fr/webservice/contact/CongeParameters/"+user+"/"+cli)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
  }

  public getCategorieDemande(cli_id,user_id){
    return this.http.get("https://hautier.teamsmart.fr/webservice/contact/CategorieDemande/"+cli_id+"/"+user_id)
        .do((res : Response ) => console.log(res))
        .map((res : Response ) => res.json());
  }

  public sendDemande(params){
    return new Promise((resolve, reject) => {
      this.Http.post("https://hautier.teamsmart.fr/webservice/contact/demandeconge", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
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

  public calculSolde(params){
    return new Promise((resolve, reject) => {
      this.Http.post("https://hautier.teamsmart.fr/webservice/contact/calculsolde", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
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

}
