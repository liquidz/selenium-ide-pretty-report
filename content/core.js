(function(window, undefined){
    var self = {};

    self.title = "Selenium IDE: Pretty Report";

    var _andResult = function(r1, r2){
      if(r1 === 'undefined' || r1 === 'failed'){ return(r1); }
        else { return(r2); }
    };

    var _group_testcase = function(testcase){
        var tmp    = {title: '', result: true, commands: []}
          , result = []
          ;

        testcase.forEach(function(cmd){
            if(cmd['type'] === 'comment'){
                // test title
                if(tmp['commands'].length === 0){
                    tmp['title'] = cmd['value'];
                } else {
                    result.push(tmp);
                    tmp = {title: cmd['value'], result: true, commands: []};
                }
            } else {
                // command
                tmp['result'] = _andResult(tmp['result'], cmd['result']);
                tmp['commands'].push(cmd);
            }
        });
        if(tmp['commands'].length !== 0){ result.push(tmp); }

        return(result);
    };

    self.foo = function(){
        var data = {
            title: IDE_UTIL.getTestCaseTitle()
          , tests: _group_testcase(IDE_UTIL.getTestCase().map(IDE_UTIL.parseTestCase))
        };

        alert(
            SIPR.formatter.testcase(data)
            //SIPR.formatter.html("foo")
        );
    };

    self.exportTestCaseResults = function(){
        var file     = IDE_UTIL.openFileDialog("title")
          , title    = IDE_UTIL.getTestCaseTitle()
          , data     = { title: title
                       , tests: _group_testcase(IDE_UTIL.getTestCase().map(IDE_UTIL.parseTestCase))}
          ;

        IDE_UTIL.writeFile(
            file
          //, SIPR.formatter.testcase(data)
          , SIPR.formatter.html({
                title: title + " - " + self.title
              , body:  SIPR.formatter.testcase(data)
            })
        );
    //    //IDE_UTIL.writeFile(file, contents);
    };

    if(!window.SIPR){
        window.SIPR = self;
    }
}(window));
