package com.example.E_comerse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private Long orderId;
    private Long customerId;
    private double totalPrice;
    private String status;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
    private List<OrderHistoryResponse> orderHistory;
}
