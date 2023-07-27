package ru.demetrious.watchlist;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
@Slf4j
public class ClientsController {
    private final ClientRepository clientRepository;

    @GetMapping
    public List<Client> getClients() {
        List<Client> clientList = clientRepository.findAll();
        log.info("getClients: {}", clientList);
        return clientList;
    }

    @PostMapping
    public List<Client> setClients(@RequestBody List<Client> clientList) {
        log.info("setClients: {}", clientList);
        return clientRepository.saveAll(clientList);
    }
}
