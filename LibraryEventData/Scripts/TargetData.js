var EventData;
(function (EventData) {
    var TargetData = /** @class */ (function () {
        function TargetData(Label, Value) {
            if (Label === void 0) { Label = ""; }
            if (Value === void 0) { Value = ""; }
            this.Label = Label;
            this.Value = Value;
        }
        TargetData.GetTargetData = function (data, searchValue) {
            if (data === undefined || data === null)
                return new TargetData();
            var found = data.filter(function (d) {
                return d.Value === searchValue;
            });
            if (found.length > 0) {
                return found[0];
            }
            return new TargetData();
        };
        return TargetData;
    }());
    EventData.TargetData = TargetData;
})(EventData || (EventData = {}));
//# sourceMappingURL=TargetData.js.map