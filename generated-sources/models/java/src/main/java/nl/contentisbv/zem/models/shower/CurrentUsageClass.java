package nl.contentisbv.zem.models.shower;

import com.fasterxml.jackson.annotation.*;

public class CurrentUsageClass {
    private UsageElement currentUsage;

    @JsonProperty("current_usage")
    public UsageElement getCurrentUsage() { return currentUsage; }
    @JsonProperty("current_usage")
    public void setCurrentUsage(UsageElement value) { this.currentUsage = value; }
}
