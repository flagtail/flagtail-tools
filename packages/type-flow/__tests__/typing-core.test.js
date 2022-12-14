const {Typing}  = require('../src');

test('CHECK: isNotNull()', () => {
  expect(Typing.isNotNull(false)).toBeTruthy();
  expect(Typing.isNotNull(10)).toBeTruthy();
  expect(Typing.isNotNull('word')).toBeTruthy();

  expect(Typing.isNotNull(null)).toBeFalsy();
  expect(Typing.isNotNull(undefined)).toBeFalsy();
  expect(Typing.isNotNull('')).toBeFalsy();
});

test('CHECK: isNull()', () => {
  expect(Typing.isNull(false)).toBeFalsy();
  expect(Typing.isNull(10)).toBeFalsy();
  expect(Typing.isNull('text')).toBeFalsy();

  expect(Typing.isNull(null)).toBeTruthy();
  expect(Typing.isNull(undefined)).toBeTruthy();
  expect(Typing.isNull('')).toBeTruthy();
});

test('CHECK: ifNullThrow()', () => {
  expect(()=>Typing.ifNullThrow(null)).toThrow('the value is null or undefined or empty');
  expect(()=>Typing.ifNullThrow(undefined)).toThrow();
  expect(()=>Typing.ifNullThrow('')).toThrow();

  expect(Typing.ifNullThrow('text')).toBeTruthy();
});

test('CHECK: isWrapper()', ()=> {
  expect(Typing.isWrapper(new String('text'))).toBeTruthy();
  expect(Typing.isWrapper(new Number(10))).toBeTruthy();
  expect(Typing.isWrapper(new Boolean(false))).toBeTruthy();

  expect(Typing.isWrapper(100)).toBeFalsy();
})

test('CHECK: isPrimitive()', ()=> {
  expect(Typing.isPrimitive(new String('text'))).toBeFalsy();
  expect(Typing.isPrimitive(new Number(10))).toBeFalsy();
  expect(Typing.isPrimitive(new Boolean(false))).toBeFalsy();
  expect(Typing.isPrimitive(function() {})).toBeFalsy();
  expect(Typing.isPrimitive(class {})).toBeFalsy();
  expect(Typing.isPrimitive({})).toBeFalsy();

  expect(Typing.isPrimitive(100)).toBeTruthy();
  expect(Typing.isPrimitive('text')).toBeTruthy();
  expect(Typing.isPrimitive(false)).toBeTruthy();
  expect(Typing.isPrimitive(BigInt(123456789))).toBeTruthy();
  expect(Typing.isPrimitive(Symbol('sym'))).toBeTruthy();
})

test('CHECK: isFunction()', ()=> {
  expect(Typing.isFunction(function myFunc() {})).toBeTruthy();
  expect(Typing.isFunction(function () {})).toBeTruthy();
  expect(Typing.isFunction(()=>{})).toBeTruthy();

  expect(Typing.isFunction(class {})).toBeFalsy();
  expect(Typing.isFunction({})).toBeFalsy();
  expect(Typing.isFunction('function() {}')).toBeFalsy();
})

test('CHECK: isClass()', ()=> {
  expect(Typing.isClass(class myClass {})).toBeTruthy();
  expect(Typing.isClass(class {})).toBeTruthy();
  
  expect(Typing.isClass(function myFunc() {})).toBeFalsy();
  expect(Typing.isClass(function () {})).toBeFalsy();
  expect(Typing.isClass(()=>{})).toBeFalsy();
  expect(Typing.isClass({})).toBeFalsy();
  expect(Typing.isClass('class {}')).toBeFalsy();
})
test('CHECK: isObject()', ()=> {
  expect(Typing.isObject({})).toBeTruthy();

  class Clazz {}
  expect(Typing.isObject(class MyClass {})).toBeFalsy();
  expect(Typing.isObject(class {})).toBeFalsy();
  expect(Typing.isObject(new Clazz())).toBeTruthy();

  expect(Typing.isObject(function myFunc() {})).toBeFalsy();
  expect(Typing.isObject(function () {})).toBeFalsy();
  expect(Typing.isObject(()=>{})).toBeFalsy();

  expect(Typing.isObject(new String('test'))).toBeTruthy();
  expect(Typing.isObject('test')).toBeFalsy();
})
test('CHECK: isArray()', ()=> {
  expect(Typing.isArray([1,2,3,4])).toBeTruthy();

  expect(Typing.isArray({a: 10, b: 20})).toBeFalsy();
})

test('CHECK: is.instanceOf()', ()=> {
  class Clazz {}
  expect(Typing.is(new Clazz()).instanceOf(Clazz)).toBeTruthy();
  expect(Typing.is(new Clazz()).instanceOf(Object)).toBeTruthy();
  expect(Typing.is([1, 2, 3, 4]).instanceOf(Array)).toBeTruthy();
  expect(Typing.is([1, 2, 3, 4]).instanceOf(Object)).toBeTruthy();

  expect(Typing.is('test').instanceOf(String)).toBeFalsy();
  expect(Typing.is(Clazz).instanceOf(Clazz)).toBeFalsy();


  class Member{}

  const memberTypeCheckResult1 = Typing.is(new Member()).instanceOf([Member,Array]);
  const memberTypeCheckResult2 = Typing.is(new Member()).instanceOf([Error,Array]);

  expect(memberTypeCheckResult1).toBeTruthy();
  expect(memberTypeCheckResult2).toBeFalsy();

})

test('CHECK: is.primitiveOf()', ()=> {
  expect(Typing.is(10).primitiveOf(Number)).toBeTruthy();
  expect(Typing.is('text').primitiveOf(String)).toBeTruthy();
  expect(Typing.is(false).primitiveOf('boolean')).toBeTruthy();

  expect(Typing.is([1, 2, 3]).primitiveOf('array')).toBeFalsy();
  expect(Typing.is(10).primitiveOf('string')).toBeFalsy();
  expect(Typing.is('text').primitiveOf(Number)).toBeFalsy();

  const age = "30";
  const name = "Alice"

  const ageTypeCheckResult = Typing.is(age).primitiveOf(["number", String])
  const nameTypeCheckResult = Typing.is(name).primitiveOf([Number,Boolean])

  expect(ageTypeCheckResult).toBeTruthy();
  expect(nameTypeCheckResult).toBeFalsy();

})

test('CHECK: is.satisfy()', () => {
  class Member {
    constructor(name, age) {
      this.name = name;
      this.age = age;
    }

    isAdult() {
      return this.age >= 18
    }
  }

  expect(Typing.is(100).satisfy(v => v % 2 === 0)).toBeTruthy();
  expect(Typing.is(new Member('rhie', 17)).satisfy(v => v.isAdult())).toBeFalsy();
})

test('CHECK: preveted call constructor', () => {
  expect(() => new Typing()).toThrow(
    new SyntaxError("Can't make <Typing> instance")
  )
})


// Deprecate: focus on type check
// test('CHECK: is.sameWith()', ()=> {
//   class Clazz {}
//   expect(Typing.is(Clazz).sameWith(Clazz)).toBeTruthy();
//   expect(Typing.is('text').sameWith('text')).toBeTruthy();
//   expect(Typing.is(10).sameWith(10)).toBeTruthy();
//   expect(Typing.is(2).sameWith([Clazz, 2, 'text'])).toBeTruthy(); 
// })