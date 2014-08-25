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
  $("#formText").bind("keydown keyup keypress change",
  	function(){
  		var thisValueLength = $(this).val().length;
  		$("#counter").html(thisValueLength);
  	});
}

function deleteAll(){
	// すべてのTodoを削除しても良いかを確認する
	if(checkDeleteAll()){
		// すべてのTodoを削除する
		localStorage.clear();
		alert("すべてのTodoを削除したよ");
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
  // 先にエスケープした場合、エスケープ文字が文字数としてカウントされてしまう
  var val = escapeText(text.val());
  if(checkText(val)){
	  localStorage.setItem(time, text.val());
	  alert("登録完了");
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

// ローカルストレージに保存した値を再描画する
function showText() {
  // すでにある要素を削除する
  var list = $("#list");
  list.children().remove();
  // すでに登録してある要素の数を数える
  var len = localStorage.length;
  var notice_message = "";
  if (len === 0) {
	  $("#notice").text("Todoは登録されていないよ！");
  } else {
	  $("#notice").text("Todoが"+localStorage.length + "個登録されているよ！");
  }
  // ローカルストレージに保存された値すべてを要素に追加する
  var key, value, html = [];
  for(var i=0, len=localStorage.length; i<len; i++) {
    key = localStorage.key(i);
    value = localStorage.getItem(key);

    html.push("<p>" + key + ":" + value + "</p>");
  }
  list.append(html.join(''));
}