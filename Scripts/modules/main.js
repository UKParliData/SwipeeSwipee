(function () {
    require.config({
        baseUrl: "/",
        urlArgs: "bust="+(new Date()).getTime().toLocaleString()
    });
    
    define(['Scripts/modules/conductor'], function (conductor) {
        ko.components.register('busy-indicator', { template: { require: 'Scripts/text!modules/busyindicator.html' } });
        ko.components.register('single-tile', { require: 'Scripts/modules/singletile.js' });
        ko.components.register('result-list', { require: 'Scripts/modules/resultlist.js' });

        $.support.cors = true;
        window.SwipeeSwipee = new SwipeeSwipee.Generic();
        window.conductorVM = new conductor();
        ko.applyBindings(window.conductorVM);
    });

})();