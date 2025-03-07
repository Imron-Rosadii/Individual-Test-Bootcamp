package com.example.E_comerse.dto.request;


import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerRequest {

    @NotBlank(message = "Username tidak boleh kosong")
    @Size(max = 50, message = "Username maksimal 50 karakter")
    @Column(nullable = false)
    private String username;

    @NotBlank(message = "Email tidak boleh kosong")
    @Email(message = "Format email tidak valid")
    @Size(max = 100, message = "Email maksimal 100 karakter")
    private String email;

    @NotBlank(message = "Password tidak boleh kosong")
    @Size(min = 3, message = "Password minimal 3 karakter")
    private String password;

    private String role = "CUSTOMER";

    @NotBlank(message = "Username baru tidak boleh kosong")
    @Size(max = 50, message = "Username maksimal 50 karakter")
    private String usernameUpdate;

    @NotBlank(message  = "Email baru tidak boleh kosong")
    @Size(max = 50, message = "Email maksimal 50 karakter")
    private String emailUpdate;

    @NotBlank(message = "Password lama tidak boleh kosong")
    private String oldPassword;

    @NotBlank(message = "Password baru tidak boleh kosong")
    @Size(min = 3, message = "Password minimal 3 karakter")
    private String updatePassword;

    @NotBlank(message = "Role baru tidak boleh kosong")
    private String updateRole;

}
