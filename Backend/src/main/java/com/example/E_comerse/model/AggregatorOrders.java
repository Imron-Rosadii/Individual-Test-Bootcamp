package com.example.E_comerse.model;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "aggregator_orders")
public class AggregatorOrders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "INT CHECK (total_orders >= 0)")
    private Integer totalOrders;

    @Column(nullable = false, columnDefinition = "DOUBLE PRECISION CHECK (total_revenue >= 0)")
    private Double totalRevenue;

    @CreationTimestamp
    private LocalDateTime date;
}

