package com.invitation.user.mapper;

import com.invitation.user.domain.User;
import com.invitation.user.persistence.UserJpaEntity;
import org.springframework.stereotype.Component;

@Component
public class UserPersistenceMapper {

    public UserJpaEntity toEntity(User user) {
        return new UserJpaEntity(user.getId(), user.getPublicCode(), user.getFirstName(),
                user.getLastName(), user.getEmail(), user.getPasswordHash(), user.getStatus(),
                user.getRole(), user.getCreatedAt(), user.getUpdatedAt(), user.getCreatedBy(), user.getUpdatedBy());
    }

    public User toDomain(UserJpaEntity entity) {
        return User.restore(new User.UserData(entity.getId(), entity.getPublicCode(),
                entity.getFirstName(), entity.getLastName(), entity.getEmail(),
                entity.getPasswordHash(), entity.getStatus(), entity.getRole(), entity.getCreatedAt(),
                entity.getUpdatedAt(), entity.getCreatedBy(), entity.getUpdatedBy()));
    }
}
