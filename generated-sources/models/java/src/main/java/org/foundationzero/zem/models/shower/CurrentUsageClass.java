package org.foundationzero.zem.models.shower;

import com.fasterxml.jackson.annotation.*;

public class CurrentUsageClass {
    private Usage currentUsage;

    @JsonProperty("current_usage")
    public Usage getCurrentUsage() { return currentUsage; }
    @JsonProperty("current_usage")
    public void setCurrentUsage(Usage value) { this.currentUsage = value; }
}
