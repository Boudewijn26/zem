package org.foundationzero.zem.kafka.v1;

import org.apache.kafka.streams.kstream.KStream;

import java.util.function.Function;

import org.foundationzero.zem.models.registration.Person;

public interface RegisterPerson {
 public Function<KStream<String, Person>, KStream<String, Person>> registerPerson();
}
