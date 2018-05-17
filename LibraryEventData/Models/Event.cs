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

    public static List<Event> GetEventsRaw(int EventDate = 7, int Location = -1)
    {
      var dbArgs = new Dapper.DynamicParameters();
      dbArgs.Add("@EventDate", EventDate);
      dbArgs.Add("@Location", Location);

      string sql = @"
      
      USE ClayEventData
      
      SELECT 
        E.id,
        E.event_date,
        E.name event_name_raw,
        E.event_time_from_raw event_time_from_raw,
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
      WHERE CAST(event_date AS DATE) = CAST(DATEADD(dd,@EventDate,GETDATE())AS DATE)
      AND Location_id = CASE WHEN @Location < 1 THEN location_id ELSE @Location END";

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
            return e;
          },
          splitOn: "event_id"
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
      var events = GetEventsRaw(EventDate, Location);
      if (IncompleteOnly)
      {
        events.RemoveAll(e => e.attendance.event_id != -1);
      }
      return events;
    }

    public static List<Event> GetEvent(long event_id)
    {
      // TODO: GET This event
      var dbArgs = new Dapper.DynamicParameters();
      dbArgs.Add("@event_id", event_id);

      string sql = @"
      
        USE ClayEventData
      
        SELECT 
          E.id,
          E.event_date,
          E.name event_name_raw,
          E.event_time_from_raw event_time_from_raw,
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
        WHERE event_id in @event_ids";

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
            return e;
          },
          splitOn: "event_id"
        );

        return events;
      }
      catch (Exception ex)
      {
        Constants.Log(ex, sql);
        return new List<Event>();
      }

    }

    public static bool SaveEvents(List<Event> events, UserAccess ua)
    {
      var attendance = events[0].attendance;

      if (attendance.event_id != -1)
      {
        // TODO: save attendance

      }

      return true;
    }
  }
}