/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Functions = function () {
    function Functions() {
        _classCallCheck(this, Functions);
    }

    _createClass(Functions, [{
        key: "Identity",
        value: function Identity(x) {
            return x;
        }
    }, {
        key: "True",
        value: function True() {
            return true;
        }
    }, {
        key: "False",
        value: function False() {
            return false;
        }
    }, {
        key: "Blank",
        value: function Blank() {}
    }]);

    return Functions;
}();

exports.Functions = Functions;
var rootFunctions = new Functions();
(function (Functions) {
    Functions.Identity = rootFunctions.Identity;
    Functions.True = rootFunctions.True;
    Functions.False = rootFunctions.False;
    Functions.Blank = rootFunctions.Blank;
})(Functions = exports.Functions || (exports.Functions = {}));
Object.freeze(Functions);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Functions;
//# sourceMappingURL=Functions.js.map
