SMP-Node-Reg-Script
===================

SAP Mobility Platform - Node.js registration script for a REST client

Overview
--------
This script illustrates how to register a client application with a SAP Mobility Platform server where the server has network edge authentication through client certificates and the server itself has challenge user/pass authentication.

Requirements
------------
- An SMP server version 3.0 or above (tested with SP2)
- A reverse proxy connection to the secure communications port of the SMP server (usually 8081)
- The reverse proxy should require authentication via client certificates
- A valid client cert for the proxy and valid credentials to a valid app on the SMP server

Usage
------
Update the file smpRegistration.js with the correct variable information.

node smpRegistration.js