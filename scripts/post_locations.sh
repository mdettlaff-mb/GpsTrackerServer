curl -si -H "Content-type: application/json" -X POST \
	-d '[{"latitude":47.3765,"longitude":8.5545,"time":1388863832489,"accuracy":8.0,"altitude":35.0277,"bearing":0.0,"speed":0.0},{"latitude":47.3764,"longitude":8.5546,"time":1388863832597,"accuracy":6.0,"altitude":41.4329,"bearing":165.69052,"speed":0.28236645}]' \
	http://localhost:8080/location/list

