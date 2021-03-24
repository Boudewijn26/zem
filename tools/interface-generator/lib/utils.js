import _ from "lodash";

export function getPayloadClass(pubOrSub) {
  if (pubOrSub) {
    if (pubOrSub.hasMultipleMessages()) {
      return '?';
    } else {
      const message = pubOrSub.message();
      if (message) {
        const payload = message.payload();

        if (payload) {
          const [last] = payload.ext('x-generated-model').split("/").reverse();
          return last;
        }
      }
    }
  }

  return null;
}

export function getPayloadImport(op) {
  if (op) {
    if (op.hasMultipleMessages()) {
      return null;
    } else {
      const message = op.message();
      if (message) {
        const payload = message.payload();

        if (payload) {
          return payload.ext('x-generated-model').replace(/\//g, ".");
        }
      }
    }
  }

  return null;
}

export function javaPackage({ asyncapi, params }) {
  return `${params.javaPackage || asyncapi.info().extensions()["x-java-package"]}.${asyncapi.info().version()}`;
}

export function javaPath(options) {
  return `src/main/java/${javaPackage(options).replace(/\./g, "/")}`;
}
