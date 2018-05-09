﻿using System;
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

    public enum PaymentTypes: int
    {
      Building = 0,
      Rescue = 1
    }


    public static bool UseProduction()
    {
      switch (Environment.MachineName.ToUpper())
      {
        case "CLAYBCCDV10":
        case "MISSL01":
          // Test Environment Machines
          return false;

        case "CLAYBCCIIS01":
        case "CLAYBCCDMZIIS01":
          // will need to add the DMZ machine name(s) here.
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
            Get_ConnStr("WATSC" + (UseProduction() ? "Prod" : "QA"))))
        {
          return (List<T>)db.Query<T>(query);
        }
      }
      catch (Exception ex)
      {
        Log(ex, query);
        return null;
      }
    }

    public static List<T> Get_Data<T>(string query, List<int> ids)
    {
      try
      {
        using (IDbConnection db =
          new SqlConnection(
            Get_ConnStr("WATSC" + (UseProduction() ? "Prod" : "QA"))))
        {
          return (List<T>)db.Query<T>(query, new { ids });
        }
      }
      catch (Exception ex)
      {
        Log(ex, query);
        return null;
      }
    }

    public static List<T> Get_Data<T>(string query, DynamicParameters dbA)
    {
      try
      {
        using (IDbConnection db =
          new SqlConnection(
            Get_ConnStr("WATSC" + (UseProduction() ? "Prod" : "QA"))))
        {
          return (List<T>)db.Query<T>(query, dbA);
        }
      }
      catch (Exception ex)
      {
        Log(ex, query);
        return null;
      }
    }

    public static int Exec_Query(string query, DynamicParameters dbA)
    {
      try
      {
        using (IDbConnection db =
          new SqlConnection(
            Get_ConnStr("WATSC" + (UseProduction() ? "Prod" : "QA"))))
        {
          return db.Execute(query, dbA);
        }
      }
      catch (Exception ex)
      {
        Log(ex, query);
        return -1;
      }
    }

    public static bool Save_Data<T>(string insertQuery, T item)
    {
      try
      {
        using (IDbConnection db = new SqlConnection(Get_ConnStr("Printing")))
        {
          db.Execute(insertQuery, item);
          return true;
        }
      }
      catch (Exception ex)
      {
        Log(ex, insertQuery);
        return false;
      }
    }

    public static string Get_ConnStr(string cs)
    {
      return ConfigurationManager.ConnectionStrings[cs].ConnectionString;
    }

    #region Log Code

    public static void Log(Exception ex, string Query = "")
    {
      SaveLog(new ErrorLog(ex, Query));
    }

    public static void Log(string Text, string Message,
      string Stacktrace, string Source, string Query = "")
    {
      ErrorLog el = new ErrorLog(Text, Message, Stacktrace, Source, Query);
      SaveLog(el);
    }

    private static void SaveLog(ErrorLog el, string cs = "ProdLog")
    {
      string sql = @"
          INSERT INTO ErrorData 
          (applicationName, errorText, errorMessage, 
          errorStacktrace, errorSource, query)  
          VALUES (@applicationName, @errorText, @errorMessage,
            @errorStacktrace, @errorSource, @query);";
      try
      {
        using (IDbConnection db = new SqlConnection(Get_ConnStr(cs)))
        {
          db.Execute(sql, el);
        }
      }
      catch(Exception ex)
      {
        SaveLog(el, "Log");
        SaveLog(new ErrorLog(ex), "Log");
      }

    }

    public static void SaveEmail(string to, string subject, string body, string cs = "ProdLog")
    {
      string sql = @"
          INSERT INTO EmailList 
          (EmailTo, EmailSubject, EmailBody)  
          VALUES (@To, @Subject, @Body);";

      try
      {
        var dbArgs = new Dapper.DynamicParameters();
        dbArgs.Add("@To", to);
        dbArgs.Add("@Subject", subject);
        dbArgs.Add("@Body", body);

        using (IDbConnection db = new SqlConnection(Get_ConnStr(cs)))
        {
          db.Execute(sql, dbArgs);
        }
      }
      catch(Exception ex)
      {
        // if we fail to save an email to the production server,
        // let's save it to the backup DB server.
        if(cs == "ProdLog")
        {
          SaveEmail(to, subject, body, "Log");
        }
        else
        {
          Constants.Log(ex, sql);
          Constants.Log("Payment Email not sent", subject, body, "");
        }

      }
    }


    #endregion
  }
}