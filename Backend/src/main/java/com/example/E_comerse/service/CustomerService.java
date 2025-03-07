package com.example.E_comerse.service;

import com.example.E_comerse.dto.request.LoginRequest;
import com.example.E_comerse.dto.request.CustomerRequest;
import com.example.E_comerse.dto.response.CustomerResponse;
import com.example.E_comerse.exception.DataNotFoundException;
import com.example.E_comerse.exception.DuplicateDataException;
import com.example.E_comerse.model.Customer;
import com.example.E_comerse.repository.CustomerRepository;
import com.example.E_comerse.security.CustomCustomerDetail;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public CustomerService(@Lazy CustomerRepository customerRepository, PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDetails loadUserById(String id) {
        Customer customer = customerRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new UsernameNotFoundException("User tidak ditemukan dengan ID: " + id));

        return new org.springframework.security.core.userdetails.User(
                customer.getUsername(), customer.getPassword(), customer.getAuthorities());
    }




    @Transactional
    public CustomerResponse registerCustomer(CustomerRequest customerRequest) {
        if (customerRepository.findByUsername(customerRequest.getUsername()).isPresent()) {
            throw new DuplicateDataException("Username already exists");
        }
        if (customerRepository.findByEmail(customerRequest.getEmail()).isPresent()) {
            throw new DuplicateDataException("Email already exists");
        }

        Customer customer = new Customer();
        customer.setUsername(customerRequest.getUsername());
        customer.setEmail(customerRequest.getEmail());
        customer.setPassword(passwordEncoder.encode(customerRequest.getPassword()));
        customer.setRole(Optional.ofNullable(customerRequest.getRole()).orElse("CUSTOMER"));
        Customer register = customerRepository.save(customer);
        return convertToResponse(register);
    }

    @Transactional
    public CustomerResponse loginCustomer(LoginRequest loginRequest) {
        Customer customer = customerRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer tidak ditemukan"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), customer.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Password salah");
        }

        return convertToResponse(customer);
    }

    public CustomerResponse getCustomerById(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer tidak ditemukan"));
        return convertToResponse(customer);
    }

    public CustomerResponse getIdByUsername(String username) {
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer tidak ditemukan"));
        return convertToResponse(customer);
    }

    public List<CustomerResponse> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        return customers.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CustomerResponse updateUsername(Long customerId, CustomerRequest customerRequest) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer tidak ditemukan"));
        if (customerRequest.getUsernameUpdate() == null || customerRequest.getUsernameUpdate().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username tidak boleh kosong");
        }
        if (customerRepository.findByUsername(customerRequest.getUsernameUpdate()).isPresent()) {
            throw new DuplicateDataException("Username already exists");
        }
        customer.setUsername(customerRequest.getUsernameUpdate());
        customerRepository.save(customer);
        return convertToResponse(customer);
    }

    @Transactional
    public void updatePassword(Long customerId, CustomerRequest customerRequest) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer tidak ditemukan"));
        if (customerRequest.getOldPassword() == null || customerRequest.getOldPassword().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password lama tidak boleh kosong");
        }
        if (!passwordEncoder.matches(customerRequest.getOldPassword(), customer.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Password lama salah");
        }
        if (customerRequest.getUpdatePassword() == null || customerRequest.getUpdatePassword().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password baru tidak boleh kosong");
        }
        String encodedPassword = passwordEncoder.encode(customerRequest.getUpdatePassword());
        customer.setPassword(encodedPassword);
        customerRepository.save(customer);
    }

    @Transactional
    public CustomerResponse updateEmail(Long customerId, CustomerRequest customerRequest) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer tidak ditemukan"));
        if (customerRequest == null || customerRequest.getEmailUpdate() == null || customerRequest.getEmailUpdate().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email tidak boleh kosong");
        }
        if (customerRepository.findByEmail(customerRequest.getEmailUpdate()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email sudah terdaftar");
        }
        customer.setEmail(customerRequest.getEmailUpdate());
        customerRepository.save(customer);
        return convertToResponse(customer);
    }

    @Transactional
    public CustomerResponse updateCustomerRole(Long userId, String newRole) {
        Customer customer = customerRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User tidak ditemukan"));
        if (!newRole.equals("ADMIN") && !newRole.equals("CUSTOMER")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role tidak valid");
        }
        customer.setRole(newRole);
        customerRepository.save(customer);
        return convertToResponse(customer);
    }

    @Transactional
    public void deleteCustomers(Long userId) {
        Customer  customer  = customerRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("User with ID " + userId + " not found"));
        customerRepository.delete(customer);
    }





    private CustomerResponse convertToResponse(Customer customer) {
        CustomerResponse customerResponse = new CustomerResponse();
        customerResponse.setId(customer.getId());
        customerResponse.setUsername(customer.getUsername());
        customerResponse.setEmail(customer.getEmail());
        customerResponse.setRole(customer.getRole());
        customerResponse.setCreatedAt(customer.getCreatedAt());
        customerResponse.setUpdatedAt(customer.getUpdatedAt());
        return customerResponse;
    }



}
