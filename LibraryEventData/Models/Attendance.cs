using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dapper;

namespace LibraryEventData.Models
{
  public class Attendance
  {
    public long event_id { get; set; } = -1;
    public int event_type { get; set; } = 0;
    public int youth_count { get; set; } = 0;
    public int adult_count { get; set; } = 0;
    public string notes { get; set; } = "";
    public List<int> target_audiences { get; set; }

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
          A.event_id
         ,A.event_type_id
         ,A.youth_count
         ,A.adult_count
         ,A.notes
        FROM [Attendance] A
        WHERE event_id = @event_id
        ";

      try
      {
        var check = Constants.Get_Data<Attendance>(sql).First();
        return check;
      }
      catch (Exception ex)
      {
        Constants.Log(ex, sql);
        return new Attendance();
      }
    }

    public static List<string> SaveAttendanceData(long event_id, Attendance data)
    {
      var error = new List<string>();
      var sql = @"
      
      
      ";
      try
      {
        Constants.Get_Data<Attendance>(sql);
        return error;
      }
      catch (Exception ex)
      {
        Constants.Log(ex, sql);
        error.Add("There was an issue saving the Attendance data, please try again. If this issue persists, please contact the help desk.");
        return error;
      }
    }

    public void GetTargetAudiences()
    {
      var dbArg = new DynamicParameters();

      dbArg.Add("@event_id", this.event_id);

      var sql = @"
        USE ClayEventData;

        SELECT target_audience_id
        FROM Event_Target_Audiences
        WHERE event_id = @event_id";

      this.target_audiences = Constants.Get_Data<int>(sql, dbArg);

      if (this.target_audiences.Count() == 0)
      {
        this.target_audiences = null;
      }
    }
  }
}
