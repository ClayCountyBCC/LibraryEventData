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
    [HttpGet]
    [Route("Event/GetList")]
    public IHttpActionResult GetList(Boolean InCompleteOnly = true, int EventDate = -1, int Location = -1)
    {
      Event.GetList(InCompleteOnly, EventDate, Location);
      return Ok();
    }

    
    public IHttpActionResult GetEvent(long id = -1)
    {
      var thisEvent = Event.GetEvent(id);

      if (thisEvent == null || thisEvent.id != id)
      {
        return BadRequest($"Event {id} not found");
      }
      else
      {
        return Ok(thisEvent);
      }
    }

    public IHttpActionResult Save(List<Event> newEvents)
    {
      if (newEvents.Count == 0)
      {
        return BadRequest("Could not save the events.");
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