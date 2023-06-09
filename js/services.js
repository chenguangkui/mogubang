/**
 * Created by htzhanglong on 2015/8/2.
 */
angular.module('starter.services', [])

/*
 name  [用户信息写入本地缓存]
 */
.factory('StorageFactory', function() {
  return {
    //连接数据库 不成功则创建数据库
    set: function(key,data) {
      return window.localStorage.setItem(key, window.JSON.stringify(data));
    },
    get: function(key) {
      return window.JSON.parse(window.localStorage.getItem(key));
    },
    remove: function(key) {
      return window.localStorage.removeItem(key);
    },
    clear:function(){
      window.localStorage.clear();
    },
    remove2:function(){
      this.remove('user');
      this.remove('taobao');
      this.remove('jd');
      this.remove('jd');
      this.remove('profile');
    }
  };
})

/*
 name  [用户信息写入本地缓存]
 */
 .factory('indexedDBFactory', function() {
   return {
     //连接数据库 不成功则创建数据库
     set: function(key,data) {
       return window.localStorage.setItem(key, window.JSON.stringify(data));
     },
     get: function(key) {
       return window.JSON.parse(window.localStorage.getItem(key));
     },
     remove: function(key) {
       return window.localStorage.removeItem(key);
     },
     clear:function(){
       window.localStorage.clear();
     },
     remove2:function(){
       this.remove('user');
       this.remove('taobao');
       this.remove('profile');
     }
   };
 })
 

/*
 name  全局函数方法 支持任何方法调用
*/
.factory('Common', function($rootScope,$ionicPopup,$ionicLoading,trialOrderFactory) {
  return {
    //复制链接演示
    demo_copy_url: function(key,data){
      console.log()
      return  alertPopup = $ionicPopup.show({
        title: '如何复制商品链接',
        template: '<img src="img/wap_url_demo.gif" width="100%" />',
        buttons: [{
          text: '确定'
        }]
      });
    },
    //验证活动链接
    yz_goods_url:function(url,url2){
        if(!url){
           $ionicLoading.show({
             noBackdrop: true,
             template: '请填写宝贝url地址',
             duration: 1000
           });
           return false;
        }
        //后端验证url地址
        trialOrderFactory.set_test_url(url,url2);
        $rootScope.$on('trialOrderFactory.test_url', function() {
          var test_data = trialOrderFactory.get_test_url();
               $ionicLoading.show({
                 noBackdrop: true,
                 template: test_data.msg,
                 duration: 1000
               });
        });
    }

  };

})

/*
 name  [web数据库]
 */
.factory('DataBaseFactory', function() {
  return {
    //连接数据库
    set: function(key,data) {
      return window.localStorage.setItem(key, window.JSON.stringify(data));
    },
    get: function(key) {

      return window.JSON.parse(window.localStorage.getItem(key));
    },
    remove: function(key) {
      return window.localStorage.removeItem(key);
    },
    clear:function(){
      window.localStorage.clear();
    },
    remove2:function(){
      this.remove('user');
      this.remove('taobao');
      this.remove('profile');
    }
  };
})

/*
 name  获取网站后台配置信息
 */
.factory('configFactory', ['$resource', '$rootScope', 'ENV','StorageFactory',function($resource, $rootScope, ENV,StorageFactory) {

  var APIUrl = ENV.api;
  var data_trial_config;
  /*微信任务*/
  var data_wx_config;
  var data_rebate_config;
  var data_answer_task;
  var friends_config;
  var reward_config;
  var commission_config;
  var app_data;
  var webinfo;
  var focus;
  var bind_config;
  var resource = $resource(APIUrl + '&a=get_activity_config',{}, {
      query: {
        method: 'get',
        cache: true,
        timeout: 20000
      }
    }); //免费试用
  var resource2 = $resource(APIUrl + '&a=get_rebate_config',{}, {
      query: {
        method: 'get',
        cache: true,
        timeout: 20000
      }
    }); //购物返利活动设置
  var resource3 = $resource(APIUrl + '&a=answer_task',{}, {
      query: {
        method: 'get',
        cache: true,
        timeout: 20000
      }
    }); //日赚任务活动设置

  var resource4 = $resource(APIUrl + '&a=get_friends_config',{}, {
      query: {
        method: 'get',
        cache: true,
        timeout: 20000
      }
    }); //推荐好友后台设置


 var resource5 = $resource(APIUrl + '&a=get_reward_config',{}, {
      query: {
        method: 'get',
        cache: true,
        timeout: 20000
      }
    });


 var resource6 = $resource(APIUrl + '&a=get_commission_config',{}, {
     query: {
       method: 'get',
       cache: true,
       timeout: 20000
     }
   }); //闪电试用活动设置


 
 var resource7 = $resource(APIUrl + '&a=get_app_config',{}, {
     query: {
       method: 'get',
       cache: true,
       timeout: 20000
     }
   });


 //网站基本信息
 var resource8 = $resource(APIUrl + '&a=get_webinfo');

//幻灯片
 var resource9 = $resource(APIUrl + '&a=focus');


 var resource10 = $resource(APIUrl + '&a=get_weixin_config',{}, {
     query: {
       method: 'get',
       cache: true,
       timeout: 20000
     }
   });
  
  //获取后台绑定帐号设置 淘宝京东微信
  var resource11 = $resource(APIUrl + '&a=get_bind_config',{}, {
     query: {
       method: 'get',
       cache: true,
       timeout: 20000
     }
   });

  //获取vip设置
    var resource12 = $resource(APIUrl + '&a=get_vip_config',{}, {
        query: {
            method: 'get',
            cache: true,
            timeout: 20000
        }
    });

    //获取在线支付设置
    var resource13 = $resource(APIUrl + '&a=get_pay_config',{}, {
        query: {
            method: 'get',
            cache: true,
            timeout: 20000
        }
    });

  return {
    // 获取免费试用活动配置
    set_trial_config: function() {
      var cache = StorageFactory.get('trial_config');
      var time = Date.parse(new Date()) / 1000;
      if(cache && time - cache.time < 600){
         data_trial_config = cache;
         setTimeout(function(){
            $rootScope.$broadcast('configFactory.set_trial_config');
        },1);
      }else{
          resource.query({
          }, function(r) {
            r.time = time;
            data_trial_config = r;
            StorageFactory.set('trial_config',data_trial_config);
            $rootScope.$broadcast('configFactory.set_trial_config');
          });
      }
    },
    get_trial_config: function() {
      if (!data_trial_config) return false;
      return data_trial_config;
    },

     // 获取微信任务活动配置
    set_wx_config: function() {

      resource10.query({

      }, function(r) {
        //console.log(r);
        data_wx_config = r;

        $rootScope.$broadcast('configFactory.set_wx_config');
      });

    },

    get_wx_config: function() {
      if (!data_wx_config) return false;

      return data_wx_config;

    },
    //获取升级vip设置
    set_vip_config: function() {
      resource12.query({}, function (r) {
          //console.log(r);
          data_wx_config = r;
          $rootScope.$broadcast('configFactory.set_vip_config');
      });
    },
    get_vip_config: function() {
      if (!data_wx_config) return false;
      return data_wx_config;
    },

      // 获取购物返利活动配置
    set_rebate_config: function() {
      resource2.query({
      }, function(r) {
        //console.log(r);
        data_rebate_config = r;
        $rootScope.$broadcast('configFactory.set_rebate_config');
      });
    },

    //获取结果
    get_rebate_config: function() {
      if (data_rebate_config == undefined) return false;

      return data_rebate_config;

    },
    // 获取日赚任务活动配置
    set_answer_task: function() {

      resource3.query({

      }, function(r) {

        //console.log(r);

        data_answer_task = r;

        $rootScope.$broadcast('configFactory.set_answer_task');
      });

    },

    //获取日赚任务结果
    get_answer_task: function() {
      if (data_rebate_config == undefined) return false;

      return data_rebate_config;

    },
    // 获取推荐好友后台活动配置
    set_friends_config: function() {

      resource4.query({

      }, function(r) {

        //console.log(r);

        friends_config = r;

        $rootScope.$broadcast('configFactory.set_friends_config');
      });

    },

    //获取推荐好友结果
    get_friends_config: function() {
      if (friends_config == undefined) return false;

      return friends_config;

    },

    //获取大转盘后台设置
    set_reward_config: function() {

      resource5.query({

      }, function(r) {

        //console.log(r);

        commission_config = r;

        $rootScope.$broadcast('configFactory.set_reward_config');
      });

    },
     get_reward_config: function() {
       if (commission_config == undefined) return false;

       return commission_config;

     },

     //获取免费试用设置
     set_commission_config: function() {

       resource6.query({

       }, function(r) {

         //console.log(r);

         commission_config = r;

         $rootScope.$broadcast('configFactory.set_commission_config');
       });

     },
      get_commission_config: function() {
        if (commission_config == undefined) return false;

        return commission_config;

      },


      //获取app版本号
      set_app_config: function() {

        resource7.query({

        }, function(r) {

          app_data = r;

          $rootScope.$broadcast('configFactory.set_app_config');
        });

      },
       get_app_config: function() {

         return app_data.data;

       },

       //检查是否是最新版本
       set_app_updale: function() {

         resource7.query({

         }, function(r) {

           app_data = r;

           $rootScope.$broadcast('configFactory.set_app_updale');
         });

       },
        get_app_updale: function() {

          return app_data.data;

        },

       //获取网站基本信息
       set_webinfo: function() {
            resource8.save({
              },function(r){
                webinfo = r;
                $rootScope.$broadcast('configFactory.set_webinfo');
              });
       },
        get_webinfo: function() {
          return webinfo.data;
        },

        //获取网站幻灯片
        set_focus: function() {
          var cache = StorageFactory.get('focus');
          var time = Date.parse(new Date()) / 1000;
          if(cache && time -cache.time  < 600){
             focus =  cache.data;
             setTimeout(function(){
                $rootScope.$broadcast('configFactory.set_focus');
            },1);
          }else{
            resource9.query({
             }, function(r) {
              focus = r;
              var cache2 = {};
              cache2.data = r;
              cache2.time = time;
              StorageFactory.set('focus',cache2);
              $rootScope.$broadcast('configFactory.set_focus');
            });
          }
        },
         get_focus: function() {
            return focus;
         },
         //获取绑定帐号设置
         set_bind_config: function() {
           var cache = StorageFactory.get('bind_config');
           var time = Date.parse(new Date()) / 1000;
           if(cache && time - cache.time < 300){
              bind_config = cache;
              setTimeout(function(){
                 $rootScope.$broadcast('configFactory.set_bind_config');
             },1);
           }else{
              resource11.query({
              }, function(r) {
                r.time = time;
                bind_config = r;
                StorageFactory.set('bind_config',r);
                $rootScope.$broadcast('configFactory.set_bind_config');
              });
           }
         },
          get_bind_config: function() {
             return bind_config;
          },

          //获取pay设置
          set_pay_config: function() {
                resource13.query({
                  }, function(r) {
                    bind_config = r;
                      $rootScope.$broadcast('configFactory.set_pay_config');
                  });
          },
          get_pay_config: function() {
              return bind_config;
          },
  }

}])


.factory('articlehelplistFactory', ['$rootScope', '$resource', 'ENV', '$stateParams',function($rootScope, $resource, ENV, $stateParams) {

  var type = 'gethelplist', 
  catid = '2';
  var obj = $resource(ENV.api);
  var data_lists;

  return {

    all: function(catid) {

      // 获取帮助中心主栏目
      var data = obj.query({
        a: 'gethelplist',
        catid: catid
      },function(r){

        data_lists = r;

        $rootScope.$broadcast('articlehelplistFactory.all');
      });
    },

    catid_helplist: function() {

      // 获取帮助中心2级栏目列表

      catid = $stateParams.catid;
      $rootScope.catid_helplist = obj.query({
        a: 'gethelplist',
        catid: catid,
      });

      return $rootScope.catid_helplist;

    },

    article_catid_show_list: function() {

      // 获取帮助中心指定栏目文章列表
      catid = $stateParams.catid;
      $rootScope.article_catid_show_list = obj.query({
        a: 'getcatidlist',
        catid: catid,
      });
      return $rootScope.article_catid_show_list;

    },
    get_lists:function(){
      return data_lists;
    }


  }
}])



//获取文章详情
.factory('article_showFactory', ['$resource', '$rootScope', 'ENV',function($resource, $rootScope, ENV) {


  var ApiUrl = ENV.api,
    // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
    topic = '';


  var resource = $resource(ApiUrl, {}, {
    query: {
      method: 'get',
      params: {
        a: 'helpshow',
        aid: '@aid'
      },
      cache: true,
      timeout: 20000
    }
  });


  return {

    get: function(aid) {

      //console.log(aid);
      return resource.query({
        a: 'helpshow',
        id: aid,
      }, function(response) {
        //console.log(response);
        topic = response;

        $rootScope.$broadcast('NewsContent.articleshow');
      });

    },
    getArticle: function() {
      return topic;
      //console.log(topic);
    }


  };


}])



