// To use this code, add the following Maven dependency to your project:
//
//
//     com.fasterxml.jackson.core     : jackson-databind          : 2.9.0
//     com.fasterxml.jackson.datatype : jackson-datatype-jsr310   : 2.9.0
//
// Import this package:
//
//     import org.foundationzero.zem.models.shower.Converter;
//
// Then you can deserialize a JSON string with
//
//     CurrentUsage data = Converter.CurrentUsageFromJsonString(jsonString);
//     PredictedUsage data = Converter.PredictedUsageFromJsonString(jsonString);

package org.foundationzero.zem.models.shower;

import java.io.IOException;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import java.util.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.OffsetTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;

public class Converter {
    // Date-time helpers

    private static final DateTimeFormatter DATE_TIME_FORMATTER = new DateTimeFormatterBuilder()
            .appendOptional(DateTimeFormatter.ISO_DATE_TIME)
            .appendOptional(DateTimeFormatter.ISO_OFFSET_DATE_TIME)
            .appendOptional(DateTimeFormatter.ISO_INSTANT)
            .appendOptional(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SX"))
            .appendOptional(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ssX"))
            .appendOptional(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
            .toFormatter()
            .withZone(ZoneOffset.UTC);

    public static OffsetDateTime parseDateTimeString(String str) {
        return ZonedDateTime.from(Converter.DATE_TIME_FORMATTER.parse(str)).toOffsetDateTime();
    }

    private static final DateTimeFormatter TIME_FORMATTER = new DateTimeFormatterBuilder()
            .appendOptional(DateTimeFormatter.ISO_TIME)
            .appendOptional(DateTimeFormatter.ISO_OFFSET_TIME)
            .parseDefaulting(ChronoField.YEAR, 2020)
            .parseDefaulting(ChronoField.MONTH_OF_YEAR, 1)
            .parseDefaulting(ChronoField.DAY_OF_MONTH, 1)
            .toFormatter()
            .withZone(ZoneOffset.UTC);

    public static OffsetTime parseTimeString(String str) {
        return ZonedDateTime.from(Converter.TIME_FORMATTER.parse(str)).toOffsetDateTime().toOffsetTime();
    }
    // Serialize/deserialize helpers

    public static CurrentUsage CurrentUsageFromJsonString(String json) throws IOException {
        return getCurrentUsageObjectReader().readValue(json);
    }

    public static String CurrentUsageToJsonString(CurrentUsage obj) throws JsonProcessingException {
        return getCurrentUsageObjectWriter().writeValueAsString(obj);
    }

    public static PredictedUsage PredictedUsageFromJsonString(String json) throws IOException {
        return getPredictedUsageObjectReader().readValue(json);
    }

    public static String PredictedUsageToJsonString(PredictedUsage obj) throws JsonProcessingException {
        return getPredictedUsageObjectWriter().writeValueAsString(obj);
    }

    private static ObjectReader CurrentUsageReader;
    private static ObjectWriter CurrentUsageWriter;

    private static void instantiateCurrentUsageMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.findAndRegisterModules();
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        SimpleModule module = new SimpleModule();
        module.addDeserializer(OffsetDateTime.class, new JsonDeserializer<OffsetDateTime>() {
            @Override
            public OffsetDateTime deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JsonProcessingException {
                String value = jsonParser.getText();
                return Converter.parseDateTimeString(value);
            }
        });
        mapper.registerModule(module);
        CurrentUsageReader = mapper.readerFor(CurrentUsage.class);
        CurrentUsageWriter = mapper.writerFor(CurrentUsage.class);
    }

    private static ObjectReader getCurrentUsageObjectReader() {
        if (CurrentUsageReader == null) instantiateCurrentUsageMapper();
        return CurrentUsageReader;
    }

    private static ObjectWriter getCurrentUsageObjectWriter() {
        if (CurrentUsageWriter == null) instantiateCurrentUsageMapper();
        return CurrentUsageWriter;
    }

    private static ObjectReader PredictedUsageReader;
    private static ObjectWriter PredictedUsageWriter;

    private static void instantiatePredictedUsageMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.findAndRegisterModules();
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        SimpleModule module = new SimpleModule();
        module.addDeserializer(OffsetDateTime.class, new JsonDeserializer<OffsetDateTime>() {
            @Override
            public OffsetDateTime deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JsonProcessingException {
                String value = jsonParser.getText();
                return Converter.parseDateTimeString(value);
            }
        });
        mapper.registerModule(module);
        PredictedUsageReader = mapper.readerFor(PredictedUsage.class);
        PredictedUsageWriter = mapper.writerFor(PredictedUsage.class);
    }

    private static ObjectReader getPredictedUsageObjectReader() {
        if (PredictedUsageReader == null) instantiatePredictedUsageMapper();
        return PredictedUsageReader;
    }

    private static ObjectWriter getPredictedUsageObjectWriter() {
        if (PredictedUsageWriter == null) instantiatePredictedUsageMapper();
        return PredictedUsageWriter;
    }
}
