jQuery.fn.extend({
    serializeArrayFlat: function () {
        return this.serializeArray().reduce(function (acc, val) {
            if (!val.name || !val.value) return acc;
            return (acc[val.name] = val.value) && acc;
        }, {});
    }
});
