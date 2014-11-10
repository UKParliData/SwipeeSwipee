var SwipeeSwipee;

(function () {
    (function (SwipeeSwipee) {
        var Generic = (function () {
            function Generic() {
            };
            Generic.prototype.getData = function (endpoint, parameters, whenDone) {
                $.ajax({
                    url: "http://lda.data.parliament.uk/" + endpoint,
                    data: parameters,
                    dataType: "jsonp",
                    //cache: false,
                    success: function () {
                    },
                    error: function () {
                    }
                }).done(whenDone);
            };

            Generic.prototype.getIdfromUrl = function (urlId) {
                var splitUrl = urlId.split("/");
                var idIndex = splitUrl.length - 1;
                if (splitUrl[idIndex] === "")
                    idIndex = splitUrl.length - 2;
                return urlId.split("/")[idIndex];
            };

            Generic.prototype.member = function (urlId, name, party, twitter) {
                this.id = window.SwipeeSwipee.getIdfromUrl(urlId);
                this.name = name;
                this.party = party;
                this.twitter = twitter;
                this.score = ko.observable(1);
            };

            Generic.prototype.earlyDatMotion = function (urlId, title, motionText, signatures) {
                this.id = window.SwipeeSwipee.getIdfromUrl(urlId);
                this.title = title;
                this.displayTitle = title;
                if (this.displayTitle.length > 30)
                    this.displayTitle = this.displayTitle.substring(0, 30) + "...";
                this.motionText = motionText;
                this.displayMotionText = motionText;
                if (this.displayMotionText.length > 500)
                    this.displayMotionText = this.displayMotionText.substring(0, 500) + "...";
                this.signatures = [];
                this.tablingMemberId = 0;
                this.isLiked = ko.observable(null);
                for (var i = 0; i < signatures.length; i++) {
                    if (signatures[i].member[0]._about == null)
                        continue;
                    var member = new window.SwipeeSwipee.member(signatures[i].member[0]._about, signatures[i].member[0].fullName, signatures[i].member[0].party, signatures[i].member[0].twitter);
                    if (this.tablingMemberId == 0) {
                        if (window.SwipeeSwipee.getIdfromUrl(signatures[i]._about) == 1)
                            this.tablingMemberId = member.id;
                    }
                    this.signatures.push(member);
                }
            };

            return Generic;
        })();
        SwipeeSwipee.Generic = Generic;
    })(SwipeeSwipee || (SwipeeSwipee = {}));
})();