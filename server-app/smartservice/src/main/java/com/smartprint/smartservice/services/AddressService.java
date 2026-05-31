package com.smartprint.smartservice.services;

import com.smartprint.smartservice.dtos.AddressRequest;
import com.smartprint.smartservice.dtos.AddressResponse;
import com.smartprint.smartservice.mappers.AddressMapper;
import com.smartprint.smartservice.models.Address;
import com.smartprint.smartservice.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final AddressRepository addressRepository;
    private AddressMapper addressMapper;

    public List<AddressResponse> list(UUID userId){
        List<Address> addresses = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId);
        if(addresses == null || addresses.isEmpty()) return List.of();
        return addresses.stream().map(addressMapper::toAddressResponse).toList();
    }

    @Transactional
    public AddressResponse create(UUID userId, AddressRequest request){
        boolean firstAddress = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId).isEmpty();
        boolean makeDefault = firstAddress || Boolean.TRUE.equals(request.getIsDefault());

        if(makeDefault)
            addressRepository.clearDefault(userId);


        Address address = addressMapper.toAddressModelFromAddressRequest(request);
        address.setUserId(userId);
        address.setIsDefault(makeDefault);
        return addressMapper.toAddressResponse(addressRepository.save(address));
    }

    @Transactional
    public AddressResponse update(UUID userId, UUID id, AddressRequest request){
        Address addr = ownAddress(userId, id);
        boolean makeDefault = !addr.getIsDefault() || Boolean.TRUE.equals(request.getIsDefault());

        if(makeDefault) {
            addressRepository.clearDefault(userId);
            addr.setIsDefault(true);
        }

        return addressMapper.toAddressResponse(addressRepository.save(addr));
    }

    @Transactional
    public void delete(UUID userId, UUID id){
        Address addr = ownAddress(userId, id);
        boolean wasDefault = addr.getIsDefault();
        addressRepository.delete(addr);
        if(wasDefault){
            addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId).stream().findFirst().ifPresent(addr2 -> {
                addr2.setIsDefault(true);
                addressRepository.save(addr2);
            });
        }
    }

    @Transactional
    public AddressResponse setDefault(UUID userId, UUID id) {
        Address addr = ownAddress(userId, id);
        if (!addr.getIsDefault()) {
            addressRepository.clearDefault(userId);
            addr.setIsDefault(true);
            addressRepository.save(addr);
        }
        return addressMapper.toAddressResponse(addr);
    }

    private Address ownAddress(UUID userid, UUID id){
        Address address = addressRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found"));
        if(!address.getUserId().equals(userid)){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to access this address");
        }
        return address;
    }
}
