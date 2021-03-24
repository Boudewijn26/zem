# Influx Command Line Client

A quick command line interface to access InfluxDB on Google Cloud.

Here is how to manage users:

```
./influx.sh user list
./influx.sh user create -o foundation_zero -n 'some-username' -p 'secret-password'
```

Managing buckets:

```
./influx.sh bucket list -o foundation_zero
./influx.sh bucket create -o foundation_zero -n 'new-bucket-name'
```

And tokens:

```
./influx.sh auth create -o foundation_zero --read-bucket 2a03d3671771849f --write-bucket 2a03d3671771849f
./influx.sh auth list
```

