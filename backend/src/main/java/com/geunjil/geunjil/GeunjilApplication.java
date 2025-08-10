package com.geunjil.geunjil;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GeunjilApplication {

	public static void main(String[] args) {
		SpringApplication.run(GeunjilApplication.class, args);
	}

}
