package cz.cvut.fel.nss.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

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
    @Basic(optional = false)
    @Column(name = "username", nullable = false, length = 255, unique = true)
    private String username;
    @Basic(optional = false)
    @Column(name = "password", nullable = false, length = 255)
    private String password;
    @Basic(optional = false)
    @Column(name = "name", nullable = false, length = 255)
    private String name;
    @Column(name = "account_state", nullable = false)
    private AccountState accountState;
    @OneToOne
    @JoinColumn(name = "picture_id")
    private PictureEntity pictureEntity;
}
