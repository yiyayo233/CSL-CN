"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var UserInfoService = /** @class */ (function () {
    function UserInfoService(httpHelper) {
        this.httpHelper = httpHelper;
        this.userServiceUrl = "/api/login";
    }
    UserInfoService.prototype.login = function (userInfo) {
        if (userInfo === void 0) { userInfo = null; }
        return this.httpHelper.post(this.userServiceUrl, userInfo);
    };
    UserInfoService.prototype.logout = function (userId) {
        return this.httpHelper.delete(this.userServiceUrl, userId);
    };
    UserInfoService = __decorate([
        core_1.Injectable({ providedIn: "root" })
    ], UserInfoService);
    return UserInfoService;
}());
exports.UserInfoService = UserInfoService;
//# sourceMappingURL=user-info.service.js.map