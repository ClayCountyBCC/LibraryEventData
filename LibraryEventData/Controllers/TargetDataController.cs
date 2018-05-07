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
      var CIP = new CacheItemPolicy() { AbsoluteExpiration = DateTime.Today.AddDays(1) };
      var targetdatalist = (List<TargetData>)MyCache.GetItem("locations", CIP);
      targetdatalist.AddRange((List<TargetData>)MyCache.GetItem("event_types", CIP));
      targetdatalist.AddRange((List<TargetData>)MyCache.GetItem("target_audience", CIP));

      if (targetdatalist == null)
      {
        return InternalServerError();
      }
      else
      {
        return Ok(targetdatalist);
      }
    }
  }
}