.factory('trial_listFactory', ['$rootScope', '$resource', 'ENV', '$stateParams','StorageFactory',function($rootScope, $resource, ENV, $stateParams,StorageFactory) {

  var ApiUrl = ENV.api,
    // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
    topics = {},
    type = 'goodslists',
    mod = 'trial',
    status = '1',
    isrecommend = '0',
    catid = '0',
    orderby = 'id',
    page = '1',
    is_point = 0,
    is_vip = 0,
    trial_type = 0,
    ctype = 0,
    data_isrecommend;

  var resource = $resource(ApiUrl, {}, {
    query: {
      method: 'get',
      params: {
        a: 'getPortalList',
        catid: '@catid',
        page: '@page'

      },
      timeout: 20000
    }
  });

  var resource1 = $resource(ApiUrl, {}, {
    query: {
      method: 'get',
      params: {
        a: 'isrecommend',
        catid: '@catid',
        page: '@page'

      },
      timeout: 20000
    }
  });


  return {

    categorylists: function() {
      // 获取产品分类
      $rootScope.categorylists = resource.get({
        a: 'goods_categorylists'
      });
      return $rootScope.categorylists;
    },
    set_goods_isrecommend: function(mod) {
      var cache = StorageFactory.get('goods_isrecommend');
      var time = Date.parse(new Date()) / 1000;
      if(cache && time - cache.time < 300){
         data_isrecommend = StorageFactory.get('goods_isrecommend');
         setTimeout(function(){
            $rootScope.$broadcast('trial_listFactory.set_goods_isrecommend');
        },1);
      }else{
          // 获取推荐商品
          resource1.query({
            mod: mod
          }, function(r) {
             r.time = time;
             StorageFactory.set('goods_isrecommend',r);
             data_isrecommend = r;
              //在这里请求完成以后  通知control
            $rootScope.$broadcast('trial_listFactory.set_goods_isrecommend');
          }) 
      }
    },
    //接收推荐商品
    get_goods_isrecommend:function(){
        return data_isrecommend.data;
    },

    //获取第一页的数据
    getTopTopics: function(refresh) {
        var hasNextPage = true; //是否有下一页
        //缓存第一页数据 默认时间10分钟 
        var cache = StorageFactory.get('trial_list');
        var time = Date.parse(new Date()) / 1000;
        if(!refresh && cache && cache[catid].time - time < 600){
           topics = cache;
           setTimeout(function(){
              $rootScope.$broadcast('PortalList.portalsUpdated');
          },1);
        }else{
           resource.query({
             mod: mod,
             a: type,
             page: 1,
             catid: catid,
             orderby: orderby,
             orderway: 'desc',
             'is_vip' : is_vip,
             'is_point' : is_point,
             'trial_type': trial_type,
             'ctype':ctype
           }, function(r) {
             if(r.status ==0 || !r.lists || r.lists.length < 10) { //来判断是否有下一页数据
               hasNextPage = false;
             }
             topics[catid] = {
                 hasNextPage: hasNextPage,
                 'nextPage': 2,
                 'data': r.lists,
                 'time':time,
               }
               if(refresh){
                 //缓存第一页数据
                 StorageFactory.set('trial_list',topics);
               }
               //在这里请求完成以后  通知control
               $rootScope.$broadcast('PortalList.portalsUpdated');
           })
        }
    },
    //返回我们保存的数据
    getArticles: function() {
      if (topics[catid] === undefined) {
         return false
      }
      return topics[catid].data;

    },
    getMoreTopics: function() {

      //判断数据是否为空
      if (topics[catid] === undefined) {
        return false;
      }

      //获取以前的数据
      var hasNextPage = topics[catid].hasNextPage;
      var nextPage = topics[catid].nextPage;
      var moreTopicsData = topics[catid].data;
      resource.query({
        mod: mod,
        a: type,
        catid: catid,
        orderby: orderby,
        orderway: 'desc',
        page: nextPage,
        'is_vip' : is_vip,
        'is_point' : is_point,
        'trial_type': trial_type,
        'ctype':ctype,
      }, function(r) {

        nextPage++;
        if (!r.lists || r.lists.length < 10) { //来判断是否有下一页数据
          hasNextPage = false;
        }
        moreTopicsData = moreTopicsData.concat(r.lists);
        topics[catid] = {
          hasNextPage: hasNextPage,
          'nextPage': nextPage,
          'data': moreTopicsData
        }

        //在这里请求完成以后  通知controller


        $rootScope.$broadcast('PortalList.portalsUpdated');

      })
    },


    //获取红包试用第一页的数据
    getTopTopics_red: function() {
      var hasNextPage = true; //是否有下一页
      resource.query({
        mod: mod,
        a: type,
        page: 1,
        trial_type:3,
        catid: catid,
        orderby: orderby,
        orderway: 'desc'
      }, function(r) {
         //console.log(r);
        if (!r.lists || r.lists.length < 10) { //来判断是否有下一页数据
          hasNextPage = false;
        }

        //console.log(hasNextPage);
        topics[catid] = {

            hasNextPage: hasNextPage,
            'nextPage': 2,
            'data': r.lists
          }
          //在这里请求完成以后  通知control
        $rootScope.$broadcast('PortalList.portalsUpdated');

      })
    },
    //返回我们保存的数据
    getArticles: function() {
      if (topics[catid] === undefined) {

        return false
      }

      //console.log(topics[catid].data);


      return topics[catid].data;

    },
    getMoreTopics_red: function() {

      //判断数据是否为空
      if (topics[catid] === undefined) {
        return false;
      }

      //获取以前的数据
      var hasNextPage = topics[catid].hasNextPage;
      var nextPage = topics[catid].nextPage;
      var moreTopicsData = topics[catid].data;

      //console.log(catid);

      resource.query({
        mod: mod,
        a: type,
        catid: catid,
        orderby: orderby,
        orderway: 'desc',
        trial_type:3,
        page: nextPage
      }, function(r) {

        nextPage++;

        if (!r.lists || r.lists.length < 10) { //来判断是否有下一页数据
          hasNextPage = false;
        }
        moreTopicsData = moreTopicsData.concat(r.lists);
        topics[catid] = {
          hasNextPage: hasNextPage,
          'nextPage': nextPage,
          'data': moreTopicsData
        }

        //在这里请求完成以后  通知controller


        $rootScope.$broadcast('PortalList.portalsUpdated');

      })
    },
    // 获取指定栏目商品
    goods_catid_list: function(catid_id) {
      catid = catid_id;
      this.getTopTopics(true);
    },
    //商品排序            
    goods_catid_list_order: function(selects) {
      orderby = selects.order_id,
      is_point = selects.is_point;
      is_vip = selects.is_vip;
      trial_type = selects.trial_type;
      catid = selects.catid;
      ctype = selects.ctype;
      this.getTopTopics(true);
    },

    hasNextPage: function() {
      if (topics[catid] === undefined) {
        return false;
      }
      return topics[catid].hasNextPage;
    }
  }
}])



.factory('rebate_listFactory', ['$rootScope', '$resource', 'ENV', '$stateParams',function($rootScope, $resource, ENV, $stateParams) {


  var ApiUrl = ENV.api,
    // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
    topics = {},
    type = 'goodslists',
    mod = 'rebate',
    status = '1',
    isrecommend = '0',
    catid = '0',
    orderby = 'id',
    page = '1';

  var resource = $resource(ApiUrl, {}, {
    query: {
      method: 'get',
      params: {
        a: 'getPortalList',
        catid: '@catid',
        page: '@page'

      },
      timeout: 20000
    }
  });


  return {



    categorylists: function() {
      // 获取产品分类

      $rootScope.categorylists = resource.get({
        a: 'goods_categorylists'
      });

      return $rootScope.categorylists;

    },

    goods_isrecommend: function() {
      // 获取推荐商品
      $rootScope.isrecommend = resource.get({
        a: type,
        mod: mod,
        status: status,
        isrecommend: 1
      });
      return $rootScope.isrecommend;

    },

    //获取第一页的数据
    getTopTopics: function() {



      var hasNextPage = true; //是否有下一页

      resource.query({
        mod: mod,
        a: type,
        page: 1,
        catid: catid,
        orderby: orderby,
        orderway: 'desc'
      }, function(r) {



        if (r.count < 10) { //来判断是否有下一页数据
          hasNextPage = false;
        }
        topics[catid] = {

            hasNextPage: hasNextPage,
            'nextPage': 2,
            'data': r.lists
          }
          //在这里请求完成以后  通知controller

        //  //console.log(r.lists);
        $rootScope.$broadcast('PortalList.portalsUpdated');

      })
    },
    //返回我们保存的数据
    getArticles: function() {
      if (topics[catid] === undefined) {

        return false
      }

      //   //console.log(topics[catid].data);


      return topics[catid].data;

    },
    getMoreTopics: function() {

      //判断数据是否为空
      if (topics[catid] === undefined) {
        return false;
      }

      //获取以前的数据
      var hasNextPage = topics[catid].hasNextPage;
      var nextPage = topics[catid].nextPage;
      var moreTopicsData = topics[catid].data;

      //console.log(catid);

      resource.query({
        mod: mod,
        a: type,
        catid: catid,
        orderby: orderby,
        orderway: 'desc',
        page: nextPage
      }, function(r, r2) {
        
        nextPage++;
        if (r.status == 0 || !r.lists || r.lists.length < 10) { //来判断是否有下一页数据
          hasNextPage = false;
        }
        if(r.lists && r.lists.length >0){
          moreTopicsData = moreTopicsData.concat(r.lists);
        }
        topics[catid] = {
          hasNextPage: hasNextPage,
          'nextPage': nextPage,
          'data': moreTopicsData
        }
        //在这里请求完成以后  通知controller
        $rootScope.$broadcast('PortalList.portalsUpdated');

      }, function(error) {
        //console.log(error);

      })
    },

    // 获取指定栏目商品
    goods_catid_list: function(catid_id) {

      catid = catid_id;
      this.getTopTopics();


    },
    //商品排序            
    goods_catid_list_order: function(orderby_id) {

      //console.log(catid);

      orderby = orderby_id;
      this.getTopTopics();


    },

    hasNextPage: function() {
      if (topics[catid] === undefined) {
        return false;
      }
      return topics[catid].hasNextPage;
    }



  }



}])


/*9.9包邮请求封装*/
.factory('postalFactory', ['$rootScope', '$resource', 'ENV', '$stateParams',function($rootScope, $resource, ENV, $stateParams) {

  var ApiUrl = ENV.api,
    // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
    topics = {},
    type = 'goodslists',
    mod = 'postal',
    status = '1',
    isrecommend = '0',
    catid = '0',
    orderby = 'id',
    page = '1';

  var resource = $resource(ApiUrl, {}, {
    query: {
      method: 'get',
      params: {
        a: 'getPortalList',
        catid: '@catid',
        page: '@page'

      },
      timeout: 20000
    }
  });

  return {

    categorylists: function() {
      // 获取产品分类
      $rootScope.categorylists = resource.get({
        a: 'goods_categorylists'
      });

      return $rootScope.categorylists;

    },

    goods_isrecommend: function() {
      // 获取推荐商品
      $rootScope.isrecommend = resource.get({
        a: type,
        mod: mod,
        status: status,
        isrecommend: 1
      });
      return $rootScope.isrecommend;

    },

    //获取第一页的数据
    getTopTopics: function() {

      var hasNextPage = true; //是否有下一页

      resource.query({
        mod: mod,
        a: type,
        page: 1,
        catid: catid,
        orderby: orderby,
        orderway: 'desc'
      }, function(r) {
        if (r.count < 10) { //来判断是否有下一页数据
          hasNextPage = false;
        }
        topics[catid] = {

            hasNextPage: hasNextPage,
            'nextPage': 2,
            'data': r.lists
          }
          //在这里请求完成以后  通知controller

        //  //console.log(r.lists);
        $rootScope.$broadcast('postalFactory.getTopTopics');

      })
    },
    //返回我们保存的数据
    getArticles: function() {
      if (topics[catid] === undefined) {

        return false
      }

      //   //console.log(topics[catid].data);


      return topics[catid].data;

    },
    getMoreTopics: function() {

      //判断数据是否为空
      if (topics[catid] === undefined) {
        return false;
      }

      //获取以前的数据
      var hasNextPage = topics[catid].hasNextPage;
      var nextPage = topics[catid].nextPage;
      var moreTopicsData = topics[catid].data;

      //console.log(catid);

      resource.query({
        mod: mod,
        a: type,
        catid: catid,
        orderby: orderby,
        orderway: 'desc',
        page: nextPage
      }, function(r, r2) {

        nextPage++;

        //  //console.log(r2);
        if (!r.lists || r.lists.length < 10) { //来判断是否有下一页数据
          hasNextPage = false;
        }
        moreTopicsData = moreTopicsData.concat(r.lists);
        topics[catid] = {
          hasNextPage: hasNextPage,
          'nextPage': nextPage,
          'data': moreTopicsData
        }

        //在这里请求完成以后  通知controller


        $rootScope.$broadcast('postalFactory.getTopTopics');

      }, function(error) {
        //console.log(error);

      })
    },

    // 获取指定栏目商品
    goods_catid_list: function(catid_id) {

      catid = catid_id;
      this.getTopTopics();


    },
    //商品排序            
    goods_catid_list_order: function(orderby_id) {

      //console.log(catid);

      orderby = orderby_id;
      this.getTopTopics();


    },

    hasNextPage: function() {
      if (topics[catid] === undefined) {
        return false;
      }
      return topics[catid].hasNextPage;
    }



  }

}])


/*9.9包邮请求封装*/
.factory('quanFactory', ['$rootScope', '$resource', 'ENV', '$stateParams',function($rootScope, $resource, ENV, $stateParams) {

  var ApiUrl = ENV.api,
    // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
    topics = {},
    type = 'goodslists',
    mod = 'postal',
    status = '1',
    isrecommend = '0',
    catid = '0',
    orderby = 'id',
    page = '1';

  var resource = $resource(ApiUrl, {}, {
    query: {
      method: 'get',
      params: {
        a: 'getPortalList',
        catid: '@catid',
        page: '@page'

      },
      timeout: 20000
    }
  });

  return {
    //获取第一页的数据
    getTopTopics: function() {
      var hasNextPage = true; //是否有下一页
      resource.query({
        mod: mod,
        a: type,
        page: 1,
        catid: catid,
        orderby: orderby,
        orderway: 'desc'
      }, function(r) {
        if (r.count < 10) { //来判断是否有下一页数据
          hasNextPage = false;
        }
        topics[catid] = {
            hasNextPage: hasNextPage,
            'nextPage': 2,
            'data': r.item_list
          }
        $rootScope.$broadcast('qaunFactory.getTopTopics');
      })
    },
    //返回我们保存的数据
    getArticles: function() {
      if (topics[catid] === undefined) {

        return false
      }
      return topics[catid].data;
    },
    getMoreTopics: function() {
      //判断数据是否为空
      if (topics[catid] === undefined) {
        return false;
      }
      //获取以前的数据
      var hasNextPage = topics[catid].hasNextPage;
      var nextPage = topics[catid].nextPage;
      var moreTopicsData = topics[catid].data;
      resource.query({
        a: type,
        catid: catid,
        page: nextPage
      }, function(r, r2) {
        nextPage++;
        if (r.count < 10) { //来判断是否有下一页数据
           hasNextPage = false;
        }
        moreTopicsData = moreTopicsData.concat(r.item_list);
        topics[catid] = {
          hasNextPage: hasNextPage,
          'nextPage': nextPage,
          'data': moreTopicsData
        }
        //在这里请求完成以后  通知controller
        $rootScope.$broadcast('qaunFactory.getTopTopics');
      }, function(error) {
        //console.log(error);

      })
    },

    hasNextPage: function() {
      if (topics[catid] === undefined) {
        return false;
      }
      return topics[catid].hasNextPage;
    }

  }

}])



