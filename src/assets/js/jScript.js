const { get, take, sortBy } = _
var home = {
    init() {
        this.interface()
    },
    interface() {
        var that = this
        if (!localStorage.ptsDataCache || !isDevEnv) {
            axios.all([
                axios.get(base + "/store/skuCmsJson/rightFixedBar"),
                axios.get(base + "/store/skuCmsJson/imageMask"),
                axios.get(base + "/store/skuCmsJson/marquee"),
                axios.get(base + "/store/skuCmsJson/leftFixedBar"),
                axios.get(base + "/plugin/getCmsJson/activityColumn"),
                axios.get(base + "/plugin/getCmsJson/indexKv"),
                axios.get(base + "/plugin/getCmsJson/topKv"),
                axios.get(base + "/store/skuCmsJson/hotItem"),
                axios.get(base + "/store/skuCmsJson/mobileItem"),
                axios.get(base + "/store/skuCmsJson/computerItem"),
                axios.get(base + "/store/skuCmsJson/accessoryItem"),
                axios.get(base + "/store/skuCmsJson/homeItem"),
                axios.get(base + "/store/skuCmsJson/wearableItem"),
            ])
                .then(axios.spread((
                    rightFixedBar,
                    imageMask,
                    marquee,
                    leftFixedBar,
                    activityColumn,
                    indexKv,
                    topKv,
                    hotItem,
                    mobileItem,
                    computerItem,
                    accessoryItem,
                    homeItem,
                    wearableItem,
                ) => {
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
                        rightFixedBar: sortBy(get(rightFixedBar, "data.data.lists", []), "sort"),
                    }
                    that.removeLoading()
                    localStorage.ptsDataCache = JSON.stringify(obj)
                    that.homeKv(obj)
                }))
        } else {
            var obj = JSON.parse(localStorage.ptsDataCache)
            this.removeLoading()
            this.homeKv(obj)
        }
    },
    homeKv: (date) => {
        //  home 的  this
        //  初始化状态
        var obj = {
            isMobile: false,
        }

        //  ES6的对象合并 引用模式
        obj = Object.assign(obj, date)
        const swiperComponent = {
            name: "SwiperBanner",
            props: ["jsonlist", "isMobile", "swipterid", "isHidePlayBtn", "omnitureClass"],
            data() {
                return {
                    swipter: null,
                    kvnum: 0,
                    isA: false,
                }
            },
            template: `
                <div v-bind:id="swipterid" :class="omnitureClass" class="swiper-container"> 
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="item in jsonlist">
                            <a target="_blank" :href="item.url">
                                <img v-bind:src="isMobile ? item.mobileImg : item.pcImg" v-bind:uploaded_date="item.uploaded_date">
                            </a>
                        </div>
                    </div>
                    <div v-if="jsonlist.length > 1" class="swiperAuto">
                        <div class="swiperList">
                            <div v-for="(item, index) in jsonlist"
                                v-bind:key="index"
                                @click="okindex(index)"
                                v-bind:class="{action:index===kvnum,isaction:index!==kvnum}"
                                v-bind:dot_index="index">
                            </div>
                            <div v-if="!isHidePlayBtn" class="ctrlkvbtn" v-bind:class="{pause:isA, play:!isA}" @click="toggle"></div>
                        </div>
                    </div>
                 </div>
            `,
            mounted() {
                var that = this
                if (!this.swipter) {
                    this.swipter = new Swiper(`#${that.swipterid}`, {
                        autoplay: {
                            delay: (get(that.jsonlist, "0.time") || 3) * 1000,
                        },
                        // 如果需要前进后退按钮
                        navigation: {
                            disabledClass: "my-button-disabled",
                        },
                        on: {
                            slideChange() {
                                that.kvnum = that.swipter.activeIndex
                                if (that.isA) {
                                    that.isA = false
                                    that.swipter.autoplay.start()
                                }
                            },
                        },

                    })
                } else {
                    that.swipter.updateSlides() //  更新数量
                    that.swipter.updateSlidesClasses() //   更新类名
                    that.swipter.attachEvents() //  重新绑定所有监听事件。
                    that.swipter.updateProgress()
                }
            },
            methods: {
                toggle() {
                    if (this.isA) {
                        //  播放
                        this.swipter.autoplay.start()
                    } else {
                        //  暂停
                        this.swipter.autoplay.stop()
                    }
                    this.isA = !this.isA
                },
                okindex(index) {
                    this.swipter.slideTo(index, 500, false)
                    this.kvnum = this.swipter.activeIndex
                    this.swipter.autoplay.start()
                },
            },
        }
        const recommendComponent = {
            name: "ProductRecommend",
            components: {
                "swiper-banner": swiperComponent,
            },
            props: ["jsonlist", "isMobile", "recommendid", "ishiddentab"],
            data() {
                return {
                    selectIndex: 0,
                    timeSet: null,
                    cateGoryClickList: [],
                }
            },
            template: `<div v-if="jsonlist.length">
                        <div class="ts_title">
                            <div class="s_t" v-if="isMobile || ishiddentab">
                                <a target="_blank" v-for="(item,index) in jsonlist" :href="item.moreUrl">
                                    更多 <img src="../images/arrow-circle.png" />
                                </a>
                            </div>
                            <p><span></span></p>
                            <b v-for="(item,index) in jsonlist">
                                {{item.title}}
                            </b>
                        </div>
                        <div class="znju_banner" v-if="isMobile">
                            <a target="_blank" :href="categorys[selectIndex].floorurl">
                                <img :src="categorys[selectIndex].mobileFloorKv" />
                            </a>
                        </div>
                        <div v-if="!ishiddentab" class="A_loc">
                            <div class="s_t" v-if="!isMobile">
                                <a target="_blank" v-for="(item,index) in jsonlist" :href="item.moreUrl">
                                    更多 <img src="../images/arrow-circle.png" />
                                </a>
                            </div>
                            <ul v-bind:ref="recommendid">
                                <li v-for="(item, index) in categorys" @mouseover="hoverChangeBanner(index)">
                                    <a v-bind:class="{ blue:index == (selectIndex)}" @click="mobileCateGoryClickFun(index, item)">
                                        {{item.listName}}
                                    </a>
                                </li>
                            </ul>
                            <div class="out" v-if="isMobile">
                                <div class="left btn" @click="preCategory"><a href="javascript:;"></a></div>
                                <div class="right btn" @click="nextCategory"><a href="javascript:;"></a></div>
                            </div>
                        </div>
                        <div class="recommend_banner">
                            <div class="PC" v-if="!isMobile">
                                <div class="p_left">
                                    <a target="_blank" :href="categorys[selectIndex].floorurl">
                                        <div v-bind:uploaded_date="categorys[selectIndex].uploaded_date" v-bind:style="{ 'background-image': 'url(' + categorys[selectIndex].floorKv + ')','background-repeat':'no-repeat','width':'100%','height':'100%','background-size':'100% 100%'}">
                                        </div>
                                    </a>
                                </div>
                                <div class="p_right" :category_name="categoryName">
                                    <div v-for="(item,index) in  productList" v-if="item.salesprice > 0" >
                                        <b class="tagimg">
                                            <img :src="item.tag" alt="" />
                                        </b>
                                        <a target="_blank" :href="item.url">
                                            <p><img :src="item.pcImgpc" alt="" /></p>
                                            <p><span>{{item.title}}</span></p>
                                            <p><span>{{item.subtitle}}</span></p>
                                            <p>
                                                    <strong v-if="item.salesprice">¥{{item.salesprice}}</strong>
                                                    <span v-if="item.listprice && item.listprice != item.salesprice" class="scribing_price">¥{{item.listprice}}</span>
                                                </p>
                                        </a>
                                    </div>
                                    <div v-for="(item,index) in  productList"  v-if="item.salesprice == 0">
                                        <a target="_blank" :href="item.url">
                                            <div v-bind:style="{ 'background-image': 'url(' + item.pcImgpc + ')','background-repeat':'no-repeat','width':'100%','height':'100%','background-size':'100% 100%'}">
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="Mobile_phone" v-if="isMobile">
                                <div v-for="(item,index) in productList"  v-if="isShowProduct(item, index)">
                                    <b class="tagimg">
                                        <img :src="item.tag" alt=""/>
                                    </b>
                                    <a target="_blank" :href="item.url">
                                        <p><img :src="item.mobileImgmobile" alt="" /></p>
                                        <p><b>{{item.title}}</b></p>
                                        <p style="height: 45px;"><span>{{item.subtitle}}</span></p>
                                            <p>
                                                    <strong v-if="item.salesprice">¥{{item.salesprice}}</strong>
                                                    <span v-if="item.listprice && item.listprice != item.salesprice" class="scribing_price">¥{{item.listprice}}</span>
                                                </p>
                                    </a>
                                </div>
                                <div v-for="(item,index) in  productList"  v-if="item.salesprice == 0" >
                                    <a target="_blank" :href="item.url">
                                        <div v-bind:style="{ 'background-image': 'url(' + item.mobileImgmobile + ')','background-repeat':'no-repeat','width':'100%','height':'100%','background-size':'100% 100%'}">
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <swiper-banner
                                v-if="wearList.length"
                                v-bind:jsonlist="wearList"
                                v-bind:is-mobile="isMobile"
                                v-bind:is-hide-play-btn="true"
                                v-bind:swipterid="recommendid"
                                omniture-class="wearSwiperEvent">
                        </swiper-banner>
                    </div>
                `,
            computed: {
                categorys() {
                    return sortBy(get(this.jsonlist, "0.categorys", []), "sort")
                },
                wearList() {
                    var newWearList = get(this.jsonlist, "0.wear_list", [])
                    var filterList = _.filter(newWearList, "isShow")
                    return sortBy(filterList, "sort")
                },
                productList() {
                    return sortBy(get(this.categorys, `${this.selectIndex}.items`, []), "sort")
                },
                categoryName() {
                    return this.recommendid.replace("Recommend", "")
                },
            },
            watch: {
                isMobile() {
                    if (this.isMobile && !this.timeSet) {
                        this.setTimeSet()
                    }
                    if (!this.isMobile && this.timeSet) {
                        clearInterval(this.timeSet)
                    }
                },
                selectIndex() {
                    var ulElement = this.$refs[this.recommendid]
                    var liElement = this.$refs[this.recommendid].children
                    var ulMarginLeft = ulElement.getBoundingClientRect().left
                    var visibleArea = ulMarginLeft + ulElement.clientWidth
                    var selectedCgffset = ulMarginLeft
                    + liElement[this.selectIndex].getBoundingClientRect().left

                    if (this.selectIndex === 0) {
                        ulElement.scrollLeft = 0
                        return
                    }
                    if (selectedCgffset > visibleArea) {
                        ulElement.scrollLeft += liElement[0].clientWidth
                    }
                },
            },
            methods: {
                hoverChangeBanner(index) {
                    this.selectIndex = index
                },
                setTimeSet() {
                    var that = this
                    this.timeSet = setInterval(() => {
                        that.nextCategory()
                    }, (get(that.jsonlist, "0.timeInterval") || 10) * 1000)
                },
                resetTimeSet() {
                    clearInterval(this.timeSet)
                    this.selectIndex = 0
                    this.setTimeSet()
                },
                nextCategory() {
                    this.judgeIndexLegal("next") ? (this.selectIndex++) : (this.selectIndex = 0)
                },
                preCategory() {
                    this.judgeIndexLegal("previous") ? (this.selectIndex--) : (this.selectIndex = this.categorys.length - 1)
                },
                judgeIndexLegal(pattern) {
                    if (pattern === "next" && this.selectIndex + 1 === this.categorys.length) {
                        return false
                    }
                    if (pattern === "previous" && this.selectIndex - 1 < 0) {
                        return false
                    }
                    return true
                },
                mobileCateGoryClickFun(index, item) {
                    if (this.isMobile) {
                        if (this.cateGoryClickList[index]) {
                            window.location.href = item.linkurl
                            return
                        }
                        this.cateGoryClickList[index] = 1
                    } else {
                        window.open(item.linkurl)
                    }
                },
                isShowProduct(item, index) {
                    // 手机显示6个，售卖价大于0 ，智能家居显示2个，其余显示4个
                    return this.recommendid === "phoneRecommend" || item.salesprice > 0 && index < 4 && !(this.recommendid === "homeRecommend" && index > 1)
                },
            },
            destroyed() {
                window.clearInterval(this.timeSet)
            },
        }
        const marqueeComponent = {
            name: "marqueeComponent",
            props: ["marqueeData"],
            computed: {
                marqueeLink() {
                    return this.marqueeData.url ? this.marqueeData.url : "#"
                },
            },
            methods: {
                handleEventStop(url) {
                    if (!url) return

                    window.open(url)
                },
            },
            template: "           <section class=\"marquee-nav\">\n"
                + "                    <a @click=\"handleEventStop(marqueeData.url)\">\n"
                + "                        <img class=\"marquee-icon\" src=\"../images/lingdang.png\" alt=\"\" />\n"
                + "                        <marquee direction=\"left\" onmouseover=this.stop() onmouseout=this.start() class=\"marquee-text\">\n"
                + "                            {{marqueeData.marqueeText}}\n"
                + "                        </marquee>\n"
                + "                    </a>\n"
                + "                </section>",
        }
        const imageMask = {
            data() {
                return {
                    shadowVisible: true,
                }
            },
            props: ["imageMask"],
            methods: {
                toggleImageMask() {
                    this.shadowVisible = !this.shadowVisible
                },
                handleEventStop(e) {
                    e.stopPropagation()
                },
            },
            template: `
                <div v-if="imageMask.visible" id="shadowVue">
                    <transition name="fade">
                        <div class="shadow" v-show="shadowVisible" @click="toggleImageMask">
                            <div class="dialog-index" @click="handleEventStop">
                                <a :href="imageMask.url" target="_blank"><img :src="imageMask.pcImg" /></a>
                                <a class="dialog-close" @click="toggleImageMask" href="javascript:void(0)"></a>
                            </div>
                        </div>
                    </transition>
                </div>
            `,
        }
        const fixedRightBar = {
            data() {
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
                    P_number: 0,
                }
            },
            props: ["isPcView", "isMobile", "barDataList", "isShowCategory", "isActivityColumn"],
            computed: {
                firstTwoCoupons() {
                    return take(this.couponList, 2)
                },
                imageType() {
                    if (this.isMobile) return "mobileImg"
                    if (this.isPcView) return "pcImg"

                    return "smallicon"
                },
                isShowTopScrollBtn() {
                    return !this.isMobile && this.barDataList.length > 4
                    && this.P_number > 0 && this.isActivityColumn
                },
                isShowBottomScrollBtn() {
                    return !this.isMobile && this.barDataList.length > 4
                        && this.P_number + 4 < this.barDataList.length
                        && this.isActivityColumn
                },
                sliceBarDataList() {
                    return this.isMobile
                        ? this.barDataList.slice(0, 8)
                        : this.barDataList.slice(this.rollingIndex, this.rollingIndex + 4)
                },
                fixCouponBottom() {
                    return `${window.innerHeight - 365}px`
                },
            },
            methods: {
                handleClickItem(item) {
                    const type = {
                        个人中心: this.gotoMyaccount,
                        联系客服: this.openLiveWindow,
                        购物车: this.goToCartPage,
                    }
                    if (type[item.type]) {
                        type[item.type]()
                    } else {
                        window.open(item.url)
                    }
                },
                gotoMyaccount() {
                    // 点击购物车唤起S助手
                    if (commonloginstatus === false) {
                        if (window.userAgent.indexOf("SamsungLifeService") !== -1) {
                            var sso = new SaSso()
                            sso.saLogin()
                        } else {
                            newShopLogin(2)
                        }
                    } else {
                        window.open("/myaccount/myaccount-info.htm?needValidateBindState=true")
                    }
                },
                openLiveWindow() {
                    $("#open-zd-chat").trigger("click")
                },
                goToCartPage() {
                    window.open("/shopping/cart.htm")
                },
                openMobileMenu() {
                    $(".mob-menu").trigger("tap")
                },
                toggleCouponBox(item, e) {
                    if (e) {
                        const bottom = window.innerHeight - e.target.getBoundingClientRect().top
                        this.isCouponBoxBeFixed = bottom < 250
                    }
                    if (item.type !== "优惠券") {
                        return
                    }

                    if (this.couponBoxTop) {
                        this.couponBoxTop = null
                    } else {
                        this.couponBoxTop = e.target.getBoundingClientRect().top
                    }

                    this.couponBoxLeft = e.target.getBoundingClientRect().left
                },
                toggleHoverCouponBox() {
                    this.isHoverCouponBox = !this.isHoverCouponBox
                },
                handleCloseCouponBox() {
                    this.couponBoxTop = null
                    this.isHoverCouponBox = false
                },
                handleClickShowMore() {
                    // 查看更多需要登录
                    if (commonloginstatus === false) {
                        if (window.userAgent.indexOf("SamsungLifeService") !== -1) {
                            var sso = new SaSso()
                            sso.saLogin()
                        } else {
                            //  $("#login").trigger('tap');
                            newShopcLogin(2)
                        }
                    } else {
                        window.open(`${base}/member/coupons/couponsInfo.htm?couponState=0`)
                    }
                },
                showTip(msg) {
                    if (!this.noticeDialogIns) {
                        this.noticeDialogIns = $.spice.dialog().init({
                            dialogClass: "dialog-notice",
                            fixed: true,
                            title: `<i class="icon icon-wrong"></i>${msg}`,
                            button: ["确定"],
                            submit: () => {
                                this.noticeDialogIns.hide()
                            },
                        })
                    }

                    this.noticeDialogIns.show()
                },
                handleClickImmediatelyReceive(itemCode, e) {
                    const bindingCouponToMemberUrl = `${base}/member/bindingCouponToMember.json`
                    if (itemCode === "" || itemCode === null || undefined === itemCode) {
                        return
                    }

                    loxia.asyncXhrPost(bindingCouponToMemberUrl, { itemCode }, {
                        success: (jsonData) => {
                            if (jsonData.isSuccess) {
                                this.showTip("领取成功，请到我的账户-优惠券中查看")
                                $(e.target).find(".use").removeClass("none")
                                $(e.target).find(".pickUp").addClass("none")
                                $(e.target).removeClass("immediatelyReceive")
                                return
                            }
                            if (jsonData.errorCode === 19019) {
                                if (window.userAgent.indexOf("SamsungLifeService") !== -1) {
                                    var sso = new SaSso()
                                    sso.saLogin()
                                } else {
                                    //  $("#login").trigger('tap');
                                    newShopLogin(2)
                                    return
                                }
                            }
                            if (jsonData.errorCode === 19018) {
                                this.showTip("您已成功领取优惠券，请勿重复领取")
                                return
                            }
                            this.showTip("优惠券已领完<br/><br/>请到领券中心查看更多优惠券")
                        },
                    }, {
                        error: (jsonData) => {
                            console.log(jsonData)
                        },
                    })
                },
                formatCouponDate(val) {
                    if (val === null || val === "") {
                        return "&nbsp;"
                    }
                    return new Date(val).Format("yyyy.MM.dd HH:mm")
                },
                formatNum(data) {
                    var val = data
                    if (val === null || val === "") {
                        return "&nbsp;"
                    }
                    val /= 10
                    val += ""
                    var arr = val.split(".")
                    if (arr.length > 1) {
                        val = `${arr[0]}.${arr[1].length > 1 ? arr[1].substr(0, 1) : arr[1]}`
                    }
                    return val
                },
                increaseRollingIndex() {
                    this.rollingIndex += 1
                },
                decreaseRollingIndex() {
                    this.rollingIndex -= 1
                },
                // 上下滚动事件
                TopB() {
                    this.P_number--
                    var unitOffset = this.isPcView ? 87 : 45
                    var news2 = parseInt(this.acTop2 + unitOffset)
                    this.acTop2 = news2
                    $(".slideScroll ul").animate({
                        top: news2,
                    })
                },
                BottomB() {
                    this.P_number++
                    var unitOffset = this.isPcView ? 87 : 45
                    var news = parseInt(this.acTop2 - unitOffset)
                    this.acTop2 = news
                    $(".slideScroll ul").animate({
                        top: news,
                    })
                },
                orderScroll() {
                    if (!this.isMobile || !this.isActivityColumn) return
                    var a = $(".rightbot_floor2 .slideScroll ul").scrollLeft()
                    var b = this.barDataList.length * $(".rightbot_floor2 ul .barItem").width() - $(window).width() * 0.964
                    var c = a / b * 50
                    $(".scroll-span").css("left", `${c}%`)
                },
            },
            template: `
               <div class="coupon">
                    <div v-if="isShowTopScrollBtn" class="previmg Topscroll" @click="TopB"></div>
                    <div class="slideScroll">
                        <ul v-if="barDataList.length" @scroll="orderScroll">
                            <li v-if="isShowCategory" button_name="floating catgory" @click="openMobileMenu">
                                <a>
                                    <img src="../images/mobile/i0.png" />
                                </a>
                            </li>
                            <li 
                                v-for="(item, index) in barDataList"
                                :class="{barItem: true}" 
                                :button_name="item.button_name"  
                                @mouseenter="toggleCouponBox(item, $event)" 
                                @mouseleave="toggleCouponBox(item, $event)"
                            >
                                <a @click="handleClickItem(item)">
                                    <img :src="item[imageType]" />
                                </a>
                                <div class="cart-count" v-if="isMobile && item.type==='购物车' && cartNum != '0'">{{cartNum}}</div>
                            </li>
                        </ul>
                    </div>
                    <!--  优惠券弹窗     -->
                    <div 
                        v-if="firstTwoCoupons.length > 0 && (couponBoxTop || isHoverCouponBox)" 
                        :class="isCouponBoxBeFixed ? 'left-big-fixed' : 'left-big'"
                        :style="{top:isCouponBoxBeFixed ? fixCouponBottom : (couponBoxTop + 'px'), left: couponBoxLeft + 'px'}"
                        @mouseenter="toggleHoverCouponBox" 
                        @mouseleave="toggleHoverCouponBox"
                    >
                        <img src="//res-stage.samsungeshop.com.cn/images/index/add/youhui-nav.png?20180517112751" alt="">
                        <span @click="handleCloseCouponBox" class="chat-close">
                            <img src="//res-stage.samsungeshop.com.cn/images/index/add/chat-close.png?20180517112751/">
                        </span>
                        <div v-for="(coupon, index) in firstTwoCoupons" v-if="coupon.supportTourists || commonloginstatus" :class="'quan-nav'+ (index + 1)  + ' nav-commen'">
                            <div class="nav-top1">
                                <div class="money-1">
                                    <p v-if="coupon.couponType == 1"><span>￥</span>{{coupon.discount}}</p>
                                    <p v-if="coupon.couponType == 2" class='zhekou'><span>{{formatNum(coupon.discount)}}</span>折</p>
                                </div>
                                <div class="time1">
                                    <p>&nbsp;活动时间：<br>&nbsp;{{formatCouponDate(coupon.startTime)}}<br>-{{formatCouponDate(coupon.endTime)}}</p>
                                </div>
                            </div>
                            <div class="nav-top2"><p>{{coupon.couponName}}</p></div>
                            <div class="nav-top3">
                                <p class="immediatelyReceive">
                                    <a class="pickUp" style="color: #00c3b2;" @click="handleClickImmediatelyReceive(coupon.itemCodes, $event)">立即领取</a>
                                    <a class="use none" style="color: #00c3b2;" :href="coupon.useUrl" target="blank">立即使用</a>
                                </p>
                            </div>
                        </div>
                        <div v-if="couponList.length > 2" class='chat-bottom3 chat-com'><a @click="handleClickShowMore">查看更多</a></div>
                    </div>
                    <div v-if="isShowBottomScrollBtn" class="nextimg BottomScroll" @click="BottomB"></div>
                    <div v-if="isMobile && isActivityColumn && barDataList.length>4" class="qy-div"><span class="scroll-span"></span></div>
               </div>
            `,
        }
        // kv
        this.kv = new Vue({
            el: "#home",
            data: obj,
            components: {
                "swiper-banner": swiperComponent,
                "product-recommend": recommendComponent,
                "marquee-component": marqueeComponent,
                "image-mask": imageMask,
                "fixed-right-bar": fixedRightBar,
            },
            methods: {
                onsizefn() {
                    var w = $(window).width()
                    if (w < 1024) {
                        this.isMobile = true
                    } else {
                        this.isMobile = false
                    }

                    if (w < 1505) {
                        $(".floor").hide()
                        $(".grj").hide()
                        $(".rightbot_floor1").hide()

                        $(".newleft_floor").show()
                        $(".newtop_floor").show()
                        $(".rightbot_floor3").show()
                    } else {
                        $(".floor").show()
                        $(".grj").show()
                        $(".rightbot_floor1").show()
                        $(".newtop_floor").hide()
                        $(".newleft_floor").hide()
                        $(".rightbot_floor3").hide()
                    }
                },
                scroll_Top() {
                    $("html").animate(
                        { scrollTop: "0px" }, 1000,
                    )
                },
                scrollToView(data) {
                    var id = data
                    id = `a${id}`
                    // 锚点
                    $(`#${id}`)[0].scrollIntoView()
                    $("html")[0].scrollTop -= 20
                },
                // 监听滚动条
                handleScroll() {
                    if (this.isMobile) {
                        return
                    }
                    var bannerTop = Math.round($(".banner").offset().top - $(document).scrollTop()) - $("#wrapper .header")[1].clientHeight
                    if (bannerTop >= 1) {
                        // pc悬浮
                        $(".floor").css({
                            position: "absolute",
                            top: 0,
                            left: "2%",
                        })
                        $(".grj").css({
                            position: "absolute",
                            top: 0,
                            right: "2%",
                        })
                        $(".menu_bottom").css({
                            position: "absolute",
                            top: "320px",
                            right: "2%",
                        })

                        $(".newleft_floor").css({
                            position: "absolute",
                            top: 0,
                            left: "-40px",
                        })
                        $(".newtop_floor").css({
                            position: "absolute",
                            top: 0,
                            left: "101%",
                        })
                        $(".rightbot_floor3").css({
                            position: "absolute",
                            top: "210px",
                            left: "101%",
                        })
                    } else {
                        // 避免页面报错
                        if (!$(".header-fixed").length) {
                            return
                        }
                        var top = $(".header-fixed")[1].clientHeight
                        $(".floor").css({
                            position: "fixed",
                            top: `${top}px`,
                        })
                        $(".grj").css({
                            position: "fixed",
                            top: `${top}px`,
                        })
                        $(".menu_bottom").css({
                            position: "fixed",
                            top: `${top + 320}px`,
                        })

                        $(".newleft_floor").css({
                            position: "fixed",
                            top: `${top}px`,
                            left: `${$(".newleft_floor")[0].getBoundingClientRect().left}px`,
                        })
                        $(".newtop_floor").css({
                            position: "fixed",
                            top: `${top}px`,
                            left: `${$(".newtop_floor")[0].getBoundingClientRect().left}px`,
                        })
                        $(".rightbot_floor3").css({
                            position: "fixed",
                            top: `${top + 210}px`,
                            left: `${$(".rightbot_floor3")[0].getBoundingClientRect().left}px`,
                        })
                    }
                    if ($(window).scrollTop() === 0) {
                        $(".top_model").hide()
                    } else {
                        $(".top_model").show()
                    }
                },
            },
            mounted() {
                var that = this
                // 监听滚动条
                window.addEventListener("scroll", this.handleScroll)

                // 判断是否是移动端
                window.onresize = () => {
                    that.onsizefn()
                }
                this.onsizefn()
                initOmnitrueEvent()
            },
        })
    },
    removeLoading() {
        // 动态数据读完就把LOADING消失，显示界面。
        $(".all_mc").show()
        $(".loading").hide()
    },
}

$(document).ready(() => {
    home.init()
})
