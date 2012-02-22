/**
 * @requires jQuery
 */

(function ($) {

  $.fn.instantSearch = function (options) {
    var opts = $.extend({}, $.fn.instantSearch.defaults, options);

    return this.each(function () {
      var $this = $(this);

      $this.data('mofo', new $.Motherfucker($this, opts));
    });
  };

  $.fn.instantSearch.defaults = {
    delay: 0
  };

  /**
   * Motherfucker constructor
   *
   * @param {Object} $el jQuery object for input element
   * @constructor
   */
  $.Motherfucker = function ($el, options) {

    self = this;

    this.options = {};

    this.delay = options.delay || 0;
    this.source = options.source;

    this.$el = $el;

    $el.find('.sbr_c').hide();

    $el.keydown(function (e) {

      switch(e.keyCode) {

        // up
        case 38:
          var rows = self.$el.find('table.sbr_c .sbr_e > tbody > tr'),
              rowCount = rows.length,
              curr = self._selected-- % (rowCount + 1),
              next = (self._selected + rowCount + 1) % (rowCount + 1);

          self._selected = next;
          if (rowCount === 0) return;

          (curr !== 0) && (rows[curr - 1].className = '');
          if (next === 0) {
            self.$el.find('#qfq').val(self._val);
            self.$el.find('#qftaf').val(self._suggested);
          } else {
            self.$el.find('#qfq').val(self._data[next - 1].name);
            self.$el.find('#qftaf').val('');
            rows[next - 1].className = 'trh';
          }

          e.preventDefault();

          break;

        // right
        case 39:
          self._val = self._data[0].name;
          self._suggested = '';
          self.$el.find('#qfq').val(self._val);
          self.$el.find('#qftaf').val('');
          break;

        // down
        case 40:
          var rows = self.$el.find('table.sbr_c .sbr_e > tbody > tr'),
              rowCount = rows.length,
              curr = self._selected++ % (rowCount + 1),
              next = self._selected % (rowCount + 1);

          self._selected = next;
          if (rowCount === 0) return;

          (curr !== 0) && (rows[curr - 1].className = '');
          if (next === 0) {
            self.$el.find('#qfq').val(self._val);
            self.$el.find('#qftaf').val(self._suggested);
          } else {
            self.$el.find('#qfq').val(self._data[next - 1].name);
            self.$el.find('#qftaf').val('');
            rows[next - 1].className = 'trh';
          }

          e.preventDefault();

          break;

        // tab
        case 9:
          break;

        // return
        case 13:
          break;

        // escape
        case 27:
          break;

        default:
          self._selected = 0;
          self.doIt();
      }

    });

  };

  $.Motherfucker.prototype.doIt = function () {
    var self = this;

    setTimeout(function () {
      var q = self._val = self.$el.find('#qfq').val();

      if (q === '') return self.showResults();

      self.source({ term: q }, function (data, err) {
        if (err) throw new Error(err);

        self._data = data;
        self.showResults(data);
      });
    }, this.delay);
  };

  $.Motherfucker.prototype.showResults = function (data) {
    var table = this.$el.find('.sbr_c'),
        rs = table.find('.sbr_e > tbody'),
        input = this.$el.find('#qfq'),
        index = 0;

    rs.empty();

    if (input.val() === '' || !data) {
      this.$el.find('#qftaf').val('');
      table.hide();

      return;
    }

    table.is(':hidden') && table.show();

    for (index; index < data.length; index++) {
      var value = this.$el.find('#qfq').val(),
          result = data[index].name,
          matcher = new RegExp('(' + value + ')(.*)', 'i'),
          matchset = result.match(matcher),
          options = {
            start: matchset && result.substr(0, matchset.index),
            match: matchset && matchset[1],
            rest: matchset && matchset[2]
          },
          template =
            '<tr><td class="sbr_a" dir="ltr" style="text-align: left;"><div class="sbq_a"><table cellspacing="0" cellpadding="0" style="width: 100%;" class="sbr_m"><tbody><tr><td style="width: 100%;"><span><b>{{start}}</b>{{match}}<b>{{rest}}</b></span></td></tr></tbody></table></div></td></tr>';

      if (index === 0) {
        if (options.start === '') {
          this._suggested = value + options.rest;
          this.$el.find('#qftaf').val(value + options.rest);
        } else {
          this._suggested = '';
          this.$el.find('#qftaf').val('');
        }
      }

      rs.append(Mustache.render(template, options));
    }
  };

})(jQuery);
