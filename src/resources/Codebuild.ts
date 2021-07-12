import { AWSResource, Environment } from '..'
import { CodeBuild } from "aws-sdk";
import { BatchGetProjectsOutput, Project, Projects } from 'aws-sdk/clients/codebuild';

class CodeBuildResource extends AWSResource {
   codebuildClient: CodeBuild
   constructor(env?: Environment) {
      super("CodeBuild", env)
      this.codebuildClient = this.client as CodeBuild
   }
}

class CodebuildProject extends CodeBuildResource {
   projectName: string
   projectInfo: Project | undefined | null
   constructor(projectName: string, env?: Environment) {
      super(env)
      this.projectName = projectName
   }
   async getProjectInfo(): Promise<Project | null> {
      if (this.projectInfo === undefined) {
         let params = {
            names: [this.projectName]
         }
         let batchProject = await this.codebuildClient.batchGetProjects(params).promise()
         if (batchProject?.projects?.length === 1) {
            this.projectInfo = batchProject.projects[0]
         }
         else {
            this.projectInfo = null
         }
      }
      return this.projectInfo
   }
}

export { CodebuildProject }
