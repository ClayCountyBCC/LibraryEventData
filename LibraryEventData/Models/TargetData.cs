using System;
using System.Collections.Generic;
using System.Runtime.Caching;


namespace LibraryEventData.Models
{
  public class TargetData
  {

    public string Label { get; set; }
    public string Value { get; set; }

    public TargetData()
    {
        
    }


    public TargetData(string label, string value)
    {
      this.Label = label;
      this.Value = value;
    }

    public static List<TargetData> GetLocationsRaw()
    {
      string sql = @"
      
      USE ClayEventData
      
      SELECT id Value, [Location] Label
      FROM [dbo].[Location]
      ORDER BY [Location]";

      return Constants.Get_Data<TargetData>(sql);

    }

    public static List<TargetData> GetEventTypesRaw()
    {
      string sql = @"
      USE ClayEventData

      SELECT id Value, Event_Type Label
      FROM Event_Type
      ORDER BY [Event_Type]";

      return Constants.Get_Data<TargetData>(sql);
    }

    public static List<TargetData> GetTargetAudienceRaw()
    {
      string sql = @"
      USE ClayEventData

      SELECT id Value, target_audience Label
      FROM Target_Audience
       ORDER BY [target_audience]";

      return Constants.Get_Data<TargetData>(sql);

    }

    public static List<TargetData> GetCachedTimeList()
    {
      var times = new List<TargetData>();
      DateTime date = DateTime.MinValue.AddHours(10);
      DateTime endDate = date.AddHours(12);
      while (date <= endDate)
      {
        var d = date.ToString("hh:mm tt");
        times.Add(new TargetData(d, d));
        date = date.AddMinutes(15);
      }

      return times;
    }
  }
}