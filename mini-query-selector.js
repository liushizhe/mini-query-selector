/**
 * 判断元素el的类是否存在指定的字符串里面
 */
function hasClass(el, className) {
	var cls = el.className;
	if(!cls) {
		return false;
	}
	var arrClass = className.split(/\s+/);
	for(var i = 0; i < arrClass.length; i++) {
		if(cls === arrClass[i]) {
			return true;
		}
	}

	return false;
}

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

	var context = document;

	//获取选择器对应dom节点
	function exec(part, action) {
		function blank() {}
		action = action || {
			id: blank,
			className: blank,
			tag: blank,
			attribute: blank
		};
		var fn;
		
		var params = [].slice.call(arguments, 2);
		
		//id
		if(result = part.match(idReg)) {
			fn = 'id';
			params.push(result[1]);
		} else if(result = part.match(classReg)) {
			fn = 'className';
			params.push(result[1]);
		} else if(result = part.match(tagReg)) {
			fn = 'tag';
			params.push(result[0]);
		} else if(result = part.match(attrReg)) {
			fn = 'attribute';
			var tag = result[1];
			var key = result[2];
			var value = result[4];
			params.push(tag, key, value);
		}

		return action[fn].apply(null, params);
	}
	//匹配父节点
	function filterParent(parts, ret) {
		var part = parts.pop();
		var result = [];
		for(var i = 0; i < ret.length; i++) {
			var node = ret[i];
			var p = node;
			var match = false;
			while(p = p.parentNode) {
				var actions = {
					id: function(el, id) {
						return el.id === id;
					},
					className: function(el, className) {
						return hasClass(el, className);
					},
					tag: function(el, tag) {
						return el.tagName.toLowerCase() === tag;
					},
					attribute: function(el, tag, key, value) {
						var valid = true;
						if(tag) {
							valid = actions.tag(el, tag);
						}
						valid = valid && el.hasAttribute(key);
						if(value) {
							valid = valid && (el.getAttribute(key) === value);
						}
						return valid;
					}
				}
				match = exec(part, actions, p);
				if(match) {
					break;
				}
			}
			if(match) {
				result.push(node);
			}
		}
		//继续查询父节点
		return parts[0] && result ? filterParent(parts, result) : result;
	}
	//查找字符串对应选择器并执行
	function find(parts, context) {
		var part = parts.pop();
		var actions = {
			id: function(id) {
				return [context.getElementById(id)];
			},
			className: function(className) {
				var result = context.getElementsByClassName(className);
				if(!result){
					
				}
				return result;
			},
			tag: function(tag) {
				return context.getElementsByTagName(tag);
			},
			attribute: function(tag, key, value) {
				var result = [];
				var ele = context.getElementsByTagName(tag || '*');//防止tag为空出错
				for(var i = 0; i < ele.length; i++){
					var node = ele[i];
					if(value) {
						var v = node.getAttribute(key);
						if(v === value) {
							result.push(node);
						} 
					} else {
						if(node.hasAttribute(key)) {
							result.push(node);
						}
					}	
				}
				return result;
			}
		};
		var ret = exec(part, actions);
		//若有父节点则继续查找父节点
		return parts[0] && ret ? filterParent(parts, ret) : ret;
	}
	//无分离选择器，只处理空格连接多个选择器
	var result = find(selector.split(/\s+/), context);
	return result.length === 1 ? result.pop() : result;//返回当个节点则以节点对象返回
}

var idSelctor = $('#text');
console.log(idSelctor);
var id2 = document.querySelector('#text');
var classSlector = $('#text .aaron .class-p');
console.log(classSlector);
console.log($('p'));
var nodes = document.getElementsByTagName('*');
for(var i = 0; i < nodes.length; i++) {
	if(nodes[i].hasAttribute('class')){
		console.log(nodes[i]);
	}
}
var attSelector = $('#text .aaron input[name=ttt]');
console.log(attSelector);
attSelector.checked = 'checked';

function debug() {
	console.log('hello world');
}
var button = $('#test1');
button.addEventListener('click', debug, false);
// var event = new Event('click');
// button.dispatchEvent(event);
// button.removeEventListener('click', debug, false);

var interVal = setInterval(function () {
	console.log(document.readyState);
	if(document.readyState === 'complete'){
		clearInterval(interVal);
		var event = new Event('click');
		button.dispatchEvent(event);
		//button[0].removeEventListener('click', debug, false);
	}
}, 3000);

var newDiv = document.createElement('div');
var newContent = document.createTextNode('Hello');
newDiv.appendChild(newContent);





