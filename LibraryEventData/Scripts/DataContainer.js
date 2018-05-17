var EventData;
(function (EventData) {
    var DataContainer = /** @class */ (function () {
        function DataContainer() {
        }
        DataContainer.Get = function () {
            return XHR.GetObject("../API/InitialData");
        };
        return DataContainer;
    }());
    EventData.DataContainer = DataContainer;
})(EventData || (EventData = {}));
//# sourceMappingURL=DataContainer.js.map