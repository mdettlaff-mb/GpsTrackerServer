package mdettlaff.gpstracker.server.web;

import javax.servlet.Filter;
import javax.servlet.FilterRegistration.Dynamic;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;

import org.eclipse.jetty.servlets.GzipFilter;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

public class GpsTrackerWebAppInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {

	@Override
	protected Class<?>[] getRootConfigClasses() {
		return null;
	}

	@Override
	protected Class<?>[] getServletConfigClasses() {
		return new Class<?>[] {WebConfig.class};
	}

	@Override
	protected String[] getServletMappings() {
		return new String[] {"/"};
	}

	@Override
	public void onStartup(ServletContext servletContext) throws ServletException {
		super.onStartup(servletContext);
		configureGzipCompressionForJson(servletContext);
	}

	private void configureGzipCompressionForJson(ServletContext servletContext) {
		Filter filter = new GzipFilter();
		Dynamic registration = registerServletFilter(servletContext, filter);
		registration.setInitParameter("mimeTypes", "application/json");
		registration.addMappingForUrlPatterns(null, true, "/*");
	}
}
