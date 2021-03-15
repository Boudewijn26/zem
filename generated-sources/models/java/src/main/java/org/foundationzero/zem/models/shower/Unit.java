package org.foundationzero.zem.models.shower;

import java.io.IOException;
import com.fasterxml.jackson.annotation.*;

/**
 * The unit in which the usage is expressed
 */
public enum Unit {
    JOULES, K_WH;

    @JsonValue
    public String toValue() {
        switch (this) {
            case JOULES: return "Joules";
            case K_WH: return "kWh";
        }
        return null;
    }

    @JsonCreator
    public static Unit forValue(String value) throws IOException {
        if (value.equals("Joules")) return JOULES;
        if (value.equals("kWh")) return K_WH;
        throw new IOException("Cannot deserialize Unit");
    }
}
