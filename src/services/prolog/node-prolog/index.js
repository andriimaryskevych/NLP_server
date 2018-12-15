'use strict';

const {
    spawn
} = require('child_process');
const EventEmitter = require('events');

const util = require('./utils');

const enableLogger = false;

const logger = enableLogger ?
    console :
    {
        log: function() {}
    };

const prolog = spawn('swipl', [
    '-q',
    '--nodebug'
]);

prolog.stdout.on('data', (data) => {
    chunkDeterminer(data);
});

process.stdin.on('data', data => {
    prolog.stdin.write(data);
});

const ACTION = {
    DATA_ARRIVAL: 'data arrival',
    CHUNK_READY: 'chunk ready',
    LAST_CHUNK_READY: 'last chunk'
};

const emitter = new EventEmitter();

let mainDataStorage = Buffer.alloc(0);

const CHUNK = {
    FULL_STOP: 'full stop',
    SUB_QUERY_PART: 'sub query part',
    SUB_QUERY_END: 'sub query end'
};

const fullStop = new Buffer.from('0D0A0D0A', 'hex');
const somethingLeft = new Buffer.from('2C0D0A', 'hex');
const subQueryEnd = new Buffer.from('20', 'hex');

const endBuffer = [
    {
        name: CHUNK.FULL_STOP,
        buffer: fullStop
    },
    {
        name: CHUNK.SUB_QUERY_PART,
        buffer: somethingLeft
    },
    {
        name: CHUNK.SUB_QUERY_END,
        buffer: subQueryEnd
    }
];

emitter.on(ACTION.DATA_ARRIVAL, data => {
    const {
        mathcedBuffer,
        buffer
    } = data;

    const bufferWithoutEnd = buffer.slice(0, buffer.length - mathcedBuffer.buffer.length);

    switch (mathcedBuffer.name) {
        case CHUNK.SUB_QUERY_PART:
            const commaSeparatedBuffer = Buffer.concat([bufferWithoutEnd, somethingLeft]);
            mainDataStorage = Buffer.concat([mainDataStorage, commaSeparatedBuffer]);
            break;
        case CHUNK.SUB_QUERY_END:
            mainDataStorage = Buffer.concat([mainDataStorage, bufferWithoutEnd]);
            emitter.emit(ACTION.CHUNK_READY);
            break;
        case CHUNK.FULL_STOP:
            mainDataStorage = Buffer.concat([mainDataStorage, bufferWithoutEnd]);
            emitter.emit(ACTION.LAST_CHUNK_READY);
            break;
    }
});

class DeferredQuery {
    constructor (resolve, reject, query) {
        Object.assign(this, {
            resolve,
            reject,
            query
        })
    }
};

function chunkDeterminer (data)  {
    const bufferLength = data.length;

    for (let i = 0; i < endBuffer.length; i++) {
        const toCompare = data.slice(bufferLength - endBuffer[i].buffer.length, bufferLength);

        if (Buffer.compare(toCompare, endBuffer[i].buffer) === 0) {
            logger.log('Found chunk');
            logger.log(data.toString());
            logger.log('Of type');
            logger.log(endBuffer[i].name);

            emitter.emit(ACTION.DATA_ARRIVAL, {
                mathcedBuffer: endBuffer[i],
                buffer: data
            });

            break;
        }
    }
}

const STATE = {
    FREE_TO_USE: 0,
    WORKING: 1
};

let state = STATE.FREE_TO_USE;
const requestedQueries = [];

let firstLoad = true;
let fetchedAllData = false;
let defferedNext = {};

const queryExecutor = {
    query: '',
    next: function () {
        if (!fetchedAllData) {
            const returnPromise = new Promise((resolve, reject) => {
                defferedNext.resolve = resolve;
                defferedNext.reject = reject;
            });

            if (firstLoad) {
                prolog.stdin.write(this.query);
                firstLoad = false;
            } else {
                prolog.stdin.write(';\n');
            }

            return returnPromise;
        } else {
            firstLoad = true;
            fetchedAllData = false;

            logger.log('Fetched all data, returning undefined');

            return Promise.resolve(undefined);
        }
    },
    close: function () {
        firstLoad = true;
        fetchedAllData = false;
        resolveNextQuery();
    }
};

emitter.on(ACTION.CHUNK_READY, () => {
    const data = mainDataStorage.toString();

    mainDataStorage = Buffer.alloc(0);

    defferedNext.resolve(processResponse(data));
});

emitter.on(ACTION.LAST_CHUNK_READY, () => {
    mainDataStorage = mainDataStorage.slice(0, mainDataStorage.length - 1);
    const data = mainDataStorage.toString();

    mainDataStorage = Buffer.alloc(0);
    fetchedAllData = true;

    defferedNext.resolve(processResponse(data));
});

function processResponse(data) {
    const response = {};

    if (data === 'true') {
        return response;
    }

    if (data === 'false') {
        logger.log()
        return void 0;
    }

    logger.log('Data', data);

    const splited = data.split(',\r\n');

    splited.forEach(item => {
        const splitedItem = item.split(' = ');

        response[splitedItem[0]] = util.removeFirstAndaLast(splitedItem[1]);
    });

    return response;
}

function resolveNextQuery () {
    logger.log('Resolving next query request');

    if (requestedQueries.length) {
        state = STATE.WORKING;

        const deferredQuery = requestedQueries.shift();
        queryExecutor.query = deferredQuery.query;

        logger.log('Found unresolved query', deferredQuery.query);

        deferredQuery.resolve(queryExecutor);
    } else {
        logger.log('No unresolved queries found');

        state = STATE.FREE_TO_USE;
    }
};

function handleNewQuery(deferredQuery) {
    logger.log('New query is added', deferredQuery.query);

    // Executing deferred query immidiatelly if any is in queue and state allows to
    if (state === STATE.FREE_TO_USE && requestedQueries.length === 0) {
        logger.log('Executing immidiatelly');
        state = STATE.WORKING;

        queryExecutor.query = deferredQuery.query;

        deferredQuery.resolve(queryExecutor);
    } else {
        logger.log('Deferring executing');
        requestedQueries.push(deferredQuery);
    }
}

function requestQueryExecutor (query) {
    let deferredQuery = {};

    const deferredPromise = new Promise((resolve , reject)=> {
        deferredQuery = new DeferredQuery(resolve, reject, query + '.\n');
    });

    handleNewQuery(deferredQuery);

    return deferredPromise;
}

module.exports = requestQueryExecutor;
