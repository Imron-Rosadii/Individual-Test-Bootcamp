package com.example.E_comerse.controller;


import com.example.E_comerse.dto.request.CategoryRequest;
import com.example.E_comerse.dto.response.ApiResponse;
import com.example.E_comerse.dto.response.CategoryResponse;
import com.example.E_comerse.exception.DataNotFoundException;
import com.example.E_comerse.exception.DuplicateDataException;
import com.example.E_comerse.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/product/category")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<?> getAllCategory() {
        try {
            List<CategoryResponse> response = categoryService.findAll();
            return ResponseEntity
                    .status(HttpStatus.OK.value())
                    .body(new ApiResponse<>(HttpStatus.OK.value(), response));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody CategoryRequest categoryRequest) {
        try {
            CategoryResponse response = categoryService.create(categoryRequest);
            return ResponseEntity
                    .status(HttpStatus.OK.value())
                    .body(new ApiResponse<>(HttpStatus.OK.value(), response));
        } catch (DuplicateDataException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT.value())
                    .body(new ApiResponse<>(HttpStatus.CONFLICT.value(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage()));
        }
    }

    @PutMapping("{id}")
    public ResponseEntity<?> updateCategory(@PathVariable("id") Long id, @RequestBody CategoryRequest request) {
        try {
            CategoryResponse categoryResponse = categoryService.updateCategory(id,request);
            return ResponseEntity
                    .status(HttpStatus.OK.value())
                    .body(new ApiResponse<>(HttpStatus.OK.value(), categoryResponse));
        } catch (DataNotFoundException e){
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage()));
        }
        catch (DuplicateDataException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT.value())
                    .body(new ApiResponse<>(HttpStatus.CONFLICT.value(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id){
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.status(HttpStatus.OK.value())
                    .body(new ApiResponse<>(HttpStatus.OK.value(), "Category deleted successfully"));
        } catch (DataNotFoundException e){
            return  ResponseEntity.status(HttpStatus.NOT_FOUND.value())
                    .body(new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getMessage()));
        }catch (Exception e ){
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Delete failed"));
        }
    }


    @GetMapping("/name")
    public ResponseEntity<?> getCategoryByName(@RequestParam String categoryName){
        Optional<CategoryResponse> categoryResponse = categoryService.findByName(categoryName);
        return ResponseEntity.status(HttpStatus.OK.value())
                .body(new ApiResponse<>(HttpStatus.OK.value(), categoryResponse));
    }
}


