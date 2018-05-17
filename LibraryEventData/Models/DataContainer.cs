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
    public List<TargetData> Times { get; set; }
    
    public DataContainer(string username)
    {
      try
      {

        this.Locations = (List<TargetData>)MyCache.GetItem("locations");
        this.Event_Types = (List<TargetData>)MyCache.GetItem("event_types");
        this.Target_Audiences = (List<TargetData>)MyCache.GetItem("target_audience");
        this.CurrentAccess = new UserAccess(username);
        this.Times = (List<TargetData>)MyCache.GetItem("time_list");

      }
      catch(Exception ex)
      {
        new ErrorLog(ex);
      }

    }


  }
}