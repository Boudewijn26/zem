/// <reference types="node" />
import { mkdirSync } from "fs";
import { join } from "path";

// I couldn't find a way to use lib/utils here without breaking the react render
function javaPackage({ asyncapi, params }) {
  return `${params.javaPackage || asyncapi.info().extensions()["x-java-package"]}.${asyncapi.info().version()}`;
}

function javaPath(options) {
  return `src/main/java/${javaPackage(options).replace(/\./g, "/")}`;
}

export default {
  "generate:before": ({ asyncapi, targetDir, templateParams }) => {
    const path = join(targetDir, javaPath({ asyncapi, params: templateParams }));
    mkdirSync(path, { recursive: true });
  }
};
