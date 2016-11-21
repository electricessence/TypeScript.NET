//noinspection JSUnresolvedFunction
require.config({
    baseUrl: './',
    urlArgs: 't=' + (new Date()).getTime(),
    paths: {
        "QUnit": "./_lib/qunit"
    },
    shim: {
        'QUnit': {
            exports: 'QUnit',
            init: function () {
                //noinspection NodeModulesDependencies
	            QUnit.config.autostart = false;
            }
        }
    }
});
require(['main']);