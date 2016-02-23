/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../../FunctionTypes.d.ts"/>


interface IEnumerateEach<T>
{
    // Enforcing an interface that allows operating on a copy can prevent changing underlying data while enumerating.
    forEach(action:Predicate<T> | Action<T>, useCopy?:boolean): void;
}

