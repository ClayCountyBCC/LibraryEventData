using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using LibraryEventData.Models;
using System.Runtime.Caching;

using System.Web;

namespace LibraryEventData.Models
{
  public class DataContainer
  {
    public List<TargetData> Event_Types { get; set; }
    public List<TargetData> Locations { get; set; }
    public List<TargetData> Target_Audiences { get; set; }
    public UserAccess CurrentAccess { get; set; }
    public List<string> Times 

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
    public DataContainer(string username)
    {
      var CIP = new CacheItemPolicy() { AbsoluteExpiration = DateTime.Today.AddDays(1) };

      this.Locations = (List<TargetData>)MyCache.GetItem("locations", CIP);
      this.Event_Types = (List<TargetData>)MyCache.GetItem("event_types", CIP);
      this.Target_Audiences = (List<TargetData>)MyCache.GetItem("target_audience", CIP);
      this.CurrentAccess = UserAccess.GetUserAccess(username);
    }

  }
}