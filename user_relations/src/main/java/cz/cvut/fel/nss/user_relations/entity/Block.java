package cz.cvut.fel.nss.user_relations.entity;

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
@Table(name = "block")
public class Block {
    @Id
    private long id;

    private int blockingId;
    private int blockedId;
}