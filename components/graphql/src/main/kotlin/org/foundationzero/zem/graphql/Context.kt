package org.foundationzero.zem.graphql

import com.expediagroup.graphql.generator.execution.GraphQLContext
import com.expediagroup.graphql.server.spring.execution.SpringGraphQLContext
import com.expediagroup.graphql.server.spring.execution.SpringGraphQLContextFactory
import com.expediagroup.graphql.server.spring.subscriptions.SpringSubscriptionGraphQLContextFactory
import org.foundationzero.zem.models.registration.Person
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cloud.stream.binder.kafka.streams.InteractiveQueryService
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.reactive.socket.WebSocketSession
import reactor.core.publisher.Sinks

class Context(request: ServerRequest, val queryService: InteractiveQueryService) : SpringGraphQLContext(request);

@Component
class ContextFactory(@Autowired private val queryService: InteractiveQueryService) : SpringGraphQLContextFactory<SpringGraphQLContext>() {

  override suspend fun generateContext(request: ServerRequest): SpringGraphQLContext? {
    return Context(request, queryService)
  }

}

class SubscriptionContext(val personStream: Sinks.Many<Person>) : GraphQLContext;

@Component
class SubscriptionContextFactory(@Autowired private val queryService: InteractiveQueryService, @Autowired private val personStream: Sinks.Many<Person>) : SpringSubscriptionGraphQLContextFactory<SubscriptionContext>() {

  override suspend fun generateContext(request: WebSocketSession): SubscriptionContext? {
    return SubscriptionContext(personStream)
  }

}
