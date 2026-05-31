package com.smartprint.smartservice.mappers;

import com.smartprint.smartservice.dtos.AddressRequest;
import com.smartprint.smartservice.dtos.AddressResponse;
import com.smartprint.smartservice.models.Address;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.UUID;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface AddressMapper {
    AddressResponse toAddressResponse(Address address);

    Address toAddressModelFromAddressRequest(AddressRequest request);
}

