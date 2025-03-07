package com.example.E_comerse.controller;



import com.example.E_comerse.dto.request.ProductRequest;
import com.example.E_comerse.dto.response.ApiResponse;
import com.example.E_comerse.dto.response.PaginatedResponse;
import com.example.E_comerse.dto.response.ProductResponse;
import com.example.E_comerse.exception.DataNotFoundException;
import com.example.E_comerse.exception.DuplicateDataException;
import com.example.E_comerse.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/product")
public class ProductController {
    @Autowired
    private ProductService productService;


    @Value("${file.IMAGE_DIR}")
    private String imageDirectory;
    @Operation(summary = "Get All Products with Filtering, Sorting, and Searching")
    @GetMapping
    public ResponseEntity<?> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "asc") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Page<ProductResponse> products = productService.findAll(category, search, sort, page, size);
            return ResponseEntity.ok(new PaginatedResponse<>(200, products));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(500, "Terjadi kesalahan pada server: " + e.getMessage()));
        }
    }


    @Operation(summary = "Get Todo List Image")
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createProduct(@ModelAttribute @Valid  ProductRequest request) {
        try {
            ProductResponse productResponse = productService.create(request);
            return ResponseEntity.ok(new ApiResponse<>(200, productResponse));
        } catch (DuplicateDataException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse<>(409, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(500, e.getMessage()));


        }

    }

    @Operation(summary = "Update Todo List")
    @PutMapping(path = "{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateTodolist(
            @PathVariable("id") Long id,
            @ModelAttribute ProductRequest  request) { // Hapus @RequestBody
        try {
            ProductResponse productResponse = productService.updateProduct(id, request);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ApiResponse<>(200, productResponse));
        } catch (DuplicateDataException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new ApiResponse<>(409, e.getMessage())); // 409 untuk Conflict
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(500, "Failed to update todolist: " + e.getMessage()));
        }
    }

    @Operation(summary = "Get Todo List Image")
    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteTodolist(@PathVariable("id") Long id) {
        try {
            productService.deleteTodolist(id);
            return ResponseEntity
                    .status(HttpStatus.OK.value())
                    .body(new ApiResponse<>(HttpStatus.OK.value(), "Todolist deleted successfully"));
        } catch (DataNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND.value())
                    .body(new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Delete failed"));
        }
    }

    @PatchMapping("/{id}/update-stock")
    public ResponseEntity<?> updateProductStock(
            @PathVariable("id") Long id,
            @RequestBody Map<String, Integer> requestBody) { // ✅ Menerima JSON Body
        try {
            Integer newStock = requestBody.get("newStock");
            ProductResponse updatedProduct = productService.updateStock(id, newStock);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ApiResponse<>(200, updatedProduct));
        } catch (DataNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(404, e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(400, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(500, "Gagal memperbarui stok produk: " + e.getMessage()));
        }
    }

    // Endpoint untuk mendapatkan produk berdasarkan slug
    @GetMapping("{slug}")
    public ProductResponse getProductBySlug(@PathVariable String slug) {
        return productService.getProductBySlug(slug);
    }



}