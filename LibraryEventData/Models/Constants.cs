using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using Dapper;

namespace LibraryEventData.Models
{
  public static class Constants
  {
    public const int appId = 20020;
    public static bool UseProduction()
    {
      switch (Environment.MachineName.ToUpper())
      {
        case "CLAYBCCDV10":
        
          // Test Environment Machines
          return false;

        case "MISSL01":
        case "MISHL05":
        case "CLAYBCCIIS01":
          return true;

        default:
          // we'll return false for any machinenames we don't know.
          return false;
      }
    }

    public static List<T> Get_Data<T>(string query)
    {
      try
      {
        using (IDbConnection db =
          new SqlConnection(
            Get_ConnStr()))
        {
          return (List<T>)db.Query<T>(query);
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, query);
        return null;
      }
    }
 
    public static List<T> Get_Data<T>(string query, List<int> ids)
    {
      try
      {
        using (IDbConnection db =
          new SqlConnection(
            Get_ConnStr()))
        {
          return (List<T>)db.Query<T>(query, new { ids });
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, query);
        return null;
      }
    }

    public static List<T> Get_Data<T>(string query, DynamicParameters dbA)
    {
      try
      {
        using (IDbConnection db =
          new SqlConnection(
            Get_ConnStr()))
        {
          return (List<T>)db.Query<T>(query, dbA);
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, query);
        return null;
      }
    }

    public static int Exec_Query(string query, DynamicParameters dbA)
    {
      try
      {
        using (IDbConnection db =
          new SqlConnection(
            Get_ConnStr()))
        {
          return db.Execute(query, dbA);
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, query);
        return -1;
      }
    }

    public static int Save_Data<T>(string insertQuery, T item)
    {
      try
      {
        using (IDbConnection db = new SqlConnection(Get_ConnStr()))
        {
          int i = db.Execute(insertQuery, item);
          return i;
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, insertQuery);
        return -1;
      }
    }

    public static string Get_ConnStr()
    {
      var cs = "EventData" + (UseProduction() ? "Prod" : "QA");
      return ConfigurationManager.ConnectionStrings[cs].ConnectionString;
    }

  }
}