package com.example.E_comerse.model;


import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "cart")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "INT CHECK (quantity > 0)")
    private Integer quantity;

    // Relasi ke User (Many Carts ke One User)
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Customer customer;

    // Relasi ke Product (Many Carts ke One Product)
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    public Cart(Customer customer, Product product, Integer quantity) {
        this.customer = customer;
        this.product = product;
        this.quantity = quantity;
    }
}

