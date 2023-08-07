package ru.demetrious.watchlist.runner;

import java.awt.AWTException;
import java.awt.Desktop;
import java.awt.Image;
import java.awt.MenuItem;
import java.awt.PopupMenu;
import java.awt.TrayIcon;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import javax.imageio.ImageIO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("!local")
@Slf4j
public class SystemTrayExecutor implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments args) {
        System.setProperty("java.awt.headless", "false");
        addSystemTray();
    }

    // ===================================================================================================================
    // = Implementation
    // ===================================================================================================================

    private void addSystemTray() {
        if (java.awt.SystemTray.isSupported()) {
            try {
                Image image = ImageIO.read(new File("./resources/icons/watch-list.png"));
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
                java.awt.SystemTray.getSystemTray().add(trayIcon);
            } catch (IOException | AWTException e) {
                e.printStackTrace();
            }
        } else {
            log.warn("System tray does not supported");
        }
    }

    private void openHomePage() {
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
