package cz.cvut.fel.nss.user_management.config;

import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        Cache usersCache = new ConcurrentMapCache("users");
        Cache profilePhotoCache = new ConcurrentMapCache("profilePhotoThumbnail");
        cacheManager.setCaches(List.of(usersCache, profilePhotoCache));
        return cacheManager;
    }
}
