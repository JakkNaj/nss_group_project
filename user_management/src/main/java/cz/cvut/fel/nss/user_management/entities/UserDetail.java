package cz.cvut.fel.nss.user_management.entities;

import org.springframework.data.annotation.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.*;

@Document(collection = "userDetail")
@Getter
@NoArgsConstructor
public class UserDetail {
    @Id
    private long userId; // same as user's userId
    private Map<UserDetailKey, UserDetailElement> userDetails;

    public UserDetail(long userId) {
        this.userId = userId;
    }

    public void addValue(UserDetailKey key, UserDetailElement element) {
        if (this.userDetails == null) {
            this.userDetails = new EnumMap<>(UserDetailKey.class);
        }
        this.userDetails.put(key, element);
    }

    public void removeValue(UserDetailKey key) {
        if (this.userDetails == null) {
            return;
        }
        this.userDetails.remove(key);
    }

    public <T extends UserDetailElement> Optional<T> getValue(UserDetailKey key, Class<T> type) {
        if (userDetails == null) {
            return Optional.empty();
        }
        UserDetailElement detailElement = userDetails.get(key);
        if (type.isInstance(detailElement)) {
            return Optional.of(type.cast(detailElement));
        } else {
            return Optional.empty();
        }
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("UserDetail{");
        sb.append("userId=").append(userId);
        sb.append(", value=").append(userDetails);
        sb.append('}');
        return sb.toString();
    }
}
