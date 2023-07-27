package ru.demetrious.watchlist;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.awt.Desktop;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Objects;

@SpringBootApplication
public class WatchListApplication {
    private static final String ELECTRON_EXE = "./electron.exe";

    public static void main(String[] args) {
        SpringApplication.run(WatchListApplication.class, args);
//        openHomePage();
        launchElectron();
    }

    private static void launchElectron() {
        extractElectron();
        try {
            Process process = new ProcessBuilder(ELECTRON_EXE).start();
            System.out.println("ended");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void extractElectron() {
        try {
            Files.copy(
                Objects.requireNonNull(WatchListApplication.class.getResourceAsStream("/electron/electron Setup 1.0.0.exe")),
                new File(ELECTRON_EXE).toPath(),
                StandardCopyOption.REPLACE_EXISTING
            );
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void openHomePage() {
        var url = "http://localhost:8080/";

        if (Desktop.isDesktopSupported()) {
            try {
                Desktop.getDesktop().browse(new URI(url));
            } catch (IOException | URISyntaxException e) {
                e.printStackTrace();
            }
        } else {
            try {
                new ProcessBuilder("rundll32", "url.dll,FileProtocolHandler", url).start();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
