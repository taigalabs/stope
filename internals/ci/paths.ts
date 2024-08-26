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
  };

  console.log("Loaded paths: %j", paths);

  return paths;
})();
