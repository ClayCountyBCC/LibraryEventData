/// <reference path="xhr.ts" />
/// <reference path="utilities.ts" />
var EventData;
(function (EventData) {
    EventData.Times = [];
    EventData.Locations = [];
    EventData.AddedEvents = []; // used for the Add Event functionality
    EventData.CurrentAccess = null;
    function Start() {
        // Uncomment this when the end points are working.
        GetInitialData();
    }
    EventData.Start = Start;
    function GetInitialData() {
        EventData.DataContainer.Get().then(function (dc) {
            console.log('dc', dc);
            EventData.CurrentAccess = dc.CurrentAccess;
            EventData.Times = dc.Times;
            EventData.Locations = dc.Locations;
            console.log('populateuieelements');
            PopulateUIElements(dc.Event_Types, dc.Target_Audiences, dc.Locations, EventData.Times);
            HandleUserAccess();
        }).catch(function (error) {
            // Notify of error.  If this happens, the app is basically unusable.
        });
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
            selectLocation.disabled = false;
            selectTimeFrom.disabled = false;
            selectTimeTo.disabled = false;
            eventDate.disabled = false;
            eventName.disabled = false;
            EventData.Event.ResetAddEvent();
        }
    }
    function PopulateUIElements(EventTypes, TargetAudiences, Locations, Times) {
        // this is a filter
        var locFilter = document.getElementById("filterLocation");
        // these are on the add Attendance menu
        var etSelect = document.getElementById("selectEventType");
        var taSelect = document.getElementById("selectTargetAudience");
        // this one will only be enabled if the user has admin access.
        var locSelect = document.getElementById("selectLocation");
        var timeFrom = document.getElementById("selectTimeFrom");
        var timeTo = document.getElementById("selectTimeTo");
        PopulateSelect(etSelect, EventTypes);
        PopulateSelect(taSelect, TargetAudiences);
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
})(EventData || (EventData = {}));
//# sourceMappingURL=app.js.map