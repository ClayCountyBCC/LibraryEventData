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
      CIP.AbsoluteExpiration = DateTime.Now.AddHours(4);
      return GetOrAddExisting(key, () => InitItem(key), CIP);
    }

    public static object GetItem(string key, CacheItemPolicy CIP)
    {
      return GetOrAddExisting(key, () => InitItem(key), CIP);
    }

    private static T GetOrAddExisting<T>(string key, Func<T> valueFactory, CacheItemPolicy CIP)
    {

      Lazy<T> newValue = new Lazy<T>(valueFactory);
      var oldValue = _cache.AddOrGetExisting(key, newValue, CIP) as Lazy<T>;
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

    private static object InitItem(string key)
    {
      string[] s = key.Split(new[] { "," }, StringSplitOptions.None);

      switch (s[0].ToLower())
      {
        case "eventypeselections":
          return List<Event> Event.getEvent();
        default:
          return null;
      }
    }
  }
}