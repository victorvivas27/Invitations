package com.invitation.invitation.web;

import com.invitation.invitation.application.GetPublicInvitationUseCase;
import com.invitation.invitation.application.PublicInvitation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.util.HtmlUtils;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api/public/invitations")
public class PublicInvitationController {
    private final GetPublicInvitationUseCase useCase;
    private final String frontendUrl;
    public PublicInvitationController(GetPublicInvitationUseCase useCase,
            @Value("${app.frontend-url:http://localhost:5173}") String frontendUrl) {
        this.useCase = useCase;
        this.frontendUrl = frontendUrl.replaceAll("/+$", "");
    }
    @GetMapping("/{slug}")
    public PublicInvitation get(@PathVariable String slug) { return useCase.get(slug); }

    @GetMapping(value = "/{slug}/share", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> share(@PathVariable String slug) {
        PublicInvitation invitation = useCase.get(slug);
        String target = frontendUrl + "/i/" + UriComponentsBuilder.newInstance()
                .pathSegment(slug).build().encode().toUriString();
        String title = escape(invitation.shareTitle());
        String description = escape(invitation.shareDescription());
        String image = escape(invitation.shareImageUrl() == null ? "" : invitation.shareImageUrl());
        String url = escape(target);
        String html = """
                <!doctype html><html lang="es"><head><meta charset="utf-8">
                <meta name="viewport" content="width=device-width,initial-scale=1">
                <title>%s</title><meta name="description" content="%s">
                <meta property="og:type" content="website"><meta property="og:title" content="%s">
                <meta property="og:description" content="%s"><meta property="og:image" content="%s">
                <meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
                <meta property="og:url" content="%s"><meta name="twitter:card" content="summary_large_image">
                <meta http-equiv="refresh" content="0;url=%s"><link rel="canonical" href="%s">
                </head><body><p>Abriendo invitación…</p><script>location.replace(%s)</script></body></html>
                """.formatted(title, description, title, description, image, url, url, url,
                        javascriptString(target));
        return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(html);
    }

    private static String escape(String value) { return HtmlUtils.htmlEscape(value, "UTF-8"); }
    private static String javascriptString(String value) {
        return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"")
                .replace("<", "\\u003c").replace(">", "\\u003e") + "\"";
    }
}
