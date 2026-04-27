package com.smartprint.smartservice.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Users {
    @Id
    Integer id;

    String name;

    String email;

    String password_hash;

    Boolean is_active;

    Boolean is_verified;

    Timestamp created_at;

    Timestamp updated_at;
}
