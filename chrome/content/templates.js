(function(window, undefined){
    var _ = window.UOCHAN._;

    function PrettyReportTemplate(){
        this.templateFiles = ['html5.html', 'testcase.html', 'testsuite.html', 'now.html', 'summary.html', 'heading.html'];

        // expand template functions
        _.each(this.templateFiles, _.bind(function(filename){
            var content = this.tplFile(filename)
              , fnName  = filename.split('.')[0]
              ;

            this[fnName] = _.template(content)
        }, this));
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
        if(data.mon  < 10){ data.mon  = '0' + data.mon;  }
        if(data.day  < 10){ data.day  = '0' + data.day;  }
        if(data.hour < 10){ data.hour = '0' + data.hour; }
        if(data.min  < 10){ data.min  = '0' + data.min;  }
        if(data.sec  < 10){ data.sec  = '0' + data.sec;  }
        return(data);
    };

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
