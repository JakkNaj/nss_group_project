package cz.cvut.fel.nss.user_relations.dao;

import cz.cvut.fel.nss.user_relations.entity.Block;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlockRepository extends JpaRepository<Block, Long> {
    Optional<Block> findByBlockingIdAndBlockedId(int blockingId, int blockedId);
}
