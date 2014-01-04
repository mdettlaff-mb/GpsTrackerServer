curl -si -H "Content-type: application/json" -X POST \
	-d '[{"latitude":47.3765,"longitude":8.5545,"time":1388863832489},{"latitude":47.3764,"longitude":8.5546,"time":1388863832489}]' \
	http://localhost:8080/location/list

