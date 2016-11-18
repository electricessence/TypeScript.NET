require.config({
    baseUrl: './',
    urlArgs: 't=' + (new Date()).getTime(),
    paths: {
        "QUnit": "../../node_modules/qunitjs/qunit/qunit"
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
require(['main']);