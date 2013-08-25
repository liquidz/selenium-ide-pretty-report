(function(window, undefined){

    var tpl_file = function(name){
        return(ADDON_UTIL.read_file("resource://si_prettyreport/template/" + name));
    }

    var template = {
        html:      _.template(tpl_file('html5.html'))
      , testcase:  _.template(tpl_file('testcase.html'))
      , testsuite: _.template(tpl_file('testsuite.html'))
      , now:       _.template(tpl_file('now.html'))
    };

    var self = {};

    var _getCurrentTime = function(){
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
        data.now = _getCurrentTime();
        return(template.html(data));
    }

    self.testcase = function(data){
        data.now = _getCurrentTime();
        return(template.testcase(data));
    };

    self.testsuite = function(data){
        data.now = _getCurrentTime();
        return(template.testsuite(data));
    };


    if(!window.SIPR.formatter){
        window.SIPR.formatter = self;
    }
}(window));
