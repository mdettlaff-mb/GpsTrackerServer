package mdettlaff.gpstracker.server.service;

import java.util.List;

import mdettlaff.gpstracker.server.domain.GpsLocation;
import mdettlaff.gpstracker.server.persistence.GpsLocationDao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GpsLocationService {

	private final GpsLocationDao feedItemDao;

	@Autowired
	public GpsLocationService(GpsLocationDao feedItemDao) {
		this.feedItemDao = feedItemDao;
	}

	@Transactional
	public void save(List<GpsLocation> locations) {
		for (GpsLocation location : locations) {
			feedItemDao.save(location);
		}
	}

	public List<GpsLocation> find() {
		return feedItemDao.find();
	}
}
