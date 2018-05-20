var EventData;
(function (EventData) {
    var Attendance = /** @class */ (function () {
        function Attendance() {
            this.event_id = -1;
            this.event_type_id = -1;
            this.youth_count = 0;
            this.adult_count = 0;
            this.target_audiences = [];
            this.notes = "";
        }
        Attendance.Save = function () {
            // this function will take the contents of the current
            // attendance page and create an attendance object,
            // and then send that object to the Save Attendance end point.
            // first let's create event and attendance objects from
            // the form
            var attendance = Attendance.CreateAttendance();
            // this also validates the attendance
            if (attendance === null) {
                return;
            }
            // if they they have admin access, let's save the event too
            // let event = Event.CreateEventFromAttendance();
            // then let's save the attendance
        };
        Attendance.CreateAttendance = function () {
            // this function will create an Attendance object based
            // on the attendance modal and either return an
            // attendance object if successful or null if there are errors.
            var errorsFound = false;
            var a = new Attendance();
            var eventType = EventData.GetSelectValue("selectEventType");
            if (eventType.length == 0) {
                errorsFound = true;
            }
            else {
                a.event_type_id = parseInt(eventType);
            }
            var targetAudiences = EventData.GetMultipleSelectValue("selectTargetAudience");
            if (targetAudiences.length === 0) {
                errorsFound = true;
            }
            else {
                a.target_audiences = [];
                for (var _i = 0, targetAudiences_1 = targetAudiences; _i < targetAudiences_1.length; _i++) {
                    var ta = targetAudiences_1[_i];
                    a.target_audiences.push(parseInt(ta));
                }
            }
            var youthCount = EventData.GetInputValue("youthCount");
            if (youthCount.length === 0) {
                errorsFound = true;
            }
            else {
                a.youth_count = parseInt(youthCount);
            }
            var adultCount = EventData.GetInputValue("adultCount");
            if (adultCount.length === 0) {
                errorsFound = true;
            }
            else {
                a.adult_count = parseInt(adultCount);
            }
            var notes = document.getElementById("eventNotes");
            a.notes = notes.value;
            if (errorsFound) {
                return null;
            }
            else {
                a.event_id = EventData.CurrentEvent.id;
                return a;
            }
        };
        Attendance.LoadEventAndAttendance = function (event) {
            // this function will take the event and attendance objects
            // and load them into the attendance form
            console.log('selected event', event);
            EventData.SetInputValue("eventName", event.event_name);
            EventData.SetSelectValue("selectLocation", event.location_id.toString());
            EventData.SetInputValue("eventDate", event.event_date);
            EventData.SetSelectValue("selectTimeFrom", event.event_time_from);
            EventData.SetSelectValue("selectTimeTo", event.event_time_to);
            var targetAudiences = document.getElementById("selectTargetAudience");
            if (event.attendance === null || event.attendance.event_id === -1) {
                EventData.SetSelectValue("selectEventType", "-1");
                EventData.SetInputValue("youthCount", "");
                EventData.SetInputValue("adultCount", "");
                EventData.SetInputValue("eventNotes", "");
                targetAudiences.selectedIndex = -1;
                return;
            }
            EventData.SetSelectValue("selectEventType", event.attendance.event_type_id.toString());
            for (var i = 0; i < targetAudiences.options.length; i++) {
                var item = targetAudiences.options[i];
                var found = (event.attendance.target_audiences.indexOf(parseInt(item.value)) !== -1);
                item.selected = found;
            }
            EventData.SetInputValue("youthCount", event.attendance.youth_count.toString());
            EventData.SetInputValue("adultCount", event.attendance.adult_count.toString());
            EventData.SetInputValue("eventNotes", event.attendance.notes);
        };
        return Attendance;
    }());
    EventData.Attendance = Attendance;
})(EventData || (EventData = {}));
//# sourceMappingURL=Attendance.js.map