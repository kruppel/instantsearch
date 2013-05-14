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

  function getStates(req, res) {
    var re = new RegExp(req.term, 'i')
      , results;

    results = $.grep(STATES, function (state) {
      return state.match(re);
    });

    res(results, null);
  }

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
        'shift': 16
      , 'ctrl': 17
      , 'alt': 18
      , 'pause/break': 19
      , 'caps lock': 20
      , 'page up': 33
      , 'page down': 34
      , 'end': 35
      , 'home': 36
      , 'left': 37
      , 'insert': 45
      , 'windows key/cmd': 91
      , 'select': 93
      , 'f1': 112
      , 'f2': 113
      , 'f3': 114
      , 'f4': 115
      , 'f5': 116
      , 'f6': 117
      , 'f7': 118
      , 'f8': 119
      , 'f9': 120
      , 'f10': 121
      , 'f11': 122
      , 'f12': 123
      , 'f13': 124
      , 'f14': 125
      , 'f15': 126
      };

      $.each(IGNORED_KEY_CODES, function (key, val) {

        var keyCode = IGNORED_KEY_CODES[key];

        describe(key, function () {

          beforeEach(function () {
            sinon.stub($.InstantSearch.prototype, 'navigate');
            sinon.stub($.InstantSearch.prototype, 'complete');
            sinon.stub($.InstantSearch.prototype, 'select');
            sinon.stub($.InstantSearch.prototype, 'search');

            this.$input.instantSearch();
          });

          afterEach(function () {
            $.InstantSearch.prototype.navigate.restore();
            $.InstantSearch.prototype.complete.restore();
            $.InstantSearch.prototype.select.restore();
            $.InstantSearch.prototype.search.restore();
          });

          it('does not set input value', function () {
            this.$input.trigger($.Event('keydown', { keyCode: keyCode }));

            this.$input.val().should.be.empty;
          });

          it('does not navigate', function () {
            this.$input.trigger($.Event('keydown', { keyCode: keyCode }));

            $.InstantSearch.prototype.navigate.should.not.have.been.called;
          });

          it('does not complete', function () {
            this.$input.trigger($.Event('keydown', { keyCode: keyCode }));

            $.InstantSearch.prototype.complete.should.not.have.been.called;
          });

          it('does not trigger', function () {
            this.$input.trigger($.Event('keydown', { keyCode: keyCode }));

            $.InstantSearch.prototype.select.should.not.have.been.called;
          });

          it('does not search', function () {
            this.$input.trigger($.Event('keydown', { keyCode: keyCode }));

            $.InstantSearch.prototype.search.should.not.have.been.called;
          });

        });

      });

      describe('up', function () {

        var keyCode = 38;

        describe('and results are displayed', function () {

          beforeEach(function (ready) {
            this.$input.instantSearch({
              source: getStates
            });

            this.$ghost = this.$input.next();
            this.$results = $('.instaresults');

            this.$input.on('instantsearch.search', function (e) {
              $(this).off('instantsearch.search');

              ready();
            });
            /**
             * "c" (67) then "O" (79)
             *
             * Results:
             *    [
             *      'Colorado'
             *    , 'Connecticut'
             *    , 'District Of Columbia'
             *    , 'New Mexico'
             *    , 'Puerto Rico'
             *    , 'Wisconsin'
             *    ]
             */
            this.$input.val('cO');
            this.$input.trigger($.Event('keydown', { keyCode: 79 }));
          });

          afterEach(function () {
            this.$results = null;
          });

          describe('and without highlight', function () {

            beforeEach(function () {
              this.$input.trigger($.Event('keydown', { keyCode: keyCode }));
            });

            it('highlights last result', function () {
              this.$results.find('.instahighlight').text().should.equal('Wisconsin');
            });

            it('sets input to last result', function () {
              this.$input.val().should.equal('Wisconsin');
            });

            it('sets ghost to empty string', function () {
              this.$ghost.val().should.equal('');
            });

          });

          describe('and on first result', function () {

            beforeEach(function () {
              this.$input.trigger($.Event('keydown', { keyCode: 40 }));
              this.$input.trigger($.Event('keydown', { keyCode: keyCode }));
            });

            it('does not highlight any results', function () {
              this.$results.find('.instahighlight').length.should.equal(0);
            });

            it('does not change input value', function () {
              this.$input.val().should.equal('cO');
            });

            it('sets ghost value to \'cOlorado\'', function () {
              this.$ghost.val().should.equal('cOlorado');
            });

          });

          describe('and on last result', function () {

            beforeEach(function () {
              this.$input.trigger($.Event('keydown', { keyCode: keyCode }));
              this.$input.trigger($.Event('keydown', { keyCode: keyCode }));
            });

            it('highlights second to last result', function () {
              this.$results.find('.instahighlight').text().should.equal('Puerto Rico');
            });

            it('sets input to second to last result', function () {
              this.$input.val().should.equal('Puerto Rico');
            });

            it('sets ghost to empty string', function () {
              this.$ghost.val().should.equal('');
            });

          });

        });

        it('prevents default', function (done) {
          this.$input.instantSearch();
          this.$input.on('keydown', function (e) {
            e.isDefaultPrevented().should.be.true;

            done();
          });
          this.$input.trigger($.Event('keydown', { keyCode: keyCode }));
        });

      });

      describe('right', function () {

        var keyCode = 39;

        describe('and results are displayed', function () {

          beforeEach(function () {
            this.$input.instantSearch({
              source: getStates
            });

            this.$ghost = this.$input.next();
            this.$results = $('.instaresults');
          });

          afterEach(function () {
            this.$ghost = null;
            this.$results = null;
          });

          describe('and beginning of input value matches top result', function () {

            beforeEach(function (ready) {
              this.$input.on('instantsearch.search', function (e) {
                var $this = $(this);

                $this.trigger($.Event('keydown', { keyCode: keyCode }));
                $this.off('instantsearch.search');

                ready();
              });
              /**
               * "c" (67) then "A" (65) then "l" (76)
               *
               * Results:
               *    [
               *      'California'
               *    ]
               */
              this.$input.val('cAl');
              this.$input.trigger($.Event('keydown', { keyCode: 76 }));
            });

            it('completes input value', function () {
              this.$input.val().should.equal('California');
            });

            it('sets ghost value to empty string', function () {
              this.$ghost.val().should.equal('');
            });

          });

          describe('and beginning of input value does not match top result', function () {

            beforeEach(function (ready) {
              this.$input.on('instantsearch.search', function (e) {
                var $this = $(this);

                $this.trigger($.Event('keydown', { keyCode: keyCode }));
                $this.off('instantsearch.search');

                ready();
              });
              /**
               * "c" (67) then "A" (65)
               *
               * Results:
               *    [
               *      'American Samoa'
               *    , 'California'
               *    , 'North Carolina'
               *    , 'South Carolina'
               *    ]
               */
              this.$input.val('cA');
              this.$input.trigger($.Event('keydown', { keyCode: 65 }));
            });

            it('does not complete input value', function () {
              this.$input.val().should.equal('cA');
            });

            it('does not change ghost value', function () {
              this.$ghost.val().should.equal('');
            });

          });

        });

      });

      describe('down', function () {

        var keyCode = 40;

        describe('and results are displayed', function () {

          beforeEach(function (ready) {
            this.$input.instantSearch({
              source: getStates
            });

            this.$ghost = this.$input.next();
            this.$results = $('.instaresults');

            this.$input.on('instantsearch.search', function (e) {
              $(this).off('instantsearch.search');

              ready();
            });
            /**
             * "c" (67) then "O" (79)
             *
             * Results:
             *    [
             *      'Colorado'
             *    , 'Connecticut'
             *    , 'District Of Columbia'
             *    , 'New Mexico'
             *    , 'Puerto Rico'
             *    , 'Wisconsin'
             *    ]
             */
            this.$input.val('cO');
            this.$input.trigger($.Event('keydown', { keyCode: 79 }));
          });

          afterEach(function () {
            this.$ghost = null;
            this.$results = null;
          });

          describe('and without highlight', function () {

            beforeEach(function () {
              this.$input.trigger($.Event('keydown', { keyCode: keyCode }));
            });

            it('highlights first result', function () {
              this.$results.find('.instahighlight').text().should.equal('Colorado');
            });

            it('sets input to first result', function () {
              this.$input.val().should.equal('Colorado');
            });

            it('sets ghost to empty string', function () {
              this.$ghost.val().should.equal('');
            });

          });

          describe('and on first result', function () {

            beforeEach(function () {
              this.$input.trigger($.Event('keydown', { keyCode: keyCode }));
              this.$input.trigger($.Event('keydown', { keyCode: keyCode }));
            });

            it('highlights second result', function () {
              this.$results.find('.instahighlight').text().should.equal('Connecticut');
            });

            it('sets input to second result', function () {
              this.$input.val().should.equal('Connecticut');
            });

            it('sets ghost to empty string', function () {
              this.$ghost.val().should.equal('');
            });

          });

          describe('and on last result', function () {

            beforeEach(function () {
              this.$input.trigger($.Event('keydown', { keyCode: 38 }));
              this.$input.trigger($.Event('keydown', { keyCode: keyCode }));
            });

            it('does not highlight any results', function () {
              this.$results.find('.instahighlight').length.should.equal(0);
            });

            it('does not change input value', function () {
              this.$input.val().should.equal('cO');
            });

            it('sets ghost value to \'cOlorado\'', function () {
              this.$ghost.val().should.equal('cOlorado');
            });

          });

        });

        it('prevents default', function (done) {
          this.$input.instantSearch();
          this.$input.on('keydown', function (e) {
            e.isDefaultPrevented().should.be.true;

            done();
          });
          this.$input.trigger($.Event('keydown', { keyCode: keyCode }));
        });

      });

      describe('tab', function () {

        var keyCode = 9;

        describe('and results are displayed', function () {

          beforeEach(function () {
            this.$input.instantSearch({
              source: getStates
            });

            this.$ghost = this.$input.next();
            this.$results = $('.instaresults');
          });

          afterEach(function () {
            this.$ghost = null;
            this.$results = null;
          });

          describe('and beginning of input value matches top result', function () {

            beforeEach(function (ready) {
              var self = this;

              this.$input.on('instantsearch.search', function (e) {
                var $this = $(this)
                  , checkDefault;

                self.researched = false;

                $this.off('instantsearch.search');
                $this.on('instantsearch.search', function (e) {
                  self.researched = true;

                  ready();
                });
                $this.on('keydown', checkDefault = function (e) {
                  $this.off('keydown', checkDefault);

                  self.defaultPrevented = e.isDefaultPrevented();
                });
                $this.trigger($.Event('keydown', { keyCode: keyCode }));
              });
              /**
               * "a" (65) then "R" (82) then "k" (75)
               *
               * Results:
               *    [
               *      'Arkansas'
               *    ]
               */
              this.$input.val('aRk');
              this.$input.trigger($.Event('keydown', { keyCode: 75 }));
            });

            afterEach(function () {
              this.$input.off('instantsearch.search');

              this.researched = null;
              this.defaultPrevented = null;
            });

            it('completes input value', function () {
              this.$input.val().should.equal('Arkansas');
            });

            it('sets ghost value to empty string', function () {
              this.$ghost.val().should.equal('');
            });

            it('researches for completed term', function () {
              this.researched.should.be.true;
            });

            it('prevents default', function () {
              this.defaultPrevented.should.be.true;
            });

          });

          describe('and beginning of input value does not match top result', function () {

            beforeEach(function (ready) {
              var self = this
                , checkDefault;

              this.$input.on('instantsearch.search', function (e) {
                $this = $(this);

                $this.on('keydown', checkDefault = function (e) {
                  $this.off('keydown', checkDefault);

                  self.defaultPrevented = e.isDefaultPrevented();

                  ready();
                });
                $this.trigger($.Event('keydown', { keyCode: keyCode }));
              });

              /**
               * "a" (65) then "R" (82) then "O" (79)
               *
               * Results:
               *    [
               *      'North Carolina'
               *    , 'South Carolina'
               *    ]
               */
              this.$input.val('aRO');
              this.$input.trigger($.Event('keydown', { keyCode: 79 }));
            });

            afterEach(function () {
              this.defaultPrevented = null;
            });

            it('does not complete input value', function () {
              this.$input.val().should.equal('aRO');
            });

            it('does not change ghost value', function () {
              this.$ghost.val().should.equal('');
            });

            it('does not prevent default', function () {
              this.defaultPrevented.should.be.false;
            });

          });

        });

      });

      describe('return', function () {

        var keyCode = 13;

        describe('and results are displayed', function () {

          describe('and set to `completeOnEnter`', function () {

            beforeEach(function () {
              this.$input.instantSearch({
                source: getStates
              , completeOnEnter: true
              });

              this.$ghost = this.$input.next();
              this.$results = $('.instaresults');
            });

            afterEach(function () {
              this.$ghost = null;
              this.$results = null;
            });

            describe('and beginning of input value matches top result', function () {

              beforeEach(function (ready) {
                var self = this
                  , checkDefault;

                this.$input.on('instantsearch.search', function (e) {
                  var $this = $(this);

                  $this.on('instantsearch.selected', function (e) {
                    self.selected = e.selected;
                  });
                  $this.trigger($.Event('keydown', { keyCode: keyCode }));
                });
                /**
                 * "a" (65) then "R" (82) then "k" (75)
                 *
                 * Results:
                 *    [
                 *      'Arkansas'
                 *    ]
                 */
                this.$input.val('aRk');
                this.$input.trigger($.Event('keydown', { keyCode: 75 }));
                this.$input.on('keydown', checkDefault = function (e) {
                  $(this).off('keydown', checkDefault);

                  self.defaultPrevented = e.isDefaultPrevented();

                  ready();
                });
              });

              afterEach(function () {
                this.$input.off('instantsearch.search');
                this.$input.off('instantsearch.selected');

                this.selected = null;
                this.defaultPrevented = null;
              });

              it('completes input value', function () {
                this.$input.val().should.equal('Arkansas');
              });

              it('sets ghost value to empty string', function () {
                this.$ghost.val().should.equal('');
              });

              it('selects completed term', function () {
                this.selected.should.equal('Arkansas');
              });

              it('prevents default', function () {
                this.defaultPrevented.should.be.true;
              });

            });

            describe('and beginning of input value does not match top result', function () {

              beforeEach(function (ready) {
                var self = this
                  , checkDefault;

                this.$input.on('instantsearch.search', function (e) {
                  $this = $(this);

                  $this.on('instantsearch.selected', function (e) {
                    self.selected = e.selected;
                  });
                  $this.trigger($.Event('keydown', { keyCode: keyCode }));
                });

                /**
                 * "a" (65) then "R" (82) then "O" (79)
                 *
                 * Results:
                 *    [
                 *      'North Carolina'
                 *    , 'South Carolina'
                 *    ]
                 */
                this.$input.val('aRO');
                this.$input.trigger($.Event('keydown', { keyCode: 79 }));
                this.$input.on('keydown', checkDefault = function (e) {
                  $(this).off('keydown', checkDefault);

                  self.defaultPrevented = e.isDefaultPrevented();

                  ready();
                });
              });

              afterEach(function () {
                this.$input.off('instantsearch.search');
                this.$input.off('instantsearch.selected');

                this.defaultPrevented = null;
              });

              it('does not complete input value', function () {
                this.$input.val().should.equal('aRO');
              });

              it('does not change ghost value', function () {
                this.$ghost.val().should.equal('');
              });

              it('prevents default', function () {
                this.defaultPrevented.should.be.true;
              });

            });

          });

          describe('and not set to `completeOnEnter`', function () {

            beforeEach(function () {
              this.$input.instantSearch({
                source: getStates
              });

              this.$ghost = this.$input.next();
              this.$results = $('.instaresults');
            });

            afterEach(function () {
              this.$ghost = null;
              this.$results = null;
            });

            describe('and beginning of input value matches top result', function () {

              beforeEach(function (ready) {
                var self = this
                  , checkDefault;

                this.$input.on('instantsearch.search', function (e) {
                  var $this = $(this);

                  $this.on('instantsearch.selected', function (e) {
                    self.selected = e.selected;
                  });
                  $this.trigger($.Event('keydown', { keyCode: keyCode }));
                });
                /**
                 * "a" (65) then "R" (82) then "O" (79)
                 *
                 * Results:
                 *    [
                 *      'North Carolina'
                 *    , 'South Carolina'
                 *    ]
                 */
                this.$input.val('aRO');
                this.$input.trigger($.Event('keydown', { keyCode: 79 }));
                this.$input.on('keydown', checkDefault = function (e) {
                  $(this).off('keydown', checkDefault);

                  self.defaultPrevented = e.isDefaultPrevented();

                  ready();
                });
              });

              afterEach(function () {
                this.$input.off('instantsearch.search');
                this.$input.off('instantsearch.selected');

                this.selected = null;
                this.defaultPrevented = null;
              });

              it('does not complete input value', function () {
                this.$input.val().should.equal('aRO');
              });

              it('does not change ghost value', function () {
                this.$ghost.val().should.equal('');
              });

              it('clears results', function () {
                this.$results.find('ul').html().should.equal('');
              });

              it('selects input value', function () {
                this.selected.should.equal('aRO');
              });

              it('prevents default', function () {
                this.defaultPrevented.should.be.true;
              });

            });

          });

        });

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
