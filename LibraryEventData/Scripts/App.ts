/// <reference path="xhr.ts" />
/// <reference path="utilities.ts" />

namespace EventData
{

  export let Times: Array<TargetData> = [];
  export let Locations: Array<TargetData> = [];
  export let AddedEvents: Array<number> = []; // used for the Add Event functionality
  export let CurrentAccess: UserAccess = null;
  export let CurrentEvent: Event = null;

  export function Start():void
  {
    GetInitialData();
  }

  function GetInitialData()
  {
    DataContainer.Get().then(
      function (dc)
      {
        console.log('dc', dc);
        CurrentAccess = dc.CurrentAccess;
        Times = dc.Times;
        Locations = dc.Locations;
        PopulateUIElements(dc.Event_Types, dc.Target_Audiences, dc.Locations, Times);
        HandleUserAccess();
        Event.GetList();

      }).catch(function (error)
      {
        // Notify of error.  If this happens, the app is basically unusable.
        ShowError("There was an issue loading the initial data.  Please refresh the web page and try again.  If this issue persists, please contact the help desk.");
      });
  }

  function HandleUserAccess()
  {
    // The default setup of the HTML page is for the appropriate fields
    // to be disabled based on most users only having Edit access.
    // So here we are going to check for admin access and enable the fields
    // and show the Add Event option.
    if (CurrentAccess.current_access === access_type.admin_access)
    {
      let addEvent = document.getElementById("addEvent");
      addEvent.classList.remove("hide"); // we remove this so that Bulma will take over the display.
      let selectLocation = <HTMLSelectElement>document.getElementById("selectLocation");
      let selectTimeFrom = <HTMLSelectElement>document.getElementById("selectTimeFrom");
      let selectTimeTo = <HTMLSelectElement>document.getElementById("selectTimeTo");
      let eventDate = <HTMLInputElement>document.getElementById("eventDate");
      let eventName = <HTMLInputElement>document.getElementById("eventName");
      selectLocation.disabled = false;
      selectTimeFrom.disabled = false;
      selectTimeTo.disabled = false;
      eventDate.disabled = false;
      eventName.disabled = false;
      Event.ResetAddEvent();
    }
  }

  function PopulateUIElements(EventTypes: Array<TargetData>,
    TargetAudiences: Array<TargetData>,
    Locations: Array<TargetData>,
    Times: Array<TargetData>)
  {
    // this is a filter
    let locFilter = <HTMLSelectElement>document.getElementById("filterLocation");
    // these are on the add Attendance menu
    let etSelect = <HTMLSelectElement>document.getElementById("selectEventType");
    etSelect.appendChild(Utilities.Create_Option("-1", "Select Event Type", true));
    let taSelect = <HTMLSelectElement>document.getElementById("selectTargetAudience");
    // this one will only be enabled if the user has admin access.
    let locSelect = <HTMLSelectElement>document.getElementById("selectLocation");
    let timeFrom = <HTMLSelectElement>document.getElementById("selectTimeFrom");
    let timeTo = <HTMLSelectElement>document.getElementById("selectTimeTo");

    PopulateSelect(etSelect, EventTypes);
    PopulateSelect(taSelect, TargetAudiences);
    PopulateSelect(locFilter, Locations);
    PopulateSelect(locSelect, Locations);
    PopulateSelect(timeFrom, Times);
    PopulateSelect(timeTo, Times);

  }

  function PopulateSelect(e: HTMLSelectElement, data: Array<string>)
  function PopulateSelect(e: HTMLSelectElement, data: Array<TargetData>)
  function PopulateSelect(e: HTMLSelectElement, data: Array<any>)
  {
    if (e === null || e === undefined) return;
    let UseString = (typeof data[0] == "string");    
    for (let d of data)
    {
      if (UseString)
      {
        e.add(Utilities.Create_Option(d, d));
      }
      else
      {
        e.add(Utilities.Create_Option(d.Value, d.Label));
      }
      
    }
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

  export function CloseModals(): void
  {
    let modals = document.querySelectorAll(".modal");
    if (modals.length > 0)
    {
      for (let i = 0; i < modals.length; i++)
      {
        let modal = modals.item(i);
        modal.classList.remove("is-active");
      }
    }
  }

  export function ShowError(ErrorText: string):void
  {
    SetInputValue("errorText", ErrorText);
    let errorModal = document.getElementById("showErrors");
    errorModal.classList.add("is-active");
  }

  export function SetInputValue(id: string, value: string): void
  {
    let e = <HTMLInputElement>document.getElementById(id);
    e.value = value;
    e.classList.remove("is-danger");
  }

  export function SetSelectValue(id: string, value: string): void
  {
    let e = <HTMLSelectElement>document.getElementById(id);
    e.value = value;
    e.parentElement.classList.remove("is-danger");
  }

  export function GetSelectValue(id: string): string
  {
    let e = <HTMLSelectElement>document.getElementById(id);
    if (e.selectedIndex === -1 || e.value === "-1")
    {
      e.parentElement.classList.add("is-danger");
      return "";
    }
    else
    {
      e.parentElement.classList.remove("is-danger");
      return e.selectedOptions[0].value;
    }
  }

  export function GetMultipleSelectValue(id: string): Array<string>
  {
    let e = <HTMLSelectElement>document.getElementById(id);
    if (e.selectedIndex === -1)
    {
      e.parentElement.classList.add("is-danger");
      return [];
    }
    else
    {
      e.parentElement.classList.remove("is-danger");
      let values = [];
      for (let i = 0; i < e.selectedOptions.length; i++)
      {
        values.push(e.selectedOptions[i].value);
      }
      return values;
    }
  }

  export function GetInputValue(id: string): string
  {
    let e = <HTMLInputElement>document.getElementById(id);
    if (e.value.trim() === "")
    {
      e.classList.add("is-danger");
      return "";
    }
    else
    {
      e.classList.remove("is-danger");
      return e.value.trim();
    }
  }

}