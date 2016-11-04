requirejs.config({
    baseUrl: './',
    urlArgs: 't=' + (new Date()).getTime(),
    paths: {
        "QUnit": "./qunit"
    },
    shim: {
        'QUnit': {
            exports: 'QUnit',
            init: function () {
                QUnit.config.autostart = false;
            }
        }
    }
});
//# sourceMappingURL=require.config.js.map