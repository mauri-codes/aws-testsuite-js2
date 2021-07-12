import { TestResult } from ".."
import { Either } from "../util"

class ErrorDescription {
   message: string
   code: string
   skipThrow: boolean
   constructor(message: string, code: string, skipThrow: boolean = false) {
      this.message = message
      this.code = code
      this.skipThrow = skipThrow
   }
   checker(error: any): boolean {
      return error.code === this.code
   }
}

class TestError extends Error {
   info: ErrorDescription
   code: string
   constructor(error: ErrorDescription) {
      super(error.message)
      this.info = error
      this.code = error.code
   }
}

function CatchError(errorPool?: ErrorDescription[]) {
   return function(target: any, key: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value

      descriptor.value = async function(...args: any[]) {
         try {
            return await originalMethod.apply(this, args)
         } catch (error) {
            let errorFound = errorPool?.find(listError  => listError.checker(error))
            
            if (errorFound) {
               if (errorFound.skipThrow) {
                  return descriptor
               }
            }
            
            throw error
         }
      }
      return descriptor
   }
}

function CatchTestError(id: string, errorHandler?: (error: Either<Error, TestError>) => TestResult) {
   return function(target: any, key: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value

      descriptor.value = async function(...args: any[]): Promise<TestResult> {
         try {
            return await originalMethod.apply(this, args)
         } catch (error) {
            if(errorHandler) {
               return errorHandler(error)
            }
            let response: TestResult = {
               id,
               success: false,
               message: error.message,
               error: error.code || "500"
            }
            return response
         }
      }
      return descriptor
   }
}

export { ErrorDescription, TestError, CatchError, CatchTestError}
