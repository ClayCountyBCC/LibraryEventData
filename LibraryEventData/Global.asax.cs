using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;
using System.Web.Http;
using LibraryEventData.Models;
using LibraryEventData.Controllers;

namespace LibraryEventData
{
  public class Global : System.Web.HttpApplication
  {

    protected void Application_Start(object sender, EventArgs e)
    {
      try
      {
        GlobalConfiguration.Configure(WebApiConfig.Register);
      }
      catch(Exception ex)
      {
        new Models.ErrorLog(ex);
      }
      
    }

  }
}