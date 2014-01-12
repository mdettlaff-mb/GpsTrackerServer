package mdettlaff.gpstracker.server.persistence;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import mdettlaff.gpstracker.server.domain.GpsLocation;
import mdettlaff.gpstracker.server.domain.Interval;

import org.springframework.stereotype.Repository;

@Repository
public class GpsLocationDao {

	@PersistenceContext
	private EntityManager em;

	@SuppressWarnings("unchecked")
	public List<GpsLocation> find(Interval interval) {
		StringBuilder queryString = new StringBuilder();
		queryString.append("FROM GpsLocation ");
		if (interval.getStart() != null && interval.getEnd() != null) {
			queryString.append("WHERE time BETWEEN :start AND :end ");
		} else if (interval.getStart() != null) {
			queryString.append("WHERE time >= :start ");
		} else if (interval.getEnd() != null) {
			queryString.append("WHERE time <= :end ");
		}
		queryString.append("ORDER BY time");
		Query query = em.createQuery(queryString.toString());
		if (interval.getStart() != null) {
			query.setParameter("start", interval.getStart());
		}
		if (interval.getEnd() != null) {
			query.setParameter("end", interval.getEnd());
		}
		return query.getResultList();
	}

	public void save(GpsLocation location) {
		em.persist(location);
		em.flush();
	}

	@SuppressWarnings("unchecked")
	public List<Date> findDistinctDates() {
		return em.createNativeQuery("SELECT DISTINCT CAST(time AS date) FROM GpsLocation ORDER BY time DESC")
				.getResultList();
	}
}
