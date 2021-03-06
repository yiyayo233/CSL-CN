"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var UserInfoService = /** @class */ (function () {
    function UserInfoService(httpHelper) {
        this.httpHelper = httpHelper;
        this.loginApiUrl = "/api/login";
        this.userInfoApiUrl = "/api/userinfo";
        this.adminUserInfoApiUrl = "/api/admin/adminuserinfo";
        if (UserInfoService_1.currentUser == null) {
            this.getCurrentLoginedUserInfo().subscribe(function (response) {
                UserInfoService_1.currentUser = response;
            });
        }
    }
    UserInfoService_1 = UserInfoService;
    UserInfoService.prototype.getUserInfoes = function () {
        return this.httpHelper.get(this.adminUserInfoApiUrl);
    };
    UserInfoService.prototype.isUserNameDuplicated = function (userName) {
        return this.httpHelper.get(this.adminUserInfoApiUrl + "/isduplicated?username=" + userName);
    };
    UserInfoService.prototype.login = function (userInfo) {
        if (userInfo === void 0) { userInfo = null; }
        return this.httpHelper.post(this.loginApiUrl, userInfo);
    };
    UserInfoService.prototype.logout = function (userId) {
        this.httpHelper.delete(this.loginApiUrl, userId).subscribe(function (response) {
            UserInfoService_1.currentUser = null;
        });
    };
    UserInfoService.prototype.create = function (data) {
        return this.httpHelper.post(this.adminUserInfoApiUrl, data);
    };
    UserInfoService.prototype.getCurrentLoginedUserInfo = function () {
        var _this = this;
        return new rxjs_1.Observable(function (subscriber) {
            if (UserInfoService_1.currentUser != null) {
                subscriber.next(UserInfoService_1.currentUser);
                subscriber.complete();
            }
            else {
                _this.httpHelper.get(_this.userInfoApiUrl).subscribe(function (response) {
                    UserInfoService_1.currentUser = response;
                    subscriber.next(response);
                    subscriber.complete();
                });
            }
        });
    };
    var UserInfoService_1;
    UserInfoService = UserInfoService_1 = __decorate([
        core_1.Injectable({ providedIn: "root" })
    ], UserInfoService);
    return UserInfoService;
}());
exports.UserInfoService = UserInfoService;
//# sourceMappingURL=user-info.service.js.map