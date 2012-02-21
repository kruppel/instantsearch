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

    $el.find('#qfq').focus(function () {
      var show = true;

      self.focusId = window.setInterval(function () {
        $el.find('#qfqfl').toggle(show);
        show = !show;
      }, 500);
    });

    $el.find('#qfq').blur(function () {
      $el.find('#qfqfl').hide();
      window.clearInterval(self.focusId);
    });

    $el.keydown(function (e) {

      switch(e.keyCode) {

        // left
        case 37:
          break;

        // up
        case 38:
          e.preventDefault();
          break;

        // right
        case 39:
          break;

        // down
        case 40:
          e.preventDefault();

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
          var left = self.$el.find('#qfqfl').offset().left;

          self.doIt();
          self.$el.find('#qfqfl').offset(function (index, coords) {
            self.$el.find('#qfqfl').offset({ left: 3 + left + 9 });
          });
      }

    });

  };

  $.Motherfucker.prototype.doIt = function () {
    var self = this;

    setTimeout(function () {
      var input = self.$el.find('#qfq'),
          q = input.val();

      self.$el.find('#qfqfa').html(q);

      if (q === '') return self.showResults();

      self.source({ term: q }, function (data, err) {
        if (err) throw new Error(err);

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

    if (input.val() === '') {
      table.hide();
      this.$el.find('#qfqfb').html('');

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
          this.$el.find('#qfqfb').html(value + options.rest);
        } else {
          this.$el.find('#qfqfb').html('');
        }
      }

      rs.append(Mustache.render(template, options));
    }
  };

})(jQuery);
