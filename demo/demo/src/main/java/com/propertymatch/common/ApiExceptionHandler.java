
package com.propertymatch.common;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.security.authentication.BadCredentialsException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {
        @ExceptionHandler(BadCredentialsException.class)
public ResponseEntity<Map<String, Object>> handleBadCredentials(
        BadCredentialsException ex) {

    Map<String, Object> body = new LinkedHashMap<>();
    body.put("error", "Invalid email or password");

    return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(body);
}
    @ExceptionHandler(ResponseStatusException.class)
public ResponseEntity<Map<String, String>> handleResponseStatus(
        ResponseStatusException ex) {

    Map<String, String> body = new LinkedHashMap<>();
    body.put("error", ex.getReason() != null
            ? ex.getReason()
            : "Request failed");

    return ResponseEntity.status(ex.getStatusCode()).body(body);
}

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> validationError(
            MethodArgumentNotValidException ex) {

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", "Validation failed");
        body.put("details", ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": "
                        + error.getDefaultMessage())
                .toList());

        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> generalError(
            Exception ex) {

        // Log the actual exception for debugging on the server.
        ex.printStackTrace();

        Map<String, String> body = new LinkedHashMap<>();
        body.put("error", "Internal server error");

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(body);
    }
}
