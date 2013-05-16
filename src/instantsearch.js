/**
 * instantsearch: GOOGish autocomplete © Kurt Ruppel 2013
 *
 * https://github.com/kruppel/instantsearch
 * LICENSE: MIT
 */

(function ($) {

  var indexOf
    , bind
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
        /**
         * 'right' is a little more complicated. Most of the time we can assume
         * that the last cursor will be at the end of the input string. However,
         * in the case where the cursor is moved to another position (e.g.
         * moving the cursor via the mouse), the 'right' key should not complete
         * the value. The solution is to first check cursor position before
         * invoking `complete`.
         */
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
        } else {
          this.reset();
        }

        this.select();
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
    this.select();
  }

  function onEscape(e) {
    e.keyCode === 27 && this.reset();
  }

  function onDestroy() {
    unbindEvents.call(this);
    unwrapInput(this.$input[0]);
    document.body.removeChild(this.$res[0]);
  }

  function bindEvent($el, type, selector, fn) {
    var listeners = this._listeners
      , bound
      , tagName;

    if (!fn) {
      fn = selector;
      selector = undefined;
    }

    bound = bind.call(fn, this);
    tagName = $el[0].tagName;
    $el.on(type, selector, bound);

    !listeners[tagName] && (listeners[tagName] = {});
    listeners[tagName][type] = [$el, selector, bound];
  }

  function bindEvents() {
    bindEvent.call(this, this.$input, 'keydown', onInput);
    bindEvent.call(this, this.$input, 'cut paste', onCutPaste);
    bindEvent.call(this, this.$input, 'blur', onFocusOut);
    bindEvent.call(this, this.$input, 'focus', onFocusIn);

    bindEvent.call(this, this.$res, 'mouseenter', '.instaresult', onResultEnter);
    bindEvent.call(this, this.$res, 'mouseleave', onResultLeave);
    bindEvent.call(this, this.$res, 'mousedown', onSelected);

    bindEvent.call(this, this.$input, 'instantsearch.destroy', onDestroy);
  }

  function unbindEvent(tagName, type) {
    var listeners = this._listeners
      , byTagName = listeners[tagName]
      , store = byTagName && listeners[tagName][type];

    if (!store) return;

    store[0].off(type, store[1], store[2]);
    listeners[tagName][type] = null;
  }

  function unbindEvents() {
    var listeners = this._listeners
      , tagName
      , list
      , type;

    for (tagName in listeners) {
      list = listeners[tagName];

      for (type in list) {
        unbindEvent.call(this, tagName, type);
      }
    }
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

      $this.trigger('instantsearch.destroy');

      if (destroy) return;

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
   * @param {boolean} options.completeOnEnter
   * @param {boolean} options.showNoResults
   */
  $.InstantSearch = function ($el, options) {
    var self = this
      , input = $el[0]
      , wrapper
      , results;

    this.src = options.source;
    this.completeOnEnter = options.completeOnEnter;
    this.showNoResults = options.showNoResults;

    wrapper = wrapInput(input);
    this.$el = $(wrapper);
    this.$input = $el;
    this.$ghost = $(input.nextSibling);

    results = appendResults();
    this.$res = $(results);
    this.$list = this.$res.find('.instalist');

    bindEvents.call(this);
  };

  $.InstantSearch.prototype = {

    _listeners: {}

  , _q: []

  , _rel: ''

  , _sel: -1

  , search: function () {
      var self = this;

      this._tid && clearTimeout(this._tid);
      this._tid = setTimeout(function () {
        var q = self._val = self.$input.val()
          , qid
          , part;

        if (q === '') return self.reset();

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

        qid = (new Date()).getTime() + q;
        self._q.push(qid);
        self.src({ term: q }, function (data, err) {
          var index;

          if (err) throw new Error(err);

          index = indexOf.call(self._q, qid);
          if (index === -1) return;

          self._q = self._q.slice(index + 1);
          self._data = data;

          self.showResults(data);
          self.$input.trigger({ type: 'instantsearch.search', results: data });
        });
      }, 0);
    }

  , showResults: function (data) {
      var ghost = this.$ghost
        , val = this.$input.val()
        , content = ''
        , i
        , len
        , result
        , guess;

      if (val === '') {
        return this.reset();
      } else if (!data || !data.length) {
        return this.showNone();
      }

      this.reset();
      bindEvent.call(this, $(document.body), 'keydown', onEscape);

      for (i = 0, len = data.length; i < len; i++) {
        result = new SearchResult(val, data[i]);

        //
        if (i === 0) {
          guess = result.guess;

          this._rel = guess;
          ghost.val(guess);
        }

        content += result.el;
      }

      this.$list.append(content);

      if (this.$res.is(':hidden')) {
        this.$res.css({
          position: 'absolute'
        , top: this.$el.offset().top + this.$el.outerHeight()
        , left: this.$el.offset().left
        , width: this.$el.outerWidth()
        }).show();
      }

      return true;
    }

  , navigate: function (dir) {
      var items = this.$list.find('.instaresult')
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
      var items = this.$list.find('.instaresult');

      items.removeClass('instahighlight');
      $(items[sel]).addClass('instahighlight');

      if (sel === -1) {
        this.$input.val(this._val) && this.$ghost.val(this._rel);
      } else {
        this.$input.val(this._data[sel]) && this.$ghost.val('');
      }

      this._sel = sel;
    }

  , showNone: function () {
      if (this.showNoResults) {
        this.reset(true);
        this.$list.append(
          '<li class="instanone">No Results</li>'
        );
      } else {
        this.reset();
      }

      return false;
    }

  , reset: function (showOrHide) {
      var $res = this.$res;

      this.$ghost.val('');
      this.$list.empty();
      this._sel = -1;
      this.$res.toggle(!!showOrHide);
      !showOrHide && this.$input.trigger('instantsearch.reset');

      unbindEvent.call(this, document.body.tagName, 'keydown');

      return false;
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

  , select: function () {
      this._q = [];

      this.$input.trigger({
        type: 'instantsearch.selected'
      , selected: this.$input.val()
      });
    }

  };

}(jQuery));
