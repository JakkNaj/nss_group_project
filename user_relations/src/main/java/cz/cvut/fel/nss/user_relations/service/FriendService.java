package cz.cvut.fel.nss.user_relations.service;

import cz.cvut.fel.nss.user_relations.entity.Friendship;
import cz.cvut.fel.nss.user_relations.exceptions.NotFoundException;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import cz.cvut.fel.nss.user_relations.dao.FriendshipRepository;

import java.util.List;

@Service
public class FriendService {
    @Autowired
    private FriendshipRepository friendshipRepository;


    public List<Integer> getAllFriendIds(int userId) {
        List<Friendship> friendships = friendshipRepository.findAllFriendshipsForUserId(userId);

        return friendships.stream().map(friendship -> {
            if (friendship.getFriend1Id() == userId) {
                return friendship.getFriend2Id();
            } else {
                return friendship.getFriend1Id();
            }
        }).toList();
    }

    @SneakyThrows
    public void removeFriend(int deletedId) {
        //let's imagine our user is logged in
        //usually it would Principal.getUsername()
        int loggedInId = 1;

        if (friendshipRepository.findByFriend1IdAndFriend2Id(loggedInId, deletedId).isEmpty()) {
            throw new NotFoundException("Friendship does not exist");
        }
        friendshipRepository.deleteFriendshipBetweenUsers(loggedInId, deletedId);
    }
}
