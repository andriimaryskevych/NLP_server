const enableLogger = false;

const logger = enableLogger ?
    console :
    {
        log: function() {}
    };

module.exports = {
    logger
};
