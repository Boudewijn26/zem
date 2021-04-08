package org.foundationzero.zem.model.dependent;

import java.io.IOException;
import org.apache.kafka.streams.kstream.KStream;
import org.foundationzero.zem.models.coffee.Coffee;
import org.foundationzero.zem.models.registration.Person;
import org.foundationzero.zem.models.coffee.Converter;
import org.foundationzero.zem.kafka.v1.RegisterPerson;
import java.util.function.Function;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.SpringApplication;

@SpringBootApplication
public class Main implements RegisterPerson {
    public static void main(String[] args) {
      SpringApplication.run(Main.class, args);
    }

    @Bean
    @Override
    public Function<KStream<String, Person>, KStream<String, Person>> registerPerson() {
      return (input) -> input.mapValues((a) -> {
        return a;
      });
    }
}
