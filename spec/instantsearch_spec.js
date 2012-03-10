describe('$.InstantSearch', function () {

  beforeEach(function () {
    $('body').append('<form action="/"><fieldset id="test-fs"></fieldset></form>')
  })

  afterEach(function () {
    $('body > form').remove()
    $('body > table.sbr_c').remove()
  })

  describe("constructor", function () {

    it("sets source to passed option", function () {
      var source = jasmine.createSpy()
        , search = new $.InstantSearch($('body > form'), { source: source })

      expect(search.src).toBe(source)
    })

    it("appends results table to body", function () {
      new $.InstantSearch($('body > form'), {})

      expect($('body > table.sbr_c').length).toBe(1)
    })

    it("appends search html to wrapped element", function () {
      var el = $('body > form')
        , search = new $.InstantSearch(el, {})

      expect(search.$el).toBe(el)
    })

  })

  describe("update()", function () {

    describe("when timeout id is present", function () {

      it("clears delay set by timeout", function () {
      })

    })

    describe("when timeout function is called", function () {

      it("requests source for data", function () {
      })

      describe("and callback is called", function () {

        describe("and error occurred", function () {
        })

        it("shows results", function () {
        })

      })

    })

  })

  describe("showResults()", function () {

    it("empties previous results", function () {
    })

    describe("and input is empty", function () {

      it("sets suggestion to empty string", function () {
      })

      it("hides results table", function () {
      })

      it("returns false", function () {
      })

    })

    describe("and not passed data", function () {

      it("sets suggestion to empty string", function () {
      })

      it("hides results table", function () {
      })

      it("returns false", function () {
      })

    })

    describe("and data is empty", function () {

      it("sets suggestion to empty string", function () {
      })

      it("hides results table", function () {
      })

      it("returns false", function () {
      })

    })

    describe("and has data", function () {

      // 'Jack' => 'Jack Johnson'
      describe("and first match matches from start", function () {

        it("sets suggestion to first match", function () {
        })

      })

      // 'Jack' => 'Michael Jackson'
      describe("and first match does not match from start", function () {

        it("sets suggestion to empty string", function () {
        })

      })

      it("appends rows to results table body", function () {
      })

      it("emphasizes non-matching portions of name", function () {
      })

      describe("and results table is hidden", function () {

        it("unhides results table", function () {
        })

      })

      it("returns true", function () {
      })

    })

  })

  describe("navigate()", function () {

    _([ -1, 1 ]).each(function (dir) {
      var upOrDown = dir ? 'down' : 'up'

    })

  })

  describe("getCaretPosition()", function () {
  })

  describe("events", function () {

    describe("on click", function () {

      it("focuses the search input", function () {
      })

    })

    describe("on keydown", function () {

      describe("and key is tab", function () {

        it("does not change input value", function () {
        })

        it("does not change result selection", function () {
        })

      })

      describe("and key is return", function () {

        it("does not change input value", function () {
        })

        it("does not change result selection", function () {
        })

      })

      describe("and key is escape", function () {

        it("does not change input value", function () {
        })

        it("does not change result selection", function () {
        })

      })

      describe("and key is left arrow", function () {

        it("does not change input value", function () {
        })

        it("does not change result selection", function () {
        })

      })

      describe("and key is up arrow", function () {

        it("cycles to previous result", function () {
        })

      })

      describe("and key is right arrow", function () {

        describe("and caret is positioned at end of term", function () {

          it("completes input with best match", function () {
          })

        })

        describe("and caret is positioned before end of term", function () {

          it("does not change input", function () {
          })

        })

      })

      describe("and key is down arrow", function () {

        it("cycles to next result", function () {
        })

      })

      describe("and key is of non-control class", function () {

        it("updates search", function () {
        })

      })

    })

  })

})
