package org.foundationzero.zem.models.coffee;

import com.fasterxml.jackson.annotation.*;

public class Coffee {
    private Usage usage;

    @JsonProperty("usage")
    public Usage getUsage() { return usage; }
    @JsonProperty("usage")
    public void setUsage(Usage value) { this.usage = value; }
}
