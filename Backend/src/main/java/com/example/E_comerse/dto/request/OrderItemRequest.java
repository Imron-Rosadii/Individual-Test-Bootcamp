package com.example.E_comerse.dto.request;

public class OrderItemRequest {
    private Long productId;
    private String productName;
    private int quantity;
    private double price;

    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public int getQuantity() { return quantity; }
    public double getPrice() { return price; }
}
