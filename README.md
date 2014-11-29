TypeScript.NET
==============

###A JavaScript Friendly .NET Library Ported to TypeScript

The intention of this project to to allow for the evolution of a .NET based TypeScript (and resultant JavaScript) library.
Contributions are welcomed as the .NET Library (meaning it's class structure and classes, not necessarily its content) has a substantial amount of usefulness.  With the open sourcing of .NET, TypeScript seems the most logical means to take advantage of it.  Typing, generics, classes, modules, inheritance, all are required to make a resultant JavaScript library that takes advantage of this elegance.

Much inspiration comes from TypeScript itself and from libraries like linq.js.
There is of course some variance away from .NET's convention (camelCase methods in favor of TitleCase) and some things simply have to be done different.  "Extensions" as a feature might be one of the greatest additions to .NET that JavaScript doesn't have a plan for, but it does have some tricky equivalents.

If you have a .NET Library class that you want to see represented in TypeScript, submit it (as an issue), or contriubte it yourself! :)

## Why should I use this, let alone TypeScript?
1) **It's 100% compatible with JavaScript.**  Currently TypeScript.NET's target is ES5, so legacy JavaScript won't work. Mainly because of accessors.  But going forward, TypeScript is nearly the same as ES6 and you don't have to change your source code to target newer versions. :) 

2) TypeScript is lead by Anders Hejlsberg, the founder of C#.  You will feel quite at home in TypeScript if you are a fan of typed languages (like C#), but at the same time you'll get all the flexibility and compatibility of JavaScript.

See http://www.typescriptlang.org/ for more information about the TypeScript language.

Also some more good info on WikiPedia: http://en.wikipedia.org/wiki/TypeScript.

2) The benefits of intellisense and using an IDE for programming should be obvious especially if you are coding for a larger project.  Typed compilation is less forgiving in a good way.  You simply make much less mistakes in the long run.  TypeScript might be the best answer to JavaScript yet.  It's still JavaScript, but with many bonuses including a growing community. :)

3) Most major IDE's and text editors now support TypeScript either built in, or via a plug-in:
* Visual Studio 2013 (or greater)
* WebStorm (recommended!)
* Sublime Text

To name a few.

In my case, I use both Visual Studio and Web Storm to ensure quality.  

4) There's some really good and useful code here already, including a fully typed (with generics) Linq implementation.  Take a look!

# Usage
This library is meant to be flexible. So for a single project/package there are multiple versions of the result.

For example, System has the following files in the build directory:
```
/build/System.js
/build/System.min.js
/build/amd/System.js
```
NOTE: The amd versions aren't yet updated via a build step so it's more reliable to use the non amd versions and use a shim.

# Learn, Connect & Evolve
https://www.youtube.com/channel/UCG2QyAgVUEKSMBaC0Fkp5GQ

# In Progress
Currently working on System.Threading.

# Future
Planning to make this a bower and other package systems (easy) install.

Full documentation and references (dreaming).

