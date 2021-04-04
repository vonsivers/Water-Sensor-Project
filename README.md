# Floßlände Water Sensor Project

The motivation for this project was to provide information about the water level for river surfers at Floßlände Munich. 
The sensor measures the water level and water temperature and sends the data via LoRaWAN. The data is then made publically available on a website.

![](/pics/IMG_20210402_162449.jpg)

## Bill of Materials

* 1x [Dragino LSN50v2 Waterproof Sensor LoRa Node](https://www.antratek.de/lsn50-v2-waterproof-lora-sensor-node) 
* 1x [Dragino LPS8 Indoor LoRaWAN Gateway](https://www.antratek.de/lps8-indoor-lorawan-gateway) (Note: Instead of buying the DS18B20 separately it can already be purchased with the LSN50v2 as a bundle)
* 1x [DS18B20 Waterproof Temperature Sensor] (https://www.ebay.de/c/24024575509?iid=252715001868)
* 1x [Taciak Serie 142 Level Sensor, 240-33Ohm, 500mm length](https://www.ebay.de/itm/Tankgeber-Serie-142-240-33-Ohm-L%C3%A4nge-500-mm/254839594214?ssPageName=STRK%3AMEBIDX%3AIT&_trksid=p2060353.m2749.l2649)
	* Special version with potted cable (1m length) instead of connector
* 1x [Cable Feedthrough IP68, 3.5-6mm](https://www.ebay.de/itm/3x-InLine-Kabeldurchfuhrung-Nylon-IP68-3-5-6mm-schwarz-10-Stuck-/174716312211?hash=item28ade75a93)
* 1x [1kOhm resistor, thru hole](https://www.conrad.de/de/p/thomsen-metallschicht-widerstand-1-k-axial-bedrahtet-0207-0-6-w-0-1-1-st-423360.html)


## Assembly

The LSN50 has only one cable feedthrough, therefore, a hole was drilled into the housing for the installation of an additional cable feedthrough. This allows the connection of both the temperature and the level sensor. 
All cables were shortened to the desired length and connected to the screw terminals of the LSN50 according to the schematic below.
Both sensors can be read out by the LSN50v2 in the default working mode (MOD=1).

![](/pics/IMG_20210402_145948.jpg)
![](/pics/IMG_20210402_162306.jpg)
![](/schematic/LSN50v2_schematic.PNG)


## LoRaWAN Network Setup

We use the free cuommunity edition of [The Things Stack v3](https://www.thethingsnetwork.org/docs/the-things-stack/index.html) LoRaWAN network server. 
You have to make an account there and then register both the node and the gateway. 
In principle the node data can also be received by other already existing gateways on The Things Network (see the [global coverage map](https://www.thethingsnetwork.org/map) but we installed our own gateway nearby to guarantee network coverage.
To create an account for The Things Stack v3 follow this [link](https://account.thethingsnetwork.org/). 


### LPS8 Gateway

Follow the instructions on The Things Industries website [here](https://www.thethingsindustries.com/docs/gateways/dragino-lps8/) or in the [LPS8 manual](https://www.dragino.com/downloads/index.php?dir=LoRa_Gateway/LPS8/) on how to configure and register the gateway.

### LSN50v2

The LSN50 can join The Things Network via Over-The-Air-Activation (OTAA) without any extra configuration it just needs to be registered as a device on The Things Stack. 
Follow the instructions in the [LSN50 manual](https://www.dragino.com/downloads/index.php?dir=LSN50-LoRaST/) and on The Things Industries website [here](https://www.thethingsindustries.com/docs/devices/adding-devices/) on how to do this. 

**Note: There is a sticker inside the packaging box of the LSN50 with the needed DEV EUI and APP KEY that can easily be overseen.**

## Getting the Data on the Web

There are several ways to make the sensor data publically available on the internet.
The easiest is to a use an IoT dashboard like [tago.io](tago.io). 
You can make a free account there but it has some limitations on the total data that can be uploaded.
Follow these [instructions](https://www.thethingsindustries.com/docs/integrations/webhooks/creating-webhooks/) on how to create a webhook to visualize your data on tago.io.

