namespace EventData
{
  interface IEvent
  {
    id: number;
    event_name: string;
    event_date: Date;
    event_time_from: string;
    event_time_to: string;
    location_id: number;
    target_audience: Array<number>;
    attendance: Attendance;

  }

  export class Event implements IEvent
  {
    public id: number;
    public event_name: string;
    public event_date: Date;
    public event_time_from: string;
    public event_time_to: string;
    public location_id: number;
    public target_audience: Array<number>;
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
      let eventDate = eventDateElement.selectedOptions[0].value;
      let location = locationElement.selectedOptions[0].value;
      
      let CompletedOnly = (<HTMLInputElement>document.getElementById("filterCompleted")).checked;
      let qs = "";
      if (CompletedOnly)
      {
        qs = qs + "&CompletedOnly=true";
      }
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
        Event.BuildEventList(events);

      }).catch(function (error)
      {
        // if this happens, we should just notify the user
        // and stop.  We won't clear the existing Event list, if there are any.
        // Create Message Modal
      });
    }

    static BuildEventList(events: Array<Event>): void
    {
      // this function is going to clear the current event list table
      // and then rebuild it with the contents of the events array argument.
      let eventList = document.getElementById("eventList");
      Utilities.Clear_Element(eventList);
      
      for (let e of events)
      {
        let tr = document.createElement("tr");
        tr.onclick = function ()
        {
          // this is how we're going go to populate and show the attendance modal.
          // this function is going to request a this event from the server 
          // by referencing the id.
          alert(e.id); 
        }
        tr.appendChild(Event.CreateEventListTextCell(e.event_name));
        let location = TargetData.GetTargetData(EventData.Locations, e.location_id.toString());        
        tr.appendChild(Event.CreateEventListTextCell(location.Value));
        let eventDate = e.event_date.toLocaleDateString() + ' ' + e.event_time_from + ' - ' + e.event_time_to;
        tr.appendChild(Event.CreateEventListTextCell(eventDate));
        tr.appendChild(Event.CreateEventListCheckboxCell(e.attendance === null));
        eventList.appendChild(tr);
      }

    }

    static CreateEventListTextCell(value: string):HTMLTableCellElement
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
      cb.disabled = true;
      cb.checked = value;
      label.appendChild(cb);
      label.appendChild(document.createTextNode("Completed?"));
      td.appendChild(label);
      return td;
    }

    public static Save(): void
    {
      // this function will take the contents of the
      // event creation page and convert it into javascript
      // objects and send them to the Save URI.

    }

  }
}