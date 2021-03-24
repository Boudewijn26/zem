package org.foundationzero.zem.models.shower;

import com.fasterxml.jackson.annotation.*;

public class UsageElement {
    private UsageUsage usage;

    @JsonProperty("usage")
    public UsageUsage getUsage() { return usage; }
    @JsonProperty("usage")
    public void setUsage(UsageUsage value) { this.usage = value; }
}
