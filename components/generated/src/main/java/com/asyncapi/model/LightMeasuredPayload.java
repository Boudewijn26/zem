package com.asyncapi.model;

import javax.validation.constraints.*;
import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.List;
import java.util.Objects;


public class LightMeasuredPayload {
    
    private @Valid int lumens;
    
    private @Valid java.time.OffsetDateTime sentAt;
    

    

    /**
     * Light intensity measured in lumens.
     */
    @JsonProperty("lumens")
    public int getLumens() {
        return lumens;
    }

    public void setLumens(int lumens) {
        this.lumens = lumens;
    }
    

    /**
     * Date and time when the message was sent.
     */
    @JsonProperty("sentAt")
    public java.time.OffsetDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(java.time.OffsetDateTime sentAt) {
        this.sentAt = sentAt;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        LightMeasuredPayload lightMeasuredPayload = (LightMeasuredPayload) o;
        return 
            Objects.equals(this.lumens, lightMeasuredPayload.lumens) &&
            Objects.equals(this.sentAt, lightMeasuredPayload.sentAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(lumens, sentAt);
    }

    @Override
    public String toString() {
        return "class LightMeasuredPayload {\n" +
        
                "    lumens: " + toIndentedString(lumens) + "\n" +
                "    sentAt: " + toIndentedString(sentAt) + "\n" +
                "}";
    }

    /**
     * Convert the given object to string with each line indented by 4 spaces (except the first line).
     */
    private String toIndentedString(Object o) {
        if (o == null) {
           return "null";
        }
        return o.toString().replace("\n", "\n    ");
    }
}