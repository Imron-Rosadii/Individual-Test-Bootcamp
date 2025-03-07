package com.example.E_comerse.service;

import com.example.E_comerse.dto.request.OrderStatusRequest;
import com.example.E_comerse.dto.response.OrderHistoryResponse;
import com.example.E_comerse.dto.response.OrderItemResponse;
import com.example.E_comerse.dto.response.OrderResponse;
import com.example.E_comerse.exception.OutOfStockException;
import com.example.E_comerse.model.*;
import com.example.E_comerse.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderHistoryRepository orderHistoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @PersistenceContext
    private EntityManager entityManager;


    @Transactional
    public OrderResponse checkout() {
        // **Ambil user yang sedang login**
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new RuntimeException("User belum login!");
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        // **Cari customer berdasarkan username**
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer tidak ditemukan!"));

        // **Cek apakah keranjang kosong**
        List<Cart> cartItems = cartRepository.findByCustomer(customer);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Keranjang belanja kosong!");
        }

        // **Buat order baru**
        Orders order = new Orders();
        order.setCustomer(customer);
        order.setStatus("PENDING"); // Menggunakan string "PENDING" langsung
        order.setOrderItems(new ArrayList<>());
        order.setOrderHistories(new ArrayList<>());

        double totalPrice = 0.0;
        for (Cart cart : cartItems) {
            Product product = cart.getProduct();

            if (product.getStock() < cart.getQuantity()) {
                throw new OutOfStockException("Stok tidak mencukupi untuk produk: " + product.getTitle());
            }

            // **Kurangi stok produk**
            product.setStock(product.getStock() - cart.getQuantity());
            productRepository.save(product);

            // **Tambahkan item ke order**
            OrderItem orderItem = new OrderItem();
            orderItem.setOrders(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cart.getQuantity());
            orderItem.setSubtotal(product.getPrice() * cart.getQuantity());
            totalPrice += orderItem.getSubtotal();
            order.getOrderItems().add(orderItem);
        }

        order.setTotalPrice(totalPrice);
        ordersRepository.save(order);
        orderItemRepository.saveAll(order.getOrderItems());

        // **Tambahkan order ke history**
        OrderHistory history = new OrderHistory(order, "PENDING");
        orderHistoryRepository.save(history);
        order.getOrderHistories().add(history);

        // **Hapus isi keranjang setelah checkout**
        cartRepository.deleteByCustomer(customer);

        return convertToResponse(order);
    }

    @Transactional
    public void deleteOrder(Long orderId) {
        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order tidak ditemukan!"));
        ordersRepository.delete(order);
    }

    public List<OrderResponse> getAllOrders(Customer customer, String status) {
        List<Orders> orders;

        if (customer.getRole().equals("ADMIN")) {
            // Jika admin, ambil semua order dengan filter status (jika status diberikan)
            orders = (status == null || status.isEmpty()) ?
                    ordersRepository.findAll() :
                    ordersRepository.findByStatus(status);
        } else {
            // Jika bukan admin, hanya ambil order milik customer dengan filter status (jika status diberikan)
            orders = (status == null || status.isEmpty()) ?
                    ordersRepository.findByCustomer(customer) :
                    ordersRepository.findByCustomerAndStatus(customer, status);
        }

        return orders.stream().map(this::convertToResponse).collect(Collectors.toList());
    }




    public OrderResponse getOrderById(Long orderId, Long customerId) {
        if (customerId == null) {
            throw new RuntimeException("Customer ID tidak boleh null!");
        }

        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order tidak ditemukan!"));

        if (order.getCustomer() == null || !order.getCustomer().getId().equals(customerId)) {
            throw new RuntimeException("Anda tidak memiliki akses ke order ini!");
        }

        return convertToResponse(order);
    }
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatusRequest request) {
        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order tidak ditemukan!"));

        // Update status utama di Orders
        order.setStatus(request.getStatus());
        order.setUpdatedAt(LocalDateTime.now()); // Pastikan kolom updatedAt diisi
        ordersRepository.save(order);

        // Simpan perubahan ke database dan ambil data terbaru
        ordersRepository.flush();
        entityManager.refresh(order);

        // Simpan status terbaru ke OrderHistory
        OrderHistory history = new OrderHistory(order, request.getStatus());
        history.setUpdatedAt(LocalDateTime.now());
        orderHistoryRepository.save(history);

        return convertToResponse(order);
    }


    private OrderResponse convertToResponse(Orders order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getId());
        response.setCustomerId(order.getCustomer().getId());
        response.setTotalPrice(order.getTotalPrice());
        response.setStatus(order.getStatus());
        response.setCreatedAt(order.getCreatedAt());

        // Ambil semua order item dari database
        List<OrderItemResponse> items = orderItemRepository.findByOrders(order)
                .stream()
                .map(item -> new OrderItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getTitle(),
                        item.getQuantity(),
                        item.getSubtotal()
                ))
                .collect(Collectors.toList());
        response.setItems(items);

        // Ambil hanya status terbaru dari OrderHistory
        OrderHistory latestHistory = orderHistoryRepository.findTopByOrdersOrderByUpdatedAtDesc(order);
        if (latestHistory != null) {
            response.setOrderHistory(Collections.singletonList(
                    new OrderHistoryResponse(latestHistory.getStatus(), latestHistory.getUpdatedAt())
            ));
        } else {
            response.setOrderHistory(Collections.emptyList());
        }

        return response;
    }


}


