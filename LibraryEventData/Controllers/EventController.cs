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
      var eventList = Event.GetList(InCompleteOnly, EventDate, Location);
      return Ok(eventList);
    }

    
    public IHttpActionResult GetEvent(long id = -1)
    {
      var thisEvent = Event.GetEvent(id);

      if (thisEvent == null)
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
      var error = new List<string>();
      if (newEvents.Count == 0)
      {
        error.Add("There were no events to save, please try the request again");
        return Ok(error);
      }
      else
      {

        if(UserAccess.GetUserAccess(User.Identity.Name).current_access == UserAccess.access_type.admin_access)
        {
          var errors = Event.Validate(newEvents);
          if (errors == null || errors.Count() == 0) 
          {
            var ne = Event.SaveEvents(newEvents, User.Identity.Name);
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

    public IHttpActionResult UpdateEvent(Event existingEvent)
    {
      var errors = new List<string>();


      if (UserAccess.GetUserAccess(User.Identity.Name).current_access == UserAccess.access_type.admin_access)
      {

        var validateList = new List<Event>();
        validateList.Add(existingEvent);

        errors = Event.Validate(validateList);
        if (errors.Any()) return Ok(errors);

        var ne = Event.UpdateEvent(existingEvent, User.Identity.Name);

      }
      else
      {
        errors.Add("Events have not been saved, user has incorrect level of access.");
      }
      return Ok(errors);
    }

  }
} 