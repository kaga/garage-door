This is a NodeJs application that expose the garage door state via a RestApi interface

###Run

	> npm install
	> npm run start

I made the service avaiable on start up using systemctl, may be not ideal for real production envirnment =)

	> cp garagerestapi.service /etc/systemd/system/garagerestapi.service
	> systemctl daemon-reload
	> systemctl enable garagerestapi
	> systemctl start garagerestapi 
(you will need sudo for those)

## Setup doorswitch as a pull up input
docker run --rm --cap-add SYS_RAWIO --device /dev/mem hypriot/rpi-gpio -g mode 21 up
docker run --rm --cap-add SYS_RAWIO --device /dev/mem hypriot/rpi-gpio readall

###Interface

####GET /v2/garage/state
	{
		"timestamp":"2016-06-16T13:03:08.901Z",  
		"isOpen":false
	}

####GET /v2/ping

####POST /v2/garage/toggle