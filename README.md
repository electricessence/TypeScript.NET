TypeScript.NET
==============

### A JavaScript-Friendly .NET Based TypeScript Library

<span class="badge-patreon"><a href="http://patreon.com/codeevolution" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>

The intention of this project to to allow for the evolution of a .NET based TypeScript (and resultant JavaScript) library.
Contributions are welcomed as the .NET Library (meaning it's class structure and classes, not necessarily its content) has a substantial amount of usefulness.  With the open sourcing of .NET, TypeScript seems the most logical means to take advantage of it.  Typing, generics, classes, modules, inheritance, all are required to make a resultant JavaScript library that takes advantage of this elegance.

Much inspiration comes from TypeScript itself and from libraries like linq.js.
There is of course some variance away from .NET's convention (camelCase methods in favor of TitleCase) and some things simply have to be done different.  "Extensions" as a feature might be one of the greatest additions to .NET that JavaScript doesn't have a plan for, but it does have some tricky equivalents.

If you have a .NET Library class that you want to see represented in TypeScript, submit it (as an issue), or contribute it yourself! :)

## Why should I use this, let alone TypeScript?
1. **It's 100% compatible with JavaScript.**  Currently TypeScript .NET's target is ES5, so legacy ES3 won't work. Mainly because of accessors.  But going forward, TypeScript is nearly the same as ES6 and you don't have to change your source code to target newer versions. :)
2. TypeScript is lead by Anders Hejlsberg, the founder of C#.  You will feel quite at home in TypeScript if you are a fan of typed languages (like C#), but at the same time you'll get all the flexibility and compatibility of JavaScript.  See [www.typescriptlang.org](http://www.typescriptlang.org/) for more information about the TypeScript language.  Also some more good info on [Wikipedia](http://en.wikipedia.org/wiki/TypeScript).
3. The benefits of intellisense and using an IDE for programming should be obvious especially if you are coding for a larger project.  Typed compilation is less forgiving in a good way.  You simply make much less mistakes in the long run.  TypeScript might be the best answer to JavaScript yet.  It's still JavaScript, but with many bonuses including a growing community. :)
4. Most major IDEs and text editors now support TypeScript either built in, or via a plug-in:
  * Visual Studio
  * VS Code
  * WebStorm (Strongly recommended! Makes NodeJS development a dream.) 
  * Sublime Text
  * Atom

To name a few.


## Release Notes:
* 4.0.0: Marks the first release using TypeScript 2.  Strict Null Checking is built in and will propagate through generics as it should.

