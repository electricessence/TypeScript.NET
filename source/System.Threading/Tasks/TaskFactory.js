/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * .NET Reference:
 *	http://referencesource.microsoft.com/#mscorlib/system/threading/Tasks/TaskFactory.cs
 */
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports"], function (require, exports) {
    var TaskFactory = (function () {
        function TaskFactory() {
        }
        return TaskFactory;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TaskFactory;
});
//# sourceMappingURL=TaskFactory.js.map