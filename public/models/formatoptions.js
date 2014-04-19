define(['backbone'], function () {
    return Backbone.Model.extend({
        defaults: {
            options: [{type: 'String'}, {type: 'Number'}]
        },
        initialize: function (config) {
            var model = this;
            model.set('id', config.id);
            model.set('regex', config.regex);
            model.get('options').forEach(function (val) {
                if (val.type === config.selected) val.selected = true;
                else {delete val.selected}
            });
        }
    });
});
