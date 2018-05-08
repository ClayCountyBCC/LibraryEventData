var EventData;
(function (EventData) {
    var Event = /** @class */ (function () {
        function Event() {
            this.attendance = null;
        }
        Event.GetList = function () {
            // this function will be used to populate the the 
            // list of events shown on the main page.
            var eventDateElement = document.getElementById("filterEventDate");
            var locationElement = document.getElementById("filterLocation");
            var eventDate = eventDateElement.selectedOptions[0].value;
            var location = locationElement.selectedOptions[0].value;
            var CompletedOnly = document.getElementById("filterCompleted").checked;
            var qs = "";
            if (CompletedOnly) {
                qs = qs + "&CompletedOnly=true";
            }
            if (eventDate !== "-1") {
                qs = qs + "&EventDate=" + eventDate;
            }
            if (location !== "-1") {
                qs = qs + "&Location=" + location;
            }
            XHR.GetArray("./API/Event/GetList", qs).then(function (events) {
                Event.BuildEventList(events);
            }).catch(function (error) {
                // if this happens, we should just notify the user
                // and stop.  We won't clear the existing Event list, if there are any.
                // Create Message Modal
            });
        };
        Event.BuildEventList = function (events) {
            // this function is going to clear the current event list table
            // and then rebuild it with the contents of the events array argument.
            var eventList = document.getElementById("eventList");
            Utilities.Clear_Element(eventList);
            var _loop_1 = function (e) {
                var tr = document.createElement("tr");
                tr.onclick = function () {
                    // this is how we're going go to populate and show the attendance modal.
                    // this function is going to request a this event from the server 
                    // by referencing the id.
                    alert(e.id);
                };
                tr.appendChild(Event.CreateEventListTextCell(e.event_name));
                var location_1 = EventData.TargetData.GetTargetData(EventData.Locations, e.location_id.toString());
                tr.appendChild(Event.CreateEventListTextCell(location_1.Value));
                var eventDate = e.event_date.toLocaleDateString() + ' ' + e.event_time_from + ' - ' + e.event_time_to;
                tr.appendChild(Event.CreateEventListTextCell(eventDate));
                tr.appendChild(Event.CreateEventListCheckboxCell(e.attendance === null));
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
        };
        return Event;
    }());
    EventData.Event = Event;
})(EventData || (EventData = {}));
//# sourceMappingURL=Event.js.map