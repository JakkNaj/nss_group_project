package cz.cvut.fel.nss.user_relations.controller;

import cz.cvut.fel.nss.user_relations.service.BlockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/block")
public class BlockController {

    @Autowired
    BlockService blockService;

    @PostMapping("/{username}")
    public ResponseEntity<Void> blockUser(@PathVariable String username){
        blockService.blockUser(username);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{username}")
    public ResponseEntity<Void> unblockUser(@PathVariable String username){
        blockService.unblockUser(username);
        return ResponseEntity.noContent().build();
    }
}
