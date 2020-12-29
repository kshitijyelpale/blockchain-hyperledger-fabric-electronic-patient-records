## Adding Org3 to the test network

You can use the `addHosp3.sh` script to add another organization to the Fabric test network. The `addHosp3.sh` script generates the hosp3 crypto material, creates an Org3 organization definition, and adds Hospital 3 to a channel on the test network.

You first need to run `./network.sh up createChannel` in the `test-network` directory before you can run the `addHosp3.sh` script.

```
./network.sh up createChannel
cd addHosp3
./addHosp3.sh up
```

If you used `network.sh` to create a channel other than the default `hospitalchannel`, you need pass that name to the `addHosp3.sh` script.
```
./network.sh up createChannel -c channel1
cd addHosp3
./addHosp3.sh up -c channel1
```

You can also re-run the `addHosp3.sh` script to add Org3 to additional channels.
```
cd ..
./network.sh createChannel -c channel2
cd addHosp3
./addHosp3.sh up -c channel2
```

For more information, use `./addHosp3.sh -h` to see the `addHosp3.sh` help text.
