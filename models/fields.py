# -*- coding: utf-8 -*-
# @Created By: Chintan Ambaliya <chintan.ambaliya@bistasoutions.com>

from odoo import fields
from functools import partial


class Selection(fields.Selection):
    _slots = {
        'selection': None,
        'has_color': False
    }

    def get_values(self, env):
        """ return a list of the possible values """
        selection = self.selection
        if isinstance(selection, basestring):
            selection = getattr(env[self.model_name], selection)()
        elif callable(selection):
            selection = selection(env[self.model_name])
        if self.has_color:
            return [value for value, _, _ in selection]
        else:
            return [value for value, _ in selection]

    def _description_selection(self, env):
        """ return the selection list (pairs (value, label)); labels are
            translated according to context language
        """
        selection = self.selection
        if isinstance(selection, basestring):
            return getattr(env[self.model_name], selection)()
        if callable(selection):
            return selection(env[self.model_name])

        # translate selection labels
        if env.lang:
            name = "%s,%s" % (self.model_name, self.name)
            translate = partial(
                env['ir.translation']._get_source, name, 'selection', env.lang)
            if self.has_color:
                return [(value, translate(label) if label else label, color or '#000000') for value, label, color in selection]
            else:
                return [(value, translate(label) if label else label) for value, label in selection]
        else:
            return selection

