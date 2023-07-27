package ru.demetrious.watchlist;

import java.awt.AWTException;
import java.awt.Desktop;
import java.awt.Image;
import java.awt.MenuItem;
import java.awt.PopupMenu;
import java.awt.SystemTray;
import java.awt.TrayIcon;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import javax.imageio.ImageIO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@Slf4j
public class WatchListApplication {
    private static final String ELECTRON_EXE = "./electron.exe";

    public static void main(String[] args) {
        SpringApplication.run(WatchListApplication.class, args);
        System.setProperty("java.awt.headless", "false");

        addSystemTray();
        openHomePage();
    }

    private static void addSystemTray() {
        if (SystemTray.isSupported()) {
            try {
                Image image = ImageIO.read(Objects.requireNonNull(WatchListApplication.class.getResourceAsStream("/static/logo192.png")));
                PopupMenu popupMenu = new PopupMenu();
                MenuItem openElectron = new MenuItem("Open Electron");
                MenuItem openBrowser = new MenuItem("Open Browser");
                MenuItem exit = new MenuItem("Exit");
                TrayIcon trayIcon = new TrayIcon(image, "WatchList", popupMenu);

                openElectron.addActionListener(e -> {
                    openElectron.setEnabled(false);
                    ExecutorService executorService = Executors.newSingleThreadExecutor();

                    executorService.submit(() -> {
                        launchElectron().ifPresentOrElse(
                            process -> process.onExit().thenAccept(p -> openElectron.setEnabled(true)),
                            () -> openElectron.setEnabled(true)
                        );
                        executorService.shutdown();
                    });
                });
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
                popupMenu.add(openElectron);
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

    private static Optional<Process> launchElectron() {
        extractElectron();
        try {
            return Optional.of(new ProcessBuilder(ELECTRON_EXE).start());
        } catch (IOException e) {
            e.printStackTrace();
        }

        return Optional.empty();
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
