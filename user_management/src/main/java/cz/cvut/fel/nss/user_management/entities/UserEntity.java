package cz.cvut.fel.nss.user_management.entities;

import cz.cvut.fel.nss.user_management.entities.dto.SignUpDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "user_entity")
@NamedQueries(
        @NamedQuery(name = "User.findByUsername", query = "SELECT u FROM UserEntity u WHERE u.username = :username")
)
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int userId;
    @Column(name = "username", nullable = false, length = 255, unique = true)
    private String username;
    @Column(name = "password", nullable = false, length = 255)
    private String password;
    @Column(name = "name", nullable = false, length = 255)
    private String name;
    @Column(name = "email", nullable = false, length = 255, unique = true)
    private String email;
    @Column(name = "account_state", nullable = false)
    @Enumerated(EnumType.STRING)
    private AccountState accountState;

    public UserEntity(SignUpDto signUpDto) {
        this.username = signUpDto.getUsername();
        this.password = signUpDto.getPassword();
        this.name = signUpDto.getName();
        this.email = signUpDto.getEmail();
        this.accountState = AccountState.ACTIVE;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("UserEntity{");
        sb.append("userId=").append(userId);
        sb.append(", username='").append(username).append('\'');
        sb.append(", password='").append(password).append('\'');
        sb.append(", name='").append(name).append('\'');
        sb.append(", email='").append(email).append('\'');
        sb.append(", accountState=").append(accountState);
        sb.append('}');
        return sb.toString();
    }
}
