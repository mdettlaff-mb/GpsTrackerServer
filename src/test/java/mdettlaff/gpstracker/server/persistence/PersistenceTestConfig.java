package mdettlaff.gpstracker.server.persistence;

import java.util.Properties;

import javax.sql.DataSource;

import org.springframework.beans.factory.config.PropertyOverrideConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;

@Configuration
@ComponentScan(basePackageClasses = PersistenceConfig.class)
public class PersistenceTestConfig {

	@Bean
	public static PropertyOverrideConfigurer propertyOverrideConfigurer() {
		PropertyOverrideConfigurer bean = new PropertyOverrideConfigurer();
		Properties properties = new Properties();
		properties.setProperty("entityManagerFactory.jpaVendorAdapter.showSql", "true");
		bean.setProperties(properties);
		return bean;
	}

	@Bean
	public DataSource dataSource() {
		EmbeddedDatabaseBuilder builder = new EmbeddedDatabaseBuilder();
		builder.setType(EmbeddedDatabaseType.H2);
		builder.addDefaultScripts();
		return builder.build();
	}
}
