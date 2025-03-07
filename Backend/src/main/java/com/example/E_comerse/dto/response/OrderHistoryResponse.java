package com.example.E_comerse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderHistoryResponse {
    private String status;
    private LocalDateTime updatedAt;

}
