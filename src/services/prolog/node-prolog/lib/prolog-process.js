'use stict';

const {
    Transform,
    Writable
} = require('stream');

const {
    removeFirstAndaLast
} = require('./utils');

const {
    logger
} = require('./logger');

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

let mainDataStorage = Buffer.alloc(0);


// Collects data untill it finds end buffer
const collector = new Transform({
    readableObjectMode: true,

    transform(chunk, encoding, callback) {
        console.log(chunk.toString());
        const bufferLength = chunk.length;
        let matchedBuffer;

        for (let i = 0; i < endBuffer.length; i++) {
            const toCompare = chunk.slice(bufferLength - endBuffer[i].buffer.length, bufferLength);

            if (Buffer.compare(toCompare, endBuffer[i].buffer) === 0) {
                logger.log('Found chunk');
                logger.log(chunk.toString());
                logger.log('Of type');
                logger.log(endBuffer[i].name);

                matchedBuffer = endBuffer[i];

                break;
            }
        }

        const bufferWithoutEnd = chunk.slice(0, chunk.length - matchedBuffer.buffer.length);

        switch (matchedBuffer.name) {
            case CHUNK.SUB_QUERY_PART:
                const commaSeparatedBuffer = Buffer.concat([bufferWithoutEnd, somethingLeft]);
                mainDataStorage = Buffer.concat([mainDataStorage, commaSeparatedBuffer]);

                break;
            case CHUNK.SUB_QUERY_END:
            case CHUNK.FULL_STOP:
                const result = Buffer.concat([mainDataStorage, bufferWithoutEnd]);
                mainDataStorage = Buffer.alloc(0);

                this.push({
                    buffer: result,
                    responseType: matchedBuffer.name
                });

                break;
        }

        callback();
    }
});


// Processes data for response
const processor = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,

    transform(fullResponse, encoding, callback) {
        const {
            buffer
        } = fullResponse;

        const data = buffer.toString();

        let response = {};

        if (data === 'true.') {
            this.push({});
            callback();
        }

        if (data === 'false.') {
            this.push(void 0);
            callback();
        }

        logger.log('Data', data);

        const splited = data.split(',\r\n');

        splited.forEach(item => {
            const splitedItem = item.split(' = ');

            response[splitedItem[0]] = removeFirstAndaLast(splitedItem[1]);
        });

        this.push(response);

        callback();
    }
});

const {
    spawn
} = require('child_process');

class Prolog {
    constructor () {
        this.instance = spawn('swipl', [
            '-q',
            '--nodebug'
        ]);

        this.instance.stdout
            // .pipe(process.stdout);
            .pipe(collector)
            .pipe(processor)
            .pipe(new Writable({
                writableObjectMode: true,

                write(chunk, encoding, callback) {
                    this.toInvoke(chunk);

                    callback();
                }
            }));
    }

    write(expression, callback) {
        this.instance.stdin.write(expression);
        this.toInvoke = callback;
    }
};

module.exports = {
    Prolog
};