/*微信推广活动请求封装*/
.factory('weixinFactory', ['$rootScope', '$resource', 'ENV', '$stateParams',function($rootScope, $resource, ENV, $stateParams) {

  var ApiUrl = ENV.api,
    // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
    topics = {},
    type = 'goodslists',
    mod = 'weixin',
    status = '1',
    isrecommend = '0',
    catid = '0',
    orderby = 'id',
    page = '1';

  var resource = $resource(ApiUrl, {}, {
    query: {
      method: 'get',
      params: {
        a: 'getPortalList',
        catid: '@catid',
        page: '@page'

      },
      timeout: 20000
    }
  });


  return {

    //获取第一页的数据
    getTopTopics: function() {

      var hasNextPage = true; //是否有下一页

      resource.query({
        mod: mod,
        a: type,
        page: 1,
        catid: catid,
        orderby: orderby,
        orderway: 'desc'
      }, function(r) {
        if (r.count < 10) { //来判断是否有下一页数据
          hasNextPage = false;
        }
        topics[catid] = {

            hasNextPage: hasNextPage,
            'nextPage': 2,
            'data': r.lists
          }
          //在这里请求完成以后  通知controller

        //  //console.log(r.lists);
        $rootScope.$broadcast('weixinFactory.getTopTopics');

      })
    },
    //返回我们保存的数据
    getArticles: function() {
      if (topics[catid] === undefined) {

        return false
      }
      return topics[catid].data;

    },
    getMoreTopics: function() {

      //判断数据是否为空
      if (topics[catid] === undefined) {
        return false;
      }

      //获取以前的数据
      var hasNextPage = topics[catid].hasNextPage;
      var nextPage = topics[catid].nextPage;
      var moreTopicsData = topics[catid].data;
      resource.query({
        mod: mod,
        a: type,
        catid: catid,
        orderby: orderby,
        orderway: 'desc',
        page: nextPage
      }, function(r, r2) {
        nextPage++;
        if (!r.lists || r.lists.length < 10) { //来判断是否有下一页数据
          hasNextPage = false;
        }
        moreTopicsData = moreTopicsData.concat(r.lists);
        topics[catid] = {
          hasNextPage: hasNextPage,
          'nextPage': nextPage,
          'data': moreTopicsData
        }

        //在这里请求完成以后  通知controller
        $rootScope.$broadcast('weixinFactory.getTopTopics');

      }, function(error) {
        //console.log(error);

      })
    },

    // 获取指定栏目商品
    goods_catid_list: function(catid_id) {

      catid = catid_id;
      this.getTopTopics();
    },
    //商品排序            
    goods_catid_list_order: function(orderby_id) {
      orderby = orderby_id;
      this.getTopTopics();
    },

    hasNextPage: function() {
      if (topics[catid] === undefined) {
        return false;
      }
      return topics[catid].hasNextPage;
    }
  }

}])


.factory('commissionFactory', ['$rootScope', '$resource', 'ENV', '$stateParams',function($rootScope, $resource, ENV, $stateParams) {


  var ApiUrl = ENV.api,
    // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
    topics = {},
    type = 'goodslists',
    mod = 'commission',
    status = '1',
    isrecommend = '0',
    catid = '0',
    orderby = 'id',
    page = '1';

  var resource = $resource(ApiUrl, {}, {
    query: {
      method: 'get',
      params: {
        a: 'getPortalList',
        catid: '@catid',
        page: '@page'

      },
      timeout: 20000
    }
  });


  return {



    categorylists: function() {
      // 获取产品分类

      $rootScope.categorylists = resource.get({
        a: 'goods_categorylists'
      });

      return $rootScope.categorylists;

    },

    goods_isrecommend: function() {
      // 获取推荐商品
      $rootScope.isrecommend = resource.get({
        a: type,
        mod: mod,
        status: status,
        isrecommend: 1
      });
      return $rootScope.isrecommend;

    },

    //获取第一页的数据
    getTopTopics: function() {

      var hasNextPage = true; //是否有下一页

      resource.query({
        mod: mod,
        a: type,
        page: 1,
        catid: catid,
        orderby: orderby,
        orderway: 'desc'
      }, function(r) {
        if (r.count < 10) { //来判断是否有下一页数据
          hasNextPage = false;
        }
        topics[catid] = {

            hasNextPage: hasNextPage,
            'nextPage': 2,
            'data': r.lists
          }
          //在这里请求完成以后  通知controller

        //  //console.log(r.lists);
        $rootScope.$broadcast('commissionFactory.getTopTopics');

      })
    },
    //返回我们保存的数据
    getArticles: function() {
      if (topics[catid] === undefined) {

        return false
      }

      //   //console.log(topics[catid].data);


      return topics[catid].data;

    },
    getMoreTopics: function() {

      //判断数据是否为空
      if (topics[catid] === undefined) {
        return false;
      }

      //获取以前的数据
      var hasNextPage = topics[catid].hasNextPage;
      var nextPage = topics[catid].nextPage;
      var moreTopicsData = topics[catid].data;

      //console.log(catid);

      resource.query({
        mod: mod,
        a: type,
        catid: catid,
        orderby: orderby,
        orderway: 'desc',
        page: nextPage
      }, function(r, r2) {

        nextPage++;

        //  //console.log(r2);
        if (!r.lists || r.lists.length < 10) { //来判断是否有下一页数据
          hasNextPage = false;
        }
        moreTopicsData = moreTopicsData.concat(r.lists);
        topics[catid] = {
          hasNextPage: hasNextPage,
          'nextPage': nextPage,
          'data': moreTopicsData
        }

        //在这里请求完成以后  通知controller


        $rootScope.$broadcast('commissionFactory.getTopTopics');

      }, function(error) {
        //console.log(error);

      })
    },

    // 获取指定栏目商品
    goods_catid_list: function(catid_id) {

      catid = catid_id;
      this.getTopTopics();


    },
    //商品排序            
    goods_catid_list_order: function(orderby_id) {

      //console.log(catid);

      orderby = orderby_id;
      this.getTopTopics();


    },

    hasNextPage: function() {
      if (topics[catid] === undefined) {
        return false;
      }
      return topics[catid].hasNextPage;
    }



  }



}])



// 获取商品分类数据
.factory('categorylistsFactory', ['ENV', '$resource', '$rootScope','StorageFactory',function(ENV, $resource, $rootScope,StorageFactory) {
  var ApiUrl = ENV.api;
  var items;
  var resource = $resource(ApiUrl, {}, {
    query: {
      method: 'get',
      params: {
        a: 'goods_categorylists'
      },
      cache: true,
      timeout: 20000
    }
  });

  return {
    category_list: function() {
      var cache = StorageFactory.get('category_list');
      var time = Date.parse(new Date()) / 1000;
      if(cache && time - cache.time < 3600){
         items = cache.lists;
         setTimeout(function(){
            $rootScope.$broadcast('categorylistsFactory.category_list');
        },1);
      }else{
         resource.query({
           a: 'goods_categorylists'
         }, function(r) {
           items = r.lists;
           r.time = time;
           StorageFactory.set('category_list',r);
           $rootScope.$broadcast('categorylistsFactory.category_list');
         })
      }
    },
    get_listdata: function() {
      return items;
    }

  }

}])

.factory('user_announceFactory', ['ENV', '$resource', '$rootScope',function(ENV, $resource, $rootScope) {
  var ApiUrl = ENV.api;
  var topics = {};
  var catid = '';
  var type = '1';
  var announce_show;

  var resource = $resource(ApiUrl, {}, {
    query: {
      method: 'get',
      params: {
        a: 'getmessage'
      },
      //     cache: true,
      timeout: 20000
    }
  });

  var resource2 = $resource(ApiUrl)

  return {
    announce_list: function(userid,random,type) {

      var hasNextPage = true;

      resource.get({
        a: 'getmessage',
        userid: userid,
        random:userid,
        type: type
      }, function(r) {

        if (r.lists < 10) { //来判断是否有下一页数据
          hasNextPage = false;
        }
        topics[catid] = {

          hasNextPage: hasNextPage,
          'nextPage': 2,
          'data': r.lists
        }

        $rootScope.$broadcast('user_announceFactory.announce_list');
      })

    },

    get_listdata: function() {

      if (topics[catid] === undefined) {

        return false
      }


      return topics[catid].data;
    },
    getMoreTopics: function(userid,random,type) {
      //判断数据是否为空
      if (topics[catid] === undefined) {
        return false;
      }

      //获取以前的数据
      var hasNextPage = topics[catid].hasNextPage;
      var nextPage = topics[catid].nextPage;
      var moreTopicsData = topics[catid].data;

      //console.log(catid);

      resource.query({
        a: 'getmessage',
        userid: userid,
        random:random,
        type: type,
        page: nextPage
      }, function(r) {

        nextPage++;

        if (!r.lists || r.lists.length < 10) { //来判断是否有下一页数据
          hasNextPage = false;
        }
        moreTopicsData = moreTopicsData.concat(r.lists);
        topics[catid] = {
          hasNextPage: hasNextPage,
          'nextPage': nextPage,
          'data': moreTopicsData
        }
        $rootScope.$broadcast('user_announceFactory.announce_list');

      })

    },

    hasNextPage: function() {
      if (topics[catid] === undefined) {
        return false;
      }
      return topics[catid].hasNextPage;
    },
    announce_type: function(type_id) {

      type = type_id;
      this.announce_list();

    },

    //获取单个站内信信息
    set_announce_show: function(type,id,uid) {
      resource2.get({
        a: 'getmessage_show',
        userid:uid,
        type:type,
        id:id,
      }, function(r) {
       announce_show = r;
        $rootScope.$broadcast('user_announceFactory.set_announce_show');
      })

    },
    get_set_announce_show: function() {

       return announce_show;

    }

  }

}])


//获取购物返利商品详情

.factory('rebate_showFactory', ['$resource', '$rootScope', 'ENV','StorageFactory',function($resource, $rootScope,ENV,StorageFactory) {


  var ApiUrl = ENV.api,
    // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
    topic = '';

  var data_good_user_list;
  var data_trial_report_lists;
  var data_shai_report;

  var resource1 = $resource(ApiUrl + '&a=good_user_list');     //试用申请
  var resource2 = $resource(ApiUrl + '&a=trial_report_lists'); //试用报告列表
  var resource3 = $resource(ApiUrl + '&a=goods_report_lists'); //返利晒单

  var resource = $resource(ApiUrl, {}, {
    query: {
      method: 'get',
      params: {
        a: 'goods_show',
        good: '@aid'
      },
    }
  });

  return {
    get_rebate_show: function(aid,refresh) {
      var cache = StorageFactory.get('goods_'+aid);
      var time = Date.parse(new Date()) / 1000;
      if(!refresh && cache && time - cache.time < 60){
         topic = cache.lists;
         setTimeout(function(){
            $rootScope.$broadcast('NewsContent.rebateshow');
        },1);
      }else{
          return resource.query({
            a: 'goods_show',
            goods_id: aid,
          }, function(response) {
            response.time = time,
            topic = response.lists;
            StorageFactory.set('goods_'+aid,response);
            $rootScope.$broadcast('NewsContent.rebateshow');
          });
      }

    },
    getshow: function() {
      return topic;
      //console.log(topic);
    },

   //获取免费试用的参与用户列表
    set_good_user_list: function(aid,sta) {

      resource1.get({
        goods_id: aid,
           state: sta
      }, function(r) {

        //console.log(r);

      data_good_user_list =r;

       $rootScope.$broadcast('rebate_showFactory.set_good_user_list');
      });
    },

    get_good_user_list:function(){

      return data_good_user_list.lists;

    },

     //获取单个商品的试用报告列表 第一页
    set_trial_report_lists: function(aid) {

      resource2.get({
        goods_id: aid
      }, function(r) {
    
      var hasNextPage = true;

        if (!r.lists || r.lists.length < 10) { //来判断是否有下一页数据
          hasNextPage = false;
        }

        data_trial_report_lists =  {
        
         'page': 1,
         'data': r.lists,
  'hasNextPage': hasNextPage 

        };
       $rootScope.$broadcast('rebate_showFactory.set_trial_report_lists');
      });
    },

    //获取单个商品的试用报告 上拉加载更多
    sybg_loadMore: function(aid) {

      //判断数据是否为空
      if (data_trial_report_lists['data'] === undefined) {
        return false;
      }

      data_trial_report_lists['page']++;

      //console.log(data_trial_report_lists['page']);

       resource2.get({
        goods_id: aid,
        page: data_trial_report_lists['page']
      }, function(r) {

        var hasNextPage = true;

        if (!r.lists || r.lists.length < 10) { //来判断是否有下一页数据
          hasNextPage = false;
        }

        data_trial_report_lists = {
          'hasNextPage': hasNextPage,
          'page': data_trial_report_lists['page'],
          'data': data_trial_report_lists['data'].concat(r.lists)
        };

       $rootScope.$broadcast('rebate_showFactory.set_trial_report_lists');

      });

    },
    // 获取是否有下一页数据

    sybg_hasNextPage: function() {

      //判断数据是否为空
      if (data_trial_report_lists['hasNextPage'] == undefined) {
        return false;
      }

      return data_trial_report_lists['hasNextPage'];

    },

    get_trial_report_lists: function(){
      //console.log(data_trial_report_lists);

      if(!data_trial_report_lists) return false;

      return data_trial_report_lists.data;
    },

    // 获取返利 买家晒单的列表
      set_shai_report_lists: function(aid) {

        resource3.get({
          goods_id: aid
        }, function(r) {

         var hasNextPage = true;

          if (!r.lists || r.lists.length < 10) { //来判断是否有下一页数据
            hasNextPage = false;
          }

          //console.log(r);

          data_shai_report =  {
          
           'page': 1,
           'data': r.lists,
    'hasNextPage': hasNextPage 
          };
         $rootScope.$broadcast('rebate_showFactory.set_shai_report_lists');
        });
      }, 

      //获取单个商品的试用报告 上拉加载更多
     sybg_loadMore: function(aid) {

      //判断数据是否为空
      if (data_shai_report['data'] === undefined) {
        return false;
      }

      data_shai_report['page']++;

       resource3.get({
        goods_id: aid,
        page: data_shai_report['page']
      }, function(r) {

        var hasNextPage = true;

        if (!r.lists || r.lists.length < 10) { //来判断是否有下一页数据
          hasNextPage = false;
        }

        data_shai_report = {
          'hasNextPage': hasNextPage,
          'page': data_shai_report['page'],
          'data': data_shai_report['data'].concat(r.lists)
        };

       $rootScope.$broadcast('rebate_showFactory.data_shai_report');

      });

    },
    // 获取是否有下一页数据

     mjsd_hasNextPage: function() {

      //判断数据是否为空
      if (data_shai_report['hasNextPage'] == undefined) {
        return false;
      }

      return data_shai_report['hasNextPage'];

    },

    get_shai_report_lists: function(){
      //console.log(data_shai_report);

      if(!data_shai_report) return false;

      return data_shai_report.data;
    }
};

}])


//验证手机号 获取验证码

