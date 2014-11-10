
define(['Scripts/text!modules/singletile.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.pageNumber = ko.observable(0);
            self.currentIndex = ko.observable(null);
            self.edms = ko.observableArray([]);
            self.pictureWidth = ko.observable(0);
            self.pictureHeight = ko.observable(0);
            self.mps = ko.observableArray([]);
            self.winningMPs = ko.observable();

            self.currentEdm = ko.pureComputed(function () {
                self.pictureWidth($(".edm-body").width());
                self.pictureHeight($(".edm-body").height());
                var edm = ko.utils.arrayFirst(self.edms(), function (item) {
                    return item.isLiked() == null;
                }) || new SwipeeSwipee.earlyDatMotion("", "", "", []);
                return edm;
            });

            self.runningScore = function () {
                var signatures=self.currentEdm().signatures;
                if ((signatures==null)||(signatures.length == 0))
                    return null;
                else {
                    var isFound = false;
                    for (var i = 0; i < signatures.length; i++) {
                        for (var j = 0; j < self.mps().length; j++)
                            if (self.mps()[j].id == signatures[i].id) {
                                isFound = true;
                                self.mps()[j].score(self.mps()[j].score() + 1);
                                break;
                            }
                        if (isFound == false)
                            self.mps.push(signatures[i]);
                    }
                    self.calculateWinningMP();
                }
            };

            self.calculateWinningMP = function () {
                var mps = self.mps();
                if ((mps==null) || (mps.length == 0))
                    return null;
                mps.sort(function (left, right) {
                    return left.score() === right.score() ? (left.id*1) - (right.id*1) : left.score() < right.score() ? 1 : -1;
                });
                self.winningMPs(mps.slice(0,3));
            };

            self.edmIsLiked = function () {
                self.runningScore();
                self.nextEdm(true);
            };

            self.edmIsNotLiked = function () {
                self.nextEdm(false);
            };

            self.nextEdm = function (isLiked) {
                var edm = ko.utils.arrayFirst(self.edms(), function (item) {
                    return item.id == self.currentEdm().id;
                });
                if (edm == null)
                    return;
                edm.isLiked(isLiked);
                var nextEdm = ko.utils.arrayFirst(self.edms(), function (item) {
                    return item.isLiked() == null;
                });
                if (nextEdm == null)
                    self.pageNumber(self.pageNumber() + 1);
                $(".edm-text").hide("slide", { direction: isLiked ? "right" : "left" }, 300, function () {
                    $(".edm-text").show();
                });
            };

            self.showResults = function () {
                var mps = self.mps();
                mps.sort(function (left, right) {
                    return left.score() === right.score() ? (left.id * 1) - (right.id * 1) : left.score() < right.score() ? 1 : -1;
                });
                window.conductorVM.parameters({ mps: mps });
                window.conductorVM.selectedComponent("result-list");
            };

            self.retriveEdms = function (data) {
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

        },
        template: htmlText
    }
});
