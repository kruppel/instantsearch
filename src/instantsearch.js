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

    this.src = options.source
    this.$el = $el

    $el.append('<div id="qfqw"><div id="qfqwb"><table cellspacing="0" cellpadding="0"><tr><td style="vertical-align:top;"><table cellspacing="0" cellpadding="0" style="width:100%"><tbody><tr><td style="min-width:1px;white-space:nowrap;"></td><td class="sib_a"><div id="qfqfi"><input class="qfif input" name="q" type="text" autocomplete="off" spellcheck="false" dir="ltr"><input class="qfif ghost" disabled autocomplete="off"></div></td></tr></tbody></table></td></tr></table></div></div>')

    this.$res = $('<table cellspacing="0" cellpadding="0" class="sbr_c" style="display:none;"><tbody><tr><td style="width:100%;"><table cellspacing="0" cellpadding="0" style="width:100%;" class="sbr_d"><tbody><tr><td></td></tr></tbody></table></td></tr></tbody></table>')
                  .css({
                    position: 'absolute',
                    top:      $el.offset().top + $el.height(),
                    left:     $el.offset().left,
                    width:    $el.width()
                  })
                  .appendTo('body')

    this.$resList = $('<table cellspacing="0" cellpadding="0" style="width:100%;" class="sbr_e"><tbody></tbody></table>').appendTo(this.$res.find('.sbr_d td'))

    this.$input = $el.find('.input')
    this.$ghost = $el.find('.ghost')

    $el.on('keydown', function (e) {

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

    function getIndex (element) {
      var rows = self.$resList.find('.sbr_a tr')
        , row = $(element).parent('tr')
        , idx = rows.index(row)

      return idx
    }

    this.$resList.on('mouseenter', '.sbr_a tr', function (e) {
      self.navigateTo(getIndex(e.target))
    })

    this.$resList.on('mouseleave', function (e) {
      self.navigateTo(-1)
    })

    this.$resList.on('click', function (e) {
      self.search()
      self.$input.focus()
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
        , tb = res.find('.sbr_e > tbody')
        , ghost = this.$ghost
        , val = this.$input.val()
        , len = data && data.length
        , i

      tb.empty()

      if (val === '' || !data || data.length === 0) return ghost.val('') && res.hide() && false

      $('body').on('keydown', $.proxy(this._bodyKeydown, this))

      for (i = 0; i < len; i++) {
        var result = data[i].name
          , regex = new RegExp('(' + val + ')(.*)', 'i')
          , matchset = result.match(regex) || {}
          , start = result.substr(0, matchset.index)
          , match = matchset[1] || ''
          , rest =  matchset[2] || ''
          , content = '<tr><td class="sbr_a" dir="ltr" style="text-align: left;"><div class="sbq_a"><table cellspacing="0" cellpadding="0" style="width: 100%;" class="sbr_m"><tbody><tr><td style="width: 100%;">'
          , guess = (start === '') ? val + rest : '';

        i === 0 && (this._rel = guess) && ghost.val(guess)
        content += '<span><b>' + start + '</b>' + match + '<b>' + rest + '</b></span></td></tr></tbody></table></div></td></tr>'
        tb.append(content)
      }

      res.is(':hidden') && res.show()
      return true
    }

  , navigate: function (dir) {
      var rows = this.$resList.find('.sbr_a tr')

      if (rows.length === 0) return

      var sel = this._sel + dir
      if (sel < -1) sel += (rows.length + 1)
      if (sel >= rows.length) sel -= (rows.length + 1)

      this.navigateTo(sel);
    }

  , navigateTo: function (sel) {
      var rows = this.$resList.find('.sbr_a tr')

      rows.removeClass('trh');
      $(rows[sel]).addClass('trh');

      if (sel === -1) {
        this.$input.val(this._val) && this.$ghost.val(this._rel)
      } else {
        this.$input.val(this._data[sel].name) && this.$ghost.val('')
      }

      this._sel = sel
    }

  , reset: function () {
      $('body').off('keydown', this._bodyKeydown)

      this.$res.hide()
      this.$ghost.val('')
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
