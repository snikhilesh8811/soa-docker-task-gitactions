package com.klef.soa.exam.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.klef.soa.exam.entity.CoworkingSpace;
import com.klef.soa.exam.service.CoworkingSpaceService;

@RestController
@RequestMapping("/coworking")
@CrossOrigin(origins = "*")
public class CoworkingSpaceController {

    private final CoworkingSpaceService service;

    public CoworkingSpaceController(CoworkingSpaceService service) {
        this.service = service;
    }

    @PostMapping("/add")
    public CoworkingSpace addSpace(@RequestBody CoworkingSpace space) {
        return service.addSpace(space);
    }

    @GetMapping("/all")
    public List<CoworkingSpace> getAllSpaces() {
        return service.getAllSpaces();
    }

    @GetMapping("/{id}")
    public CoworkingSpace getSpaceById(@PathVariable Long id) {
        return service.getSpaceById(id);
    }

    @PutMapping("/update/{id}")
    public CoworkingSpace updateSpace(
            @PathVariable Long id,
            @RequestBody CoworkingSpace space) {
        return service.updateSpace(id, space);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteSpace(@PathVariable Long id) {
        service.deleteSpace(id);
        return "Coworking space deleted successfully";
    }
}