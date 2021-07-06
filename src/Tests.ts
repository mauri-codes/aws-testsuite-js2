
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
   constructor(id: string) {
      this.id = id
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
   async run() {
      const testPromises = this.tests.map(test => test.run())
      let result = await Promise.all(testPromises)
      this.tests.forEach((test, index) => {
         result[index].id = test.id
      })
      return {
         id: this.id,
         success: result.every(test => test.success),
         tests: result
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
