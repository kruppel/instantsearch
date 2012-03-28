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

        // up
        case 38:
          self.navigate(-1)
          e.preventDefault()
          break

        // right
        case 39:
          self._val = self._data[0].name
          self._rel = ''
          self.$input.val(self._val)
          self.$ghost.val('')
          break

        // down
        case 40:
          self.navigate(1)
          e.preventDefault()
          break

        // tab
        case 9:
          break

        // return
        case 13:
          break

        // escape
        case 27:
          break

        default:
          self._sel = 0
          self.doIt()
      }

    })

  }

  $.InstantSearch.prototype = {

    _rel: ''

  , _sel: -1

    doIt: function () {
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

      if (val === '' || !data) return ghost.val('') && res.hide() && false

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
      if (sel < -1 || sel >= rows.length) return

      rows.removeClass('trh');
      $(rows[sel]).addClass('trh');

      if (sel === -1) {
        this.$input.val(this._val) && this.$ghost.val(this._rel)
      } else {
        this.$input.val(this._data[sel].name) && this.$ghost.val('')
      }

      this._sel = sel
    }

      curr !== 0 && (rows[curr - 1].className = '')

      if (next === 0) this.$input.val(this._val) && this.$ghost.val(this._rel)
      else rows[ri].className = this.$input.val(this._data[next - 1].name) && this.$ghost.val('') ? 'trh' : ''
    }

  }

}(lib)
