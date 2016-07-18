(function(){
  var loc = window.location,
    href = loc.href,
    query = href.replace(/^.*[#?&]q=([^#?&]+).*$/, '$1'),
    hlang = (~href.search(/hl=/) ? href.replace(/^.*[#?&](hl=[^#?&]+).*$/, '&$1') : '&hl=fr'),
    total = (~href.search(/num=/) ? parseInt(href.replace(/^.*[#?&]num=(\d+).*$/, '$1')) : 100),
    start = (~href.search(/start=/) ? parseInt(href.replace(/^.*[#?&]start=(\d+).*$/, '$1')) : 0),
    page = start/total,
    data = artoo.scrape(".rc", {
      url: {
        sel: 'h3.r a',
        attr: 'href'
      },
      name: {
        sel: 'h3.r a',
        method: 'text'
      },
      row: {
        sel: 'h3.r a',
        method: function($){
          return +$(this).attr('onmousedown').replace(/^.*,'','(\d+)','.*$/, '$1');
        }
      },
      description: {
        sel: 'div.s span.st',
        method: function($){
          var linkdate = artoo.scrape($(this).find('span.f'), 'text'),
            wholedescr = $(this).text();
          if (linkdate) return wholedescr.replace(linkdate, '');
          return wholedescr;
        }
      },
      date: {
        sel: 'div.s span.st span.f',
        method: function($){
          return $(this).text().replace(/ - $/, '');
        }
      }
    }),
    blob = new Blob([artoo.writers.csv(data)], {type: "text/plain;charset=utf-8"});
  artoo.log.verbose(data.length + " results for query '" + query + "' on page " + page);
  saveAs(blob, "google-results-" + query + "-" + page + ".csv");
  setTimeout(function(){
    if (window.confirm("CSV downloaded with "+data.length+" results from page "+page+" of Google results for query " + query + "\nDo you want to go to the next page?")) {
      window.location.href = loc.protocol + "//" + loc.hostname + "/search?q=" + query + hlang + "&num=" + total + "&start=" + (start + total);
    }
  }, 350);
})();
