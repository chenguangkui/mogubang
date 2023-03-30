/**! 
 * 微信内置浏览器的Javascript API，功能包括： 
 * 
 * 1、分享到微信朋友圈 
 * 2、分享给微信好友 
 * 3、分享到腾讯微博 
 * 4、隐藏/显示右上角的菜单入口 
 * 5、隐藏/显示底部浏览器工具栏 
 * 6、获取当前的网络状态 
 * 7、调起微信客户端的图片播放组件 
 * 8、关闭公众平台Web页面 
 * 
 * @author zhaoxianlie(http://www.baidufe.com) 
 */  
var WeixinApi = (function () {  
  
    "use strict";  
  
    /** 
     * 分享到微信朋友圈 
     * @param       {Object}    data       待分享的信息 
     * @p-config    {String}    appId      公众平台的appId（服务号可用） 
     * @p-config    {String}    imageUrl   图片地址 
     * @p-config    {String}    link       链接地址 
     * @p-config    {String}    desc       描述 
     * @p-config    {String}    title      分享的标题 
     * 
     * @param       {Object}    callbacks  相关回调方法 
     * @p-config    {Boolean}   async                   ready方法是否需要异步执行，默认false 
     * @p-config    {Function}  ready(argv)             就绪状态 
     * @p-config    {Function}  dataLoaded(data)        数据加载完成后调用，async为true时有用，也可以为空 
     * @p-config    {Function}  cancel(resp)    取消 
     * @p-config    {Function}  fail(resp)      失败 
     * @p-config    {Function}  confirm(resp)   成功 
     * @p-config    {Function}  all(resp)       无论成功失败都会执行的回调 
     */  
    function weixinShareTimeline(data, callbacks) {  
        callbacks = callbacks || {};  
        var shareTimeline = function (theData) {  
            WeixinJSBridge.invoke('shareTimeline', {  
                "appid":theData.appId ? theData.appId : '',  
                "img_url":theData.imgUrl,  
                "link":theData.link,  
                "desc":theData.title,  
                "title":theData.desc, // 注意这里要分享出去的内容是desc  
                "img_width":"120",  
                "img_height":"120"  
            }, function (resp) {  
                switch (resp.err_msg) {  
                    // share_timeline:cancel 用户取消  
                    case 'share_timeline:cancel':  
                        callbacks.cancel && callbacks.cancel(resp);  
                        break;  
                    // share_timeline:fail　发送失败  
                    case 'share_timeline:fail':  
                        callbacks.fail && callbacks.fail(resp);  
                        break;  
                    // share_timeline:confirm 发送成功  
                    case 'share_timeline:confirm':  
                    case 'share_timeline:ok':  
                        callbacks.confirm && callbacks.confirm(resp);  
                        break;  
                }  
                // 无论成功失败都会执行的回调  
                callbacks.all && callbacks.all(resp);  
            });  
        };  
        WeixinJSBridge.on('menu:share:timeline', function (argv) {  
            if (callbacks.async && callbacks.ready) {  
                window["_wx_loadedCb_"] = callbacks.dataLoaded || new Function();  
                if(window["_wx_loadedCb_"].toString().indexOf("_wx_loadedCb_") > 0) {  
                    window["_wx_loadedCb_"] = new Function();  
                }  
                callbacks.dataLoaded = function (newData) {  
                    window["_wx_loadedCb_"](newData);  
                    shareTimeline(newData);  
                };  
                // 然后就绪  
                callbacks.ready && callbacks.ready(argv);  
            } else {  
                // 就绪状态  
                callbacks.ready && callbacks.ready(argv);  
                shareTimeline(data);  
            }  
        });  
    }  
  
    /** 
     * 发送给微信上的好友 
     * @param       {Object}    data       待分享的信息 
     * @p-config    {String}    appId      公众平台的appId（服务号可用） 
     * @p-config    {String}    imageUrl   图片地址 
     * @p-config    {String}    link       链接地址 
     * @p-config    {String}    desc       描述 
     * @p-config    {String}    title      分享的标题 
     * 
     * @param       {Object}    callbacks  相关回调方法 
     * @p-config    {Boolean}   async                   ready方法是否需要异步执行，默认false 
     * @p-config    {Function}  ready(argv)             就绪状态 
     * @p-config    {Function}  dataLoaded(data)        数据加载完成后调用，async为true时有用，也可以为空 
     * @p-config    {Function}  cancel(resp)    取消 
     * @p-config    {Function}  fail(resp)      失败 
     * @p-config    {Function}  confirm(resp)   成功 
     * @p-config    {Function}  all(resp)       无论成功失败都会执行的回调 
     */  
    function weixinSendAppMessage(data, callbacks) {  
        callbacks = callbacks || {};  
        var sendAppMessage = function (theData) {  
            WeixinJSBridge.invoke('sendAppMessage', {  
                "appid":theData.appId ? theData.appId : '',  
                "img_url":theData.imgUrl,  
                "link":theData.link,  
                "desc":theData.desc,  
                "title":theData.title,  
                "img_width":"120",  
                "img_height":"120"  
            }, function (resp) {  
                switch (resp.err_msg) {  
                    // send_app_msg:cancel 用户取消  
                    case 'send_app_msg:cancel':  
                        callbacks.cancel && callbacks.cancel(resp);  
                        break;  
                    // send_app_msg:fail　发送失败  
                    case 'send_app_msg:fail':  
                        callbacks.fail && callbacks.fail(resp);  
                        break;  
                    // send_app_msg:confirm 发送成功  
                    case 'send_app_msg:confirm':  
                    case 'send_app_msg:ok':  
                        callbacks.confirm && callbacks.confirm(resp);  
                        break;  
                }  
                // 无论成功失败都会执行的回调  
                callbacks.all && callbacks.all(resp);  
            });  
        };  
        WeixinJSBridge.on('menu:share:appmessage', function (argv) {  
            if (callbacks.async && callbacks.ready) {  
                window["_wx_loadedCb_"] = callbacks.dataLoaded || new Function();  
                if(window["_wx_loadedCb_"].toString().indexOf("_wx_loadedCb_") > 0) {  
                    window["_wx_loadedCb_"] = new Function();  
                }  
                callbacks.dataLoaded = function (newData) {  
                    window["_wx_loadedCb_"](newData);  
                    sendAppMessage(newData);  
                };  
                // 然后就绪  
                callbacks.ready && callbacks.ready(argv);  
            } else {  
                // 就绪状态  
                callbacks.ready && callbacks.ready(argv);  
                sendAppMessage(data);  
            }  
        });  
    }  
  
    /** 
     * 分享到腾讯微博 
     * @param       {Object}    data       待分享的信息 
     * @p-config    {String}    link       链接地址 
     * @p-config    {String}    desc       描述 
     * 
     * @param       {Object}    callbacks  相关回调方法 
     * @p-config    {Boolean}   async                   ready方法是否需要异步执行，默认false 
     * @p-config    {Function}  ready(argv)             就绪状态 
     * @p-config    {Function}  dataLoaded(data)        数据加载完成后调用，async为true时有用，也可以为空 
     * @p-config    {Function}  cancel(resp)    取消 
     * @p-config    {Function}  fail(resp)      失败 
     * @p-config    {Function}  confirm(resp)   成功 
     * @p-config    {Function}  all(resp)       无论成功失败都会执行的回调 
     */  
    function weixinShareWeibo(data, callbacks) {  
        callbacks = callbacks || {};  
        var shareWeibo = function (theData) {  
            WeixinJSBridge.invoke('shareWeibo', {  
                "content":theData.desc,  
                "url":theData.link  
            }, function (resp) {  
                switch (resp.err_msg) {  
                    // share_weibo:cancel 用户取消  
                    case 'share_weibo:cancel':  
                        callbacks.cancel && callbacks.cancel(resp);  
                        break;  
                    // share_weibo:fail　发送失败  
                    case 'share_weibo:fail':  
                        callbacks.fail && callbacks.fail(resp);  
                        break;  
                    // share_weibo:confirm 发送成功  
                    case 'share_weibo:confirm':  
                    case 'share_weibo:ok':  
                        callbacks.confirm && callbacks.confirm(resp);  
                        break;  
                }  
                // 无论成功失败都会执行的回调  
                callbacks.all && callbacks.all(resp);  
            });  
        };  
        WeixinJSBridge.on('menu:share:weibo', function (argv) {  
            if (callbacks.async && callbacks.ready) {  
                window["_wx_loadedCb_"] = callbacks.dataLoaded || new Function();  
                if(window["_wx_loadedCb_"].toString().indexOf("_wx_loadedCb_") > 0) {  
                    window["_wx_loadedCb_"] = new Function();  
                }  
                callbacks.dataLoaded = function (newData) {  
                    window["_wx_loadedCb_"](newData);  
                    shareWeibo(newData);  
                };  
                // 然后就绪  
                callbacks.ready && callbacks.ready(argv);  
            } else {  
                // 就绪状态  
                callbacks.ready && callbacks.ready(argv);  
                shareWeibo(data);  
            }  
        });  
    }  
  
    /** 
     * 调起微信Native的图片播放组件。 
     * 这里必须对参数进行强检测，如果参数不合法，直接会导致微信客户端crash 
     * 
     * @param {String} curSrc 当前播放的图片地址 
     * @param {Array} srcList 图片地址列表 
     */  
    function imagePreview(curSrc,srcList) {  
        if(!curSrc || !srcList || srcList.length == 0) {  
            return;  
        }  
        WeixinJSBridge.invoke('imagePreview', {  
            'current' : curSrc,  
            'urls' : srcList  
        });  
    }  
  
    /** 
     * 显示网页右上角的按钮 
     */  
    function showOptionMenu() {  
        WeixinJSBridge.call('showOptionMenu');  
    }  
  
  
    /** 
     * 隐藏网页右上角的按钮 
     */  
    function hideOptionMenu() {  
        WeixinJSBridge.call('hideOptionMenu');  
    }  
  
    /** 
     * 显示底部工具栏 
     */  
    function showToolbar() {  
        WeixinJSBridge.call('showToolbar');  
    }  
  
    /** 
     * 隐藏底部工具栏 
     */  
    function hideToolbar() {  
        WeixinJSBridge.call('hideToolbar');  
    }  
  
    /** 
     * 返回如下几种类型： 
     * 
     * network_type:wifi     wifi网络 
     * network_type:edge     非wifi,包含3G/2G 
     * network_type:fail     网络断开连接 
     * network_type:wwan     2g或者3g 
     * 
     * 使用方法： 
     * WeixinApi.getNetworkType(function(networkType){ 
     * 
     * }); 
     * 
     * @param callback 
     */  
    function getNetworkType(callback) {  
        if (callback && typeof callback == 'function') {  
            WeixinJSBridge.invoke('getNetworkType', {}, function (e) {  
                // 在这里拿到e.err_msg，这里面就包含了所有的网络类型  
                callback(e.err_msg);  
            });  
        }  
    }  
  
    /** 
     * 关闭当前微信公众平台页面 
     */  
    function closeWindow() {  
        WeixinJSBridge.call("closeWindow");  
    }  
  
    /** 
     * 当页面加载完毕后执行，使用方法： 
     * WeixinApi.ready(function(Api){ 
     *     // 从这里只用Api即是WeixinApi 
     * }); 
     * @param readyCallback 
     */  
    function wxJsBridgeReady(readyCallback) {  
        if (readyCallback && typeof readyCallback == 'function') {  
            var Api = this;  
            var wxReadyFunc = function () {  
                readyCallback(Api);  
            };  
            if (typeof window.WeixinJSBridge == "undefined"){  
                if (document.addEventListener) {  
                    document.addEventListener('WeixinJSBridgeReady', wxReadyFunc, false);  
                } else if (document.attachEvent) {  
                    document.attachEvent('WeixinJSBridgeReady', wxReadyFunc);  
                    document.attachEvent('onWeixinJSBridgeReady', wxReadyFunc);  
                }  
            }else{  
                wxReadyFunc();  
            }  
        }  
    }  
  
    return {  
        version         :"1.8",  
        ready           :wxJsBridgeReady,  
        shareToTimeline :weixinShareTimeline,  
        shareToWeibo    :weixinShareWeibo,  
        shareToFriend   :weixinSendAppMessage,  
        showOptionMenu  :showOptionMenu,  
        hideOptionMenu  :hideOptionMenu,  
        showToolbar     :showToolbar,  
        hideToolbar     :hideToolbar,  
        getNetworkType  :getNetworkType,  
        imagePreview    :imagePreview,  
        closeWindow     :closeWindow  
    };  
})();  

