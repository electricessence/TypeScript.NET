/*!
 * From: https://github.com/adambom/parallel.js/blob/master/lib/eval.js
 */
var isNode="undefined"!=typeof module&&module.exports;isNode?process.once("message",function(code){eval(JSON.parse(code).data)}):self.onmessage=function(code){eval(code.data)};
//# sourceMappingURL=eval.js.map
