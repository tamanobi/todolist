$(loaded);

function loaded() {
  showText();
  // ボタンをクリックしたときに実行するイベントを設定する
  $("#formButton").click(
    // コールバックとしてメソッドを引数にわたす
    function() {
      saveText();
      showText();
    });
  $("#deleteAllButton").click(
  	function(){
  		deleteAll();
	    showText();
  	});
  $("#formText").bind("keydown keyup keypress change",str_counter);
}

function str_counter(){
  var thisValueLength = $("#formText").val().length;
  $("#counter").html(""+thisValueLength + "/20");
}

function deleteAll(){
  if (localStorage.length > 0) {
  	// すべてのTodoを削除しても良いかを確認する
  	if (checkDeleteAll()){
  		// すべてのTodoを削除する
  		localStorage.clear();
  		alert("すべてのTodoを削除したよ");
  	}
  }
}

function checkDeleteAll(){
	// すべてのTodoを削除しても良いかを確認する
	return confirm("すべてのTodoを削除してもいい？");
}

// 入力された内容をローカルストレージに保存する
function saveText() {
  // 時刻をキーにして入力されたテキストを保存する
  var text = $("#formText");
  var time = new Date();
  var time_json = JSON.stringify(time);
  var input_str = text.val();

  if(checkText(input_str)){
    // 先にエスケープした場合、エスケープ文字が文字数としてカウントされてしまうのでここでエスケープ
    escaped_text = escapeText(input_str);
    var pair = {};
    pair.done = false;
    pair.todo = escaped_text;
	  localStorage.setItem(time_json, JSON.stringify(pair));
	  // テキストボックスを空にする
	  text.val("");
  }
}

// 文字をエスケープする
function escapeText(_text) {
	return $("<div>").text(_text).html();
}

// 入力チェックを行う
function checkText(_text){
	var len = _text.length;
	// 文字が0または20以上は不可
	if( 0 ==len || 20 < len){
		alert("文字数は1~20字にしてください");
		return false;
	}
	// すでに入力された値があれば不可
	var length = localStorage.length;
	for (var i=0;i<length;i++){
		var key = localStorage.key(i);
		var value = localStorage.getItem(key);
		// 内容が一致するものがあるか比較
		if(_text === value) {
			alert("同じ内容は登録できません");
			return false;
		}
	}
	//　すべてのチェックを通過できれば可
	return true;
}

var Todo = function (_created, _contents){
  this.created = _created;
  this.contents = _contents;
};

// ローカルストレージに保存した値を再描画する
function showText() {
  // すでにある要素を削除する
  var list = $("#list");
  list.children().remove();
  // すでに登録してある要素の数を数える
  var len = localStorage.length;
  var notice_message = "";
  if (len === 0) {
	  $("#notice").text("タスクはありません");
  } else {
    $("#notice").text("残りタスク: "+localStorage.length);
  }
  // ローカルストレージに保存された値すべてを要素に追加する
  var key, html = [];
  var dates = [];
  for (var i=0, len=localStorage.length; i<len; i++){
    key = localStorage.key(i);
    var date = new Date(JSON.parse(key));
    var list_json = localStorage.getItem(key);
    var value = JSON.parse(list_json);

    var todo = "<div class='item_contents'>";
    //if(value["done"]) todo += "<i class='fa fa-check-square'></i>";
    //else todo += "<i class='fa fa-square'></i>";
    todo += "<span class='content'>" + value["todo"] + "</span>";
    todo += "<span class='date'><i class='fa fa-fw fa-calendar'></i>&nbsp;" + transTime(date) + "</span>";
    todo += "</div>";
    todo += "<div class='change_state'>";
    //todo += "<span class='done'>" + "<i class='fa fa-fw fa-check-square-o'></i>&nbsp;" + "DONE?" + "</span>"
    todo += "<span class='delete'>" + "<i class='fa fa-fw fa-times'></i>&nbsp;" + "DELETE?" + "</span>"
    todo += "</div>";

    var code = "<li>";
    code += todo;
    code += "</li>";
    var pair = [];
    pair.date = date;
    pair.code = code;
    html.push(pair);
  }
  // 日付降順でソートする
  html.sort(function(a,b){
    if( a.date > b.date ) return -1;
    if( a.date < b.date ) return  1;
    return 0;
  });
  // HTML出力用変数
  var codes = [];
  for(var k=0;k<html.length;k++) codes.push(html[k]["code"]);
  // 配列の中身を文字列として連結
  list.append(codes.join(''));
  // handlerを登録
  registerHandler();
  str_counter();
}

function registerHandler(){
  // クリックによるアコーディオンメニュー
  $("#list .item_contents").on("click",function(){
      var nxt = $(this).next();
      var elms = $("#list .change_state");
      var idx = elms.index(nxt);
      nxt.css("height", nxt.height()+"px");
      // クリックされた要素以外は閉じる
      for(var j=0; j<elms.length; j++){
        if(j !== idx) elms.eq(j).slideUp();
      }
      nxt.slideToggle();
      nxt.css("height", "");
  });
  $("#list .done").on("click",function(){
    var elems = $("#list li span.done");
    var len = elems.length;
    var idx = elems.index(this);
    showText();
  });
  $("#list .delete").on("click",function(){
    var elems = $("#list li span.delete");
    var len = elems.length;
    var idx = elems.index(this);
    var key = localStorage.key(len-idx-1);
    var val = localStorage.getItem(key);
    if (confirm("[" + val + "]を削除します")) {
      localStorage.removeItem(key);
      showText();
    }
 });
}

function transTime(date) {
    return [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
        ].join( '/' ) + ' '
        + date.toLocaleTimeString();
}