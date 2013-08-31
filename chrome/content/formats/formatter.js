(function(window, undefined){

    var tplFile = function(name){
        return(ADDON.readFile("resource://si_prettyreport/template/" + name));
    }

    var template = {
        html:      _.template(tplFile('html5.html'))
      , testcase:  _.template(tplFile('testcase.html'))
      , testsuite: _.template(tplFile('testsuite.html'))
      , now:       _.template(tplFile('now.html'))
      , summary:   _.template(tplFile('summary.html'))
      , heading:   _.template(tplFile('heading.html'))
    };

    var self = {};

    var getCurrentTime = function(){
        var d    = new Date()
          , data = {
              year: d.getFullYear()
            , mon:  d.getMonth() + 1
            , day:  d.getDate()
            , hour: d.getHours()
            , min:  d.getMinutes()
            , sec:  d.getSeconds()}
          ;
        if(data.mon < 10){  data.mon  = '0' + data.mon; }
        if(data.day < 10){  data.day  = '0' + data.day; }
        if(data.hour < 10){ data.hour = '0' + data.hour; }
        if(data.min < 10){  data.min  = '0' + data.min; }
        if(data.sec < 10){  data.sec  = '0' + data.sec; }
        return(template.now(data));
    };

    self.html = function(data){
        data.now = getCurrentTime();
        return(template.html(data));
    }

    self.testcase  = template.testcase;
    self.testsuite = template.testsuite;

    self.summary = function(data){
        data.now = getCurrentTime();
        return(template.summary(data));
    };

    self.heading = template.heading;

    if(!window.SIPR.formatter){
        window.SIPR.formatter = self;
    }
}(window));
