package com.example.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.authorizeHttpRequests((auth)->auth
                .requestMatchers("/","/login","/loginProc","/join","/joinProc").permitAll()
                .requestMatchers("/admin").hasRole("ADMIN")
                .requestMatchers("/my/**").hasAnyRole("ADMIN","USER") //와일드 카드를 이용
                .anyRequest().authenticated() //나머지경로는 모두가 접근 가능 //가장 아래에서 모든 경로에 대한 접근을 설정해야한다.
        );

        http.csrf(auto -> auto.disable());

        http.formLogin(auto->auto.loginPage("/login").loginProcessingUrl("/login").permitAll());

        return http.build();
    }
}
