package com.invitation.invitation.application;

@FunctionalInterface
public interface PublicSlugGenerator {
    String generate(String eventName);
}
