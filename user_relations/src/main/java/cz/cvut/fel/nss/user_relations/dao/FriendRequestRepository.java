package cz.cvut.fel.nss.user_relations.dao;

import cz.cvut.fel.nss.user_relations.entity.FriendRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    List<FriendRequest> findAllByRecipientId(int recipientId);

    Optional<FriendRequest> findAllBySenderIdAndRecipientId(int senderId, int recipientId);
}
