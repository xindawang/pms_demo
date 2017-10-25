package org.iothust.tools;

/**
 * Created by lyerox on 2017/6/28.
 */
public class CryptoException  extends Exception{
    public CryptoException(){

    }
    public CryptoException(String message, Throwable throwable){
        super(message, throwable);
    }
}
