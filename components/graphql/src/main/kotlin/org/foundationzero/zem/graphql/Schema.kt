package org.foundationzero.zem.graphql

import com.expediagroup.graphql.server.operations.Query
import com.expediagroup.graphql.server.operations.Subscription
import org.apache.kafka.streams.state.QueryableStoreTypes
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore
import org.foundationzero.zem.models.registration.Person
import org.springframework.stereotype.Component
import reactor.core.publisher.Flux
import java.time.OffsetDateTime

fun <T> kafkaFeed(store: String, updatedGetter: (record: T) -> OffsetDateTime): (context: Context, updatedAt: OffsetDateTime?, limit: Int) -> List<T> {
  return { context: Context, updatedAt: OffsetDateTime?, limit: Int ->
    val store = context.queryService.getQueryableStore<ReadOnlyKeyValueStore<String, T>>(store, QueryableStoreTypes.keyValueStore());
    store.all().asSequence().map { entry -> entry.value }.filter { record -> updatedAt == null || updatedGetter(record).isAfter(updatedAt) }.sortedBy(updatedGetter).take(limit).toList()
  }
}

@Component
class PersonQuery : Query {
  fun feedPersons(context: Context, updatedAt: OffsetDateTime?, limit: Int): List<Person> = kafkaFeed<Person>("person-store") { person -> person.updatedAt }(context, updatedAt, limit)
}

@Component
class PersonSubscription: Subscription {
  fun changedPerson(context: SubscriptionContext?): Flux<Person?> {
    return context?.personStream?.asFlux() ?: Flux.just(null)
  }
}
