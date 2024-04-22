package cz.cvut.fel.nss.user_relations.dao;

import cz.cvut.fel.nss.user_relations.entity.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Integer> {
    @Query("SELECT f FROM Friendship f WHERE f.friend1 = ?1 OR f.friend2 = ?1")
    List<Friendship> findAllFriendshipsForUsername(String username);

    @Query("DELETE FROM Friendship f WHERE (f.friend1 = ?1 AND f.friend2 = ?2) OR (f.friend1 = ?2 AND f.friend2 = ?1)")
    void deleteFriendshipBetweenUsers(String username1, String username2);

    @Query("SELECT f FROM Friendship f WHERE (f.friend1 = ?1 AND f.friend2 = ?2) OR (f.friend1 = ?2 AND f.friend2 = ?1)")
//    List<Friendship> existsFriendshipByFriend1AndFriend2(String username1, String username2);
//
    List<Friendship> findAllByFriend1AndFriend2(String friend1, String friend2);
}