.factory('User_registerFactory', ['$resource', '$rootScope', 'ENV',function($resource, $rootScope, ENV) {

  var ApiUrl = ENV.api;
  var resource = $resource(ApiUrl + '&a=check_phone_exsit');//(ApiUrl + '&a=check_phone_exsit');
  var phone_status = {};
  var sms_status = {};
  var sms_error = {};
  var check_sms_status = {};
  var check_sms_error = {};

  return {

    getsms: function(r,response,uexWindow) {
      //console.log(r);
	        resource.get({
		        a: 'check_phone_exsit',
		        phone: r,
		        response:response,
	        }, function(r) {
		        console.log(r);
		        phone_status = r;
		        $rootScope.$broadcast('NewsContent.getsms');
	        })
        
    },

    // 获取验证结果
    setsms: function() {
      return phone_status;
    },

    // 请求服务器发送短信验证码
    send_sms: function(phone_id,$enum,response,type,userid,random,uexWindow) {
      if (uexWindow) {
        resource.save({
          a: 'send_phone_code',
          enum:'phone',
          phone: phone_id,
          response:response,
          type:type,
          userid:userid,
          random:random,
          appCan:'true',
        }, function(r) {
          sms_status = r;
          $rootScope.$broadcast('NewsContent.sendsms');
        })
      }else {
        resource.save({
          a: 'send_phone_code',
          enum:'phone',
          phone: phone_id,
          response:response,
          type:type,
          userid:userid,
          random:random
        }, function(r) {
          sms_status = r;
          $rootScope.$broadcast('NewsContent.sendsms');
        })
      }
    },
    // 获取发送结果
    get_send_sms: function() {
      return sms_status;
    },
    // 发送失败获取原因
    error_get_send_sms: function() {
      return sms_error;
    },

    // 验证验证码是否正确
    register_check_sms: function(r, n) {

      resource.get({
        a: 'register_check_sms',
        phone: r,
        sms: n
      }, function(r) {

        check_sms_status = r.status;
        check_sms_error = r.msg;

        //console.log(r);

        $rootScope.$broadcast('NewsContent.registerchecksms');

      })



    },
    // 获取验证结果

    get_register_check_sms: function() {

      return check_sms_status;

    }
  }

}])

/**
 * @name  提交服务器注册用户
 
 */
.factory('User_register1Factory', ['$resource', '$rootScope', 'ENV',function($resource, $rootScope, ENV) {

  // 1获取需要提交的数据 

  // 1.手机号 2.密码 3.IMEI 4.Registration ID 5.version 6.platform 7.设备名称
  
  //   if(ionic.Platform.isIPad()) var isplatform= ipad;
  //   if(ionic.Platform.isIOS()) var isplatform= ios;
  //   if(ionic.Platform.isAndroid()) var isplatform= Android;
  //   if(ionic.Platform.isWindowsPhone())  var isplatform= Windows;

  // var platform = {
  //       isWebView: ionic.Platform.isWebView(),
  //      isplatform: isplatform,
  //    platform:ionic.Platform.platform(),
  //     version:ionic.Platform.version()
  // };


  var APIUrl = ENV.api;
  var resource = $resource(APIUrl + '&a=register');

  // var user_xinxi = "",

  //   IMEI = "123456789147852",

  //   Registration = "147258369",

  //   version = "1.0",

  //   platform = "ios",

  //   platform_name = "MI147852963";

  return {

    set_register: function(user_phone, user_sms, password) {

      resource.save({
        user_phone: user_phone,
        sms: user_sms,
        user_password: password,
        version: "1.0",
        platform: "IOS",
        platform_name: "ce"
      }, function(r) {


        //console.log(r);

        user_xinxi = r;

        $rootScope.$broadcast('User_register1Factory.setregister');

      })

    },

    get_register: function() {

      return user_xinxi;

      //console.log(user_xinxi);

    }
  }

}])

/*
 name [用户登录]
 */

.factory('UserloginFactory', ['$resource', '$rootScope', 'ENV', 'StorageFactory',function($resource, $rootScope, ENV, StorageFactory) {
  
  var APIUrl = ENV.api,
    user,config_data;
  var storageKey = 'user';
  var resource = $resource(APIUrl + '&c=app&a=login');
  var resource1 = $resource(APIUrl + '&c=app&a=oauth_login');
  var resource2 = $resource(APIUrl + '&c=app&a=oauth_login');
  var resource3 = $resource(APIUrl + '&c=app&a=user_bind');
  var resource4 = $resource(APIUrl + '&c=app&a=login_config');
  return {
    //获取第三方登录配置
    config:function(){
       var cache = StorageFactory.get('login_config');
       var time = Date.parse(new Date()) / 1000;
       if(cache && time - cache.time < 600){
          config_data = cache;
          setTimeout(function(){
             $rootScope.$broadcast('User.config');
         },1);
       }else{
           resource4.save({
           }, function(r) {
             r.time = time;
             StorageFactory.set('login_config',r);
             config_data = r;
             $rootScope.$broadcast('User.config');
           });
       }    
    },
    get_config_data:function(){
        return config_data.data;
    },
    login: function(username, password) {
      return resource.save({
        username: username,
        password: password,
        version: "1.0",
        platform: "IOS",
        platform_name: "ce"
      }, function(r) {
        //登录成功 写入缓存信息
        if(r.status == 1 && r.data.userinfo){
          StorageFactory.set('profile',r.data.userinfo);
          StorageFactory.set('user',r);
        }
        user = r;
        $rootScope.$broadcast('User.loginUpdated');
      });
    },
    'wx_login':function(code){
         return resource2.save({
           code: code,
           type:'wechat',
           version: "1.0",
         }, function(r) {
              //登录成功 写入缓存信息
              if(r.status == 1 && r.data.userinfo){
                StorageFactory.set('profile',r.data.userinfo);
                StorageFactory.set('user',r);
              }
              user = r;
              $rootScope.$broadcast('User.loginUpdated');
         });
    },
    'qq_login':function(code){
         return resource1.save({
           code: code,
           type:'qq',
           version: "1.0",
         }, function(r) {
              //登录成功 写入缓存信息
              if(r.status == 1 && r.data.userinfo){
                StorageFactory.set('profile',r.data.userinfo);
                StorageFactory.set('user',r);
              }
              user = r;
              $rootScope.$broadcast('User.loginUpdated');
         });
    },
     //提交后台绑定帐号
    'user_bind':function(username,password,userinfo,type){
        return resource3.save({
          username: username,
          password: password,
          userinfo:userinfo,
          type:type,
        }, function(r) {
            user = r;
            //登录成功 写入缓存信息
            if(r.status == 1 && r.data.userinfo){
              StorageFactory.set('profile',r.data.userinfo);
              StorageFactory.set('user',r);
            }
           $rootScope.$broadcast('User.user_bind');
        });
    },
    logout: function() {
      StorageFactory.remove2();
    },
    getCurrentUser: function() {
      return user;
    },
   pingtai_login: function(userinfo) {
     return resource1.save({ 
       userinfo:userinfo,
       version: "1.0",
       platform: "IOS",
       platform_name: "ce"
     }, function(r) {
       //console.log(r);
       user = r;
       $rootScope.$broadcast('User.loginUpdated');
     });
   }

  };

}])

/*
 name [获取用户详细信息]

*/
.factory('UserPersonalFactory', ['$resource', '$rootScope', 'ENV','StorageFactory',function($resource, $rootScope, ENV,StorageFactory) {
  var ApiUrl = ENV.api,
    // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
    topic = '';

  var money_data; 

  var resource = $resource(ApiUrl, {}, {
    query: {
      method: 'get',
      params: {
        a: 'goods_show',
        good: '@aid'
      },
      timeout: 20000
    }
  });

  var resource2 = $resource(ApiUrl + '&a=get_user_money');
  var resource3 = $resource(ApiUrl + '&a=get_user_point');

  return {
    set_userinfo: function(userid, random) {
      return resource.query({
        a: 'get_userinfo',
        userid: userid,
        random: random
      }, function(response) {
        userinfo = response;
        if(userinfo.status ==1){
          StorageFactory.set('profile',userinfo);
        }
        if(userinfo.status ==0){
           StorageFactory.remove2();
           userinfo = '';
        }
        $rootScope.$broadcast('UserPersonal.set_userinfo');
      });

    },
    get_userinfo: function() {
      return userinfo;
    },
    set_userinfo_money:function(userid,random){
        //获取可用余额
      return resource2.save({
        userid: userid,
        random:random,
      }, function(r) {
         money_data = r;
         $rootScope.$broadcast('Userforget.set_userinfo_money');
      });
    },
    get_userinfo_money:function(){
       return money_data;
    },
    set_userinfo_point:function(userid,random){
        //获取可用余额
      return resource3.save({
        userid: userid,
        random:random,
      }, function(r) {
         money_data = r;
         $rootScope.$broadcast('Userforget.set_userinfo_point');
      });
    },
    get_userinfo_point:function(){
       return money_data;
    }


  };


}])


/*
  name  忘记密码
 */
.factory('UserForgetFactory', ['$resource', '$rootScope', 'ENV', 'StorageFactory',function($resource, $rootScope, ENV, StorageFactory) {
  var APIUrl = ENV.api,
    data, //验证用户名和验证码 返回结果
    data3, //重置密码返回结果 返回结果
    user;
  var storageKey = 'user';
  var resource = $resource(APIUrl + '&a=send_code');
  var resource2 = $resource(APIUrl + '&a=check_find_pwd');
  var resource3 = $resource(APIUrl + '&a=reset_pwd');

  // 往用户邮箱或者手机当中发送验证码
  return {
    set_username: function(username,response,uexWindow) {
      if (uexWindow) {
	      return resource.save({
		      username: username,
		      type:'forget_pwd',
		      response:response,
          appCan:'true'
	      }, function(r) {
		      user = r;
		      $rootScope.$broadcast('Userforget.set_username');
	      });
      }
      else {
	      return resource.save({
		      username: username,
		      type:'forget_pwd',
		      response:response
	      }, function(r) {
		      user = r;
		      $rootScope.$broadcast('Userforget.set_username');
	      });
      }
    },
    get_username: function() {
      //console.log(user);
      return user;
    },

    // 后台验证用户邮箱和验证码是否正确！
    set_username_code: function(username, sms) {
      return resource2.save({
        username: username,
        code: sms
      }, function(r) {
        data = r;
        $rootScope.$broadcast('Userforget.set_username_code');
      });
    },
    get_username_code: function() {
      //console.log(user);
      return data;
    },

    // 请求后台修改密码
    set_username_password: function(username, userid, password, random) {

      return resource3.save({
        username: username,
        userid: userid,
        password: password,
        random: random
      }, function(r) {
        data3 = r;
        $rootScope.$broadcast('Userforget.set_username_password');
      });

    },
    get_username_password: function() {
      //console.log(user);
      return data3;
    }


  };

}])

/*
  name  修改用户资料 昵称 手机号 
 */

