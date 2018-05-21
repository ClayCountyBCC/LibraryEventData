using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using LibraryEventData.Models;


namespace LibraryEventData.Controllers
{
  [RoutePrefix("API/Event")]
  public class EventController : ApiController
  {
    [HttpGet]
    [Route("GetList")]
    public IHttpActionResult GetList(Boolean InCompleteOnly = true, int EventDate = -1, int Location = -1)
    {
      var eventList = Event.GetList(InCompleteOnly, EventDate, Location);
      if(eventList == null)
      {
        return InternalServerError();
      }
      return Ok(eventList);
    }

    [HttpGet]
    [Route("GetEvent")]
    public IHttpActionResult GetEvent(long id)
    {
      var thisEvent = Event.GetEvent(id);
      if(thisEvent == null)
      {
        return InternalServerError();

      }
      return Ok(thisEvent);
    }

    [HttpPost]
    [Route("Save")]
    public IHttpActionResult Save(List<Event> newEvents)
    {
      var error = new List<string>();
      if (newEvents.Count == 0)
      {
        error.Add("There were no events to save, please try the request again");
        return Ok(error);
      }
      else
      {
        var ua = UserAccess.GetUserAccess(User.Identity.Name);
        if (ua.current_access == UserAccess.access_type.admin_access)
        {
          var errors = Event.Validate(newEvents, ua.user_name);
          if (errors == null || errors.Count() == 0) 
          {
            var ne = Event.SaveEvents(newEvents);
            if(ne == 0)
            {
              errors.Add("Error Saving this list of events. If the issue persists, please reach out to the helpdesk.");
            }
          }
          else
          {
            return Ok(errors);
          }

        }
        else
        {
          error.Add("Events have not been saved, user has incorrect level of access.");
        }
      }
      return Ok(error);
    }

    [HttpPost]
    [Route("Update")]
    public IHttpActionResult Update(Event existingEvent)
    {
      var errors = new List<string>();

      var ua = UserAccess.GetUserAccess(User.Identity.Name);
      if (ua.current_access == UserAccess.access_type.admin_access)
      {
        var validateList = new List<Event>
        {
          existingEvent
        };

        errors = Event.Validate(validateList, ua.user_name);
        if (errors.Any()) return Ok(errors);

        var ne = Event.UpdateEvent(existingEvent);

      }
      else
      {
        errors.Add("Events have not been saved, user has incorrect level of access.");
      }
      return Ok(errors);
    }

  }
} 