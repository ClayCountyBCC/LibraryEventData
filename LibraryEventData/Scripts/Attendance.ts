﻿namespace EventData
{
  interface IAttendance
  {
    event_id: number;
    event_type_id: number;
    youth_count: number;
    adult_count: number;
    target_audiences: Array<number>;
    notes: string;
  }

  export class Attendance implements IAttendance
  {
    event_id: number;
    event_type_id: number;
    youth_count: number = 0;
    adult_count: number = 0;
    target_audiences: Array<number> = [];
    notes: string = "";

    constructor()
    {

    }

    public static Save(): void
    {
      // this function will take the contents of the current
      // attendance page and create an attendance object,
      // and then send that object to the Save Attendance end point.
    }

    public static CloseModal(): void
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

  }

}