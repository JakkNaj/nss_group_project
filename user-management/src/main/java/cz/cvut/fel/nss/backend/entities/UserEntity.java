package cz.cvut.fel.nss.backend.entities;

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
    private int id;
    @Column(name = "username", nullable = false, length = 255, unique = true)
    private String username;
    @Column(name = "password", nullable = false, length = 255)
    private String password;
    @Column(name = "name", nullable = false, length = 255)
    private String name;
    @Column(name = "account_state", nullable = false)
    private AccountState accountState;
}
