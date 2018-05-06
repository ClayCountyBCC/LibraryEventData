namespace EventData
{

  export let Times : Array<string> = ['10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM', '11:00 AM'];
  export let Locations : Array<GenericData> = [];
  export let AddedEvents: Array<number> = [];

  export function Start():void
  {
    ResetAddEvent();
  }

  export function View(id: string):void
  {
    let sections = document.querySelectorAll("body > div > section");
    if (sections.length > 0)
    {
      for (let i = 0; i < sections.length; i++)
      {
        let item = sections.item(i);
        if (item.id === id)
        {
          Utilities.Show(item);
        }
        else
        {
          Utilities.Hide(item);
        }
      }
    }
  }

  export function ResetAddEvent():void
  {
    let eventName = <HTMLInputElement>document.getElementById("addEventName");
    eventName.value = "";
    let addEventContainer = document.getElementById("addEventList");
    Utilities.Clear_Element(addEventContainer);
    AddedEvents = [];
    AddEventRow();
  }

  export function AddEventRow():void
  {
    let id = 1;
    let ae = EventData.AddedEvents;
    if (ae.length > 0) id = ae[ae.length - 1] + 1; // add one to the last id added.
    EventData.AddedEvents.push(id);
    let container = <HTMLTableSectionElement>document.getElementById("addEventList");
    container.appendChild(CreateRow(id));
  }

  function CreateRow(id: number): HTMLTableRowElement
  {
    let tr = document.createElement("tr");
    tr.id = "eventRow" + id.toString();
    tr.appendChild(CreateLocationElement(id));
    tr.appendChild(CreateEventDateElement(id));
    tr.appendChild(CreateEventTimeElement(id, "addEventFrom", "Event From"));
    tr.appendChild(CreateEventTimeElement(id, "addEventTo", "Event To"));
    tr.appendChild(CreateRemoveEventButton(id));
    return tr;
  }

  function CreateLocationElement(id: number): HTMLTableCellElement
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

  function CreateEventDateElement(id: number): HTMLTableCellElement
  {
    let td = document.createElement("td");
    let field = document.createElement("div");
    field.classList.add("field")
    let control = document.createElement("div");
    control.classList.add("control");
    let eventDate = document.createElement("input");
    eventDate.classList.add("input");
    eventDate.type = "date";
    eventDate.id = "addEventDate" + id.toString();
    control.appendChild(eventDate);
    field.appendChild(control);
    td.appendChild(field);
    return td;
  }

  function CreateEventTimeElement(id: number, name: string, initialValue: string): HTMLTableCellElement
  {
    let td = document.createElement("td");
    let field = document.createElement("div");
    field.classList.add("field")
    let control = document.createElement("div");
    control.classList.add("control");
    let selectContainer = document.createElement("div");
    selectContainer.classList.add("select");
    let eventTime = <HTMLSelectElement>document.createElement("select");
    eventTime.add(Utilities.Create_Option("", initialValue, true));
    eventTime.id = name + id.toString();
    for (let t of Times)
    {
      eventTime.add(Utilities.Create_Option(t, t));
    }
    selectContainer.appendChild(eventTime);
    control.appendChild(selectContainer);
    field.appendChild(control);
    td.appendChild(field);
    return td;
  }

  function CreateRemoveEventButton(id: number):HTMLTableCellElement
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
      RemoveEventRow(id);
    }
    control.appendChild(remove);
    field.appendChild(control);
    td.appendChild(field);
    return td;
  }

  export function RemoveEventRow(id: number): void
  {
    let e = document.getElementById("eventRow" + id.toString());
    e.parentNode.removeChild(e);
    let i = EventData.AddedEvents.indexOf(id);
    if (i > -1) EventData.AddedEvents.splice(i, 1);
    console.log(EventData.AddedEvents);
  }

  export function SaveEvent():void
  {

  }

}