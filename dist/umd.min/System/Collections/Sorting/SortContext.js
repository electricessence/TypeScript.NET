/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e,r){if("object"==typeof module&&"object"==typeof module.exports){var t=r(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(e,r)}(["require","exports","../../Compare"],function(e,r){var t=e("../../Compare"),o=function(){function e(e,r,o){void 0===r&&(r=t.compare),void 0===o&&(o=1),this._next=e,this._comparer=r,this._order=o}return Object.defineProperty(e.prototype,"order",{get:function(){return this._order},enumerable:!0,configurable:!0}),e.prototype.generateSortedIndexes=function(e){var r=this;if(null==e)return[];var t=e.map(function(e,r){return r});return t.sort(function(t,o){return r.compare(e[t],e[o])}),t},e.prototype.compare=function(e,r){var t=this,o=t._comparer(e,r);return 0==o&&t._next?t._next.compare(e,r):t._order*o},e}();Object.defineProperty(r,"__esModule",{value:!0}),r["default"]=o});
//# sourceMappingURL=SortContext.js.map