## Highlights
* [**Linq**](https://github.com/electricessence/TypeScript.NET/tree/master/source/System.Linq): Full linq.js library ported to TypeScript with improvements and optimizations.  Proper use of IEnumerable&lt;T&gt; with passing unit tests.  All the things you love about Linq, but fully typed and JS compatible.    **\*\*All collections now support a ```.linq``` lazy helper property when using NodeJS/CommonJS.**
* [**Exceptions**](https://github.com/electricessence/TypeScript.NET/tree/master/source/System/Exceptions): There is a growing set of Exceptions like ArgumentNullException, ArgumentOutOfRangeException, etc that are useful in making decisions about how to handle errors using *instanceof* as if you used multiple *catch* statements in C#.
* [**Collections**](https://github.com/electricessence/TypeScript.NET/tree/master/source/System/Collections): Multiple collections types with standard ICollection&lt;T&gt; and IEnumerable&lt;T&gt; interfaces.  LinkedList&lt;T&gt;, Queue&lt;T&gt;, Dictionary&lt;T&gt;, and more, all unit tested using a common interface test of ICollection&lt;T&gt;. \*\*
* [**IDisposable**](https://github.com/electricessence/TypeScript.NET/blob/master/source/System/Disposable/IDisposable.d.ts): Additional interfaces, utilities, and classes like [**DisposableBase**](https://github.com/electricessence/TypeScript.NET/blob/master/source/System/Disposable/DisposableBase.ts) that help in providing a cleanup pattern for larger applications that may easily encounter memory leaks.  Many of the classes within, including IEnumerator&lt;T&gt;, use IDisposable to ensure releasing of references.
* [**ObjectPool**](https://github.com/electricessence/TypeScript.NET/blob/master/source/System/Disposable/ObjectPool.ts): There are some cases where internal objects are used quite often and instead of relying on the garbage collector to do cleanup, a performance/efficiency gain can be attained by using an ObjectPool.  See actual use [here](https://github.com/electricessence/TypeScript.NET/blob/master/source/System/Collections/Enumeration/EnumeratorBase.ts#L17-L27).
* [**DateTime**](https://github.com/electricessence/TypeScript.NET/blob/master/source/System/Time/DateTime.ts) & [**TimeSpan**](https://github.com/electricessence/TypeScript.NET/blob/master/source/System/Time/TimeSpan.ts): The [**System/Time**](https://github.com/electricessence/TypeScript.NET/tree/master/source/System/Time) namespace takes these .NET classes and goes even further to provide useful classes for calculating and expressing dates and time.
* [**Uri**](https://github.com/electricessence/TypeScript.NET/blob/master/source/System/Uri/Uri.ts), [**QueryParams**](https://github.com/electricessence/TypeScript.NET/blob/master/source/System/Uri/QueryParams.ts), & [**QueryBuilder**](https://github.com/electricessence/TypeScript.NET/blob/master/source/System/Uri/QueryBuilder.ts):  Having a typed class and interface for an Uri tends to be very useful in web development.  Originally inspired by the .NET System.Uri class, these have been written from scratch to be more useful and helpful for debugging in JavaScript and are based upon the URI specification.
* [**Regex**](https://github.com/electricessence/TypeScript.NET/blob/master/source/System/Text/RegularExpressions.ts): Includes named group captures.  Very handy for accessing groups in regular expression results.
* [**Promise\<T\>**](https://github.com/electricessence/TypeScript.NET/blob/master/source/System/Promises/Promise.ts) and [**LazyPromise\<T\>**](https://github.com/electricessence/TypeScript.NET/blob/master/source/System/Promises/LazyPromise.ts): An efficient set of promises that fills that follows the standard ES6 usage while allowing for some useful methods that can improve performance of your application.  Read more [here](https://www.reddit.com/r/typescript/comments/4l9orj/lazypromiset/).
* [**Parallel**](https://github.com/electricessence/TypeScript.NET/blob/master/source/System/Threading/Tasks/Parallel.ts): Simplifies distributing tasks to a 'Worker'.  Has ability to ```map``` and ```reduce``` and results in a Promise\<T\>.
* [**TypeValidator\<T\>**](https://github.com/electricessence/TypeScript.NET/blob/master/source/System/TypeValidator.ts): An easy to use runtime type checker for complex types or JSON.  Read more [here](https://github.com/electricessence/TypeScript.NET/blob/master/source/System/TypeValidator.md). 
* ***Currently no external dependencies.***

## Usage
After some time and effort, I've decided that this library should be module based since there are too many files and dependencies that may or may not get used.  This is simply the right decision and results in:

* Only loading what you need, when you need it.  You can import the entire TypeScript .NET library in your project and not worry about extra bytes you don't want.
* Compiling modules into a monolithic library is easier than the reverse.
* If you care about bundling and minification, **'r.js optimizer'** is probably the right way to go.
* The modular structure is not limited to requirejs since it should work perfectly well with JSPM/SystemJS.
* It is easy to change the module types. :)
* You can easily recompile the entire library into another folder fully minified using gulp.
* Already minified with source-map versions are provided in the **dist** folder

##### Why not take this a step further and break it up into separate NPM style modules/packages?
There is a point where fragmentation and over-granularity just make life harder.  If one module depends on another and you want to implement improvements it's just easier if they live in the same place.

### [NPM](https://www.npmjs.com/search?q=typescript-dotnet):
Version 2.5 was the first NPM release.  The goal is to get this as user friendly as possible.

***All distributions contain source-maps.***  
https://www.npmjs.com/search?q=typescript-dotnet  

#### [Universal Module Definition (UMD)](https://www.npmjs.com/package/typescript-dotnet-umd)
```
npm install typescript-dotnet-umd
```

It's highly recommended to use the UMD (minified) version for most cases since it works for AMD and CommonJS.  
*Note: WebPack has trouble with UMD. Use CommonJS or AMD if you intend to use WebPack.*

#### All Published NPM Module Types
* [```typescript-dotnet-umd```](https://www.npmjs.com/package/typescript-dotnet-umd)
* [```typescript-dotnet-es6```](https://www.npmjs.com/package/typescript-dotnet-es6)
* [```typescript-dotnet-commonjs```](https://www.npmjs.com/package/typescript-dotnet-commonjs)
* [```typescript-dotnet-amd```](https://www.npmjs.com/package/typescript-dotnet-amd)
* [```typescript-dotnet-system```](https://www.npmjs.com/package/typescript-dotnet-system)

Install on only the module type you need in order to avoid type collisions.

Currently it is possible/supported to use TypeScript .NET in a number of different ways:

#### Import Examples:

```typescript
import Enumerable from "typescript-dotnet-es6/System.Linq/Linq"
```

##### Recommended for users who are deploying directly to web/browsers:
*Note: WebPack has trouble with UMD. Use CommonJS or AMD if you intend to use WebPack.*
```typescript
import Enumerable from "typescript-dotnet-umd/System.Linq/Linq"
```

##### Pure (unminified ES5) CommonJS is available this way:  
```typescript
import Enumerable from "typescript-dotnet-commonjs/System.Linq/Linq"
```

##### Recommended for users who want pure minified AMD (RequireJS) with source-maps:    
```typescript
import Enumerable from "typescript-dotnet-amd/System.Linq/Linq"
```

### [Bower](http://bower.io/search/?q=typescript-dotnet):
```
bower install typescript-dotnet
```

This should also include require.js in your bower components directory.
If you need another module type other than AMD, the TypeScript files are included so you can rebuild however you need.

### [Nuget](https://www.nuget.org/packages/TypeScript.NET.Library/):
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

Documentation has a tendency to lag behind and TypeDoc is also lagging on updates.

## Contribution
This library has immense potential and quite often a class, or function that is missing will simply be added.  If you log any issues here on GitHub they will likely be addressed swiftly.  If you have a class or module you'd like to see integrated, just log an issue and start the discussion or feel free to make a pull request from your own design. :)

## Discussion

[![Join the chat at https://gitter.im/electricessence/TypeScript.NET](https://badges.gitter.im/electricessence/TypeScript.NET.svg)](https://gitter.im/electricessence/TypeScript.NET?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

#### Reddit
[TypeScript.NET Library](https://www.reddit.com/r/tsdotnetlibrary/)

[.NET](https://redd.it/3ojzbt),
[TypeScript](https://redd.it/3ok0bm)

## Learn, Connect & Evolve
[Stepping up to Typescript: Fundamentals](https://www.udemy.com/stepping-up-to-typescript-fundamentals)

#### Code Evolution
[www.youtube.com/channel/UCG2QyAgVUEKSMBaC0Fkp5GQ](https://www.youtube.com/channel/UCG2QyAgVUEKSMBaC0Fkp5GQ)

Click an image below to watch.

#### [Intro to TypeScript.NET Library (Part 1)](https://www.youtube.com/watch?v=dLwl2dGHSZo)
[![Intro to TypeScript.NET Library (Part 1)](https://img.youtube.com/vi/dLwl2dGHSZo/0.jpg)](https://www.youtube.com/watch?v=dLwl2dGHSZo)

#### [TypeScript.NET v3 Release Info/Update](https://www.youtube.com/watch?v=izQjE77TmOM)
[![TypeScript.NET v3 Release Info/Update](https://img.youtube.com/vi/izQjE77TmOM/0.jpg)](https://www.youtube.com/watch?v=izQjE77TmOM)
