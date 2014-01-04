package mdettlaff.gpstracker.server.persistence;

import java.net.URI;
import java.net.URISyntaxException;

import javax.sql.DataSource;

import org.apache.commons.dbcp.BasicDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.datasource.init.DataSourceInitializer;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import com.google.common.base.Objects;

@Configuration
@PropertySource("classpath:jdbc.properties")
public class PersistenceConfig {

	private @Value("${jdbc.databaseUrl}") String databaseUrl;
	private @Value("${jdbc.driverClassName}") String driverClassName;

	@Bean
	public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
		return new PropertySourcesPlaceholderConfigurer();
	}

	@Bean
	public JpaTransactionManager transactionManager() throws Exception {
		return new JpaTransactionManager(entityManagerFactory().getObject());
	}

	@Bean
	public LocalContainerEntityManagerFactoryBean entityManagerFactory() throws Exception {
		LocalContainerEntityManagerFactoryBean bean = new LocalContainerEntityManagerFactoryBean();
		bean.setDataSource(dataSource());
		bean.setPackagesToScan("mdettlaff.gpstracker.server.domain");
		bean.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
		return bean;
	}

	@Bean
	public DataSource dataSource() throws URISyntaxException {
		URI uri = new URI(Objects.firstNonNull(System.getenv("DATABASE_URL"), databaseUrl));
		BasicDataSource bean = new BasicDataSource();
		bean.setDriverClassName(driverClassName);
		bean.setUrl("jdbc:postgresql://" + uri.getHost() + ":" + uri.getPort() + uri.getPath());
		bean.setUsername(uri.getUserInfo().split(":")[0]);
		bean.setPassword(uri.getUserInfo().split(":")[1]);
		return bean;
	}

	@Bean
	public DataSourceInitializer dataSourceInitializer() throws URISyntaxException {
		DataSourceInitializer bean = new DataSourceInitializer();
		bean.setDataSource(dataSource());
		ResourceDatabasePopulator databasePopulator = new ResourceDatabasePopulator();
		ClassPathResource dataResource = new ClassPathResource("init-data.sql");
		databasePopulator.setScripts(new Resource[] {dataResource});
		databasePopulator.setContinueOnError(true);
		bean.setDatabasePopulator(databasePopulator);
		return bean;
	}
}
