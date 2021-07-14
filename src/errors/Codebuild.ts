import { ProjectSource, Project } from "aws-sdk/clients/codebuild";
import { ErrorDescription } from "./";
import { ProjectConfig } from "../types/Codebuild";

class NoCodebuildProjectFound extends ErrorDescription {
   constructor(projectName: string) {
      super(
         `${projectName} codebuild project was not found`,
         NoCodebuildProjectFound.name
      )
   }
}

class MisconfiguredCodebuildProjectSource extends ErrorDescription {
   constructor(sourceFound: Project["source"], sourceRequested: ProjectConfig["source"]) {
      super(`Incorrect Codebuild Project Source Config \
         [${sourceFound?.type}, ${sourceFound?.location}] found \
         [${sourceRequested?.type}, ${sourceRequested?.location}] requested]`,
         MisconfiguredCodebuildProjectSource.name)
   }
}

class MisconfiguredCodebuildProjectArtifacts extends ErrorDescription {
   constructor(artifactFound: Project["artifacts"], artifactRequested: ProjectConfig["artifact"]) {
      super(`Incorrect Codebuild Project Artifact Config \
         [${artifactFound?.type}, ${artifactFound?.location}, ${artifactFound?.name}, ${artifactFound?.path}, ${artifactFound?.packaging}] found \
         [${artifactRequested?.type}, ${artifactRequested?.location}, ${artifactRequested?.name}, ${artifactRequested?.path || ""}, ${artifactRequested?.packaging || "ZIP"}] requested]`,
         MisconfiguredCodebuildProjectArtifacts.name)
   }   
}

class MisconfiguredCodebuildProjectEnvironment extends ErrorDescription {
   constructor(environmentFound: Project["environment"], environmentRequested: ProjectConfig["environment"]) {
      super(`Incorrect Codebuild Project Artifact Config \
         [${environmentFound?.type}] found \
         [${environmentRequested?.type}] requested]`,
         MisconfiguredCodebuildProjectEnvironment.name)
   }   
}

export {
   NoCodebuildProjectFound,
   MisconfiguredCodebuildProjectSource,
   MisconfiguredCodebuildProjectArtifacts,
   MisconfiguredCodebuildProjectEnvironment
}
