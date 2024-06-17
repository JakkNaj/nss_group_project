package cz.cvut.fel.nss.user_relations.dao;

import cz.cvut.fel.nss.user_relations.entity.FriendRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {

    List<FriendRequest> findAllBySenderUsername(String senderUsername);

    List<FriendRequest> findAllByRecipientUsername(String recipientUsername);

    void deleteAllBySenderUsernameAndRecipientUsername(String senderUsername, String recipientUsername);

    List<FriendRequest> findAllBySenderUsernameAndRecipientUsername(String senderUsername, String recipientUsername);

}
