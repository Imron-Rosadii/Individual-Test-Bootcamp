package com.example.E_comerse.model;



import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "INT CHECK (quantity > 0)")
    private Integer quantity;

    @Column(nullable = false)
    private Double subtotal;

    // Relasi ke Order (Many OrderItems ke One Order)
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    private Orders orders;

    // Relasi ke Product (Many OrderItems ke One Product)
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}
