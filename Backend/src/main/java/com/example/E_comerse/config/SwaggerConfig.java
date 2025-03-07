package com.example.E_comerse.config;


import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

        @Bean
        public OpenAPI customOpenAPI(){
            return new OpenAPI().info(new Info().title("Todolist API").version("1.0.0"));
        }
    }

