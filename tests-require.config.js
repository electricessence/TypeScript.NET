///<reference path="typings/requirejs/require.d.ts"/>
///<reference path="typings/qunit/qunit.d.ts"/>
require.config({
    paths: {
        "QUnit": "bower_components/qunit/qunit/qunit",
        "System": "source/" + "System",
        "System.Linq": "source/" + "System.Linq"
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
//# sourceMappingURL=tests-require.config.js.map