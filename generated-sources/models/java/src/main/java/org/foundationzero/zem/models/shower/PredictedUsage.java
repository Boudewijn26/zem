package org.foundationzero.zem.models.shower;

import com.fasterxml.jackson.annotation.*;

/**
 * The predicted usage of the shower
 */
public class PredictedUsage {
    private UsageElement[] usages;

    @JsonProperty("usages")
    public UsageElement[] getUsages() { return usages; }
    @JsonProperty("usages")
    public void setUsages(UsageElement[] value) { this.usages = value; }
}
