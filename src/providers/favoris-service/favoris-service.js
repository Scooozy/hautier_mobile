var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
/*
  Generated class for the AnnuaireServiceProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
var FavorisServiceProvider = /** @class */ (function () {
    function FavorisServiceProvider(http, Http) {
        this.http = http;
        this.Http = Http;
        console.log('Hello FavorisServiceProvider Provider');
    }
    FavorisServiceProvider.prototype.getAllFavoris = function () {
        console.log('Get favoris in FavorisServiceProvider');
        return this.http.get("https://prodentreprise.citybay.fr/webservice/favoris/allfavoris")
            .do(function (res) { return console.log(res); })
            .map(function (res) { return res.json(); });
    };
    FavorisServiceProvider.prototype.getFavorisUserPro = function (id) {
        console.log('Get favoris user pro in FavorisServiceProvider');
        return this.http.get("https://prodentreprise.citybay.fr/webservice/favoris/allfavorisuserpro/" + id)
            .do(function (res) { return console.log(res); })
            .map(function (res) { return res.json(); });
    };
    FavorisServiceProvider.prototype.getFavorisUserAma = function (id) {
        console.log('Get favoris user amateur in FavorisServiceProvider');
        return this.http.get("https://prodentreprise.citybay.fr/webservice/favoris/allfavorisuserama/" + id)
            .do(function (res) { return console.log(res); })
            .map(function (res) { return res.json(); });
    };
    FavorisServiceProvider.prototype.postFavoris = function (params) {
        var _this = this;
        console.log('set favoris in FavorisServiceProvider');
        return new Promise(function (resolve, reject) {
            _this.Http.post("https://prodentreprise.citybay.fr/webservice/favoris/fav", "data=" + params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
                .toPromise()
                .then(function (response) {
                console.log('API Response in postFavoris: ', response);
                resolve(response);
            })
                .catch(function (error) {
                console.error('API Error : ', error.status);
                console.error('API Error : ', JSON.stringify(error));
                reject(error.json());
            });
        });
    };
    FavorisServiceProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http, HttpClient])
    ], FavorisServiceProvider);
    return FavorisServiceProvider;
}());
export { FavorisServiceProvider };
//# sourceMappingURL=favoris-service.js.map