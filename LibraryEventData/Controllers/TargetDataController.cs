using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LibraryEventData.Controllers
{
    public class TargetDataController : ApiController
    {

    public IHttpActionResult Get()
    {
      List<AppType> lat = (List<AppType>)MyCache.GetItem("apptypes");
      if (lat == null)
      {
        return InternalServerError();
      }
      else
      {
        return Ok(lat);
      }
    }
  }
}
