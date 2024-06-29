package cz.cvut.fel.nss.user_relations.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "friendRequest")
public class FriendRequest {

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "sender", nullable = false)
    private int senderId;

    @Column(name = "recipient", nullable = false)
    private int recipientId;
}
