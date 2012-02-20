describe('$.fn.instantSearch', function () {

  beforeEach(function () {
    $('body').append('<input id="test-instantsearch" type="text" autocomplete="off" spellcheck="false">');
  });

  it("does a fake test", function () {
    $('body > input#test-instantsearch').instantSearch({});
    expect(1).toBe(1);
  });

});
