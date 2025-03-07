package com.example.E_comerse.service;

import com.example.E_comerse.dto.response.OrderHistoryResponse;
import com.example.E_comerse.model.Customer;
import com.example.E_comerse.model.OrderHistory;
import com.example.E_comerse.repository.CustomerRepository;
import com.example.E_comerse.repository.OrderHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderHistoryService {

    @Autowired
    private OrderHistoryRepository orderHistoryRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Transactional
    public List<OrderHistoryResponse> getOrderHistoryForUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        List<OrderHistory> histories = orderHistoryRepository.findByOrders_Customer_Username(username);

        return histories.stream()
                .map(history -> new OrderHistoryResponse(history.getStatus(), history.getUpdatedAt()))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<OrderHistoryResponse> getAllOrderHistories() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer tidak ditemukan!"));

        if (!"ADMIN".equals(customer.getRole())) {
            throw new RuntimeException("Akses ditolak! Hanya admin yang bisa melihat semua riwayat order.");
        }

        List<OrderHistory> histories = orderHistoryRepository.findAll();

        return histories.stream()
                .map(history -> new OrderHistoryResponse(history.getStatus(), history.getUpdatedAt()))
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderHistoryResponse getOrderHistoryById(Long historyId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer tidak ditemukan!"));

        if (!"ADMIN".equals(customer.getRole())) {
            throw new RuntimeException("Akses ditolak! Hanya admin yang bisa melihat detail riwayat order.");
        }

        OrderHistory history = orderHistoryRepository.findById(historyId)
                .orElseThrow(() -> new RuntimeException("Riwayat order tidak ditemukan!"));

        return new OrderHistoryResponse(history.getStatus(), history.getUpdatedAt());
    }
}

