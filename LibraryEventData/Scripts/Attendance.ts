namespace EventData
{
  interface IAttendance
  {
    event_id: number;
    youth_count: number;
    adult_count: number;
    
    notes: string;
  }

  export class Attendance implements IAttendance
  {
    event_id: number = -1;
    youth_count: number = 0;
    adult_count: number = 0;
    notes: string = "";

    constructor()
    {

    }

    public static Save(): void
    {
      // this function will take the contents of the current
      // attendance page and create an attendance object,
      // and then send that object to the Save Attendance end point.


      // first let's create event and attendance objects from
      // the form
      let attendance = Attendance.CreateAttendance();
      console.log('attendance', attendance);
      // this also validates the attendance
      if (attendance === null)
      {
        return;
      }

      // if they they have admin access, let's save the event too


      // then let's save the attendance
      Attendance.SaveAttendance(attendance);
    }

    public static SaveAttendance(attendance: Attendance)
    {
      XHR.SaveObject("./API/Attendance/Save", attendance).then(function (response)
      {
        if (response.length === 0)
        {
          if (EventData.CurrentAccess.current_access === access_type.admin_access)
          {
            let event = Event.CreateEventFromAttendance();
            if (event === null) return;
            Event.UpdateEvent(event);
          }
          EventData.CloseModals();
          EventData.Event.GetList();
        }
        else
        {
          EventData.CloseModals();
          let errorText = response.join("\r\n");
          console.log('error', errorText);
          EventData.ShowError(errorText);
        }

      }).catch(function (errors)
      {
        // Show error message;
        console.log('error', errors);
        EventData.ShowError("An error occurred while attempting to update this event. Please try again. If this issue persists, please contact the help desk.");
      });
    }

    public static CreateAttendance():Attendance
    {
      // this function will create an Attendance object based
      // on the attendance modal and either return an
      // attendance object if successful or null if there are errors.
      let errorsFound = false;
      let a = new Attendance();

      let youthCount = EventData.GetInputValue("youthCount");
      if (youthCount.length === 0)
      {
        errorsFound = true;
      }
      else
      {
        a.youth_count = parseInt(youthCount);
      }
      let adultCount = EventData.GetInputValue("adultCount");
      if (adultCount.length === 0)
      {
        errorsFound = true;
      }
      else
      {
        a.adult_count = parseInt(adultCount);
      }
      let notes = <HTMLTextAreaElement>document.getElementById("eventNotes");
      a.notes = notes.value;
      if (errorsFound)
      {
        return null;
      }
      else
      {
        a.event_id = EventData.CurrentEvent.id;
        return a;
      }
    }

    public static LoadEventAndAttendance(event: Event)
    {
      // this function will take the event and attendance objects
      // and load them into the attendance form
      console.log('selected event', event);
      EventData.SetInputValue("eventName", event.event_name);
      EventData.SetSelectValue("selectLocation", event.location_id.toString());
      EventData.SetInputValue("eventDate", event.event_date);
      EventData.SetSelectValue("selectTimeFrom", event.event_time_from);
      EventData.SetSelectValue("selectTimeTo", event.event_time_to);
      let targetAudiences = <HTMLSelectElement>document.getElementById("selectTargetAudience");
      EventData.SetSelectValue("selectEventType", event.event_type_id.toString());
      for (let i = 0; i < targetAudiences.options.length; i++)
      {
        let item = targetAudiences.options[i];
        let found = (event.target_audiences.indexOf(parseInt(item.value)) !== -1);
        item.selected = found;
      }
      if (event.attendance === null || event.attendance.event_id === -1)
      {
        EventData.SetInputValue("youthCount", "");
        EventData.SetInputValue("adultCount", "");
        EventData.SetInputValue("eventNotes", "");        
        return;
      }
      EventData.SetInputValue("youthCount", event.attendance.youth_count.toString());
      EventData.SetInputValue("adultCount", event.attendance.adult_count.toString());
      EventData.SetInputValue("eventNotes", event.attendance.notes);
    }

  }

}