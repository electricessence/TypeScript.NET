/*
 * @author electricessence / https://github.com/electricessence/
 * .NET Reference: http://referencesource.microsoft.com/#mscorlib/system/threading/Tasks/Task.cs
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var noneToken = new CancellationToken();
Object.freeze(noneToken);

var CancellationToken = (function () {
    function CancellationToken() {
        _classCallCheck(this, CancellationToken);
    }

    _createClass(CancellationToken, null, [{
        key: "none",
        get: function get() {
            return noneToken;
        }
    }]);

    return CancellationToken;
})();

exports["default"] = CancellationToken;
module.exports = exports["default"];
//# sourceMappingURL=CancellationToken.js.map
