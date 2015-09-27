TypeScript.NET
==============

##A JavaScript Friendly .NET Based Library Ported to TypeScript

The intention of this project to to allow for the evolution of a .NET based TypeScript (and resultant JavaScript) library.
Contributions are welcomed as the .NET Library (meaning it's class structure and classes, not necessarily its content) has a substantial amount of usefulness.  With the open sourcing of .NET, TypeScript seems the most logical means to take advantage of it.  Typing, generics, classes, modules, inheritance, all are required to make a resultant JavaScript library that takes advantage of this elegance.

Much inspiration comes from TypeScript itself and from libraries like linq.js.
There is of course some variance away from .NET's convention (camelCase methods in favor of TitleCase) and some things simply have to be done different.  "Extensions" as a feature might be one of the greatest additions to .NET that JavaScript doesn't have a plan for, but it does have some tricky equivalents.

If you have a .NET Library class that you want to see represented in TypeScript, submit it (as an issue), or contribute it yourself! :)

## Why should I use this, let alone TypeScript?
1) **It's 100% compatible with JavaScript.**  Currently TypeScript.NET's target is ES5, so legacy JavaScript won't work. Mainly because of accessors.  But going forward, TypeScript is nearly the same as ES6 and you don't have to change your source code to target newer versions. :) 

2) TypeScript is lead by Anders Hejlsberg, the founder of C#.  You will feel quite at home in TypeScript if you are a fan of typed languages (like C#), but at the same time you'll get all the flexibility and compatibility of JavaScript.

See http://www.typescriptlang.org/ for more information about the TypeScript language.

Also some more good info on Wikipedia: http://en.wikipedia.org/wiki/TypeScript.

2) The benefits of intellisense and using an IDE for programming should be obvious especially if you are coding for a larger project.  Typed compilation is less forgiving in a good way.  You simply make much less mistakes in the long run.  TypeScript might be the best answer to JavaScript yet.  It's still JavaScript, but with many bonuses including a growing community. :)

3) Most major IDEs and text editors now support TypeScript either built in, or via a plug-in:
* Visual Studio
* VS Code
* WebStorm (recommended!)
* Sublime Text
* Atom

To name a few.

4) There's some really good and useful code here already, including a fully typed (with generics) Linq implementation.  Take a look!

# Usage
After some time and effort, I've decided that this library should be module based since there are too many files and dependencies that may or may not get used.  This is simply the right decision and results in:
* Only loading what you need, when you need it.  You can import the entire TypeScript.NET library in your project and not worry about extra bytes you don't want.
* If you care about bundling and minification r.js is probably the right way to go.
* The modular structure is not limited to requirejs since it should work perfectly well with JSPM/SystemJS.
* It is easy to change the module types. :)


# Learn, Connect & Evolve
https://www.youtube.com/channel/UCG2QyAgVUEKSMBaC0Fkp5GQ

# Unit Tests
Simply launch /tests/index.html to see existing unit tests and their status.

# Examples
Currently the unit test cover many example usages.

# Documentation
Currently improving over time using JSDoc style comments and TypeDoc. http://http://typedoc.io/
