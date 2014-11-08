define(['Scripts/text!modules/resultlist.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.mps = params.mps;

        },
        template: htmlText
    }
});
