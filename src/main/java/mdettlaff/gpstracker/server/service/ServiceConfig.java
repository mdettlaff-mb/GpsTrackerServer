package mdettlaff.gpstracker.server.service;

import mdettlaff.gpstracker.server.persistence.PersistenceConfig;

import org.springframework.context.annotation.AdviceMode;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement(mode = AdviceMode.ASPECTJ)
@ComponentScan(basePackageClasses = ServiceConfig.class)
@Import(PersistenceConfig.class)
public class ServiceConfig {
}
