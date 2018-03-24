"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
///<reference types="node"/>
var assert = require("assert");
require("mocha");
var hasMember_1 = require("../../../dist/umd/Reflection/hasMember");
describe('.hasMember()', function () {
    it('should detect a positive match for prototype functions', function () {
        var A = /** @class */ (function (_super) {
            tslib_1.__extends(A, _super);
            function A() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return A;
        }(Array));
        assert.ok(hasMember_1.default(new A(), 'push'));
    });
    it('should detect a positive match', function () {
        assert.ok(hasMember_1.default({
            a: 'hello',
            b: undefined
        }, 'b'));
    });
});
//# sourceMappingURL=Types.js.map