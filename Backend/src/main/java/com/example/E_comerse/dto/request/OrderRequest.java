package com.example.E_comerse.dto.request;

import java.util.List;

public class OrderRequest {
    private Long customerId;
    private List<OrderItemRequest> items;

    public Long getCustomerId() { return customerId; }
    public List<OrderItemRequest> getItems() { return items; }
}
