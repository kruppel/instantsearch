# instantsearch

Another autocomplete plugin, focused on studying and reverse engineering
the dynamics of the GOOG search bar UI.

##### todos
* ~~update css selectors to be more unique~~
* ~~wrap input instead of replacing~~
* ~~implement destroy~~
* ~~emit events from input~~
* ~~change trigger entirely to be an event emitter~~
* ~~refactor constructor, also add better tests for constructor~~
* ~~complete tests for showNoResults~~
* ~~refactor showNoResults once better tests are in place (separate
  concerns between reset and empty states)~~
* optimize string matching

##### FAQ

On window resize, the results aren't repositioning under the search bar.
What do I do?

```javascript
var $input = $('input').instantSearch({ ... })
  , $res = $('.instaresults');

$(window).on('resize', function (e) {
  position: 'absolute'
, top: $input.offset().top + $input.outerHeight()
, left: $input.offset().left
, width: $input.outerWidth()
});
```
