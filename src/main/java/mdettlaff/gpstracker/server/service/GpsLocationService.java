package mdettlaff.gpstracker.server.service;

import java.util.Date;
import java.util.List;

import mdettlaff.gpstracker.server.domain.GpsLocation;
import mdettlaff.gpstracker.server.domain.Interval;
import mdettlaff.gpstracker.server.persistence.GpsLocationDao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GpsLocationService {

	private final GpsLocationDao locationDao;

	@Autowired
	public GpsLocationService(GpsLocationDao locationDao) {
		this.locationDao = locationDao;
	}

	@Transactional
	public void save(List<GpsLocation> locations) {
		for (GpsLocation location : locations) {
			locationDao.save(location);
		}
	}

	public List<GpsLocation> find(Interval interval) {
		return locationDao.find(interval);
	}

	public List<Date> findTripDays() {
		return locationDao.findDistinctDates();
	}
}
