describe('$.InstantSearch', function () {

  beforeEach(function () {
    $('body').append('<form action="/"><fieldset id="test-fs"></fieldset></form>')
  })

  afterEach(function () {
    $('body > form').remove()
  })

  describe("constructor", function () {

    it("sets source to passed option", function () {
      var source = jasmine.createSpy(),
          is = new $.InstantSearch($('body > form'), { source: source })
    })

    it("appends results table to body", function () {
    })

    it("appends search html to wrapped element", function () {
    })

  })

  describe("update()", function () {
  })

  describe("showResults()", function () {
  })

  describe("navigate()", function () {
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
