<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-type" content="text/html; charset=UTF-8">
		<title>GPS Tracker</title>
		<link rel="stylesheet" href="/resources/css/main.css" type="text/css">
		<script src="/resources/js/lib/jquery-2.0.3.js"></script>
		<script src="http://maps.google.com/maps/api/js?sensor=false"></script>
		<script src="/resources/js/lib/date.format.js"></script>
		<script src="/resources/js/src/map.js"></script>
		<script src="/resources/js/src/main.js"></script>
		<script src="/resources/js/lib/flot/jquery.flot.js"></script>
		<script src="/resources/js/lib/flot/jquery.flot.navigate.js"></script>
		<script src="/resources/js/lib/flot/jquery.flot.time.js"></script>
		<script src="/resources/js/lib/flot/jquery.flot.crosshair.js"></script>
		<script src="/resources/js/lib/flot/jquery.flot.selection.js"></script>
		<script src="/resources/js/lib/flot/jquery.flot.resize.js"></script>
		<script src="/resources/js/src/graph.js"></script>
	</head>
	<body>
		<div class="top">
			<div class="controls">
				Day:
				<select id="date-combobox">
					<option></option>
					<c:forEach items="${dates}" var="date">
						<option value="${date}" ${date eq sessionScope['scopedTarget.userPreferences'].date ? 'SELECTED' : ''}>
							<fmt:formatDate value="${date}" />
						</option>
					</c:forEach>
				</select>
				Start date:
				<input id="interval-start" type="text" value="<fmt:formatDate value="${sessionScope['scopedTarget.userPreferences'].interval.start}" pattern="yyyy-MM-dd HH:mm" />">
				End date:
				<input id="interval-end" type="text" value="<fmt:formatDate value="${sessionScope['scopedTarget.userPreferences'].interval.end}" pattern="yyyy-MM-dd HH:mm" />">
				<button id="interval-submit" type="button">Submit</button>
			</div>
		</div>
		<div class="content">
			<div id="map" class="map"></div>
			<div class="graph-container">
				<div id="graph-placeholder" class="graph-placeholder"></div>
			</div>
		</div>
	</body>
</html>
