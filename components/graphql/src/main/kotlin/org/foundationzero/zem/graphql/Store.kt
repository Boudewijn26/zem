package org.foundationzero.zem.graphql

import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.processor.ProcessorContext
import org.apache.kafka.streams.processor.StateStore
import org.apache.kafka.streams.state.KeyValueIterator
import org.apache.kafka.streams.state.KeyValueStore
import org.apache.kafka.streams.state.StoreBuilder
import org.foundationzero.zem.models.registration.Person
import org.reactivestreams.Publisher
import reactor.core.publisher.EmitterProcessor
import reactor.core.publisher.Sinks

class ReactiveWrapBuilder<K, V>(private val storeBuilder: StoreBuilder<KeyValueStore<K, V>>): StoreBuilder<ReactiveWrapKeyValueStore<K, V>> {
  override fun withCachingEnabled(): StoreBuilder<ReactiveWrapKeyValueStore<K, V>> {
    storeBuilder.withCachingEnabled()
    return this
  }

  override fun withCachingDisabled(): StoreBuilder<ReactiveWrapKeyValueStore<K, V>> {
    storeBuilder.withCachingDisabled()
    return this
  }

  override fun withLoggingEnabled(config: MutableMap<String, String>?): StoreBuilder<ReactiveWrapKeyValueStore<K, V>> {
    storeBuilder.withLoggingEnabled(config)
    return this
  }

  override fun withLoggingDisabled(): StoreBuilder<ReactiveWrapKeyValueStore<K, V>> {
    storeBuilder.withLoggingDisabled()
    return this
  }

  override fun build(): ReactiveWrapKeyValueStore<K, V> = ReactiveWrapKeyValueStore(storeBuilder.build())

  override fun logConfig(): MutableMap<String, String> = storeBuilder.logConfig()
  override fun loggingEnabled(): Boolean = storeBuilder.loggingEnabled()
  override fun name(): String = "wrap-${storeBuilder.name()}"
}

class ReactiveWrapKeyValueStore<K, V>(private val store: KeyValueStore<K, V>): KeyValueStore<K, V> {
  private val sink = Sinks.many().multicast().directBestEffort<V>()
  override fun name(): String = store.name()

  override fun init(context: ProcessorContext?, root: StateStore?) {
    store.init(context, root)
  }

  override fun flush() {
    store.flush()
  }

  override fun close() {
    store.close()
  }

  override fun persistent(): Boolean = store.persistent()
  override fun isOpen(): Boolean = store.isOpen
  override fun get(key: K): V = store.get(key)

  override fun range(from: K, to: K): KeyValueIterator<K, V> = store.range(from, to)

  override fun all(): KeyValueIterator<K, V> = store.all()

  override fun approximateNumEntries(): Long = store.approximateNumEntries()

  override fun put(key: K, value: V) {
    emit(value)
    store.put(key, value)
  }

  override fun putIfAbsent(key: K, value: V): V {
    if (store.get(key) == null) {
      emit(value)
    }
    return store.putIfAbsent(key, value)
  }

  override fun putAll(entries: MutableList<KeyValue<K, V>>?) {
    entries?.forEach { emit(it.value) }
    store.putAll(entries)
  }

  private fun emit(value: V) {
    sink.tryEmitNext(value)
  }

  override fun delete(key: K): V {
    return store.delete(key)
  }

}
