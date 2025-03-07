package com.example.E_comerse.controller;

import com.example.E_comerse.dto.response.OrderHistoryResponse;
import com.example.E_comerse.service.OrderHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderHistoryController {

    @Autowired
    private OrderHistoryService orderHistoryService;

    @GetMapping("/orders/history")
    public ResponseEntity<List<OrderHistoryResponse>> getOrderHistoryForUser() {
        return ResponseEntity.ok(orderHistoryService.getOrderHistoryForUser());
    }

    @GetMapping("/admin/orders/history")
    public ResponseEntity<List<OrderHistoryResponse>> getAllOrderHistories() {
        return ResponseEntity.ok(orderHistoryService.getAllOrderHistories());
    }

    @GetMapping("/admin/orders/history/{id}")
    public ResponseEntity<OrderHistoryResponse> getOrderHistoryById(@PathVariable Long id) {
        return ResponseEntity.ok(orderHistoryService.getOrderHistoryById(id));
    }
}

