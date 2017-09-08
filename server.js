var express = require('express');
var path = require('path');
var Handlebars = require('express-handlebars');
var staticify = require("staticify")(path.join(__dirname, "static"));
var bodyParser = require('body-parser');
var Database = require('better-sqlite3');
var nacl = require('tweetnacl');

var db = new Database('test.db');

var app = express();

app.use(staticify.middleware);
app.use(bodyParser.json());

var hbs = Handlebars.create({
  defaultLayout: 'main',
  helpers: {
    getAsset: staticify.getVersionedPath
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

const animals = ["Aardvark","Aardwolf","Albatross","Alligator","Alpaca","Anaconda","Angelfish","Anglerfish","Ant","Anteater","Antelope","Antlion","Ape","Aphid","Armadillo","Baboon","Badger","Bandicoot","Barnacle","Barracuda","Basilisk","Bass","Bat","Bear","Beaver","Bedbug","Bee","Beetle","Bison","Blackbird","Boa","Boar","Bobcat","Bobolink","Bonobo","Booby","Bovid","Buffalo","Bug","Butterfly","Buzzard","Camel","Capybara","Cardinal","Caribou","Carp","Cat","Caterpillar","Catfish","Cattle","Centipede","Chameleon","Cheetah","Chicken","Chimpanzee","Chinchilla","Chipmunk","Cicada","Clam","Clownfish","Cobra","Cockroach","Cod","Condor","Constrictor","Coral","Cougar","Cow","Coyote","Crab","Crane","Crawdad","Crayfish","Cricket","Crocodile","Crow","Cuckoo","Damselfly","Deer","Dingo","Dinosaur","Dog","Dolphin","Donkey","Dormouse","Dove","Dragon","Dragonfly","Duck","Eagle","Earthworm","Earwig","Echidna","Eel","Egret","Elephant","Elk","Emu","Falcon","Ferret","Finch","Firefly","Fish","Flamingo","Flea","Fly","Fowl","Fox","Frog","Gazelle","Gecko","Gerbil","Gibbon","Giraffe","Goat","Goldfish","Goose","Gopher","Gorilla","Grasshopper","Grizzly bear","Grouse","Guanaco","Guinea pig","Gull","Guppy","Haddock","Halibut","Hamster","Hare","Harrier","Hawk","Hedgehog","Heron","Herring","Hippopotamus","Hookworm","Hornet","Horse","Hoverfly","Hummingbird","Hyena","Iguana","Impala","Jackal","Jaguar","Jellyfish","Junglefowl","Kangaroo","Kangaroo rat","Kingfisher","Kiwi","Koala","Koi","Krill","Ladybug","Lamprey","Landfowl","Lark","Leech","Lemming","Lemur","Leopard","Leopon","Limpet","Lion","Lizard","Llama","Lobster","Locust","Louse","Lungfish","Lynx","Macaw","Mackerel","Magpie","Mammal","Manatee","Mandrill","Marlin","Marmot","Marten","Mastodon","Meadowlark","Meerkat","Mink","Minnow","Mockingbird","Mole","Mollusk","Mongoose","Monkey","Moose","Mosquito","Moth","Mouse","Mule","Muskox","Narwhal","Newt","Nightingale","Ocelot","Octopus","Opossum","Orangutan","Orca","Ostrich","Otter","Owl","Ox","Panda","Panther","Parakeet","Parrot","Partridge","Peacock","Peafowl","Pelican","Penguin","Perch","Pheasant","Pig","Pigeon","Pike","Pinniped","Piranha","Planarian","Platypus","Pony","Porcupine","Porpoise","Possum","Prawn","Primate","Puffin","Puma","Python","Quail","Rabbit","Raccoon","Rat","Rattlesnake","Raven","Reindeer","Reptile","Rhinoceros","Roadrunner","Rodent","Rooster","Roundworm","Sailfish","Salamander","Salmon","Sawfish","Scallop","Scorpion","Seahorse","Seal","Shark","Sheep","Shrew","Shrimp","Silkworm","Silverfish","Skunk","Sloth","Slug","Smelt","Snail","Snake","Snipe","Sole","Sparrow","Spider","Squid","Squirrel","Starfish","Stingray","Stork","Sturgeon","Swallow","Swan","Swordfish","Tarantula","Tasmanian devil","Tick","Tiger","Toad","Tortoise","Toucan","Trout","Tuna","Turkey","Turtle","Viper","Vulture","Wallaby","Walrus","Warbler","Wasp","Weasel","Whale","Whippet","Whitefish","Wildcat","Wildebeest","Wildfowl","Wolf","Wolverine","Wombat","Woodpecker","Worm","Wren","Xerinae","Yak","Zebra"];

var findUserByPubKey = db.prepare('SELECT * FROM users WHERE publicKey = ?');
var insertUser = db.prepare('INSERT INTO users (name, publicKey) VALUES (:name, :publicKey)');
var findProphecyBySignature = db.prepare('SELECT * FROM prophecies WHERE signature = ?');
var insertProphecy = db.prepare('INSERT INTO prophecies (message, timestamp, userId, signature) VALUES (:message, :timestamp, :userId, :signature)');

app.post('/prophecy', function(req, res) {
  // TODO: throw error if any inputs are missing
  var message = req.body.message;
  var timestamp = req.body.timestamp;
  var publicKey = req.body.publicKey;
  var signature = req.body.signature;

  if (message === undefined || timestamp === undefined ||
      publicKey === undefined || signature === undefined) {
    res.status = 400;
    res.send ({
      message: 'Missing parameters'
    });
  }

  if (message.trim().length === 0) {
    res.status = 400;
    return res.send({
      message: 'Message must be more than 0 chars'
    });
  }

  if (message.length > 130) {
    res.status = 400;
    return res.send({
      message: 'Message must be up to 130 chars'
    });
  }

  if (timestamp.length != 10) {
    res.status = 400;
    return res.send({
      message: 'Timestamp must be 10 char numeric string'
    });
  }

  publicKey = Buffer.from(publicKey, 'base64');
  signature = Buffer.from(signature, 'base64');

  if (publicKey.length !== 32) {
    res.status = 400;
    return res.send({
      message: 'Public key must be 32 bytes long'
    });
  }

  if (signature.length !== 64) {
    res.status = 400;
    return res.send({
      message: 'Signature must be 64 bytes long'
    }); 
  }

  var user = findUserByPubKey.get(publicKey);

  // TODO: insert user if not found

  var verified = nacl.sign.detached.verify(
    Buffer.from(message + timestamp), 
    signature, 
    user.publicKey
  );

  if (!verified) {
    res.status = 400;
    return res.send({
      message: 'Signature is invalid'
    });
  }
    
  var prophecy = findProphecyBySignature.get(signature);

  if (prophecy === undefined || 
      prophecy.message !== message || prophecy.timestamp !== timestamp) {
    insertProphecy.run({
      signature: signature,
      message: message,
      timestamp: timestamp,
      userId: user.id
    });
  }

  res.send('OK');
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});

