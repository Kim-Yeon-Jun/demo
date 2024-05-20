package com.example.demo.Model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LocationMessage {
    private String userName;
    private double latitude;
    private double longitude;

    @Override
    public String toString() {
        return "LocationMessage{" +
                "userName='" + userName + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                '}';
    }
}
