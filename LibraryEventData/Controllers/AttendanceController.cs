using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using LibraryEventData.Models;

namespace LibraryEventData.Controllers
{
  [RoutePrefix("API/Attendance")]
  public class AttendanceController : ApiController
  {
    [HttpPost]
    [Route("Save")]
    public IHttpActionResult Save(Attendance attendance)
    {
      var ua = UserAccess.GetUserAccess(User.Identity.Name);
      attendance.added_by = ua.user_name;
      var errors = attendance.Validate();
      if (errors.Count() > 0) return Ok(errors);

      if (ua.current_access != UserAccess.access_type.admin_access &&
         Attendance.GetAttendanceDate(attendance.event_id).Date < DateTime.Today.Date)
      {
        errors.Add("Incorrect level of access necessary to change attendance data after day of event.");
        return Ok(errors);
      }
      int i = attendance.Save();
      if (i == -1)
      {
        errors.Add("There was an error saving the Attendance data.  Please try again and contact the help desk if the issue persists.");
      }
      return Ok(errors);
    }
  }
}
