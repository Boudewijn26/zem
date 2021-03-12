package nl.contentisbv.zem.models.shower;

import java.io.IOException;
import java.io.IOException;
import com.fasterxml.jackson.core.*;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.annotation.*;

/**
 * The current usage of the shower
 */
@JsonDeserialize(using = CurrentUsage.Deserializer.class)
@JsonSerialize(using = CurrentUsage.Serializer.class)
public class CurrentUsage {
    public Double doubleValue;
    public Long integerValue;
    public Boolean boolValue;
    public String stringValue;
    public Object[] anythingArrayValue;
    public CurrentUsageClass currentUsageClassValue;

    static class Deserializer extends JsonDeserializer<CurrentUsage> {
        @Override
        public CurrentUsage deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JsonProcessingException {
            CurrentUsage value = new CurrentUsage();
            switch (jsonParser.currentToken()) {
                case VALUE_NULL:
                    break;
                case VALUE_NUMBER_INT:
                    value.integerValue = jsonParser.readValueAs(Long.class);
                    break;
                case VALUE_NUMBER_FLOAT:
                    value.doubleValue = jsonParser.readValueAs(Double.class);
                    break;
                case VALUE_TRUE:
                case VALUE_FALSE:
                    value.boolValue = jsonParser.readValueAs(Boolean.class);
                    break;
                case VALUE_STRING:
                    String string = jsonParser.readValueAs(String.class);
                    value.stringValue = string;
                    break;
                case START_ARRAY:
                    value.anythingArrayValue = jsonParser.readValueAs(Object[].class);
                    break;
                case START_OBJECT:
                    value.currentUsageClassValue = jsonParser.readValueAs(CurrentUsageClass.class);
                    break;
                default: throw new IOException("Cannot deserialize CurrentUsage");
            }
            return value;
        }
    }

    static class Serializer extends JsonSerializer<CurrentUsage> {
        @Override
        public void serialize(CurrentUsage obj, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
            if (obj.doubleValue != null) {
                jsonGenerator.writeObject(obj.doubleValue);
                return;
            }
            if (obj.integerValue != null) {
                jsonGenerator.writeObject(obj.integerValue);
                return;
            }
            if (obj.boolValue != null) {
                jsonGenerator.writeObject(obj.boolValue);
                return;
            }
            if (obj.stringValue != null) {
                jsonGenerator.writeObject(obj.stringValue);
                return;
            }
            if (obj.anythingArrayValue != null) {
                jsonGenerator.writeObject(obj.anythingArrayValue);
                return;
            }
            if (obj.currentUsageClassValue != null) {
                jsonGenerator.writeObject(obj.currentUsageClassValue);
                return;
            }
            jsonGenerator.writeNull();
        }
    }
}
