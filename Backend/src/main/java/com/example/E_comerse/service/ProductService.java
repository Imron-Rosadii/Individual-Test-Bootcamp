package com.example.E_comerse.service;


import com.example.E_comerse.dto.request.ProductRequest;
import com.example.E_comerse.dto.response.ProductResponse;
import com.example.E_comerse.exception.DataNotFoundException;
import com.example.E_comerse.model.Category;
import com.example.E_comerse.model.Customer;
import com.example.E_comerse.model.Product;
import com.example.E_comerse.repository.CategoryRepository;
import com.example.E_comerse.repository.CustomerRepository;
import com.example.E_comerse.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private static final String imageDirectory = "src/main/resources/static/images/";

    private static final long maxFileSize = 5 * 1024 * 1024;
    private static final String[] allowedFileTypes = { "image/jpeg", "image/png", "image/jpg" };

    public Optional<ProductResponse> findById(Long id) {
        try {
            return productRepository.findById(id).map(this::convertToResponse);
        } catch (Exception e) {
            throw new RuntimeException("Failed to get data products");
        }
    }

    @Transactional
    public Page<ProductResponse> findAll(String category, String search, String sort, int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size, sort.equalsIgnoreCase("desc") ? Sort.by("price").descending() : Sort.by("price").ascending());
            Page<Product> products;

            // Mengubah kategori menjadi entitas
            Category categoryEntity = null;
            if (category != null) {
                categoryEntity = categoryRepository.findByName(category)
                        .orElseThrow(() -> new RuntimeException("Category not found: " + category));
            }

            // Pencarian berdasarkan kategori dan judul
            if (categoryEntity != null && search != null) {
                products = productRepository.findByCategoryAndTitleContainingIgnoreCase(categoryEntity, search, pageable);
            } else if (categoryEntity != null) {
                products = productRepository.findByCategory(categoryEntity, pageable);
            } else if (search != null) {
                products = productRepository.findByTitleContainingIgnoreCase(search, pageable);
            } else {
                products = productRepository.findAll(pageable);
            }

            return products.map(this::convertToResponse);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve products: " + e.getMessage(), e);
        }
    }

    public ProductResponse getProductBySlug(String slug) {
        Optional<Product> product = productRepository.findBySlug(slug);
        if (product.isPresent()) {
            return convertToResponse(product.get()); // method untuk mengonversi entitas Product ke ProductResponse
        } else {
            throw new RuntimeException("Product not found for slug: " + slug);
        }
    }


    @Transactional
    public ProductResponse create(ProductRequest productRequest) {
        try {
            // 🔹 Ambil customerId dari request, bukan dari token
            Long customerId = productRequest.getCustomerId();
            if (customerId == null) {
                throw new RuntimeException("Customer ID is required");
            }

            // 🔹 Cari customer berdasarkan ID
            Customer customer = customerRepository.findById(customerId)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            // 🔹 Buat objek Product baru
            Product product = new Product();
            product.setTitle(productRequest.getTitle());
            product.setSlug(productRequest.getSlug());
            product.setDescription(productRequest.getDescription());
            product.setPrice(productRequest.getPrice());
            product.setStock(productRequest.getStock());
            product.setIsActive(productRequest.getIsActive());
            product.setCustomer(customer);

            // 🔹 Cari kategori berdasarkan ID
            Category category = categoryRepository.findById(productRequest.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);

            // 🔹 Handle file upload jika ada gambar yang diunggah
            if (productRequest.getImagePath() != null && !productRequest.getImagePath().isEmpty()) {
                MultipartFile file = productRequest.getImagePath();

                // Periksa ukuran file
                if (file.getSize() > maxFileSize) {
                    throw new RuntimeException("File size exceeds the maximum limit of " + maxFileSize / (1024 * 1024) + "MB");
                }

                // Validasi tipe file
                String fileType = file.getContentType();
                boolean isValidType = Arrays.asList(allowedFileTypes).contains(fileType);

                if (!isValidType) {
                    throw new RuntimeException("Invalid file type. Only JPEG, PNG, and JPG files are allowed.");
                }

                // Simpan file dengan nama khusus
                String originalFilename = file.getOriginalFilename();
                String customFileName = "product_image" + "_" + originalFilename;

                Path path = Path.of(imageDirectory + customFileName);
                Files.copy(file.getInputStream(), path);
                product.setImagePath(customFileName);
            }

            // 🔹 Simpan produk ke database
            Product savedProduct = productRepository.save(product);
            return convertToResponse(savedProduct);

        } catch (Exception e) {
            throw new RuntimeException("Failed to create product: " + e.getMessage(), e);
        }
    }

    @Transactional
    public ProductResponse updateProduct(Long productId, ProductRequest productRequest) {
        try {
            // Cari produk berdasarkan ID tanpa memeriksa kepemilikan user
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // Update field produk jika data baru tidak null
            if (productRequest.getTitle() != null) product.setTitle(productRequest.getTitle());
            if (productRequest.getSlug() != null) product.setSlug(productRequest.getSlug());
            if (productRequest.getDescription() != null) product.setDescription(productRequest.getDescription());
            if (productRequest.getPrice() != null) product.setPrice(productRequest.getPrice());
            if (productRequest.getStock() != null && productRequest.getStock() >= 0) {
                product.setStock(productRequest.getStock());
            }
            if (productRequest.getIsActive() != null) product.setIsActive(productRequest.getIsActive());

            // Update kategori jika ada perubahan
            if (productRequest.getCategoryId() != null) {
                Category category = categoryRepository.findById(productRequest.getCategoryId())
                        .orElse(null); // Jika kategori tidak ditemukan, biarkan NULL
                product.setCategory(category);
            }

            // Handle file upload jika ada gambar baru
            if (productRequest.getImagePath() != null && !productRequest.getImagePath().isEmpty()) {
                MultipartFile file = productRequest.getImagePath();

                // Periksa ukuran file
                if (file.getSize() > maxFileSize) {
                    throw new RuntimeException("File size exceeds the maximum limit of " + maxFileSize / (1024 * 1024) + "MB");
                }

                // Validasi tipe file
                String fileType = file.getContentType();
                boolean isValidType = Arrays.asList(allowedFileTypes).contains(fileType);

                if (!isValidType) {
                    throw new RuntimeException("Invalid file type. Only JPEG, PNG, and JPG files are allowed.");
                }

                // Simpan file dengan nama unik
                String originalFilename = file.getOriginalFilename();
                String customFileName = "product_image_" + UUID.randomUUID() + "_" + originalFilename;

                Path path = Path.of(imageDirectory + customFileName);
                Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
                product.setImagePath(customFileName);
            }

            // Set waktu update
            product.setUpdatedAt(LocalDateTime.now());

            // Simpan perubahan
            Product updatedProduct = productRepository.save(product);
            return convertToResponse(updatedProduct);

        } catch (Exception e) {
            throw new RuntimeException("Failed to update product: " + e.getMessage(), e);
        }
    }


    public void deleteTodolist(Long id) {
        try {
            if (!productRepository.existsById(id)) {
                throw new DataNotFoundException("Todolist id not Found");
            }
            productRepository.deleteById(id);
        } catch (DataNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete todolist" + e.getMessage(), e);
        }
    }

    @Transactional
    public ProductResponse updateStock(Long productId, Integer newStock) {
        if (newStock == null || newStock < 0) {
            throw new IllegalArgumentException("Stock tidak boleh kurang dari 0");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new DataNotFoundException("Produk tidak ditemukan"));

        product.setStock(newStock);
        product.setUpdatedAt(LocalDateTime.now()); // Perbarui waktu terakhir diperbarui
        productRepository.save(product);

        return convertToResponse(product);
    }





    private ProductResponse convertToResponse(com.example.E_comerse.model.Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setTitle(product.getTitle());
        response.setSlug(product.getSlug());
        response.setImagePath(product.getImagePath());
        response.setCustomerId(product.getCustomer().getId());
        response.setCategoryId(product.getCategory().getId());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setStock(product.getStock());
        response.setIsActive(product.getIsActive());
        if (product.getCategory() != null) {
            response.setCategory(new ProductResponse.CategoryData(
                    product.getCategory().getId(),
                    product.getCategory().getName()
            ));
        }
        if (product.getCustomer() != null) {
            response.setCustomer(new ProductResponse.CustomerData(
                    product.getCustomer().getId(),
                    product.getCustomer().getUsername()
            ));
        }

        return response;

    }
}
