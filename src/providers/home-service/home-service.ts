import {Http, RequestOptions, Response, Headers} from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

/*
  Generated class for the NewsServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
  @Injectable()
  export class HomeServiceProvider {

      constructor(public http: Http, public Http: HttpClient) {
          console.log('Hello HomeServiceProvider Provider');
      }

      public getHomeTuiles() {
          return this.http.get("https://hautier.teamsmart.fr/webservice/home/tuiles")
              .do((res: Response) => console.log(res))
              .map((res: Response) => res.json());
      }

      public getHomeImg() {
          return this.http.get("https://hautier.teamsmart.fr/webservice/home/homeimg")
              .do((res: Response) => console.log(res))
              .map((res: Response) => res.json());
      }

      public getHomeImgByEnt(id_ent) {
          return this.http.get("https://hautier.teamsmart.fr/webservice/home/homeimgbyent/" + id_ent)
              .do((res: Response) => console.log(res))
              .map((res: Response) => res.json());
      }

      public deleteTuileFav(id_user, id_tuile_fav) {
          return this.http.get("https://hautier.teamsmart.fr/webservice/home/deletetuilefav/" + id_user + "/" + id_tuile_fav)
              .do((res: Response) => console.log(res))
              .map((res: Response) => res.json());
      }

      public getEntTiles(id_ent,user) {
          return this.http.get("https://hautier.teamsmart.fr/webservice/connect/enttiles/" + id_ent+"/"+user)
              .do((res: Response) => console.log(res))
              .map((res: Response) => res.json());
      }

      public postHomeImg(params) {
          console.log("params in savecommentactu");
          console.log(params);
          return new Promise((resolve, reject) => {
              this.Http.post("https://hautier.teamsmart.fr/webservice/home/homeimg", "data=" + params, {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
                  .toPromise()
                  .then((response) => {
                      console.log('API Response in postHomeImg: ', response);
                      resolve(response);
                  })
                  .catch((error) => {
                      console.error('API Error : ', error.status);
                      console.error('API Error : ', JSON.stringify(error));
                      reject(error.json());
                  });
          });
      }

      public postTuileFav(params) {
          console.log("params in savecommentactu");
          console.log(params);
          return new Promise((resolve, reject) => {
              this.Http.post("https://hautier.teamsmart.fr/webservice/home/tuilefav", "data=" + params, {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
                  .toPromise()
                  .then((response) => {
                      console.log('API Response in postTuileFav: ', response);
                      resolve(response);
                  })
                  .catch((error) => {
                      console.error('API Error : ', error.status);
                      console.error('API Error : ', JSON.stringify(error));
                      reject(error.json());
                  });
          });
      }

      public postNotificationParametter(params) {
          return new Promise((resolve, reject) => {
              this.Http.post("https://hautier.teamsmart.fr/webservice/home/notificationparametter", "data=" + params, {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
                  .toPromise()
                  .then((response) => {
                      resolve(response);
                  })
                  .catch((error) => {
                      reject(error.json());
                  });
          });
      }

    public trackOpeningApp(params){
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/home/trackOpeningApp", "data="+encodeURIComponent(params), { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
          .toPromise()
          .then((response) => {
            resolve(response);
          }).catch((error) => {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject("error");
        });
      });
    }

    public trackConnecting(params){
      return new Promise((resolve, reject) => {
        this.Http.post("https://hautier.teamsmart.fr/webservice/home/trackConnecting", "data="+encodeURIComponent(params), { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
          .toPromise()
          .then((response) => {
            resolve(response);
          }).catch((error) => {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject("error");
        });
      });
    }

      public getParametters() {
          return this.http.get("https://hautier.teamsmart.fr/webservice/home/parametters/")
              .do((res: Response) => console.log(res))
              .map((res: Response) => res.json());
      }

      public getNotifications(id_user) {
          return this.http.get("https://hautier.teamsmart.fr/webservice/home/notifications/" + id_user)
              .do((res: Response) => console.log(res))
              .map((res: Response) => res.json());
      }

      public initParametters(id_user){
          return this.http.get("https://hautier.teamsmart.fr/webservice/home/initparametters/" + id_user)
              .do((res: Response) => console.log(res))
              .map((res: Response) => res.json());
      }

      public checkCodeEntreprise(code){
          return this.http.get("https://hautier.teamsmart.fr/webservice/home/checkcodeentreprise/" + code)
              .do((res: Response) => console.log(res))
              .map((res: Response) => res.json());
      }

      public getCGU(){
          return this.http.get("https://hautier.teamsmart.fr/webservice/home/cgu")
              .do((res: Response) => console.log(res))
              .map((res: Response) => res.json());
      }

      public getFooterMenu(cli){
        return this.http.get("https://hautier.teamsmart.fr/webservice/home/footerMenu/"+cli)
          .do((res: Response) => console.log(res))
          .map((res: Response) => res.json());
      }

      public getDidactitiel(){
          return this.http.get("https://hautier.teamsmart.fr/webservice/home/didactitiel")
              .do((res: Response) => console.log(res))
              .map((res: Response) => res.json());
      }


      public getCGR(){
          return this.http.get("https://hautier.teamsmart.fr/webservice/home/cgr")
              .do((res: Response) => console.log(res))
              .map((res: Response) => res.json());
      }

      public getPastillesSondage(user){
        return this.http.get("https://hautier.teamsmart.fr/webservice/home/pastillessondage/"+user)
          .do((res: Response) => console.log(res))
          .map((res: Response) => res.json());
      }

      public getPastillesSuggestions(user){
        return this.http.get("https://hautier.teamsmart.fr/webservice/home/pastillessuggestion/"+user)
          .do((res: Response) => console.log(res))
          .map((res: Response) => res.json());
      }

      public getHasRight(user,right){
        return this.http.get("https://hautier.teamsmart.fr/webservice/connect/hasright/"+user+"/"+right)
          .do((res: Response) => console.log(res))
          .map((res: Response) => res.json());
      }

    public checkAppVersion(version){
      return this.http.get("https://hautier.teamsmart.fr/webservice/home/appversion/"+version)
        .do((res: Response) => console.log(res))
        .map((res: Response) => res.json());
    }
  }


