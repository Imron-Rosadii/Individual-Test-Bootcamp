package com.example.E_comerse.controller;

import com.example.E_comerse.dto.request.CartRequest;
import com.example.E_comerse.dto.response.ApiResponse;
import com.example.E_comerse.dto.response.CartResponse;
import com.example.E_comerse.exception.DataNotFoundException;
import com.example.E_comerse.exception.OutOfStockException;
import com.example.E_comerse.exception.ProductNotFoundException;
import com.example.E_comerse.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> addToCart(@RequestBody CartRequest cartRequest) {
        try {
            CartResponse cartResponse = cartService.addToCart(cartRequest);
            return ResponseEntity.ok(new ApiResponse<>(200, cartResponse));
        } catch (ProductNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(404, "Produk tidak ditemukan"));
        } catch (OutOfStockException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse<>(409, "Stok produk habis!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(400, "Permintaan tidak valid"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(500, "Terjadi kesalahan pada server"));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CartResponse>>> getCartItems() {
            List<CartResponse> cartResponses = cartService.getCartItems();
            return ResponseEntity.ok(new ApiResponse<>(200, cartResponses));

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCartItem(@PathVariable Long id) {
        try {
            cartService.deleteCartItem(id);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ApiResponse<>(HttpStatus.OK.value(), "cart deleted successfully"));
        } catch (DataNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getCartById(@PathVariable Long id) {
        try {
            CartResponse cartResponse = cartService.getCartById(id);
            return ResponseEntity.ok(new ApiResponse<>(200, cartResponse));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(404, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(500, "Terjadi kesalahan pada server"));
        }
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<?> deleteCartbyIdProduct(@PathVariable Long id) {
        try {
            cartService.deleteCartByProductId(id);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ApiResponse<>(HttpStatus.OK.value(), "cart deleted successfully"));
        } catch (DataNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),e.getMessage()));
        }
    }


}