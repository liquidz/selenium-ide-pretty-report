(function(window, undefined){

    function Addon(){}

    // c.f. http://stackoverflow.com/questions/3772788/how-to-load-file-from-inside-firefox-plugin
    Addon.prototype.readFile = function(file){
        try {
            var ioService = Components
                .classes["@mozilla.org/network/io-service;1"]
                .getService(Components.interfaces.nsIIOService);
            var scriptableStream = Components
                .classes["@mozilla.org/scriptableinputstream;1"]
                .getService(Components.interfaces.nsIScriptableInputStream);
            var channel = ioService.newChannel(file,null,null);
            var input = channel.open();
            scriptableStream.init(input);
            var str = scriptableStream.read(input.available());
            scriptableStream.close();
            input.close();
            return(str);
        } catch(e){
            return(false);
        }
    };

    Addon.prototype.writeFile = function(file, contents){
        try {
            var output    = FileUtils.openFileOutputStream(file)
              , converter = FileUtils.getUnicodeConverter("UTF-8")
              , text      = converter.ConvertFromUnicode(contents)
              ;
            output.write(text, text.length);
            var fin = converter.Finish();
            if(fin.length > 0){ output.write(fin, fin.length); }
            output.close();
            return(true);
        } catch(e){
            return(false);
        }
    };

    Addon.prototype.openFileDialog = function(title){
        return showFilePicker(
                window
              , title
              , Components.interfaces.nsIFilePicker.modeSave
              , Format.TEST_CASE_EXPORT_DIRECTORY_PREF
              , function(fp){ return fp.file; }
        );
    };

    if(!window.UOCHAN){
        window.UOCHAN = {};
    }
    if(!window.UOCHAN.addon){
        window.UOCHAN.addon = new Addon();
    }
}(window));
