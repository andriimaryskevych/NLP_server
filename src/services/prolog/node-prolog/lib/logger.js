const enableLogger = true;

const logger = enableLogger ?
    console :
    {
        log: function() {}
    };

module.exports = {
    logger
};
