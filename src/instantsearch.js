/**
 * instantsearch: GOOGish autocomplete © Kurt Ruppel 2013
 *
 * https://github.com/kruppel/instantsearch
 * LICENSE: MIT
 */

(function ($) {

  var IGNORED_KEY_CODES = [
    16//shift
  , 17//ctrl
  , 18//alt
  , 19//pause/break
  , 20//caps lock
  , 33//page up
  , 34//page down
  , 35//end
  , 36//home
  , 37//left
  , 45//insert
  , 91//windows-key/cmd
  , 92
  , 93//select
  , 112//f1
  , 113//f2
  , 114//f3
  , 115//f4
  , 116//f5
  , 117//f6
  , 118//f7
  , 119//f8
  , 120//f9
  , 121//f10
  , 122//f11
  , 123//f12
  , 124//f13
  , 125//f14
  , 126//f15
  ];

  function SearchResult(term, value) {
    var regex = new RegExp('(' + term + ')(.*)', 'i')
      , matchset = value.match(regex) || {}
      , start = value.substr(0, matchset.index)
      , match = matchset[1] || ''
      , rest =  matchset[2] || '';

    this.guess = (start === '' && rest !== '') ? term + rest : '';
    this.el = '<li class="instaresult"><strong>' + start + '</strong>' + match + '<strong>' + rest + '</strong></li>';
  }

  $.fn.instantSearch = function (options) {
    var opts = $.extend({}, options);

    return this.each(function () {
      var $this = $(this);

      $this.data('instantsearch', new $.InstantSearch($this, opts));
    });
  };

  /**
   * jQuery InstantSearch object
   *
   * @constructor
   *
   * @param {jQuery} $el input element
   * @param {object} options instantsearch options
   * @param {function} options.source
   * @param {function} options.action
   * @param {boolean} options.closeOnBlur
   * @param {boolean} options.completeOnEnter
   * @param {boolean} options.showNoResults
   */
  $.InstantSearch = function ($el, options) {
    var self = this
      , el = $el[0]
      , id = el.id
      , name = el.name
      , classes = el.className;

    this.src = options.source;
    this.action = options.action;
    this.closeOnBlur = options.closeOnBlur;
    this.completeOnEnter = options.completeOnEnter;
    this.showNoResults = options.showNoResults;

    this.$el = $(
      '<div class="instasearch-wrapper">'+
      '<input class="instainput" type="text" autocomplete="off" spellcheck="false" dir="ltr">'+
      '<input class="instaghost" disabled autocomplete="off">'+
      '</div>'
    );
    $el.replaceWith(this.$el);

    this.$res = $(
      '<div class="instaresults">' +
      '<ul class="instalist"></ul>' +
      '</div>'
    ).hide().appendTo('body');

    this.$input = this.$el.find('.instainput');
    this.$input.attr({ id: id || null, name: name || null })
               .addClass(classes);

    this.$ghost = this.$el.find('.instaghost');

    this.$input.on('keydown', function (e) {
      var keyCode = e.keyCode;

      if (IGNORED_KEY_CODES.indexOf(keyCode) !== -1) return;

      switch(keyCode) {

        // up
        case 38:
          self.navigate(-1);
          e.preventDefault();
          break;

        // right
        case 39:
          self.complete();
          break;

        // down
        case 40:
          self.navigate(1);
          e.preventDefault();
          break;

        // tab
        case 9:
          if (self.complete()) {
            self.search();
            e.preventDefault();
          }
          break;

        // return
        case 13:
          if (self.completeOnEnter) {
            self.complete();
            self.trigger();
          } else {
            self.reset();
            self.trigger();
          }
          e.preventDefault();
          break;

        // escape
        case 27:
          self.reset();
          break;

        default:
          self.search();
      }

    });

    this.$input.on('cut paste', function (e) {
      self.search();
    });

    if (this.closeOnBlur) {
      this.$input.on('blur', function (e) {
        self.reset();
      });

      this.$input.on('focus', function (e) {
        self.search();
      });
    }

    this.$res.on('mouseenter', '.instalist .instaresult', function (e) {
      var items = self.$res.find('.instalist .instaresult')
        , index = items.index(this);

      self.navigateTo(index);
    });

    this.$res.on('mouseleave', function (e) {
      self.navigateTo(-1);
    });

    this.$res.on('mousedown', function (e) {
      self.complete();
      self.reset();
      self.trigger();
    });
  };

  $.InstantSearch.prototype = {

    _rel: ''

  , _sel: -1

  , search: function () {
      var self = this;

      this._tid && clearTimeout(this._tid);
      this._tid = setTimeout(function () {
        var q = self._val = self.$input.val()
          , part;

        if (q === '') return self.showResults();

        part = self._rel.slice(0, q.length);

        if (q.toLowerCase() === part.toLowerCase()) {
          // Case doesn't match, match casing in ghost
          if (q !== part) {
            self.$ghost.val(q + self._rel.slice(q.length));
          }
        } else {
          // Hide ghost if we no longer match it
          self.$ghost.val('');
        }

        self.src({ term: q }, function (data, err) {
          if (err) throw new Error(err);

          self._data = data;
          self.showResults(data, self.showNoResults);
        });
      }, 0);
    }

  , showResults: function (data, showNoResults) {
      var self = this
        , res = this.$res
        , list = res.find('.instalist')
        , ghost = this.$ghost
        , val = this.$input.val()
        , len = data && data.length
        , $body = $('body')
        , i = 0
        , content = ''
        , onEscape
        , result
        , guess;

      // Don't show results again if value hasn't changed
      if (val === this._triggeredValue) { return; }
      this._triggeredValue = null;

      list.empty();

      this._sel = -1;

      if (val === '' || !data || data.length === 0) {
        ghost.val('');

        if (showNoResults && val !== '') {
          res.show();
          list.append('<li class="instanone">No Results</li>');
        } else {
          res.hide();
          $body.off('keydown', onEscape);
        }

        return false;
      }

      $('body').on('keydown', onEscape = function (e) {
        e.keyCode === 27 && self.reset();
      });

      for (; i < len; i++) {
        result = new SearchResult(val, data[i]);

        //
        if (i === 0) {
          guess = result.guess;

          this._rel = guess;
          ghost.val(guess);
        }

        content += result.el;
      }

      list.append(content);

      if (res.is(':hidden')) {
        res.css({
          position: 'absolute',
          top: this.$el.offset().top + this.$el.outerHeight(),
          left: this.$el.offset().left,
          width: this.$el.outerWidth()
        }).show();
      }

      return true;
    }

  , navigate: function (dir) {
      var items = this.$res.find('.instalist .instaresult')
        , sel;

      if (items.length === 0) return;

      sel = this._sel + dir;
      if (sel < -1) {
        sel += items.length + 1;
      } else if (sel >= items.length) {
        sel -= items.length + 1;
      }

      this.navigateTo(sel);
    }

  , navigateTo: function (sel) {
      var items = this.$res.find('.instalist .instaresult');

      items.removeClass('instahighlight');
      $(items[sel]).addClass('instahighlight');

      if (sel === -1) {
        this.$input.val(this._val) && this.$ghost.val(this._rel);
      } else {
        this.$input.val(this._data[sel]) && this.$ghost.val('');
      }

      this._sel = sel;
    }

  , reset: function () {
      this.showResults(null);
    }

  , complete: function () {
      if (this.$ghost.val()) {
        this._val = this._data[0];
        this._rel = '';
        this.$input.val(this._val);
        this.$ghost.val('');

        return true;
      } else {
        return false;
      }
    }

  , valueIsInList: function (value) {
      return this._data && $.inArray(value, this._data) !== -1;
    }

  , trigger: function () {
      var value = this._triggeredValue = this.$input.val();

      if (this.action) {
        this.action.call(this, value);
      } else {
        this.$el.parent('form').submit();
      }
    }

  };

}(jQuery));
