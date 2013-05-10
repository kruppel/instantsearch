/**
 * instantsearch: GOOGish autocomplete © Kurt Ruppel 2013
 *
 * https://github.com/kruppel/instantsearch
 * LICENSE: MIT
 */

(function ($) {

  var indexOf
    , bind
    , listeners = {}
    , IGNORED_KEY_CODES;

  IGNORED_KEY_CODES = [
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

  indexOf = Array.prototype.indexOf || function(item, from) {
    var i = from ? from : 0
      , len = el.length
      , inArray = false;

    while (!inArray && i < len) {
      if (this[i] === el) {
        inArray = true;
        return;
      }

      i++;
    }

    return inArray ? i : -1;
  };

  bind = Function.prototype.bind || function(context) {
    var fn = this;

    return function () {
      fn.apply(context, arguments);
    };
  };

  function wrapInput(input) {
    var wrapper = document.createElement('div')
      , classes = input.className;

    wrapper.className = 'instasearch-wrapper';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    input.className = classes ? classes + ' instainput' : 'instainput';
    input.setAttribute('autocomplete', 'off');
    input.spellcheck = false;

    ghost = document.createElement('input');
    ghost.className = classes ? classes + ' instaghost' : 'instaghost';
    ghost.setAttribute('autocomplete', 'off');
    ghost.disabled = true;
    wrapper.appendChild(ghost);

    return wrapper;
  }

  function unwrapInput(input) {
    var wrapper = input.parentNode
      , parentNode = wrapper.parentNode
      , classes = input.className.split(' ');

    parentNode.insertBefore(input, wrapper);
    parentNode.removeChild(wrapper);

    classes.splice(indexOf.call(classes, 'instainput'), 1);
    input.className = classes.join(' ');

    return input;
  }

  function appendResults() {
    var fragment = document.createDocumentFragment()
      , results = document.createElement('div')
      , list = document.createElement('ul');

    results.className = 'instaresults';
    list.className = 'instalist';

    results.appendChild(list);
    results.style.display = 'none';
    fragment.appendChild(results);

    document.body.appendChild(results);

    return results;
  }

  function onInput(e) {
    var keyCode = e.keyCode;

    if (indexOf.call(IGNORED_KEY_CODES, keyCode) !== -1) return;

    switch(keyCode) {

      // up
      case 38:
        this.navigate(-1);
        e.preventDefault();
        break;

      // right
      case 39:
        this.complete();
        break;

      // down
      case 40:
        this.navigate(1);
        e.preventDefault();
        break;

      // tab
      case 9:
        if (this.complete()) {
          this.search();
          e.preventDefault();
        }
        break;

      // return
      case 13:
        if (this.completeOnEnter) {
          this.complete();
          this.trigger();
        } else {
          this.reset();
          this.trigger();
        }
        e.preventDefault();
        break;

      // escape
      case 27:
        this.reset();
        break;

      default:
        this.search();
    }
  }

  function onCutPaste(e) {
    this.search();
  }

  function onFocusOut(e) {
    this.$input.trigger('instantsearch.blur', this);
  }

  function onFocusIn(e) {
    this.$input.trigger('instantsearch.focus', this);
  }

  function onResultEnter(e) {
    var results = this.$res.find('.instaresult')
      , index = results.index(e.target);

    this.navigateTo(index);
  }

  function onResultLeave(e) {
    this.navigateTo(-1);
  }

  function onSelected(e) {
    this.complete();
    this.reset();
    this.trigger();
  }

  function onDestroy() {
    // XXX - unbind events
    // XXX - restore input
    this.$input.off('instantsearch.destroy');
  }

  function bindEvent() {
    /* TO BE IMPLEMENTED */
  }

  function bindEvents() {
    this.$input.on('keydown', bind.call(onInput, this));
    this.$input.on('cut paste', bind.call(onCutPaste, this));
    this.$input.on('blur', bind.call(onFocusOut, this));
    this.$input.on('focus', bind.call(onFocusIn, this));

    this.$res.on('mouseenter', '.instalist .instaresult', bind.call(onResultEnter, this));
    this.$res.on('mouseleave', bind.call(onResultLeave, this));
    this.$res.on('mousedown', bind.call(onSelected, this));

    this.$input.on('instantsearch.destroy', bind.call(onDestroy, this));
  }

  function unbindEvents() {
    /* TO BE IMPLEMENTED */
  }

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
    var opts = $.extend({}, options)
      , destroy = options === 'destroy';

    return this.each(function () {
      var $this = $(this);

      if (destroy) return $this.trigger('instantsearch.destroy');

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
      , input = $el[0]
      , wrapper
      , results;

    this.src = options.source;
    this.action = options.action;
    this.closeOnBlur = options.closeOnBlur;
    this.completeOnEnter = options.completeOnEnter;
    this.showNoResults = options.showNoResults;

    wrapper = wrapInput(input);
    this.$el = $(wrapper);
    this.$input = $el;
    this.$ghost = $(input.nextSibling);

    results = appendResults();
    this.$res = $(results);

    bindEvents.call(this);
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
