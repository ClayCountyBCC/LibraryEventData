var EventData;
(function (EventData) {
    var access_type;
    (function (access_type) {
        access_type[access_type["admin_access"] = 1] = "admin_access";
        access_type[access_type["edit_access"] = 2] = "edit_access";
    })(access_type = EventData.access_type || (EventData.access_type = {}));
    var UserAccess = /** @class */ (function () {
        function UserAccess() {
        }
        return UserAccess;
    }());
    EventData.UserAccess = UserAccess;
})(EventData || (EventData = {}));
//# sourceMappingURL=UserAccess.js.map