import _ from "lodash";
import { getPayloadClass, getPayloadImport } from "./utils";

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
        return `public Consumer<KStream<String, ${getPayloadClass(subscribes[0])}>> ${this.name}();`;
      } else if (subscribes.length === 2) {
        return `public BiConsumer<KStream<String, ${getPayloadClass(subscribes[0])}>, KStream<String, ${getPayloadClass(subscribes[1])}> ${this.name}();`;
      }
    } else if (publishes.length === 1) {
      if (subscribes.length === 1) {
        return `public Function<KStream<String, ${getPayloadClass(subscribes[0])}>, KStream<String, ${getPayloadClass(publishes[0])}>> ${this.name}();`;
      } else if (subscribes.length === 2) {
        return `public BiFunction<KStream<String, ${getPayloadClass(subscribes[0])}>, KStream<String, ${getPayloadClass(subscribes[1])}>, KStream<String, ${getPayloadClass(publishes[0])}>> ${this.name}();`;
      }
    } else {
      const [firstPublishType, secondPublishType = null] = _.uniq(publishes.map((publish) => getPayloadClass(publish)));
      const publishType = secondPublishType === null ? firstPublishType : "?";
      if (subscribes.length === 1) {
        return `public Function<KStream<String, ${getPayloadClass(subscribes[0])}>, KStream<String, ${publishType}>> ${this.name};`;
      } else if (subscribes.length === 2) {
        return `public BiFunction<KStream<String, ${getPayloadClass(subscribes[0])}>, KStream<String, ${getPayloadClass(subscribes[1])}>, KStream<String, ${publishType}>> ${this.name}();`;
      } else {
        const [front, back] = subscribes.reduce(([front, back], subscribe) => [`${front}Function<KStream<String, ${getPayloadClass(subscribe)}>,`, `>${back}`], ["", ""]);
        return `public ${front}, KStream<String, ${publishType}>${back} ${this.name}();`;
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

