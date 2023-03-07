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
var FacebookService = /** @class */ (function () {
    function FacebookService(http) {
        this.http = http;
        this.accessToken = '211039506158795|f6LLhWB0tPK_xdL_kyrAbD0uiA0';
        this.graphUrl = 'https://graph.facebook.com/';
        this.graphQuery = "?access_token=" + this.accessToken + "&date_format=U&fields=posts{from,created_time,message,attachments}";
    }
    FacebookService.prototype.getPosts = function (pageName) {
        var url = this.graphUrl + pageName + this.graphQuery;
        return this.http
            .get(url)
            .map(function (response) { return response.json().posts.data; });
    };
    FacebookService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http])
    ], FacebookService);
    return FacebookService;
}());
export { FacebookService };
//# sourceMappingURL=facebook-service.js.map