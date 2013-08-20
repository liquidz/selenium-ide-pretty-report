(function(window, undefined){
    var self = {};

    self.title = "Selenium IDE: Pretty Report";

    self.foo = function(){
        var title = window.editor.app.getTestCase().getTitle();

        alert(
            SIPR.formatter.html("foo")
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
