package ru.demetrious.watchlist;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
