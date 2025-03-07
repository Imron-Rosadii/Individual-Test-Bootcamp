package com.example.E_comerse.controller;

import com.example.E_comerse.dto.request.OrderStatusRequest;
import com.example.E_comerse.dto.response.OrderResponse;
import com.example.E_comerse.service.OrderService;
import com.example.E_comerse.model.Customer;
import com.example.E_comerse.repository.CustomerRepository; // Tambahkan import ini
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private CustomerRepository customerRepository; // Tambahkan ini

    // ✅ Checkout (Membuat pesanan baru dari keranjang)
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@AuthenticationPrincipal Customer customer) {
        try {
            OrderResponse response = orderService.checkout();
            return ResponseEntity.status(200).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders(@RequestParam(required = false) String status) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return ResponseEntity.status(401).build();
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        Customer customer = customerRepository.findByUsername(username).orElse(null);

        if (customer == null) {
            return ResponseEntity.status(404).build();
        }

        List<OrderResponse> orders = orderService.getAllOrders(customer, status);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long orderId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return ResponseEntity.status(401).body(null);
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        Customer customer = customerRepository.findByUsername(username).orElse(null);

        if (customer == null) {
            return ResponseEntity.status(404).body(null);
        }

        OrderResponse order = orderService.getOrderById(orderId, customer.getId());
        return ResponseEntity.ok(order);
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long orderId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return ResponseEntity.status(401).body("User belum login!");
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        Customer customer = customerRepository.findByUsername(username).orElse(null);

        if (customer == null) {
            return ResponseEntity.status(404).body("Customer tidak ditemukan!");
        }

        try {
            orderService.deleteOrder(orderId);
            return ResponseEntity.ok("Order berhasil dihapus!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{orderId}/update-status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody OrderStatusRequest request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return ResponseEntity.status(401).body(null);
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        Customer customer = customerRepository.findByUsername(username).orElse(null);

        if (customer == null) {
            return ResponseEntity.status(404).body(null);
        }

        OrderResponse response = orderService.updateOrderStatus(orderId, request);
        return ResponseEntity.ok(response);
    }

}




