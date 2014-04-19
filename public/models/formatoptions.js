define(['backbone'], function () {
    return Backbone.Model.extend({
        defaults: {
            options: [{type: 'String'}, {type: 'Number'}]
        },
        initialize: function (id) {
            var model = this;
            model.set('id', id);
        },
        setSelected: function (selected) {
            var model = this;
            model.get('options').forEach(function (val) {
                if (val.type === selected) val.selected = true;
                else {delete val.selected}
            });
            return model
        }
    });
});
