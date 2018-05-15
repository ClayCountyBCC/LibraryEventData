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
    
    public static List<TargetData> GetLocationsRaw()
    {
      string sql = @"
      
      USE ClayEventData
      
      SELECT id Value, [Location] Label
      FROM [dbo].[Location]";

      return Constants.Get_Data<TargetData>(sql);

    }

    public static List<TargetData> GetEventTypesRaw()
    {
      string sql = @"
      USE ClayEventData

      SELECT id Value, Event_Type Label
      FROM Event_Type";

      return Constants.Get_Data<TargetData>(sql);
    }

    public static List<TargetData> GetTargetAudienceRaw()
    {
      string sql = @"
      USE ClayEventData

      SELECT id Value, target_audience Label
      FROM Target_Audience";

      return Constants.Get_Data<TargetData>(sql);

    }

  }
}