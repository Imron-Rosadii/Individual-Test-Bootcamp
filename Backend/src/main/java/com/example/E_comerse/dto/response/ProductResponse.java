package com.example.E_comerse.dto.response;


import lombok.Data;


@Data
public class ProductResponse {

    private Long id;
    private String title;
    private String slug;
    private String imagePath;
    private String description;
    private Double price;
    private Integer stock;
    private Boolean isActive;
    private Long categoryId;
    private Long customerId;
    private CategoryData category;  // Pastikan ada properti ini
    private CustomerData customer;  // Pastikan ada properti ini




    @Data
    public static class CategoryData {
        private Long id;
        private String name;

        // Constructor default untuk deserialisasi
        public CategoryData() {}

        public CategoryData(Long id, String name) {
            this.id = id;
            this.name = name;
        }
    }

    @Data
    public static class CustomerData {
        private Long id;
        private String username;

        // Constructor default untuk deserialisasi
        public CustomerData() {}

        public CustomerData(Long id, String username) {
            this.id = id;
            this.username = username;
        }
    }


}
