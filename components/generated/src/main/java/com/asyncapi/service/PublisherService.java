package com.asyncapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import com.asyncapi.model.LightMeasuredPayload;
    

@Service
public class PublisherService {

    @Autowired
    private KafkaTemplate<Integer, Object> kafkaTemplate;
 
    
    public void updateLightMeasurement(Integer key, LightMeasuredPayload lightMeasuredPayload) {
        Message<LightMeasuredPayload> message = MessageBuilder.withPayload(lightMeasuredPayload)
                .setHeader(KafkaHeaders.TOPIC, "event.lighting.measured")
                .setHeader(KafkaHeaders.MESSAGE_KEY, key)
                .build();
        kafkaTemplate.send(message);
    }
}
