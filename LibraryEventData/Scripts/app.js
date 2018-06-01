/// <reference path="xhr.ts" />
/// <reference path="utilities.ts" />
var EventData;
(function (EventData) {
    EventData.Times = [];
    EventData.Locations = [];
    EventData.AddedEvents = []; // used for the Add Event functionality
    EventData.CurrentAccess = null;
    EventData.CurrentEvent = null;
    function Start() {
        GetInitialData();
    }
    EventData.Start = Start;
    function GetInitialData() {
        Toggle_Initial_Controls(true);
        EventData.DataContainer.Get().then(function (dc) {
            EventData.CurrentAccess = dc.CurrentAccess;
            EventData.Times = dc.Times;
            EventData.Locations = dc.Locations;
            PopulateUIElements(dc.Event_Types, dc.Target_Audiences, dc.Locations, EventData.Times);
            HandleUserAccess();
            EventData.Event.GetList();
            Toggle_Initial_Controls(false);
        }).catch(function (error) {
            // Notify of error.  If this happens, the app is basically unusable.
            ShowError("There was an issue loading the initial data.  Please refresh the web page and try again.  If this issue persists, please contact the help desk.");
        });
    }
    function Toggle_Initial_Controls(disabled) {
        var incomplete = document.getElementById("filterInComplete");
        var location = document.getElementById("filterLocation");
        var eventDate = document.getElementById("filterEventDate");
        var refresh = document.getElementById("refreshList");
        incomplete.disabled = disabled;
        location.disabled = disabled;
        eventDate.disabled = disabled;
        refresh.disabled = disabled;
        if (disabled) {
            location.parentElement.classList.add("is-loading");
            eventDate.parentElement.classList.add("is-loading");
            refresh.classList.add("is-loading");
        }
        else {
            location.parentElement.classList.remove("is-loading");
            eventDate.parentElement.classList.remove("is-loading");
            refresh.classList.remove("is-loading");
        }
    }
    function HandleUserAccess() {
        // The default setup of the HTML page is for the appropriate fields
        // to be disabled based on most users only having Edit access.
        // So here we are going to check for admin access and enable the fields
        // and show the Add Event option.
        if (EventData.CurrentAccess.current_access === EventData.access_type.admin_access) {
            var addEvent = document.getElementById("addEvent");
            addEvent.classList.remove("hide"); // we remove this so that Bulma will take over the display.
            var selectLocation = document.getElementById("selectLocation");
            var selectTimeFrom = document.getElementById("selectTimeFrom");
            var selectTimeTo = document.getElementById("selectTimeTo");
            var eventDate = document.getElementById("eventDate");
            var eventName = document.getElementById("eventName");
            var eventType = document.getElementById("selectEventType");
            var targetAudiences = document.getElementById("selectTargetAudience");
            selectLocation.disabled = false;
            selectTimeFrom.disabled = false;
            selectTimeTo.disabled = false;
            eventDate.disabled = false;
            eventName.disabled = false;
            eventType.disabled = false;
            targetAudiences.disabled = false;
            EventData.Event.ResetAddEvent();
        }
    }
    function PopulateUIElements(EventTypes, TargetAudiences, Locations, Times) {
        // this is a filter
        var locFilter = document.getElementById("filterLocation");
        // these are on the add Attendance menu
        var etSelect = document.getElementById("selectEventType");
        var etAddSelect = document.getElementById("addEventType");
        etAddSelect.appendChild(Utilities.Create_Option("-1", "Select Event Type", true));
        var taSelect = document.getElementById("selectTargetAudience");
        var taAddSelect = document.getElementById("addTargetAudience");
        // this one will only be enabled if the user has admin access.
        var locSelect = document.getElementById("selectLocation");
        var timeFrom = document.getElementById("selectTimeFrom");
        var timeTo = document.getElementById("selectTimeTo");
        PopulateSelect(etSelect, EventTypes);
        PopulateSelect(etAddSelect, EventTypes);
        PopulateSelect(taSelect, TargetAudiences);
        PopulateSelect(taAddSelect, TargetAudiences);
        PopulateSelect(locFilter, Locations);
        PopulateSelect(locSelect, Locations);
        PopulateSelect(timeFrom, Times);
        PopulateSelect(timeTo, Times);
    }
    function PopulateSelect(e, data) {
        if (e === null || e === undefined)
            return;
        var UseString = (typeof data[0] == "string");
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var d = data_1[_i];
            if (UseString) {
                e.add(Utilities.Create_Option(d, d));
            }
            else {
                e.add(Utilities.Create_Option(d.Value, d.Label));
            }
        }
    }
    function View(id) {
        var sections = document.querySelectorAll("body > div > section");
        if (sections.length > 0) {
            for (var i = 0; i < sections.length; i++) {
                var item = sections.item(i);
                if (item.id === id) {
                    Utilities.Show(item);
                }
                else {
                    Utilities.Hide(item);
                }
            }
        }
    }
    EventData.View = View;
    function CloseModals() {
        var modals = document.querySelectorAll(".modal");
        if (modals.length > 0) {
            for (var i = 0; i < modals.length; i++) {
                var modal = modals.item(i);
                modal.classList.remove("is-active");
            }
        }
    }
    EventData.CloseModals = CloseModals;
    function ShowError(ErrorText) {
        SetInputValue("errorText", ErrorText);
        var errorModal = document.getElementById("showErrors");
        errorModal.classList.add("is-active");
    }
    EventData.ShowError = ShowError;
    function SetInputValue(id, value) {
        var e = document.getElementById(id);
        e.value = value;
        e.classList.remove("is-danger");
    }
    EventData.SetInputValue = SetInputValue;
    function SetSelectValue(id, value) {
        var e = document.getElementById(id);
        e.value = value;
        e.parentElement.classList.remove("is-danger");
    }
    EventData.SetSelectValue = SetSelectValue;
    function GetSelectValue(id) {
        var e = document.getElementById(id);
        if (e.selectedIndex === -1 || e.value === "-1") {
            e.parentElement.classList.add("is-danger");
            return "";
        }
        else {
            e.parentElement.classList.remove("is-danger");
            return e.selectedOptions[0].value;
        }
    }
    EventData.GetSelectValue = GetSelectValue;
    function GetMultipleSelectValue(id) {
        var e = document.getElementById(id);
        if (e.selectedIndex === -1) {
            e.parentElement.classList.add("is-danger");
            return [];
        }
        else {
            e.parentElement.classList.remove("is-danger");
            var values = [];
            for (var i = 0; i < e.selectedOptions.length; i++) {
                values.push(e.selectedOptions[i].value);
            }
            return values;
        }
    }
    EventData.GetMultipleSelectValue = GetMultipleSelectValue;
    function GetInputValue(id) {
        var e = document.getElementById(id);
        if (e.value.trim() === "") {
            e.classList.add("is-danger");
            return "";
        }
        else {
            e.classList.remove("is-danger");
            return e.value.trim();
        }
    }
    EventData.GetInputValue = GetInputValue;
})(EventData || (EventData = {}));
//# sourceMappingURL=app.js.map