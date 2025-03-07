package com.example.E_comerse.service;

import com.example.E_comerse.model.Customer;
import com.example.E_comerse.repository.CustomerRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final CustomerRepository customerRepository;

    public AuthService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Customer getAuthenticatedCustomer() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            String email = ((UserDetails) principal).getUsername(); // Ambil email dari JWT

            return customerRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Customer tidak ditemukan!"));
        }

        throw new RuntimeException("Autentikasi gagal!");
    }
}
