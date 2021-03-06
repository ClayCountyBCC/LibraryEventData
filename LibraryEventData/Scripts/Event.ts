﻿namespace EventData
{
  interface IEvent
  {
    id: number;
    event_name: string;
    event_type_id: number;
    target_audiences: Array<number>;
    event_date: string;
    event_time_from: string;
    event_time_to: string;
    location_id: number;    
    attendance: Attendance;

  }

  export class Event implements IEvent
  {
    public id: number = -1;
    public event_name: string = "";
    public event_type_id: number = -1;
    public target_audiences: Array<number> = [];
    public event_date: string;
    public event_time_from: string = "";
    public event_time_to: string = "";
    public location_id: number = -1;
    public attendance: Attendance = null;

    constructor()
    {
    }

    public static GetList(): void
    {
      // this function will be used to populate the the 
      // list of events shown on the main page.
      let eventDateElement = <HTMLSelectElement>document.getElementById("filterEventDate");
      let locationElement = <HTMLSelectElement>document.getElementById("filterLocation");
      let completedElement = <HTMLInputElement>document.getElementById("filterInComplete");
      let eventDate = eventDateElement.value;
      let location = locationElement.value;
      let CompletedOnly = completedElement.checked;
      let qs = "?InCompleteOnly=" + CompletedOnly;
      if (eventDate !== "-1")
      {
        qs = qs + "&EventDate=" + eventDate;
      }
      if (location !== "-1")
      {
        qs = qs + "&Location=" + location;
      }

      XHR.GetArray<Event>("./API/Event/GetList", qs).then(function (events)
      {
        console.log('Events returned by GetList', events);
        Event.BuildEventList(events);

      }).catch(function (error)
      {
        // if this happens, we should just notify the user
        // and stop.  We won't clear the existing Event list, if there are any.
        // Create Message Modal
        console.log('error', error);
        EventData.ShowError("An error occurred getting the list of events. Please refresh the page and try again. If this issue persists, please contact the help desk.");
      });
    }

    public static Get(id: number): Promise<Event>
    {
      // this function will return the event that has this id from the server.
      return XHR.GetObject<Event>("./API/Event/GetEvent", "?id=" + id.toString());
    }

    public static BuildEventList(events: Array<Event>): void
    {
      // this function is going to clear the current event list table
      // and then rebuild it with the contents of the events array argument.
      let eventList = document.getElementById("eventList");
      Utilities.Clear_Element(eventList);

      for (let e of events)
      {
        let tr = document.createElement("tr");
        tr.style.cursor = "pointer";
        tr.onclick = function ()
        {
          // this is how we're going go to populate and show the attendance modal.
          // this function is going to request a this event from the server 
          // by referencing the id.
          Event.Get(e.id).then(function (event)
          {
            EventData.CurrentEvent = event;
            Attendance.LoadEventAndAttendance(event);
            let attendance = document.getElementById("addAttendance");
            attendance.classList.add("is-active");
          }).catch(function (error)
          {
            console.log('error', error);
            EventData.ShowError("An error occurred getting the list of events. Please refresh the page and try again. If this issue persists, please contact the help desk.");
          });

        }
        tr.appendChild(Event.CreateEventListTextCell(e.event_name));
        let location = TargetData.GetTargetData(EventData.Locations, e.location_id.toString());
        tr.appendChild(Event.CreateEventListTextCell(location.Label));
        let eventDate = e.event_date + ' ' + e.event_time_from + ' - ' + e.event_time_to;
        tr.appendChild(Event.CreateEventListTextCell(eventDate));
        tr.appendChild(Event.CreateEventListCheckboxCell(e.attendance !== null));
        eventList.appendChild(tr);
      }

    }

    static CreateEventListTextCell(value: string): HTMLTableCellElement
    {
      let td = document.createElement("td");
      td.appendChild(document.createTextNode(value));
      return td;
    }

    static CreateEventListCheckboxCell(value: boolean): HTMLTableCellElement
    {
      let td = document.createElement("td");
      let label = document.createElement("label");
      label.classList.add("checkbox");
      let cb = document.createElement("input");
      cb.type = "checkbox";
      cb.disabled = true;
      cb.checked = value;
      label.appendChild(cb);
      label.appendChild(document.createTextNode("Completed?"));
      td.appendChild(label);
      return td;
    }

    public static CreateEventFromAttendance(): Event
    {
      let errorsFound = false;
      let e = new Event();
      let eventName = EventData.GetInputValue("eventName");
      if (eventName.length === 0)
      {
        errorsFound = true;
      }
      else
      {
        e.event_name = eventName;
      }

      let location = EventData.GetSelectValue("selectLocation");
      if (location.length === 0)
      {
        errorsFound = true;
      }
      else
      {
        e.location_id = parseInt(location);
      }

      let eventType = EventData.GetSelectValue("selectEventType");
      if (eventType.length === 0)
      {
        errorsFound = true;
      }
      else
      {
        e.event_type_id = parseInt(eventType);
      }

      let targetAudiences = EventData.GetMultipleSelectValue("selectTargetAudience");
      if (targetAudiences.length === 0)
      {
        errorsFound = true;
      }
      else
      {
        for (let ta of targetAudiences)
        {
          e.target_audiences.push(parseInt(ta));
        }
      }

      let eventDate = EventData.GetInputValue("eventDate");
      if (eventDate.length === 0)
      {
        errorsFound = true;
      }
      else
      {
        e.event_date = eventDate;
      }

      let timeFrom = EventData.GetSelectValue("selectTimeFrom");
      if (timeFrom.length === 0)
      {
        errorsFound = true;
      }
      else
      {
        e.event_time_from = timeFrom;
      }

      let timeTo = EventData.GetSelectValue("selectTimeTo");
      if (timeTo.length === 0)
      {
        errorsFound = true;
      }
      else
      {
        e.event_time_to = timeTo;
      }

      if (errorsFound)
      {
        return null;
      }
      else
      {
        e.id = EventData.CurrentEvent.id;
        return e;
      }
    }

    static Toggle_Event_Save(disabled: boolean)
    {
      let saveButton = <HTMLButtonElement>document.getElementById("saveEvent");      
      saveButton.disabled = disabled;
      if (disabled)
      {
        saveButton.classList.add("is-loading");
      }
      else
      {
        saveButton.classList.remove("is-loading");
      }
    }

    public static Save(): void
    {
      // this function will take the contents of the
      // event creation page and convert it into javascript
      // objects and send them to the Save URI.
      // indicate that we're saving by:
      // adding a loading indicator to the save button
      // disabling the save button while we're saving
      Event.Toggle_Event_Save(true);

      let error = false;
      let eventNameElement = <HTMLInputElement>document.getElementById("addEventName");
      let eventName = eventNameElement.value.trim();
      let eventTypeElement = <HTMLSelectElement>document.getElementById("addEventType");
      let eventType = eventTypeElement.value;
      let targetAudiences = EventData.GetMultipleSelectValue("addTargetAudience");
      let targetAudienceElement = <HTMLSelectElement>document.getElementById("addTargetAudience");

      eventNameElement.classList.remove("is-danger");
      if (eventName.length < 3)
      {
        eventNameElement.classList.add("is-danger");
        error = true;
      }

      eventTypeElement.parentElement.classList.remove("is-danger");
      if (eventType === "-1")
      {
        eventTypeElement.parentElement.classList.add("is-danger");
        error = true;
      }

      targetAudienceElement.parentElement.classList.remove("is-danger");
      if (targetAudiences.length === 0)
      {
        targetAudienceElement.parentElement.classList.add("is-danger");
        error = true;
      }
      
      let events: Array<Event> = [];
      for (let i of EventData.AddedEvents)
      {
        let locationElement = <HTMLSelectElement>document.getElementById("addLocation" + i);
        let eventDateElement = <HTMLInputElement>document.getElementById("addEventDate" + i);
        let eventTimeFromElement = <HTMLSelectElement>document.getElementById("addEventFrom" + i);
        let eventTimeToElement = <HTMLSelectElement>document.getElementById("addEventTo" + i);
        locationElement.parentElement.classList.remove("is-danger");
        eventDateElement.classList.remove("is-danger");
        eventTimeFromElement.parentElement.classList.remove("is-danger");
        eventTimeToElement.parentElement.classList.remove("is-danger");
        let event = new Event();
        event.id = i;
        event.event_name = eventName;
        event.event_type_id = parseInt(eventType);
        for (let ta of targetAudiences)
        {
          event.target_audiences.push(parseInt(ta));
        }

        if (locationElement.selectedIndex === 0)
        {
          locationElement.parentElement.classList.add("is-danger");
          error = true;
        }
        else
        {
          let location = locationElement.selectedOptions[0].value;
          event.location_id = parseInt(location);
        }

        if (eventDateElement.value.length === 0)
        {
          eventDateElement.classList.add("is-danger");
          error = true;
        }
        else
        {
          event.event_date = eventDateElement.value;
        }
        

        if (eventTimeFromElement.selectedIndex === 0)
        {
          eventTimeFromElement.parentElement.classList.add("is-danger");
          error = true;
        }
        else
        {
          let from = eventTimeFromElement.selectedOptions[0].value;
          event.event_time_from = from;
        }

        if (eventTimeToElement.selectedIndex === 0)
        {
          eventTimeToElement.parentElement.classList.add("is-danger");
          error = true;
        }
        else
        {
          let to = eventTimeToElement.selectedOptions[0].value;
          event.event_time_to = to;
        }

        events.push(event);
      }

      // Convert this to a Save to Server and we're done.
      if (!error)
      {
        //Event.BuildEventList(events);
        Event.SaveEvents(events); // enable on endpoints updated
      }
      else
      {
        Event.Toggle_Event_Save(false);
      }

    }

    public static SaveEvents(events: Array<Event>)
    {
      XHR.SaveObject("./API/Event/Save", events).then(function (response)
      {
        console.log('response from Event Save', response);
        if (response.length === 0)
        {
          // Clear the form
          Event.ResetAddEvent();
          Event.GetList();
          // Indicate Success
        }
        else
        {
          // show errors returned from client.
          EventData.CloseModals();
          let errorText = response.join("\n");
          console.log('errortext', errorText);
          EventData.ShowError(errorText);
        }
        Event.Toggle_Event_Save(false);
        
      }).catch(function (errors)
      {
        // Show error message;
        EventData.CloseModals();
        console.log('error', errors);
        EventData.ShowError("An error occurred while attempting to save these events. Please try again. If this issue persists, please contact the help desk.");
        Event.Toggle_Event_Save(false);
      });
    }

    public static UpdateEvent(event: Event)
    {
      XHR.SaveObject("./API/Event/Update", event).then(function (response)
      {
        if (response.length === 0)
        {
          // Do nothing
        }
        else
        {
          EventData.CloseModals();
          let errorText = response.join("\n");
          console.log('errortext', errorText);
          EventData.ShowError(errorText);        }

      }).catch(function (errors)
      {
        // Show error message;
        console.log('error', errors);
        EventData.ShowError("An error occurred while attempting to update this event. Please try again. If this issue persists, please contact the help desk.");
      });
    }

    public static ResetAddEvent(): void
    {
      // This function puts the Add Event page in its initial state
      // no matter it's current state.
      let eventName = <HTMLInputElement>document.getElementById("addEventName");
      eventName.value = "";
      let eventType = <HTMLSelectElement>document.getElementById("addEventType");
      eventType.selectedIndex = 0;
      let targetAudience = <HTMLSelectElement>document.getElementById("addTargetAudience");
      targetAudience.selectedIndex = -1;

      let addEventContainer = document.getElementById("addEventList");
      Utilities.Clear_Element(addEventContainer);
      AddedEvents = [];
      Event.AddEventRow();
      Event.Toggle_Event_Save(false);
    }

    public static AddEventRow(): void
    {
      let id = 1;
      let ae = EventData.AddedEvents;
      if (ae.length > 0) id = ae[ae.length - 1] + 1; // add one to the last id added.
      EventData.AddedEvents.push(id);
      let container = <HTMLTableSectionElement>document.getElementById("addEventList");
      container.appendChild(Event.CreateRow(id));
    }

    static CreateRow(id: number): HTMLTableRowElement
    {
      let tr = document.createElement("tr");
      tr.id = "eventRow" + id.toString();
      tr.appendChild(Event.CreateLocationElement(id));
      tr.appendChild(Event.CreateEventDateElement(id));
      tr.appendChild(Event.CreateEventTimeFromElement(id));
      tr.appendChild(Event.CreateEventTimeToElement(id));
      tr.appendChild(Event.CreateRemoveEventButton(id));
      return tr;
    }

    static CreateLocationElement(id: number): HTMLTableCellElement
    {
      let td = document.createElement("td");
      let field = document.createElement("div");
      field.classList.add("field")
      let control = document.createElement("div");
      control.classList.add("control");
      let selectContainer = document.createElement("div");
      selectContainer.classList.add("select");
      let location = <HTMLSelectElement>document.createElement("select");
      location.add(Utilities.Create_Option("-1", "Select Location", true));
      location.id = "addLocation" + id.toString();
      for (let l of Locations)
      {
        location.add(Utilities.Create_Option(l.Value, l.Label));
      }
      selectContainer.appendChild(location);
      control.appendChild(selectContainer);
      field.appendChild(control);
      td.appendChild(field);
      return td;
    }

    static CreateEventDateElement(id: number): HTMLTableCellElement
    {
      let td = document.createElement("td");
      let field = document.createElement("div");
      field.classList.add("field")
      let control = document.createElement("div");
      control.classList.add("control");
      let eventDate = document.createElement("input");
      eventDate.classList.add("input");
      //works in IE
      eventDate.setAttribute("type", "date");
      //Does not work in IE
      //eventDate.type = "date";
      eventDate.id = "addEventDate" + id.toString();
      control.appendChild(eventDate);
      field.appendChild(control);
      td.appendChild(field);
      return td;
    }

    static CreateEventTimeFromElement(id: number): HTMLTableCellElement
    {
      let td = document.createElement("td");
      let field = document.createElement("div");
      field.classList.add("field")
      let control = document.createElement("div");
      control.classList.add("control");
      let selectContainer = document.createElement("div");
      selectContainer.classList.add("select");
      let eventTime = <HTMLSelectElement>document.createElement("select");
      eventTime.add(Utilities.Create_Option("", "Event From", true));
      eventTime.id = "addEventFrom" + id.toString();
      eventTime.onchange = function (this, event)
      {
        let index = (<HTMLSelectElement>this).selectedIndex;
        EventData.Event.UpdateEventTimeToElement(id, index);
      }
      for (let t of Times)
      {
        eventTime.add(Utilities.Create_Option(t.Value, t.Label));
      }
      selectContainer.appendChild(eventTime);
      control.appendChild(selectContainer);
      field.appendChild(control);
      td.appendChild(field);
      return td;
    }

    static CreateEventTimeToElement(id: number): HTMLTableCellElement
    {
      let td = document.createElement("td");
      let field = document.createElement("div");
      field.classList.add("field")
      let control = document.createElement("div");
      control.classList.add("control");
      let selectContainer = document.createElement("div");
      selectContainer.classList.add("select");
      let eventTime = <HTMLSelectElement>document.createElement("select");
      eventTime.add(Utilities.Create_Option("", "Event To", true));
      eventTime.id = "addEventTo" + id.toString();
      for (let t of Times)
      {
        eventTime.add(Utilities.Create_Option(t.Value, t.Label));
      }
      selectContainer.appendChild(eventTime);
      control.appendChild(selectContainer);
      field.appendChild(control);
      td.appendChild(field);
      return td;
    }

    static UpdateEventTimeToElement(id: number, SelectedTimeFromIndex: number)
    {
      let eventTime = <HTMLSelectElement>document.getElementById("addEventTo" + id.toString());
      Utilities.Clear_Element(eventTime);
      eventTime.add(Utilities.Create_Option("", "Event To", true));
      for (let i = SelectedTimeFromIndex; i < Times.length; i++)
      {
        eventTime.add(Utilities.Create_Option(Times[i].Value, Times[i].Label));
      }
    }

    static CreateRemoveEventButton(id: number): HTMLTableCellElement
    {
      let td = document.createElement("td");
      let field = document.createElement("div");
      field.classList.add("field")
      let control = document.createElement("div");
      control.classList.add("control");
      let remove = document.createElement("button");
      remove.classList.add("button");
      remove.classList.add("is-warning");
      remove.type = "button";
      remove.appendChild(document.createTextNode("Remove"));
      if (id === 1) remove.disabled = true;
      remove.onclick = function ()
      {
        EventData.Event.RemoveEventRow(id);
      }
      control.appendChild(remove);
      field.appendChild(control);
      td.appendChild(field);
      return td;
    }

    public static RemoveEventRow(id: number): void
    {
      let e = document.getElementById("eventRow" + id.toString());
      e.parentNode.removeChild(e);
      let i = EventData.AddedEvents.indexOf(id);
      if (i > -1) EventData.AddedEvents.splice(i, 1);
      console.log(EventData.AddedEvents);
    }

  }
}