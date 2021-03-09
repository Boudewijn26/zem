package nl.contentisbv.shower;

import com.fasterxml.jackson.annotation.*;

/**
 * The predicted usage of the shower
 */
public class Java {
    private Usage usage;
    private Object usages;

    @JsonProperty("usage")
    public Usage getUsage() { return usage; }
    @JsonProperty("usage")
    public void setUsage(Usage value) { this.usage = value; }

    @JsonProperty("usages")
    public Object getUsages() { return usages; }
    @JsonProperty("usages")
    public void setUsages(Object value) { this.usages = value; }
}
