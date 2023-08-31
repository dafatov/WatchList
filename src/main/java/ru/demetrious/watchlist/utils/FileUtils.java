package ru.demetrious.watchlist.utils;

import com.owenfeehan.pathpatternfinder.commonpath.FindCommonPathElements;
import com.owenfeehan.pathpatternfinder.commonpath.PathElements;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Path;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Consumer;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.apache.commons.io.IOCase;

import static java.util.Optional.empty;
import static java.util.Optional.of;
import static org.apache.commons.io.FileUtils.forceDelete;
import static ru.demetrious.watchlist.manager.FileManager.BUFFER_SIZE;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class FileUtils {
    public static void copyDirectory(AtomicBoolean isInterrupted, File source, File target, Consumer<Long> lengthConsumer, Consumer<File> fileConsumer) throws IOException {
        if (!target.exists()) {
            target.mkdirs();
        }

        for (String fileName : Objects.requireNonNull(source.list())) {
            copyDirectoryOrFile(isInterrupted, new File(source, fileName), new File(target, fileName), lengthConsumer, fileConsumer);
        }
    }

    public static Optional<Path> normalizePaths(List<Path> pathList) {
        return switch (pathList.size()) {
            case 0 -> empty();
            case 1 -> of(pathList.get(0).getRoot());
            default -> FindCommonPathElements.findForFilePaths(pathList, IOCase.INSENSITIVE)
                .map(PathElements::toPath)
                .or( () -> of(pathList.get(0).getRoot()));
        };
    }

    // ===================================================================================================================
    // = Implementation
    // ===================================================================================================================

    private static void copyDirectoryOrFile(AtomicBoolean isInterrupted, File source, File target, Consumer<Long> lengthConsumer, Consumer<File> fileConsumer) throws IOException {
        if (isInterrupted.get()) {
            return;
        }

        if (source.isDirectory()) {
            copyDirectory(isInterrupted, source, target, lengthConsumer, fileConsumer);
        } else {
            if (!target.exists() || target.length() != source.length()) {
                copyFile(isInterrupted, source, target, lengthConsumer);
            } else {
                lengthConsumer.accept(target.length());
            }

            if (!isInterrupted.get()) {
                fileConsumer.accept(source);
            }
        }
    }

    private static void copyFile(AtomicBoolean isInterrupted, File source, File target, Consumer<Long> lengthConsumer) throws IOException {
        try (
            InputStream inputStream = new FileInputStream(source);
            OutputStream outputStream = new FileOutputStream(target)
        ) {
            byte[] buffer = new byte[BUFFER_SIZE];
            int length;

            while ((length = inputStream.read(buffer)) > 0 && !isInterrupted.get()) {
                outputStream.write(buffer, 0, length);
                lengthConsumer.accept((long) length);
            }
        } catch (IOException e) {
            isInterrupted.set(true);
            throw e;
        } finally {
            if (isInterrupted.get()) {
                forceDelete(target);
            }
        }
    }
}
