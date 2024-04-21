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


    public List<Friendship> getAllFriends(String username) {
        return friendshipRepository.findAllFriendshipsForUsername(username);
    }

    @SneakyThrows
    public void removeFriend(String loggedInUsername, String username) {
        if (friendshipRepository.findAllByFriend1AndFriend2(loggedInUsername, username).isEmpty()) {
            throw new NotFoundException("Friendship does not exist");
        }
        friendshipRepository.deleteFriendshipBetweenUsers(loggedInUsername, username);
    }


}
