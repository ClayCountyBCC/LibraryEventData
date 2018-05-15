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


    public static Attendance GetEventAttendenceData(long event_id)
    {
      var dbArgs = new Dapper.DynamicParameters();
      dbArgs.Add("@event_id", event_id);
      string sql = @"
        USE ClayEventData;
      
        SELECT

        FROM [Attendance]
        WHERE event_id = @event_id
        ";

      try
      {
        var check = Constants.Get_Data<Attendance>(sql);
        return check.First();
      }
      catch (Exception ex)
      {
        Constants.Log(ex, sql);
        return new Attendance();
      }
    }

    public static Attendance SaveAttendanceData(long event_id, Attendance data)
    {

      
      return new List<Attendance>();
    }

  }
}
