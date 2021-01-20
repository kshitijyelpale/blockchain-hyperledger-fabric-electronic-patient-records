const client = require('./lib/init_redis')({
  host: 'localhost',
  port: 6379,
});
client.auth('hosp1lithium');

client.SET('key1', 'val1');

client.GET('key1', (err, val) => {
  if (err) console.error(err.message);

  console.log('Value for key1 is ' + val);
});

client.SET('key1', 123);

client.GET('key1', (err, val) => {
  if (err) console.error(err.message);

  console.log('Value for key1 is ' + val);
});

client.DEL('key1', (err) => {
  if (err) console.error(err.message);
});

client.GET('key1', (err, val) => {
  if (err) console.error(err.message);

  console.log('Value for key1 is ' + val);
});
