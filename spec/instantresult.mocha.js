describe('$.InstantResult', function () {

  var RESULT_SETS = [

    [
      'a$'
    , 'A$AP Rocky'
    , '<strong></strong>A$<strong>AP Rocky</strong>'
    ]

  , [
      'bba'
    , 'ABBA'
    , '<strong>A</strong>BBA<strong></strong>'
    ]

  , [
      'Chingy'
    , 'Chingy'
    , '<strong></strong>Chingy<strong></strong>'
    ]

  , [
      'NOMATCH'
    , 'Nada Surf'
    , '<strong>Nada Surf</strong><strong></strong>'
    ]

  ];

  $.each(RESULT_SETS, function (index, set) {

    var term = set[0]
      , value = set[1]
      , el = set[2];

    describe('when term is ' + term + ' and value is ' + value, function () {

      it('sets element innerHTML to ' + el, function () {
        var result = new $.InstantResult(term, value);

        $(result.el).html().should.equal(el);
      });

    });
  });

});
