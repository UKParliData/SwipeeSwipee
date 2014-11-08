define([], function () {
    var conductorVM = function () {
        var self = this;

        self.isLoading = ko.observable(false);
        self.pageNumber = 0;

        self.selectedComponent = ko.observable("single-tile");
        self.parameters = ko.observable({ pageNumber: 0 });

        self.lastEdm = function () {
            self.pageNumber += 1;
            self.parameters({ pageNumber: self.pageNumber });
        };

    }
    return conductorVM;
});