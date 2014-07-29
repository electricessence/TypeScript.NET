TypeScript.NET
==============

.NET Library Ported to TypeScript

The intention of this project to to allow for the evolution of a .NET based TypeScript library.
Contributions are welcomed as the .NET Library (meaning it's class structure and classes, not it's content) has a substantial amount of usefulness.  With the open sourcing of .NET, TypeScript seems the most logical means to take advantage of it.  Typing, generics, classes, modules, inheritance, all are required to make a resultant JavaScript library that takes advantage of this elegance.

Much inspiration comes from TypeScript itself and from libraries like linq.js.
There is of course some variance away from .NET's convention (camelCase methods in favor of TitleCase) and somethings simply have to be done different.  "Extensions" as a feature might be one of the greatest additions to .NET that JavaScript doesn't have a plan for, but does have some tricky equivalents.

If you have a .NET Library class that you want to see represented in TypeScript, submit it (as an issue), or contriubte it yourself! :)

## Why should I use this, let alone TypeScript?
The benefits of intellisense and using an IDE for programming should be obvious especially if you are coding for a larger project.  Typed compilation is less forgiving in a good way.  You simply make much less mistakes in the long run.  TypeScript might be the best answer to JavaScript yet.  It's still JavaScript, but with many bonuses including a growing community. :)

See http://www.typescriptlang.org/ for more information.

# Usage
This library is meant to be flexible. So for a single project/package there are multiple versions of the result.

For example, System has the following files in the build directory:
```
/build/System.js
/build/System.min.js
/build/amd/System.js
```

# Future
Planning to make this a bower (and possibly NPM) install.
