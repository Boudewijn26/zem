package nl.contentisbv.shower;

import com.fasterxml.jackson.annotation.*;

public class Usage {
    private Unit unit;
    private Double usage;

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
    public Double getUsage() { return usage; }
    @JsonProperty("usage")
    public void setUsage(Double value) { this.usage = value; }
}
