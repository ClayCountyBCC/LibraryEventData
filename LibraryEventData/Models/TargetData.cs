using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LibraryEventData.Models
{
  public class TargetData
  {

    public List<string> library_name { get; set; }
    public List<string> event_type { get; set; }
    public List<string> target_audience { get; set; }
    public List<string> age_group{ get; set; }



    public TargetData()
    {
        
    }
    


  }
}