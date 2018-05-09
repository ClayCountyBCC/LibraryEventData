using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dapper;

namespace LibraryEventData.Models
{
  public class Attendance
  {
    public long event_id{ get; set; } // in case we want to pull more than one event at a time.
    public string event_type { get; set; }
    public int youth_count { get; set; }
    public int adult_count { get; set; }
    public string notes { get; set; }

    // When getting Event from client, it will always have attendance data
    // If attendance data is 'empty', it will need to be null
    public Attendance()
    {
      
    }


    public static List<Attendance> GetEvenAttendenceData(long event_id)
    {

      return new List<Attendance>();
    }

    public static Attendance SaveAttendanceData(long event_id, Attendance data)
    {

      
      return new Attendance();
    }

  }
}