.factory('UserProfileFactory', ['$resource', '$rootScope', 'ENV', 'StorageFactory',function($resource, $rootScope, ENV, StorageFactory) {
  var APIUrl = ENV.api,
    data1, //修改密码 返回结果
    data2, //获取后台收货地址
    data3,
    data4, //修改或者认证邮箱
    data5, //修改QQ
    data6, //修改绑定手机
    data7, //获取已绑定淘宝帐号
    data8, //获取用户现有收货地址
    data9, //修改用户收货地址
    data10, //修改用户实名认证
    data11,
    data12,
    data13, // 绑定淘宝
    data14, //设置默认淘宝帐号
    data15, //删除淘宝帐号
    data16, //支持的提现银行
    data17; //绑定支付宝
  var data18;   //修改用户昵称
  var data19,   // 绑定其他平台账号
      data20;   // 其他平台账号的设置

  var storageKey = 'user';
  var resource1 = $resource(APIUrl + '&a=update_pwd');
  var resource2 = $resource(APIUrl + '&a=get_area');
  var resource3 = $resource(APIUrl + '&a=reset_pwd');
  var resource4 = $resource(APIUrl + '&a=update_email');
  var resource5 = $resource(APIUrl + '&a=update_qq');
  var resource7 = $resource(APIUrl + '&a=get_tbaccount');
  var resource8 = $resource(APIUrl + '&a=get_address');
  var resource9 = $resource(APIUrl + '&a=update_address');
  var resource10 = $resource(APIUrl + '&a=update_identity');
  var resource11 = $resource(APIUrl + '&a=send_email_code');
  var resource12 = $resource(APIUrl + '&a=update_phone');
  var resource13 = $resource(APIUrl + '&a=bind_tb_info');
  var resource14 = $resource(APIUrl + '&a=setdefault');
  var resource15 = $resource(APIUrl + '&a=bind_del_tb');
  var resource16 = $resource(APIUrl + '&a=get_bank_info');      // 平台支持的提现银行
  var resource17 = $resource(APIUrl + '&a=bind_alipay_info');   // 后台绑定支付宝
  var resource18 = $resource(APIUrl + '&a=bind_bank_info');
  var resource19 = $resource(APIUrl + '&a=set_user_nickname');  // 修改用户昵称
  var resource20 = $resource(APIUrl + '&a=bind_other_account');   // 提交绑定其他平台账号
  var resource21 = $resource(APIUrl + '&a=get_other_shop');   // 获取其他平台账号的设置
  var resource22 = $resource(APIUrl + '&a=get_other_account');   // 其他平台账号数量
  var resource23 = $resource(APIUrl + '&a=add_qun');      // 添加群
  var resource24 = $resource(APIUrl + '&a=get_qun_lists');      // 获取群数量
  var resource25 = $resource(APIUrl + '&a=sign_qun');      // 签到群
  var re_name_attesta_config = $resource(APIUrl + '&a=get_name_setting');  // 实名认证设置

  
  var _this = this;
  return {
    // 添加群
    setAddFlock: function(userid, random, obj) {
      var self = this;
      resource23.save({
        userid:userid,
        random:random,
        qun_number:obj.number,
        qun_type:obj.level,
        qun_name:obj.name
      }, function(r) {
        self.setAddFlock.message = r;
        $rootScope.$broadcast('UserProfileFactory.setAddFlock');
      })
    },
    // 响应添加群
    getAddFlock: function() {
      return this.setAddFlock.message;
    },
    // 请求群数量
    setFlockCount: function(userid, random) {
      var self = this;
      resource24.save({
        userid:userid,
        random:random
      }, function(r) {
        self.setFlockCount.data = r;
        $rootScope.$broadcast('UserProfileFactory.setFlockCount');
      })
    },
    // 响应群数量
    getFlockCount: function() {
      return this.setFlockCount.data;
    },
    // 请求签到
    setFlockSign: function(userid, random, account) {
      var self = this;
      resource25.save({
        userid:userid,
        random:random,
        account:account
      }, function(r) {
        self.setFlockSign.message = r;
        $rootScope.$broadcast('UserProfileFactory.setFlockSign');
      })
    },
    getFlockSign: function() {
      return this.setFlockSign.message;
    },
    // 获取账号设置
    setOtherOption: function(userid, random, key) {
      var cache = StorageFactory.get(key);
      var time = Date.parse(new Date()) / 1000;
      if (cache && time - cache.time < 60 && key) {
        data20 = cache;
        $rootScope.$broadcast('UserProfileFactory.setOtherOption');
      }
      else {
        resource21.save({
          userid: userid,
          random: random
        }, function(r) {
          if (r) {
            data20 = r;
            data20.time = time;
            if (parseInt(r.status) === 1) {
              StorageFactory.set(key, data20);
            }
            $rootScope.$broadcast('UserProfileFactory.setOtherOption');
          }
        })
      }
    },
    // 返回
    getOtherOption: function() {
      return data20;
    },
    // 获取其他平台账号
    setOtherAccount: function(userid, random, key) {
      var cache = StorageFactory.get(key);
      var time = Date.parse(new Date()) / 1000;
      if (cache && time - cache.time < 60 && key) {
        data19 = cache;
        $rootScope.$broadcast('UserProfileFactory.setOtherAccount');
      }
      else {
        resource22.save({
          userid: userid,
          random: random,
        }, function(r) {
          if (r) {
            data19 = r;
            data19.time = time;
            if (parseInt(r.status) === 1) {
              StorageFactory.set('otherAccount', data19);
            }
            $rootScope.$broadcast('UserProfileFactory.setOtherAccount');
          }
        })
      }
    },
    // 返回
    getOtherAccount: function() {
      return data19;
    },
    // 提交绑定
    bindOtherAccount:function(userid, random, obj,type) {
      var self = this;
      return resource20.save({
        userid:userid,
        random:random,
        account:obj.account,
        account_img:obj.account_img,
        type:type,
      }, function(r) {
        console.log(r);
        self.bindOtherAccount.message = r;
        $rootScope.$broadcast('UserProfileFactory.bindOtherAccount');
      })
    },
    // 返回绑定结果
    getBindResult: function() {
      return this.bindOtherAccount.message;
    },
    set_update_pwd: function(oldpass, password, userid, random) {
      return resource1.save({
        old_password: oldpass,
        password: password,
        userid: userid,
        random: random
      }, function(r) {
        data1 = r;
        //console.log(data1);
        $rootScope.$broadcast('UserProfilePassword.set_update_pwd');
      });
    },
    get_update_pwd: function() {
      //console.log(data1);
      return data1;
    },

    // 获取后台收货地址联动菜单
    set_username_address: function(id) {
      return resource2.save({
        id: id
      }, function(r) {
        data2 = r.data;
        $rootScope.$broadcast('UserProfileFactory.set_username_address');
      });
    },
    get_username_address: function() {
      //console.log(user);
      return data2.data;
    },

    // 请求后台修改密码
    set_username_password: function(username, userid, password, random) {

      return resource3.save({
        username: username,
        userid: userid,
        password: password,
        random: random
      }, function(r) {
        data3 = r;
        $rootScope.$broadcast('Userforget.set_username_password');
      });

    },
    get_username_password: function() {
      //console.log(user);
      return data3;
    },

    // 请求后台认证或者修改邮箱
    set_username_email: function(email, code, userid, random) {
      return resource4.save({
        email: email,
        code: code,
        userid: userid,
        random: random
      }, function(r) {
        //console.log(r);
        data4 = r;
        $rootScope.$broadcast('UserProfileFactory.set_username_email');
      });

    },
    get_username_email: function() {
      return data4;
    },

    // 请求后台修改QQ
    set_username_qq: function(qq, userid, random) {

      return resource5.save({
        qq: qq,
        userid: userid,
        random: random
      }, function(r) {
        data5 = r;
        $rootScope.$broadcast('UserProfileFactory.set_username_qq');
      });

    },
    get_username_qq: function() {
      return data5;
    },

    // 获取用户绑定淘宝账号
    // 首先判断如果缓存不存在则请求服务器 缓存存在则读取缓存
    set_username_taobao: function(userid, random,type,refresh) {
      //获取当前用户已绑定淘宝帐号数量
      var cache = StorageFactory.get(type);
      if(typeof(type) == 'number'){
        var cache = StorageFactory.get('otherAccount');
        var temp = [];
        var lin = null;
        var count = 0;
      }
      var time = Date.parse(new Date()) / 1000;
      if(cache && time -cache.time  < 60 && !refresh){
         if(cache.status ==0){
            cache.count = 0;
            cache.lists = [];
         }
         else if (cache.data) {
          for (var item in cache.data) {
            lin = cache.data;
            if (lin.hasOwnProperty(item)) {
              delete(lin.item);
              temp.push(lin[item])
              count += 1;
            }
          }
          cache.lists = temp;
          cache.count = count;
         }
         data6 = cache;
         setTimeout(function(){
            if(type == 'wechat'){
                $rootScope.$broadcast('UserProfileFactory.set_username_weixin');
            }else{
                $rootScope.$broadcast('UserProfileFactory.set_username_taobao');
            }
        },1);
      }else{
        resource7.save({
          userid: userid,
          random: random,
          type:type
        }, function(r) {
          if(!r.count) r.count = 0;
          data6 = r;
          data6.time = time;
          StorageFactory.set(type, data6); //淘宝帐号写入缓存
          if(type == 'wechat'){
              $rootScope.$broadcast('UserProfileFactory.set_username_weixin');
          }else{
              $rootScope.$broadcast('UserProfileFactory.set_username_taobao');
          }

        });
      }
    },
        //用于绑定淘宝帐号 重新发起请求获取最新淘宝账号及
    set_username_taobao2: function(userid, random,type,refresh) {
           //获取当前用户已绑定淘宝帐号数量
             resource7.save({
             userid: userid,
             random: random,
             type:type
           }, function(r) {
             data6 = r;
             StorageFactory.set('taobao', data6); //淘宝帐号写入缓存
             if(type == 'wechat'){
                 $rootScope.$broadcast('UserProfileFactory.set_username_weixin');
             }else{

                 $rootScope.$broadcast('UserProfileFactory.set_username_taobao');
             }
             
           });
    },
    get_username_taobao: function() {
      return data6;
      //console.log(data6);
    },
    get_username_weixin: function() {
      return data6;
      //console.log(data6);
    },
    // 获取用户收货地址详细信息
    set_username_Profile_address: function(userid, random) {

      return resource8.save({
        userid: userid,
        random: random
      }, function(r) {
        data7 = r;
        $rootScope.$broadcast('UserProfileFactory.set_username_Profile_address');
      });

    },


    get_username_Profile_address: function() {

      return data7;
    },


    // 后台请求修改用户收货地址
    set_username_Profile_edit_address: function(r1, r2, r3, r4, r5, r6, userid, random) {

      return resource9.save({
        province: r1,
        city: r2,
        area: r3,
        r_address: r4,
        r_name: r5,
        r_phone: r6,
        userid: userid,
        random: random
      }, function(r) {
        data9 = r;
        $rootScope.$broadcast('UserProfileFactory.set_username_Profile_edit_address');
      });

    },
    get_username_Profile_edit_address: function() {

      return data9;

    },

    get_name_attesta_config:function(userid, random) {
      var cache = StorageFactory.get('get_name_attesta_config');
      var time = Date.parse(new Date()) / 1000;
      var temp_f = function(value) {
        $rootScope.$broadcast('configFactory.get_name_attesta_config', value);
      }
      if (cache && time - cache.time < 3600) {
        $rootScope.setTimeout(temp_f, cache);
      }
      else {
        re_name_attesta_config.save({
          userid:userid,
          random:random
        }, function(result) {
          if (result) {
            if (result.status == 1) {
              result.time = time;
              StorageFactory.set('get_name_attesta_config',result);
            }
            $rootScope.setTimeout(temp_f, result);
          }
        })
      }
    },

    // 后台请求实名认证信息
    set_username_Profile_edit_identity: function(name, id_number,  face_img, back_img,person_img, sex, year, month, day, age, userid, random) {
      return resource10.save({
        name: name, //姓名
        id_number: id_number, //身份证
        person_img: person_img, //手持照片
        face_img: face_img, //身份证正面
        back_img: back_img, //身份证反面
        sex: sex, //性别 
        year: year, // 出生男
        month: month, //生日 月
        day: day, //出生日
        age: age, //年龄
        userid: userid,
        random: random
      }, function(r) {
        //console.log(r);
        data10 = r;
        $rootScope.$broadcast('UserProfileFactory.set_username_Profile_edit_identity');
      });

    },
    get_username_Profile_edit_identity: function() {
      return data10;
    },

    // 后台请求发送邮箱验证码
    set_send_email_code: function(account, title, userid, random) {

      return resource11.save({
        account: account,
        title: title, //姓名
        userid: userid,
        random: random
      }, function(r) {
        //console.log(r);
        data11 = r;
        $rootScope.$broadcast('UserProfileFactory.set_send_email_code');
      });

    },
    get_send_email_code: function() {

      return data11;

    },

    // 后台请求修改用户绑定手机
    set_edit_phone: function(phone, code, userid, random) {

      return resource12.save({
        phone: phone, //姓名
        code: code,
        userid: userid,
        random: random
      }, function(r) {
        //console.log(r);
        data12 = r;
        $rootScope.$broadcast('UserProfileFactory.set_edit_phone');
      });

    },
    get_edit_phone: function() {
      return data12;
    },

    // 后台请求绑定淘宝账号
    set_bind_taobao: function(account, userid, random,type,xinyu,friend_number,img, data) {
      var _this = this;
      return resource13.save({
	      account: account,
	      userid: userid,
	      random:random,
	      bLevel: xinyu,
	      type  :type,
	      taobao_img :img['user_img'],
	      jingxiang_img: img['jingxiang_img'],
	      user_status_img: img['user_status_img'],
	      lous_status_img: img['lous_status_img'],
	      name_img: img['name_img'],
	      jingxiang: data['jingxiang'],
	      zhima_img: img['zhima_img'],
	      taoqizhi_img: img['taoqizhi_img'],
	      zhima: data['zhima'],
	      taoqizhi: data['taoqizhi'],
	      friend: friend_number
      }, function(r) {
        //更新绑定帐号缓存
        _this.set_username_taobao(userid,random,type,true);
        data13 = r;
        $rootScope.$broadcast('UserProfileFactory.set_bind_taobao');
      });
    },
    get_bind_taobao: function() {
      return data13;
    },

    // 后台请求设置默认淘宝账号
    set_bind_taobao_setdefault: function(id, userid, random,type) {
      var _this = this;
      return resource14.save({
        id: id,
        userid: userid,
        random: random,
        type:type,
      }, function(r) {
        //更新绑定帐号缓存
        _this.set_username_taobao(userid,random,type,true);
        data13 = r;
        $rootScope.$broadcast('UserProfileFactory.set_bind_taobao_setdefault');
      });

    },
    get_bind_taobao_setdefault: function() {
      return data13;
    },

    // 后台请求解绑淘宝账号
    set_bind_del_tb: function(id, userid, random) {
      var _this = this;
      return resource15.save({
        id: id,
        userid: userid,
        random: random
      }, function(r) {
        //更新绑定帐号缓存
        _this.set_username_taobao(userid,random,'taobao',true);
        _this.set_username_taobao(userid,random,'wechat',true);
        data15 = r;
        $rootScope.$broadcast('UserProfileFactory.set_bind_del_tb');
      });

    },
    get_bind_del_tb: function() {

      return data15;

    },

    // 后台请求获得平台支持的提现银行
    get_bank_info: function(id, userid, random) {

      return resource16.save({

      }, function(r) {
        //console.log(r);
        data16 = r;
        //   $rootScope.$broadcast('UserProfileFactory.set_bind_bank_info');
      });

    },

    // 提交后台绑定支付宝
    set_bind_alipay_info: function(account, userid, random) {
      return resource17.save({
        account: account,
        userid: userid,
        random: random
      }, function(r) {
        //console.log(r);
        data17 = r;
        $rootScope.$broadcast('UserProfileFactory.set_bind_alipay_info');
      });

    },
    get_bind_alipay_info: function() {

      return data17;

    },

    // 提交后台绑定银行卡
    set_bind_bank_info: function(account, bank_name, sub_branch, province, area, city, userid, random) {

      return resource18.save({
        account: account,
        bank_name: bank_name, //所属银行id
        sub_branch: sub_branch, //支行地址
        province: province, // 省
        city: city, //市
        area: area, //县
        userid: userid,
        random: random
      }, function(r) {
        //console.log(r);
        data17 = r;
        $rootScope.$broadcast('UserProfileFactory.set_bind_bank_info');
      });

    },
    get_bind_bank_info: function() {

      return data17;

    },

    // 提交后台x修改昵称 头像
    set_nickname: function(userid,random,nickname,user_avatar,sex) {
      resource19.save({
        userid: userid,
        random: random,
        nickname:nickname,
        user_avatar:user_avatar,
        sex:sex,
      }, function(r) {
        data18 = r;
        $rootScope.$broadcast('UserProfileFactory.set_nickname');
      });
    },
    get_nickname: function() {
      return data18;
    }


  };

}])

/*
 name  用户提现
 */

.factory('UserDepositeFactory', ['$resource', '$rootScope', 'ENV',function($resource, $rootScope, ENV) {
  var APIUrl = ENV.api,
    data, //获取绑定的银行卡
    data2, //获取提现后台配置
    data3; //处理用户提现
  var data4 = {}; //获取历史提现记录
  var resource1 = $resource(APIUrl + '&a=get_useraccount');
  var resource2 = $resource(APIUrl + '&a=cash_config_info');
  var resource3 = $resource(APIUrl + '&a=person_cash');
  var resource4 = $resource(APIUrl + '&a=getusercashlog');

  return {

    // 获取用户绑定的银行卡和支付宝
    set_useraccount: function(userid,random) {

      return resource1.save({
        userid: userid,
        random:random
      }, function(r) {
        //console.log(r);
        data = r;
        $rootScope.$broadcast('UserDepositeFactory.set_useraccount');
      });

    },
    get_useraccount: function() {

      return data;

    },

    // 获取后台提现配置
    set_cash_config_info: function() {
      return resource2.get({}, function(r) {
        data2 = r;
        $rootScope.$broadcast('UserDepositeFactory.set_cash_config_info');
      });

    },
    get_cash_config_info: function() {

      return data2.data;

    },

    // 获取后台提现配置
    set_person_cash: function(money,type,userid, random) {
      return resource3.save({
        money: money,
        type: type,
        userid: userid,
        random: random
      }, function(r) {
        data3 = r;
        $rootScope.$broadcast('UserDepositeFactory.set_person_cash');
      });
    },
    get_person_cash: function() {

      return data3;

    },
    // 获取用户历史提现记录 第一页
    set_getusercashlog: function(userid, random) {
      return resource4.get({
        userid: userid,
        random: random
      }, function(r) {

        var hasNextPage = true;

        if (!r.lists || r.lists.length < 10) { //来判断是否有下一页数据
          hasNextPage = false;
        }

        data4['data'] = r.lists;
        data4['hasNextPage'] = hasNextPage;
        data4['page'] = 1;

        $rootScope.$broadcast('UserDepositeFactory.set_getusercashlog');
      });

    },
    //  获取提现记录
    get_getusercashlog: function() {

      return data4['data'];

    },
    // 上拉加载更多
    txjl_loadMore: function(userid, random) {

      //判断数据是否为空
      if (data4['data'] === undefined) {
        return false;
      }

      data4['page']++;


      var nextPage = data4['page'];

      resource4.get({
        userid: userid,
        random: random,
        page: data4['page']
      }, function(r) {

        //console.log(r.lists.length);
        var hasNextPage = true;

        if (!r.lists || r.lists.length < 10) { //来判断是否有下一页数据
          hasNextPage = false;
        }

        //console.log(data4.data);
        data4 = {
          'hasNextPage': hasNextPage,
          'page': nextPage,
          'data': data4['data'].concat(r.lists)
        };

        //console.log(data4);

        $rootScope.$broadcast('UserDepositeFactory.set_getusercashlog');

      });

    },
    // 获取是否有下一页数据

    hasNextPage: function() {

      //判断数据是否为空
      if (data4['hasNextPage'] == undefined) {
        return false;
      }

      return data4['hasNextPage'];

    }
  }


}])

