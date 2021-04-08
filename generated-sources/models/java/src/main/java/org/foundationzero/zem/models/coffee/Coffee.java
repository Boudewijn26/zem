package org.foundationzero.zem.models.coffee;

import com.fasterxml.jackson.annotation.*;

public class Coffee {
    private CoffeeClass coffee;

    @JsonProperty("coffee")
    public CoffeeClass getCoffee() { return coffee; }
    @JsonProperty("coffee")
    public void setCoffee(CoffeeClass value) { this.coffee = value; }
}
