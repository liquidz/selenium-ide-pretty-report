(function(window, undefined){
    var self = {};

    self.title = "Selenium IDE: Pretty Report";

    var _andResult = function(r1, r2){
        if(r1 === 'undefined' || r1 === 'failed'){ return(r1); }
        else { return(r2); }
    };

    var _group_testcases = function(testcases){
        var tmp    = {title: '', result: true, commands: []}
          , result = []
          ;

        testcases.forEach(function(cmd){
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
                //tmp['result'] = tmp['result'] && cmd['result'];
                tmp['result'] = _andResult(tmp['result'], cmd['result']);
                tmp['commands'].push(cmd);
            }
        });
        if(tmp['commands'].length !== 0){ result.push(tmp); }

        return(result);
    };

    self.foo = function(){
        var data = _group_testcases(IDE_UTIL.getTestCases().map(IDE_UTIL.parseTestCase));

        alert(
            data.map(SIPR.formatter.command_table).reduce(function(res, x){ return(res + x); }, "")
            //SIPR.formatter.command_table(data)
            //SIPR.formatter.html("foo")
            //IDE_UTIL.getTestCases().map(IDE_UTIL.parseTestCase).map(function(testcase){
            //    if(testcase['type'] === 'comment'){
            //        return(testcase['value']);
            //    } else {
            //        var text = testcase['command'] + ":" + testcase['target'] + ":" + testcase['value'] + ":" + testcase['result'];
            //        return(text);
            //    }
            //}).join("\n")
        );
    };

    self.exportTestCaseResults = function(){
        var file     = IDE_UTIL.openFileDialog("title")
          , contents = ""
          ;

        IDE_UTIL.writeFile(file, contents);
    };

    if(!window.SIPR){
        window.SIPR = self;
    }
}(window));
