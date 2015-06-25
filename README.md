regexr
======

For composing regular expressions.

Regexr provides an ES6 template tag function that makes it easy to compose
regexes out of template strings without double-escaped hell.

For example, in ES5 and below, you would have to do something like the
following to compose a regular expression.

```js
var spaceRegex = '\\s*'
var finalRegex = '\\('+spaceRegex+'\\/\\[\\\\\\d+\\]\\)*$'
finalRegex = new RegExp(finalRegex, 'g')
console.log( !!'( /[\\12358])'.match(finalRegex) ) // true
```

Imagine making more complex regexes. Good luck with that!

Well, with regexr, now you can do what you always wanted to do:

Usage
-----

```js
var r = require('regexr')
var spaceRegex = r`\s*`
var finalRegex = r`/\(${spaceRegex}\/\[\\\d+\]\)*$/g`
console.log( !!'( /[\\12358])'.match(finalRegex) ) // true
```
