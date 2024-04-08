package cz.cvut.fel.nss.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    @Basic
    @Column(name = "username", nullable = false, length = 255, unique = true)
    private String username;
    @Basic
    @Column(name = "password", nullable = false, length = 255)
    private String password;
    @Basic
    @Column(name = "name", nullable = false, length = 255)
    private String name;
    @OneToOne
    @JoinColumn(name = "picture_id")
    private Picture picture;
}
