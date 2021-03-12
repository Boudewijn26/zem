package nl.contentisbv.zem.models.shower;

import com.fasterxml.jackson.annotation.*;

public class UsageUsage {
    private Unit unit;
    private Double value;

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
    @JsonProperty("value")
    public Double getValue() { return value; }
    @JsonProperty("value")
    public void setValue(Double value) { this.value = value; }
}
