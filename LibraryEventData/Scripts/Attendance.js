var EventData;
(function (EventData) {
    var Attendance = /** @class */ (function () {
        function Attendance() {
            this.event_id = -1;
            this.youth_count = 0;
            this.adult_count = 0;
            this.notes = "";
        }
        Attendance.Save = function () {
            // this function will take the contents of the current
            // attendance page and create an attendance object,
            // and then send that object to the Save Attendance end point.
            // first let's create event and attendance objects from
            // the form
            Attendance.Toggle_Attendance_Save(true);
            var attendance = Attendance.CreateAttendance();
            // this also validates the attendance
            if (attendance === null) {
                Attendance.Toggle_Attendance_Save(false);
                return;
            }
            // if they they have admin access, let's save the event too
            // then let's save the attendance
            Attendance.SaveAttendance(attendance);
        };
        Attendance.Toggle_Attendance_Save = function (disabled) {
            var saveButton = document.getElementById("saveAttendance");
            saveButton.disabled = disabled;
            if (disabled) {
                saveButton.classList.add("is-loading");
            }
            else {
                saveButton.classList.remove("is-loading");
            }
        };
        Attendance.SaveAttendance = function (attendance) {
            XHR.SaveObject("./API/Attendance/Save", attendance).then(function (response) {
                if (response.length === 0) {
                    if (EventData.CurrentAccess.current_access === EventData.access_type.admin_access) {
                        var event_1 = EventData.Event.CreateEventFromAttendance();
                        if (event_1 === null)
                            return;
                        EventData.Event.UpdateEvent(event_1);
                    }
                    EventData.CloseModals();
                    EventData.Event.GetList();
                }
                else {
                    EventData.CloseModals();
                    var errorText = response.join("\r\n");
                    console.log('error', errorText);
                    EventData.ShowError(errorText);
                }
                Attendance.Toggle_Attendance_Save(false);
            }).catch(function (errors) {
                // Show error message;
                console.log('error', errors);
                EventData.ShowError("An error occurred while attempting to update this event. Please try again. If this issue persists, please contact the help desk.");
                Attendance.Toggle_Attendance_Save(false);
            });
        };
        Attendance.CreateAttendance = function () {
            // this function will create an Attendance object based
            // on the attendance modal and either return an
            // attendance object if successful or null if there are errors.
            var errorsFound = false;
            var a = new Attendance();
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
            EventData.SetSelectValue("selectEventType", event.event_type_id.toString());
            for (var i = 0; i < targetAudiences.options.length; i++) {
                var item = targetAudiences.options[i];
                var found = (event.target_audiences.indexOf(parseInt(item.value)) !== -1);
                item.selected = found;
            }
            if (event.attendance === null || event.attendance.event_id === -1) {
                EventData.SetInputValue("youthCount", "");
                EventData.SetInputValue("adultCount", "");
                EventData.SetInputValue("eventNotes", "");
                return;
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