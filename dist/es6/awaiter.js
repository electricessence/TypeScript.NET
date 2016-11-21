export function awaiter(thisArg, _arguments, P, generator) {
    if (!P)
        throw "Must provide Promise constructor.  Try injecting Promise using awaiter.factory(PromiseConstructorLike).";
    return new P((resolve, reject) => {
        const g = generator = generator.apply(thisArg, _arguments);
        step(g.next());
        function fulfilled(value) {
            try {
                step(g.next(value));
            }
            catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(g["throw"](value));
            }
            catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done
                ? resolve(result.value)
                : new P(resolve => { resolve(result.value); }).then(fulfilled, rejected);
        }
    });
}
export default awaiter;
//# sourceMappingURL=awaiter.js.map