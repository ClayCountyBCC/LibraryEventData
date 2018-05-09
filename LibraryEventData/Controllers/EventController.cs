using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using LibraryEventData.Models;


namespace LibraryEventData.Controllers
{
  public class EventController : ApiController
  {
    public IHttpActionResult Get()
    {
      var ua = UserAccess.GetUserAccess(User.Identity.Name);
      var events = Event.GetEventsRaw();

      if (events.Count < 1)
      {
        return InternalServerError();

      }
      else
      {
        return Ok(events);
      }
    }
    public IHttpActionResult Save(List<Event> newEvents)
    {
      if (newEvents.Count > 0)
      {
        return InternalServerError();

      }
      else
      {
        var ua = UserAccess.GetUserAccess(User.Identity.Name);
        var ne = Event.SaveEvents(newEvents, ua);
        return Ok(ne);
      }
    }

  }
}