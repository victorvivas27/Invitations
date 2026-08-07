# Task 25 - Edit Existing Invitation

## Objective

Implement the ability for an authenticated user to edit an invitation that they previously created.

This feature must reuse the existing architecture and invitation creation flow whenever possible.

---

# Functional requirements

An authenticated user must be able to edit only invitations that belong to them.

The editing experience should feel almost identical to the current invitation creation wizard.

The user must be able to modify:

- Event title
- Event description
- Date and time
- Location
- Contact information
- RSVP configuration
- Theme
- Colors
- Section backgrounds
- Images
- Any other editable invitation data already supported by the system

---

# Image management

The image editor must support three operations simultaneously.

## Keep existing images

Existing images that the user does not modify must remain associated with the invitation.

---

## Delete existing images

The user must be able to remove one or more existing images.

Deleted images must:

- disappear from the invitation
- be removed from Cloudinary
- be removed from the database

---

## Upload new images

The user must be able to upload additional images during editing.

New images must follow the exact same upload flow already implemented during invitation creation.

Reuse the existing upload service.

Do not duplicate upload logic.

---

# Ownership validation

The backend must validate that:

- the authenticated user owns the invitation

If not:

- return the appropriate authorization error

No invitation can be edited by another user.

---

# Frontend requirements

Reuse the existing invitation wizard whenever possible.

Avoid creating a second wizard only for editing.

If necessary, extend the current implementation to support both creation and editing modes.

The user experience should remain consistent.

---

# Backend requirements

Reuse the existing services and repositories whenever possible.

Prefer extending the existing architecture instead of creating parallel implementations.

Maintain the current domain-oriented package structure.

---

# Non-functional requirements

- No breaking changes.
- Preserve compatibility with existing invitations.
- Reuse existing components.
- Reuse existing services.
- Avoid duplicated code.
- Keep the implementation simple.
- Preserve current API conventions.

---

# Mobile-first

Follow all rules defined in AGENTS.md.

The editing experience must work correctly on:

- Mobile
- Tablet
- Desktop

---

# Validation

Before finishing, verify:

Backend

```
cd backend
./gradlew clean test check bootJar
```

Frontend

```
cd frontend
pnpm exec tsc -b
pnpm lint
pnpm test
pnpm build
```

Repository

```
git diff --check
```

---

# Agent instructions

Before writing code:

1. Read AGENTS.md.
2. Inspect the current implementation.
3. Identify reusable components.
4. Identify reusable services.
5. Produce an implementation plan.
6. List every file that will be modified.
7. Wait for user approval.

Do not modify any file until the implementation plan has been approved.

After approval:

- Modify only the necessary files.
- Keep changes as small as possible.
- Explain any architectural decision.
- Summarize all modified files when finished.

---

# Acceptance criteria

The feature will be considered complete when:

- A logged-in user can edit their own invitation.
- Existing images can be kept.
- Existing images can be deleted.
- New images can be uploaded.
- Cloudinary remains synchronized.
- Existing functionality continues working.
- No regression is introduced.
- All validations pass successfully.
