package com.smartprint.smartservice.configs;

import com.graphhopper.GraphHopper;
import com.graphhopper.GraphHopperConfig;
import com.graphhopper.config.CHProfile;
import com.graphhopper.config.Profile;
import com.graphhopper.json.Statement;
import com.graphhopper.util.CustomModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

import static com.graphhopper.json.Statement.If;
import static com.graphhopper.json.Statement.Op.LIMIT;
import static com.graphhopper.json.Statement.Op.MULTIPLY;

@Configuration
public class GraphHopperConfiguration {
    @Value("${graphhopper.osm-file}")
    private String osmFile;

    @Value("${graphhopper.graph-folder}")
    private String graphFolder;

    @Bean
    public GraphHopper graphHopper(){
        GraphHopperConfig graphHopperConfig = new GraphHopperConfig();

        graphHopperConfig.putObject("datareader.file", osmFile);
        graphHopperConfig.putObject("graph.location", graphFolder);
        graphHopperConfig.putObject("import.osm.ignored_highways", "abandoned, construction, planned, proposed");
        graphHopperConfig.putObject("graph.encoded_values", "road_access,road_class,surface,car_access,car_average_speed,bike_access,bike_average_speed,foot_access,foot_average_speed");

        // 1. CAR PROFILE
        CustomModel carModel = new CustomModel();
        carModel.addToSpeed(If("true", LIMIT, "100"));
        carModel.addToPriority(If("road_access == DESTINATION", MULTIPLY, "0.1"));

        // 2. BIKE PROFILE
        CustomModel bikeModel = new CustomModel();
        bikeModel.addToSpeed(If("true", LIMIT, "18"));
        // Discourage pushing bike on steps
        bikeModel.addToPriority(If("road_class == STEPS", MULTIPLY, "0.2"));

        // 3. WALK PROFILE
        CustomModel walkModel = new CustomModel();
        walkModel.addToSpeed(If("true", LIMIT, "5"));
        // Walkers can go both ways on one-way streets usually, handled by "foot" vehicle

        graphHopperConfig.setProfiles(List.of(
                new Profile("car").setWeighting("custom").setCustomModel(carModel),
                new Profile("bike").setWeighting("custom").setCustomModel(bikeModel),
                new Profile("walk").setWeighting("custom").setCustomModel(walkModel)
        ));

        // Enable CH for all to keep queries fast
        graphHopperConfig.setCHProfiles(List.of(
                new CHProfile("car"),
                new CHProfile("bike"),
                new CHProfile("walk")
        ));

        GraphHopper hopper = new GraphHopper();
        hopper.init(graphHopperConfig);
        hopper.importOrLoad();

        return hopper;
    }
}
