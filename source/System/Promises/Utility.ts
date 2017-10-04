import Type from '../Types';

/**
 * Returns whether the given value is a promise (i.e. it's an object with a then function).
 */
export function isPromiseLike(object: any): boolean {
	return Type.hasMemberOfType(object,'then',Type.FUNCTION);
}


export function fulfill(value) {
	return Promise({
		"when": function () {
			return value;
		},
		"get": function (name) {
			return value[name];
		},
		"set": function (name, rhs) {
			value[name] = rhs;
		},
		"delete": function (name) {
			delete value[name];
		},
		"post": function (name, args) {
			// Mark Miller proposes that post with no name should apply a
			// promised function.
			if (name === null || name ===VOID0) {
				return value.apply(void 0, args);
			} else {
				return value[name].apply(value, args);
			}
		},
		"apply": function (thisp, args) {
			return value.apply(thisp, args);
		},
		"keys": function () {
			return Object.keys(value);
		}
	}, void 0, function inspect() {
		return { state: "fulfilled", value: value };
	});
}

export function reject(reason) {
	var rejection = Promise({
		"when": function (rejected) {
			// note that the error has been handled
			if (rejected) {
				untrackRejection(this);
			}
			return rejected ? rejected(reason) : this;
		}
	}, function fallback() {
		return this;
	}, function inspect() {
		return { state: "rejected", reason: reason };
	});

	// Note that the reason has not been handled.
	trackRejection(rejection, reason);

	return rejection;
}