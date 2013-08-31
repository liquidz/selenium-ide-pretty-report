$(function(){
    $(".testcase-commands").hide();

    $(".testcase p").on("click", function(e){
        $(e.target).next(".testcase-commands").fadeToggle(200);
    });

    $("#expand").on("click", function(){
        $(".testcase-commands").show();
    });

    $("#collapse").on("click", function(){
        $(".testcase-commands").hide();
    });
});