使用方法
[javascript] view plain copy
// 需要分享的内容，请放到ready里  
            WeixinApi.ready(function(Api) {  
  
                // 微信分享的数据  
                var wxData = {  
                    "appId": "", // 服务号可以填写appId  
                    "imgUrl" : 'http://app.zciv.com/plug/fwc/template/wx.100.jpg',  
                    "link" : 'http://app.zciv.com',  
                    "desc" : '大家好123，我是Alien，Web前端&Android客户端阿莫之家，喜欢技术上的瞎倒腾！欢迎多交流',  
                    "title" : "大家好456，我是赵先烈"  
                };  
  
                // 分享的回调  
                var wxCallbacks = {  
                    // 分享操作开始之前  
                    ready : function() {  
                        // 你可以在这里对分享的数据进行重组  
                        alert("准备分享");  
                    },  
                    // 分享被用户自动取消  
                    cancel : function(resp) {  
                        // 你可以在你的页面上给用户一个小Tip，为什么要取消呢？  
                        alert("分享被取消");  
                    },  
                    // 分享失败了  
                    fail : function(resp) {  
                        // 分享失败了，是不是可以告诉用户：不要紧，可能是网络问题，一会儿再试试？  
                        alert("分享失败");  
                    },  
                    // 分享成功  
                    confirm : function(resp) {  
                        // 分享成功了，我们是不是可以做一些分享统计呢？  
                        //window.location.href='http://192.168.1.128:8080/wwyj/test.html';  
                        alert("分享成功");  
                    },  
                    // 整个分享过程结束  
                    all : function(resp) {  
                        // 如果你做的是一个鼓励用户进行分享的产品，在这里是不是可以给用户一些反馈了？  
                        alert("分享结束");  
                    }  
                };  
  
                // 用户点开右上角popup菜单后，点击分享给好友，会执行下面这个代码  
                Api.shareToFriend(wxData, wxCallbacks);  
  
                // 点击分享到朋友圈，会执行下面这个代码  
                Api.shareToTimeline(wxData, wxCallbacks);  
  
                // 点击分享到腾讯微博，会执行下面这个代码  
                Api.shareToWeibo(wxData, wxCallbacks);  
            }); 