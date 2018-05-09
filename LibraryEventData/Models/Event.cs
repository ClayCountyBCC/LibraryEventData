using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

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
    public Attendance manual_event_data { get; set; }

    public Event()
    {
       
    }

    public static List<Event> GetEventsRaw()
    {
      string sql = @"
      
      USE ClayEventData
      
      SELECT DISTINCT id,event_name
      FROM Event";

      try
      {
        return Constants.Get_Data<Event>(sql);
      }
      catch (Exception ex)
      {
        Constants.Log(ex, sql);
        return new List<Event>();
      }
    }


    public static List<Event> GetEvenAttendenceDat(long event_id)
    {
      
      return new List<Event>();
    }

    public static bool SaveEvents(List<Event> events, UserAccess ua)
    {
      
      return true;
    }
  }
}