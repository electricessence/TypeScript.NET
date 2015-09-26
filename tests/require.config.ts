///<reference path="../typings/requirejs/require.d.ts"/>
///<reference path="../typings/qunit/qunit.d.ts"/>

require.config({

    baseUrl: './',

    paths: {
        "QUnit": "../bower_components"+"/qunit/qunit/qunit"
    },

    shim: {
        'QUnit': {
            //deps: [
            //	'css!bower_components/qunit/qunit/qunit'
            //],
            exports: 'QUnit',
            init: function () {
                //QUnit.config.autoload = false;
                QUnit.config.autostart = false;
            }
        }
    }
});

