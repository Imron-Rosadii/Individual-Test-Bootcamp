package com.example.E_comerse.repository;

import com.example.E_comerse.model.OrderItem;
import com.example.E_comerse.model.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrders(Orders orders);

}
