var EventData;
(function (EventData) {
    var Event = /** @class */ (function () {
        function Event() {
            this.id = -1;
            this.event_name = "";
            this.event_type_id = -1;
            this.target_audiences = [];
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
            var eventDate = eventDateElement.value;
            var location = locationElement.value;
            var CompletedOnly = completedElement.checked;
            var qs = "?InCompleteOnly=" + CompletedOnly;
            if (eventDate !== "-1") {
                qs = qs + "&EventDate=" + eventDate;
            }
            if (location !== "-1") {
                qs = qs + "&Location=" + location;
            }
            XHR.GetArray("./API/Event/GetList", qs).then(function (events) {
                console.log('Events returned by GetList', events);
                Event.BuildEventList(events);
            }).catch(function (error) {
                // if this happens, we should just notify the user
                // and stop.  We won't clear the existing Event list, if there are any.
                // Create Message Modal
                console.log('error', error);
                EventData.ShowError("An error occurred getting the list of events. Please refresh the page and try again. If this issue persists, please contact the help desk.");
            });
        };
        Event.Get = function (id) {
            // this function will return the event that has this id from the server.
            return XHR.GetObject("./API/Event/GetEvent", "?id=" + id.toString());
        };
        Event.BuildEventList = function (events) {
            // this function is going to clear the current event list table
            // and then rebuild it with the contents of the events array argument.
            var eventList = document.getElementById("eventList");
            Utilities.Clear_Element(eventList);
            var _loop_1 = function (e) {
                var tr = document.createElement("tr");
                tr.style.cursor = "pointer";
                tr.onclick = function () {
                    // this is how we're going go to populate and show the attendance modal.
                    // this function is going to request a this event from the server 
                    // by referencing the id.
                    Event.Get(e.id).then(function (event) {
                        EventData.CurrentEvent = event;
                        EventData.Attendance.LoadEventAndAttendance(event);
                        var attendance = document.getElementById("addAttendance");
                        attendance.classList.add("is-active");
                    }).catch(function (error) {
                        console.log('error', error);
                        EventData.ShowError("An error occurred getting the list of events. Please refresh the page and try again. If this issue persists, please contact the help desk.");
                    });
                };
                tr.appendChild(Event.CreateEventListTextCell(e.event_name));
                var location_1 = EventData.TargetData.GetTargetData(EventData.Locations, e.location_id.toString());
                tr.appendChild(Event.CreateEventListTextCell(location_1.Label));
                var eventDate = e.event_date + ' ' + e.event_time_from + ' - ' + e.event_time_to;
                tr.appendChild(Event.CreateEventListTextCell(eventDate));
                tr.appendChild(Event.CreateEventListCheckboxCell(e.attendance !== null));
                eventList.appendChild(tr);
            };
            for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
                var e = events_1[_i];
                _loop_1(e);
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
        Event.CreateEventFromAttendance = function () {
            var errorsFound = false;
            var e = new Event();
            var eventName = EventData.GetInputValue("eventName");
            if (eventName.length === 0) {
                errorsFound = true;
            }
            else {
                e.event_name = eventName;
            }
            var location = EventData.GetSelectValue("selectLocation");
            if (location.length === 0) {
                errorsFound = true;
            }
            else {
                e.location_id = parseInt(location);
            }
            var eventType = EventData.GetSelectValue("selectEventType");
            if (eventType.length === 0) {
                errorsFound = true;
            }
            else {
                e.event_type_id = parseInt(eventType);
            }
            var targetAudiences = EventData.GetMultipleSelectValue("selectTargetAudience");
            if (targetAudiences.length === 0) {
                errorsFound = true;
            }
            else {
                for (var _i = 0, targetAudiences_1 = targetAudiences; _i < targetAudiences_1.length; _i++) {
                    var ta = targetAudiences_1[_i];
                    e.target_audiences.push(parseInt(ta));
                }
            }
            var eventDate = EventData.GetInputValue("eventDate");
            if (eventDate.length === 0) {
                errorsFound = true;
            }
            else {
                e.event_date = eventDate;
            }
            var timeFrom = EventData.GetSelectValue("selectTimeFrom");
            if (timeFrom.length === 0) {
                errorsFound = true;
            }
            else {
                e.event_time_from = timeFrom;
            }
            var timeTo = EventData.GetSelectValue("selectTimeTo");
            if (timeTo.length === 0) {
                errorsFound = true;
            }
            else {
                e.event_time_to = timeTo;
            }
            if (errorsFound) {
                return null;
            }
            else {
                e.id = EventData.CurrentEvent.id;
                return e;
            }
        };
        Event.Toggle_Event_Save = function (disabled) {
            var saveButton = document.getElementById("saveEvent");
            saveButton.disabled = disabled;
            if (disabled) {
                saveButton.classList.add("is-loading");
            }
            else {
                saveButton.classList.remove("is-loading");
            }
        };
        Event.Save = function () {
            // this function will take the contents of the
            // event creation page and convert it into javascript
            // objects and send them to the Save URI.
            // indicate that we're saving by:
            // adding a loading indicator to the save button
            // disabling the save button while we're saving
            Event.Toggle_Event_Save(true);
            var error = false;
            var eventNameElement = document.getElementById("addEventName");
            var eventName = eventNameElement.value.trim();
            var eventTypeElement = document.getElementById("addEventType");
            var eventType = eventTypeElement.value;
            var targetAudiences = EventData.GetMultipleSelectValue("addTargetAudience");
            var targetAudienceElement = document.getElementById("addTargetAudience");
            eventNameElement.classList.remove("is-danger");
            if (eventName.length < 3) {
                eventNameElement.classList.add("is-danger");
                error = true;
            }
            eventTypeElement.parentElement.classList.remove("is-danger");
            if (eventType === "-1") {
                eventTypeElement.parentElement.classList.add("is-danger");
                error = true;
            }
            targetAudienceElement.parentElement.classList.remove("is-danger");
            if (targetAudiences.length === 0) {
                targetAudienceElement.parentElement.classList.add("is-danger");
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
                event_1.event_type_id = parseInt(eventType);
                for (var _b = 0, targetAudiences_2 = targetAudiences; _b < targetAudiences_2.length; _b++) {
                    var ta = targetAudiences_2[_b];
                    event_1.target_audiences.push(parseInt(ta));
                }
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
                //Event.BuildEventList(events);
                Event.SaveEvents(events); // enable on endpoints updated
            }
            else {
                Event.Toggle_Event_Save(false);
            }
        };
        Event.SaveEvents = function (events) {
            XHR.SaveObject("./API/Event/Save", events).then(function (response) {
                console.log('response from Event Save', response);
                if (response.length === 0) {
                    // Clear the form
                    Event.ResetAddEvent();
                    Event.GetList();
                    // Indicate Success
                }
                else {
                    // show errors returned from client.
                    EventData.CloseModals();
                    var errorText = response.join("\n");
                    console.log('errortext', errorText);
                    EventData.ShowError(errorText);
                }
                Event.Toggle_Event_Save(false);
            }).catch(function (errors) {
                // Show error message;
                EventData.CloseModals();
                console.log('error', errors);
                EventData.ShowError("An error occurred while attempting to save these events. Please try again. If this issue persists, please contact the help desk.");
                Event.Toggle_Event_Save(false);
            });
        };
        Event.UpdateEvent = function (event) {
            XHR.SaveObject("./API/Event/Update", event).then(function (response) {
                if (response.length === 0) {
                    // Do nothing
                }
                else {
                    EventData.CloseModals();
                    var errorText = response.join("\n");
                    console.log('errortext', errorText);
                    EventData.ShowError(errorText);
                }
            }).catch(function (errors) {
                // Show error message;
                console.log('error', errors);
                EventData.ShowError("An error occurred while attempting to update this event. Please try again. If this issue persists, please contact the help desk.");
            });
        };
        Event.ResetAddEvent = function () {
            // This function puts the Add Event page in its initial state
            // no matter it's current state.
            var eventName = document.getElementById("addEventName");
            eventName.value = "";
            var eventType = document.getElementById("addEventType");
            eventType.selectedIndex = 0;
            var targetAudience = document.getElementById("addTargetAudience");
            targetAudience.selectedIndex = -1;
            var addEventContainer = document.getElementById("addEventList");
            Utilities.Clear_Element(addEventContainer);
            EventData.AddedEvents = [];
            Event.AddEventRow();
            Event.Toggle_Event_Save(false);
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
            //works in IE
            eventDate.setAttribute("type", "date");
            //Does not work in IE
            //eventDate.type = "date";
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