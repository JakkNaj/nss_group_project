package cz.cvut.fel.nss.user_relations.service;

import cz.cvut.fel.nss.user_relations.dao.FriendRequestRepository;
import cz.cvut.fel.nss.user_relations.dao.FriendshipRepository;
import cz.cvut.fel.nss.user_relations.entity.FriendRequest;
import cz.cvut.fel.nss.user_relations.entity.Friendship;
import cz.cvut.fel.nss.user_relations.exceptions.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FriendRequestService {
    private final FriendRequestRepository friendRequestRepository;
    private final FriendshipRepository friendshipRepository;
    @Autowired
    public FriendRequestService(FriendRequestRepository friendRequestRepository, FriendshipRepository friendshipRepository) {
        this.friendRequestRepository = friendRequestRepository;
        this.friendshipRepository = friendshipRepository;
    }

    public List<FriendRequest> getAllFriendRequests(String username) {
        return friendRequestRepository.findAllBySenderUsername(username);
    }

    public List<FriendRequest> getAllFriendRequestsForRecipient(String username) {
        return friendRequestRepository.findAllByRecipientUsername(username);
    }

    public void sendFriendRequest(String sender, String recipient) {
        FriendRequest newFriendRequest = new FriendRequest();
        newFriendRequest.setSenderUsername(sender);
        newFriendRequest.setRecipientUsername(recipient);
        friendRequestRepository.save(newFriendRequest);
    }

    @Transactional
    public void acceptFriendRequest(String sender, String recipient) {
        Friendship friendship = new Friendship();
        friendship.setFriend1(sender);
        friendship.setFriend2(recipient);
        friendshipRepository.save(friendship);
        //remove friend request instance from friend request table
        friendRequestRepository.deleteAllBySenderUsernameAndRecipientUsername(sender, recipient);
    }

    public void declineFriendRequest(String sender, String recipient) {
        if (friendRequestRepository.findAllBySenderUsernameAndRecipientUsername(sender, recipient).isEmpty()) {
            throw new NotFoundException("You can't decline a friend request which does not exist");
        }
        friendRequestRepository.deleteAllBySenderUsernameAndRecipientUsername(sender, recipient);
    }

    public void deleteFriendRequest(String sender, String recipient) {
        if (friendRequestRepository.findAllBySenderUsernameAndRecipientUsername(sender, recipient).isEmpty()) {
            throw new NotFoundException("You can't decline a friend request which does not exist");
        }
        friendRequestRepository.deleteAllBySenderUsernameAndRecipientUsername(sender, recipient);
    }
}
