package nl.contentisbv.zem.model.dependent;

import java.io.IOException;
import nl.contentisbv.zem.models.coffee.Coffee;
import nl.contentisbv.zem.models.coffee.Converter;

public class Main {
    public static void main(String[] args) throws IOException {
        Coffee coffee = Converter.fromJsonString("{ \"usage\": { \"milk\": true, \"sugar\": true } }");
        System.out.println("Milk: " + coffee.getUsage().getMilk().toString());
    }
}
