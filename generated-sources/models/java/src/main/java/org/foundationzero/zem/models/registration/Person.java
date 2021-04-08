package org.foundationzero.zem.models.registration;

import com.fasterxml.jackson.annotation.*;

public class Person {
    private Address address;
    private String birthDate;
    private String firstName;
    private String lastName;

    /**
     * Address
     */
    @JsonProperty("address")
    public Address getAddress() { return address; }
    @JsonProperty("address")
    public void setAddress(Address value) { this.address = value; }

    /**
     * Birth day
     */
    @JsonProperty("birth_date")
    public String getBirthDate() { return birthDate; }
    @JsonProperty("birth_date")
    public void setBirthDate(String value) { this.birthDate = value; }

    /**
     * First name
     */
    @JsonProperty("first_name")
    public String getFirstName() { return firstName; }
    @JsonProperty("first_name")
    public void setFirstName(String value) { this.firstName = value; }

    /**
     * Last name
     */
    @JsonProperty("last_name")
    public String getLastName() { return lastName; }
    @JsonProperty("last_name")
    public void setLastName(String value) { this.lastName = value; }
}
