/**
 * mini-query-selector
 * 从字符串中分离选择器，构建dom节点
 */
function $(selector) {
	//1.选择器分成4类，用正则表达式匹配字符串中各个选择器
	// div#text > div.aaron input[name=ttt]
	var idReg = /^#([\w\-]+)/;
	var classReg = /^\.([\w\-]+)/;
	var tagReg = /^\w+$/i;
    // [data-log]
    // [data-log="test"]
    // [data-log=test]
    // [data-log='test']
    // attr可能出现上面的各种情况
	var attrReg = /(\w+)?\[([^=\]]+)(?:=(["'])?([^\]"']+)\3?)?\]/;

	var m = '[data-log]'.match(attrReg);
	console.log(m);
	var mm = 'input[data-log="test"]'.match(attrReg);
	console.log(mm, mm[0], mm[1], mm[2], mm[3], mm[4]);
	console.log('[data-log=test]'.match(attrReg));
	console.log("[data-log='test']".match(attrReg));
}

var idSelctor = $('#text');
// console.log(idSelctor);