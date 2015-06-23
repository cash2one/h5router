# h5router
## 使用说明
整个设计非常简单，只处理路由部分。一共监听3种事件， 刷新、回退、单页面切换
### 初始化
``` javascript
H5.listen();
````

### 监听路由事件
``` javascript
H5.onRoute(function(routeData){
    console.log(routeData);
});
```

### 单页面切换
```javascript
H5.switchPage("abc"); // 切换到: /abc
H5.switchPage("abc", {g : 1}) //切换到: /abc?g=1
```

### 登录页面的处理
登录页面其实是一张无状态页面， 切换到登录页面后应该调用浏览器的replaceState更换url， 离开登录页面之前应该调用浏览器的replaceState更换回之前状态，
这个路由系统提供了一个解决方案
``` javascript
H5.swichPage("login", true)
```
