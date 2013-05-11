describe('instantsearch', function () {

  var STATES = [
    'Alabama'
  , 'Alaska'
  , 'American Samoa'
  , 'Arizona'
  , 'Arkansas'
  , 'California'
  , 'Colorado'
  , 'Connecticut'
  , 'Delaware'
  , 'District Of Columbia'
  , 'Federated States Of Micronesia'
  , 'Florida'
  , 'Georgia'
  , 'Guam'
  , 'Hawaii'
  , 'Idaho'
  , 'Illinois'
  , 'Indiana'
  , 'Iowa'
  , 'Kansas'
  , 'Kentucky'
  , 'Louisiana'
  , 'Maine'
  , 'Marshall Islands'
  , 'Maryland'
  , 'Massachusetts'
  , 'Michigan'
  , 'Minnesota'
  , 'Mississippi'
  , 'Missouri'
  , 'Montana'
  , 'Nebraska'
  , 'Nevada'
  , 'New Hampshire'
  , 'New Jersey'
  , 'New Mexico'
  , 'New York'
  , 'North Carolina'
  , 'North Dakota'
  , 'Northern Mariana Islands'
  , 'Ohio'
  , 'Oklahoma'
  , 'Oregon'
  , 'Palau'
  , 'Pennsylvania'
  , 'Puerto Rico'
  , 'Rhode Island'
  , 'South Carolina'
  , 'South Dakota'
  , 'Tennessee'
  , 'Texas'
  , 'Utah'
  , 'Vermont'
  , 'Virgin Islands'
  , 'Virginia'
  , 'Washington'
  , 'West Virginia'
  , 'Wisconsin'
  , 'Wyoming'
  ];

  beforeEach(function () {
    this.$sandbox = $('#sandbox');

    this.$input = $('<input>');
    this.$input.appendTo('#sandbox');
  });

  afterEach(function () {
    this.$input.trigger('instantsearch.destroy');
    this.$sandbox.empty();

    this.$sandbox = null;
    this.$input = null;
  });

  describe('when initialized', function () {

    describe('in wrapping input', function () {

      it('wraps input in a div', function () {
        this.$input.instantSearch();

        this.$input[0].parentNode.className.should.equal('instasearch-wrapper');
      });

      it('adds .instainput class to input', function () {
        this.$input.addClass('test');
        this.$input.instantSearch();

        this.$input[0].className.should.equal('test instainput');
      });

      it('sets input autocomplete to \'off\'', function () {
        this.$input.instantSearch();

        this.$input.attr('autocomplete').should.equal('off');
      });

      it('creates a ghost input', function () {
        this.$input.addClass('test');
        this.$input.instantSearch();

        this.$input.next()[0].className.should.equal('test instaghost');
      });

    });

    describe('in appending results container to body', function () {

      it('initially hides results', function () {
        this.$input.instantSearch();

        $('.instaresults').css('display').should.equal('none');
      });

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
            this.$instainput = $('.instainput');
          });

          afterEach(function () {
            $.InstantSearch.prototype.navigate.restore();
            $.InstantSearch.prototype.complete.restore();
            $.InstantSearch.prototype.trigger.restore();
            $.InstantSearch.prototype.search.restore();

            this.$instainput = null;
          });

          it('does not set input value', function () {
            this.$instainput.trigger($.Event('keydown', { keyCode: keyCode }));

            this.$instainput.val().should.be.empty;
          });

          it('does not navigate', function () {
            this.$instainput.trigger($.Event('keydown', { keyCode: keyCode }));

            $.InstantSearch.prototype.navigate.should.not.have.been.called;
          });

          it('does not complete', function () {
            this.$instainput.trigger($.Event('keydown', { keyCode: keyCode }));

            $.InstantSearch.prototype.complete.should.not.have.been.called;
          });

          it('does not trigger', function () {
            this.$instainput.trigger($.Event('keydown', { keyCode: keyCode }));

            $.InstantSearch.prototype.trigger.should.not.have.been.called;
          });

          it('does not search', function () {
            this.$instainput.trigger($.Event('keydown', { keyCode: keyCode }));

            $.InstantSearch.prototype.search.should.not.have.been.called;
          });

        });

      });

      describe('up', function () {

        var keyCode = 38;

        describe('and no results are displayed', function () {

          beforeEach(function () {
            this.$input.instantSearch();
            this.$instainput = $('.instainput');
          });

          afterEach(function () {
            this.$instainput = null;
          });

          it('does not highlight a result', function () {
            this.$instainput.trigger($.Event('keydown', { keyCode: keyCode }));

            $('.instahighlight').length.should.equal(0);
          });

        });

        describe('and results are displayed', function () {

          beforeEach(function () {
            this.$input.instantSearch({
              source: function (req, res) {
                var re = new RegExp(req.term, 'i'),
                    results;

                results = $.grep(STATES, function (state) {
                  return state.match(re);
                });

                res(results, null);
              }
            });

            this.$instainput = $('.instainput');
            this.$results = $('.instaresults');

            // "O" = 79
            this.$instainput.val("O");
            this.$instainput.trigger($.Event('keydown', { keyCode: 79 }));
          });

          afterEach(function () {
            this.$results.remove();

            this.$instainput = null;
            this.$results = null;
          });

          describe('and without highlight', function () {

            it('highlights last result', function () {
              var results = this.$results.find('.instaresult');

              console.log(this.$results.html());
            });

          });

          describe('and on first result', function () {
          });

          describe('and on last result', function () {
          });

        });

        it('prevents default', function (done) {
          this.$input.instantSearch();
          this.$instainput = $('.instainput');
          this.$instainput.on('keydown', function (e) {
            e.isDefaultPrevented().should.be.true;

            done();
          });
          this.$instainput.trigger($.Event('keydown', { keyCode: keyCode }));
        });

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

  describe('when destroyed', function () {
  });

});
