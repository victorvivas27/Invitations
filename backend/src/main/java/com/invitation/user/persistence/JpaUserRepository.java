package com.invitation.user.persistence;

import com.invitation.user.domain.User;
import com.invitation.user.mapper.UserPersistenceMapper;
import com.invitation.user.repository.UserRepository;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Repository;

@Repository
public class JpaUserRepository implements UserRepository {

    private final SpringDataUserJpaRepository repository;
    private final UserPersistenceMapper mapper;

    public JpaUserRepository(SpringDataUserJpaRepository repository, UserPersistenceMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public User save(User user) {
        return mapper.toDomain(repository.saveAndFlush(mapper.toEntity(user)));
    }

    @Override
    public Optional<User> findById(UUID id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public boolean existsByEmail(String email) {
        return repository.existsByEmail(email.trim().toLowerCase(Locale.ROOT));
    }

    @Override
    public boolean existsByPublicCode(String publicCode) {
        return repository.existsByPublicCode(publicCode.trim().toUpperCase(Locale.ROOT));
    }
}
