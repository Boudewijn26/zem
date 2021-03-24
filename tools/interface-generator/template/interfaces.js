import { File, Text } from "@asyncapi/generator-react-sdk";
import ScsFunction from "../lib/scsFunction";
import _ from "lodash";
import ScsLib from "../lib/scsLib";
import { javaPath, javaPackage } from "../lib/utils";
const scsLib = new ScsLib();

function getFunctionName(channelName, operation, isSubscriber) {
  let ret;
  let functionName = operation.ext('x-scs-function-name');

  if (!functionName) {
    functionName = operation.id();
  }

  if (functionName) {
    ret = functionName;
  } else {
    ret = _.camelCase(channelName) + (isSubscriber ? 'Consumer' : 'Supplier');
  }
  return ret;
}

function getFunctionSpecs(asyncapi, params) {
  const info = asyncapi.info();
  const functions = _.groupBy(Object.entries(asyncapi.channels()), ([key, channel]) => getFunctionName(key, scsLib.getRealPublisher(info, params, channel) || scsLib.getRealSubscriber(info, params, channel), false));
  const scsFunctions = Object.entries(functions).map(([name, channels]) => [name, new ScsFunction(name, channels)]);

  return scsFunctions;
}

export default function({ asyncapi, params, originalAsyncAPI }) {
  const functions = getFunctionSpecs(asyncapi, params);

  return functions.map(([name, spec]) => {
    const interfaceName = _.upperFirst(name);
    return (<File name={`${javaPath({ asyncapi, params })}/${interfaceName}.java`}>
      <Text newLines={2}>
        package {javaPackage({ asyncapi, params })};
      </Text>
      <Text newLines={2}>
        import org.apache.kafka.streams.kstream.KStream;
      </Text>
      <Text newLines={2}>
        import java.util.function.{spec.returnType};
      </Text>
      {spec.payloadImports.map((importer) => <Text key={importer}>import org.foundationzero.zem.models.{importer};</Text>)}
      <Text />
      <Text>
        public interface {interfaceName} {"{"}
      </Text>
      <Text indent="4">
        {spec.functionSignature}
      </Text>
      <Text>
        {"}"}
      </Text>
    </File>);
  });
}
