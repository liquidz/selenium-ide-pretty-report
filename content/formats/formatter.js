(function(window, undefined){

    var template = {
        html: "<html><head></head><body>{{{body}}}</body></html>"
      , command_table: ""
            + "<table><caption>{{title}}</caption>"
            + "<thead><tr><th>command</th><th>target</th><th>value</th></tr></thead>"
            + "<tbody>{{{hoge}}}</tbody></table>"
      , command_tbody: ""
            + 
    };

    var self = {};

    self.html = function(body){
        return(Mustache.render(template.html, {body: body}));
    }

    self.command_table = function()

    if(!window.SIPR.formatter){
        window.SIPR.formatter = self;
    }
}(window));
