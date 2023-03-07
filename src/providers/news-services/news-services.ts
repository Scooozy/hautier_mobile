import {Http, RequestOptions, Response, Headers} from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { TwitterService } from 'ng2-twitter';

@Injectable()
export class NewsServiceProvider {
  /*token = '1584538075-rol6n43UqhAJ4PgDenI76pqEbA1xd0FYz8P3kZT';
  tokenSecret = 'TtZRKJIxsRSCrPs1ol9nZSLa81tX2NqKc2YBlpsCwPJHn';
  consumerKey = 'lhVRVdvOznTQF8yqloHAhKmO6';
  consumerSecret = 'dH55OEePy70gwgggajw6s0YehnyFs0Bb0vnhueH3RTZtsbEevK';*/

  token = '1002194552256696320-9X3zFXwLw2P2a2mE0rxkePWZk3xFUJ';
  tokenSecret = 'WgbrDaqmdtMFg5E0olhWDEVJjpGCGB7zdB836J3g33VKU';
  consumerKey = 'uo3GDFEc40bJdV1JjHZ4QmBV8';
  consumerSecret = '10CuJFPXlKVrES3M6te3F1hD26o60uaCxpwOdjAoVqRLtB6jYa';

  constructor(public http: Http, public twitter:TwitterService, public Http: HttpClient) {
    console.log('Hello NewsServiceProvider Provider');
  }

  public getNew(id){
    return this.http.get("https://hautier.teamsmart.fr/webservice/news/news/"+id)
    .do((res : Response ) => console.log(res))
    .map((res : Response ) => res.json());
  }

  public getNews(id_ent){
    return this.http.get("https://hautier.teamsmart.fr/webservice/news/newslist/"+id_ent)
    .do((res : Response ) => console.log(res))
    .map((res : Response ) => res.json());
  }

  public getNotReadNews(user){
    return this.http.get("https://hautier.teamsmart.fr/webservice/news/NotReadNews/"+user)
    .do((res : Response ) => console.log(res))
    .map((res : Response ) => res.json());
  }

  public getUserTimeline(name_user) {
    return this.http.get("https://hautier.teamsmart.fr/webservice/news/twittername/"+name_user)
      .do((res : Response ) => console.log(res))
      .map((res : Response ) => res.json());
  };

  /*getUserTimeline(name_user) {
    console.log("In getUserTimeline");
    return this.twitter.get(
      'https://api.twitter.com/1.1/statuses/user_timeline.json',
      {
        screen_name: name_user,
        count: 20,
        tweet_mode:"extended"
      },
      {
        consumerKey: this.consumerKey,
        consumerSecret: this.consumerSecret
      },
      {
        token: this.token,
        tokenSecret: this.tokenSecret
      }
      )
    .map(res => res.json());
  };*/

  getHashtagTimeline(name_hashtag) {
    console.log("In getHastageTimelie");
    return this.twitter.get(
      'https://api.twitter.com/1.1/search/tweets.json',
      {
        q: name_hashtag,
        count: 20,
        tweet_mode:"extended"
      },
      {
        consumerKey: this.consumerKey,
        consumerSecret: this.consumerSecret
      },
      {
        token: this.token,
        tokenSecret: this.tokenSecret
      }
      )
    .map(res => res.json());
  };

  public getAllCommentActu(){
    return this.http.get("https://hautier.teamsmart.fr/webservice/news/allcommentactu")
    .map((res : Response ) => res.json());
  }

  public getCommentActu(id_actu){
    return this.http.get("https://hautier.teamsmart.fr/webservice/news/commentactu/"+id_actu)
    .map((res : Response ) => res.json());
  }

  public postCommentActu(params){
    console.log("params in savecommentactu");
    console.log(params);
    return new Promise((resolve, reject) => {
      this.Http.post("https://hautier.teamsmart.fr/webservice/news/commentactu", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
      .toPromise()
      .then((response) =>
      {
        console.log('API Response in postGroupes: ', response);
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

  public getAllLikeActu(){
    return this.http.get("https://hautier.teamsmart.fr/webservice/news/alllikeactu")
    .map((res : Response ) => res.json());
  }

  public getLikeActu(id_actu){
    return this.http.get("https://hautier.teamsmart.fr/webservice/news/likeactu/"+id_actu)
    .map((res : Response ) => res.json());
  }

  public getLikeActuUser(id_actu, id_user){
    return this.http.get("https://hautier.teamsmart.fr/webservice/news/likeactuuser/"+id_actu+"/"+id_user)
    .map((res : Response ) => res.json());
  }

  public postLikeActu(params){
    return new Promise((resolve, reject) => {
      this.Http.post("https://hautier.teamsmart.fr/webservice/news/likeactu", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
      .toPromise()
      .then((response) =>
      {
        console.log('API Response in postGroupes: ', response);
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

  public saveReadNews(params){
    return new Promise((resolve, reject) => {
      this.Http.post("https://hautier.teamsmart.fr/webservice/news/ReadNews", "data="+params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
      .toPromise()
      .then((response) =>
      {
        console.log('API Response in postGroupes: ', response);
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


