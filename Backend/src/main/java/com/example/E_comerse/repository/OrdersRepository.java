package com.example.E_comerse.repository;

import com.example.E_comerse.model.Customer;
import com.example.E_comerse.model.OrderHistory;
import com.example.E_comerse.model.Orders;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrdersRepository extends JpaRepository<Orders, Long> {
    List<Orders> findByCustomer(Customer customer);
    List<Orders> findByStatus(String status);
    List<Orders> findByCustomerAndStatus(Customer customer, String status);
    @EntityGraph(attributePaths = "orderHistories")
    Optional<Orders> findById(Long orderId);


}
