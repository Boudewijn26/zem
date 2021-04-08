package org.foundationzero.zem.models.registration;

import com.fasterxml.jackson.annotation.*;

/**
 * Address
 */
public class Address {
    private String additional;
    private String city;
    private String country;
    private Long number;
    private String street;

    /**
     * Additional information house number
     */
    @JsonProperty("Additional")
    public String getAdditional() { return additional; }
    @JsonProperty("Additional")
    public void setAdditional(String value) { this.additional = value; }

    /**
     * City
     */
    @JsonProperty("City")
    public String getCity() { return city; }
    @JsonProperty("City")
    public void setCity(String value) { this.city = value; }

    /**
     * Country
     */
    @JsonProperty("Country")
    public String getCountry() { return country; }
    @JsonProperty("Country")
    public void setCountry(String value) { this.country = value; }

    /**
     * House number
     */
    @JsonProperty("Number")
    public Long getNumber() { return number; }
    @JsonProperty("Number")
    public void setNumber(Long value) { this.number = value; }

    /**
     * Street name
     */
    @JsonProperty("street")
    public String getStreet() { return street; }
    @JsonProperty("street")
    public void setStreet(String value) { this.street = value; }
}
