package com.smartprint.smartservice.configs;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex){
        Map<String, String> fieldErrors = new HashMap<>();
        for(FieldError error : ex.getBindingResult().getFieldErrors()){
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }

        return ResponseEntity.badRequest().body(Map.of(
                "timestamp",LocalDateTime.now().toString(),
                "status", "400",
                "error", "Validation failed",
                "details", fieldErrors
        ));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex){
        return ResponseEntity.badRequest().body(Map.of(
                "timestamp",LocalDateTime.now().toString(),
                "status", "400",
                "message", ex.getMessage(),
                "error", "Bad Request"
        ));
    }

    @ExceptionHandler({BadCredentialsException.class, UsernameNotFoundException.class})
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(Exception ex){
        return ResponseEntity.badRequest().body(Map.of(
                "timestamp",LocalDateTime.now().toString(),
                "status", "401",
                "message", "Invalid email or password",
                "error", "Unauthorized"
        ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericError(Exception ex){
        return ResponseEntity.badRequest().body(Map.of(
                "timestamp",LocalDateTime.now().toString(),
                "status", "500",
                "message", "An unexpected error occurred",
                "error", "Internal Server Error"
        ));
    }
}
