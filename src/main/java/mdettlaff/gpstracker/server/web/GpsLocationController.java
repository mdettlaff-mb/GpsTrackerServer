package mdettlaff.gpstracker.server.web;

import java.util.List;

import mdettlaff.gpstracker.server.domain.GpsLocation;
import mdettlaff.gpstracker.server.service.GpsLocationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/location")
public class GpsLocationController {

	private final GpsLocationService service;
	private final UserPreferences preferences;

	@Autowired
	public GpsLocationController(GpsLocationService service, UserPreferences preferences) {
		this.service = service;
		this.preferences = preferences;
	}

	@RequestMapping(value = "list", method = RequestMethod.POST)
	public @ResponseBody String postLocations(@RequestBody List<GpsLocation> locations) {
		service.save(locations);
		return "OK";
	}

	@RequestMapping(value = "list", method = RequestMethod.GET)
	public @ResponseBody List<GpsLocation> getLocations() {
		return service.find(preferences.getInterval());
	}
}
