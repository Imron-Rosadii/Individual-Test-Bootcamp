package com.example.E_comerse.controller;

import com.example.E_comerse.dto.request.LoginRequest;
import com.example.E_comerse.dto.request.CustomerRequest;
import com.example.E_comerse.dto.response.ApiResponse;
import com.example.E_comerse.dto.response.CustomerResponse;
import com.example.E_comerse.exception.DataNotFoundException;
import com.example.E_comerse.exception.DuplicateDataException;
import com.example.E_comerse.service.CustomerService;
import com.example.E_comerse.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody CustomerRequest customerRequest) {
        try {
            CustomerResponse customerResponse = customerService.registerCustomer(customerRequest);
            return ResponseEntity.ok(new ApiResponse<>(200, customerResponse));
        } catch (DuplicateDataException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new ApiResponse<>(HttpStatus.CONFLICT.value(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage()));
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            CustomerResponse customerResponse = customerService.loginCustomer(loginRequest);
            String token = jwtUtil.generateToken(customerResponse.getId());
            return ResponseEntity.ok(new ApiResponse<>(200, token));
        } catch (ResponseStatusException e) {
            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(new ApiResponse<>(e.getStatusCode().value(), e.getReason()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(500, "Terjadi kesalahan pada server: " + e.getMessage())); // Tampilkan error detail
        }
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<?> getIdByUsername(@PathVariable String username) {
        try {
            CustomerResponse customerResponse = customerService.getIdByUsername(username);
            return ResponseEntity.ok(customerResponse);
        } catch (ResponseStatusException e) {
            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(new ApiResponse<>(e.getStatusCode().value(), e.getReason()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(500, "Terjadi kesalahan pada server: " + e.getMessage()));
        }
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getUsernameById(@PathVariable Long id) {
        try {
            CustomerResponse customerResponse = customerService.getCustomerById(id);
            return ResponseEntity.ok(customerResponse);
        } catch (ResponseStatusException e) {
            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(new ApiResponse<>(e.getStatusCode().value(), e.getReason()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(500, "Terjadi kesalahan pada server: " + e.getMessage()));
        }
    }



    /** ✅ Get All Customers */
    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        List<CustomerResponse> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    @PutMapping("/{customerId}/update-username")
    public ResponseEntity<?> updateUsername(@PathVariable Long customerId, @RequestBody CustomerRequest request) {
        try {
            CustomerResponse updatedCustomer = customerService.updateUsername(customerId, request);
            return ResponseEntity.ok(new ApiResponse<>(200, updatedCustomer));
        } catch (DuplicateDataException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new ApiResponse<>(HttpStatus.CONFLICT.value(), e.getMessage()));
        } catch (ResponseStatusException e) {
            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(new ApiResponse<>(e.getStatusCode().value(), e.getReason()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(500, "Terjadi kesalahan pada server"));
        }
    }

    @PutMapping("/{customerId}/update-password")
    public ResponseEntity<?> updatePassword(@PathVariable Long customerId, @RequestBody CustomerRequest request) {
        try {
            customerService.updatePassword(customerId, request);
            System.out.println("Password berhasil diperbarui untuk customerId=" + customerId);
            return ResponseEntity.ok(new ApiResponse<>(200, "Password berhasil diperbarui"));
        } catch (ResponseStatusException e) {
            System.out.println("Gagal memperbarui password: " + e.getStatusCode() + " - " + e.getReason());
            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(new ApiResponse<>(e.getStatusCode().value(), e.getReason()));
        } catch (Exception e) {
            System.out.println("Terjadi kesalahan pada server saat update password: " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(500, "Terjadi kesalahan pada server"));
        }
    }

    @PutMapping("/{customerId}/update-email")
    public ResponseEntity<?> updateEmail(@PathVariable Long customerId, @RequestBody CustomerRequest request) {
        try {
            CustomerResponse updatedCustomer = customerService.updateEmail(customerId, request);
            return ResponseEntity.ok(new ApiResponse<>(200, updatedCustomer));
        } catch (DuplicateDataException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new ApiResponse<>(HttpStatus.CONFLICT.value(), e.getMessage()));
        } catch (ResponseStatusException e) {
            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(new ApiResponse<>(e.getStatusCode().value(), e.getReason()));
        } catch (MethodArgumentTypeMismatchException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "ID harus berupa angka"));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(500, "Terjadi kesalahan pada server"));
        }
    }

    @PutMapping("/{userId}/role")
    public ResponseEntity<?> updateCustomerRole(@PathVariable Long userId, @RequestParam String newRole) {
        if (!newRole.equals("CUSTOMER") && !newRole.equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "Invalid role"));
        }
        try {
            CustomerResponse updatedCustomer = customerService.updateCustomerRole(userId, newRole);
            return ResponseEntity.ok(new ApiResponse<>(200, updatedCustomer));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUsers(@PathVariable("id") Long id) {
        try {
            customerService.deleteCustomers(id);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ApiResponse<>(HttpStatus.OK.value(), "User deleted successfully"));
        } catch (DataNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Delete failed"));
        }
    }


}
