var AnnuaireService1 = /** @class */ (function () {
    function AnnuaireService1(http) {
        this.http = http;
        //empty
    }
    AnnuaireService1.prototype.getPlaces = function (cat) {
        return this.http.get("https://www.villedoux.fr/webservice/annuaire/places/" + cat);
    };
    return AnnuaireService1;
}());
export { AnnuaireService1 };
//# sourceMappingURL=annuaire.js.map