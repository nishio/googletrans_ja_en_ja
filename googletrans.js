google.load("language", "1");
google.load("jquery", "1.5.1");

var tasks = [];
var env = {};

function do_trans(frm, to){
    return function(value){
	google.language.translate(
	    value, frm, to, do_trans_callback
	);
    };
};

function do_trans_callback(result){
    if (result.translation) {
	tasks.shift()(result.translation)
    }
};


function source(text){
    return function(value){ // ignore passed value
	tasks.shift()(text, tasks);
    };
}    

function store(name){
    return function(value){ // store passed value as given name
	env[name] = value;
	tasks.shift()(value);
    };
}    

function output(value){
    $("#outbox")[0].value += (
	    "=====\n" +
	    env.in_text + "\n=====\n" +
	    env.en_text + "\n=====\n" +
	    value + "\n=====\n");
	
    tasks.shift()(undefined);
}

function finish(value){
    var log = $("#log")[0];
    log.value += "\n\n" + $("#outbox")[0].value;
}

google.setOnLoadCallback(function(){
  $("#button").click(function(){
      $("#outbox")[0].value = "";
      var lines = $("#inbox")[0].value.split("\n");
      for(i in lines){
	  var in_text = lines[i];
	  if(!in_text) continue;
	  tasks.push(
	      source(in_text),
	      store("in_text"),
	      do_trans("ja", "en"),
	      store("en_text"),
	      do_trans("en", "ja"),
	      output
	  );
      }
      tasks.push(finish);
      tasks.shift()(undefined);
  });
});
