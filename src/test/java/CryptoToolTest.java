import org.iothust.DemoApplication;
import org.iothust.tools.CryptoException;
import org.iothust.tools.CryptoTool;

import java.io.File;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
/**
 * Created by lyerox on 2017/6/28.
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DemoApplication.class)
public class CryptoToolTest {

    @Test
    public void cryptoToolTest() {
        String key = "0123456788765432";
        File encryptedFile = new File("document.encrypted");
        File decryptedFile = new File("document.decrypted");

        try {
            CryptoTool.encrypt(key, decryptedFile, decryptedFile);
//            CryptoTool.decrypt(key, decryptedFile, decryptedFile);
        } catch (CryptoException ex) {
            System.out.println(ex.getMessage());
            ex.printStackTrace();
        }
    }
}
