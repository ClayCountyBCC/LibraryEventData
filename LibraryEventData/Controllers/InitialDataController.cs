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
  public class TargetDataController : ApiController
  {

    public IHttpActionResult Get()
    {

      var targetDataList = new DataContainer(User.Identity.Name);
      if (targetDataList == null)
      {
        return InternalServerError();
      }
      else
      {
        return Ok(targetDataList);
      }
    }
  }
}
