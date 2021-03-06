# Update for Phase III of EXSCALABAR Software Development

**Current Status as of 27 September 2015**

## Server Side Development

### Developed Aspects

* We currently have a fully developed software set for the Meerstetter TECs.  One big issue is that we likely burned out the provided Peltier element by providing an amperage that was higher than spec'ed.  Unfortunately, we do not have this spec in hand and therefore it is unclear what this upper end is.  Aside from this, the TEC seems to be responsive and sending back data in a reliable manner.  We changed the setting on the TEC to return temperature from a thermistor, but the temperature appears to be incorrect so we have either wired this up incorrectly or it is not properly configured.  Either way, we will assume that the controller software is behaving as specified and will rely on UK Met to perform more extensive testing at this point.
* The Vaisala software set appears to be complete and returns data as expected.
* The Honeywell PPT software set is complete and the device appears to be returning data as expected.
* We have a system that returns data as expected from these three devices at regular intervals.  The system is configurable and uses the INI file located on the server side to determine locations, IDs and operating parameters for returning data.
* We have a mechanism in place for allowing the user to specify how data is routed for calculations on the CRD (no similar mechanism is necessary for the PAS as it will not be using ambient data for local, real-time calculations).  The routing is defined in the INI file.
* We have a in place a mechanism for maintaining current control settings for communication with the client.  These settings are maintained on the *server side only*; i.e. when a control setting is changed on the client side and the server responds appropriately, it will fill in that value in the table.
* Data is mirrored on the drives (when available) and is configured via the INI file.  The initial file saving state is defined in the INI (default is ``TRUE``).
* Data is regularly provided for broadcast and may include waveform data from the CRD and PAS.  The addition of waveform data increases the network load substantially and therefore should only be used on a LAN capable of handling this traffic.  Currently, the flow of this waveform data is controlled via entries in the INI file and is fairly crass (you can not specify cells for the waveform data nor can you specify what waveform data you receive - the client will simply receive all or nothing).
* The CVT data maintained by the server (current control values) are made available regularly on demand.  If there is no change in control values, the data is returned as an empty object (and less the client demands it via a switch).  

The system appears to be robust: it writes to file, responds to commands and shutsdown when requested (for anyone who has dealt with a large application, this is a *big* issue).  In addition to the major items above, we have been implementing a lot of the additional DIO requested over the past several months.  Much of it is in place but untested.  

The server has been placed on a DMZ on our network and we have tested remote communication.  There seems to be no issue communicating or operating on the server from a network outside of the server LAN.

### Outstanding Issues

Currently, the major issue that is outstanding (and of current focus) is the development of the architecture of the calibration schemes.  The calibration architecture is sketched out - initially it will consist of a single reusable actor that will launch on demand (i.e. when a calibration is requested).  It will consume an XML file related to the calibration which is generated either

* by the UI, or
* hand edited by the user.

A calibration file will look something like the following (which is for an O3 cal):

```xml
<?xml version="1.0" encoding="utf-8"?>
<OZONE>
	<Wait>20<\Wait>
	<Filter>FALSE<\Filter>
	<O2 Valve>FALSE<\O2 Valve>
	<O3 Generator>FALSE<\O3 Generator>
	<QO2>100<\QO2>
	<O2 Valve>FALSE<\O2 Valve>
<\OZONE>
```

The files are simple and this one was generated by the user interface (shown below).

Other outstanding issues on the server side are:

* The Humidifier routine developed for standalone operation has not been folded into the whole application.  We are still waiting to hear from UK Met regarding what changes will be needed to make this functional.
* RS485 communication with the TE Technology is not fully fleshed out.  It came to light recently that the command structure is slightly different between the RS232 and RS485 protocols and a 1:1 port will not be possible.  The changes are minor but will require some testing.
* The clock for ozone control is currently not implemented or tested (this is part of the calibration scheme).
* We are currently doing *nothing* with the UDP data that we may receive.  The intent is to just bounce the data to the client for text display.  No scheme has been developed for dong this and currently this is **low priority**.
* Little effort has been placed in developing documentation of the software architecture and flow.  As we draw near the period for actual delivery of the hardware to UK Met, this will require more attention.
* Power DIO is in place but the client side communication for switching this DIO is not behaving as expected.

## Client Side Development

I recently discussed the design for the client at a meeting here in Colorado and described the UI as the *Return of the Jedi* Death Star - functional but not pretty.  With the upcoming possibility of sending the hardware back, we have been putting a lot of effort into making sure that communication is in place for actually operating the instrument using a client interface.  This has included not only populating controls but designing how the UI conveys state.  The biggest issues are 

* Providing for some configurability with regards to device communication (such as with Alicats, TECs, PPTs and Vaisalas) given the system may not know the initial configuration at startup.  Much of this has been sorted but needs more extensive testing.
* Reliably displaying data without consuming unnecessary resources.  We recently hit a snag with [NVD3](http://nvd3.org/) when attempting to display the ringdown data returned by the server (see [this issue at stack**overflow**](http://stackoverflow.com/questions/32785163/nvd3-used-with-angular-nvd3-is-slooooowwwww/32791685#32791685) if you are interested to know more - one of the respondents, Thomson Comer, is located here on the front range and I have been speaking with him directly concerning this).  This is a big issue for us and so we are spending some effort to get this sorted as this will have implications for the whole application.  

Below are some snapshots of the current UI.  It is important to keep in mind this is rough.  The sidebar is likely going away and much of the functionality will be placed in the footer.  Common elements in the different images are:

* A navigation bar which allows the user to navigate through the interface.  *System Control* contains much of the instrument and device control functionality (not sure if I am keen on this layout).  Some common functionality that is not related to device or instrument control is accessed through the glyphs on the right hand side of the navigation bar.
* A footer which contains the time returned by the system (which currently just says not connected in the images as the system is not connected) as well as three badges which contain numbers indicating how many informational, warning and error messages have been thrown by the system.
* A sidebar to the right which will go away.
* Tabs internal to each page which, if there is a lot we wish to display, contain different aspects of the device or instrument (such as controls, indicators or graphs).

The state of the user interface is in flux and any requests or suggestions are welcomed.

### Ozone Cals
![O3 Cal](http://i.imgur.com/a6RLIrJ.png)

### PAS Controls
![PAS Controls](http://i.imgur.com/8PaGsyH.png)

### CRD Controls
![CRD Controls](http://i.imgur.com/2Dxa5sM.png)

### CRD with Possible New Graph
![CRD Graph](http://i.imgur.com/euKvM3T.png)
