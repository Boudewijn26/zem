package org.foundationzero.zem.models.shower;

import com.fasterxml.jackson.annotation.*;

/**
 * The predicted usage of the shower
 */
public class PredictedUsage {
    private Usage[] usages;

    @JsonProperty("usages")
    public Usage[] getUsages() { return usages; }
    @JsonProperty("usages")
    public void setUsages(Usage[] value) { this.usages = value; }
}
