/*!
  * instantsearch: GOOGish autocomplete © Kurt Ruppel 2012
  *
  * https://github.com/kruppel/instantsearch
  * LICENSE: MIT
  */

var lib = $ === jQuery ? jQuery : ender

!function ($) {

  var instantSearch = function (options) {
        var opts = $.extend({}, options)

        return this.each(function () {
          var $this = $(this)

          $this.data('instantsearch', new $.InstantSearch($this, opts))
        })
      }
    , fn = $ === jQuery ? $.fn : $.ender

  fn['instantSearch'] = instantSearch

  $.InstantSearch = function ($el, options) {
    var self = this
      , id   = $el.attr('id')
      , name = $el.attr('name')

    this.src = options.source

    this.$el = $('<div class="instant-search-field">'+
                   '<input class="input" type="text" autocomplete="off" spellcheck="false" dir="ltr">'+
                   '<input class="ghost" disabled autocomplete="off">'+
                 '</div>')
    $el.replaceWith(this.$el)

    this.$res = $('<div class="instant-search-results"><ul class="list"></ul></div>')
                  .css({
                    position: 'absolute',
                    top:      this.$el.offset().top + this.$el.outerHeight(),
                    left:     this.$el.offset().left,
                    width:    this.$el.outerWidth()
                  })
                  .hide()
                  .appendTo('body')

    this.$input = this.$el.find('.input')
    this.$input.attr({ id: id, name: name })

    this.$ghost = this.$el.find('.ghost')

    this.$el.on('keydown', function (e) {

      switch(e.keyCode) {

        // left
        case 37:
          break

        // up
        case 38:
          self.navigate(-1)
          e.preventDefault()
          break

        // right
        case 39:
          self.complete();
          break

        // down
        case 40:
          self.navigate(1)
          e.preventDefault()
          break

        // tab
        case 9:
          if (self.complete()) {
            self.search();
            e.preventDefault();
          }
          break

        // return
        case 13:
        // escape
        case 27:
          self.reset();
          break

        // shift
        case 16:
        // ctrl
        case 17:
        // alt
        case 18:
        // pause/break
        case 19:
        // caps lock
        case 20:
        // page up
        case 33:
        // page down
        case 34:
        // end
        case 35:
        // home
        case 36:
        // insert
        case 45:
        // window key / cmd
        case 91:
        case 92:
        // select
        case 93:
          // TODO: We might want f-keys here too
          break

        default:
          self.search()
      }

    })

    this.$res.on('mouseenter', 'ul.list li', function (e) {
      var items = self.$res.find('ul.list li')
        , idx   = items.index(this)
      self.navigateTo(idx)
    })

    this.$res.on('mouseleave', function (e) {
      self.navigateTo(-1)
    })

    this.$res.on('click', function (e) {
      self.complete()
      self.reset()
    })

  }

  $.InstantSearch.prototype = {

    _rel: ''

  , _sel: -1

  , search: function () {
      var self = this

      this._tid && clearTimeout(this._tid)
      this._tid = setTimeout(function () {
        var q = self._val = self.$input.val()

        if (q === '') return self.showResults()

        // Hide ghost if we no longer match it
        if (q.toLowerCase() !== self._rel.slice(0, q.length).toLowerCase()) {
          self.$ghost.val('');
        }

        self.src({ term: q }, function (data, err) {
          if (err) throw new Error(err)

          self._data = data
          self.showResults(data)
        })
      }, 0)
    }

  , showResults: function (data) {
      var res = this.$res
        , list = res.find('ul.list')
        , ghost = this.$ghost
        , val = this.$input.val()
        , len = data && data.length
        , i

      list.empty()

      if (val === '' || !data || data.length === 0) return ghost.val('') && res.hide() && false

      $('body').on('keydown', $.proxy(this._bodyKeydown, this))

      for (i = 0; i < len; i++) {
        var result = data[i].name
          , regex = new RegExp('(' + val + ')(.*)', 'i')
          , matchset = result.match(regex) || {}
          , start = result.substr(0, matchset.index)
          , match = matchset[1] || ''
          , rest =  matchset[2] || ''
          , guess = (start === '' && rest !== '') ? val + rest : ''
          , content

        i === 0 && (this._rel = guess) && ghost.val(guess)

        content = '<li><strong>' + start + '</strong>' + match + '<strong>' + rest + '</strong></li>'

        list.append(content)
      }

      res.is(':hidden') && res.show()
      return true
    }

  , navigate: function (dir) {
      var items = this.$res.find('ul.list li')

      if (items.length === 0) return

      var sel = this._sel + dir
      if (sel < -1) sel += (items.length + 1)
      if (sel >= items.length) sel -= (items.length + 1)

      this.navigateTo(sel);
    }

  , navigateTo: function (sel) {
      var items = this.$res.find('ul.list li')

      items.removeClass('highlight');
      $(items[sel]).addClass('highlight');

      if (sel === -1) {
        this.$input.val(this._val) && this.$ghost.val(this._rel)
      } else {
        this.$input.val(this._data[sel].name) && this.$ghost.val('')
      }

      this._sel = sel
    }

  , reset: function () {
      $('body').off('keydown', this._bodyKeydown)

      this._sel = -1;
      this.showResults(null);
    }

  , complete: function () {
      if (this.$ghost.val()) {
        this._val = this._data[0].name
        this._rel = ''
        this.$input.val(this._val)
        this.$ghost.val('')
        return true
      } else {
        return false
      }
    }

  , _bodyKeydown: function (e) {
      // escape
      if (e.keyCode === 27) this.reset()
    }

  }

}(lib)
