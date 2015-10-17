///<reference path="../../typings/requirejs/require.d.ts"/>
///<reference path="../../typings/qunit/qunit.d.ts"/>

require.config({

    baseUrl: './',
	urlArgs: 't='+(new Date()).getTime(),

    paths: {
        "QUnit": "../../bower_components"+"/qunit/qunit/qunit",
        "source": "../../dist/"+"amd"
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

