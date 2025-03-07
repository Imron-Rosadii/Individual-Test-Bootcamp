package com.example.E_comerse.service;

import com.example.E_comerse.dto.request.CartRequest;
import com.example.E_comerse.dto.response.CartResponse;
import com.example.E_comerse.exception.OutOfStockException;
import com.example.E_comerse.exception.ProductNotFoundException;
import com.example.E_comerse.model.Cart;
import com.example.E_comerse.model.Customer;
import com.example.E_comerse.model.Product;
import com.example.E_comerse.repository.CartRepository;
import com.example.E_comerse.repository.CustomerRepository;
import com.example.E_comerse.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public CartResponse addToCart(CartRequest cartRequest) {
        // Ambil user yang sedang login
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();

        // Cari customer berdasarkan username
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer tidak ditemukan"));

        // Cari produk berdasarkan ID
        Product product = productRepository.findById(cartRequest.getProductId())
                .orElseThrow(() -> new ProductNotFoundException("Produk tidak ditemukan"));

        // **Cek stok sebelum menambahkan ke cart**
        if (product.getStock() < cartRequest.getQuantity()) {
            throw new OutOfStockException("Stok produk tidak mencukupi!");
        }

        // Cari apakah produk sudah ada di cart user
        Cart cart = cartRepository.findByCustomer(customer).stream()
                .filter(c -> c.getProduct().getId().equals(cartRequest.getProductId()))
                .findFirst()
                .orElse(null);

        if (cart == null) {
            // **Tambahkan produk baru ke cart**
            cart = new Cart(customer, product, cartRequest.getQuantity());
        } else {
            // **Update jumlah produk dalam cart**
            int totalQuantity = cart.getQuantity() + cartRequest.getQuantity();

            if (totalQuantity > product.getStock()) {
                throw new OutOfStockException("Jumlah di keranjang melebihi stok yang tersedia!");
            }

            cart.setQuantity(totalQuantity);
        }



        cartRepository.save(cart);  // Simpan cart baru atau update cart

        return convertToResponse(cart);
    }

    public List<CartResponse> getCartItems() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();

        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        List<Cart> cartItems = cartRepository.findByCustomer(customer);

        return cartItems.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteCartItem(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Kembalikan stok produk
        Product product = cart.getProduct();
        product.setStock(product.getStock() + cart.getQuantity());
        productRepository.save(product);

        cartRepository.delete(cart);
    }

    public CartResponse getCartById(Long cartId) {
        // Ambil user yang sedang login
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();

        // Cari customer berdasarkan username
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer tidak ditemukan"));

        // Cari Cart berdasarkan ID dan pastikan Cart milik user yang sedang login
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart tidak ditemukan"));

        if (!cart.getCustomer().getId().equals(customer.getId())) {
            throw new RuntimeException("Anda tidak memiliki akses ke cart ini!");
        }

        return convertToResponse(cart);
    }

    @Transactional
    public void deleteCartByProductId(Long productId) {
        // Cari semua cart yang terkait dengan produk tertentu
        List<Cart> carts = cartRepository.findByProductId(productId);

        // Jika tidak ada cart yang ditemukan
        if (carts.isEmpty()) {
            throw new RuntimeException("No cart items found for product with ID: " + productId);
        }

        // Proses untuk setiap cart yang ditemukan
        for (Cart cart : carts) {
            // Kembalikan stok produk
            Product product = cart.getProduct();
            product.setStock(product.getStock() + cart.getQuantity());
            productRepository.save(product);

            // Hapus item dari cart
            cartRepository.delete(cart);
        }
    }




    private CartResponse convertToResponse(Cart cart) {

        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setProductTitle(cart.getProduct().getTitle());
        response.setQuantity(cart.getQuantity());
        response.setPrice(cart.getProduct().getPrice());
        return response;
    }
}
