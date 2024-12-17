import path from "node:path";

const projectRootPath = (() => {
  const projectRoot = process.env.PROJECT_ROOT;
  if (!projectRoot) {
    throw new Error("PROJECT_ROOT is not given");
  }

  return projectRoot;
})();

export const paths = (() => {
  const paths = {
    stope_api_server: path.join(projectRootPath, "source/stope_api_server"),
    stope_batch_processor: path.join(
      projectRootPath,
      "source/stope_batch_processor"
    ),
    stope_web_app: path.join(projectRootPath, "source/stope_web_app"),
    ui: path.join(projectRootPath, "source/ui"),
    stope_user_proof: path.join(projectRootPath, "source/stope_user_proof"),
    stope_bridge_proof: path.join(projectRootPath, "source/stope_bridge_proof"),
  };

  console.log("Loaded paths: %j", paths);

  return paths;
})();
