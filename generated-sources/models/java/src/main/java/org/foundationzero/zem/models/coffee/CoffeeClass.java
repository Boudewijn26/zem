package org.foundationzero.zem.models.coffee;

import com.fasterxml.jackson.annotation.*;

public class CoffeeClass {
    private Boolean milk;
    private Boolean sugar;

    /**
     * Do you want milk?
     */
    @JsonProperty("milk")
    public Boolean getMilk() { return milk; }
    @JsonProperty("milk")
    public void setMilk(Boolean value) { this.milk = value; }

    /**
     * Do you want sugar?
     */
    @JsonProperty("sugar")
    public Boolean getSugar() { return sugar; }
    @JsonProperty("sugar")
    public void setSugar(Boolean value) { this.sugar = value; }
}
