using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Caching;
using System.Web.Http;
using LibraryEventData.Models;

namespace LibraryEventData.Controllers
{
  [RoutePrefix("API/InitialData")]
  public class InitialDataController : ApiController
  {
    [Route("Get")]
    [HttpGet]
    public IHttpActionResult Get()
    {
      try
      {
        var dc = new DataContainer(User.Identity.Name);
        return Ok(dc);
      }
      catch(Exception ex)
      {
        new ErrorLog(ex);
        return InternalServerError();
      }


    }
  }
}
