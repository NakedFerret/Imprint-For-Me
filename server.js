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

const adjectives = ["shared","chinless","stormbound","differentiable","dyadic","impenitent","irreclaimable","usufructuary","aquatic","cacophonous","rewarding","evaporated","mauve","allelic","icebound","based","amalgamate","unaffecting","crepuscular","unwed","last","tenderized","contaminated","ancient","mothproof","bulbar","lessened","rimless","alveolate","starved","irate","questioning","acceptable","uninformative","impermissible","harmless","hatted","cool","foreseeable","false","basiscopic","undiminished","cartographic","arsenious","ignorant","tattered","vestmented","fibrocalcific","adored","unattached","mercerized","ready","untufted","incursive","cephalic","tinny","magisterial","antiferromagnetic","rutted","buggy","transplacental","uncooked","occurrent","orbiculate","taxonomic","protozoal","exaugural","floccose","bacteroidal","oracular","parted","sweeping","aerodynamic","counterproductive","unloving","hypodermal","interlinear","threadbare","allochronic","astomatal","centenarian","behavioral","shakable","clausal","untrained","mesonic","nonslip","drugless","lunatic","ruminant","noncarbonated","balmy","overshot","emphatic","hypochondriac","unrevised","fierce","boorish","ceramic","vesical","blissful","progressive","branchiate","reductionist","plangent","metallike","challengeable","crenate","plastered","ineffable","usual","scurfy","carpellary","rostrate","intergalactic","malfunctioning","arable","imprecise","many","isthmian","parallel","invertebrate","wrinkled","growing","sprigged","phrenic","heterologous","accommodating","neoclassicist","transformed","unrhymed","unaccented","uninhibited","aphanitic","snowbound","accomplishable","apprehensive","psychogenic","truncate","urbanized","polyglot","astringent","gutsy","immobile","uncharitable","abbatial","reverent","particular","atrophied","leering","paleontological","admittable","anestrous","effeminate","muciferous","ultraviolet","barographic","arthralgic","unethical","unshelled","nocent","undeveloped","fetching","uncommercial","cerebrovascular","auditory","unexpired","unsold","plumelike","unpreventable","incestuous","falcate","unfaceted","oldish","bathyal","scathing","prepossessing","clothesless","syndetic","banned","permeable","obscene","drinkable","left","fatal","declivitous","rotated","adoring","phonological","avuncular","broadside","waggish","split","knifelike","portly","sporadic","totipotent","grievous","stuffed","categoric","webbed","plain","unalert","suborbital","stereotyped","undemonstrative","unfocused","sticky","polymorphemic","overlooked","indecisive","axillary","summational","impuissant","bloodshot","tonsured","nonruminant","membered","abundant","showy","announced","strung","amerciable","ugly","extrusive","transalpine","prostyle","pinstriped","atomistic","flagitious","tanned","frail","jaundiced","governmental","borderline","overjoyed","autarkic","quintillionth","seriocomic","swept","outclassed","modified","advective","bibliolatrous","bladdery","synesthetic","wifely","saprophagous","religious","pendent","infinite","verrucose","tendinous","defensive","noncrucial","actuated","preconceived","elapsed","heathlike","preservative","cretinous","dripless","loaded","firmamental","sagittal","eight","cachectic","megakaryocytic","malign","revenant","biodegradable","lithomantic","distracted","defeasible","cloying","repand","tactless","condemnatory","congealed","monolingual","awed","unregenerate","buffoonish","evaporable","unbooked","stimulative","deserving","unsolved","bacteremic","psychiatric","chained","deliverable","exodontic","saponaceous","rupestral","aligning","blond","incautious","robotic","participial","adorable","flickering","reefy","choppy","irremovable","ergotic","bulky","resonant","credulous","bentonitic","unidirectional","champion","uncultivated","commissioned","postmillennial","imperative","absorbent","maimed","married","ventilated","jade","intriguing","curable","finable","fringy","near","pedate","glossopharyngeal","circulative","maxillodental","abbreviated","spotty","well","thirteenth","sneezy","tired","slowgoing","graceless","traumatic","dignified","pyrrhic","maternalistic","fortieth","incised","overhand","gyral","tamable","gracious","isosceles","braky","hoydenish","anticoagulative","incomputable","torrential","falsetto","dashing","teasing","choice","plumaged","brooding","atrabilious","imprudent","reconstructive","unmechanized","correlative","filamentous","ragged","isomeric","phantasmagoric","unguarded","seamy","abolishable","unapparent","divided","listless","photoelectric","unbanded","decussate","undercoated","bicentric","baked","acned","solvable","managerial","unpaved","poltroon","retractable","hooflike","aimless","assessable","recuperative","bipedal","neuropsychological","nonpsychoactive","pelvic","utilizable","osteal","unconvinced","wintry","unperceived","snuff","bipartisan","tigerish","inverse","ample","acanthotic","tinkling","fuggy","abeyant","fattening","umber","geophysical","boughed","barytic","unfunded","taboo","ascertainable","addable","unsaddled","calcifugous","razorback","suffrutescent","extraterritorial","indistinct","chemoreceptive","neurogenic","gimbaled","excused","humdrum","unpowered","downwind","lined","figural","liable","protanopic","doctrinaire","biographic","glum","coreferential","adscript","gushing","intrastate","bone","cercarial","diffuse","postganglionic","farinaceous","expressible","barometric","indigestible","unmanageable","ictal","uncomplaining","eighth","incendiary","exploitative","monochromatic","weeklong","housebroken","winsome","catabolic","syrupy","roofless","inelegant","exotic","satiny","holozoic","heated","causal","drippy","uveal","aeriform","appendicular","angled","epochal","noncommercial","topped","slippered","unskilled","unsuspected","dashed","mediated","protestant","proportional","dogmatic","humane","antediluvian","actinomorphic","paraboloidal","malnourished","fungoid","feisty","tusked","bouncy","indwelling","largo","dimmed","noiseless","presidential","untangled",""];


var findUserByPubKey = db.prepare('SELECT * FROM users WHERE publicKey = ?');
var insertUser = db.prepare('INSERT INTO users (name, publicKey) VALUES (:name, :publicKey)');
var findProphecyBySignature = db.prepare('SELECT * FROM prophecies WHERE signature = ?');
var insertProphecy = db.prepare('INSERT INTO prophecies (message, timestamp, userId, signature) VALUES (:message, :timestamp, :userId, :signature)');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function padDigits(number, digits) {
  return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

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

  var verified = nacl.sign.detached.verify(
    Buffer.from(message + timestamp), 
    signature, 
    publicKey
  );

  if (!verified) {
    res.status = 400;
    return res.send({
      message: 'Signature is invalid'
    });
  }

  var user = findUserByPubKey.get(publicKey);
  var userId;

  if (user === undefined) {
    var animalPart = animals[Math.floor(Math.random() * animals.length)];
    var adjectivePart = adjectives[Math.floor(Math.random() * adjectives.length)];
    var number = padDigits(getRandomInt(0,1000), 3);

    var insertResult = insertUser.run({ 
      name: adjectivePart + animalPart + number, 
      publicKey: publicKey
    });
    userId = insertResult.lastInsertROWID;
  } else {
    userId = user.id
  }
    
  var prophecy = findProphecyBySignature.get(signature);

  if (prophecy === undefined || 
      prophecy.message !== message || prophecy.timestamp !== timestamp) {
    insertProphecy.run({
      signature: signature,
      message: message,
      timestamp: timestamp,
      userId: userId
    });
  }

  res.send('OK');
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});

