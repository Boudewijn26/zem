package org.foundationzero.zem.models.registration;

import com.fasterxml.jackson.annotation.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;

public class Person {
    private Address address;
    private LocalDate birthDate;
    private String firstName;
    private String id;
    private boolean isDeleted;
    private String lastName;
    private OffsetDateTime updatedAt;

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
    @JsonProperty("birthDate")
    public LocalDate getBirthDate() { return birthDate; }
    @JsonProperty("birthDate")
    public void setBirthDate(LocalDate value) { this.birthDate = value; }

    /**
     * First name
     */
    @JsonProperty("firstName")
    public String getFirstName() { return firstName; }
    @JsonProperty("firstName")
    public void setFirstName(String value) { this.firstName = value; }

    /**
     * Id
     */
    @JsonProperty("id")
    public String getID() { return id; }
    @JsonProperty("id")
    public void setID(String value) { this.id = value; }

    /**
     * Whether the record is deleted
     */
    @JsonProperty("isDeleted")
    public boolean getIsDeleted() { return isDeleted; }
    @JsonProperty("isDeleted")
    public void setIsDeleted(boolean value) { this.isDeleted = value; }

    /**
     * Last name
     */
    @JsonProperty("lastName")
    public String getLastName() { return lastName; }
    @JsonProperty("lastName")
    public void setLastName(String value) { this.lastName = value; }

    /**
     * Last update
     */
    @JsonProperty("updatedAt")
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    @JsonProperty("updatedAt")
    public void setUpdatedAt(OffsetDateTime value) { this.updatedAt = value; }
}
