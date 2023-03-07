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
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
/*
  Generated class for the AnnuaireServiceProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
var EventsServiceProvider = /** @class */ (function () {
    function EventsServiceProvider(http) {
        this.http = http;
        console.log('Hello EventsServiceProvider Provider');
    }
    EventsServiceProvider.prototype.getCategories = function () {
        return this.http.get("https://prodentreprise.citybay.fr/webservice/agenda/categories")
            .do(function (res) { return console.log(res); })
            .map(function (res) { return res.json(); });
    };
    EventsServiceProvider.prototype.getCategoriesLvl2 = function (id) {
        return this.http.get("https://prodentreprise.citybay.fr/webservice/agenda/categorie/" + id)
            .do(function (res) { return console.log(res); })
            .map(function (res) { return res.json(); });
    };
    EventsServiceProvider.prototype.getEvents = function (params) {
        return this.http.get("https://prodentreprise.citybay.fr/webservice/agenda/agenda/" + params)
            .do(function (res) { return console.log(res); })
            .map(function (res) { return res.json(); });
    };
    EventsServiceProvider.prototype.getEventsDay = function (params) {
        return this.http.get("https://prodentreprise.citybay.fr/webservice/agenda/agendaday/" + params)
            .do(function (res) { return console.log(res); })
            .map(function (res) { return res.json(); });
    };
    EventsServiceProvider.prototype.getEventsDayUser = function (params) {
        return this.http.get("https://prodentreprise.citybay.fr/webservice/agenda/agendadayuser/" + params)
            .do(function (res) { return console.log(res); })
            .map(function (res) { return res.json(); });
    };
    EventsServiceProvider.prototype.getEventsMonth = function (params) {
        return this.http.get("https://prodentreprise.citybay.fr/webservice/agenda/agendamonth/" + params)
            .do(function (res) { return console.log(res); })
            .map(function (res) { return res.json(); });
    };
    EventsServiceProvider.prototype.getEventsMonthUser = function (params) {
        return this.http.get("https://prodentreprise.citybay.fr/webservice/agenda/agendamonthuser/" + params)
            .do(function (res) { return console.log(res); })
            .map(function (res) { return res.json(); });
    };
    EventsServiceProvider.prototype.getEvent = function (id) {
        return this.http.get("https://prodentreprise.citybay.fr/webservice/agenda/event/" + id)
            .do(function (res) { return console.log(res); })
            .map(function (res) { return res.json(); });
    };
    EventsServiceProvider.prototype.getCustom = function (id) {
        return this.http.get("https://prodentreprise.citybay.fr/webservice/agenda/eventcustom/" + id)
            .do(function (res) { return console.log(res); })
            .map(function (res) { return res.json(); });
    };
    EventsServiceProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http])
    ], EventsServiceProvider);
    return EventsServiceProvider;
}());
export { EventsServiceProvider };
//# sourceMappingURL=events-service.js.map