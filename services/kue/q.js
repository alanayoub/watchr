



exports.create_queue = function () {
    //return Queue.singleton = new Queue;
};

var queue = function () {
    return {
        create_job: function (type, data) {
            return new Job(type, data);
        }
    }
};