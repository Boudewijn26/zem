package org.foundationzero.zem.model.dependent;

import java.io.IOException;
import org.apache.kafka.streams.kstream.KStream;
import org.foundationzero.zem.models.coffee.Coffee;
import org.foundationzero.zem.models.coffee.Converter;
import org.foundationzero.zem.kafka.v1.ProcessLight;
import java.util.function.BiFunction;

public class Main implements ProcessLight {
    public static void main(String[] args) throws IOException {
        Coffee coffee = Converter.fromJsonString("{ \"usage\": { \"milk\": true, \"sugar\": true } }");
        System.out.println("Milk: " + coffee.getUsage().getMilk().toString());
    }

    @Override
    public BiFunction<KStream<String, Coffee>, KStream<String, Coffee>, KStream<String, Coffee>> processLight() {
      return null;
    }
}
