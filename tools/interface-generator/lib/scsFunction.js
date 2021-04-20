import _ from "lodash";
import { getPayloadClass, getPayloadImport } from "./utils";

function getReceiveType(operation) {
  return operation.ext("x-scs-receive-type") ?? "KStream";
}

export default class SCSFunction {
  constructor(name, channels) {
    this.name = name;
    this.channels = channels.map(([,channel]) => channel);
  }

  get publishBindingName() {
    return `${this.name  }-out-0`;
  }

  get subscribeBindingName() {
    return `${this.name  }-in-0`;
  }

  get returnType() {
    const publishes = this.publishes;
    const subscribes = this.subscribes;
    if (publishes.length === 0) {
      if (subscribes.length === 1) {
        return "Consumer";
      } else if (subscribes.length === 2) {
        return "BiConsumer";
      }
    } else {
      if (subscribes.length === 2) {
        return "BiFunction";
      } else {
        return "Function";
      }
    }
  }

  get receiveTypes() {
    return _.uniq([...this.publishes, ...this.subscribes].map(getReceiveType));
  }

  get publishes() {
    return this.channels.filter((channel) => channel.hasPublish()).map((channel) => channel.publish());
  }

  get subscribes() {
    return this.channels.filter((channel) => channel.hasSubscribe()).map((channel) => channel.subscribe());
  }

  get functionSignature() {
    const publishes = this.publishes;
    const subscribes = this.subscribes;
    if (publishes.length === 0) {
      if (subscribes.length === 1) {
        return `public Consumer<${getReceiveType(subscribes[0])}<String, ${getPayloadClass(subscribes[0])}>> ${this.name}();`;
      } else if (subscribes.length === 2) {
        return `public BiConsumer<${getReceiveType(subscribes[0])}<String, ${getPayloadClass(subscribes[0])}>, KStream<${getReceiveType(subscribes[1])}, ${getPayloadClass(subscribes[1])}> ${this.name}();`;
      }
    } else if (publishes.length === 1) {
      if (subscribes.length === 1) {
        return `public Function<${getReceiveType(subscribes[0])}<String, ${getPayloadClass(subscribes[0])}>, ${getReceiveType(publishes[0])}<String, ${getPayloadClass(publishes[0])}>> ${this.name}();`;
      } else if (subscribes.length === 2) {
        return `public BiFunction<${getReceiveType(subscribes[0])}<String, ${getPayloadClass(subscribes[0])}>, ${getReceiveType(subscribes[1])}<String, ${getPayloadClass(subscribes[1])}>, ${getReceiveType(publishes[0])}<String, ${getPayloadClass(publishes[0])}>> ${this.name}();`;
      }
    } else {
      const [firstPublishType, secondPublishType = null] = _.uniq(publishes.map((publish) => getPayloadClass(publish)));
      const publishType = secondPublishType === null ? firstPublishType : "?";
      const [firstPublishReceiveType, secondPublishReceiveType = null] = _.uniq(publishes.map((publish) => getReceiveType(publish)));
      const publishReceiveType = secondPublishReceiveType === null ? firstPublishReceiveType : "KStream";
      if (subscribes.length === 1) {
        return `public Function<${getReceiveType(subscribes[0])}<String, ${getPayloadClass(subscribes[0])}>, ${publishReceiveType}<String, ${publishType}>> ${this.name};`;
      } else if (subscribes.length === 2) {
        return `public BiFunction<${getReceiveType(subscribes[0])}<String, ${getPayloadClass(subscribes[0])}>, ${getReceiveType(subscribes[0])}<String, ${getPayloadClass(subscribes[1])}>, ${publishReceiveType}<String, ${publishType}>> ${this.name}();`;
      } else {
        const [front, back] = subscribes.reduce(([front, back], subscribe) => [`${front}Function<${getReceiveType(subscribe)}<String, ${getPayloadClass(subscribe)}>,`, `>${back}`], ["", ""]);
        return `public ${front}, ${publishReceiveType}<String, ${publishType}>${back} ${this.name}();`;
      }
    }
  }

  get payloadImports() {
    return _.uniq([...this.subscribes, ...this.publishes].map((op) => getPayloadImport(op)));
  }

  get isPublisher() {
    return this.type === 'function' || this.type === 'supplier';
  }

  get isSubscriber() {
    return this.type === 'function' || this.type === 'consumer';
  }
}

