"use strict";

var _ref = _,
    get = _ref.get,
    take = _ref.take,
    sortBy = _ref.sortBy;
var home = {
  init: function init() {
    this["interface"]();
  },
  "interface": function _interface() {
    var that = this;

    if (!localStorage.ptsDataCache || !isDevEnv) {
      axios.all([axios.get(base + "/store/skuCmsJson/rightFixedBar"), axios.get(base + "/store/skuCmsJson/imageMask"), axios.get(base + "/store/skuCmsJson/marquee"), axios.get(base + "/store/skuCmsJson/leftFixedBar"), axios.get(base + "/plugin/getCmsJson/activityColumn"), axios.get(base + "/plugin/getCmsJson/indexKv"), axios.get(base + "/plugin/getCmsJson/topKv"), axios.get(base + "/store/skuCmsJson/hotItem"), axios.get(base + "/store/skuCmsJson/mobileItem"), axios.get(base + "/store/skuCmsJson/computerItem"), axios.get(base + "/store/skuCmsJson/accessoryItem"), axios.get(base + "/store/skuCmsJson/homeItem"), axios.get(base + "/store/skuCmsJson/wearableItem")]).then(axios.spread(function (rightFixedBar, imageMask, marquee, leftFixedBar, activityColumn, indexKv, topKv, hotItem, mobileItem, computerItem, accessoryItem, homeItem, wearableItem) {
        var obj = {
          activity: sortBy(get(activityColumn, "data.data.lists", []), "sort"),
          list: sortBy(get(indexKv, "data.data.lists", []), "sort"),
          list1: sortBy(get(topKv, "data.data.lists", []), "sort"),
          t_jian: get(hotItem, "data.data.lists", []),
          t_jian1: sortBy(get(hotItem, "data.data.lists.0.categorys.0.items", []), "sort"),
          phone_list: get(mobileItem, "data.data.lists", []),
          home_list: get(homeItem, "data.data.lists", []),
          pd_list: get(accessoryItem, "data.data.lists", []),
          wear_list: get(wearableItem, "data.data.lists", []),
          computer_list: get(computerItem, "data.data.lists", []),
          phoneTimeSet: [],
          marqueeData: get(marquee, "data.data", "") || {},
          leftFixedBar: sortBy(get(leftFixedBar, "data.data.lists", []), "sort"),
          imageMask: get(imageMask, "data.data", {}) || {},
          rightFixedBar: sortBy(get(rightFixedBar, "data.data.lists", []), "sort")
        };
        that.removeLoading();
        localStorage.ptsDataCache = JSON.stringify(obj);
        that.homeKv(obj);
      }));
    } else {
      var obj = JSON.parse(localStorage.ptsDataCache);
      this.removeLoading();
      this.homeKv(obj);
    }
  },
  homeKv: function homeKv(date) {
    //  home 的  this
    //  初始化状态
    var obj = {
      isMobile: false
    }; //  ES6的对象合并 引用模式

    obj = Object.assign(obj, date);
    var swiperComponent = {
      name: "SwiperBanner",
      props: ["jsonlist", "isMobile", "swipterid", "isHidePlayBtn", "omnitureClass"],
      data: function data() {
        return {
          swipter: null,
          kvnum: 0,
          isA: false
        };
      },
      template: "\n                <div v-bind:id=\"swipterid\" :class=\"omnitureClass\" class=\"swiper-container\"> \n                    <div class=\"swiper-wrapper\">\n                        <div class=\"swiper-slide\" v-for=\"item in jsonlist\">\n                            <a target=\"_blank\" :href=\"item.url\">\n                                <img v-bind:src=\"isMobile ? item.mobileImg : item.pcImg\" v-bind:uploaded_date=\"item.uploaded_date\">\n                            </a>\n                        </div>\n                    </div>\n                    <div v-if=\"jsonlist.length > 1\" class=\"swiperAuto\">\n                        <div class=\"swiperList\">\n                            <div v-for=\"(item, index) in jsonlist\"\n                                v-bind:key=\"index\"\n                                @click=\"okindex(index)\"\n                                v-bind:class=\"{action:index===kvnum,isaction:index!==kvnum}\"\n                                v-bind:dot_index=\"index\">\n                            </div>\n                            <div v-if=\"!isHidePlayBtn\" class=\"ctrlkvbtn\" v-bind:class=\"{pause:isA, play:!isA}\" @click=\"toggle\"></div>\n                        </div>\n                    </div>\n                 </div>\n            ",
      mounted: function mounted() {
        var that = this;

        if (!this.swipter) {
          this.swipter = new Swiper("#".concat(that.swipterid), {
            autoplay: {
              delay: (get(that.jsonlist, "0.time") || 3) * 1000
            },
            // 如果需要前进后退按钮
            navigation: {
              disabledClass: "my-button-disabled"
            },
            on: {
              slideChange: function slideChange() {
                that.kvnum = that.swipter.activeIndex;

                if (that.isA) {
                  that.isA = false;
                  that.swipter.autoplay.start();
                }
              }
            }
          });
        } else {
          that.swipter.updateSlides(); //  更新数量

          that.swipter.updateSlidesClasses(); //   更新类名

          that.swipter.attachEvents(); //  重新绑定所有监听事件。

          that.swipter.updateProgress();
        }
      },
      methods: {
        toggle: function toggle() {
          if (this.isA) {
            //  播放
            this.swipter.autoplay.start();
          } else {
            //  暂停
            this.swipter.autoplay.stop();
          }

          this.isA = !this.isA;
        },
        okindex: function okindex(index) {
          this.swipter.slideTo(index, 500, false);
          this.kvnum = this.swipter.activeIndex;
          this.swipter.autoplay.start();
        }
      }
    };
    var recommendComponent = {
      name: "ProductRecommend",
      components: {
        "swiper-banner": swiperComponent
      },
      props: ["jsonlist", "isMobile", "recommendid", "ishiddentab"],
      data: function data() {
        return {
          selectIndex: 0,
          timeSet: null,
          cateGoryClickList: []
        };
      },
      template: "<div v-if=\"jsonlist.length\">\n                        <div class=\"ts_title\">\n                            <div class=\"s_t\" v-if=\"isMobile || ishiddentab\">\n                                <a target=\"_blank\" v-for=\"(item,index) in jsonlist\" :href=\"item.moreUrl\">\n                                    \u66F4\u591A <img src=\"../images/arrow-circle.png\" />\n                                </a>\n                            </div>\n                            <p><span></span></p>\n                            <b v-for=\"(item,index) in jsonlist\">\n                                {{item.title}}\n                            </b>\n                        </div>\n                        <div class=\"znju_banner\" v-if=\"isMobile\">\n                            <a target=\"_blank\" :href=\"categorys[selectIndex].floorurl\">\n                                <img :src=\"categorys[selectIndex].mobileFloorKv\" />\n                            </a>\n                        </div>\n                        <div v-if=\"!ishiddentab\" class=\"A_loc\">\n                            <div class=\"s_t\" v-if=\"!isMobile\">\n                                <a target=\"_blank\" v-for=\"(item,index) in jsonlist\" :href=\"item.moreUrl\">\n                                    \u66F4\u591A <img src=\"../images/arrow-circle.png\" />\n                                </a>\n                            </div>\n                            <ul v-bind:ref=\"recommendid\">\n                                <li v-for=\"(item, index) in categorys\" @mouseover=\"hoverChangeBanner(index)\">\n                                    <a v-bind:class=\"{ blue:index == (selectIndex)}\" @click=\"mobileCateGoryClickFun(index, item)\">\n                                        {{item.listName}}\n                                    </a>\n                                </li>\n                            </ul>\n                            <div class=\"out\" v-if=\"isMobile\">\n                                <div class=\"left btn\" @click=\"preCategory\"><a href=\"javascript:;\"></a></div>\n                                <div class=\"right btn\" @click=\"nextCategory\"><a href=\"javascript:;\"></a></div>\n                            </div>\n                        </div>\n                        <div class=\"recommend_banner\">\n                            <div class=\"PC\" v-if=\"!isMobile\">\n                                <div class=\"p_left\">\n                                    <a target=\"_blank\" :href=\"categorys[selectIndex].floorurl\">\n                                        <div v-bind:uploaded_date=\"categorys[selectIndex].uploaded_date\" v-bind:style=\"{ 'background-image': 'url(' + categorys[selectIndex].floorKv + ')','background-repeat':'no-repeat','width':'100%','height':'100%','background-size':'100% 100%'}\">\n                                        </div>\n                                    </a>\n                                </div>\n                                <div class=\"p_right\" :category_name=\"categoryName\">\n                                    <div v-for=\"(item,index) in  productList\" v-if=\"item.salesprice > 0\" >\n                                        <b class=\"tagimg\">\n                                            <img :src=\"item.tag\" alt=\"\" />\n                                        </b>\n                                        <a target=\"_blank\" :href=\"item.url\">\n                                            <p><img :src=\"item.pcImgpc\" alt=\"\" /></p>\n                                            <p><span>{{item.title}}</span></p>\n                                            <p><span>{{item.subtitle}}</span></p>\n                                            <p>\n                                                    <strong v-if=\"item.salesprice\">\xA5{{item.salesprice}}</strong>\n                                                    <span v-if=\"item.listprice && item.listprice != item.salesprice\" class=\"scribing_price\">\xA5{{item.listprice}}</span>\n                                                </p>\n                                        </a>\n                                    </div>\n                                    <div v-for=\"(item,index) in  productList\"  v-if=\"item.salesprice == 0\">\n                                        <a target=\"_blank\" :href=\"item.url\">\n                                            <div v-bind:style=\"{ 'background-image': 'url(' + item.pcImgpc + ')','background-repeat':'no-repeat','width':'100%','height':'100%','background-size':'100% 100%'}\">\n                                            </div>\n                                        </a>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"Mobile_phone\" v-if=\"isMobile\">\n                                <div v-for=\"(item,index) in productList\"  v-if=\"isShowProduct(item, index)\">\n                                    <b class=\"tagimg\">\n                                        <img :src=\"item.tag\" alt=\"\"/>\n                                    </b>\n                                    <a target=\"_blank\" :href=\"item.url\">\n                                        <p><img :src=\"item.mobileImgmobile\" alt=\"\" /></p>\n                                        <p><b>{{item.title}}</b></p>\n                                        <p style=\"height: 45px;\"><span>{{item.subtitle}}</span></p>\n                                            <p>\n                                                    <strong v-if=\"item.salesprice\">\xA5{{item.salesprice}}</strong>\n                                                    <span v-if=\"item.listprice && item.listprice != item.salesprice\" class=\"scribing_price\">\xA5{{item.listprice}}</span>\n                                                </p>\n                                    </a>\n                                </div>\n                                <div v-for=\"(item,index) in  productList\"  v-if=\"item.salesprice == 0\" >\n                                    <a target=\"_blank\" :href=\"item.url\">\n                                        <div v-bind:style=\"{ 'background-image': 'url(' + item.mobileImgmobile + ')','background-repeat':'no-repeat','width':'100%','height':'100%','background-size':'100% 100%'}\">\n                                        </div>\n                                    </a>\n                                </div>\n                            </div>\n                        </div>\n                        <swiper-banner\n                                v-if=\"wearList.length\"\n                                v-bind:jsonlist=\"wearList\"\n                                v-bind:is-mobile=\"isMobile\"\n                                v-bind:is-hide-play-btn=\"true\"\n                                v-bind:swipterid=\"recommendid\"\n                                omniture-class=\"wearSwiperEvent\">\n                        </swiper-banner>\n                    </div>\n                ",
      computed: {
        categorys: function categorys() {
          return sortBy(get(this.jsonlist, "0.categorys", []), "sort");
        },
        wearList: function wearList() {
          var newWearList = get(this.jsonlist, "0.wear_list", []);

          var filterList = _.filter(newWearList, "isShow");

          return sortBy(filterList, "sort");
        },
        productList: function productList() {
          return sortBy(get(this.categorys, "".concat(this.selectIndex, ".items"), []), "sort");
        },
        categoryName: function categoryName() {
          return this.recommendid.replace("Recommend", "");
        }
      },
      watch: {
        isMobile: function isMobile() {
          if (this.isMobile && !this.timeSet) {
            this.setTimeSet();
          }

          if (!this.isMobile && this.timeSet) {
            clearInterval(this.timeSet);
          }
        },
        selectIndex: function selectIndex() {
          var ulElement = this.$refs[this.recommendid];
          var liElement = this.$refs[this.recommendid].children;
          var ulMarginLeft = ulElement.getBoundingClientRect().left;
          var visibleArea = ulMarginLeft + ulElement.clientWidth;
          var selectedCgffset = ulMarginLeft + liElement[this.selectIndex].getBoundingClientRect().left;

          if (this.selectIndex === 0) {
            ulElement.scrollLeft = 0;
            return;
          }

          if (selectedCgffset > visibleArea) {
            ulElement.scrollLeft += liElement[0].clientWidth;
          }
        }
      },
      methods: {
        hoverChangeBanner: function hoverChangeBanner(index) {
          this.selectIndex = index;
        },
        setTimeSet: function setTimeSet() {
          var that = this;
          this.timeSet = setInterval(function () {
            that.nextCategory();
          }, (get(that.jsonlist, "0.timeInterval") || 10) * 1000);
        },
        resetTimeSet: function resetTimeSet() {
          clearInterval(this.timeSet);
          this.selectIndex = 0;
          this.setTimeSet();
        },
        nextCategory: function nextCategory() {
          this.judgeIndexLegal("next") ? this.selectIndex++ : this.selectIndex = 0;
        },
        preCategory: function preCategory() {
          this.judgeIndexLegal("previous") ? this.selectIndex-- : this.selectIndex = this.categorys.length - 1;
        },
        judgeIndexLegal: function judgeIndexLegal(pattern) {
          if (pattern === "next" && this.selectIndex + 1 === this.categorys.length) {
            return false;
          }

          if (pattern === "previous" && this.selectIndex - 1 < 0) {
            return false;
          }

          return true;
        },
        mobileCateGoryClickFun: function mobileCateGoryClickFun(index, item) {
          if (this.isMobile) {
            if (this.cateGoryClickList[index]) {
              window.location.href = item.linkurl;
              return;
            }

            this.cateGoryClickList[index] = 1;
          } else {
            window.open(item.linkurl);
          }
        },
        isShowProduct: function isShowProduct(item, index) {
          // 手机显示6个，售卖价大于0 ，智能家居显示2个，其余显示4个
          return this.recommendid === "phoneRecommend" || item.salesprice > 0 && index < 4 && !(this.recommendid === "homeRecommend" && index > 1);
        }
      },
      destroyed: function destroyed() {
        window.clearInterval(this.timeSet);
      }
    };
    var marqueeComponent = {
      name: "marqueeComponent",
      props: ["marqueeData"],
      computed: {
        marqueeLink: function marqueeLink() {
          return this.marqueeData.url ? this.marqueeData.url : "#";
        }
      },
      methods: {
        handleEventStop: function handleEventStop(url) {
          if (!url) return;
          window.open(url);
        }
      },
      template: "           <section class=\"marquee-nav\">\n" + "                    <a @click=\"handleEventStop(marqueeData.url)\">\n" + "                        <img class=\"marquee-icon\" src=\"../images/lingdang.png\" alt=\"\" />\n" + "                        <marquee direction=\"left\" onmouseover=this.stop() onmouseout=this.start() class=\"marquee-text\">\n" + "                            {{marqueeData.marqueeText}}\n" + "                        </marquee>\n" + "                    </a>\n" + "                </section>"
    };
    var imageMask = {
      data: function data() {
        return {
          shadowVisible: true
        };
      },
      props: ["imageMask"],
      methods: {
        toggleImageMask: function toggleImageMask() {
          this.shadowVisible = !this.shadowVisible;
        },
        handleEventStop: function handleEventStop(e) {
          e.stopPropagation();
        }
      },
      template: "\n                <div v-if=\"imageMask.visible\" id=\"shadowVue\">\n                    <transition name=\"fade\">\n                        <div class=\"shadow\" v-show=\"shadowVisible\" @click=\"toggleImageMask\">\n                            <div class=\"dialog-index\" @click=\"handleEventStop\">\n                                <a :href=\"imageMask.url\" target=\"_blank\"><img :src=\"imageMask.pcImg\" /></a>\n                                <a class=\"dialog-close\" @click=\"toggleImageMask\" href=\"javascript:void(0)\"></a>\n                            </div>\n                        </div>\n                    </transition>\n                </div>\n            "
    };
    var fixedRightBar = {
      data: function data() {
        return {
          couponList: window.couponDataMap || [],
          noticeDialogIns: null,
          couponBoxTop: null,
          couponBoxLeft: null,
          isHoverCouponBox: false,
          isCouponBoxBeFixed: false,
          rollingIndex: 0,
          cartNum: window.cartNumUseForNewIndex || "0",
          acTop2: 0,
          P_number: 0
        };
      },
      props: ["isPcView", "isMobile", "barDataList", "isShowCategory", "isActivityColumn"],
      computed: {
        firstTwoCoupons: function firstTwoCoupons() {
          return take(this.couponList, 2);
        },
        imageType: function imageType() {
          if (this.isMobile) return "mobileImg";
          if (this.isPcView) return "pcImg";
          return "smallicon";
        },
        isShowTopScrollBtn: function isShowTopScrollBtn() {
          return !this.isMobile && this.barDataList.length > 4 && this.P_number > 0 && this.isActivityColumn;
        },
        isShowBottomScrollBtn: function isShowBottomScrollBtn() {
          return !this.isMobile && this.barDataList.length > 4 && this.P_number + 4 < this.barDataList.length && this.isActivityColumn;
        },
        sliceBarDataList: function sliceBarDataList() {
          return this.isMobile ? this.barDataList.slice(0, 8) : this.barDataList.slice(this.rollingIndex, this.rollingIndex + 4);
        },
        fixCouponBottom: function fixCouponBottom() {
          return "".concat(window.innerHeight - 365, "px");
        }
      },
      methods: {
        handleClickItem: function handleClickItem(item) {
          var type = {
            个人中心: this.gotoMyaccount,
            联系客服: this.openLiveWindow,
            购物车: this.goToCartPage
          };

          if (type[item.type]) {
            type[item.type]();
          } else {
            window.open(item.url);
          }
        },
        gotoMyaccount: function gotoMyaccount() {
          // 点击购物车唤起S助手
          if (commonloginstatus === false) {
            if (window.userAgent.indexOf("SamsungLifeService") !== -1) {
              var sso = new SaSso();
              sso.saLogin();
            } else {
              newShopLogin(2);
            }
          } else {
            window.open("/myaccount/myaccount-info.htm?needValidateBindState=true");
          }
        },
        openLiveWindow: function openLiveWindow() {
          $("#open-zd-chat").trigger("click");
        },
        goToCartPage: function goToCartPage() {
          window.open("/shopping/cart.htm");
        },
        openMobileMenu: function openMobileMenu() {
          $(".mob-menu").trigger("tap");
        },
        toggleCouponBox: function toggleCouponBox(item, e) {
          if (e) {
            var bottom = window.innerHeight - e.target.getBoundingClientRect().top;
            this.isCouponBoxBeFixed = bottom < 250;
          }

          if (item.type !== "优惠券") {
            return;
          }

          if (this.couponBoxTop) {
            this.couponBoxTop = null;
          } else {
            this.couponBoxTop = e.target.getBoundingClientRect().top;
          }

          this.couponBoxLeft = e.target.getBoundingClientRect().left;
        },
        toggleHoverCouponBox: function toggleHoverCouponBox() {
          this.isHoverCouponBox = !this.isHoverCouponBox;
        },
        handleCloseCouponBox: function handleCloseCouponBox() {
          this.couponBoxTop = null;
          this.isHoverCouponBox = false;
        },
        handleClickShowMore: function handleClickShowMore() {
          // 查看更多需要登录
          if (commonloginstatus === false) {
            if (window.userAgent.indexOf("SamsungLifeService") !== -1) {
              var sso = new SaSso();
              sso.saLogin();
            } else {
              //  $("#login").trigger('tap');
              newShopcLogin(2);
            }
          } else {
            window.open("".concat(base, "/member/coupons/couponsInfo.htm?couponState=0"));
          }
        },
        showTip: function showTip(msg) {
          var _this = this;

          if (!this.noticeDialogIns) {
            this.noticeDialogIns = $.spice.dialog().init({
              dialogClass: "dialog-notice",
              fixed: true,
              title: "<i class=\"icon icon-wrong\"></i>".concat(msg),
              button: ["确定"],
              submit: function submit() {
                _this.noticeDialogIns.hide();
              }
            });
          }

          this.noticeDialogIns.show();
        },
        handleClickImmediatelyReceive: function handleClickImmediatelyReceive(itemCode, e) {
          var _this2 = this;

          var bindingCouponToMemberUrl = "".concat(base, "/member/bindingCouponToMember.json");

          if (itemCode === "" || itemCode === null || undefined === itemCode) {
            return;
          }

          loxia.asyncXhrPost(bindingCouponToMemberUrl, {
            itemCode: itemCode
          }, {
            success: function success(jsonData) {
              if (jsonData.isSuccess) {
                _this2.showTip("领取成功，请到我的账户-优惠券中查看");

                $(e.target).find(".use").removeClass("none");
                $(e.target).find(".pickUp").addClass("none");
                $(e.target).removeClass("immediatelyReceive");
                return;
              }

              if (jsonData.errorCode === 19019) {
                if (window.userAgent.indexOf("SamsungLifeService") !== -1) {
                  var sso = new SaSso();
                  sso.saLogin();
                } else {
                  //  $("#login").trigger('tap');
                  newShopLogin(2);
                  return;
                }
              }

              if (jsonData.errorCode === 19018) {
                _this2.showTip("您已成功领取优惠券，请勿重复领取");

                return;
              }

              _this2.showTip("优惠券已领完<br/><br/>请到领券中心查看更多优惠券");
            }
          }, {
            error: function error(jsonData) {
              console.log(jsonData);
            }
          });
        },
        formatCouponDate: function formatCouponDate(val) {
          if (val === null || val === "") {
            return "&nbsp;";
          }

          return new Date(val).Format("yyyy.MM.dd HH:mm");
        },
        formatNum: function formatNum(data) {
          var val = data;

          if (val === null || val === "") {
            return "&nbsp;";
          }

          val /= 10;
          val += "";
          var arr = val.split(".");

          if (arr.length > 1) {
            val = "".concat(arr[0], ".").concat(arr[1].length > 1 ? arr[1].substr(0, 1) : arr[1]);
          }

          return val;
        },
        increaseRollingIndex: function increaseRollingIndex() {
          this.rollingIndex += 1;
        },
        decreaseRollingIndex: function decreaseRollingIndex() {
          this.rollingIndex -= 1;
        },
        // 上下滚动事件
        TopB: function TopB() {
          this.P_number--;
          var unitOffset = this.isPcView ? 87 : 45;
          var news2 = parseInt(this.acTop2 + unitOffset);
          this.acTop2 = news2;
          $(".slideScroll ul").animate({
            top: news2
          });
        },
        BottomB: function BottomB() {
          this.P_number++;
          var unitOffset = this.isPcView ? 87 : 45;
          var news = parseInt(this.acTop2 - unitOffset);
          this.acTop2 = news;
          $(".slideScroll ul").animate({
            top: news
          });
        },
        orderScroll: function orderScroll() {
          if (!this.isMobile || !this.isActivityColumn) return;
          var a = $(".rightbot_floor2 .slideScroll ul").scrollLeft();
          var b = this.barDataList.length * $(".rightbot_floor2 ul .barItem").width() - $(window).width() * 0.964;
          var c = a / b * 50;
          $(".scroll-span").css("left", "".concat(c, "%"));
        }
      },
      template: "\n               <div class=\"coupon\">\n                    <div v-if=\"isShowTopScrollBtn\" class=\"previmg Topscroll\" @click=\"TopB\"></div>\n                    <div class=\"slideScroll\">\n                        <ul v-if=\"barDataList.length\" @scroll=\"orderScroll\">\n                            <li v-if=\"isShowCategory\" button_name=\"floating catgory\" @click=\"openMobileMenu\">\n                                <a>\n                                    <img src=\"../images/mobile/i0.png\" />\n                                </a>\n                            </li>\n                            <li \n                                v-for=\"(item, index) in barDataList\"\n                                :class=\"{barItem: true}\" \n                                :button_name=\"item.button_name\"  \n                                @mouseenter=\"toggleCouponBox(item, $event)\" \n                                @mouseleave=\"toggleCouponBox(item, $event)\"\n                            >\n                                <a @click=\"handleClickItem(item)\">\n                                    <img :src=\"item[imageType]\" />\n                                </a>\n                                <div class=\"cart-count\" v-if=\"isMobile && item.type==='\u8D2D\u7269\u8F66' && cartNum != '0'\">{{cartNum}}</div>\n                            </li>\n                        </ul>\n                    </div>\n                    <!--  \u4F18\u60E0\u5238\u5F39\u7A97     -->\n                    <div \n                        v-if=\"firstTwoCoupons.length > 0 && (couponBoxTop || isHoverCouponBox)\" \n                        :class=\"isCouponBoxBeFixed ? 'left-big-fixed' : 'left-big'\"\n                        :style=\"{top:isCouponBoxBeFixed ? fixCouponBottom : (couponBoxTop + 'px'), left: couponBoxLeft + 'px'}\"\n                        @mouseenter=\"toggleHoverCouponBox\" \n                        @mouseleave=\"toggleHoverCouponBox\"\n                    >\n                        <img src=\"//res-stage.samsungeshop.com.cn/images/index/add/youhui-nav.png?20180517112751\" alt=\"\">\n                        <span @click=\"handleCloseCouponBox\" class=\"chat-close\">\n                            <img src=\"//res-stage.samsungeshop.com.cn/images/index/add/chat-close.png?20180517112751/\">\n                        </span>\n                        <div v-for=\"(coupon, index) in firstTwoCoupons\" v-if=\"coupon.supportTourists || commonloginstatus\" :class=\"'quan-nav'+ (index + 1)  + ' nav-commen'\">\n                            <div class=\"nav-top1\">\n                                <div class=\"money-1\">\n                                    <p v-if=\"coupon.couponType == 1\"><span>\uFFE5</span>{{coupon.discount}}</p>\n                                    <p v-if=\"coupon.couponType == 2\" class='zhekou'><span>{{formatNum(coupon.discount)}}</span>\u6298</p>\n                                </div>\n                                <div class=\"time1\">\n                                    <p>&nbsp;\u6D3B\u52A8\u65F6\u95F4\uFF1A<br>&nbsp;{{formatCouponDate(coupon.startTime)}}<br>-{{formatCouponDate(coupon.endTime)}}</p>\n                                </div>\n                            </div>\n                            <div class=\"nav-top2\"><p>{{coupon.couponName}}</p></div>\n                            <div class=\"nav-top3\">\n                                <p class=\"immediatelyReceive\">\n                                    <a class=\"pickUp\" style=\"color: #00c3b2;\" @click=\"handleClickImmediatelyReceive(coupon.itemCodes, $event)\">\u7ACB\u5373\u9886\u53D6</a>\n                                    <a class=\"use none\" style=\"color: #00c3b2;\" :href=\"coupon.useUrl\" target=\"blank\">\u7ACB\u5373\u4F7F\u7528</a>\n                                </p>\n                            </div>\n                        </div>\n                        <div v-if=\"couponList.length > 2\" class='chat-bottom3 chat-com'><a @click=\"handleClickShowMore\">\u67E5\u770B\u66F4\u591A</a></div>\n                    </div>\n                    <div v-if=\"isShowBottomScrollBtn\" class=\"nextimg BottomScroll\" @click=\"BottomB\"></div>\n                    <div v-if=\"isMobile && isActivityColumn && barDataList.length>4\" class=\"qy-div\"><span class=\"scroll-span\"></span></div>\n               </div>\n            "
    }; // kv

    this.kv = new Vue({
      el: "#home",
      data: obj,
      components: {
        "swiper-banner": swiperComponent,
        "product-recommend": recommendComponent,
        "marquee-component": marqueeComponent,
        "image-mask": imageMask,
        "fixed-right-bar": fixedRightBar
      },
      methods: {
        onsizefn: function onsizefn() {
          var w = $(window).width();

          if (w < 1024) {
            this.isMobile = true;
          } else {
            this.isMobile = false;
          }

          if (w < 1505) {
            $(".floor").hide();
            $(".grj").hide();
            $(".rightbot_floor1").hide();
            $(".newleft_floor").show();
            $(".newtop_floor").show();
            $(".rightbot_floor3").show();
          } else {
            $(".floor").show();
            $(".grj").show();
            $(".rightbot_floor1").show();
            $(".newtop_floor").hide();
            $(".newleft_floor").hide();
            $(".rightbot_floor3").hide();
          }
        },
        scroll_Top: function scroll_Top() {
          $("html").animate({
            scrollTop: "0px"
          }, 1000);
        },
        scrollToView: function scrollToView(data) {
          var id = data;
          id = "a".concat(id); // 锚点

          $("#".concat(id))[0].scrollIntoView();
          $("html")[0].scrollTop -= 20;
        },
        // 监听滚动条
        handleScroll: function handleScroll() {
          if (this.isMobile) {
            return;
          }

          var bannerTop = Math.round($(".banner").offset().top - $(document).scrollTop()) - $("#wrapper .header")[1].clientHeight;

          if (bannerTop >= 1) {
            // pc悬浮
            $(".floor").css({
              position: "absolute",
              top: 0,
              left: "2%"
            });
            $(".grj").css({
              position: "absolute",
              top: 0,
              right: "2%"
            });
            $(".menu_bottom").css({
              position: "absolute",
              top: "320px",
              right: "2%"
            });
            $(".newleft_floor").css({
              position: "absolute",
              top: 0,
              left: "-40px"
            });
            $(".newtop_floor").css({
              position: "absolute",
              top: 0,
              left: "101%"
            });
            $(".rightbot_floor3").css({
              position: "absolute",
              top: "210px",
              left: "101%"
            });
          } else {
            // 避免页面报错
            if (!$(".header-fixed").length) {
              return;
            }

            var top = $(".header-fixed")[1].clientHeight;
            $(".floor").css({
              position: "fixed",
              top: "".concat(top, "px")
            });
            $(".grj").css({
              position: "fixed",
              top: "".concat(top, "px")
            });
            $(".menu_bottom").css({
              position: "fixed",
              top: "".concat(top + 320, "px")
            });
            $(".newleft_floor").css({
              position: "fixed",
              top: "".concat(top, "px"),
              left: "".concat($(".newleft_floor")[0].getBoundingClientRect().left, "px")
            });
            $(".newtop_floor").css({
              position: "fixed",
              top: "".concat(top, "px"),
              left: "".concat($(".newtop_floor")[0].getBoundingClientRect().left, "px")
            });
            $(".rightbot_floor3").css({
              position: "fixed",
              top: "".concat(top + 210, "px"),
              left: "".concat($(".rightbot_floor3")[0].getBoundingClientRect().left, "px")
            });
          }

          if ($(window).scrollTop() === 0) {
            $(".top_model").hide();
          } else {
            $(".top_model").show();
          }
        }
      },
      mounted: function mounted() {
        var that = this; // 监听滚动条

        window.addEventListener("scroll", this.handleScroll); // 判断是否是移动端

        window.onresize = function () {
          that.onsizefn();
        };

        this.onsizefn();
        initOmnitrueEvent();
      }
    });
  },
  removeLoading: function removeLoading() {
    // 动态数据读完就把LOADING消失，显示界面。
    $(".all_mc").show();
    $(".loading").hide();
  }
};
$(document).ready(function () {
  home.init();
});