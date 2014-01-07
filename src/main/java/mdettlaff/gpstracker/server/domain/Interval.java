package mdettlaff.gpstracker.server.domain;

import java.util.Date;

public class Interval {

	private final Date start;
	private final Date end;

	public Interval(Date start, Date end) {
		this.start = start;
		this.end = end;
	}

	public Date getStart() {
		return start;
	}

	public Date getEnd() {
		return end;
	}
}
