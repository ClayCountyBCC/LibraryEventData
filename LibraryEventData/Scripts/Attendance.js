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
        Attendance.CloseModal = function () {
            var modals = document.querySelectorAll(".modal");
            if (modals.length > 0) {
                for (var i = 0; i < modals.length; i++) {
                    var modal = modals.item(i);
                    modal.classList.remove("is-active");
                }
            }
        };
        return Attendance;
    }());
    EventData.Attendance = Attendance;
})(EventData || (EventData = {}));
//# sourceMappingURL=Attendance.js.map