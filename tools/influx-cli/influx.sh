#!/bin/sh
#
# A quick wrapper to be able to talk to a remote Influx database.
#
docker run -it influxdb /usr/local/bin/influx --host http://35.190.206.110:8086 --token azYwfXHXauDAb0ZW2GWLM4PkZQjox6e9z1hUGXEEE-zxzMWFr9LAW3Csj2aMiVGAh1HFnk8vpY78s4ekhJZ2nw== ${*}
