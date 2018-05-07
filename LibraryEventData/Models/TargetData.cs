using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LibraryEventData.Models
{
  public class TargetData
  {

    public int Label { get; set; }
    public string Value { get; set; }


    public TargetData()
    {
        
    }
    

    public static List<TargetData> GetLocations()
    {
      string sql = @"
        ";
      Constants.Get_Data<TargetData>(sql); 
      return new List<TargetData>();
    }

    public static List<TargetData> GetEventTypes()
    {
      string sql = @"
        ";
      Constants.Get_Data<TargetData>(sql); return new List<TargetData>();
    }

    public static List<TargetData> GetTargetAges()
    {
      string sql = @"
        ";
      Constants.Get_Data<TargetData>(sql);  // TODO: get selection cached
      return new List<TargetData>();
    }

    public static List<TargetData> GetTargetAudience()
    {
      string sql = @"
        ";
      Constants.Get_Data<TargetData>(sql); // TODO: get selection cached
      return new List<TargetData>();
    }

    public static List<TargetData> GetCachedLocations()
    {
      string sql = @"
        ";
      Constants.Get_Data<TargetData>(sql);
      return new List<TargetData>();
    }

    public static List<TargetData> GetCachedEventTypes()
    {

      string sql = @"
        ";
      Constants.Get_Data<TargetData>(sql); return new List<TargetData>();
    }

    public static List<TargetData> GetCachedTargetAges()
    {
      string sql = @"
        ";
      Constants.Get_Data<TargetData>(sql);  // TODO: get selection cached
      return new List<TargetData>();
    }

    public static List<TargetData> GetCached()
    {
      string sql = @"
        ";
      Constants.Get_Data<TargetData>(sql); // TODO: get selection cached
      return new List<TargetData>();
    }
  }
}