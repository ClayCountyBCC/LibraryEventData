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
    private DateTime event_date_raw { get; set; }
    private DateTime event_time_from_raw { get; set; }
    private DateTime event_time_to_raw { get; set; }
    public int location_id { get; set; }
    //public List<string> age_groups { get; set; }
    public Attendance attendance { get; set; }
    public string event_date { get; set; }
    public string event_time_from { get; set; }
    public string event_time_to { get; set; }

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
      var EventDateGoodValues = new List<int> { -1, 7, 30, 60 };
      if (!EventDateGoodValues.Contains(EventDate))
      {
        EventDate = 7;
      }

      string sql = $@"
      
      USE ClayEventData
      DECLARE @FromDate DATE = CAST(DATEADD(dd,{EventDate} * -1,GETDATE()) AS DATE);
      SELECT 
        E.id,
        E.event_date event_date_raw,
        E.event_name,
        E.event_time_from event_time_from_raw,
        E.event_time_to event_time_to_raw,
        E.location_id,
        E.added_by, 
        E.added_on, 
        E.updated_by, 
        E.updated_on,
        A.event_id, 
        A.event_type_id, 
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
      WHERE (CAST(@FromDate AS DATE) = CAST(DATEADD(dd,1,GETDATE()) AS DATE)
             OR CAST(event_date AS DATE) >= CAST(@FromDate AS DATE))";


      var param = new Dapper.DynamicParameters();

      if (Location > 0)
      {
        param.Add("@Location", Location);
        sql += " AND Location_id = @Location";
      }
      if (IncompleteOnly)
      {
        param.Add("@IncompleteOnly", IncompleteOnly);
        sql += " AND A.event_id IS NULL";
      }


      try
      {
        var query =
            new SqlConnection(
              Constants.Get_ConnStr());

        var events = (List<Event>)query.Query<Event, Attendance, Event>(
          sql,
          map: (e, a) =>
          {
            e.attendance = a;
            if (a != null) { e.attendance.GetTargetAudiences(); };
            e.event_date = e.event_date_raw.ToShortDateString();
            e.event_time_from = e.event_time_from_raw.ToShortTimeString();
            e.event_time_to = e.event_time_to_raw.ToShortTimeString();
            return e;
          },

          splitOn: "id,event_id"
        );

        return events;
      }
      catch (Exception ex)
      {
        Constants.Log(ex, sql);
        return new List<Event>();
      }
    }

    public static List<Event> GetList(Boolean IncompleteOnly = true, int EventDate = 7, int Location = -1)
    {
      var events = GetEventsRaw(IncompleteOnly, EventDate, Location);
      return events;
    }

    public static Event GetEvent(long event_id)
    {
      if (event_id != -1)
      {
        // TODO: GET This event
        var dbArgs = new Dapper.DynamicParameters();
        dbArgs.Add("@event_ids", event_id);

        string sql = @"
      
        USE ClayEventData
      
        SELECT 
          E.id,
          E.event_date,
          E.event_name event_name_raw,
          E.event_time_from event_time_from_raw,
          E.event_time_to event_time_to_raw,
          E.location_id,
          E.added_by, 
          E.added_on, 
          E.updated_by, 
          E.updated_on,
          A.event_id, 
          A.event_type_id, 
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
        WHERE event_id = @event_id";

        try
        {
          var query =
              new SqlConnection(
                Constants.Get_ConnStr());
          var thisEvent = (Event)query.Query<Event, Attendance, Event>(
            sql,
            map: (e, a) =>
            {
              e.attendance = a;
              return e;
            },
            splitOn: "event_id"
          );

          return thisEvent;
        }
        catch (Exception ex)
        {
          Constants.Log(ex, sql);
          return new Event();
        }

      }
      else
      {
        return new Event();
      }
    }

    public static int SaveEvents(List<Event> events, string username)
    {
      // this is only called if all events contain valid data
      var errors = new List<string>();
      var dbArgs = new DynamicParameters();
      dbArgs.Add("@SaveEvents", "Transaction");

      var sql = $@"
      USE ClayEventData;
      BEGIN TRY
        BEGIN TRAN @SaveEvents
         INSERT INTO Event (
          event_date,
          event_name,
          event_time_from,
          event_time_to,
          location_id,
          added_by, 
          updated_by, 
          updated_on)
        VALUES ";

      foreach (var e in events)
      {
        sql += $@" (CAST(@event_date AS DATETIME)
                  ,{e.event_name}
                  ,CAST({e.event_date} + ' ' + {e.event_time_from} AS DATETIME)
                  ,CAST({e.event_date} + ' ' + {e.event_time_to} AS DATETIME)
                  ,{e.location_id}
                  ,{username}
                  ,{username}
                  ,GETDATE())";

        if (events.IndexOf(e) != events.IndexOf(events.Last()))
        {
          sql += ",";
        }

      }

      sql += @"
      END TRY
      BEGIN CATCH 
        ROLLBACK TRAN @SaveEvents
      END CATCH";

      var rowsAffected = Constants.Exec_Query(sql, dbArgs);
      return rowsAffected;

    }

    public static Event UpdateEvent(Event existingEvent)
    {
      
      return new Event();
    }
    public static List<string> Validate(List<Event> events)
    {
      var errors = new List<string>();

      if (events.Count < 1)
      {
        errors.Add("There are no events to save. If you have attempted to save a valid event, please try again");
        return errors;
      }
      var earlyDate = new DateTime().AddYears(-1).Date;
      var farDate = new DateTime().AddYears(1).Date;
      var timeList = from t in TargetData.GetCachedTimeList()
                     select t.Label;
      var locationList = (from t in TargetData.GetLocationsRaw()
                          select t).ToList();
      var count = 1;
      foreach (var e in events)
      {
        var locationName = (from l in locationList where l.Value == e.location_id.ToString() select l.Label).First();

        if (e.event_name.Length == 0)
        {
          errors.Add($"Invalid name for event #{count}.");
        }
        if (TargetData.GetEventTypesRaw().FirstOrDefault(t => t.Value == e.attendance.event_type.ToString()) == null)
        {
          errors.Add($@"Invalid 'Event Type' for event #{count}.");
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

      if (errors.Count() > 0)
      {
        return errors;
      }

      return null;
    }


  }
}