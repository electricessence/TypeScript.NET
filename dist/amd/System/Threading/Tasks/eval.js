/*!
 * From: https://github.com/adambom/parallel.js/blob/master/lib/eval.js
 */
"undefined"!=typeof module&&module.exports?process.once("message",function(code){eval(JSON.parse(code).data)}):self.onmessage=function(code){eval(code.data)};
//# sourceMappingURL=eval.js.map