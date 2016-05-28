TypeScript.NET
==============

### A JavaScript-Friendly .NET Based TypeScript Library

The intention of this project to to allow for the evolution of a .NET based TypeScript (and resultant JavaScript) library.
Contributions are welcomed as the .NET Library (meaning it's class structure and classes, not necessarily its content) has a substantial amount of usefulness.  With the open sourcing of .NET, TypeScript seems the most logical means to take advantage of it.  Typing, generics, classes, modules, inheritance, all are required to make a resultant JavaScript library that takes advantage of this elegance.

Much inspiration comes from TypeScript itself and from libraries like linq.js.
There is of course some variance away from .NET's convention (camelCase methods in favor of TitleCase) and some things simply have to be done different.  "Extensions" as a feature might be one of the greatest additions to .NET that JavaScript doesn't have a plan for, but it does have some tricky equivalents.

If you have a .NET Library class that you want to see represented in TypeScript, submit it (as an issue), or contribute it yourself! :)

## Why should I use this, let alone TypeScript?
1. **It's 100% compatible with JavaScript.**  Currently TypeScript.NET's target is ES5, so legacy ES3 won't work. Mainly because of accessors.  But going forward, TypeScript is nearly the same as ES6 and you don't have to change your source code to target newer versions. :)
2. TypeScript is lead by Anders Hejlsberg, the founder of C#.  You will feel quite at home in TypeScript if you are a fan of typed languages (like C#), but at the same time you'll get all the flexibility and compatibility of JavaScript.  See [www.typescriptlang.org](http://www.typescriptlang.org/) for more information about the TypeScript language.  Also some more good info on [Wikipedia](http://en.wikipedia.org/wiki/TypeScript).
3. The benefits of intellisense and using an IDE for programming should be obvious especially if you are coding for a larger project.  Typed compilation is less forgiving in a good way.  You simply make much less mistakes in the long run.  TypeScript might be the best answer to JavaScript yet.  It's still JavaScript, but with many bonuses including a growing community. :)
4. Most major IDEs and text editors now support TypeScript either built in, or via a plug-in:
  * Visual Studio
  * VS Code
  * WebStorm (Strongly recommended! Makes NodeJS development a dream.) 
  * Sublime Text
  * Atom

To name a few.

