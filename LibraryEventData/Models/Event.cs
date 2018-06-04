using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dapper;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

namespace LibraryEventData.Models
{
  public class Event
  {
    public long id { get; set; }
    public string event_name { get; set; }
    public int event_type_id { get; set; } = 0;
    public List<int> target_audiences { get; set; }
    public DateTime event_date_raw { get; set; }
    public DateTime event_time_from_raw { get; set; }
    public DateTime event_time_to_raw { get; set; }
    public int location_id { get; set; }
    public Attendance attendance { get; set; }
    public string event_date { get; set; }
    public string event_time_from { get; set; }
    public string event_time_to { get; set; }
    public string added_by { get; set; } = "";

    public Event()
    {

    }

    public static List<Event> GetEventsRaw(bool IncompleteOnly, int EventDate, int Location)
    {
      // doing this because I could not get @EventDate and @FromDate parameters to declare in sql
      // using dapper param.Add(). I was receiving undeclared parameter on both. I am using this to
      // validate good data on EventDate parameter and setting a default if false in order to prevent
      // unwanted data. I will need to fix this so it is not hard coded values but this works until I can
      // properly use the dynamic parameters with the query.Query<TFirst, TSecond, TTarget>() funt

      var EventDateGoodValues = new List<int> { -1, 7, 14, 28,56 };
      if (!EventDateGoodValues.Contains(EventDate))
      {
        EventDate = 7;
      }

      string sql = GetEventBaseQuery();

      var dp = new DynamicParameters();
      if (IncompleteOnly)
      {
        sql += " AND A.event_id IS NULL ";
      }
      if (EventDate != -1)
      {
        dp.Add("@EventAge", EventDate);
        sql += " AND DATEDIFF(DAY, E.event_date, CAST(GETDATE() AS DATE)) BETWEEN -@EventAge AND @EventAge";
      }
      if (Location > 0)
      {
        dp.Add("@Location", Location);
        sql += " AND Location_id = @Location ";
      }
      sql += Environment.NewLine + "ORDER BY E.event_date ASC";
      try
      {
        using (IDbConnection db = new SqlConnection(Constants.Get_ConnStr()))
        {
          var events = (List<Event>)db.Query<Event, Attendance, Event>(
            sql,
            map: (e, a) =>
            {
              e.attendance = a;
              e.GetTargetAudiences();
              e.event_date = e.event_date_raw.ToShortDateString();
              e.event_time_from = e.event_time_from_raw.ToShortTimeString();
              e.event_time_to = e.event_time_to_raw.ToShortTimeString();
              return e;
            },
            param: dp,
            splitOn: "id,event_id"
          );

          return events;
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, sql);
        return null;
        // null is the right return here because we need a way to 
        // indicate to the calling function that this processed errored
      }
    }

    public static List<Event> GetList(Boolean IncompleteOnly = true, int EventDate = 7, int Location = -1)
    {
      var events = GetEventsRaw(IncompleteOnly, EventDate, Location);
      return events;
    }

    private static string GetEventBaseQuery()
    {
      string sql = @"
        USE ClayEventData
        SELECT 
          E.id,
          E.event_date event_date_raw,
          E.event_name,
          E.event_time_from event_time_from_raw,
          E.event_time_to event_time_to_raw,
          E.event_type_id,
          E.location_id,
          E.added_by, 
          E.added_on, 
          E.updated_by, 
          E.updated_on,
          A.event_id, 
          A.youth_count,
          A.adult_count,
          A.notes,
          A.added_by, 
          A.added_on, 
          A.updated_by, 
          A.updated_on
        FROM [Event] E
        LEFT OUTER JOIN [Attendance] A
          ON A.event_id = E.id
        WHERE 1 = 1
        ";
      return sql;
    }

    public void GetTargetAudiences()
    {
      var dbArg = new DynamicParameters();

      dbArg.Add("@event_id", id);

      var sql = @"
        USE ClayEventData;

        SELECT target_audience_id
        FROM Event_Target_Audiences
        WHERE event_id = @event_id";

      target_audiences = Constants.Get_Data<int>(sql, dbArg);

      if (target_audiences.Count() == 0)
      {
        target_audiences = null;
      }
    }

    public static Event GetEvent(long event_id)
    {
      var dbArgs = new DynamicParameters();
      dbArgs.Add("@event_id", event_id);

      string sql = GetEventBaseQuery() + " AND E.id = @event_id ";

      try
      {
        using (IDbConnection db =
          new SqlConnection(Constants.Get_ConnStr()))
        {
          var thisEvent = (List<Event>)db.Query<Event, Attendance, Event>(
                      sql,
                      map: (e, a) =>
                      {
                        e.attendance = a;
                        e.GetTargetAudiences();
                        e.event_date = e.event_date_raw.ToString("yyyy-MM-dd");
                        e.event_time_from = e.event_time_from_raw.ToString("hh:mm tt");
                        e.event_time_to = e.event_time_to_raw.ToString("hh:mm tt");
                        return e;
                      },
                      param: dbArgs,
                      splitOn: "event_id"
                    );
          if(thisEvent.Count() == 1)
          {
            return thisEvent.First();
          }
          else
          {
            return null;
          }
        }

      }
      catch (Exception ex)
      {
        new ErrorLog(ex,sql);
        return null;
      }
    }

