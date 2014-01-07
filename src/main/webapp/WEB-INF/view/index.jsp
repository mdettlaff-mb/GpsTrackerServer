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
		<!--<script src="http://maps.google.com/maps/api/js?sensor=false"></script>-->
		<script src="/resources/js/lib/date.format.js"></script>
		<script src="/resources/js/src/main.js"></script>
		<!--<script src="/resources/js/src/resize.js"></script>-->
		<script src="/resources/js/lib/jquery-ui.min.js"></script>
		<script src="/resources/js/lib/jquery.flot.min.js"></script>
		<script src="/resources/js/lib/jquery.flot.navigate.min.js"></script>
		<script src="/resources/js/lib/jquery.flot.resize.min.js"></script>
		<script src="/resources/js/lib/jquery.flot.time.min.js"></script>
		<script src="/resources/js/lib/jquery.flot.crosshair.min.js"></script>
		<script src="/resources/js/lib/jquery.flot.selection.min.js"></script>
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

		<div id="map" class="map"></div>

		<div class="demo-container">
			<div id="placeholder" class="demo-placeholder"></div>
		</div>
	</body>
</html>
