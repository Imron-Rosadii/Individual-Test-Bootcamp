package com.example.E_comerse.repository;

import com.example.E_comerse.model.Category;
import com.example.E_comerse.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySlug(String slug);
//   Page<Product> findByCategory(String category, Pageable pageable);
//    Page<Product> findByCategory(String category, Pageable pageable);
//
//    Page<Product> findByCategoryAndTitleContainingIgnoreCase(String category, String title, Pageable pageable);
//
    // Menggunakan title sebagai pengganti name
    Page<Product> findByTitleContainingIgnoreCase(String title, Pageable pageable);

// Menggunakan kategori sebagai parameter, bukan String
Page<Product> findByCategory(Category category, Pageable pageable);

    // Menggunakan kategori sebagai parameter, bukan String
    Page<Product> findByCategoryAndTitleContainingIgnoreCase(Category category, String title, Pageable pageable);



    // Pencarian berdasarkan title + filter kategori
    Page<Product> findByTitleContainingIgnoreCaseAndCategory(String title, Category category, Pageable pageable);

    List<Product> findByCategoryId(Long categoryId);

}
