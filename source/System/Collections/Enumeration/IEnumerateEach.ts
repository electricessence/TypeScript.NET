/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

///<reference path="../../FunctionTypes.ts"/>


interface IEnumerateEach<T>
{
	// Should allow for if the return value is explicitly 'false' should treat as 'break' signal.
	// Inversely, 'true' means keep going.
	forEach(action:Predicate<T>): void;
	forEach(action:Action<T>): void;
}

