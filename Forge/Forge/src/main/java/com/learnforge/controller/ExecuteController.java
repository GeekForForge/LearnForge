package com.learnforge.controller;

import com.learnforge.dto.ExecuteRequest;
import com.learnforge.dto.ExecuteResponse;
import com.learnforge.service.Judge0Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/execute")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class ExecuteController {

    private final Judge0Service judge0Service;

    public ExecuteController(Judge0Service judge0Service) {
        this.judge0Service = judge0Service;
    }

    @PostMapping
    public ResponseEntity<ExecuteResponse> run(@RequestBody ExecuteRequest req) {
        try {
            // Validate input
            if (req.getLanguage() == null || req.getCode() == null) {
                return ResponseEntity.badRequest().body(
                        createErrorResponse("Missing 'language' or 'code' in request")
                );
            }

            Map<String, Object> result = judge0Service.execute(req);

            if (result == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(createErrorResponse("No response from Judge0"));
            }

            ExecuteResponse response = new ExecuteResponse();
            response.setStdout(safeToString(result.get("stdout")));
            response.setStderr(safeToString(result.get("stderr")));
            response.setTime(safeToString(result.get("time")));

            // Safely extract status description
            Object statusObj = result.get("status");
            if (statusObj instanceof Map<?, ?> statusMap) {
                response.setStatus(safeToString(statusMap.get("description")));
            } else {
                response.setStatus("Unknown");
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Log exception in production; here we return clean error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Execution failed: " + e.getMessage()));
        }
    }

    // Utility: safely convert Object to String
    private String safeToString(Object obj) {
        return obj == null ? null : obj.toString();
    }

    // Helper: create error response with status
    private ExecuteResponse createErrorResponse(String message) {
        ExecuteResponse err = new ExecuteResponse();
        err.setStderr(message);
        err.setStatus("Error");
        return err;
    }
}
