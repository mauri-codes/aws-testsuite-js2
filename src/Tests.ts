
export interface TestResult {
   success: boolean
   id?: string
   message?: string
   error?: string
}

const SuccessFulTest: (id: string) => TestResult = 
   (id) => ({
      id,
      success: true
   }
)

class Test {
   id: string
   order: number
   constructor(id: string, order: number = 0) {
      this.id = id
      this.order = order
   }
   async run():Promise<TestResult> {
      return {
         success: true
      }
   }
}

class TestGroup {
   tests: Test[] = []
   id: string
   constructor(id: string, tests: Test[]) {
      this.id = id
      this.tests = tests
   }
   getSortedGroupByExecution(): Test[][] {
      let testCount = this.tests.length
      let sortedTestGroup: Test[][] = []
      let subGroup: Test[] = []
      this.tests.sort(sortByOrder)
      this.tests.forEach((test, ind) => {
         subGroup.push(test)
         if (ind + 1 === testCount || this.tests[ind+1].order != test.order) {
            sortedTestGroup.push(subGroup)
            subGroup = []
         }
      })
      return sortedTestGroup
      function sortByOrder(test1: Test, test2: Test) {
         return test1.order - test2.order
      }
   }
   async run() {
      let executions = this.getSortedGroupByExecution()
      let results: TestResult[] = []
      for (const group of executions) {
         results = [...results, ...(await Promise.all(group.map(test => test.run())))]
      }

      return {
         id: this.id,
         success: results.every(test => test.success),
         tests: results
      }
   }
}

class TestSuite {
   testGroups: TestGroup[] = []
   constructor(testGroups?: TestGroup[]) {
      if (testGroups) {
         this.testGroups = testGroups
      }
   }
   async run() {
      const testGroupPromises = this.testGroups.map(testGroup =>  testGroup.run())
      let result = await Promise.all(testGroupPromises)
      return {
         success: result.every(testGroup => testGroup.success),
         testGroups: result
      }
   }
}

export { Test, TestGroup, TestSuite, SuccessFulTest }
