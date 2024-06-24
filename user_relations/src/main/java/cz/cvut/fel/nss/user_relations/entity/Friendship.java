package cz.cvut.fel.nss.user_relations.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "friendship")
public class Friendship {
    @Id
    private long id;

    @Column(name="friend1", nullable = false)
    private int friend1Id;

    @Column(name="friend2", nullable = false)
    private int friend2Id;
}
