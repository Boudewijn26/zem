package org.foundationzero.zem.graphql

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.cloud.stream.app.test.integration.junit.jupiter.KafkaStreamAppTest
import org.springframework.http.MediaType
import org.springframework.mock.web.reactive.function.server.MockServerRequest
import org.springframework.test.web.reactive.server.WebTestClient
import reactor.core.publisher.Mono

@SpringBootTest
@AutoConfigureWebTestClient
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@KafkaStreamAppTest()
class SchemaTest(@Autowired private val testClient: WebTestClient) {

    @Test
    fun `returns list of persons`() {
      testClient.post()
        .uri("/graphql")
        .accept(MediaType.APPLICATION_JSON)
        .contentType(MediaType("application", "graphql"))
        .bodyValue("query { feedPersons(limit: 5) { id } }")
        .exchange()
        .expectStatus().isOk
    }
}
