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
import java.util.Optional;

@Service
public class FriendRequestService {
    private final FriendRequestRepository friendRequestRepository;
    private final FriendshipRepository friendshipRepository;
    @Autowired
    public FriendRequestService(FriendRequestRepository friendRequestRepository, FriendshipRepository friendshipRepository) {
        this.friendRequestRepository = friendRequestRepository;
        this.friendshipRepository = friendshipRepository;
    }

    public List<FriendRequest> getAllFriendRequestsForRecipient(int userId) {
        return friendRequestRepository.findAllByRecipientId(userId);
    }

    public void sendFriendRequestToUserId(int recipient) {
        FriendRequest newFriendRequest = new FriendRequest();

        //let's imagine our user is logged in
        //usually it would Principal.getUsername()
        int sender = 1;

        newFriendRequest.setSenderId(sender);
        newFriendRequest.setRecipientId(recipient);
        friendRequestRepository.save(newFriendRequest);
    }

    @Transactional
    public void acceptFriendRequestFromUserId(int sender) {
        int recipient = 1;
        Optional<FriendRequest> optionalFriendRequest = friendRequestRepository.findAllBySenderIdAndRecipientId(sender, recipient);
        if (optionalFriendRequest.isEmpty()) {
            throw new NotFoundException("You can't accept a friend request which does not exist");
        }
        FriendRequest friendRequest = optionalFriendRequest.get();
        Friendship friendship = new Friendship();
        friendship.setFriend1Id(friendRequest.getSenderId());
        friendship.setFriend2Id(friendRequest.getRecipientId());

        friendshipRepository.save(friendship);
        friendRequestRepository.delete(friendRequest);
    }

    public void declineFriendRequestFromUserId(int sender) {
        int recipient = 1;

        Optional<FriendRequest> optionalFriendRequest = friendRequestRepository.findAllBySenderIdAndRecipientId(sender, recipient);
        if (optionalFriendRequest.isEmpty()) {
            throw new NotFoundException("You can't decline a friend request which does not exist");
        }
        friendRequestRepository.delete(optionalFriendRequest.get());
    }

    public void deleteFriendRequestToUserId(int recipient) {
        int sender = 1;

        Optional<FriendRequest> optionalFriendRequest = friendRequestRepository.findAllBySenderIdAndRecipientId(sender, recipient);
        if (optionalFriendRequest.isEmpty()) {
            throw new NotFoundException("You can't delete a friend request which does not exist");
        }
        friendRequestRepository.delete(optionalFriendRequest.get());
    }
}
