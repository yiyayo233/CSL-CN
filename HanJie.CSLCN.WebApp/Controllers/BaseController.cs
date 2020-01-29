﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HanJie.CSLCN.Common;
using HanJie.CSLCN.Models.Dtos;
using HanJie.CSLCN.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace HanJie.CSLCN.WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : Controller
    {
        private UserStatuService _userStatuService;

        protected UserInfoDto CurrentUser { get; private set; }

        protected bool IsLogin => this.CurrentUser != null;

        public BaseController()
        {
            IServiceProvider serviceProvider = new ServiceCollection().BuildServiceProvider();
            this._userStatuService = serviceProvider.GetService<UserStatuService>();
        }


        public override void OnActionExecuting(ActionExecutingContext context)
        {
            base.OnActionExecuting(context);

            if (!new CommonHelper().IsValidHostValue(Request.Host.Value))
            {
                Response.StatusCode = 404;
            }

            ValidateUserIsLogined();
        }

        public void ValidateUserIsLogined()
        {
            string loginedUserCookie = base.Request.Cookies["current-logined-user-guid"];
            if (!string.IsNullOrEmpty(loginedUserCookie))
            {
                UserInfoDto currentUser = null;
                UserStatuService.LoginedUsers.TryGetValue(loginedUserCookie, out currentUser);
                this.CurrentUser = currentUser;
            }
        }

    }
}