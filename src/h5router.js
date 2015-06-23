/**
 * 许可证协议： MIT
 * 版权(c) 2015 众筹网
 * 使用该许可证的软件被授予以下权限，免费，任何人可以得到这个软件及其相关文档的一个拷贝，
 * 并且经营该软件不受任何限制，包括无限制的使用、复制、修改、合并、出版、发行、发放从属
 * 证书、或者出售该软件的拷贝的权利。同时允许获得这些软件的用户享受这些权利，使其服从下
 * 面的条件：
 * 以上的版权通知和权限通知应该包含在所有该软件的拷贝中或者是其他该软件的真实部分中。
 * 该软件按本来的样子提供，没有任何形式的担保，不管是明确地或者暗含的，包含这些但是不受
 * 商业性质的担保的限制。适合一个特定的用途并且不受侵犯。作者和版权持有人在任何场合对使
 * 用该软件涉及的任何要求、损害或者其他责任都不应负责。不管它是正在起作用还是只是合同形
 * 式、民事侵权或是其他方式，如由它引起，在其作用范围内、与该软件有联系、该软件的使用或
 * 者有这个软件引起的其他行为。 
 * 
 * 这是一个移动端单页面路由系统。简单且可用。 如果需要变更请重写getRouteData方法
 */
(function(window){
	var callBack, _s = this;
	/**
	 * 初始化路由器 
	 */
	H5.listen = function(){
		window.onload = function(){
			// 在很多浏览器上有一个bug
			// onload  之后会出发popstate，因此在load之后再绑定popstate	
			setTimeout(function(){
				window.onpopstate = function(evt){
					notifyChange('onpopstate', evt);
				};
			}, 200);
			notifyChange("onload");
		};
	};

	/**
	 *  设置路由器计算完结果后的回调
	 */
	H5.onRoute = function(__callBack){
		callBack = __callBack;
	};

	/**
	 * 路由发生变化时的Handler
	 */
	function notifyChange(method, evt){
		var routeData = _s.getRouteData(window.location.href, method);	
		if(callBack){
			callBack(routeData, evt);
		}
	}


	/**
	 * 获得一个变量的字符值
	 */
	function text(str){
		return str === undefined ? '' : 
			(str + '') ? str : '';
	}
	/**
	 * 根据url得到一个routeData对象
	 * @params url string 一个本站的url
	 */
	H5.getRouteData = function(url, method){
		//  获取一个本站的完整url对象
		var urlPrts = __get_local_site_url_parts(url);

		// 分析path
		var m = urlPrts.path.match(/^\/?(m-)?([^-]*)-?(.*)/);
		var o = {
			isNewRouter : !!m[1],
			action : !!m[2] ? m[2] : "index",
			inlineQuery : !!m[3] ? m[3] : ""
		};
		// 计算query
		var query = {};
		if(o.isNewRouter && o.inlineQuery){
			var p = o.inlineQuery.split("-"), _r = [];	
			for(var i = 0; i < p.length; i+=2){
				query[p[0]] = text(p[1]);
			}
		}
		var _q = urlPrts.query.match(/([^=&]+=[^=&]*)/g);
		if(_q){
			for(var i = 0; i < _q.length; i++){
				var t = _q[i].split("=");
				query[t[0]] = text(t[1]);
			}
		}

		return {
			url : url,
			action : o.action,
			query : query,
			method : method
		};
	}

	/**
	 * 根据rfc的规范，将window.location.href和传入url对比获取本站的url
	 */
	function __get_local_site_url_parts(url){
		var urlPrts = H5.parse_url(url), prts = H5.parse_url(window.location.href);
		urlPrts.scheme = prts.scheme;
		urlPrts.authority = prts.authority;
		urlPrts.path = urlPrts.path || '/';
		urlPrts.query = text(urlPrts.query);
		return urlPrts;
	}


	/**
	 * 根据query对象创建一个字符串
	 */
	function build_query(query){
		var p = [];
		for(var key in query){p.push(key + '='  + text(query[key]));}
		return p.join("&");
	}


	/**
	 * 单页面应用切换页面
	 * @params action 需要切换的页面
	 * @params query 需要切换的query对象， 键值对
	 */
	H5.switchPage = function(action, query, no_state){
		if(action === '' || action === 'index' || action === undefined) action = '/';
		if(action != '/' && !/^m-/.test(action)){
			action = '/m-' + action;
		}

		// 调整一下参数， 做一个适配
		if(typeof query === 'boolean'){
			no_state = query;
			query = null;
		}

		// 解析query
		var q   = build_query(query);
		var url = action;
		if(q){
			url = action + "?" + q;
		}

		// 如果这个页面不需要记录state, 那么调用replaceState，并且在页面离开的时候，恢复上张页面的状态
		if(no_state){
			var last_url = window.location.href;
			history.replaceState({no_state : true, last_url : last_url}, "", url);
		}else{
			if(history.state && history.state.no_state){
				history.replaceState({}, "", history.state.last_url);
			}
			history.pushState({}, "", url);
		}
		notifyChange("switch");
	};

	/**
	 * 路由回退
	 */
	H5.back = function(){
		window.history.go(-1);
	};
})(window);
