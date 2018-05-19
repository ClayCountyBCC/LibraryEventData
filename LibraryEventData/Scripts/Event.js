var EventData;
(function (EventData) {
    var Event = /** @class */ (function () {
        function Event() {
            this.id = -1;
            this.event_name = "";
            this.event_time_from = "";
            this.event_time_to = "";
            this.location_id = -1;
            this.attendance = null;
        }
        Event.GetList = function () {
            // this function will be used to populate the the 
            // list of events shown on the main page.
            var eventDateElement = document.getElementById("filterEventDate");
            var locationElement = document.getElementById("filterLocation");
            var completedElement = document.getElementById("filterInComplete");
            var eventDate = eventDateElement.selectedOptions[0].value;
            var location = locationElement.selectedOptions[0].value;
            var CompletedOnly = completedElement.checked;
            var qs = "";
            if (CompletedOnly) {
                qs = qs + "&InCompleteOnly=true";
            }
            if (eventDate !== "-1") {
                qs = qs + "&EventDate=" + eventDate;
            }
            if (location !== "-1") {
                qs = qs + "&Location=" + location;
            }
            if (qs.length > 0) {
                qs = "?" + qs.slice(1);
            }
            XHR.GetArray("./API/Event/GetList", qs).then(function (events) {
                console.log('Events returned by GetList', events);
                Event.BuildEventList(events);
            }).catch(function (error) {
                // if this happens, we should just notify the user
                // and stop.  We won't clear the existing Event list, if there are any.
                // Create Message Modal
                console.log('bad stuff happened in GetList');
            });
        };
        Event.BuildEventList = function (events) {
            // this function is going to clear the current event list table
            // and then rebuild it with the contents of the events array argument.
            var eventList = document.getElementById("eventList");
            Utilities.Clear_Element(eventList);
            for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
                var e = events_1[_i];
                var tr = document.createElement("tr");
                tr.onclick = function () {
                    // this is how we're going go to populate and show the attendance modal.
                    // this function is going to request a this event from the server 
                    // by referencing the id.
                    var attendance = document.getElementById("addAttendance");
                    attendance.classList.add("is-active");
                };
                tr.appendChild(Event.CreateEventListTextCell(e.event_name));
                var location_1 = EventData.TargetData.GetTargetData(EventData.Locations, e.location_id.toString());
                tr.appendChild(Event.CreateEventListTextCell(location_1.Label));
                var eventDate = e.event_date + ' ' + e.event_time_from + ' - ' + e.event_time_to;
                tr.appendChild(Event.CreateEventListTextCell(eventDate));
                tr.appendChild(Event.CreateEventListCheckboxCell(e.attendance !== null));
                eventList.appendChild(tr);
            }
        };
        Event.CreateEventListTextCell = function (value) {
            var td = document.createElement("td");
            td.appendChild(document.createTextNode(value));
            return td;
        };
        Event.CreateEventListCheckboxCell = function (value) {
            var td = document.createElement("td");
            var label = document.createElement("label");
            label.classList.add("checkbox");
            var cb = document.createElement("input");
            cb.type = "checkbox";
            cb.disabled = true;
            cb.checked = value;
            label.appendChild(cb);
            label.appendChild(document.createTextNode("Completed?"));
            td.appendChild(label);
            return td;
        };
        Event.Save = function () {
            // this function will take the contents of the
            // event creation page and convert it into javascript
            // objects and send them to the Save URI.
            var error = false;
            var eventNameElement = document.getElementById("addEventName");
            var eventName = eventNameElement.value.trim();
            eventNameElement.classList.remove("is-danger");
            if (eventName.length < 3) {
                eventNameElement.classList.add("is-danger");
                error = true;
            }
            var events = [];
            for (var _i = 0, _a = EventData.AddedEvents; _i < _a.length; _i++) {
                var i = _a[_i];
                var locationElement = document.getElementById("addLocation" + i);
                var eventDateElement = document.getElementById("addEventDate" + i);
                var eventTimeFromElement = document.getElementById("addEventFrom" + i);
                var eventTimeToElement = document.getElementById("addEventTo" + i);
                locationElement.parentElement.classList.remove("is-danger");
                eventDateElement.classList.remove("is-danger");
                eventTimeFromElement.parentElement.classList.remove("is-danger");
                eventTimeToElement.parentElement.classList.remove("is-danger");
                var event_1 = new Event();
                event_1.id = i;
                event_1.event_name = eventName;
                if (locationElement.selectedIndex === 0) {
                    locationElement.parentElement.classList.add("is-danger");
                    error = true;
                }
                else {
                    var location_2 = locationElement.selectedOptions[0].value;
                    event_1.location_id = parseInt(location_2);
                }
                if (eventDateElement.value.length === 0) {
                    eventDateElement.classList.add("is-danger");
                    error = true;
                }
                else {
                    event_1.event_date = eventDateElement.value;
                }
                if (eventTimeFromElement.selectedIndex === 0) {
                    eventTimeFromElement.parentElement.classList.add("is-danger");
                    error = true;
                }
                else {
                    var from = eventTimeFromElement.selectedOptions[0].value;
                    event_1.event_time_from = from;
                }
                if (eventTimeToElement.selectedIndex === 0) {
                    eventTimeToElement.parentElement.classList.add("is-danger");
                    error = true;
                }
                else {
                    var to = eventTimeToElement.selectedOptions[0].value;
                    event_1.event_time_to = to;
                }
                events.push(event_1);
            }
            // Convert this to a Save to Server and we're done.
            if (!error) {
                Event.BuildEventList(events);
                //Event.SaveEvents(events); // enable on endpoints updated
            }
        };
        Event.SaveEvents = function (events) {
            XHR.SaveObject("./API/Event/Save", events).then(function (response) {
                if (response.length === 0) {
                    // Clear the form
                    Event.ResetAddEvent();
                    // Indicate Success
                    // Not sure how I'm going to do this yet.
                }
                else {
                    // show errors returned from client.
                }
            }).catch(function (errors) {
                // Show error message;
            });
        };
        Event.ResetAddEvent = function () {
            // This function puts the Add Event page in its initial state
            // no matter it's current state.
            var eventName = document.getElementById("addEventName");
            eventName.value = "";
            var addEventContainer = document.getElementById("addEventList");
            Utilities.Clear_Element(addEventContainer);
            EventData.AddedEvents = [];
            Event.AddEventRow();
        };
        Event.AddEventRow = function () {
            var id = 1;
            var ae = EventData.AddedEvents;
            if (ae.length > 0)
                id = ae[ae.length - 1] + 1; // add one to the last id added.
            EventData.AddedEvents.push(id);
            var container = document.getElementById("addEventList");
            container.appendChild(Event.CreateRow(id));
        };
        Event.CreateRow = function (id) {
            var tr = document.createElement("tr");
            tr.id = "eventRow" + id.toString();
            tr.appendChild(Event.CreateLocationElement(id));
            tr.appendChild(Event.CreateEventDateElement(id));
            tr.appendChild(Event.CreateEventTimeFromElement(id));
            tr.appendChild(Event.CreateEventTimeToElement(id));
            tr.appendChild(Event.CreateRemoveEventButton(id));
            return tr;
        };
        Event.CreateLocationElement = function (id) {
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
        };
        Event.CreateEventDateElement = function (id) {
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
        };
        Event.CreateEventTimeFromElement = function (id) {
            var td = document.createElement("td");
            var field = document.createElement("div");
            field.classList.add("field");
            var control = document.createElement("div");
            control.classList.add("control");
            var selectContainer = document.createElement("div");
            selectContainer.classList.add("select");
            var eventTime = document.createElement("select");
            eventTime.add(Utilities.Create_Option("", "Event From", true));
            eventTime.id = "addEventFrom" + id.toString();
            eventTime.onchange = function (event) {
                var index = this.selectedIndex;
                EventData.Event.UpdateEventTimeToElement(id, index);
            };
            for (var _i = 0, Times_1 = EventData.Times; _i < Times_1.length; _i++) {
                var t = Times_1[_i];
                eventTime.add(Utilities.Create_Option(t.Value, t.Label));
            }
            selectContainer.appendChild(eventTime);
            control.appendChild(selectContainer);
            field.appendChild(control);
            td.appendChild(field);
            return td;
        };
        Event.CreateEventTimeToElement = function (id) {
            var td = document.createElement("td");
            var field = document.createElement("div");
            field.classList.add("field");
            var control = document.createElement("div");
            control.classList.add("control");
            var selectContainer = document.createElement("div");
            selectContainer.classList.add("select");
            var eventTime = document.createElement("select");
            eventTime.add(Utilities.Create_Option("", "Event To", true));
            eventTime.id = "addEventTo" + id.toString();
            for (var _i = 0, Times_2 = EventData.Times; _i < Times_2.length; _i++) {
                var t = Times_2[_i];
                eventTime.add(Utilities.Create_Option(t.Value, t.Label));
            }
            selectContainer.appendChild(eventTime);
            control.appendChild(selectContainer);
            field.appendChild(control);
            td.appendChild(field);
            return td;
        };
        Event.UpdateEventTimeToElement = function (id, SelectedTimeFromIndex) {
            var eventTime = document.getElementById("addEventTo" + id.toString());
            Utilities.Clear_Element(eventTime);
            eventTime.add(Utilities.Create_Option("", "Event To", true));
            for (var i = SelectedTimeFromIndex; i < EventData.Times.length; i++) {
                eventTime.add(Utilities.Create_Option(EventData.Times[i].Value, EventData.Times[i].Label));
            }
        };
        Event.CreateRemoveEventButton = function (id) {
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
                EventData.Event.RemoveEventRow(id);
            };
            control.appendChild(remove);
            field.appendChild(control);
            td.appendChild(field);
            return td;
        };
        Event.RemoveEventRow = function (id) {
            var e = document.getElementById("eventRow" + id.toString());
            e.parentNode.removeChild(e);
            var i = EventData.AddedEvents.indexOf(id);
            if (i > -1)
                EventData.AddedEvents.splice(i, 1);
            console.log(EventData.AddedEvents);
        };
        return Event;
    }());
    EventData.Event = Event;
})(EventData || (EventData = {}));
//# sourceMappingURL=Event.js.map