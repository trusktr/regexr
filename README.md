# regexr

Easily compose regular expressions. Doing this with plain strings would otherwise be
tedious and error prone due to having to double-escape backslashes.

#### [`npm install regexr`](https://npmjs.com/regexr)

Basic example:

```js
import r from "regexr";

const int = /\d+/;
const USD = r`\$${int}(\.${int})?`; // f.e. $3.45 or $5
```

(Note that `int` is an instance of `RegExp` and can be composed into the
template string, and the resulting `USD` is also a `RegExp`)

Regexr provides an ES6 template tag function that makes it easy to compose
`RegExp`s using template strings without double-escaped hell.

In ES5 and below, we may try to compose the regular expressions like so:

```js
const int = '\d+'
let USD = new RegExp('\$'+int+'(\.'+int+')?`) // this won't work!
```

but if you're experienced enough, you'd know that if you want to compose
regular expressions using ES5 strings you have to escape the escape:

```js
const int = '\\d+'
const USD = new RegExp('\\$'+int+'(\\.'+int+')?`) // correct!
```

Imagine making more complex regexes! For example, compare the following two
examples achieving the same thing in ES5 and ES6 respectively:

```js
// in ES5, the double escaping can get confusing:
var spaceRegex = "\\s*";
var finalRegex = "\\(" + spaceRegex + "\\/\\[\\\\\\d+\\]\\)*$";
finalRegex = new RegExp(finalRegex, "g");
console.log(!!"( /[\\12358])".match(finalRegex)); // true
```

```js
// in ES6, we don't have to double escape, thanks to regexr:
import r from "regexr";

var spaceRegex = r`\s*`;
var finalRegex = r`/\(${spaceRegex}\/\[\\\d+\]\)*$/g`;
console.log(!!"( /[\\12358])".match(finalRegex)); // true
```

## API

#### ` r`` ` template tag function

```js
import r from "regexr";
// or
const r = require("regexr").default;
```

` r`` ` is a template tag function that converts the given string into a
RegExp without requiring double escaping. Instances of `RegExp` can be mixed
into the string, and will be composed into the final `RegExp`.

Example:

```js
const digit = /\d/;
const integer = r`/${digit}+/`;
const number = r`/${integer}|${digit}*\.${integer}|${integer}\.${digit}*/`; // f.e. 4.2, .5, 5.
```

### Helpers

#### `r.escape`

Escape a plain string for matching literally inside a regex.

Sometimes we want to match an exact string that may contain symbols that we need
to escape in order to match the characters of the string literally.

In the follow example, we want to find occurrences of the string `"value: $5.00"` in some input, so we need to escape the `money` string so that the
dollar symbol (`$`) doesn't represent end-of-line and the period (`.`) doesn't
mean any character:

```js
const money = "$5.00";
const fiveDollarRegex = r`value: ${r.escape(money)}`;

console.log(fiveDollarRegex); // /value: \$5\.00/
console.log("value: $5.00".match(fiveDollarRegex)); // true
console.log("value: $5.50".match(fiveDollarRegex)); // false
```

### Hand-picked Regexes

Regexr comes with some pre-selected regular expressions. For example, we can
rewrite the first example:

```js
import r from "regexr";

const USD = r`\$${r.integer}(\.${r.integer})?`; // f.e. $3.45 or $5
```

where `r.integer` is an instance of `RegExp`.

**_NOTE! Some of the following RegExps require to be wrapped in `()` when they
are being composed into bigger RegExps. These will be noted below._**

#### `r.identifier`

Matches a valid JavaScript identifier. See
[this](http://stackoverflow.com/questions/2008279/validate-a-javascript-function-name/9392578#9392578)
for details.

**_Requires wrapping in `()` when being composed._**

For example, to match a the beginning of a JS variable declaration, you could
write:

```js
const variableDeclaration = r`(const|let|var)\s+(${r.identifier})\s*=`;
!!"const foo  =".match(variableDeclaration); // true
!!"const foo bar =".match(variableDeclaration); // false
```

#### `r.digit`

Matches a single numerical digit (0-9).

Example:

```js
!!" 8 ".match(r` ${r.digit} `); // true
!!" 25 ".match(r` ${r.digit} `); // false
```

#### `r.integer`

Matches 1 or more digits.

Example:

```js
!!" 432 ".match(r` ${r.integer} `); // true
```

#### `r.number`

Matches a JavaScript Number.

Example:

```js
!!"3".match(r.number); // true
!!"432".match(r.number); // true
!!"4.2".match(r.number); // true
!!"5.".match(r.number); // true
!!".34".match(r.number); // true
```

#### `r.identifierList`

Matches a comma separated list of legal JavaScript identifiers.

Example:

```js
const identifiersInsideParens = r`\(${r.identifierList}\)`;

!!"(foo,  bar,baz)".match(identifiersInsideParens); // true
!!"(foo, ,bar, baz)".match(identifiersInsideParens); // false
```

#### `r.functionHeader`

Matches a JavaScript function header.

Example:

```js
const identifiersInsideParens = r`\(${r.identifierList}\)`;

!!"function() {".match(r.functionHeader); // true
!!"function asdf() {".match(r.functionHeader); // true
!!"function (asdf ) {".match(r.functionHeader); // true
!!"function asdf (asdf ) {".match(r.functionHeader); // true
!!"function asdf(asdf  , asdf, ) {".match(r.functionHeader); // true
!!"function (asdf, asdf, asdfa asdf ) {".match(r.functionHeader); // false
!!"function asdf (asdf, asdf, asdfa asdf ) {".match(r.functionHeader); // false
!!"function asdf asdf (asdf, asdf, asdfa ) {".match(r.functionHeader); // false
!!"function asdf asdf (, asdf, asdf,) {".match(r.functionHeader); // false
!!"function (asdf asdf) {".match(r.functionHeader); // false
!!"function (asdf,,) {".match(r.functionHeader); // false
```
