package com.example.E_comerse.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "order_history")
public class OrderHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20, columnDefinition = "VARCHAR(20) CHECK (status IN ('PENDING', 'PAID', 'CANCELLED', 'SHIPPED'))")
    private String status;



    @Column(name = "update_at")
    @CreationTimestamp
    private LocalDateTime updatedAt;


    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    private Orders orders;

    public OrderHistory(Orders orders, String status) {
        this.orders = orders;
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }


}
