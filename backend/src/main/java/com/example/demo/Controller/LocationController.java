package com.example.demo.Controller;

import com.example.demo.Model.LocationMessage;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class LocationController {

    @MessageMapping("/location.update/{roomId}")
    @SendTo("/topic/location/{roomId}")
    public LocationMessage updateLocation(LocationMessage locationMessage) {
        log.info("Received location update: {}", locationMessage);
        return locationMessage;
    }
}
