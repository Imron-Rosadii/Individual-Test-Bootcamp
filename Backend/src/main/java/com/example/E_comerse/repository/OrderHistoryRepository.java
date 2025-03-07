package com.example.E_comerse.repository;


import com.example.E_comerse.model.OrderHistory;
import com.example.E_comerse.model.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderHistoryRepository extends JpaRepository<OrderHistory, Long> {

    List<OrderHistory> findByOrders(Orders orders);

    OrderHistory findTopByOrdersOrderByUpdatedAtDesc(Orders orders);

    List<OrderHistory> findByOrders_Customer_Username(String username);

}
