import { Test, SuccessFulTest, TestResult } from "../"
import { CodebuildProject } from '../resources/Codebuild'
import { CatchError, CatchTestError, TestError } from "../errors";
import { ProjectConfig } from "../types/Codebuild";
import { MisconfiguredCodebuildProjectArtifacts, MisconfiguredCodebuildProjectEnvironment, MisconfiguredCodebuildProjectSource, NoCodebuildProjectFound } from "../errors/Codebuild";

class CodebuildProjectConfig extends Test {
   projectConfig: ProjectConfig
   project: CodebuildProject
   constructor(codebuildProject: CodebuildProject, projectConfig: ProjectConfig, order?: number) {
      super(CodebuildProjectConfig.name, order)
      this.projectConfig = projectConfig
      this.project = codebuildProject
   }
   async checkProjectConfiguration() {
      let projectInfo = await this.project.getProjectInfo()
      if (projectInfo === null) {
         throw new NoCodebuildProjectFound(this.project.projectName)
      }
      const artifactTypeFails = projectInfo.artifacts?.type !== this.projectConfig.artifact?.type
      const artifactLocationFails = projectInfo.artifacts?.location !== this.projectConfig.artifact?.location
      const artifactNameFails = projectInfo.artifacts?.name !== this.projectConfig.artifact?.name
      const artifactPathFails = this.projectConfig.artifact?.path !== undefined && projectInfo.artifacts?.path !== this.projectConfig.artifact?.path
      const artifactPackagingFails = this.projectConfig.artifact?.packaging !== undefined && projectInfo.artifacts?.packaging !== this.projectConfig.artifact?.packaging
      if( artifactTypeFails || artifactLocationFails || artifactNameFails || artifactPathFails || artifactPackagingFails ) {
         throw new MisconfiguredCodebuildProjectArtifacts(projectInfo.artifacts, this.projectConfig.artifact)
      }
      if (projectInfo.environment?.type !== this.projectConfig.environment?.type) {
         throw new MisconfiguredCodebuildProjectEnvironment(projectInfo.environment, this.projectConfig.environment)
      }
      if (
         projectInfo.source?.type !== this.projectConfig.source?.type ||
         projectInfo.source?.location !== this.projectConfig.source?.location         
      ) {
         throw new MisconfiguredCodebuildProjectSource(projectInfo.source, this.projectConfig.source)
      }

   }
   @CatchTestError(CodebuildProject.name)
   async run():Promise<TestResult> {
      await this.checkProjectConfiguration()
      return SuccessFulTest(this.id)
   }
}