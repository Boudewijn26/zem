package org.foundationzero.zem.model.dependent;

import java.io.IOException;
import org.foundationzero.zem.models.coffee.Coffee;
import org.foundationzero.zem.models.coffee.Converter;

public class Main {
    public static void main(String[] args) throws IOException {
        Coffee coffee = Converter.fromJsonString("{ \"usage\": { \"milk\": true, \"sugar\": true } }");
        System.out.println("Milk: " + coffee.getUsage().getMilk().toString());
    }
}
