import { r } from './index.js';
import * as regs from './regexes.js';
describe('regexes', () => {
    describe('identifier', () => {
        it('matches legal JavaScript identifiers', () => {
            const str1 = 'const fooBar_baz_123  =';
            const str2 = 'const fooBar_baz-123 =';
            const str3 = 'constfooBar_baz123 =';
            const variableDeclaration = r `(const|let|var)\s+(${regs.identifier})\s*=`;
            expect(!!str1.match(variableDeclaration)).toBe(true);
            expect(!!str2.match(variableDeclaration)).toBe(false);
            expect(!!str3.match(variableDeclaration)).toBe(false);
        });
    });
    describe('identifierList', () => {
        it('matches a comma separated list of legal JavaScript identifiers', () => {
            const str1 = '(foo,  bar,baz)';
            const str2 = '(foo, ,bar, baz)';
            const str3 = '(foo,bar, baz,)';
            const str4 = '(foo,bar, baz,,)';
            const str5 = '(foo,bar, baz, lorem ipsum)';
            const str6 = '(,foo,  bar, baz)';
            const str7 = '(foo)';
            const str8 = '(foo ,)';
            const listInsideParens = r `\(${regs.identifierList}\)`;
            expect(!!str1.match(listInsideParens)).toBe(true);
            expect(!!str2.match(listInsideParens)).toBe(false);
            expect(!!str3.match(listInsideParens)).toBe(true);
            expect(!!str4.match(listInsideParens)).toBe(false);
            expect(!!str5.match(listInsideParens)).toBe(false);
            expect(!!str6.match(listInsideParens)).toBe(false);
            expect(!!str7.match(listInsideParens)).toBe(true);
            expect(!!str8.match(listInsideParens)).toBe(true);
        });
    });
    describe('functionHeader', () => {
        it('matches a JavaScript function header', () => {
            expect(!!'function() {'.match(regs.functionHeader)).toBe(true);
            expect(!!'function asdf() {'.match(regs.functionHeader)).toBe(true);
            expect(!!'function (asdf ) {'.match(regs.functionHeader)).toBe(true);
            expect(!!'function asdf (asdf ) {'.match(regs.functionHeader)).toBe(true);
            expect(!!'function asdf(asdf  , asdf, ) {'.match(regs.functionHeader)).toBe(true);
            expect(!!'function (asdf, asdf, asdfa asdf ) {'.match(regs.functionHeader)).toBe(false);
            expect(!!'function asdf (asdf, asdf, asdfa asdf ) {'.match(regs.functionHeader)).toBe(false);
            expect(!!'function asdf asdf (asdf, asdf, asdfa ) {'.match(regs.functionHeader)).toBe(false);
            expect(!!'function asdf asdf (, asdf, asdf,) {'.match(regs.functionHeader)).toBe(false);
            expect(!!'function (asdf asdf) {'.match(regs.functionHeader)).toBe(false);
            expect(!!'function (asdf,,) {'.match(regs.functionHeader)).toBe(false);
        });
    });
    describe('classMethodHeader', () => {
        it('matches a JavaScript method header', () => {
            expect(!!' asdf() {'.match(regs.classMethodHeader)).toBe(true);
            expect(!!'asdf (asdf ) {'.match(regs.classMethodHeader)).toBe(true);
            expect(!!'asdf(asdf  , asdf, ) {'.match(regs.classMethodHeader)).toBe(true);
            expect(!!'asdf ( asdf, asdf, asdf) {'.match(regs.classMethodHeader)).toBe(true);
            expect(!!'() {'.match(regs.classMethodHeader)).toBe(false);
            expect(!!'(asdf ) {'.match(regs.classMethodHeader)).toBe(false);
            expect(!!'(asdf, asdf, asdfa asdf ) {'.match(regs.classMethodHeader)).toBe(false);
            expect(!!'asdf (asdf, asdf, asdfa asdf ) {'.match(regs.classMethodHeader)).toBe(false);
            expect(!!'asdf asdf (asdf, asdf, asdfa ) {'.match(r `^${regs.classMethodHeader}$`)).toBe(false);
            expect(!!'asdf asdf (, asdf, asdf,) {'.match(regs.classMethodHeader)).toBe(false);
            expect(!!'(asdf asdf) {'.match(regs.classMethodHeader)).toBe(false);
            expect(!!'(asdf,,) {'.match(regs.classMethodHeader)).toBe(false);
        });
    });
    describe('digit', () => {
        it('matches a single number digit', () => {
            expect(!!' 8 '.match(r ` ${regs.digit} `)).toBe(true);
            expect(!!' 25 '.match(r ` ${regs.digit} `)).toBe(false);
        });
    });
    describe('integer', () => {
        it('matches an integer number', () => {
            expect(!!' 432 '.match(r ` ${regs.integer} `)).toBe(true);
            expect(!!' 43.2 '.match(r ` ${regs.integer} `)).toBe(false);
        });
    });
    describe('number', () => {
        it('matches any whole or fractional number', () => {
            expect(!!' 3 '.match(r ` ${regs.number} `)).toBe(true);
            expect(!!' 432 '.match(r ` ${regs.number} `)).toBe(true);
            expect(!!' 4.2 '.match(r ` ${regs.number} `)).toBe(true);
            expect(!!' 5. '.match(r ` ${regs.number} `)).toBe(true);
            expect(!!' .34 '.match(r ` ${regs.number} `)).toBe(true);
            expect(!!' .3.4 '.match(r ` ${regs.number} `)).toBe(false);
            expect(!!' ..34 '.match(r ` ${regs.number} `)).toBe(false);
            expect(!!' 3..4 '.match(r ` ${regs.number} `)).toBe(false);
        });
    });
});
//# sourceMappingURL=regexes.test.js.map