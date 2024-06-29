package cz.cvut.fel.nss.user_relations.dao;

import cz.cvut.fel.nss.user_relations.entity.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Integer> {
    @Query("SELECT f FROM Friendship f WHERE f.friend1Id = ?1 OR f.friend2Id = ?1")
    List<Friendship> findAllFriendshipsForUserId(int userId);

    @Query("SELECT f FROM Friendship f WHERE (f.friend1Id = ?1 AND f.friend2Id = ?2) OR (f.friend1Id = ?2 AND f.friend2Id = ?1)")
    Optional<Friendship> findByFriend1IdAndFriend2Id(int friend1Id, int friend2Id);

    @Query("DELETE FROM Friendship f WHERE (f.friend1Id = ?1 AND f.friend2Id = ?2) OR (f.friend1Id = ?2 AND f.friend2Id = ?1)")
    void deleteFriendshipBetweenUsers(int loggedInId, int deletedId);
}