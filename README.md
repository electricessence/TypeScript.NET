TypeScript.NET
==============

### A JavaScript-Friendly .NET Based TypeScript Library

The intention of this project to to allow for the evolution of a .NET based TypeScript (and resultant JavaScript) library.
Contributions are welcomed as the .NET Library (meaning it's class structure and classes, not necessarily its content) has a substantial amount of usefulness.  With the open sourcing of .NET, TypeScript seems the most logical means to take advantage of it.  Typing, generics, classes, modules, inheritance, all are required to make a resultant JavaScript library that takes advantage of this elegance.

Much inspiration comes from TypeScript itself and from libraries like linq.js.
There is of course some variance away from .NET's convention (camelCase methods in favor of TitleCase) and some things simply have to be done different.  "Extensions" as a feature might be one of the greatest additions to .NET that JavaScript doesn't have a plan for, but it does have some tricky equivalents.

If you have a .NET Library class that you want to see represented in TypeScript, submit it (as an issue), or contribute it yourself! :)

## Why should I use this, let alone TypeScript?
1. **It's 100% compatible with JavaScript.**  Currently TypeScript.NET's target is ES5, so legacy JavaScript won't work. Mainly because of accessors.  But going forward, TypeScript is nearly the same as ES6 and you don't have to change your source code to target newer versions. :)
2. TypeScript is lead by Anders Hejlsberg, the founder of C#.  You will feel quite at home in TypeScript if you are a fan of typed languages (like C#), but at the same time you'll get all the flexibility and compatibility of JavaScript.  See [www.typescriptlang.org](http://www.typescriptlang.org/) for more information about the TypeScript language.  Also some more good info on [Wikipedia](http://en.wikipedia.org/wiki/TypeScript).
3. The benefits of intellisense and using an IDE for programming should be obvious especially if you are coding for a larger project.  Typed compilation is less forgiving in a good way.  You simply make much less mistakes in the long run.  TypeScript might be the best answer to JavaScript yet.  It's still JavaScript, but with many bonuses including a growing community. :)
4. Most major IDEs and text editors now support TypeScript either built in, or via a plug-in:
  * Visual Studio
  * VS Code
  * WebStorm (strongly recommended!)
  * Sublime Text
  * Atom

To name a few.

## Highlights
* **Linq**: Full linq.js library ported to TypeScript with improvements and optimizations.  Proper use of IEnumerable&lt;T&gt; with passing unit tests.  All the things you love about Linq, but fully typed and JS compatible.
* **Exceptions**: There is a growing set of Exceptions like ArgumentNullException, ArgumentOutOfRangeException, etc that are useful in making decisions about how to handle errors using *instanceof* as if you used multiple *catch* statements in C#.
* **Collections**: Multiple collections types with standard ICollection&lt;T&gt; and IEnumerable&lt;T&gt; interfaces.  LinkedList&lt;T&gt;, Queue&lt;T&gt;, Dictionary&lt;T&gt;, and more, all unit tested using a common interface test of ICollection&lt;T&gt;.
* **IDisposable**: Additional interfaces, utilities, and classes like **DisposableBase** that help in providing a cleanup pattern for larger applications that may easily encounter memory leaks.  Many of the classes within, including IEnumerator&lt;T&gt;, use IDisposable to ensure releasing of references.
* **DateTime** & **TimeSpan**: The **System/Time** namespace takes these .NET classes and goes even further to provide useful classes for calculating and expressing dates and time.
* **Uri**, **QueryParams**, & **QueryBuilder**:  Having a typed class and interface for an Uri tends to be very useful in web development.  Originally inspired by the .NET System.Uri class, these have been written from scratch to be more useful and helpful for debugging in JavaScript and are based upon the URI specification.

## Usage
After some time and effort, I've decided that this library should be module based since there are too many files and dependencies that may or may not get used.  This is simply the right decision and results in:

* Only loading what you need, when you need it.  You can import the entire TypeScript.NET library in your project and not worry about extra bytes you don't want.
* Compiling modules into a monolithic library is easier than the reverse.
* If you care about bundling and minification, **'r.js optimizer'** is probably the right way to go.
* The modular structure is not limited to requirejs since it should work perfectly well with JSPM/SystemJS.
* It is easy to change the module types. :)
* You can easily recompile the entire library into another **dist** folder fully minified using gulp.
* An already minified with source-map version is provided in the **min** folder

#### [NPM]([http://www.npmjs.com/package/typescript-dotnet]):
```
npm install typescript-dotnet
```
Version 2.5 is the first NPM release.  The goal is to get this as user friendly as possible.
Currently it is possible/supported to use TypeScript.NET in a number of different ways:
1. Using TypeScript and import the source directly by relative reference.
2. Node users can use ```dist/commonjs``` which uses ES6>Babel rendering for ease of use.
3. Use ```dist/es6``` directly.
4. requirejs can consume ```dist/amd``` or ```dist/umd.min``` for minified, web-friendly, source-mapped versions.
5. Lastly, re-render your own version using the TypeScript compiler.

This all may be overkill, or possibly a use case was missed, so please don't hesitate to log issues in GitHub.

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

## Examples
Currently the unit test cover many example usages.

## Documentation
Currently improving over time using JSDoc style comments and [TypeDoc](http://typedoc.io/).
View Documentation: [electricessence.github.io/TypeScript.NET/documentation](http://electricessence.github.io/TypeScript.NET/documentation/)

## Discussion

#### Reddit
[.NET](https://redd.it/3ojzbt)
[TypeScript](https://redd.it/3ok0bm)

## Learn, Connect & Evolve
[www.youtube.com/channel/UCG2QyAgVUEKSMBaC0Fkp5GQ](https://www.youtube.com/channel/UCG2QyAgVUEKSMBaC0Fkp5GQ)
