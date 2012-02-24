describe('instantSearch', function () {

  beforeEach(function () {
    $('body').append('<form action="/"><fieldset id="test-fs"></fieldset></form>')
  })

  afterEach(function () {
    $('body > form').remove()
  })

  describe("Keydown events", function () {

    it("", function () {
      $('#test-fs').instantSearch({
        source: function (req, res) { return res({}, null) }
      })
    })

  })

})
