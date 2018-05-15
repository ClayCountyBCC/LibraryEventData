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
    public string name { get; set; }
    public DateTime event_date { get; set; }
    public DateTime event_time_from { get; set; }
    public string event_time_from_string { get; set; }
    public DateTime event_time_to { get; set; }
    public string event_time_to_string { get; set; }
    public int library_id{ get; set; }
    public List<string> age_groups { get; set; }
    public Attendance attendance { get; set; }

    public Event()
    {
       
    }

    public static List<Event> GetEventsRaw()
    {
      string sql = @"
      
      USE ClayEventData
      
      SELECT 
        id,
        event_date,
        event_time_from,
        event_time_to,
        event_name,
        location_id,
        added_by, 
        added_on, 
        updated_by, 
        updated_on
        event_id, 
        event_type_id, 
        youth_count,
        adult_count,
        notes,
        attendance_added_by, 
        attendance_added_on, 
        attendance_updated_by, 
        attendance_updated_on
      FROM [Event] E
      LEFT OUTER JOIN [Attendance] A
        ON A.event_id = E.id";

    try{
      var query =
          new SqlConnection(
            Constants.Get_ConnStr());
      var events = query.Query<Event, Attendance, Event>(
        sql,
        map: (e,a) => {          
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
    
    public static List<Event> GetEvents(long event_id = -1)
    {
      
      return new List<Event>();
    }

    public static bool SaveEvents(List<Event> events, UserAccess ua)
    {
      
      return true;
    }
  }
}