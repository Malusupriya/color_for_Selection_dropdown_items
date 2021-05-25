odoo.define('custom_selection_field.form_widgets', function (require) {
    "use strict";

    /**
     * @Created By: Chintan Ambaliya <chintan.ambaliya@bistasoutions.com>
     */

    const core = require('web.core');
    const form_widgets = require('web.form_widgets'); // necessary
    const FieldSelection = core.form_widget_registry.get('selection');

    const _t = core._t;

    FieldSelection.include({
        init: function(field_manager, node) {
            this._super.apply(this, arguments);
            this.hasColor = this.field.selection && this.field.selection.length && this.field.selection[0].length > 2;
        },
        /**
         * @override
         */
        render_value: function() {
            if (this.hasColor) {
                this.$el.addClass('o_color_selection');
                var values = this.get("values");
                values = [[false, this.node.attrs.placeholder || '']].concat(values);
                var found = _.find(values, function (el) {
                    return el[0] === this.get("value");
                }, this);
                if (!found) {
                    found = [this.get("value"), _t('Unknown')];
                    values = [found].concat(values);
                }
                if (!this.get("effective_readonly")) {
                    if (this.$el.parent().hasClass('bootstrap-select')) {
                        this.$el.parent().replaceWith(this.$el);
                        this.$el.removeData('selectpicker');
                    }
                    this.$el.empty();
                    for (var i = 0; i < values.length; i++) {
                        this.$el.append($('<option/>', {
                            value: JSON.stringify(values[i][0]),
                            html: values[i][1],
                            style: values[i][2] ? 'color: ' + values[i][2] + ';' : '',
                        }))
                    }
                    this.$el.val(JSON.stringify(found[0]));
                    this.$el.selectpicker({
                        // tickIcon: 'glyphicon-ok',
                        // showTick: true,
                    });
                    this.$el.parent().find('> button').css('color', found[2]);
                } else {
                    this.$el.text(found[1]);
                    if (found[2]) {
                        this.$el.css('color', found[2]);
                    }
                }
            } else {
                this._super.apply(this, arguments);
            }
        },
        store_dom_value: function () {
            this._super.apply(this, arguments);
            if (this.hasColor) {
                let found = _.find(this.get("values"), function(el) { return el[0] === this.get("value"); }, this);
                if (found) {
                    this.$el.parent().find('> button').css('color', found[2]);
                } else {
                    this.$el.parent().find('> button').css('color', '');
                }
            }
        },
        destroy_content: function() {
            if (this.hasColor && this.$el.parent().hasClass('bootstrap-select')) {
                this.$el.parent().replaceWith(this.$el);
                this.$el.removeData('selectpicker');
            }
            this._super.apply(this, arguments);
        },
    });
});
