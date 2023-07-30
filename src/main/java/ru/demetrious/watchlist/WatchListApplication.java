package ru.demetrious.watchlist;

import java.awt.AWTException;
import java.awt.Desktop;
import java.awt.Image;
import java.awt.MenuItem;
import java.awt.PopupMenu;
import java.awt.SystemTray;
import java.awt.TrayIcon;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Objects;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import javax.imageio.ImageIO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@Slf4j
public class WatchListApplication {
    public static void main(String[] args) {
        SpringApplication.run(WatchListApplication.class, args);
        System.setProperty("java.awt.headless", "false");

        addSystemTray();
    }

    private static void addSystemTray() {
        if (SystemTray.isSupported()) {
            try {
                Image image = ImageIO.read(Objects.requireNonNull(WatchListApplication.class.getResourceAsStream("/static/logo192.png")));
                PopupMenu popupMenu = new PopupMenu();
                MenuItem openBrowser = new MenuItem("Open Browser");
                MenuItem exit = new MenuItem("Exit");
                TrayIcon trayIcon = new TrayIcon(image, "WatchList", popupMenu);

                openBrowser.addActionListener(e -> {
                    openBrowser.setEnabled(false);
                    ExecutorService executorService = Executors.newSingleThreadExecutor();

                    executorService.submit(() -> {
                        openHomePage();
                        openBrowser.setEnabled(true);
                        executorService.shutdown();
                    });
                });
                exit.addActionListener(e -> {
                    exit.setEnabled(false);
                    System.exit(13);
                });
                popupMenu.add(openBrowser);
                popupMenu.add(exit);
                trayIcon.setImageAutoSize(true);
                SystemTray.getSystemTray().add(trayIcon);
            } catch (IOException | AWTException e) {
                throw new RuntimeException(e);
            }
        } else {
            log.warn("System tray does not supported");
        }
    }

    private static void openHomePage() {
        if (Desktop.isDesktopSupported()) {
            try {
                Desktop.getDesktop().browse(new URI("http://localhost:8080/"));
            } catch (IOException | URISyntaxException e) {
                e.printStackTrace();
            }
        } else {
            log.warn("System desktop does not supported");
        }
    }
}
