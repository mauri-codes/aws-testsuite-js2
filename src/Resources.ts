import AWS, {
   CloudFront,
   Lambda,
   IAM,
   STS,
   S3,
   CodeBuild
} from "aws-sdk"

export interface AWSKeys {
   id: string
   secret: string
}

export interface Environment {
   region?: string
   profile?: string
   credentials?: AWSKeys
}

export type AWSService = "S3" | "CloudFront" | "IAM" | "Lambda" | "CodeBuild"

const clients: {
   [key in AWSService]: () => any
} = {
   S3: () => new S3(),
   CloudFront: () => new CloudFront(),
   IAM: () => new IAM(),
   Lambda: () => new Lambda(),
   CodeBuild: () => new CodeBuild()
}

interface EnvironmentConfig {
   credentials?: {
      secretAccessKey: string
      accessKeyId: string
   },
   region?: string
}

class AWSEnvironment {
   region: string | undefined
   profile: string | undefined
   credentials: AWSKeys | undefined
   accountId: string| undefined
   sts: STS
   constructor(env?: Environment) {
      this.region = env?.region
      this.profile = env?.profile
      this.credentials = env?.credentials
      this.sts = new AWS.STS(AWSEnvironment.createEnvironmentConfig(env || {}))
   }
   async getAccountNumber () {
      if (this.accountId === undefined) {
         let accountInfo: STS.GetCallerIdentityResponse = await this.sts.getCallerIdentity().promise()
         this.accountId = accountInfo.Account
      }
      return this.accountId
   }
   static createEnvironmentConfig (environment: Environment) {
      let config: EnvironmentConfig = {}
      if (environment?.region) {
         config.region = environment.region
      }
      if (environment?.profile) {
         const awsCredentials = new AWS.SharedIniFileCredentials({profile: environment.profile})
         config.credentials = {
            accessKeyId: awsCredentials.accessKeyId,
            secretAccessKey: awsCredentials.secretAccessKey
         }
      } else if (environment?.credentials) {
         config.credentials = {
            accessKeyId: environment.credentials?.id,
            secretAccessKey: environment.credentials.secret
         }
      }
      return config
   }
}

class AWSResource {
   environment: AWSEnvironment | undefined
   client: any
   service: AWSService
   constructor(service: AWSService, env?: Environment) {
      this.environment = new AWSEnvironment(env)
      this.service = service
      this.client = clients[this.service]()
      const config = AWSEnvironment.createEnvironmentConfig(this.environment)
      this.setUpClient(config)
   }
   setUpClient(config: EnvironmentConfig) {
      if (config.credentials || config.region) {
         this.client = new AWS[this.service](config)
      }
   }
}

class AWSResourceGroup {
   env: AWSEnvironment | undefined
   resources: AWSResource[] = []
   constructor(resources: AWSResource[], env?: AWSEnvironment) {
      this.env = new AWSEnvironment(env)
      this.resources = resources
      if (env?.profile || env?.region) {
         this.applyEnvironment(env)
      }
   }
   applyEnvironment(environment: AWSEnvironment) {
      this.resources.forEach(resource => {
         if (resource.environment == null) {
            let config = AWSEnvironment.createEnvironmentConfig(environment)
            resource.setUpClient(config)
         }
      })
   }
}

export { AWSResource, AWSResourceGroup, AWSEnvironment }