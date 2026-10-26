package com.klef.soa.exam.service;

import java.util.List;
import com.klef.soa.exam.entity.CoworkingSpace;

public interface CoworkingSpaceService {

    CoworkingSpace addSpace(CoworkingSpace space);

    List<CoworkingSpace> getAllSpaces();

    CoworkingSpace getSpaceById(Long id);

    CoworkingSpace updateSpace(Long id, CoworkingSpace space);

    void deleteSpace(Long id);
}