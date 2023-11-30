package ru.demetrious.watchlist.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import ru.demetrious.watchlist.adapter.rest.dto.ShikimoriUserRsDto;
import ru.demetrious.watchlist.feign.dto.UserDto;

@Mapper
public abstract class ShikimoriUserMapper {
    static final String PERSONAL_DATA_HIDDEN = "Личные данные скрыты";

    @Mappings({
        @Mapping(target = "avatar", source = "image.x32"),
        @Mapping(target = "isPublic", expression = "java(!userDto.getCommon_info().contains(PERSONAL_DATA_HIDDEN))")
    })
    public abstract ShikimoriUserRsDto userDtoToShikimoriUserRsDto(UserDto userDto);
}
