/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export class Functions {
    Identity(x) { return x; }
    True() { return true; }
    False() { return false; }
    Blank() { }
}
const rootFunctions = new Functions();
(function (Functions) {
    Functions.Identity = rootFunctions.Identity;
    Functions.True = rootFunctions.True;
    Functions.False = rootFunctions.False;
    Functions.Blank = rootFunctions.Blank;
})(Functions || (Functions = {}));
Object.freeze(Functions);
export default Functions;
//# sourceMappingURL=Functions.js.map