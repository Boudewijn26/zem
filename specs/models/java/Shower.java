package io.quicktype;

import com.fasterxml.jackson.annotation.*;

/**
 * The current usage of the showe
 */
public class Shower {
    private Unit unit;
    private double usage;

    /**
     * The unit in which the usage is expressed
     */
    @JsonProperty("unit")
    public Unit getUnit() { return unit; }
    @JsonProperty("unit")
    public void setUnit(Unit value) { this.unit = value; }

    /**
     * The current usage
     */
    @JsonProperty("usage")
    public double getUsage() { return usage; }
    @JsonProperty("usage")
    public void setUsage(double value) { this.usage = value; }
}
