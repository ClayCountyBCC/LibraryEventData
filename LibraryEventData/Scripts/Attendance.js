var EventData;
(function (EventData) {
    var Attendance = /** @class */ (function () {
        function Attendance() {
            this.youth_count = 0;
            this.adult_count = 0;
            this.target_audiences = [];
            this.notes = "";
        }
        Attendance.Save = function () {
            // this function will take the contents of the current
            // attendance page and create an attendance object,
            // and then send that object to the Save Attendance end point.
        };
        return Attendance;
    }());
    EventData.Attendance = Attendance;
})(EventData || (EventData = {}));
//# sourceMappingURL=Attendance.js.map