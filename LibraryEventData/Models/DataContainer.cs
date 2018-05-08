using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LibraryEventData.Models
{
  public class DataContainer
  {
    public List<TargetData> Event_Types { get; set; }
    public List<TargetData> Locations { get; set; }
    public List<TargetData> Target_Audiences { get; set; } // these should be plural
    public UserAccess CurrentAccess { get; set; }
    public List<string> Times
    {
      get
      {
        List<string> times = new List<string>();
        DateTime date = DateTime.MinValue.AddHours(10);
        DateTime endDate = date.AddHours(12);
        while (date <= endDate)
        {
          times.Add(date.ToString("hh:mm tt"));
          date = date.AddMinutes(15);
        }

        return times;
      }

    }
    public DataContainer()
    {

    }
  }
}