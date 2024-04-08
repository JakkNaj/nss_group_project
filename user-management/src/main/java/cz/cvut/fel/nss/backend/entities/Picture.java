package cz.cvut.fel.nss.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Picture {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    @Basic
    private PictureFormat format;
    @Basic
    private byte[] storedPicture;
    @Basic
    private byte[] thumbnail;
    @OneToOne(mappedBy = "picture")
    private User user;
}
