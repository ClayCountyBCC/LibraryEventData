using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime;
using System.Runtime.Caching;

namespace LibraryEventData.Models
{
  public class MyCache
  {
    private static MemoryCache _cache = new MemoryCache("myCache");

    public static object GetItem(string key)
    {
      var CIP = new CacheItemPolicy();
      //
      return GetOrAddExisting(key, () => InitItem(key), CIP);
    }

    public static object GetItem(string key, CacheItemPolicy CIP)
    {
      return GetOrAddExisting(key, () => InitItem(key), CIP);
    }

    private static T GetOrAddExisting<T>(string key, Func<T> valueFactory, CacheItemPolicy CIP)
    {

      Lazy<T> newValue = new Lazy<T>(valueFactory);
      var oldValue = _cache.AddOrGetExisting(key, newValue, GetCIP(key)) as Lazy<T>;
      try
      {
        return (oldValue ?? newValue).Value;
      }
      catch(Exception ex)
      {
        // Handle cached lazy exception by evicting from cache. Thanks to Denis Borovnev for pointing this out!
        _cache.Remove(key);
        Constants.Log(ex, "");
        throw;
      }
    }
    public static CacheItemPolicy GetCIP(string key)
    {
      string[] s = key.Split(new[] { "," }, StringSplitOptions.None);

      switch (s[0].ToLower())
      {
        case "locations":
        case "event_types":
        case "target_audience":
          return new CacheItemPolicy() { AbsoluteExpiration = DateTime.Today.AddDays(1) };
        case "time_list":
          return new CacheItemPolicy() { AbsoluteExpiration = DateTime.Today.AddDays(7) };
        default:
          return new CacheItemPolicy() { AbsoluteExpiration = DateTime.Now.AddHours(4) };
      }
    }

    private static object InitItem(string key)
    {
      string[] s = key.Split(new[] { "," }, StringSplitOptions.None);

      switch (s[0].ToLower())
      {
        case "event_types":
          return TargetData.GetEventTypesRaw();
        case "locations":
          return TargetData.GetLocationsRaw();
        case "target_audience":
          return TargetData.GetTargetAudienceRaw();
        case "time_list":
          return TargetData.GetCachedTimeList();
        default:
          return null;
      }
    }

  }

}