## Highlights
* **Linq**: Full linq.js library ported to TypeScript with improvements and optimizations.  Proper use of IEnumerable&lt;T&gt; with passing unit tests.  All the things you love about Linq, but fully typed and JS compatible.    **\*\*All collections now support a ```.linq``` lazy helper property when using NodeJS/CommonJS.**
* **Exceptions**: There is a growing set of Exceptions like ArgumentNullException, ArgumentOutOfRangeException, etc that are useful in making decisions about how to handle errors using *instanceof* as if you used multiple *catch* statements in C#.
* **Collections**: Multiple collections types with standard ICollection&lt;T&gt; and IEnumerable&lt;T&gt; interfaces.  LinkedList&lt;T&gt;, Queue&lt;T&gt;, Dictionary&lt;T&gt;, and more, all unit tested using a common interface test of ICollection&lt;T&gt;. \*\*
* **IDisposable**: Additional interfaces, utilities, and classes like **DisposableBase** that help in providing a cleanup pattern for larger applications that may easily encounter memory leaks.  Many of the classes within, including IEnumerator&lt;T&gt;, use IDisposable to ensure releasing of references.
* **DateTime** & **TimeSpan**: The **System/Time** namespace takes these .NET classes and goes even further to provide useful classes for calculating and expressing dates and time.
* **Uri**, **QueryParams**, & **QueryBuilder**:  Having a typed class and interface for an Uri tends to be very useful in web development.  Originally inspired by the .NET System.Uri class, these have been written from scratch to be more useful and helpful for debugging in JavaScript and are based upon the URI specification.
* [**Regex**](https://github.com/electricessence/TypeScript.NET/blob/master/source/System/Text/RegularExpressions.ts): Includes named group captures.  Very handy for accessing groups in regular expression results.
* [**Promise\<T\>**](https://github.com/electricessence/TypeScript.NET/blob/master/source/System/Promises/Promise.ts) and [**LazyPromise\<T\>**](https://github.com/electricessence/TypeScript.NET/blob/master/source/System/Promises/LazyPromise.ts): An efficient set of promises that fills that follows the standard ES6 usage while allowing for some useful methods that can improve performance of your application.  Read more [here](https://www.reddit.com/r/typescript/comments/4l9orj/lazypromiset/).
* [**TypeValidator\<T\>**](https://github.com/electricessence/TypeScript.NET/blob/master/source/System/TypeValidator.ts): An easy to use runtime type checker for complext types or JSON.  Read more [here](https://github.com/electricessence/TypeScript.NET/blob/master/source/System/TypeValidator.md). 
* ***Currently no external dependencies.***

## Usage
After some time and effort, I've decided that this library should be module based since there are too many files and dependencies that may or may not get used.  This is simply the right decision and results in:

* Only loading what you need, when you need it.  You can import the entire TypeScript.NET library in your project and not worry about extra bytes you don't want.
* Compiling modules into a monolithic library is easier than the reverse.
* If you care about bundling and minification, **'r.js optimizer'** is probably the right way to go.
* The modular structure is not limited to requirejs since it should work perfectly well with JSPM/SystemJS.
* It is easy to change the module types. :)
* You can easily recompile the entire library into another folder fully minified using gulp.
* Already minified with source-map versions are provided in the **dist** folder

#### [NPM](http://www.npmjs.com/package/typescript-dotnet):
```
npm install typescript-dotnet
```

Version 2.5 was the first NPM release.  The goal is to get this as user friendly as possible.
Currently it is possible/supported to use TypeScript.NET in a number of different ways:

##### Import Examples:
```typescript
// The following works well if you are launching from an index.ts or main.ts in your root.
import Enumerable from "typescript-dotnet/source/System.Linq/Linq"
```
```typescript
// Using a dist folder is recommened to eliminate any cross compiliation from your project.
import Enumerable from "typescript-dotnet/dist/commonjs/System.Linq/Linq"
```
```typescript
import Enumerable from "typescript-dotnet/dist/es6/System.Linq/Linq"
```
```typescript
// Recommended for users who are deploying to web/browsers.
import Enumerable from "typescript-dotnet/dist/umd.min/System.Linq/Linq"
```
```typescript
// Recommended for users who want pure minified AMD (RequireJS) with source-maps.
import Enumerable from "typescript-dotnet/dist/amd/System.Linq/Linq"
```

#### [Bower](http://bower.io/search/?q=typescript-dotnet):
```
bower install typescript-dotnet
```

This should also include require.js in your bower components directory.
If you need another module type other than AMD, the TypeScript files are included so you can rebuild however you need.

#### [Nuget](https://www.nuget.org/packages/TypeScript.NET.Library/):
```
PM> Install-Package TypeScript.NET.Library
```

## Unit Tests
Mocha tests are in place for core functionality and expanding all the time.
Istanbul is used for code coverage.  Current coverage is good if not reasonable.

## Examples
Currently the unit test cover many example usages.

## Documentation
Currently improving over time using JSDoc style comments and [TypeDoc](http://typedoc.io/).
View Documentation: [electricessence.github.io/TypeScript.NET/documentation](http://electricessence.github.io/TypeScript.NET/documentation/)

Documentation has a tendendecy to lag behind and TypeDoc is also lagging on updates.

## Contribution
This library has immense potential and quite often a class, or function that is missing will simply be added.  If you log any issues here on GitHub they will likely be addressed swiftly.  If you have a class or module you'd like to see integrated, just log an issue and start the discussion or feel free to make a pull request from your own design. :)

## Discussion

[![Join the chat at https://gitter.im/electricessence/TypeScript.NET](https://badges.gitter.im/electricessence/TypeScript.NET.svg)](https://gitter.im/electricessence/TypeScript.NET?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

#### Reddit
[TypeScript.NET Library](https://www.reddit.com/r/tsdotnetlibrary/)

[.NET](https://redd.it/3ojzbt),
[TypeScript](https://redd.it/3ok0bm)

## Learn, Connect & Evolve
#### Code Evolution
[www.youtube.com/channel/UCG2QyAgVUEKSMBaC0Fkp5GQ](https://www.youtube.com/channel/UCG2QyAgVUEKSMBaC0Fkp5GQ)

#### [Intro to TypeScript.NET Library (Part 1)](https://www.youtube.com/watch?v=dLwl2dGHSZo)
Click the image below to watch.

[![Intro to TypeScript.NET Library (Part 1)](https://img.youtube.com/vi/dLwl2dGHSZo/0.jpg)](https://www.youtube.com/watch?v=dLwl2dGHSZo)
