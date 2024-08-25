package com.himedia.srShopServer.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender JMSender;

    @Value("${spring.mail.username}")
    private static String sendEmail;
    private static int number; //보내딜 인증 코드 저장 변수


    public int sendMail(String mail) {
        //(int) Math.random() * (최댓값 - 최솟값 + 1) + 최솟값
        number = (int) (Math.random() * (90000))+10000;

        //전송될 이메일 내용(수신자, 제목, 내용 등등) 구성객체
        MimeMessage message = JMSender.createMimeMessage();
        try {
            message.setFrom(sendEmail);
            message.setRecipients(MimeMessage.RecipientType.TO,mail);
            message.setSubject("이메일 인증");
            String body = "";
            body += "<h3>"+"요청하신 인증 번호입니다."+"</h3>";
            body += "<h1>"+number+"</h1>";
            body += "<h3>"+"감사합니다"+"</h3>";
            message.setText(body,"UTF-8","html");

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }

        JMSender.send(message); //구성완료된 message 를 JMSender로 전송

        return number;
    }
}
