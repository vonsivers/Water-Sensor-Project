# Floßlände Water Sensor Project

The motivation for this project was to provide information about the water level for river surfers at Floßlände Munich. 
The sensor measures the water level and water temperature and sends the data via LoRaWAN. The data is then made publically available on a website.

![](/pics/IMG_20210402_162449.jpg)

## Bill of Materials

* 1x [Dragino LSN50v2 Waterproof Sensor LoRa Node](https://www.antratek.de/lsn50-v2-waterproof-lora-sensor-node) 
* 1x [Dragino LPS8 Indoor LoRaWAN Gateway](https://www.antratek.de/lps8-indoor-lorawan-gateway) 
* 1x [DS18B20 Waterproof Temperature Sensor](https://www.ebay.de/c/24024575509?iid=252715001868) (Note: Instead of buying the DS18B20 separately it can already be purchased with the LSN50v2 as a bundle)
* 1x [Taciak Serie 142 Level Sensor, 240-33Ohm, 500mm length](https://www.ebay.de/itm/Tankgeber-Serie-142-240-33-Ohm-L%C3%A4nge-500-mm/254839594214?ssPageName=STRK%3AMEBIDX%3AIT&_trksid=p2060353.m2749.l2649)
	* Special version with potted cable (1m length) instead of connector
* 1x [Cable Feedthrough IP68, 3.5-6mm](https://www.ebay.de/itm/3x-InLine-Kabeldurchfuhrung-Nylon-IP68-3-5-6mm-schwarz-10-Stuck-/174716312211?hash=item28ade75a93)
* 1x [1kOhm resistor, thru hole](https://www.conrad.de/de/p/thomsen-metallschicht-widerstand-1-k-axial-bedrahtet-0207-0-6-w-0-1-1-st-423360.html)

## Sensor Selection

I tested several sensors to measure the water level or water flow.

### Hall-effect Based Water Flow Sensor (e.g. [amazon](https://www.amazon.de/gp/product/B07QHYDJZK/ref=ppx_yo_dt_b_asin_title_o03_s00?ie=UTF8&psc=1))

Cheap and should generally work but might clog easily in dirty river water.
I also have my doubts about long term durability

### TL231 Water Level (Pressure) Sensor (e.g. [amazon](https://www.amazon.de/gp/product/B07T7NGWNT/ref=ppx_yo_dt_b_asin_title_o03_s00?ie=UTF8&psc=1))

Seems robust but needs a step-up module for the supply voltage and a current-voltage converter for readout.
Some good information on how to use this sensor can be found [here](https://www.turais.de/tl231-liquid-water-level-sensor/).

### eTape Liquid Level Sensor ([adafruit](https://www.adafruit.com/product/2656))

Small and easy to readout, looks like a good alternative to the float based sensor I used.
For outdoor use the casing of the contacts probably needs to be made waterproof.

### Float Based Sensors (e.g. [ebay](https://www.ebay.de/sch/i.html?_from=R40&_trksid=p2047675.m570.l1313&_nkw=tankgeber&_sacat=0))

I came across this type of sensor since it was shown as an example in the LSN50v2 manual.
They are available in different lengths and mainly used to measure the liquid level in fuel tanks of boats, hence the top flange.
It consist of a series of resistors that are connected by reed switches, the float contains a magnet that activates the switches so the total resistance changes depending on the float height. 
One disadvantage is the relatively low resistance (240-33Ohm for US, 0-190Ohm for EU standard) which generates only a small voltage drop when put in series with another current limiting resistor. 
I chose the US version because of the higher resistance.
The first sensor I bought from Osculati had a very bad height resolution of 2-5cm (distance of the reed switches), the one I selected above has 8mm resolution.
For outdoor use the connection of the cable on the top flange should be rated IP65, this is why I chose the potted cable instead of a connector.

## Assembly

The LSN50v2 has only one cable feedthrough, therefore, a hole was drilled into the housing for the installation of an additional cable feedthrough. This allows the connection of both the temperature and the level sensor. 
All cables were shortened to the desired length and connected to the screw terminals of the LSN50 according to the schematic below.
Both sensors can be read out by the LSN50v2 in the default working mode (MOD=1).

![](/pics/IMG_20210402_145948.jpg)
![](/pics/IMG_20210402_162306.jpg)
![](/schematic/LSN50v2_schematic.PNG)


## LoRaWAN Network Setup

I use the free community edition of [The Things Stack v3](https://www.thethingsnetwork.org/docs/the-things-stack/index.html) LoRaWAN network server. 
You have to make an account there and then register both the node and the gateway. 
In principle the node data can also be received by other already existing gateways on The Things Network (see the [global coverage map](https://www.thethingsnetwork.org/map)) but we installed our own gateway nearby to guarantee network coverage.
To create an account for The Things Stack v3 follow this [link](https://account.thethingsnetwork.org/). 


### LPS8 Gateway

Follow the instructions on The Things Industries website [here](https://www.thethingsindustries.com/docs/gateways/dragino-lps8/) or in the [LPS8 manual](https://www.dragino.com/downloads/index.php?dir=LoRa_Gateway/LPS8/) on how to configure and register the gateway.

### LSN50v2

The LSN50v2 can join The Things Network via Over-The-Air-Activation (OTAA) without any extra configuration it just needs to be registered as a device on The Things Stack. 
Follow the instructions in the [LSN50v2 manual](https://www.dragino.com/downloads/index.php?dir=LSN50-LoRaST/) and on The Things Industries website [here](https://www.thethingsindustries.com/docs/devices/adding-devices/) on how to do this. 

**Note: There is a sticker inside the packaging box of the LSN50v2 with the needed DEV EUI and APP KEY that can easily be overseen.**

## Water Level Calculation

The water level sensor changes resistance (about every 8mm) from 240Ohm at the bottom to 33Ohm at the top. 
The resistance is measured by measuring the voltage drop across the sensor which is put in series with the 1kOhm resistor.
The voltage measured by the ADC can be converted to the height of the sensor buoy using the following equation.

h = aV<sub>ADC</sub> / (V<sub>BAT</sub> - V<sub>ADC</sub>) + c

where h is the height of the buoy measured from the bottom, V<sub>ADC</sub> is the ADC voltage, V<sub>BAT</sub> is the battery voltage, and a and c are constants that depend on the resitance values and sensor length.
The constants a and c can in principle be calculated but I determined them by measuring the ADC voltage for different height values and a given battery voltage and then fitting the data points with the above equation.
The results are shown in the graph below.
The conversion factors are **a = -212** and **c = 58.3** to convert the voltages (in V) to the buoy height (in cm).
![](/sensor_calibration/sensor_calibration.png)

## Battery Life

The LSN50v2 works with a combination of a non-rechargable 4000mAh Li/SOCI2 battery and a super capacitor.
Because of the power consumption during deep sleep of the microcontroller the battery can last up to several years depending on the connected sensors, data transmission interval and transmission power.
There is a power consumption calculator tool available on the Dragino website [here](http://www.dragino.com/downloads/index.php?dir=LSN50-LoRaST/&file=Battery_Calculator_v1.0.xlsx).
In our case the estimated battery life is **1.25 years** at a data transmission interval of 5 minutes.

## Getting the Data on the Web

### IoT Dashboards

There are several ways to make the sensor data publically available on the internet.
The easiest is to a use an IoT dashboard like [tago.io](https://tago.io/). 
You can make a free account there but it has some limitations on the total data that can be uploaded.
The Things Stack v3 offers templates for webooks to tago.io and other IoT dashboards (see instructions[here](https://www.thethingsindustries.com/docs/integrations/webhooks/creating-webhooks/))

### Google Spreadsheets

It is possible to send your data from The Things Network to a Google Spreadsheet as decribed [here](https://github.com/Uspizig/Ttn-gooogle-script).
I adapted the process for The Things Stack v3 and the data format of the LSN50v2:
1. Open Google Drive: https://drive.google.com/drive and login with your google account.
1. Press New: Google Spreadsheet
1. Save the browser adress: https://docs.google.com/spreadsheets/d/xxxxxxxxxx/edit#gid=0
1. Goto to Tools: Script Editor
1. Paste the code copied from /scripts/code.gs of this repository
1. Replace the "YOURSheetdID" with the xxx of the browser adress from Step 3
1. Save and Publish -Publish as a Web App.
1. Select Start as Me and access Everyone even Anonymous: Save the address (https://script.google.com/macros/s/xxx/exec) that is displayed
1. Open in another browser window your The Things Stack v3 account: Select Application -> YOUR Application -> Integrations -> Webhooks -> Add Webhook -> Custom Webhook
	1. Enter a Webhook ID (e.g. google-sheets)
	1. Select Webhook Format: JSON
	1. Base URL: paste the URL from your Google Script editor (Step 8)
	1. select Uplink Message Enabled (the text field next to it should be left blank)

Edit the script according to your needs or your payload. !You need a matching Payload Decoder on TTN! Otherwise the script will fail.