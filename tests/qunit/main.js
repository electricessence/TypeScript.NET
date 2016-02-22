(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "QUnit", './Arrays/_all', './Collections/_all', './Linq/_all', './Uri', './Integer'], factory);
    }
})(function (require, exports) {
    var _all_1 = require('./Arrays/_all');
    var _all_2 = require('./Collections/_all');
    var _all_3 = require('./Linq/_all');
    var Uri_1 = require('./Uri');
    var Integer_1 = require('./Integer');
    Integer_1.default();
    _all_1.default();
    Uri_1.default();
    _all_2.default();
    _all_3.default();
    QUnit.start();
});

//# sourceMappingURL=main.js.map
