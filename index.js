var steem = require('dsteem');
var steemState = require('steem-state');
var steemTransact = require('steem-transact');
var readline = require('readline');
var fs = require('fs');
const express = require('express')
const ENV = process.env;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const app = express()
const port = ENV.PORT || 3000;

app.get('/', (req, res, next) => {
  let op = [], c1 = [], c2 = [], c3 = [], c4 = [], c5 = [], c6 = []
  for (var name in state){
    var i = 0
    if(state[name].thinking)i++
    if(state[name].empathy)i++
    if(state[name].ethics)i++
    if(state[name].emergene)i++
    if(state[name].grit)i++
    if(state[name].humility)i++
    state[name].found = i
  }
	console.log(state)
  for (var name in state){
    if (state[name].found==6)c6.push(state[name])
    if (state[name].found==5)c5.push(state[name])
    if (state[name].found==4)c4.push(state[name])
    if (state[name].found==3)c3.push(state[name])
    if (state[name].found==2)c2.push(state[name])
    if (state[name].found==1)c1.push(state[name])
  }
  c6.sort(function(a, b){return a.last - b.last})
  c5.sort(function(a, b){return a.last - b.last})
  c4.sort(function(a, b){return a.last - b.last})
  c3.sort(function(a, b){return a.last - b.last})
  c2.sort(function(a, b){return a.last - b.last})
  c1.sort(function(a, b){return a.last - b.last})
console.log(c1)
  op = c6.concat(c5,c4,c3,c2,c1)
  for (var i = 0;i<op.length;i++){op[i].rank = i+1}
  res.send(op)
});
app.listen(port, () => console.log(`DLUX token API listening on port ${port}!`))

var stateStoreFile = './state.json';  // You can replace this with the location you want to store the file in, I think this will work best for heroku and for testing.

var startingBlock = ENV.STARTINGBLOCK || 30562486;     // PUT A RECENT BLOCK HERE -- GENESIS BLOCK
// /\ and \/ are placeholders. They will act as the genesis state if no file is found.

const username = ENV.ACCOUNT || 'dlux-io';
const key = ENV.KEY;

const prefix = ENV.PREFIX || 'wiad2019_';
const clientURL = ENV.APIURL || 'https://api.steemit.com'
var client = new steem.Client(clientURL);
var processor;

var state = {
  markegiles:{
        username:'markegiles',
        thinking:1,
        empathy:0,
        ethics:0,
        collaboration:0,
        curiosity:0,
        humility:0,
        last:16
      },
  disregardfiat:{
        username:'disregardfiat',
        thinking:1,
        empathy:0,
        ethics:0,
        collaboration:0,
        curiosity:0,
        humility:0,
        last:151
      }
}

if(fs.existsSync(stateStoreFile)) {
  var data = fs.readFileSync(stateStoreFile, 'utf8');
  var json = JSON.parse(data);
  startingBlock = json[0];
  state = json[1];
  startApp();
} else {
  console.log('No state store file found. Starting from the genesis block+state');
  startApp();
}




function startApp() {
  processor = steemState(client, steem, startingBlock, 10, prefix);


  processor.on('thinking', function(json, from) {
console.log(from + 'found thinking')
    if(state[from] != undefined){
      state[from].thinking = 1,
      state[from].last = Date.now()
    }else{
      state[from] = {
        username:from,
        thinking:1,
        empathy:0,
        ethics:0,
        collaboration:0,
        curiosity:0,
        humility:0,
        last:Date.now()
      }
    }
  });
  processor.on('empathy', function(json, from) {
console.log(from + 'found empathy')
    if(state[from] != undefined){
      state[from].empathy = 1,
      state[from].last = Date.now()
    }else{
      state[from] = {
        username:from,
        thinking:0,
        empathy:1,
        ethics:0,
        collaboration:0,
        curiosity:0,
        humility:0,
        last:Date.now()
      }
    }
  });
  processor.on('ethics', function(json, from) {
	console.log(from + 'found ethics')
    if(state[from] != undefined){
      state[from].ethics = 1,
      state[from].last = Date.now()
    }else{
      state[from] = {
        username:from,
        thinking:0,
        empathy:0,
        ethics:1,
        collaboration:0,
        curiosity:0,
        humility:0,
        last:Date.now()
      }
    }
  });
  processor.on('collaboration', function(json, from) {
console.log(from + 'found collaboration')
    if(state[from] != undefined){
      state[from].collaboration = 1,
      state[from].last = Date.now()
    }else{
      state[from] = {
        username:from,
        thinking:0,
        empathy:0,
        ethics:0,
        collaboration:1,
        curiosity:0,
        humility:0,
        last:Date.now()
      }
    }
  });
  processor.on('curiosity', function(json, from) {
console.log(from + 'found curiosity')
    if(state[from] != undefined){
      state[from].curiosity = 1,
      state[from].last = Date.now()
    }else{
      state[from] = {
        username:from,
        thinking:0,
        empathy:0,
        ethics:0,
        collaboration:0,
        curiosity:1,
        humility:0,
        last:Date.now()
      }
    }
  });
  processor.on('humility', function(json, from) {
console.log(from + 'found humility')
    if(state[from] != undefined){
      state[from].humility = 1,
      state[from].last = Date.now()
    }else{
      state[from] = {
        username:from,
        thinking:0,
        empathy:0,
        ethics:0,
        collaboration:0,
        curiosity:0,
        humility:1,
        last:Date.now()
      }
    }
  });

  processor.onBlock(function(num, block) {
    if(num % 100 === 0 && !processor.isStreaming()) {
      client.database.getDynamicGlobalProperties().then(function(result) {
        console.log('At block', num, 'with', result.head_block_number-num, 'left until real-time.')
      });
    }

    if(num % 100 === 0) {

      saveState(function() {
        console.log('Saved state.')
      });
    }
  });

  processor.onStreamingStart(function() {
    console.log("At real time.")
  });

  processor.start();


  var transactor = steemTransact(client, steem, prefix);

  rl.on('line', function(data) {
    var split = data.split(' ');

    if(split[0] === 'balance') {
      var user = split[1];
      var balance = state.balances[user];
      if(balance === undefined) {
        balance = 0;
      }
      console.log(user, 'has', balance, 'tokens')
    } else if(split[0] === 'send') {
      console.log('Sending tokens...')
      var to = split[1];

      var amount = parseInt(split[2]);

      transactor.json(username, key, 'send', {
        to: to,
        amount: amount
      }, function(err, result) {
        if(err) {
          console.error(err);
        }
      })
    } else if(split[0] === 'exit') {
      exit();
    } else {
      console.log("Invalid command.");
    }
  });
}

function exit() {
  console.log('Exiting...');
  processor.stop(function() {
    saveState(function() {
      process.exit();
      console.log('Process exited.');
    });
  });
}

function saveState(callback) {
  var currentBlock = processor.getCurrentBlockNumber();
  fs.writeFileSync(stateStoreFile, JSON.stringify([currentBlock, state]));
  callback();
}
