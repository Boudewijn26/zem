package org.foundationzero.zem.kafka.v1;

import org.apache.kafka.streams.kstream.GlobalKTable;

import java.util.function.Consumer;

import org.foundationzero.zem.models.registration.Person;

public interface PersonReceiver {
 public Consumer<GlobalKTable<String, Person>> personReceiver();
}
