using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LibraryEventData.Models
{
  public class AttendenceData
  {
    public long event_id{ get; set; } // in case we want to pull more than one event at a time.
    public string event_type { get; set; }
    public int number_youth { get; set; }
    public int number_adult { get; set; }
    public string notes { get; set; }


    public AttendenceData()
    {
      
    }
  }
}