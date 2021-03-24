package org.foundationzero.zem.kafka.v1;

import org.apache.kafka.streams.kstream.KStream;

import java.util.function.BiFunction;

import org.foundationzero.zem.models.coffee.Coffee;

public interface ProcessLight {
 public BiFunction<KStream<String, Coffee>, KStream<String, Coffee>, KStream<String, Coffee>> processLight();
}
