const r = require('../src').default

describe('Regexr:', () => {
    describe('r.identifier', () => {
        it('matches legal JavaScript identifiers', () => {
            const str1 = 'const fooBar_baz_123  ='
            const str2 = 'const fooBar_baz-123 ='
            const str3 = 'constfooBar_baz123 ='
            
            const variableDeclaration = r`(const|let|var)\s+(${r.identifier})\s*=`;
            
            expect(!!str1.match(variableDeclaration)).toBe(true)
            expect(!!str2.match(variableDeclaration)).toBe(false)
            expect(!!str3.match(variableDeclaration)).toBe(false)
            
            // TODO test some characters not normally found on average keyboards
        })
    })
    
    describe('r.identifierList', () => {
        it('matches a comma separated list of legal JavaScript identifiers', () => {
            const str1 = '(foo,  bar,baz)'
            const str2 = '(foo, ,bar, baz)'
            const str3 = '(foo,bar, baz,)'
            const str4 = '(foo,bar, baz,,)'
            const str5 = '(foo,bar, baz, lorem ipsum)'
            const str6 = '(,foo,  bar, baz)'
            const str7 = '(foo)'
            const str8 = '(foo ,)'
            
            const listInsideParens = r`\(${r.identifierList}\)`;
            
            expect(!!str1.match(listInsideParens)).toBe(true)
            expect(!!str2.match(listInsideParens)).toBe(false)
            expect(!!str3.match(listInsideParens)).toBe(true)
            expect(!!str4.match(listInsideParens)).toBe(false)
            expect(!!str5.match(listInsideParens)).toBe(false)
            expect(!!str6.match(listInsideParens)).toBe(false)
            expect(!!str7.match(listInsideParens)).toBe(true)
            expect(!!str8.match(listInsideParens)).toBe(true)
            
            // TODO test some characters not normally found on average keyboards
        })
    })
    
    describe('r.functionHeader', () => {
        it('matches a JavaScript function header', () => {
            expect(!!'function() {'.match(r.functionHeader)).toBe(true)
            expect(!!'function asdf() {'.match(r.functionHeader)).toBe(true)
            expect(!!'function (asdf ) {'.match(r.functionHeader)).toBe(true)
            expect(!!'function asdf (asdf ) {'.match(r.functionHeader)).toBe(true)
            expect(!!'function asdf(asdf  , asdf, ) {'.match(r.functionHeader)).toBe(true)
            expect(!!'function (asdf, asdf, asdfa asdf ) {'.match(r.functionHeader)).toBe(false)
            expect(!!'function asdf (asdf, asdf, asdfa asdf ) {'.match(r.functionHeader)).toBe(false)
            expect(!!'function asdf asdf (asdf, asdf, asdfa ) {'.match(r.functionHeader)).toBe(false)
            expect(!!'function asdf asdf (, asdf, asdf,) {'.match(r.functionHeader)).toBe(false)
            expect(!!'function (asdf asdf) {'.match(r.functionHeader)).toBe(false)
            expect(!!'function (asdf,,) {'.match(r.functionHeader)).toBe(false)
        })
    })
    
    describe('r.digit', () => {
        it('matches a single number digit', () => {
            expect(!!" 8 ".match(r` ${r.digit} `)).toBe(true)
            expect(!!" 25 ".match(r` ${r.digit} `)).toBe(false)
        })
    })
    
    describe('r.integer', () => {
        it('matches an integer number', () => {
            expect(!!" 432 ".match(r` ${r.integer} `)).toBe(true)
            expect(!!" 43.2 ".match(r` ${r.integer} `)).toBe(false)
        })
    })
    
    describe('r.number', () => {
        it('matches any whole or fractional number', () => {
            expect(!!" 3 ".match(r` ${r.number} `)).toBe(true)
            expect(!!" 432 ".match(r` ${r.number} `)).toBe(true)
            expect(!!" 4.2 ".match(r` ${r.number} `)).toBe(true)
            expect(!!" 5. ".match(r` ${r.number} `)).toBe(true)
            expect(!!" .34 ".match(r` ${r.number} `)).toBe(true)
            expect(!!" .3.4 ".match(r` ${r.number} `)).toBe(false)
            expect(!!" ..34 ".match(r` ${r.number} `)).toBe(false)
            expect(!!" 3..4 ".match(r` ${r.number} `)).toBe(false)
        })
    })
    
    describe('r.escape', () => {
        it('escapes any string for use as a literal match inside any RegExp', () => {
            const money = "$5.00";
            const fiveDollarRegex = r`value: ${r.escape(money)}`;
            const fiveDollarRegexNotEscaped = r`value: ${money}`;

            expect(fiveDollarRegex.toString()).toBe('/value: \\$5\\.00/')
            expect(fiveDollarRegexNotEscaped.toString()).toBe('/value: $5.00/')
            
            expect(!!'value: $5.00'.match(fiveDollarRegex)).toBe(true)
            expect(!!'value: $5.50'.match(fiveDollarRegex)).toBe(false)
        })
    })
})
