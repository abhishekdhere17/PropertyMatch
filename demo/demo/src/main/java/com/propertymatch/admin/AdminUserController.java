
package com.propertymatch.admin;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.propertymatch.user.UserRepository;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserRepository userRepository;

    public AdminUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // MAIN_ADMIN and ADMIN can view registered users.
    @GetMapping
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getRole().name(),
                        user.isEnabled(),
                        user.getCreatedAt()
                ))
                .toList();
    }

    // Safe response: never expose user passwords.
    public record UserResponse(
            Long id,
            String fullName,
            String email,
            String phone,
            String role,
            boolean enabled,
            LocalDateTime createdAt
    ) {
    }
}