/*
 name  账户明细
 */


.factory('UserLogFactory', ['$resource', '$rootScope', 'ENV',function($resource, $rootScope, ENV) {

  var APIUrl = ENV.api;

  var data_log = {};

  var resource = $resource(APIUrl + '&a=getfinancelog');

  return {

    // 获取账户明细第一页
    set_user_log: function(type_id, userid, random) {

      type = type_id;
      return resource.get({
        type: type,
        userid: userid,
        random: random
      }, function(r) {

        var hasNextPage = true;

        if (!r.lists || r.lists.length < 10) {

          hasNextPage = false;
        }

        data_log = {
          page: 1,
          data: r.lists,
          hasNextPage: hasNextPage
        }
        $rootScope.$broadcast('UserLogFactory.set_user_log');
      });


    },

    get_user_log: function() {

      if (!data_log) {
        return false;

      }

      return data_log.data;

    },
    // 上拉加载更多
    zhmx_loadMore: function(userid, random) {

      //判断数据是否为空
      if (data_log['data'] === undefined) {
        return false;
      }

      //console.log(data_log['page'])
      data_log['page']++;


      var nextPage = data_log['page'];

      resource.get({
        type: type,
        userid: userid,
        random: random,
        page: data_log['page']
      }, function(r) {

        if (r.lists.length == 0) return false;
        //console.log(r);
        var hasNextPage = true;

        if (!r.lists || r.lists.length < 10) { //来判断是否有下一页数据
          hasNextPage = false;
        }

        data_log = {
          'hasNextPage': hasNextPage,
          'page': nextPage,
          'data': data_log['data'].concat(r.lists)
        };

        //console.log(data_log);

        $rootScope.$broadcast('UserLogFactory.set_user_log');

      });

    },

    // 获取是否有下一页数据
    hasNextPage: function() {

      //判断数据是否为空
      if (data_log['hasNextPage'] == undefined) {
        return false;
      }

      return data_log['hasNextPage'];

    }


  }

}])

.factory('trialOrderFactory', ['$resource', '$rootScope', 'ENV',function($resource, $rootScope, ENV) {
  var APIUrl = ENV.api;
  var data_apply_order;
  var data_apply_weixin_order;
  var data_up_weixin_img;
  var data_user_orderlists = {};
  var data_fill_order_sn;
  var data_order_log;
  var data_sybg;
  var data_close_order_sn;
  var data_order_info_one;
  var data_appeal_order;
  var data_apply_rebate;
  var data_shai_report;
  var data_is_join;
  var data_vip_apply_order;
  var data_point_apply_order;
  var data_task_answer;
  var data_set_is_join_borke;
  var data_exchange;
  var shop_log;
  var complete_order;
  var commission_pay;
  var set_data_submit;
  var comment_info;
  var test_url;


  var resource1 = $resource(APIUrl + '&a=apply_order');
  var resource2 = $resource(APIUrl + '&a=getorderlists');
  var resource3 = $resource(APIUrl + '&a=fill_order_sn'); //填写订单号
  var resource4 = $resource(APIUrl + '&a=order_log'); //获得订单日志
  var resource5 = $resource(APIUrl + '&a=fill_trial_report'); //填写试用报告
  var resource6 = $resource(APIUrl + '&a=close_order_sn'); //关闭申请。
  var resource7 = $resource(APIUrl + '&a=order_info_one'); //获取单个订单详情
  var resource8 = $resource(APIUrl + '&a=appeal_order'); //会员申诉
  var resource9 = $resource(APIUrl + '&a=apply_rebate_order'); //返利抢购
  var resource10 = $resource(APIUrl + '&a=shai_report'); //返利抢购
  var resource11 = $resource(APIUrl + '&a=is_join'); //获取是否参与过
  var resource12 = $resource(APIUrl + '&a=vip_apply_order'); //使用vip免审特权
  var resource13 = $resource(APIUrl + '&a=point_apply_order'); //使用积分兑换特权
  var resource14 = $resource(APIUrl + '&a=answer_task'); //提交日赚任务
  var resource15 = $resource(APIUrl + '&a=is_join_borke'); //是否曾经参与过日赚任务
  var resource16 = $resource(APIUrl + '&a=is_join_exchange'); //是否曾经兑换过本商品
  var resource17 = $resource(APIUrl + '&a=exchange'); //提交后台兑换商品
  var resource18 = $resource(APIUrl + '&a=get_shop_log'); //获取积分兑换商品记录
  var resource19 = $resource(APIUrl + '&a=complete_order'); //获取用户完成试用订单数量
  var resource20 = $resource(APIUrl + '&a=commission_pay_submit'); //闪电试用抢购
  var resource21 = $resource(APIUrl + '&a=get_comment_info'); //闪电试用抢购
  var resource22 = $resource(APIUrl + '&a=apply_weixin_order');
  var resource23 = $resource(APIUrl + '&a=up_weixin_img');
  var resource24 = $resource(APIUrl + '&a=test_goods_url');
  return {

    //处理免费试用订单申请
    apply_order: function(goodsid, bind_taobao_id, talk_content, userid, random) {
      resource1.save({
        goods_id: goodsid,
        bind_taobao: bind_taobao_id,
        talk_content: talk_content,
        userid: userid,
        random: random
      }, function(r) {

        data_apply_order = r;
        //console.log(r);
        $rootScope.$broadcast('trialOrderFactory.apply_order');
      });

    },

    //处理免费试用 vip申请
    vip_apply_order: function(goodsid, bind_taobao_id, talk_content, userid, random) {
      resource12.save({
        goods_id: goodsid,
        bind_taobao: bind_taobao_id,
        talk_content: talk_content,
        userid: userid,
        random: random
      }, function(r) {

       data_vip_apply_order = r;
        //console.log(r);
       $rootScope.$broadcast('trialOrderFactory.vip_apply_order');
      });

    },

     //处理免费试用 积分兑换资格
     point_apply_order: function(goodsid, bind_taobao_id, talk_content, userid, random) {
       resource13.save({
         goods_id: goodsid,
         bind_taobao: bind_taobao_id,
         talk_content: talk_content,
         userid: userid,
         random: random
       }, function(r) {

        data_point_apply_order = r;
        $rootScope.$broadcast('trialOrderFactory.point_apply_order');
       });

     },

    get_apply_order: function() {
      if (data_apply_order == undefined) return false;
      return data_apply_order;

    },

    get_vip_apply_order: function() {
      if(!data_vip_apply_order) return false;
      return data_vip_apply_order;

    },

    get_point_apply_order: function() {
      if(!data_point_apply_order) return false;
      return data_point_apply_order;

    },


    // 获取我的试用订单 第一页数据
    set_getorderlists: function(userid, mod, status, random) {

      resource2.save({
        userid: userid,
        mod: mod,
        status: status,
        random: random
      }, function(r) {

        var hasNextPage = true; //是否有下一页
        //获取是否有分页
        if (!r.lists || r.lists.length < 10) hasNextPage = false;

        data_user_orderlists = {
          data: r.lists,
          page: 1,
          hasNextPage: hasNextPage

        }
        //console.log(data_user_orderlists);
        $rootScope.$broadcast('trialOrderFactory.set_getorderlists');
      });


    },

    //接收我的订单数据
    get_getorderlists: function() {
      if (data_user_orderlists == undefined || data_user_orderlists.length < 1) return false;
      return data_user_orderlists['data'];

    },

    //获取我的订单 上拉加载更多
    wdsy_loadMore: function(userid, mod, status, random) {

      data_user_orderlists.page++;
      resource2.save({
          userid: userid,
          mod: mod,
          status: status,
          random: random,
          page: data_user_orderlists.page

        }, function(r) {

          //console.log(r);
          var hasNextPage = true; //是否有下一页
          //获取是否有分页
          if (!r.lists || r.lists.length < 10) {
            hasNextPage = false;
          }

          //console.log(hasNextPage);

          data_user_orderlists = {
            data: data_user_orderlists.data.concat(r.lists),
            page: data_user_orderlists.page,
            hasNextPage: hasNextPage

          }

          //console.log(data_user_orderlists);
          $rootScope.$broadcast('trialOrderFactory.set_getorderlists');


        }

      )
    },

    //获取我的订单是否有下一页数据

    get_wdsy_hasNextPage: function() {
      return data_user_orderlists.hasNextPage;
    },


    //获取单个订单详情
    set_order_info: function(order_id, userid, random) {

      resource7.save({
        order_id: order_id,
        userid: userid,
        random: random
      }, function(r) {

        data_order_info_one = r;
        //  //console.log(r);

        $rootScope.$broadcast('trialOrderFactory.set_order_info');
      });


    },

    //获取单个订单详情结果
    get_order_info: function() {
      return data_order_info_one.data;

    },


    //填写订单号请求
    set_fill_order_sn: function(order_id, order_sn, userid, random,order_img,sybg_vm) {
      resource3.save({
        order_id: order_id,
        order_sn: order_sn,
        userid: userid,
        random: random,
        order_img:order_img,
        sybg_vm:sybg_vm,
      }, function(r) {
        data_fill_order_sn = r;
        $rootScope.$broadcast('trialOrderFactory.set_fill_order_sn');
      });
    },
    //接收填写订单号结果数据
    get_fill_order_sn: function() {
      if (data_fill_order_sn == undefined) return false;
      return data_fill_order_sn;
    },
    
    //验证用户输入的url地址是否正确
    set_test_url: function(url,url2) {
      resource24.save({
        url: url,
        url2:url2,
      }, function(r) {
        test_url = r;
        $rootScope.$broadcast('trialOrderFactory.test_url');
      });
    },
    //接收url验证结果
    get_test_url: function() {
      return test_url;
    },

    //接收填写订单号结果数据
    get_fill_order_sn: function() {
      if (data_fill_order_sn == undefined) return false;
      return data_fill_order_sn;
    },


    //获取当前的订单日志

    set_order_log: function(orderid, userid, random) {
      resource4.save({
        order_id: orderid,
        userid: userid,
        random: random
      }, function(r) {
        //console.log(r);
        data_order_log = r;
        $rootScope.$broadcast('trialOrderFactory.set_order_log');
      });

    },

    //接收订单日志返回结果,
    get_order_log: function() {

      return data_order_log.data;
    },

    //填写试用报告              订单id  星星 内容    
    set_trial_report: function(order_id, star, img,content, userid, random) {

      resource5.save({
        order_id: order_id,
        star: star,
        thumb:img,
        content: content,
        userid: userid,
        random: random
      }, function(r) {

        data_sybg = r;
        //console.log(r);

        $rootScope.$broadcast('trialOrderFactory.set_trial_report');
      });

    },

    //获取试用报告
    get_trial_report: function() {
      return data_sybg;
    },


    //关闭试用申请
    set_close_order_sn: function(order_id, userid, random) {

      resource6.save({
        order_id: order_id,
        userid: userid,
        random: random
      }, function(r) {
        //console.log(r);

        data_close_order_sn = r;

        $rootScope.$broadcast('trialOrderFactory.set_close_order_sn');
      });

    },

    //获取关闭试用申请 结果
    get_close_order_sn: function() {

      return data_close_order_sn;
    },

    //申诉订单
    set_appeal_order: function(order_id, goods_id, appeal_type, buyer_cause, img1, img2, img3, buyer_phone, buyer_qq, userid, random) {

      buyer_imgs_url = {
        img1: img1,
        img2: img2,
        img3: img3

      };

      resource8.save({
        order_id: order_id,
        goods_id: goods_id,
        buyer_imgs_url: buyer_imgs_url,
        appeal_type: appeal_type,
        buyer_cause: buyer_cause,
        buyer_phone: buyer_phone,
        buyer_qq: buyer_qq,
        userid: userid,
        random: random
      }, function(r) {
        //console.log(r);
        data_appeal_order = r;
        $rootScope.$broadcast('trialOrderFactory.set_appeal_order');
      });

    },
    //获得申诉订单结果
    get_appeal_order: function() {

      return data_appeal_order;
    },

    //购物返利抢购商品
    set_apply_rebate_order: function(aid, userid, random) {

      resource9.save({
        goods_id: aid,
        userid: userid,
        random: random
      }, function(r) {

        data_apply_rebate = r;

        $rootScope.$broadcast('trialOrderFactory.set_apply_rebate_order');
      });

    },

    //获取关闭试用申请 结果
    get_apply_rebate: function() {

      return data_apply_rebate;
    },


   //填写晒单 
   set_shai_report: function(order_id,report_imgs,content, userid, random) {

     resource10.save({
       order_id: order_id,
       report_imgs: report_imgs,
       content: content,
       userid: userid,
       random: random
     }, function(r) {

    //   data_sybg = r;
       //console.log(r);

       data_shai_report = r;

       $rootScope.$broadcast('trialOrderFactory.set_shai_report');
     });

   },

   //获取晒单
   get_shai_report: function() {

     return data_shai_report;
   },

   //获取会员是否参与过 
   
   set_order_is_join: function(goods_ID,userid,random) {
     resource11.save({
       goods_id: goods_ID,
       userid: userid,
       random: random
     }, function(r) {
       data_is_join = r;
       $rootScope.$broadcast('trialOrderFactory.set_order_is_join');
     });

   },

   get_order_is_join: function() {

     return data_is_join;

   },
    
    //日赚任务填写答案
    set_answer_task: function(goods_ID,content,userid,random) {
      resource14.save({
              id: goods_ID,
         content: content,
        userid: userid,
        random: random
      }, function(r) {
        data_task_answer = r;
        $rootScope.$broadcast('trialOrderFactory.set_answer_task');
      });

    },

    get_answer_task: function() {

      return data_task_answer;

    },

    //获取当前会员是否参与过日赚任务
    set_is_join_borke: function(taskid,userid,random) {
      resource15.save({
        taskid: taskid,
        userid: userid,
        random: random
      }, function(r) {
        data_set_is_join_borke = r;
        $rootScope.$broadcast('trialOrderFactory.set_is_join_borke');
      });

    },

    get_is_join_borke: function() {

      return data_set_is_join_borke;

    },

    //获取当前会员是否兑换过当前积分商品
    set_shop_exchange: function(id,userid,random) {
      resource16.save({
            id: id,
        userid: userid,
        random: random
      }, function(r) {
        data_set_is_join_borke = r;
        $rootScope.$broadcast('trialOrderFactory.set_shop_exchange');
      });

    },

    get_is_join_borke: function() {
      return data_set_is_join_borke;
    },

    //积分商品兑换商品
    set_exchange:function(id,spec,userid,random) {
      resource17.save({
            id: id,
          spec:spec,
        userid: userid,
        random: random
      }, function(r) {
        //console.log(r);
       data_exchange = r;
        $rootScope.$broadcast('trialOrderFactory.set_exchange');
      });

    },

    get_exchange: function() {
      return data_exchange;
    },

    //获取积分兑换记录
    set_shop_log:function(userid,random,status) {
      shop_log = shop_log || {};
      if (!shop_log.page) {
        shop_log.page = 1;
      }
      resource18.save({
        page: 1,
        userid: userid,
        random: random,
        status:status
      }, function(r) {
        shop_log.data = r.data;
        if (r && r.data) {
          shop_log.hasNextPage = true;
          if (typeof r.data === 'object' && r.data.length < 10) {
            shop_log.hasNextPage = false;
          }
        }
        else {
          shop_log.hasNextPage = false;
        }
        $rootScope.$broadcast('trialOrderFactory.set_shop_log');
      });
    },
    loadMore_shop_log:function(userid, random, status) {
      resource18.save({
        page: shop_log.page || 1,
        userid: userid,
        random: random,
        status:status
      }, function(r) {
        shop_log.data = r.data;
        if (r && r.data) {
          shop_log.page += 1;
          shop_log.hasNextPage = true;
          if (typeof r.data === 'object' && r.data.length < 10) {
            shop_log.hasNextPage = false;
          }
          else {
            shop_log.hasNextPage = false;
          }
        }
        $rootScope.$broadcast('trialOrderFactory.set_shop_log');
      });
    },
    reset_shop_log:function() {
      shop_log.page = 1;
    },
    get_shop_logHasNext:function() {
      return shop_log.hasNextPage;
    },
    get_shop_log: function() {
      return shop_log.data;
    },

    //获取用户已完成的试用订单
    set_complete_order:function(userid,random) {
      resource19.save({
        userid: userid,
        random: random,
        status:status
      }, function(r) {
        complete_order = r;
        //console.log(r);
        $rootScope.$broadcast('trialOrderFactory.set_complete_order');
      });

    },

    get_complete_order: function() {

      return complete_order.data;

    },

    //闪电试用抢购
    set_commission_pay_submit:function(goods_id,taobao,userid,random) {
      resource20.save({
      goods_id:goods_id,
      taobao:taobao,
        userid: userid,
        random: random,
        status:status
      }, function(r) {
        set_data_submit = r;
        //console.log(r);
        $rootScope.$broadcast('trialOrderFactory.set_commission_pay_submit');
      });

    },

    get_commission_pay_submit: function() {

      return set_data_submit;
    },
    //获取指定评论截图
    set_comment_info:function(id) {
      resource21.save({
      comment_id:id,
      }, function(r) {
        comment_info = r;
        //console.log(r);
        $rootScope.$broadcast('trialOrderFactory.set_comment_info');
      });
    },
    get_comment_info:function() {
      return comment_info;
    },

    //处理微信推广活动申请
    apply_weixin_order: function(goodsid, bind_weixin_id, talk_content, userid, random) {
      resource22.save({
        goods_id: goodsid,
        bind_weixin: bind_weixin_id,
        talk_content: talk_content,
        userid: userid,
        random: random
      }, function(r) {
        data_apply_weixin_order = r;
        $rootScope.$broadcast('trialOrderFactory.apply_weixin_order');
      });

    },
    get_apply_weixin_order:function() {
      return data_apply_weixin_order;
    },
    //上传微信推广活动分享截图
    up_weixin_img: function(order_id,img,img2,userid,random) {
      resource23.save({
        order_id:order_id,
        img:img,
        img2:img2,
        userid: userid,
        random: random
      }, function(r) {
        data_up_weixin_img = r;
        $rootScope.$broadcast('trialOrderFactory.up_weixin_img');
      });

    },
    get_up_weixin_img:function() {
      return data_up_weixin_img;
    },


  }
}])

