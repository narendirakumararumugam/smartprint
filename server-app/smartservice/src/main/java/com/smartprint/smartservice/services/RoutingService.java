package com.smartprint.smartservice.services;

import com.graphhopper.GHRequest;
import com.graphhopper.GHResponse;
import com.graphhopper.GraphHopper;
import com.graphhopper.ResponsePath;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
public class RoutingService {
    private final GraphHopper graphHopper;

    public RoutingService(GraphHopper graphHopper){
        this.graphHopper = graphHopper;
    }

    public double calculateDistance(double fromLat, double fromLon, double toLat, double toLon, String profile){
        GHRequest request = new GHRequest(fromLat, fromLon, toLat, toLon).setProfile(profile);

        GHResponse response = graphHopper.route(request);

        ResponsePath path = response.getBest();
        return path.getDistance() / 1000;
    }
}
