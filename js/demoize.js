(function (window, undefined) {
  $('.search').instantSearch({
    source: function (req, res) {
      return res([
        'Abba',
        'Dabba',
        'Doo'
      ]);
    }
  }).focus();
}(window));
