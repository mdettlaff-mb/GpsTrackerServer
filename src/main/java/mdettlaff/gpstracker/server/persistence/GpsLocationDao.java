package mdettlaff.gpstracker.server.persistence;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import mdettlaff.gpstracker.server.domain.GpsLocation;

import org.springframework.stereotype.Repository;

@Repository
public class GpsLocationDao {

	@PersistenceContext
	private EntityManager em;

	@SuppressWarnings("unchecked")
	public List<GpsLocation> find() {
		return em.createQuery("FROM GpsLocation ORDER BY time").getResultList();
	}

	public void save(GpsLocation location) {
		em.persist(location);
		em.flush();
	}
}
