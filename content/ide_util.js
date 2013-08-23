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

    var _parseComment = function(src){
        if(src.match(/<!--\s*(.+?)\s*-->/)){
            return({type: "comment", value: RegExp.$1});
        }
        return("err1:" + src);
    };

    var _parseCommand = function(src){
        if(src.match(/<td>(.+?)<\/td>\s*<td>(.*?)<\/td>\s*<td>(.*?)<\/td>\s*/)){
            return({type: "command", command: RegExp.$1, target: RegExp.$2, value: RegExp.$3});
        }
        return("err2:" + src);
    };

    self.parseTestCase = function(cmd){
        var src = getSourceForCommand(cmd)
          , res = null
          ;
        if(src.indexOf("<!--") !== -1){
            res = _parseComment(src);
        } else {
            res = _parseCommand(src);
        }
        res.result = (cmd.result !== undefined) ? cmd.result : "undefined";

        return(res);
    };

    self.getTestCase = function(){
        var file = window.editor.app.getTestCase();
        return(file.commands.reduce(function(res, cmd){
            return(res.concat(cmd));
        }, []));
    };

    self.getTestCaseTitle = function(){
        return(window.editor.app.getTestCase().getTitle());
    };

    if(!window.IDE_UTIL){
        window.IDE_UTIL = self;
    }

}(window));
