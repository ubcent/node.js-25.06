// ---------------CALLBACK------------------ //

/*function sendRequest(cb) {
  setTimeout(() => {
    const result = { firstName: 'Dmitry', lastName: 'Bondarchuk' };
    
    cb(result);
  }, 1000);
}

sendRequest((data) => { // callback hell
  sendRequest((data) => {
    sendRequest((data) => {
      console.log(data);
    });
  });
});*/

// -----------------PROMISE------------------ // pending->(fulfilled|rejected)
/*
function sendRequest() {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      var result = { firstName: 'Dmitry', lastName: 'Bondarchuk' };

      resolve(result);
    }, 1000);
  });

  return promise.then(
    (user) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          var result = { ...user, advertIds: [433, 12, 4] };

          resolve(result);
        }, 1000);
      });
    }, // onFulfiled
    (data) => { console.log('Reject', data); }, // onRejected
  );
}

async function init() {
  const fullUser = await sendRequest();
  console.log(fullUser);
}

init();
*/

// -----------------EVENT EMITTER------------------ //
/*const EventEmitter = require('events').EventEmitter;

class Kettle extends EventEmitter {
  constructor() {
    super();

    process.nextTick(() => {
      this.emit('created');
    });
  }

  start() {
    setTimeout(() => {
      this.emit('ready', { temperature: 100 });
    }, 3000);
  }
}

const k = new Kettle();
k.start();

k.on('ready', (event) => {
  console.log('Чайник готов', event);
});

k.on('created', () => {
  console.log('Чайник создан!');
});*/

/*process.nextTick(() => {
  console.log('process.nextTick');
});

setImmediate(() => {
  console.log('setImmediate');
});

setTimeout(() => {
  console.log('setTimeout');
}, 0);*/

setTimeout(() => {
  // тяжелая операция, которая занимает 10с
}, 1000);

setTimeout(() => {
  console.log('Hello world');
}, 2000);

