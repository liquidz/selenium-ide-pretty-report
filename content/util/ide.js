(function(window, undefined){
    var self = {};

    self.writeFile = function(file, contents){
        try {
            var output    = FileUtils.openFileOutputStream(file)
              , converter = FileUtils.getUnicodeConverter("UTF-8")
              , text      = converter.ConvertFromUnicode(contents)
              ;
            output.write(text, text.length);
            var fin = converter.Finish();
            if(fin.length > 0){ output.write(fin, fin.length); }
            output.close();
            return true;
        } catch(e){
            return false;
        }
    };

    self.openFileDialog = function(title){
        return showFilePicker(
                window
              , title
              , Components.interfaces.nsIFilePicker.modeSave
              , Format.TEST_CASE_EXPORT_DIRECTORY_PREF
              , function(fp){ return fp.file; }
        );
    };

    var parseComment = function(src){
        if(src.match(/<!--\s*(.+?)\s*-->/)){
            return({type: "comment", value: RegExp.$1});
        }
        return("err1:" + src);
    };

    var parseCommand = function(src){
        if(src.match(/<td>(.+?)<\/td>\s*<td>(.*?)<\/td>\s*<td>(.*?)<\/td>\s*/)){
            return({type: "command", command: RegExp.$1, target: RegExp.$2, value: RegExp.$3});
        }
        return("err2:" + src);
    };

    self.collectTestCaseCommands = function(testcase){
        return(testcase.commands.reduce(function(res, cmd){
            return(res.concat(cmd));
        }, []));
    };

    self.parseTestCase = function(cmd){
        var src = getSourceForCommand(cmd)
          , res = null
          ;
        if(src.indexOf("<!--") !== -1){
            res = parseComment(src);
        } else {
            res = parseCommand(src);
        }
        res.result = (cmd.result !== undefined) ? cmd.result : "undefined";
        res.result = (res.result === 'passed') ? 'done' : res.result;

        return(res);
    };

    self.getTestCase = function(){
        return(window.editor.app.getTestCase());
    };

    self.getTestCaseTitle = function(testcase){
        if(testcase === undefined){
            testcase = window.editor.app.getTestCase();
        }
        return(testcase.getTitle());
    };

    self.getTestSuite = function(){
        var app   = window.editor.app
          , suite = app.getTestSuite()
          ;

        return(suite.tests.map(function(test){
            if(!test.content){
                var t = app.getCurrentFormat().loadFile(test.getFile(), false);
                test.content = t;
            }
            test.content.commands = test.content.commands.map(function(x){
                x.result = (x.result === undefined) ? 'undefined' : x.result;
                x.result = (x.result === 'passed') ? 'done' : x.result;
                return(x);
            });
            return(test);
        }));
    };

    if(!window.IDE_UTIL){
        window.IDE_UTIL = self;
    }

}(window));
