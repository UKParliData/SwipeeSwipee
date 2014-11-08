
define(['Scripts/text!modules/singletile.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.pageNumber = ko.observable(params.pageNumber);
            self.currentIndex = ko.observable(null);
            self.edms = ko.observableArray([]);
            self.pictureWidth = ko.observable(0);
            self.pictureHeight = ko.observable(0);

            self.currentEdm = ko.pureComputed(function () {
                self.pictureWidth($(".edm-body").width());
                self.pictureHeight($(".edm-body").height());
                return ko.utils.arrayFirst(self.edms(), function (item) {
                    return item.isLiked() == null;
                }) || new SwipeeSwipee.earlyDatMotion("", "", "", []);
            });

            self.edmIsLiked = function () {
                self.nextEdm(true);
            };

            self.edmIsNotLiked = function () {
                self.nextEdm(false);
            };

            self.nextEdm = function (isLiked) {
                var edm = ko.utils.arrayFirst(self.edms(), function (item) {
                    return item.id == self.currentEdm().id;
                });
                edm.isLiked(isLiked);
                var nextEdm = ko.utils.arrayFirst(self.edms(), function (item) {
                    return item.isLiked() == null;
                });
                if (nextEdm == null)
                    window.conductorVM.lastEdm();
                $(".edm-text").hide("slide", { direction: isLiked ? "right" : "left" }, 300, function () {
                    $(".edm-text").show();
                });
            };

            self.showResult = function () {
                window.conductorVM.parameters({ selectedItem: this });
                window.conductorVM.selectedComponent("result-list");
            };

            self.retriveEdms=function(data){
                var edms = [];
                if ((data != null) && (data.result != null) && (data.result.items != null) && (data.result.items.length > 0))
                    for (var i = 0; i < data.result.items.length; i++)
                        edms.push(new SwipeeSwipee.earlyDatMotion(data.result.items[i]._about, data.result.items[i].title, data.result.items[i].motionText, data.result.items[i].signature));
                self.edms(edms);
                window.conductorVM.isLoading(false);
            };

            self.showInfo = ko.computed(function () {
                window.conductorVM.isLoading(true);
                SwipeeSwipee.getData("edms.json",
                    {
                        _sort: "-dateTabled",
                        _view: "basic",
                        _page: self.pageNumber(),
                        _pageSize: 10,
                        _properties: "title,motionText,signature.member.twitter,signature.member.fullName,signature.member.party",
                    },
                    self.retriveEdms);
            });

            self.dispose = function () {
                self.showInfo.dispose();
            };

            //self.showInfo();
        },
        template: htmlText
    }
});
