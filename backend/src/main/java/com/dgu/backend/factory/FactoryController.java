package com.dgu.backend.factory;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/factories")
@RequiredArgsConstructor
public class FactoryController {

    private final FactoryRepository factoryRepository;

    @GetMapping
    public List<Factory> getAll() {
        return factoryRepository.findAll();
    }
}