/*
 name  日赚任务
 */

.factory('TaskFactory', ['$resource', '$rootScope', 'ENV',function($resource, $rootScope, ENV) {

   var data_task_lists = {};
   var data_user_borke;
   var APIUrl = ENV.api;
   var data_task_show;

   var resource1 = $resource(APIUrl + '&a=broke_list');
   var resource2 = $resource(APIUrl + '&a=get_user_borke');
   var resource3 = $resource(APIUrl + '&a=broke_show');

   return {

        //获取日赚任务列表 第一页
        set_broke_list: function(orderby,state) {

          resource1.get({
            orderby:orderby,
            orderway:'DESC',
              state:state,
               page: 1
          }, function(r) {

            //console.log(r);
            var hasNextPage = true; //是否有下一页
            //获取是否有分页
            if (!r.lists || r.lists.length < 10) hasNextPage = false;

            data_task_lists = {
              data: r.lists,
              page: 1,
              hasNextPage: hasNextPage

              };
            $rootScope.$broadcast('TaskFactory.set_broke_list');
          });

        },

        //获取日赚任务 上拉加载更多日赚任务
        task_loadMore: function(orderby,state) {
          data_task_lists['page'] = data_task_lists['page'] || 1;
          data_task_lists['page']++;
          resource1.get({
            orderby:orderby,
            orderway:'DESC',
              state:state,
               page: data_task_lists.page
          }, function(r) {

              //console.log(r);
              var hasNextPage = true; //是否有下一页
              //获取是否有分页
              if (!r.lists || r.lists.length < 10) {
                hasNextPage = false;
              }

              //console.log(hasNextPage);

              data_task_lists = {
                data: data_task_lists.data.concat(r.lists),
                page: data_task_lists.page,
                hasNextPage: hasNextPage

              }
            $rootScope.$broadcast('TaskFactory.set_broke_list');


            }

          )
        },

        //获取我的订单是否有下一页数据

        task_hasNextPage: function() {
          if(!data_task_lists.hasNextPage) return false;
          return data_task_lists.hasNextPage;

        },

        //获取日赚列表结果
        get_broke_list: function() {

          return data_task_lists.data;
        },

        //获取单个用户的日赚任务
        
        set_user_borke: function(userid,random) {

          resource2.save({
              userid:userid,
              random:random
          }, function(r) {

           data_user_borke = r;

            $rootScope.$broadcast('TaskFactory.set_user_borke');
          });

        },

        //获取日赚列表结果
        get_user_borke: function() {

          return data_user_borke;
        },

      // 获取日赚任务详情
      set_broke_show: function(id) {

        resource3.get({
             id:id
        }, function(r) {
          //console.log(r);
          data_task_show =r;
          $rootScope.$broadcast('TaskFactory.set_broke_show');
        });

      },

      get_broke_show: function() {

        return data_task_show.lists;

      }

   }

}])

.factory('integralFactory', ['$resource', '$rootScope', 'ENV',function($resource, $rootScope, ENV) {

  var APIUrl = ENV.api;
  var data_shop_lists;
  var data_show_shop;

  var resource1 = $resource(APIUrl + '&a=shop_lists');
  var resource2 = $resource(APIUrl + '&a=shop_show');

   return {
    //获取积分商城商品 第一页
    set_shop_lists:function(orderby,state) {

      resource1.get({
           page: 1
      }, function(r) {

        //console.log(r);
        var hasNextPage = true; //是否有下一页
        //获取是否有分页
        if (!r.lists || r.lists.length < 10) hasNextPage = false;

        data_shop_lists = {
          data: r.lists,
          page: 1,
          hasNextPage: hasNextPage
          };
          $rootScope.$broadcast('integralFactory.set_shop_lists');
      });

    },
    //获取获取积分商城商品 上拉加载更多
    shop_loadMore: function(orderby,state) {
      data_shop_lists['page'] ++;   
      resource1.get({
        orderby:orderby,
        orderway:'DESC',
           page: data_shop_lists.page
      }, function(r) {

          //console.log(r);
          var hasNextPage = true; //是否有下一页
          //获取是否有分页
          if (!r.lists || r.lists.length < 10) {
            hasNextPage = false;
          }

          //console.log(hasNextPage);

          data_shop_lists = {
            data: data_shop_lists.data.concat(r.lists),
            page: data_shop_lists.page,
            hasNextPage: hasNextPage

          }
          $rootScope.$broadcast('integralFactory.set_shop_lists');
        }

      )
    },

    get_shop_list:function(){


      return data_shop_lists.data;
    },

    //获取是否有下一页
    
    shop_hasNextPage:function(){

      return data_shop_lists.hasNextPage;
    },

    // 获取积分商品详情
    set_shop_show: function(id) {

      resource2.get({
           id:id
      }, function(r) {
        //console.log(r);
        data_show_shop = r;
        $rootScope.$broadcast('integralFactory.set_shop_show');
      });

    },

    get_shop_show: function() {

      return data_show_shop.data;

    }
    
    
   }

}])

//推荐好友

.factory('invitationFactory', ['$resource', '$rootScope', 'ENV',function($resource, $rootScope, ENV) {

  var APIUrl    = ENV.api;
  var data_order_by_friend;
  var data_recommend_total_moeny;
  var data_recommend_friend;

  var resource1 = $resource(APIUrl + '&a=recommend_total_moeny');      // recommend_total_moeny
  var resource2 = $resource(APIUrl + '&a=recommend_friend');          //推荐好友记录
  var resource3 = $resource(APIUrl + '&a=order_by_friend');          //推荐好友排行榜

   return {

    //获取已邀请的好友的记录
    set_recommend_friend:function(userid,random){

      resource2.save({
           userid:userid,
           random:random
      }, function(r) {
          data_recommend_friend =r;
          $rootScope.$broadcast('invitationFactory.set_recommend_friend');
      });

    },

    get_recommend_friend:function(){

      return data_recommend_friend;

    },

    //获取推荐好友获得的总金额
    
    set_recommend_total_moeny: function(userid,random) {

      resource1.save({
           userid:userid,
           random:random
      }, function(r) {

        data_recommend_total_moeny = r;
        $rootScope.$broadcast('invitationFactory.set_recommend_total_moeny');
      });

    },

    get_recommend_total_moeny: function() {

      return data_recommend_total_moeny;

    },
    
    //推荐好友排行榜
    set_order_by_friend: function(userid,random) {

      resource3.get({

      }, function(r) {

        data_order_by_friend = r;
        $rootScope.$broadcast('invitationFactory.set_order_by_friend');
      });

    },

    get_order_by_friend: function() {
      return data_order_by_friend;

    }
    
   }

}])


//大转盘

.factory('jiangFactory', ['$resource', '$rootScope', 'ENV',function($resource, $rootScope, ENV) {

  var APIUrl    = ENV.api;
  var reward_list;
  var get_user_reward_list;
  var data_lottery;
  var user_reward_cishu;


 // var resource1 = $resource(APIUrl + '&a=get_reward_config');      // 获取大转盘设置
  var resource2 = $resource(APIUrl + '&a=reward_list');          // 获取最新抽奖记录
  var resource3 = $resource(APIUrl + '&a=lottery');      //去后台抽奖
  var resource4 = $resource(APIUrl + '&a=user_reward_list');
  var resource5 = $resource(APIUrl + '&a=user_reward_cishu');

   return {

    //获取最新的抽奖记录
    set_reward_list:function(userid,random){

      resource2.get({
      }, function(r) {
        reward_list = r;
          //console.log(r)
          $rootScope.$broadcast('jiangFactory.set_reward_list');
      });

    },

    get_reward_list:function(){

      return reward_list.data;

    },

    //获取当前会员的中奖记录
    set_user_reward_list:function(userid,random){
      resource4.save({
        userid:userid,
        random:random

      }, function(r) {
        get_user_reward_list = r;
          //console.log(r)
          $rootScope.$broadcast('jiangFactory.set_user_reward_list');
      });

    },
    get_user_reward_list:function(){
      return get_user_reward_list.data;
    },

    //发起后台抽奖请求
    set_lottery:function(userid,random){
      resource3.save({
         userid:userid,
         random:random
      }, function(r) {
        data_lottery = r;
         // //console.log(r)
          $rootScope.$broadcast('jiangFactory.set_lottery');
      });
    },

    get_lottery:function(){
      return data_lottery;
    },

    //统计剩余次数
    set_user_reward_cishu:function(userid,random){
      resource5.save({
         userid:userid,
         random:random
      }, function(r) {
        //console.log(r);
        user_reward_cishu = r;
          $rootScope.$broadcast('jiangFactory.set_user_reward_cishu');
      });

    },

    get_user_reward_cishu:function(){

      return user_reward_cishu.data;

    }
    
   }

}])


//用户app签到

.factory('qiandaoFactory', ['$resource', '$rootScope', 'ENV',function($resource, $rootScope, ENV) {

  var APIUrl    = ENV.api;
  var sign;

  var resource = $resource(APIUrl + '&a=sign');

   return {

    //提交后台进行签到处理
    set_sign:function(userid,random){

      resource.save({
        userid:userid,
        random:random
      }, function(r) {
        console.log(r);
          sign = r;
          $rootScope.$broadcast('qiandaoFactory.set_sign');
      });

    },

     //接收签到结果
    get_sign:function(){

      return sign;

    }
    
   }

}])


//获取app服务器版本

.factory('updateFactory',['$resource', '$rootScope', 'ENV',function($resource, $rootScope, ENV) {

  var APIUrl = ENV.api;
  var reward_list;
  var resource = $resource(APIUrl + '&a=upload');

   return {

    //获取服务器的更新版本信息
    set_upload:function(fle){
      //console.log(fle);
      resource.save({
        fle:fle
      }, function(r) {
          //console.log(r)
          $rootScope.$broadcast('jiangFactory.set_reward_list');
      });

    },

    get_reward_list:function(){

      return reward_list.data;

    }
    
   }

}])



