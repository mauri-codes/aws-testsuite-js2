import { mockTimeoutTest } from './util/jest'
import { Test, TestGroup } from "./Tests"



class ExampleTest extends Test {
  async run() { return await mockTimeoutTest() }
}
let test1 = new ExampleTest("test1", 0)
let test2 = new ExampleTest("test2", 1)
let test3 = new ExampleTest("test3", 1)
let test4 = new ExampleTest("test4", 2)
let test5 = new ExampleTest("test5", 2)
let test6 = new ExampleTest("test6", 2)
let test7 = new ExampleTest("test7", 10)
let test8 = new ExampleTest("test8", 10)
let test9 = new ExampleTest("test9", 10)

function getSpies(tests: Test[]) {
  return tests.map((test) => jest.spyOn(test, 'run'))
}
function first6TestsOrderCheck([spy1, spy2, spy3, spy4, spy5, spy6]:jest.SpyInstance[]) {
  const spy1Order = spy1.mock.invocationCallOrder[0]
  const spy2Order = spy2.mock.invocationCallOrder[0]
  const spy3Order = spy3.mock.invocationCallOrder[0]
  const spy4Order = spy4.mock.invocationCallOrder[0]
  const spy5Order = spy5.mock.invocationCallOrder[0]
  const spy6Order = spy6.mock.invocationCallOrder[0]
  expect(spy1Order).toBeLessThan(spy2Order)
  expect(spy1Order).toBeLessThan(spy3Order)
  expect(spy1Order).toBeLessThan(spy5Order)
  expect(spy1Order).toBeLessThan(spy6Order)
  expect(spy2Order).toBeLessThan(spy4Order)
  expect(spy3Order).toBeLessThan(spy6Order)

}

test('Given correctly formatted orders, GroupTest executes well', async () => {
  let [spy1, spy2, spy3, spy4, spy5, spy6] = getSpies([test1, test2, test3, test4, test5, test6])
  let testGroup = new TestGroup("testGroup", [
    test1, test2, test3, test4, test5, test6
  ])
  await testGroup.run()
  first6TestsOrderCheck([spy1, spy2, spy3, spy4, spy5, spy6])
});
test('Given non ascending orders, GroupTest executes well', async () => {
  let [spy3, spy6, spy4, spy1, spy5, spy2] = getSpies([test3, test6, test4, test1, test5, test2])
  let testGroup = new TestGroup("testGroup", [
    test2, test6, test1, test3, test5, test4
  ])
  await testGroup.run()
  first6TestsOrderCheck([spy1, spy2, spy3, spy4, spy5, spy6])
  
});
test('Given order numbers not in sequence, GroupTest executes well', async () => {
  let [spy1, spy4, spy5, spy6, spy7, spy8, spy9] = getSpies([test1, test4, test5, test6, test7, test8, test9])
  let testGroup = new TestGroup("testGroup", [
    test1, test4, test5, test6, test7, test8, test9
  ])
  await testGroup.run()
  const spy1Order = spy1.mock.invocationCallOrder[0]
  const spy4Order = spy4.mock.invocationCallOrder[0]
  const spy5Order = spy5.mock.invocationCallOrder[0]
  const spy6Order = spy6.mock.invocationCallOrder[0]
  const spy7Order = spy7.mock.invocationCallOrder[0]
  const spy8Order = spy8.mock.invocationCallOrder[0]
  const spy9Order = spy9.mock.invocationCallOrder[0]
  expect(spy1Order).toBeLessThan(spy9Order)
  expect(spy4Order).toBeLessThan(spy8Order)
  expect(spy5Order).toBeLessThan(spy7Order)
  expect(spy6Order).toBeLessThan(spy9Order)
  expect(spy1Order).toBeLessThan(spy4Order)
  expect(spy1Order).toBeLessThan(spy5Order)
})