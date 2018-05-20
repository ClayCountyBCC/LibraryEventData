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
    public int event_type_id { get; set; } = 0;
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

    public static  List<string> MergeAttendanceData(long event_id, Attendance a, string username)
    {
      var dbArgs = new DynamicParameters();
      dbArgs.Add("@username", username);
      dbArgs.Add("@event_id", a.event_id);
      dbArgs.Add("@event_type_id", a.event_type_id);
      dbArgs.Add("@youth_count", a.youth_count);
      dbArgs.Add("@adult_count", a.adult_count);
      dbArgs.Add("@notes", a.notes);

      var error = new List<string>();
      var sql = @"
      
      MERGE INTO Attendance A
      USING (SELECT * FROM ( SELECT
        @event_id event_id,
        @username username,
        @event_type_id event_type_id,
        @youth_count youth_count,
        @adult_count adult_count,
        @notes notes) AS TMP ) B

        ON A.event_id = B.event_id

      WHEN NOT MATCHED BY TARGET THEN
      INSERT 
        (event_id
        ,event_type_id 
        ,youth_count
        ,adult_count
        ,notes
        ,added_by
        ,updated_by
        ,updated_on)
      VALUES
        (@event_id
        ,@event_type_id
        ,@youth_count
        ,@adult_count
        ,@notes
        ,@username
        ,@username
        ,GETDATE())

      WHEN MATCHED THEN
      UPDATE 
      SET 
        event_type_id = @event_type_id
       ,youth_count = @youth_count
       ,adult_count = @adult_count
       ,notes = @notes
       ,added_by = @username
       ,updated_by = @username
       ,updated_on = GETDATE();

      ";
      try
      {
        var rowsAffected = Constants.Exec_Query(sql, dbArgs);
        if(rowsAffected == 0)
        {
          error.Add("There was an issue saving the Attendance data, please try again. If this issue persists, please contact the help desk.");
        }
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

    public static List<String> UpdateOrSaveTargetAudiences(long event_id, List<int> target_audience_ids)
    {
      var Errors = new List<string>();
      var dbArgs = new DynamicParameters();
      dbArgs.Add("@event_id", event_id);
      dbArgs.Add("@target_audience_ids", target_audience_ids);

      var sql = @"
      -- CREATE TABLE VARIABLE
      DECLARE @event_target_audience_ids TABLE
      (
        event_id INT,
        event_target_audience_id INT
      ) 
      -- INSERT DATA TO SAVE
      INSERT INTO @event_target_audience_ids
      (event_id,event_target_audience_id) 
      VALUES


      -- DELETE ALL ROWS ASSOCIATED WITH THE event_id
      DELETE Event_Target_Audiences
      WHERE event_id = @event_id
";

      foreach (var i in target_audience_ids)
      {
        sql += " (@event_id, i)";
        
        if(target_audience_ids.IndexOf(i) != target_audience_ids.IndexOf(target_audience_ids.Last()))
        {
          sql += ",";
        }
      }

      sql += @"
      
      INSERT INTO Event_Target_Audiences
      SELECT event_id, event_target_audience_id
      FROM @event_target_audience_ids
      ORDER BY event_target_audience_id";

      try
      {
        var rowsAffected = Constants.Exec_Query(sql, dbArgs);
        if (rowsAffected == 0)
        {
          Errors.Add("There was an issue saving the Target Audience Data");
        }
      }
      catch(Exception ex)
      {
        Constants.Log(ex, sql);
      }
      
      return null;
    }
    public static List<string> ValidateAttendance(Attendance a, string username)
    {
      var errors = new List<string>();
      if (TargetData.GetEventTypesRaw().FirstOrDefault(t => t.Value == a.event_type_id.ToString()) == null)
      {
        errors.Add($@"Invalid 'Event Type'.");
      }

      return errors;
    }
  }
}
