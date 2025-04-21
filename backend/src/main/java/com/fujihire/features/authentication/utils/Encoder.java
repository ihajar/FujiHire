package com.fujihire.features.authentication.utils;

import java.security.MessageDigest;
import java.util.Base64;

import org.springframework.stereotype.Component;

@Component
public class Encoder {
   public String encode(String rawString) {
    try {
        MessageDigest digest =  MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(rawString.getBytes());
        return Base64.getEncoder().encodeToString(hash);
    } catch (Exception e) {
        throw new RuntimeException("Error encoding string!");
    }
   }

   public Boolean matches(String rawString, String encodedString) {
    return encode(rawString).equals(encodedString);
   }
}
