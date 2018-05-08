/// <reference path="xhr.ts" />
/// <reference path="utilities.ts" />
var EventData;
(function (EventData) {
    EventData.Times = ['10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM', '11:00 AM'];
    EventData.Locations = [];
    EventData.AddedEvents = []; // used for the Add Event functionality
    EventData.CurrentAccess = null;
    function Start() {
        ResetAddEvent();
        // Uncomment this when the end points are working.
        // GetInitialData();
    }
    EventData.Start = Start;
    function GetInitialData() {
        EventData.DataContainer.Get().then(function (dc) {
            EventData.Times = dc.Times;
            EventData.Locations = dc.Locations;
            PopulateUIElements(dc.Event_Types, dc.Target_Audiences);
            EventData.CurrentAccess = dc.CurrentAccess;
        }).catch(function (error) {
            // Notify of error.  If this happens, the app is basically unusable.
        });
    }
    function PopulateUIElements(EventTypes, TargetAudiences) {
        var etSelect = document.getElementById("selectEventType");
        var taSelect = document.getElementById("selectTargetAudience");
        PopulateSelect(etSelect, EventTypes);
        PopulateSelect(taSelect, TargetAudiences);
    }
    function PopulateSelect(e, data) {
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var d = data_1[_i];
            e.add(Utilities.Create_Option(d.Value, d.Label));
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
    function ResetAddEvent() {
        // This function puts the Add Event page in its initial state
        // no matter it's current state.
        var eventName = document.getElementById("addEventName");
        eventName.value = "";
        var addEventContainer = document.getElementById("addEventList");
        Utilities.Clear_Element(addEventContainer);
        EventData.AddedEvents = [];
        AddEventRow();
    }
    EventData.ResetAddEvent = ResetAddEvent;
    function AddEventRow() {
        var id = 1;
        var ae = EventData.AddedEvents;
        if (ae.length > 0)
            id = ae[ae.length - 1] + 1; // add one to the last id added.
        EventData.AddedEvents.push(id);
        var container = document.getElementById("addEventList");
        container.appendChild(CreateRow(id));
    }
    EventData.AddEventRow = AddEventRow;
    function CreateRow(id) {
        var tr = document.createElement("tr");
        tr.id = "eventRow" + id.toString();
        tr.appendChild(CreateLocationElement(id));
        tr.appendChild(CreateEventDateElement(id));
        tr.appendChild(CreateEventTimeElement(id, "addEventFrom", "Event From"));
        tr.appendChild(CreateEventTimeElement(id, "addEventTo", "Event To"));
        tr.appendChild(CreateRemoveEventButton(id));
        return tr;
    }
    function CreateLocationElement(id) {
        var td = document.createElement("td");
        var field = document.createElement("div");
        field.classList.add("field");
        var control = document.createElement("div");
        control.classList.add("control");
        var selectContainer = document.createElement("div");
        selectContainer.classList.add("select");
        var location = document.createElement("select");
        location.add(Utilities.Create_Option("-1", "Select Location", true));
        location.id = "addLocation" + id.toString();
        for (var _i = 0, Locations_1 = EventData.Locations; _i < Locations_1.length; _i++) {
            var l = Locations_1[_i];
            location.add(Utilities.Create_Option(l.Value, l.Label));
        }
        selectContainer.appendChild(location);
        control.appendChild(selectContainer);
        field.appendChild(control);
        td.appendChild(field);
        return td;
    }
    function CreateEventDateElement(id) {
        var td = document.createElement("td");
        var field = document.createElement("div");
        field.classList.add("field");
        var control = document.createElement("div");
        control.classList.add("control");
        var eventDate = document.createElement("input");
        eventDate.classList.add("input");
        eventDate.type = "date";
        eventDate.id = "addEventDate" + id.toString();
        control.appendChild(eventDate);
        field.appendChild(control);
        td.appendChild(field);
        return td;
    }
    function CreateEventTimeElement(id, name, initialValue) {
        var td = document.createElement("td");
        var field = document.createElement("div");
        field.classList.add("field");
        var control = document.createElement("div");
        control.classList.add("control");
        var selectContainer = document.createElement("div");
        selectContainer.classList.add("select");
        var eventTime = document.createElement("select");
        eventTime.add(Utilities.Create_Option("", initialValue, true));
        eventTime.id = name + id.toString();
        for (var _i = 0, Times_1 = EventData.Times; _i < Times_1.length; _i++) {
            var t = Times_1[_i];
            eventTime.add(Utilities.Create_Option(t, t));
        }
        selectContainer.appendChild(eventTime);
        control.appendChild(selectContainer);
        field.appendChild(control);
        td.appendChild(field);
        return td;
    }
    function CreateRemoveEventButton(id) {
        var td = document.createElement("td");
        var field = document.createElement("div");
        field.classList.add("field");
        var control = document.createElement("div");
        control.classList.add("control");
        var remove = document.createElement("button");
        remove.classList.add("button");
        remove.classList.add("is-warning");
        remove.type = "button";
        remove.appendChild(document.createTextNode("Remove"));
        if (id === 1)
            remove.disabled = true;
        remove.onclick = function () {
            RemoveEventRow(id);
        };
        control.appendChild(remove);
        field.appendChild(control);
        td.appendChild(field);
        return td;
    }
    function RemoveEventRow(id) {
        var e = document.getElementById("eventRow" + id.toString());
        e.parentNode.removeChild(e);
        var i = EventData.AddedEvents.indexOf(id);
        if (i > -1)
            EventData.AddedEvents.splice(i, 1);
        console.log(EventData.AddedEvents);
    }
    EventData.RemoveEventRow = RemoveEventRow;
    function SaveEvent() {
    }
    EventData.SaveEvent = SaveEvent;
})(EventData || (EventData = {}));
//# sourceMappingURL=app.js.map