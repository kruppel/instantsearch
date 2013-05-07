describe('instantsearch', function () {

  beforeEach(function () {
    this.$sandbox = $('#sandbox');

    this.$input = $('<input>');
    this.$input.appendTo('#sandbox');
  });

  afterEach(function () {
    this.$sandbox.empty();

    this.$sandbox = null;
    this.$input = null;
  });

  describe('when initialized', function () {

    it('replaces input with instant search field', function () {
      this.$input.instantSearch();

      $('#sandbox').html().should.equal(
        '<div class="instant-search-field"><input class="input" type="text" autocomplete="off" spellcheck="false" dir="ltr"><input class="ghost" disabled="" autocomplete="off"></div>'
      );
    });

  });

  describe('when input keydown event fires', function () {

    describe('and key code is', function () {

      var IGNORED_KEY_CODES = {
        'shift': 16,
        'ctrl': 17,
        'alt': 18,
        'pause/break': 19,
        'caps lock': 20,
        'page up': 33,
        'page down': 34,
        'end': 35,
        'home': 36,
        'left': 37,
        'insert': 45,
        'windows key/cmd': 91,
        'select': 93,
        'f1': 112,
        'f2': 113,
        'f3': 114,
        'f4': 115,
        'f5': 116,
        'f6': 117,
        'f7': 118,
        'f8': 119,
        'f9': 120,
        'f10': 121,
        'f11': 122,
        'f12': 123,
        'f13': 124,
        'f14': 125,
        'f15': 126
      };

      $.each(IGNORED_KEY_CODES, function (key, val) {

        var keyCode = IGNORED_KEY_CODES[key];

        describe(key, function () {

          beforeEach(function () {
            sinon.stub($.InstantSearch.prototype, 'navigate');
            sinon.stub($.InstantSearch.prototype, 'complete');
            sinon.stub($.InstantSearch.prototype, 'trigger');
            sinon.stub($.InstantSearch.prototype, 'search');

            this.$input.instantSearch();
            this.$instainput = $('.input');
          });

          afterEach(function () {
            $.InstantSearch.prototype.navigate.restore();
            $.InstantSearch.prototype.complete.restore();
            $.InstantSearch.prototype.trigger.restore();
            $.InstantSearch.prototype.search.restore();

            this.$instainput = null;
          });

          it('does not set input value', function () {
            this.$instainput.keydown({ keyCode: keyCode });

            this.$instainput.val().should.be.empty;
          });

          it('does not navigate', function () {
            this.$instainput.keydown({ keyCode: keyCode });

            $.InstantSearch.prototype.navigate.should.not.have.been.called;
          });

          it('does not complete', function () {
            this.$instainput.keydown({ keyCode: keyCode });

            $.InstantSearch.prototype.complete.should.not.have.been.called;
          });

          it('does not trigger', function () {
            this.$instainput.keydown({ keyCode: keyCode });

            $.InstantSearch.prototype.trigger.should.not.have.been.called;
          });

          it('does not search', function () {
            this.$instainput.keydown({ keyCode: keyCode });

            $.InstantSearch.prototype.search.should.not.have.been.called;
          });

        });

      });

      describe('up', function () {
      });

      describe('right', function () {
      });

      describe('down', function () {
      });

      describe('tab', function () {
      });

      describe('return', function () {
      });

      describe('escape', function () {
      });

    });

  });

  describe('when cut event fires', function () {
  });

  describe('when copy event fires', function () {
  });

  describe('when close on blur option is set to true', function () {
  });

  describe('when close on blur option is set to false', function () {
  });

  describe('when mouse enters search result', function () {
  });

  describe('when mouse leaves search result', function () {
  });

  describe('when mousedown event fires on search results', function () {
  });

});
