using System;
using System.Collections.Generic;
using System.Runtime.Caching;


namespace LibraryEventData.Models
{
  public class TargetData
  {

    public int Label { get; set; }
    public string Value { get; set; }

    public TargetData()
    {
        
    }
    
    public static List<TargetData> GetLocationsRaw()
    {
      string sql = @"
      
      USE ClayEventData
      
      SELECT DISTINCT 'location' Label, [Location] Value
      FROM [dbo].[Location]";

      try
      {
        return Constants.Get_Data<TargetData>(sql);
      }
      catch (Exception ex)
      {
        Constants.Log(ex, sql);
        return new List<TargetData>();
      }

    }

    public static List<TargetData> GetEventTypesRaw()
    {
      string sql = @"
        USE ClayEventData


        SELECT DISTINCT 'event_type' Label, Event_Type Value
        FROM Event_Type";

      try
      {
        return Constants.Get_Data<TargetData>(sql);
      }
      catch(Exception ex)
      {
        Constants.Log(ex, sql);
         return new List<TargetData>();
      }
      
    }

    public static List<TargetData> GetTargetAudienceRaw()
    {
      string sql = @"
        USE ClayEventData


        SELECT DISTINCT 'target_audience' Label, target_audience Value
        FROM Target_Audience";

      try
      {
        return Constants.Get_Data<TargetData>(sql);
      }
      catch (Exception ex)
      {
        Constants.Log(ex, sql);
        return new List<TargetData>();
      }
    }

  }
}