package mdettlaff.gpstracker.server.domain;

import java.util.Date;
import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;

@Entity
public class GpsLocation {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gpslocationseq")
	@SequenceGenerator(name = "gpslocationseq", sequenceName = "GPS_LOCATION_ID_SEQ", allocationSize = 100)
	private Long id;
	private double latitude;
	private double longitude;
	private Date time;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public double getLatitude() {
		return latitude;
	}

	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}

	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}

	public Date getTime() {
		return time;
	}

	public void setTime(Date time) {
		this.time = time;
	}

	@Override
	public boolean equals(Object obj) {
		if (obj == null) {
			return false;
		}
		if (getClass() != obj.getClass()) {
			return false;
		}
		GpsLocation other = (GpsLocation) obj;
		return Objects.equals(getId(), other.getId());
	}

	@Override
	public int hashCode() {
		return Objects.hashCode(getId());
	}
}
