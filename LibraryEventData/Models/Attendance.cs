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
    
    public int youth_count { get; set; } = 0;
    public int adult_count { get; set; } = 0;
    public string notes { get; set; } = "";
    
    public string added_by { get; set; } = "";

    // When getting Event from client, it will always have attendance data
    // If attendance data is 'empty', it will need to be null
    public Attendance()
    {

    }

    public static Attendance GetEventAttendenceData(long event_id)
    {
      var dbArgs = new DynamicParameters();
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
        new ErrorLog(ex, sql);
        return new Attendance();
      }
    }

    public List<string> Validate()
    {
      var errors = new List<string>();
      var eventTypes = (from e in TargetData.GetCachedEventTypes()
                        select e.Value).ToList();
      var targetAudiences = (from ta in TargetData.GetCachedTargetAudience()
                             select ta.Value).ToList();


      if (!eventTypes.Contains(event_type_id.ToString()))
      {
        errors.Add("An invalid Event Type was selected, please check your selection and try again.");
      }
      foreach (int ta in target_audiences)
      {
        if (!targetAudiences.Contains(ta.ToString()))
        {
          errors.Add("An invalid Target Audience was selected, please check your selection and try again.");
        }
      }
      if (youth_count < 0)
      {
        errors.Add("The youth count cannot be set to less than 0.");
      }

      if (adult_count < 0)
      {
        errors.Add("The adult count cannot be set to less than 0.");
      }
      return errors;
    }

    public int Save()
    {

      var error = new List<string>();
      var sql = @"
      USE ClayEventData;

      MERGE INTO Attendance A
      USING (SELECT * FROM ( SELECT
        @event_id event_id,
        @added_by added_by,
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
          ,@added_by
          ,@added_by
          ,GETDATE())

      WHEN MATCHED THEN
        UPDATE 
        SET 
          event_type_id = @event_type_id
         ,youth_count = @youth_count
         ,adult_count = @adult_count
         ,notes = @notes
         ,updated_by = @added_by
         ,updated_on = GETDATE();

      -- Update the Target Audiences here
      DELETE FROM Event_Target_Audiences
      WHERE event_id=@event_id;

      INSERT INTO Event_Target_Audiences 
        (event_id, target_audience_id)
      SELECT @event_id, id
      FROM Target_Audience
      WHERE id IN @target_audiences

      ";
      try
      {
        int rowsAffected = Constants.Save_Data<Attendance>(sql, this);
        return rowsAffected;
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, sql);
        return -1;
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

    public static DateTime GetAttendanceDate(long event_id)
    {
      var param = new DynamicParameters();
      param.Add("@event_id", event_id);
      var sql = $@"
        USE ClayEventData;

        SELECT added_on
        FROM Attendance
        WHERE event_id = @event_id
      ";
      try
      {
        var date = Constants.Get_Data<DateTime>(sql, param).First();
        return date;
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, sql);
        return DateTime.MinValue.Date;
      }
    }
  }
}
