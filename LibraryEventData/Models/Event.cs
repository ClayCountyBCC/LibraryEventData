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
    public DateTime event_time_to { get; set; }
    public int library_id{ get; set; }
    public List<string> age_groups { get; set; }
    public AttendenceData manual_event_data { get; set; }

    public Event()
    {
       
    }

    public static List<Event> GetRawListOfEvents()
    {
      List<Event> events = new List<Event>();

      // TODO: do stuff to get events


      return events;
    }


    public static List<Event> GetEvents(long event_id)
    {

      return new List<Event>();
    }

    public static bool SaveEvent(List<Event> events)
    {

      return true;
    }
  }
}