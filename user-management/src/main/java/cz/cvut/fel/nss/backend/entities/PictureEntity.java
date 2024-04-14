package cz.cvut.fel.nss.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class PictureEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    @Basic(optional = false)
    @Column(name = "format", nullable = false)
    private PictureFormat format;
    @Basic(optional = false)
    @Column(name = "stored_picture", nullable = false)
    private byte[] storedPicture;
    @Basic(optional = false)
    @Column(name = "thumbnail", nullable = false)
    private byte[] thumbnail;
    @OneToOne(mappedBy = "pictureEntity")
    private UserEntity userEntity;
}
