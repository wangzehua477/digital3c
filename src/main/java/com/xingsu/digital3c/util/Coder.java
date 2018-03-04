package com.xingsu.digital3c.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.Charset;
import java.security.MessageDigest;
import java.util.Base64;

/**
 * 包括base64,md5,sha1,sha256,hmac_sha1的编解码方法，字符串的编码方式都为utf-8
 */
public class Coder {
    public static final Charset defaultCharset = Charset.forName("utf-8");

    public static String b64Encode(String str) {
        byte[] b = Base64.getEncoder().encode(str.getBytes(defaultCharset));
        return new String(b, defaultCharset);
    }

    public static String b64Encode(byte[] data) {
        byte[] b = Base64.getEncoder().encode(data);
        return new String(b, defaultCharset);
    }

    public static byte[] b64Decode(String str) {
        try {
            return Base64.getDecoder().decode(str.getBytes(defaultCharset));
        } catch (Exception e) {
            return null;
        }
    }

    public static String b64Decode2String(String str) {
        try {
            byte[] b = Base64.getDecoder().decode(str.getBytes(defaultCharset));
            return new String(b, defaultCharset);
        } catch (Exception e) {
            return null;
        }
    }

    public static String md5(String str) {
        try {
            MessageDigest md5 = MessageDigest.getInstance("MD5");
            md5.update(str.getBytes(defaultCharset));

            return toHexStr(md5.digest());
        } catch (Exception e) {
            return null;
        }
    }

    public static String md5(byte[] data) {
        try {
            MessageDigest md5 = MessageDigest.getInstance("MD5");
            md5.update(data);

            return toHexStr(md5.digest());
        } catch (Exception e) {
            return null;
        }
    }

    public static String sha1(String str) {
        try {
            MessageDigest sha1 = MessageDigest.getInstance("SHA-1");
            sha1.update(str.getBytes(defaultCharset));

            return toHexStr(sha1.digest());
        } catch (Exception e) {
            return null;
        }
    }

    public static String sha1(byte[] data) {
        try {
            MessageDigest sha1 = MessageDigest.getInstance("SHA-1");
            sha1.update(data);

            return toHexStr(sha1.digest());
        } catch (Exception e) {
            return null;
        }
    }

    public static String sha256(String str) {
        try {
            MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
            sha256.update(str.getBytes(defaultCharset));

            return toHexStr(sha256.digest());
        } catch (Exception e) {
            return null;
        }
    }

    public static String sha256(byte[] data) {
        try {
            MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
            sha256.update(data);

            return toHexStr(sha256.digest());
        } catch (Exception e) {
            return null;
        }
    }

    public static byte[] hmac_sha1(String key, String str) {
        try {
            byte[] k = key.getBytes(defaultCharset);
            SecretKeySpec sks = new SecretKeySpec(k, "HmacSHA1");
            Mac mac = Mac.getInstance("HmacSHA1");
            mac.init(sks);

            return mac.doFinal(str.getBytes(defaultCharset));
        } catch (Exception e) {
            return null;
        }
    }

    public static byte[] hmac_sha1(String key, byte[] data) {
        try {
            byte[] k = key.getBytes(defaultCharset);
            SecretKeySpec sks = new SecretKeySpec(k, "HmacSHA1");
            Mac mac = Mac.getInstance("HmacSHA1");
            mac.init(sks);

            return mac.doFinal(data);
        } catch (Exception e) {
            return null;
        }
    }

    private static String toHexStr(byte[] data) {
        StringBuilder hexValue = new StringBuilder();
        for (byte d : data) {
            int val = ((int)d) & 0xff;
            if (val < 16)
                hexValue.append("0");
            hexValue.append(Integer.toHexString(val));
        }

        return hexValue.toString();
    }
}