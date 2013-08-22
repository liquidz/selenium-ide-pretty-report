(function(window, undefined){

    var template = {
        html: "<html><head></head><body>{{{body}}}</body></html>"
      , command_table: ""
            + "<table class=\"{{result}}\"><caption>{{title}}</caption>"
            + "<thead><tr><th>command</th><th>target</th><th>value</th></tr></thead>"
            + "<tbody>"
            + "{{#commands}}"
            + "  <tr class=\"{{result}}\">"
            + "    <td>{{command}}</td><td>{{target}}</td><td>{{value}}</td>"
            + "  </tr>"
            + "{{/commands}}"
            + "</tbody></table>"
    };

    var self = {};

    self.html = function(body){
        return(Mustache.render(template.html, {body: body}));
    }

    self.command_table = function(data){
        return(Mustache.render(template.command_table, data));
    };

    if(!window.SIPR.formatter){
        window.SIPR.formatter = self;
    }
}(window));
