export interface ProjectConfig {
   environment?: {
      type?: string
      image?: string
      computeType?: string
      environmentVariables?: {[key: string]: string}
   }
   artifact?: {
      type: string
      location: string
      name: string
      path?: string
      packaging?: string
   }
   source?: {
      type: string
      location: string
   }
}