    public int Save()
    {
      string query = @"
      USE ClayEventData;
      BEGIN TRY
        BEGIN TRAN SaveEvents;
         INSERT INTO Event (
          event_date,
          event_name,
          event_type_id,
          event_time_from,
          event_time_to,
          location_id,
          added_by, 
          updated_by, 
          updated_on)
        VALUES 
        (
          CAST(@event_date_raw AS DATE)
          ,@event_name
          ,@event_type_id
          ,@event_time_from_raw
          ,@event_time_to_raw
          ,@location_id
          ,@added_by
          ,@added_by
          ,GETDATE()
        );
        
        INSERT INTO Event_Target_Audiences
          (event_id, target_audience_id)
        SELECT SCOPE_IDENTITY(), id
        FROM Target_Audience
        WHERE id IN @target_audiences;

        COMMIT TRAN SaveEvents;
      END TRY
      BEGIN CATCH 
        ROLLBACK TRAN SaveEvents;
      END CATCH";
      return Constants.Save_Data<Event>(query, this);
    }

    //public static int SaveEvents(List<Event> events)
    //{

    //  // this is only called if all events contain valid data
    //  var errors = new List<string>();
    //  var sql = @"
    //  USE ClayEventData;
    //  BEGIN TRY
    //    BEGIN TRAN SaveEvents;
    //     INSERT INTO Event (
    //      event_date,
    //      event_name,
    //      event_type_id,
    //      event_time_from,
    //      event_time_to,
    //      location_id,
    //      added_by, 
    //      updated_by, 
    //      updated_on)
    //    VALUES 
    //    (
    //      CAST(@event_date_raw AS DATE)
    //      ,@event_name
    //      ,@event_type_id
    //      ,@event_time_from_raw
    //      ,@event_time_to_raw
    //      ,@location_id
    //      ,@added_by
    //      ,@added_by
    //      ,GETDATE()
    //    )

    //    COMMIT TRAN SaveEvents;
    //  END TRY
    //  BEGIN CATCH 
    //    ROLLBACK TRAN SaveEvents;
    //  END CATCH";


    //  var rowsAffected = Constants.Save_Data<List<Event>>(sql, events);
    //  foreach(Event e in events)
    //  {
    //    e.SaveTargetAudience();
    //  }
    //  return rowsAffected;

    //}

    //public int SaveTargetAudience()
    //{
    //  string query = @"
    //  DELETE FROM Event_Target_Audiences
    //  WHERE event_id = @id;
    //  INSERT INTO Event_Target_Audiences
    //    (event_id, target_audience_id)
    //  SELECT @id, id
    //  FROM Target_Audience
    //  WHERE id IN @target_audiences;";
    //  return Constants.Save_Data<Event>(query, this);
    //}

    public static int UpdateEvent(Event e)
    {
      var sql = @"
      USE ClayEventData;
      UPDATE Event
      SET
         event_date = @event_date_raw
        ,event_time_from = @event_time_from_raw
        ,event_time_to = @event_time_to_raw
        ,event_name = @event_name
        ,event_type_id = @event_type_id
        ,location_id = @location_id
        ,updated_by = @added_by
        ,updated_on = GETDATE()
      WHERE id = @id;

      DELETE FROM Event_Target_Audiences
      WHERE event_id = @id;
      INSERT INTO Event_Target_Audiences
        (event_id, target_audience_id)
      SELECT @id, id
      FROM Target_Audience
      WHERE id IN @target_audiences;";
      return Constants.Save_Data<Event>(sql, e);
    }

    public static List<string> Validate(List<Event> events, string username)
    {
      var errors = new List<string>();

      if (events.Count < 1)
      {
        errors.Add("There are no events to save. If you have attempted to save a valid event, please try again");
        return errors;
      }
      var eventTypes = (from e in TargetData.GetCachedEventTypes()
                        select e.Value).ToList();
      var targetAudiences = (from ta in TargetData.GetCachedTargetAudience()
                             select ta.Value).ToList();
      var earlyDate = DateTime.Now.AddYears(-1).Date;
      var farDate = DateTime.Now.AddYears(1).Date;
      var timeList = (from t in TargetData.GetCachedTimeList()
                     select t.Label).ToList();
      List<TargetData> locationList = TargetData.GetCachedLocations();




      var count = 1;
      foreach (Event e in events)
      {
        e.event_date_raw = DateTime.Parse(e.event_date);
        e.event_time_from_raw = e.event_date_raw.Date + DateTime.Parse(e.event_time_from).TimeOfDay;
        e.event_time_to_raw = e.event_date_raw.Date + DateTime.Parse(e.event_time_to).TimeOfDay;
        e.added_by = username;

        var locationName = (from l in locationList where l.Value == e.location_id.ToString() select l.Label).First();

        if (e.event_name.Length == 0)
        {
          errors.Add($"Invalid name for event #{count}.");
        }

        if (!eventTypes.Contains(e.event_type_id.ToString()))
        {
          errors.Add("An invalid Event Type was selected, please check your selection and try again.");
        }
        foreach (int ta in e.target_audiences)
        {
          if (!targetAudiences.Contains(ta.ToString()))
          {
            errors.Add("An invalid Target Audience was selected, please check your selection and try again.");
          }
        }

        if (e.event_date_raw.Date < earlyDate || e.event_date_raw.Date > farDate)
        {
          errors.Add($@"For event #{count},  Please select a date within 1 year.");
        }

        if (locationList.FirstOrDefault(l => l.Value == e.location_id.ToString()) == null)
        {
          errors.Add($"The location for event #{count} at {locationName} could not be found.");
        }

        if (!timeList.Contains(e.event_time_from) || e.event_time_from_raw.TimeOfDay > e.event_time_to_raw.TimeOfDay)
        {
          errors.Add($@"On event {e.event_name} at {locationName} on {e.event_date}, {e.event_time_from}
                        is not an acceptable time.");
        }

        if (!timeList.Contains(e.event_time_to))
        {
          errors.Add($@"On event {e.event_name} at {locationName} on {e.event_date}, {e.event_time_to}
                        is not an acceptable time.");
        }

        count++;

      }

      return errors;
    }

  }
}