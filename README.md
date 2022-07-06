# regexr

Easily compose regular expressions. Doing this with plain strings would otherwise be
tedious and error prone due to having to double-escape backslashes.

#### [`npm install regexr`](https://npmjs.com/regexr)

Basic example:

```js
import r from 'regexr'

const int = /\d+/
const USD = r`\$${int}(\.${int})?` // f.e. $3.45 or $5
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
const spaceRegex = '\\s*'
const finalRegex = new RegExp('\\(' + spaceRegex + '\\/\\[\\\\\\d+\\]\\)*$', 'g')
console.log(!!'( /[\\12358])'.match(finalRegex)) // true
```

```js
// in ES6, we don't have to double escape, thanks to regexr:
import r from 'regexr'

const spaceRegex = r`\s*`
const finalRegex = r`/\(${spaceRegex}\/\[\\\d+\]\)*$/g`
console.log(!!'( /[\\12358])'.match(finalRegex)) // true
```

## API

#### ` r`` ` template tag function

```js
import r from 'regexr'
// or
const r = require('regexr').default
```

` r`` ` is a template tag function that converts the given string into a
RegExp without requiring double escaping. Instances of `RegExp` can be mixed
into the string, and will be composed into the final `RegExp`.

Example:

```js
const digit = /\d/
const integer = r`/${digit}+/`
const number = r`/${integer}|${digit}*\.${integer}|${integer}\.${digit}*/` // f.e. 4.2, .5, 5.
```

### Helpers

#### `escape` (alias `e`)

Escape (add backslashes to) a string for so that we can match all symbols in the
string literally when the string is used as a regex.

In the following example, we want to find occurrences of the string `"value: $5.00"` in some input, so we need to escape the `money` string so that the
dollar symbol (`$`) doesn't represent end-of-line and the period (`.`) doesn't
mean any character:

```js
import {e} from 'regexr'

const money = '$5.00'
const fiveDollarRegex = r`value: ${e(money)}`

console.log(fiveDollarRegex) // /value: \$5\.00/
console.log('value: $5.00'.match(fiveDollarRegex)) // true
console.log('value: $5.50'.match(fiveDollarRegex)) // false
```

### Hand-picked Regexes

Regexr comes with some pre-selected regular expressions. For example, we can
rewrite the first example:

```js
import r from 'regexr'
import * as regs from 'regexr/regexes'

const USD = r`\$${regs.integer}(\.${regs.integer})?` // f.e. $3.45 or $5
```

where `regs.integer` is an instance of `RegExp`.

**_NOTE! Some of the following RegExps require to be wrapped in `()` when they
are being composed into bigger RegExps. These will be noted below._**

#### `regs.identifier`

Matches a valid JavaScript identifier. See
[this](http://stackoverflow.com/questions/2008279/validate-a-javascript-function-name/9392578#9392578)
for details.

**_Requires wrapping in `()` when being composed._**

For example, to match a the beginning of a JS variable declaration, you could
write:

```js
import * as regs from 'regexr/regexes'
const variableDeclaration = r`(const|let|var)\s+(${regs.identifier})\s*=`
!!'const foo  ='.match(variableDeclaration) // true
!!'const foo bar ='.match(variableDeclaration) // false
```

#### `regs.digit`

Matches a single numerical digit (0-9).

Example:

```js
import * as regs from 'regexr/regexes'
!!' 8 '.match(r` ${regs.digit} `) // true
!!' 25 '.match(r` ${regs.digit} `) // false
```

#### `regs.integer`

Matches 1 or more digits.

Example:

```js
import * as regs from 'regexr/regexes'
!!' 432 '.match(r` ${regs.integer} `) // true
```

#### `regs.number`

Matches a JavaScript Number.

Example:

```js
import * as regs from 'regexr/regexes'
!!'3'.match(regs.number) // true
!!'432'.match(regs.number) // true
!!'4.2'.match(regs.number) // true
!!'5.'.match(regs.number) // true
!!'.34'.match(regs.number) // true
```

#### `regs.identifierList`

Matches a comma separated list of legal JavaScript identifiers.

Example:

```js
import * as regs from 'regexr/regexes'
const identifiersInsideParens = r`\(${regs.identifierList}\)`

!!'(foo,  bar,baz)'.match(identifiersInsideParens) // true
!!'(foo, ,bar, baz)'.match(identifiersInsideParens) // false
```

#### `regs.functionHeader`

Matches a JavaScript function header.

Example:

```js
import * as regs from 'regexr/regexes'
const identifiersInsideParens = r`\(${regs.identifierList}\)`

!!'function() {'.match(regs.functionHeader) // true
!!'function asdf() {'.match(regs.functionHeader) // true
!!'function (asdf ) {'.match(regs.functionHeader) // true
!!'function asdf (asdf ) {'.match(regs.functionHeader) // true
!!'function asdf(asdf  , asdf, ) {'.match(regs.functionHeader) // true
!!'function (asdf, asdf, asdfa asdf ) {'.match(regs.functionHeader) // false
!!'function asdf (asdf, asdf, asdfa asdf ) {'.match(regs.functionHeader) // false
!!'function asdf asdf (asdf, asdf, asdfa ) {'.match(regs.functionHeader) // false
!!'function asdf asdf (, asdf, asdf,) {'.match(regs.functionHeader) // false
!!'function (asdf asdf) {'.match(regs.functionHeader) // false
!!'function (asdf,,) {'.match(regs.functionHeader) // false
```
