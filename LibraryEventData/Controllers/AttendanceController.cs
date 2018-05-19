using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using LibraryEventData.Models;

namespace LibraryEventData.Controllers
{
  public class AttendanceController : ApiController
  {
    public IHttpActionResult SaveAttendance(Event existingEvent)
    {
      var errors = new List<string>();


      if (UserAccess.GetUserAccess(User.Identity.Name).current_access == UserAccess.access_type.admin_access)
      {

        var validateList = new List<Event>();
        validateList.Add(existingEvent);

        if( Event.Validate(validateList).Any()) return Ok(errors);

        errors = (Attendance.MergeAttendanceData(existingEvent.id, existingEvent.attendance, User.Identity.Name));
        if(errors.Count() == 0)
        {

          Attendance.UpdateOrSaveTargetAudiences(existingEvent.id,existingEvent.attendance.target_audiences);
        }
      }
      else
      {
        errors.Add("Events have not been saved, user has incorrect level of access.");
      }
      return Ok(errors);
    }
  }
}