//app统一图片上传

.factory('uploadFactory', ['$resource','$ionicLoading', '$rootScope', 'ENV',function($resource,$ionicLoading, $rootScope, ENV) {

  var APIUrl = ENV.api;

  var compress_data;

  var pic_url;
  var data_upad = {
    1:'',
    2:'',
    3:''
  };
  var server =  $resource(APIUrl +'&a=upload_img2');
  var server2 = $resource(APIUrl +'&a=upload_avatar_img2');

  return {

    //提交文件上传
    set_upload: function(files, type_file, userid, random) {
 
      document.addEventListener('DOMContentLoaded', init(), true);

      function UploadPic() {
        this.sw = 0;
        this.sh = 0;
        this.tw = 0;
        this.th = 0;
        this.scale = 0;
        this.maxWidth = 800;
        this.maxHeight = 600;
        this.maxSize = 0;
        this.fileSize = 0;
        this.fileDate = null;
        this.fileType = '';
        this.fileName = '';
        this.input = null;
        this.canvas = null;
        this.mime = {};
        this.type = '';
        this.callback = function() {};
        this.loading = function() {};
        this.init1 = function(options) {

          // options = files;
          console.log(options);
          this.maxWidth = options.maxWidth || 800;
          this.maxHeight = options.maxHeight || 600;
          this.maxSize = options.maxSize || 10 * 1024 * 1024;
          this.input = options.input;
          this.mime = {
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'bmp': 'image/bmp'
          };
          this.callback = options.callback || function() {};
          this.loading = options.loading || function() {};

          this._addEvent();

        };
        this._addEvent = function() {
          var _this = this;

          function tmpSelectFile(ev) {
            _this._handelSelectFile(ev);
          }

          tmpSelectFile();
        };

        this._handelSelectFile = function(ev) {
          var file = files;

          if (!files) return false;

          this.type = '';
          //console.log($files.type);
          this.type = files.type;

          // 如果没有文件类型，则通过后缀名判断（解决微信及360浏览器无法获取图片类型问题） 
          if (!this.type) {
            this.type = this.mime[file.name.match(/\.([^\.]+)$/i)[1]];
          }

          if (!/image.(png|jpg|jpeg|bmp)/.test(this.type)) {
            $ionicLoading.show({
              noBackdrop: true,
              template: '选择的文件类型不是图片...',
              duration: 1000
            });
            return;
          }

          if (file.size > this.maxSize) {
            $ionicLoading.show({
              noBackdrop: true,
              template: '选择文件大于' + this.maxSize / 1024 / 1024 + 'M，请重新选择',
              duration: 1000
            });
            return;
            return;
          }

          this.fileName = file.name;
          this.fileSize = file.size;
          this.fileType = this.type;
          this.fileDate = file.lastModifiedDate;

          this._readImage(file);
        };

        this._readImage = function(file) {
          var _this = this;

          function tmpCreateImage(uri) {
            _this._createImage(uri);
          }

          this.loading();

          this._getURI(file, tmpCreateImage);
        };


        this._createImage = function(uri) {
          var img = new Image();
          var _this = this;

          function tmpLoad() {
            _this._drawImage(this);
          }


          if (type_file == 2) {
            
            server2.save({
              file: uri,
              type: files.type,
              userid: userid,
              random: random
            }, function(r) {
              pic_url = r;
              $rootScope.$broadcast('uploadFactory.set_upload');
            });

          } else {
            server.save({
              file: uri,
              type: files.type
            }, function(r) {
              pic_url = r;
              $rootScope.$broadcast('uploadFactory.set_upload');
            });

          }
        };


        this._getURI = function(file, callback) {
          var reader = new FileReader();
          var _this = this;

          function tmpLoad() {
            // 头不带图片格式，需填写格式 
            var re = /^data:base64,/;
            var ret = this.result + '';

            if (re.test(ret)) ret = ret.replace(re, 'data:' + _this.mime[_this.fileType] + ';base64,');

            callback && callback(ret);
          }

          reader.onload = tmpLoad;

          reader.readAsDataURL(file);

          return false;
        };

        this._drawImage = function(img, callback) {
          this.sw = img.width;
          this.sh = img.height;
          this.tw = img.width;
          this.th = img.height;
          this.scale = (this.tw / this.th).toFixed(2);

          if (this.sw > this.maxWidth) {
            this.sw = this.maxWidth;
            this.sh = Math.round(this.sw / this.scale);
          }

          if (this.sh > this.maxHeight) {
            this.sh = this.maxHeight;
            this.sw = Math.round(this.sh * this.scale);
          }

          this.canvas = document.createElement('canvas');
          var ctx = this.canvas.getContext('2d');

          this.canvas.width = this.sw;
          this.canvas.height = this.sh;

          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.sw, this.sh);

          this.callback(this.canvas.toDataURL(this.type));

          ctx.clearRect(0, 0, this.tw, this.th);
          this.canvas.width = 0;
          this.canvas.height = 0;
          this.canvas = null;
        };




      }


      function init() {

        var u1 = new UploadPic();

        u1.init1({
          input: document.querySelector('#File1'),
          callback: function(base64) {

          },
          loading: function() {

          }
        });
      }
    },

 
  get_upload: function() {

      return pic_url;

  },
  
  //进行图片压缩
  compress:function(source_img_obj, quality, output_format){
      var mime_type = source_img_obj.type;  
      mime_type = 'image/jpeg'
     preImage(source_img_obj.src,function(){  
            var cvs = document.createElement('canvas');
            var width = 800;
            var height = 800;
            var widthLonger = this.naturalWidth - width;  
            var heightLonger = this.naturalHeight - height;
             //固定宽度缩放  
             if(widthLonger >= heightLonger){  
                 scaleW = width;  
                 var percent = width/this.naturalWidth;  
                 scaleH = this.naturalHeight*percent;  
             }  
             //固定长度缩放  
             else{  
                 scaleH = height;  
                 var percent = height/this.naturalHeight;  
                 scaleW = this.naturalWidth*percent;  
             } 
             var cvsContext = cvs.getContext('2d');  
             cvs.width = scaleW;
             cvs.height = scaleH;
             var ctx = cvsContext.drawImage(this,0,0,this.naturalWidth,this.naturalHeight,0,0,scaleW,scaleH);
             var newImageData = cvs.toDataURL(mime_type,0.7);  
             var result_image_obj = new Image();  
             result_image_obj.src = newImageData; 
             compress_data = result_image_obj;
             //发送处理完成通知事件
             $rootScope.$broadcast('uploadFactory.compress');
             return  result_image_obj;
        }); 

      function preImage(url,callback){  
             var img = new Image(); //创建一个Image对象，实现图片的预下载  
             img.src = url;  
             
            if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数  
                 callback.call(img);  
                return; // 直接返回，不用再处理onload事件  
             }  
          
             img.onload = function () { //图片下载完毕时异步调用callback函数。  
                 callback.call(img);//将回调函数的this替换为Image对象  
             };  
        } 
  },

  //异步压缩完成结果
  get_compress:function(){
   return compress_data;
  },
  //上传已压缩的图片编码
  set_ba64_upload: function(uri,type,userid,random) {
      server.save({
        file: uri,
        type: type,
        userid: userid,
        random: random
      }, function(r) {
        pic_url = r;
        $rootScope.$broadcast('uploadFactory.set_upload');
      });
  },

    //上传已压缩的图片编码
  set_ba64_upload_avatar: function(uri,type,userid,random) {
      server2.save({
        file: uri,
        type: type,
        userid: userid,
        random: random
      }, function(r) {
        pic_url = r;
        $rootScope.$broadcast('uploadFactory.set_upload');
      });
  },

    //获得图像相对与一个矩形的缩放对象  
    //该对象包含：width，height  
    //date:2014-1-31  
    //author:MIKUScallion  
    getScaleObj:function(image,width,height,noOver){  
        //默认不能过度缩放  
        noOver = noOver===undefined? true:noOver;  
        var scaleW,scaleH;  
 
        //----------------  
        return {  
            width:scaleW,  
            height:scaleH  
        };  
    },

}

}])

//消息推送
.factory('jpushService',['$http','$window','$document',function($http,$window,$document){
  var jpushServiceFactory={};

  //var jpushapi=$window.plugins.jPushPlugin;

  //启动极光推送
  var _init=function(config){
    window.plugins.jPushPlugin.init();
    //设置tag和Alias触发事件处理
    document.addEventListener('jpush.setTagsWithAlias',config.stac,false);
    //打开推送消息事件处理
    window.plugins.jPushPlugin.openNotificationInAndroidCallback=config.oniac;
    

    window.plugins.jPushPlugin.setDebugMode(true);
  }
  //获取状态
  var _isPushStopped=function(fun){
    window.plugins.jPushPlugin.isPushStopped(fun)
  }
  //停止极光推送
  var _stopPush=function(){
    window.plugins.jPushPlugin.stopPush();
  }

  //重启极光推送
  var _resumePush=function(){
    window.plugins.jPushPlugin.resumePush();
  }

  //设置标签和别名
  var _setTagsWithAlias=function(tags,alias){
    window.plugins.jPushPlugin.setTagsWithAlias(tags,alias);
  }

  //设置标签
  var _setTags=function(tags){
    window.plugins.jPushPlugin.setTags(tags);
  }

  //设置别名
  var _setAlias=function(alias){
    window.plugins.jPushPlugin.setAlias(alias);
  }

  jpushServiceFactory.init=_init;
  jpushServiceFactory.isPushStopped=_isPushStopped;
  jpushServiceFactory.stopPush=_stopPush;
  jpushServiceFactory.resumePush=_resumePush;

  jpushServiceFactory.setTagsWithAlias=_setTagsWithAlias;
  jpushServiceFactory.setTags=_setTags;
  jpushServiceFactory.setAlias=_setAlias;

  return jpushServiceFactory;
}])


//搜索

.factory('soFactory', ['$resource','$ionicLoading', '$rootScope', 'ENV',function($resource,$ionicLoading, $rootScope, ENV) {

  var keyword_hot;
  var search_goods;

  var APIUrl = ENV.api;
  var resource = $resource(APIUrl  +'&a=keyword_hot');
  var resource2 =$resource(APIUrl +'&a=search_goods');

   return {

    //获取热门搜索关键词
    
    set_keyword_hot:function(){

      resource.query({
      }, function(r) {
        keyword_hot = r;
          //console.log(r)
          $rootScope.$broadcast('soFactory.set_keyword_hot');
      });


    },
     get_keyword_hot:function(){
      return keyword_hot;
    },

    //搜索商品
    set_search_goods:function(key){
      resource2.get({
        keyword:key,
        status:1
      }, function(r) {
          //console.log(r)
          search_goods = r;
          $rootScope.$broadcast('soFactory.set_search_goods');
      });

    },
    //获取搜索结果
     get_search_goods:function(){


      return search_goods;

      
    }
    
   }

}])

.factory('fileReader', ["$q", "$log", function($q, $log){
  var onLoad = function(reader, deferred, scope) {
    return function () {
      scope.$apply(function () {
        deferred.resolve(reader.result);
      });
    };
  };
  var onError = function (reader, deferred, scope) {
    return function () {
      scope.$apply(function () {
        deferred.reject(reader.result);
      });
    };
  };
  var getReader = function(deferred, scope) {
    var reader = new FileReader();
    reader.onload = onLoad(reader, deferred, scope);
    reader.onerror = onError(reader, deferred, scope);
    return reader;
  };
  var readAsDataURL = function (file, scope) {
    var deferred = $q.defer();
    var reader = getReader(deferred, scope);     
    reader.readAsDataURL(file);
    return deferred.promise;
  };
  return {
    readAsDataUrl: readAsDataURL  
  };
}])

.factory('fileReader', ["$q", "$log", function($q, $log){
  var onLoad = function(reader, deferred, scope) {
    return function () {
      scope.$apply(function () {
        deferred.resolve(reader.result);
      });
    };
  };
  var onError = function (reader, deferred, scope) {
    return function () {
      scope.$apply(function () {
        deferred.reject(reader.result);
      });
    };
  };
  var getReader = function(deferred, scope) {
    var reader = new FileReader();
    reader.onload = onLoad(reader, deferred, scope);
    reader.onerror = onError(reader, deferred, scope);
    return reader;
  };
  var readAsDataURL = function (file, scope) {
    var deferred = $q.defer();
    var reader = getReader(deferred, scope);     
    reader.readAsDataURL(file);
    return deferred.promise;
  };
  return {
    readAsDataUrl: readAsDataURL  
  };
}])

.factory('commonFactory',['$location','StorageFactory','$ionicHistory',function($location,StorageFactory,$ionicHistory){  
    return{  
        seturl:function(url){  
            if($ionicHistory.backView() && $ionicHistory.backView().url){
               var url = $ionicHistory.backView().url;       
                if(url  == '/tab/user/forget' || url == '/tab/user/forget_2' || url == '/tab/user/login' || url =='/tab/register'){
                    return false;
                }
                 //相同地址不记录
                if($location.url() == url) {
                    return false;
                }
                 if(StorageFactory.get('url') && StorageFactory.get('url') != $ionicHistory.backView().url){
                      StorageFactory.set('url',$ionicHistory.backView().url);
                      console.log($ionicHistory.backView().url);
                 }
               
            }
           // StorageFactory.set('url',url);//这个用来保存页面  
        },  
  
        geturl:function(){  
            return StorageFactory.get('url');
        }  
    }  
}])

    //升级vip
    .factory('user_vip',['ENV','$resource','$rootScope',function(ENV,$resource,$rootScope) {
        var data;

        var APIUrl = ENV.api;
        var resource = $resource(APIUrl  +'&a=upgrade_vip');

        return {
            //升级vip
            set: function(userid,random,groupid) {
                resource.save({
                    userid: userid,
                    random: random,
                    groupid:groupid,
                }, function(r) {
                    data = r;
                    $rootScope.$broadcast('user_vip.set');
                });
            },
            get: function(key) {
                return data;
            },
        };
    }])
    .factory('appealFactory', ['ENV', '$resource', '$rootScope', function(ENV, $resource, $rootScope) {
        var data;
	    var APIUrl = ENV.api;
	    var resource = $resource(APIUrl  +'&a=apply_lists');
        return {
            set: function(userid, status) {
                resource.save({
                    userid: userid,
                    status: status
                }, function(r) {
                    if (r.status===1){
	                    data = r.data?r.data:[];
                    }
                    else {
                        data = [];
                    }
                    $rootScope.$broadcast('appeal.set');
                })
            },
            get: function() {
                return data;
            }
        }
    }])
;