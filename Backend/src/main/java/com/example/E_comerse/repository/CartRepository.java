package com.example.E_comerse.repository;

import com.example.E_comerse.model.Cart;
import com.example.E_comerse.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByCustomer(Customer customer);

   //  Optional<Double> sumTotalByCustomer(Customer customer);


    void deleteByCustomer(Customer customer);

    List<Cart> findByProductId(Long productId);
}
