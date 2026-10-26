package com.klef.soa.exam.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.klef.soa.exam.entity.CoworkingSpace;
import com.klef.soa.exam.repository.CoworkingSpaceRepository;
import com.klef.soa.exam.service.CoworkingSpaceService;

@Service
public class CoworkingSpaceServiceImpl implements CoworkingSpaceService {

    private final CoworkingSpaceRepository repository;

    public CoworkingSpaceServiceImpl(CoworkingSpaceRepository repository) {
        this.repository = repository;
    }

    @Override
    public CoworkingSpace addSpace(CoworkingSpace space) {
        space.setId(null);
        return repository.save(space);
    }

    @Override
    public List<CoworkingSpace> getAllSpaces() {
        return repository.findAll();
    }

    @Override
    public CoworkingSpace getSpaceById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coworking space not found"));
    }

    @Override
    public CoworkingSpace updateSpace(Long id, CoworkingSpace space) {
        CoworkingSpace existing = getSpaceById(id);

        existing.setSpaceName(space.getSpaceName());
        existing.setLocation(space.getLocation());
        existing.setDeskCount(space.getDeskCount());
        existing.setMonthlyFee(space.getMonthlyFee());

        return repository.save(existing);
    }

    @Override
    public void deleteSpace(Long id) {
        CoworkingSpace space = getSpaceById(id);
        repository.delete(space);
    }
}