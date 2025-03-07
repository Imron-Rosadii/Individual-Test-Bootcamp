package com.example.E_comerse.dto.request;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequest {

    @NotBlank(message = "Nama produk tidak boleh kosong")
    private String title;

    @NotBlank(message = "Slug tidak boleh kosong")
    private String slug;

    private String description;

    @NotNull(message = "Harga tidak boleh kosong")
    @Min(value = 0, message = "Harga harus lebih besar atau sama dengan 0")
    private Double price;

    @NotNull(message = "Stok tidak boleh kosong")
    @Min(value = 0, message = "Stok tidak boleh negatif")
    private Integer stock;

    @NotNull(message = "Kategori tidak boleh kosong")
    private Long categoryId;

    @NotNull(message = "Pembeli tidak boleh kosong")
    private Long customerId;

    @NotNull(message = "Status tidak boleh kosong")
    private Boolean isActive;

    private MultipartFile imagePath;
}
