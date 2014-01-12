package mdettlaff.gpstracker.server.web;

import java.util.Date;

import mdettlaff.gpstracker.server.domain.Interval;

import org.joda.time.DateMidnight;
import org.joda.time.DateTime;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class UserPreferences {

	private Date date;
	private Interval interval;

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
		this.interval = dateToInterval(date);
	}

	private Interval dateToInterval(Date date) {
		if (date == null) {
			return new Interval(null, null);
		}
		DateMidnight start = new DateMidnight(date);
		DateTime end = start.toDateTime().plusDays(1).minusMillis(1);
		return new Interval(start.toDate(), end.toDate());
	}

	public Interval getInterval() {
		return interval;
	}

	public void setInterval(Interval interval) {
		this.interval = interval;
		this.date = null;
	}
}
