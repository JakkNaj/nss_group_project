package cz.cvut.fel.nss.user_relations.service;

import cz.cvut.fel.nss.user_relations.dao.BlockRepository;
import cz.cvut.fel.nss.user_relations.entity.Block;
import cz.cvut.fel.nss.user_relations.exceptions.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BlockService {
    private final BlockRepository blockRepository;

    @Autowired
    public BlockService(BlockRepository blockRepository) {
        this.blockRepository = blockRepository;
    }

    public void blockUser(String blockedUsername) {
        //let's imagine our user is logged in
        //usually it would Principal.getUsername()
        String loggedUser = "user1";

        //check if the user is not trying to block himself
        if (blockedUsername.equals(loggedUser)) {
            throw new BadRequestException("You can't block yourself");
        }

        Block block = new Block();
        block.setBlockedUsername(blockedUsername);
        block.setBlockingUsername(loggedUser);

        blockRepository.save(block);
    }

    public void unblockUser(String username) {
        //let's imagine our user is logged in
        //usually it would Principal.getUsername()
        String loggedUser = "user1";

        Optional<Block> block = blockRepository.findBlockByBlockedUsernameAndBlockedUsername(loggedUser, username);
        if (block.isEmpty()) {
            throw new BadRequestException("You can't unblock a user you didn't block");
        }

        blockRepository.delete(block.get());
    }
}
