package com.forcatotal.m1.api.exception;

import com.forcatotal.m1.api.dto.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.stream.Collectors;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiErrorResponse> handleValidation(
      MethodArgumentNotValidException exception,
      HttpServletRequest request) {
    String message = exception.getBindingResult()
        .getFieldErrors()
        .stream()
        .map(this::formatFieldError)
        .collect(Collectors.joining("; "));

    return build(HttpStatus.BAD_REQUEST, message, request);
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ApiErrorResponse> handleInvalidPayload(
      HttpMessageNotReadableException exception,
      HttpServletRequest request) {
    return build(HttpStatus.BAD_REQUEST, "Payload invalido para este endpoint.", request);
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ApiErrorResponse> handleConflict(
      DataIntegrityViolationException exception,
      HttpServletRequest request) {
    return build(HttpStatus.CONFLICT, "Violacao de integridade de dados.", request);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiErrorResponse> handleUnexpected(
      Exception exception,
      HttpServletRequest request) {
    return build(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno de servidor.", request);
  }

  private ResponseEntity<ApiErrorResponse> build(HttpStatus status, String message, HttpServletRequest request) {
    ApiErrorResponse error = new ApiErrorResponse(
        Instant.now(),
        status.value(),
        status.getReasonPhrase(),
        message,
        request.getRequestURI());

    return ResponseEntity.status(status).body(error);
  }

  private String formatFieldError(FieldError fieldError) {
    String defaultMessage = fieldError.getDefaultMessage() != null ? fieldError.getDefaultMessage() : "valor invalido";
    return fieldError.getField() + ": " + defaultMessage;
  }
}
