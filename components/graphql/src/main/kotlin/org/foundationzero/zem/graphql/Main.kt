package org.foundationzero.zem.graphql

import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.GlobalKTable
import org.apache.kafka.streams.kstream.KStream
import org.apache.kafka.streams.kstream.Materialized
import org.apache.kafka.streams.state.KeyValueBytesStoreSupplier
import org.apache.kafka.streams.state.StoreBuilder
import org.apache.kafka.streams.state.Stores
import org.foundationzero.zem.models.registration.Person
import org.foundationzero.zem.kafka.v1.PersonReceiver
import java.util.function.Consumer
import org.springframework.context.annotation.Bean
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.kafka.config.KafkaStreamsInfrastructureCustomizer
import org.springframework.kafka.config.StreamsBuilderFactoryBeanCustomizer
import org.springframework.kafka.support.serializer.JsonSerde
import reactor.core.publisher.Sinks

@SpringBootApplication
class Bridge : PersonReceiver {
  private val sink = Sinks.many().multicast().directBestEffort<Person>()

  @Bean
  override fun personReceiver(): Consumer<GlobalKTable<String, Person>> {
    return Consumer { null }
  }

  @Bean
  fun personStreamReceiver(): Consumer<KStream<String, Person>> {
    return Consumer { stream -> stream.foreach { _, person -> sink.tryEmitNext(person) } }
  }

  @Bean
  fun hooks() = Hooks()

  @Bean
  fun personStream() = sink

//
//  @Bean
//  fun personStoreBuilder(): StoreBuilder<ReactiveWrapKeyValueStore<String, Person>> {
//    return ReactiveWrapBuilder(Stores.keyValueStoreBuilder(Stores.persistentKeyValueStore("person-store"), Serdes.String(), JsonSerde()))
//  }

//  @Bean
//  fun customizer(): StreamsBuilderFactoryBeanCustomizer {
//    return StreamsBuilderFactoryBeanCustomizer {
//      streamsBuilderFactoryBeanCustomizer -> streamsBuilderFactoryBeanCustomizer.setInfrastructureCustomizer(InfrastructureCustomizer())
//    }
//  }
}

fun main(args: Array<String>) {
  runApplication<Bridge>(*args)
}
