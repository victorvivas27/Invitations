package com.invitation.activation.infrastructure;

import com.invitation.activation.application.port.ActivationEmailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class JavaMailActivationEmailSender implements ActivationEmailSender {
    private final JavaMailSender mailSender;

    public JavaMailActivationEmailSender(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void send(String recipientName, String recipientEmail, String activationUrl,
            long expiresInSeconds) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipientEmail);
        message.setSubject("Activate your Invitation account");
        message.setText("Hello " + recipientName + ",\n\nUse this secure link to set your password:\n"
                + activationUrl + "\n\nThe link expires in " + expiresInSeconds
                + " seconds. If you did not expect this message, ignore it.");
        mailSender.send(message);
    }
}
