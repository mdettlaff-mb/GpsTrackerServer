package mdettlaff.gpstracker.server.persistence;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import mdettlaff.gpstracker.server.domain.GpsLocation;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class GpsLocationDaoTest extends AbstractPersistenceTest {

	@PersistenceContext
	private EntityManager em;

	@Autowired
	private GpsLocationDao dao;

	@Test
	public void testFind() {
		// exercise
		List<GpsLocation> results = dao.find();
		// verify
		assertEquals(2, results.size());
		GpsLocation result1 = results.get(0);
		assertEquals(Long.valueOf(1), result1.getId());
		assertNotNull(result1.getTime());
		assertEquals(3.0, result1.getLatitude(), 0.001);
		assertEquals(4.55, result1.getLongitude(), 0.001);
		GpsLocation result2 = results.get(1);
		assertEquals(Long.valueOf(2), result2.getId());
		assertNotNull(result2.getTime());
		assertEquals(3.1, result2.getLatitude(), 0.001);
		assertEquals(4.57, result2.getLongitude(), 0.001);
	}

	@Test
	public void testSave() {
		// prepare data
		GpsLocation location = new GpsLocation();
		location.setTime(new Date());
		location.setLatitude(8.55);
		location.setLongitude(47.37);
		// exercise
		dao.save(location);
		// verify
		GpsLocation result = em.find(GpsLocation.class, 100L);
		assertEquals(Long.valueOf(100), result.getId());
		assertNotNull(result.getTime());
		assertEquals(8.55, result.getLatitude(), 0.001);
		assertEquals(47.37, result.getLongitude(), 0.001);
	}
}
