///<reference path="../typings/requirejs/require.d.ts"/>
///<reference path="../typings/qunit/qunit.d.ts"/>
require.config({
    baseUrl: './',
    paths: {
        "QUnit": "../bower_components" + "/qunit/qunit/qunit"
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