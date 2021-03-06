## CRD Data Route

The ``CRD Data Route`` property of the controller is a reference to a DVR that contains a variant data object.  This variant data object conatins information about how data from different devices will be routed to the CRD.  For normal operation, the CRD requires information from external devices to perform certain calcualtions.  This data that is required is:

* ``P`` - a pressure in mb.
* ``T`` - temperature in degrees Celsius
* ``Q`` - flow rate in lpm

This data is required for every cell in order to provide acurate estimates of extinction and extinction related variables.  In addition, each cell will require the purge flow rate for the purposes of determining dilution.  

### Establishing Routes via the INI File

The routes are wired using entries from the configuration file under the section ``CRDS``. The route is established via the key ``Cell_i.x`` where ``i`` is the cell number (0...number of cells-1) and ``x`` is one of the variables described above.  The value corresponds to a device ID defined in one of the sections for the devices.  For instance, a pressure transducer may return a temperature ``T`` and a pressure ``P``, so, the user may specify that cell 0 pressure and temperature are defined by the PPT device ID (as defined by the key ``IDs`` under the ``PPT`` section) pDryBlue.  In the INI file, this might look like: 

```INI
[PPT]
Port = COM5
Serial Config.baud rate = 28800
Serial Config.data bits = 8
Serial Config.stop bits = 10
Serial Config.parity = 0
Serial Config.flow control = 0
Serial Config.endModeforReads = 2
Serial Config.endModeforWrites = 2
Msg Config.sendEndEn = TRUE
Msg Config.suppEnEnRd = FALSE
Msg Config.termChar = 13
Msg Config.EnTermChar = TRUE
IDs = pDryBlue
pDryBlue.address = 1
Units = mbar
Nsteps = 10
Pmin = 200
twait = 30

[CRDS]
flaser = 1000,2000
dc = 0.5,0.5
Coadd = 1,1,1,1,1
lambda = 660,405,405,405,405
ncells = 5
; Initial RH setpoints; these refer to cells 2 and 5 respectively
RH = 90, 70
; Optical lengths of cavities
lcell = 1,1,1,1,1
expFit = LRS,LRS,LRS,LRS,LRS
kpmt = 1,1,1,1,1
kred = 1
kblue0 = 1
kblue1 = 1
Cell_0.T = pDryBlue
Cell_0.P = pDryBlue
Cell_0.Q = alicat0
```

### Establishing the Map at Runtime

The routes are establised during the controller launch phase of the startup (``Controller::Pre Launch Init``) via the method ``Controller::Configure CRD Route Data``.  At this point, a variant is initialized with the following attributes:

* ``IDs`` - each ID is a device ID corresponding to the entry in the key ``Cell_i.x`` (in the example above, this is pDryBlue).  This variable is a list of all device IDs used by the CRD.
* A key corresponding to a device ID.  The value of this key is a nested map  The map will contain:
 * A key corresponding to one or more of the variables, 'Q', 'T' and 'P' which will contain an array of integers.  These integers corrspond to which cells are mapped to the variable generated by the device.
 * ``Data`` - the value of this attribute is an array of doubles that corresponds to the values Q, T and P from this device.  This key is established when the system is running and not at configuration.
 
### Storing the Route Data
 
When data is updated via the ``Update Controller Data MSG::Do`` message call in the ``Controller::Actor Core``, the method ``Controller::Route CRD Data`` is called.  At this point, the data entry in the nested map for each ID is populated with the appropriated variable.  If the user specifies a bad ID, then the field will be populated with a ``NaN``.  
 
### Shipping the Data

Data in this enquerer is mapped to an array in the message ``T_P MSG`` at regular intervals in the ``Controller::Common`` method (which is called in the ``Controller::Actor Core``).  The array represents the required data for each cell (represented by the array index) via a cluster containing explicit values for the variables defined above. 
