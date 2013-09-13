(function(window, undefined){
    var _ = window.UOCHAN._;

    function PrettyReportTemplate(){
        this.template_fn = {
            html      : _.template(this.tplFile('html5.html'))
          , testcase  : _.template(this.tplFile('testcase.html'))
          , testsuite : _.template(this.tplFile('testsuite.html'))
          , now       : _.template(this.tplFile('now.html'))
          , summary   : _.template(this.tplFile('summary.html'))
          , heading   : _.template(this.tplFile('heading.html'))
        };
    }

    PrettyReportTemplate.prototype.tplFile = function(name){
        return(UOCHAN.addon.readFile("resource://si_prettyreport/template/" + name));
    };

    PrettyReportTemplate.prototype.getCurrentTime = function(){
        var d    = new Date()
          , data = {
              year : d.getFullYear()
            , mon  : d.getMonth() + 1
            , day  : d.getDate()
            , hour : d.getHours()
            , min  : d.getMinutes()
            , sec  : d.getSeconds()}
          ;
        if(data.mon < 10){  data.mon  = '0' + data.mon; }
        if(data.day < 10){  data.day  = '0' + data.day; }
        if(data.hour < 10){ data.hour = '0' + data.hour; }
        if(data.min < 10){  data.min  = '0' + data.min; }
        if(data.sec < 10){  data.sec  = '0' + data.sec; }
        return(this.template_fn.now(data));
    };

    PrettyReportTemplate.prototype.html = function(data){
        data.now = this.getCurrentTime();
        return(this.template_fn.html(data));
    }

    PrettyReportTemplate.prototype.testcase  = function(data){ return(this.template_fn.testcase(data)); };
    PrettyReportTemplate.prototype.testsuite = function(data){ return(this.template_fn.testsuite(data)); };

    PrettyReportTemplate.prototype.summary = function(data){
        data.now = this.getCurrentTime();
        return(this.template_fn.summary(data));
    };

    PrettyReportTemplate.prototype.heading = function(data){ return(this.template_fn.heading(data)); };

    if(!window.UOCHAN){
        window.UOCHAN = {};
    }
    if(!window.UOCHAN.PrettyReport){
        window.UOCHAN.PrettyReport = {};
    }
    if(!window.UOCHAN.PrettyReport.template){
        window.UOCHAN.PrettyReport.template = new PrettyReportTemplate();
    }
}(window));
