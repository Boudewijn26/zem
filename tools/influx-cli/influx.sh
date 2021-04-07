#!/bin/sh
#
# A quick wrapper to be able to talk to a remote Influx database.
#
docker run -it influxdb /usr/local/bin/influx --host http://35.190.206.110:8086 --token FCl28DwmhZF1lVp3aRfJnN5u-S7gw-b114MpONSmJ1jbaNhwEjepFy0mxg01WEpHDnyhEjalqJsOBVssSDkiqg== ${*}
