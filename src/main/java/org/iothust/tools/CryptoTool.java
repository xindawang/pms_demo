package org.iothust.tools;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.NoSuchAlgorithmException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;
/**
 * Created by lyerox on 2017/6/28.
 */
public class CryptoTool {
    private static final String ALOGRITHM = "AES";
    private static final String TRANSFORMATION = "AES";
    private static final String SECRET_KEY = "ABCDEFGHHGFEDCBA";
    public static void encrypt(File inputFile, File outputFile) throws CryptoException{
        doCrypto(Cipher.ENCRYPT_MODE, SECRET_KEY, inputFile, outputFile);
    }

    public static void decrypt(File inputFile, File ouputFile) throws CryptoException{
        doCrypto(Cipher.DECRYPT_MODE, SECRET_KEY, inputFile, ouputFile);
    }

    private static void doCrypto(int cipherMode, String key, File inputFile, File outputFile) throws CryptoException{
        try {
            Key secretKey = new SecretKeySpec(key.getBytes(), ALOGRITHM);
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(cipherMode, secretKey);

            FileInputStream inputStream = new FileInputStream(inputFile);
            byte[] inputBytes = new byte[(int) inputFile.length()];
            inputStream.read(inputBytes);

            byte[] outputBytes = cipher.doFinal(inputBytes);

            FileOutputStream outputStream = new FileOutputStream(outputFile);
            outputStream.write(outputBytes);

            inputStream.close();
            outputStream.close();
        }catch (NoSuchPaddingException | NoSuchAlgorithmException
                | InvalidKeyException | BadPaddingException
                | IllegalBlockSizeException | IOException ex) {
            throw new CryptoException("Error encrypting/decrypting file", ex);
        }
    }
}
