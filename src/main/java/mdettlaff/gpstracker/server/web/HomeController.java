package mdettlaff.gpstracker.server.web;

import java.text.ParseException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import mdettlaff.gpstracker.server.domain.Interval;
import mdettlaff.gpstracker.server.service.GpsLocationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "")
public class HomeController {

	private final GpsLocationService service;
	private final UserPreferences preferences;

	@Autowired
	public HomeController(GpsLocationService service, UserPreferences preferences) {
		this.service = service;
		this.preferences = preferences;
	}

	@RequestMapping
	public ModelAndView home() {
		List<Date> dates = service.findTripDays();
		initPreferences(dates);
		Map<String, Object> model = new HashMap<>();
		model.put("dates", dates);
		model.put("preferences", preferences);
		return new ModelAndView("index", model);
	}

	@RequestMapping(value = "/date", method = RequestMethod.POST)
	@ResponseBody
	public void timeDaySetting(@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date date) {
		preferences.setDate(date);
	}

	@RequestMapping(value = "/interval", method = RequestMethod.POST)
	@ResponseBody
	public void timeIntervalSetting(
			@RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm") Date start,
			@RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm") Date end)
			throws ParseException {
		preferences.setInterval(new Interval(start, end));
	}

	private void initPreferences(List<Date> dates) {
		if (preferences.getInterval() == null) {
			preferences.setDate(dates.isEmpty() ? null : dates.get(0));
		}
	}
}
