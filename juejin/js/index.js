window.addEventListener('load', function () {
    axios.defaults.baseURL = 'http://47.100.42.144:3389';
    // 在指定节点前插入节点
    function insertAfter(newElement, targetElement) {
        var parent = targetElement.parentNode;
        if (parent.lastChild == targetElement) {
            parent.appendChild(newElement);
        } else {
            parent.insertBefore(newElement, targetElement.nextSibling);
        }
    }
    //除了指定节点，增添其他节点的类
    function addClasslist(arr_1, ele_1, cla, callback) {
        for (let i = 0; i < arr_1.length; i++) {
            arr_1[i].classList.add(cla);
        }
        ele_1.classList.remove(cla);
        callback && callback();
    }
    // 除了指定节点，删除其他节点的类
    function cleanClasslist(arr_1, ele_1, cla, callback) {
        for (let i = 0; i < arr_1.length; i++) {
            arr_1[i].classList.remove(cla);
        }
        ele_1.classList.add(cla);
        callback && callback();
    }
    // 隐藏节点
    function hidden() {
        for (let i = 0; i < arguments.length; i++) {
            for (let j = 0; j < arguments[i].length; j++) {
                arguments[i][j].classList.add('hidden');
            }
        }
    }
    // 显示节点
    function block() {
        for (let i = 0; i < arguments.length; i++) {
            for (let j = 0; j < arguments[i].length; j++) {
                arguments[i][j].classList.remove('hidden');
            }
        }
    }
    // 点击ele_1，显示或隐藏ele_2
    function hiddenBlock(ele_1, ele_2, callback) {
        if (arguments.length != 1) {
            ele_1.onclick = function (e) {
                e.stopPropagation();
                ele_2.classList.contains('hidden') ? ele_2.classList.remove('hidden') : ele_2.classList.add('hidden');
                callback && callback();
            }
        } else {
            ele_1.classList.contains('hidden') ? ele_1.classList.remove('hidden') : ele_1.classList.add('hidden');
        }
    }
    // 点击arr_1，显示或隐藏arr_2
    function hiddenBlocks(arr_1, arr_2, callback) {
        if (arguments.length != 1) {
            for (let i = 0; i < arr_1.length; i++) {
                arr_1[i].onclick = function (e) {
                    e.stopPropagation();
                    arr_2[i].classList.contains('hidden') ? arr_2[i].classList.remove('hidden') : arr_2[i].classList.add('hidden');
                    callback && callback();
                }
            }
        } else {
            for (let i = 0; i < arr_1.length; i++) {
                arr_1[i].classList.contains('hidden') ? arr_1[i].classList.remove('hidden') : arr_1[i].classList.add('hidden');
            }
        }
    }
    // index首页
    var body = document.body;
    var header = document.querySelector('.main-header');
    var aside = document.querySelector('.aside-fixed');
    var last_scroll = 0;
    // 配置首页侧边栏滚动显示与隐藏
    window.onscroll = function () {
        let t = document.documentElement.scrollTop || document.body.scrollTop;
        t >= 200 ? header.style.top = -60 + 'px' : 0;
        last_scroll > t ? header.style.top = 0 : 0;
        last_scroll > t ? aside.style.top = 120 + 'px' : aside.style.top = 60 + 'px';
        t >= 1420 ? aside.style.opacity = 1 : aside.style.top = 60 + 'px';
        t >= 1420 ? 0 : aside.style.opacity = 0;
        last_scroll = t;
    }
    // 设置'我的首页'点击事件
    var myhome = document.querySelectorAll('.myhomepage');
    for (let i = 0; i < myhome.length; i++) {
        myhome[i].onclick = function () {
            addClasslist([index, editor, homepage, view, article_view], homepage, 'hidden', whenHome());
        }
    }
    // 获取首页待用节点
    var index = document.querySelector('#index');
    var avatar = document.querySelectorAll('.menu');
    var avatar_more = document.querySelectorAll('.user-dropdown-list');
    var add_btn = document.querySelectorAll('.add-btn');
    var add_more = document.querySelectorAll('.add-more');
    var add_more_list = document.querySelectorAll('.add-more-list');
    var share = document.querySelector('.article-container').querySelectorAll('.share');
    var share_panel = document.querySelector('.article-container').querySelectorAll('.share-panel');
    var back_index = this.document.querySelectorAll('.back-index');
    var tip = index.querySelector('.tip');
    // 绑定返回首页事件
    back_index.forEach(val => {
        val.onclick = function () {
            addClasslist([index, editor, homepage, view, article_view], index, 'hidden', listAticles());
        }
    })
    var banner = document.querySelectorAll('.side-bar.banner');
    var close_btn = document.querySelectorAll('.banner-close-btn');
    // 绑定显示与隐藏事件
    hiddenBlocks(avatar, avatar_more);
    hiddenBlocks(share, share_panel);
    hiddenBlocks(add_more, add_more_list)
    hiddenBlocks(close_btn, banner);
    body.addEventListener('click', function (e) {
        f1(share_panel);
        f1(avatar_more);
        f1(add_more_list);
        f1(publishPanel);
    })
    // 有显示就隐藏，没有就0
    function f1(arr_1) {
        for (let i = 0; i < arr_1.length; i++) {
            arr_1[i].classList.contains('hidden') ? 0 : arr_1[i].classList.add('hidden');
        }
    }
    // 读取首页文章列表
    function listAticles() {
        let page = 1;
        let article_container = index.querySelector('.article-container');
        let article_nav_list = index.querySelector('.article-nav-list');
        let article_mode = article_container.querySelector('.article-context.article');
        let loadding = index.querySelector('.empty-box.loadding');
        article_container.innerHTML = '';
        article_container.appendChild(article_nav_list);
        article_container.appendChild(article_mode);
        article_container.appendChild(loadding);
        loadding.classList.remove('hidden');
        let rail = loadding.querySelector('.rail');
        let thea = 10;
        // 开启加载
        let t = setInterval(function () {
            rail.style.transform = 'rotate(' + thea + 'deg)';
            thea = thea > 180 ? 0 : thea + 4;
        }, 20)
        function getArticles(page) {
            axios({
                method: 'GET',
                url: '/article/getArticle',
                params: {
                    'userId': userId,
                    'page': page,
                }
            }).then(res => {
                let all = res.data.data;
                for (let i = 0; i < all.length; i++) {
                    let clone_item = article_mode.cloneNode(true);
                    clone_item.dataset.articleid = all[i].articleId;
                    clone_item.dataset.authorid = all[i].authorId;
                    let author_name = clone_item.querySelector('.author-name');
                    author_name.dataset.authorid = all[i].authorId;
                    author_name.innerText = all[i].author;
                    let title = clone_item.querySelector('.title');
                    title.innerText = all[i].title;
                    let commentnum = clone_item.querySelector('.comment .count');
                    commentnum.innerText = all[i].commentNum;
                    let thumbup_btn = clone_item.querySelector('.thumbup');
                    let dislike_btn = clone_item.querySelector('.notthumbup');
                    dislike_btn.dataset.disflag = all[i].isDislike;
                    dislike_btn.dataset.articleid = all[i].articleId;
                    thumbup_btn.dataset.flag = all[i].isThumbUp;
                    thumbup_btn.dataset.articleid = all[i].articleId;
                    let img = thumbup_btn.querySelector('img');
                    let thumbupnum = thumbup_btn.querySelector('.count');
                    thumbupnum.innerText = all[i].thumbUpNum;
                    thumbup_btn.dataset.flag == 'true' ? img.src = img_dataed : img.src = img_data;
                    thumbup_btn.dataset.flag == 'true' ? thumbup_btn.classList.add('.liked') : thumbup_btn.classList.remove('.liked');
                    dislike_btn.dataset.disflag == 'true' ? dislike_btn.classList.add('dislike') : dislike_btn.classList.remove('dislike');
                    article_container.appendChild(clone_item);
                }
                // 若还有,则继续请求文章
                if (all.length == 10) {
                    getArticles(++page)
                } else {
                    clearInterval(t);
                    t = null;
                    loadding.classList.add('hidden');
                    let a = article_container.querySelectorAll('.article-context.article')
                    for(let j = 1; j < a.length; j++) {
                        a[j].classList.remove('hidden');
                    }
                    article_click(index);
                    name_click(index);
                    thumbUp(index);
                    disLike(index);
                }
            })
        }
        getArticles(page);
    }

    // login模块
    var userId = 0;
    var username = '';
    var intro = '';
    var useravatar = '';
    var login_bar_wrap = document.querySelector('.login-bar-wrap');
    var judgeBtn = login_bar_wrap.querySelector('.login-btn');
    var loginClose = login_bar_wrap.querySelector('.close-btn');
    var loginBtn = header.querySelector('.login');
    var notification = document.querySelectorAll('.notification');
    hiddenBlock(loginBtn, login_bar_wrap);
    hiddenBlock(loginClose, login_bar_wrap);

    // 读取登录者信息
    function getUserinfo() {
        axios({
            method: 'GET',
            url: '/user/getUserInfo',
            params: {
                'userId': userId,
            }
        }).then(res => {
            username = res.data.data.nickname;
            intro = res.data.data.introduction;
            useravatar = res.data.data.avatar;
            let user_im = document.querySelectorAll('.useravatar');
            user_im.forEach(val => {
                val.src = axios.defaults.baseURL + '/' + useravatar;
            })
            let editor_avatar = editor.querySelector('.avatar-img');
            editor_avatar.style.backgroundImage = 'url(' + axios.defaults.baseURL + "/" + useravatar + ')';
        })
    }
    // 登录框图片变换
    function imgTurn() {
        var im = login_bar_wrap.querySelector('.panda').querySelector('img');
        login_bar_wrap.addEventListener('click', function (e) {
            if (e.target.id === 'login-code') {
                im.src = 'images/panda2.png'
            } else if (e.target.id === 'login-psw') {
                im.src = 'images/panda3.png'
            } else {
                im.src = 'images/panda1.png'
            }
        })
    }
    imgTurn();
    // 登录成功
    function loginSuccess() {
        tip.classList.add('hidden');
        hiddenBlock(loginBtn);
        hiddenBlock(login_bar_wrap);
        hiddenBlocks(notification);
        hiddenBlocks(avatar);
        getUserinfo();
        listAticles();
        if (flag) {
            likeItem(userId);
        }
        flag = false;
    }
    // 注销成功
    function logoutSuccess() {
        axios({
            method: 'POST',
            url: '/user/logout',
            data: {
                'userId': userId,
            }
        }).then(res => {
            if (res.data.data.message == '退出登录成功') {
                hiddenBlocks(notification);
                hiddenBlocks(avatar);
                hiddenBlock(loginBtn);
                addClasslist([index, editor, homepage, view, article_view], index, 'hidden');
                userId = 0;
                username = '';
                intro = '';
                // 重新刷新网页，重置数据
                window.location.reload();
            } else { alert('退出登录失败') }
        })
    }
    // 登录提醒
    function loginAlert() {
        var alertBox = login_bar_wrap.querySelector('.alert-box');
        var loginCode = login_bar_wrap.querySelector('#login-code');
        var loginPsw = login_bar_wrap.querySelector('#login-psw');
        judgeBtn.addEventListener('click', function (e) {
            //取消提交表单
            e.preventDefault();
            let div = document.createElement('div');
            div.className = 'alert';
            if (loginCode.value == '') {
                div.innerHTML = '请输入账号'
                alertBox.appendChild(div);
            } else if (loginPsw.value == '') {
                div.innerHTML = '请输入密码'
                alertBox.appendChild(div);
            } else {
                axios({
                    method: 'POST',
                    url: '/user/login',
                    data: {
                        "username": loginCode.value,
                        "password": loginPsw.value,
                    }
                }).then(res => {
                    if (res.data.data.message == '登录失败') {
                        div.innerHTML = '密码错误'
                        alertBox.appendChild(div);
                    } else {
                        div.innerHTML = '登录成功'
                        alertBox.appendChild(div);
                        userId = res.data.data.userId;
                        loginSuccess();
                    }
                })
            }
            setTimeout(function () {
                alertBox.removeChild(alertBox.children[0]);
            }, 2000)
        })
    }
    loginAlert();
    // 登出
    function logout() {
        let logout_btn = document.querySelectorAll('.logout');
        for (let i = 0; i < logout_btn.length; i++) {
            logout_btn[i].onclick = function () {
                logoutSuccess();
            }
        }
    }
    logout();


    // editor模块
    var editor = document.querySelector('#editor')
    var write_content = editor.querySelector('.write-content');
    var content_left = editor.querySelector('.content-left');
    var content_right = editor.querySelector('.content-right');
    var p = content_right.querySelector('p');
    var wordCount = editor.querySelector('.word-count');
    var wordCow = editor.querySelector('.word-cow');
    var togetherScoll = editor.querySelector('.together');
    var backTop = editor.querySelector('.backtop');
    var publish = editor.querySelector('.publish')
    var publishBtn = document.querySelector('.publish-btn');
    var publishPanel = publish.querySelector('.publish-panel');
    var textarea = publishPanel.querySelector('textarea');
    var summaryCount = publishPanel.querySelector('.summary-count');
    var leftScoll = true;
    var rightScoll = true;
    var editor_title = document.querySelector('.editor-title');
    // 判断登录状态进行跳转
    for (let i = 0; i < add_btn.length; i++) {
        add_btn[i].onclick = function () {
            if (userId == 0) {
                hiddenBlock(login_bar_wrap);
            } else {
                addClasslist([index, editor, homepage, view, article_view], editor, 'hidden');
            }
        }
    }
    // 点击板块，聚焦文本框
    content_left.addEventListener('click', function () {
        write_content.focus();
    })
    write_content.onfocus = () => {
        var range = document.createRange();
        range.selectNodeContents(write_content);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
    hiddenBlock(publish, publishPanel)

    // 实时预览文本
    function textChange() {
        let timer = setInterval(function () {
            let textareaCount = textarea.value;
            let content = write_content.innerText;
            let cow = write_content.offsetHeight / 21 == 0 ? 1 : write_content.offsetHeight / 21;
            p.innerText = content;
            summaryCount.innerText = textareaCount.length + '/100';
            wordCount.innerText = '字数：' + content.length;
            wordCow.innerText = '行数：' + cow;
        }, 500)
        clearInterval(timer);
        write_content.addEventListener('blur', function (e) {
            clearInterval(timer);
        })
        write_content.addEventListener('focus', function (e) {
            timer = setInterval(function () {
                let textareaCount = textarea.value;
                let content = write_content.innerText;
                let cow = write_content.offsetHeight / 21 == 1 ? 1 : write_content.offsetHeight / 21 - 1;
                p.innerText = content;
                summaryCount.innerText = textareaCount.length + '/100';
                wordCount.innerText = '字数：' + content.length;
                wordCow.innerText = '行数：' + cow;
            }, 500);
        })
    }
    textChange();
    // 同步滚动
    function scoll() {
        content_left.onscroll = (e) => {
            if (leftScoll && togetherScoll.checked == true) {
                content_right.scrollTop = content_left.scrollTop;
                // content_right.scrollTop = flag == 0? content_left.scrollTop + 273 : content_left.scrollTop - 273;
                rightScoll = false;
            } else { leftScoll = true }
        };
        content_right.onscroll = () => {
            if (rightScoll && togetherScoll.checked == true) {
                content_left.scrollTop = content_right.scrollTop;
                // content_left.scrollTop = flag == 0? content_right.scrollTop + 273 : content_right.scrollTop - 273;
                leftScoll = false;
            } else { rightScoll = true }
        }
    }
    scoll();
    togetherScoll.onclick = () => { scoll() }
    // 返回顶部
    backTop.onclick = () => { content_right.scrollTop = content_left.scrollTop = 0 }

    // 发布文章
    publishBtn.onclick = function () {
        axios({
            method: 'POST',
            url: '/article/writeArticle',
            data: {
                'userId': userId,
                'title': editor_title.value,
                'content': write_content.innerText,
            }
        }).then(res => {
            editor_title.value = '';
            write_content.innerText = '';
            p.innerText = '';
            addClasslist([index, editor, homepage, view, article_view], homepage, 'hidden', whenHome());
        })
    }


    // 主页
    // 获取主页待用节点
    var homepage = document.querySelector('#homepage');
    var post_init = homepage.querySelector('.post-list-box');
    var post_list_box = homepage.querySelector('.post-list-box');
    var loadding_box = homepage.querySelector('.empty-box');
    var like_list_box = homepage.querySelector('.like-list-box');
    var concern_list_box = homepage.querySelector('.concern-list-box');
    var interest_box = homepage.querySelector('.interest');
    var interested_box = homepage.querySelector('.interested');
    var interest_lab = homepage.querySelector('.interest-lab');
    var interested_lab = homepage.querySelector('.interested-lab');
    var img_dataed = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZD0iTTAgMGgxNnYxNkgweiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiM2Q0JENDUiIGQ9Ik00LjIzNCA2LjY5M3Y3LjI0M0gyLjg4MWMtLjQ4NiAwLS44ODEtLjQ5Mi0uODgxLTEuMDk1VjcuODc1YzAtLjYzLjQxMi0xLjE4Mi44OC0xLjE4MmgxLjM1NHptMy42ODgtMy43QzguMDEgMi40MDQgOC40OSAxLjk5IDkuMDE4IDJjLjc1NC4wMTUgMS4yMDQuNjYzIDEuMzYuOTgzLjI4NC41ODUuMjkyIDEuNTQ5LjA5NyAyLjE2Ny0uMTc3LjU2LS41ODYgMS4yOTYtLjU4NiAxLjI5NmgzLjA2NmMuMzI0IDAgLjYyNS4xNjQuODI2LjQ0OS4yMDQuMjkuMjcuNjY4LjE3OCAxLjAxMWwtMS4zODcgNS4xODNjLS4xMjYuNDk5LS41NDQuODQ3LTEuMDE2Ljg0N0g1LjUzVjYuNjkzYzEuMzg1LS4zMDkgMi4yMzYtMi42MzIgMi4zOTItMy43eiIvPgogICAgPC9nPgo8L3N2Zz4K';
    var img_data = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZD0iTTAgMGgxNnYxNkgweiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiNCMkJBQzIiIGQ9Ik00LjIzNCA2LjY5M3Y3LjI0M0gyLjg4MWMtLjQ4NiAwLS44ODEtLjQ5Mi0uODgxLTEuMDk1VjcuODc1YzAtLjYzLjQxMi0xLjE4Mi44OC0xLjE4MmgxLjM1NHptMy42ODgtMy43QzguMDEgMi40MDQgOC40OSAxLjk5IDkuMDE4IDJjLjc1NC4wMTUgMS4yMDQuNjYzIDEuMzYuOTgzLjI4NC41ODUuMjkyIDEuNTQ5LjA5NyAyLjE2Ny0uMTc3LjU2LS41ODYgMS4yOTYtLjU4NiAxLjI5NmgzLjA2NmMuMzI0IDAgLjYyNS4xNjQuODI2LjQ0OS4yMDQuMjkuMjcuNjY4LjE3OCAxLjAxMWwtMS4zODcgNS4xODNjLS4xMjYuNDk5LS41NDQuODQ3LTEuMDE2Ljg0N0g1LjUzVjYuNjkzYzEuMzg1LS4zMDkgMi4yMzYtMi42MzIgMi4zOTItMy43eiIvPgogICAgPC9nPgo8L3N2Zz4K';
    // 为ele可点赞绑定点赞事件
    function thumbUp(ele, callback) {
        let thumbup_btn = ele.querySelectorAll('.thumbup');
        for (let i = 0; i < thumbup_btn.length; i++) {
            let thumbup_count = thumbup_btn[i].querySelector('.count');
            let img = thumbup_btn[i].querySelector('img');
            thumbup_btn[i].onclick = function (e) {
                e.stopPropagation();
                thumbup_btn[i].dataset.flag = thumbup_btn[i].dataset.flag == 'true' ? 'false' : 'true';
                thumbup_btn[i].dataset.flag == 'true' ? thumbup_btn[i].classList.add('.liked') : thumbup_btn[i].classList.remove('.liked');
                thumbup_btn[i].dataset.flag == 'true' ? img.src = img_dataed : img.src = img_data;
                thumbup_count.innerText = thumbup_btn[i].dataset.flag == 'true' ? Number(thumbup_count.innerText) + 1 : Number(thumbup_count.innerText) - 1;
                axios({
                    method: 'POST',
                    url: '/article/thumbUpArticle',
                    data: {
                        'userId': userId,
                        'articleId': thumbup_btn[i].dataset.articleid,
                        'flag': thumbup_btn[i].dataset.flag,
                    }
                }).then(res => {
                    alert('点赞成功');
                    callback && callback();
                })
            }
        }
    }
    // 为ele可点踩绑定点踩事件
    function disLike(ele, callback) {
        let dislike_btn = ele.querySelectorAll('.notthumbup');
        for (let i = 0; i < dislike_btn.length; i++) {
            dislike_btn[i].onclick = function (e) {
                e.stopPropagation();
                dislike_btn[i].dataset.disflag = dislike_btn[i].dataset.disflag == 'true' ? 'false' : 'true';
                dislike_btn[i].dataset.disflag == 'true' ? dislike_btn[i].classList.add('dislike') : dislike_btn[i].classList.remove('dislike');
                axios({
                    method: 'POST',
                    url: '/article/dislikeArticle',
                    data: {
                        'userId': userId,
                        'articleId': dislike_btn[i].dataset.articleid,
                        'flag': dislike_btn[i].dataset.disflag,
                    }
                }).then(res => {
                    callback && callback();
                    alert('点击成功')
                })
            }
        }
    }
    // 为主页配置不同用户的信息
    function userMes(id) {
        axios({
            method: 'GET',
            url: '/user/getUserInfo',
            params: {
                'userId': id,
            }
        }).then(res => {
            let otheravatar = homepage.querySelector('.avatar.useravatar.otheravatar');
            otheravatar.src = axios.defaults.baseURL + '/' + res.data.data.avatar;
            let name = homepage.querySelector('.username.user-name');
            name.innerText = res.data.data.nickname;
            let intro = homepage.querySelector('.intro');
            intro.innerHTML = res.data.data.introduction != '' ? res.data.data.introduction : '此人很低调,没有自我介绍';
        })
    }
    // 初始化主页
    function homepageInit(id) {
        var list_body = homepage.querySelector('.list-body');
        var post_list_box = homepage.querySelector('.post-list-box');
        var like_list_box = homepage.querySelector('.like-list-box');
        var concern_list_box = homepage.querySelector('.concern-list-box');
        var concern = homepage.querySelector('.concern');
        var like = homepage.querySelector('.like')
        var setting_btn = homepage.querySelector('.setting-btn');
        id == userId ? setting_btn.classList.remove('hidden') : setting_btn.classList.add('hidden');
        var nav_item = homepage.querySelectorAll('.header-content .nav-item');
        var more_nav_item = homepage.querySelector('.more-nav-item');
        var like_nav_item = homepage.querySelector('.like-nav-item');
        var more_more_pannel = homepage.querySelector('.more-more-panel');
        var like_more_pannel = homepage.querySelector('.like-more-panel');
        hiddenBlocks([like_nav_item, more_nav_item], [like_more_pannel, more_more_pannel]);
        cleanClasslist(nav_item, nav_item[1], 'active');
        addClasslist([post_list_box, like_list_box, concern_list_box], post_list_box, 'hidden');
        nav_item[1].onclick = function () {
            if (!nav_item[1].classList.contains('active')) {
                postItem(id);
                cleanClasslist(nav_item, nav_item[1], 'active');
                addClasslist([post_list_box, like_list_box, concern_list_box, loadding_box], loadding_box, 'hidden');
            }
        }
        like.onclick = function () {
            if (!nav_item[3].classList.contains('active')) {
                likeItem(id);
                cleanClasslist(nav_item, nav_item[3], 'active');
                addClasslist([post_list_box, like_list_box, concern_list_box, loadding_box], loadding_box, 'hidden');
            }
        }
        concern.onclick = function () {
            nav_item[5].classList.contains('active') ? 0 : concernItem(id);
            cleanClasslist(nav_item, nav_item[5], 'active');
            addClasslist([post_list_box, like_list_box, concern_list_box, loadding_box], loadding_box, 'hidden');
            cleanClasslist([interest_lab, interested_lab], interest_lab, 'active');
            addClasslist([interest_box, interested_box], interest_box, 'hidden');
        }
        interest_lab.onclick = function () {
            if (!interest_lab.classList.contains('avtive')) {
                cleanClasslist([interest_lab, interested_lab], interest_lab, 'active');
                addClasslist([interest_box, interested_box, loadding_box], loadding_box, 'hidden');
                concernItem(id);
            }
        }
        interested_lab.onclick = function () {
            if (!interested_lab.classList.contains('avtive')) {
                cleanClasslist([interest_lab, interested_lab], interested_lab, 'active');
                addClasslist([interest_box, interested_box, loadding_box], loadding_box, 'hidden');
                concernedItem(id);
            }
        }
        userMes(id);
    }
    // 列出用户写的文章
    function postItem(id, callback) {
        callback && callback();
        // 显示加载
        addClasslist([post_list_box, loadding_box], loadding_box, 'hidden');
        let rail = loadding_box.querySelector('.rail');
        let thea = 10;
        // 开启加载
        let t = setInterval(function () {
            rail.style.transform = 'rotate(' + thea + 'deg)';
            thea = thea > 180 ? 0 : thea + 4;
        }, 20)
        let articles = [];
        axios({
            method: 'GET',
            url: '/user/getUserWriteArticles',
            params: {
                'userId': id,
            }
        }).then(res => {
            let re = []
            articles = res.data.data;
            axios({
                method: 'GET',
                url: '/user/getUserLikeArticles',
                params: {
                    'userId': userId,
                }
            }).then(res => {
                re = !res.data.data.message ? res.data.data : null;
                let post_itme = post_list_box.querySelector('.post-item');
                let entry_list = post_list_box.querySelector('.entry-list');
                let empty_box = post_list_box.querySelector('.empty');
                let more = post_list_box.querySelector('.article-more.item.more')
                id != userId ? more.classList.add('hidden') : more.classList.remove('hidden')
                entry_list.innerHTML = '';
                entry_list.appendChild(post_itme);
                entry_list.appendChild(empty_box);
                articles.length = articles.length == undefined ? 0 : articles.length;
                if (articles.length != 0) {
                    for (let i = 0; i < articles.length; i++) {
                        let item = post_itme.cloneNode(true);
                        item.classList.remove('hidden');
                        entry_list.appendChild(item);
                    }
                    let post_items = post_list_box.querySelectorAll('.post-item');
                    post_items[0].classList.add('hidden');
                    empty_box.classList.add('hidden');
                    for (let i = 1; i < articles.length + 1; i++) {
                        post_items[i].dataset.articleid = articles[i - 1].articleId;
                        let article_name = post_items[i].querySelector('.username');
                        article_name.dataset.authorid = id;
                        article_name.innerText = articles[i - 1].author;
                        let article_title = post_items[i].querySelector('.user-article-title');
                        article_title.innerText = articles[i - 1].title;
                        let del = post_items[i].querySelector('.delete-article');
                        del.dataset.articleid = articles[i - 1].articleId;
                        let thumbup = post_items[i].querySelector('.thumbup-count');
                        thumbup.innerText = articles[i - 1].thumbUpNum;
                        let comment = post_items[i].querySelector('.comment-count');
                        comment.innerText = articles[i - 1].commentNum;
                        let thumbup_btn = post_items[i].querySelector('.thumbup');
                        let img = thumbup_btn.querySelector('img');
                        thumbup_btn.dataset.articleid = articles[i - 1].articleId;
                        thumbup_btn.dataset.flag = false;
                        if (re) {
                            for (let j = 0; j < re.length; j++) {
                                if (thumbup_btn.dataset.articleid == re[j].articleId) {
                                    thumbup_btn.dataset.flag = true;
                                    break;
                                }
                            }
                        }
                        thumbup_btn.dataset.flag == 'true' ? img.src = img_dataed : img.src = img_data;
                        thumbup_btn.dataset.flag == 'true' ? thumbup_btn.classList.add('.liked') : thumbup_btn.classList.remove('.liked');
                        let article_more = homepage.querySelectorAll('.article-more');
                        let article_more_list = homepage.querySelectorAll('.article-more-list');
                        hiddenBlocks(article_more, article_more_list);
                        id == userId ? deleteArticle() : 0;
                        thumbUp(post_list_box);
                        article_click(post_list_box);
                        name_click(post_list_box);
                    }
                } else {
                    post_itme.classList.add('hidden');
                    empty_box.classList.remove('hidden');
                }
                addClasslist([post_list_box, loadding_box], post_list_box, 'hidden')
                // 清除加载定时器
                clearInterval(t);
                t = null;
            })
        })
    }
    // 列出用户点赞的文章
    function likeItem(id, is, callback) {
        let title_num = homepage.querySelector('.item-count.title-num');
        let like_num = homepage.querySelector('.more-item.like');
        title_num.innerText = '';
        like_num.innerText = '文章';
        let articles = [];
        // 显示加载
        addClasslist([like_list_box, loadding_box], loadding_box, 'hidden');
        let rail = loadding_box.querySelector('.rail');
        let thea = 10;
        // 开启加载
        let t = setInterval(function () {
            rail.style.transform = 'rotate(' + thea + 'deg)';
            thea = thea > 180 ? 0 : thea + 4;
        }, 20)
        axios({
            method: 'GET',
            url: '/user/getUserLikeArticles',
            params: {
                'userId': id,
            }
        }).then(res => {
            let re = []
            articles = res.data.data;
            // 判断是否是登录者的点赞文章
            if (id != userId) {
                axios({
                    method: 'GET',
                    url: '/user/getUserLikeArticles',
                    params: {
                        'userId': userId,
                    }
                }).then(res => {
                    re = !res.data.data.message ? res.data.data : null;
                    let like_list_box = homepage.querySelector('.like-list-box');
                    let post_itme = like_list_box.querySelector('.post-item');
                    let entry_list = like_list_box.querySelector('.entry-list');
                    let empty_box = like_list_box.querySelector('.empty');
                    let article_num = like_list_box.querySelector('.sub-type.active');
                    entry_list.innerHTML = '';
                    entry_list.appendChild(post_itme);
                    entry_list.appendChild(empty_box);
                    articles.length = articles.length == undefined ? 0 : articles.length;
                    title_num.innerText = articles.length;
                    like_num.innerText = '文章' + articles.length;
                    article_num.innerText = '文章(' + articles.length + ')';
                    if (articles.length != 0) {
                        for (let i = 0; i < articles.length; i++) {
                            let item = post_itme.cloneNode(true);
                            item.classList.remove('hidden');
                            entry_list.appendChild(item);
                        }
                        let post_items = like_list_box.querySelectorAll('.post-item');
                        post_items[0].classList.add('hidden');
                        empty_box.classList.add('hidden');
                        for (let i = 1; i < articles.length + 1; i++) {
                            post_items[i].dataset.articleid = articles[i - 1].articleId;
                            let article_name = post_items[i].querySelector('.username');
                            article_name.innerText = articles[i - 1].author;
                            article_name.dataset.authorid = articles[i - 1].authorId;
                            let article_title = post_items[i].querySelector('.user-article-title');
                            article_title.innerText = articles[i - 1].title;
                            let thumbup = post_items[i].querySelector('.thumbup-count');
                            thumbup.innerText = articles[i - 1].thumbUpNum;
                            let comment = post_items[i].querySelector('.comment-count');
                            comment.innerText = articles[i - 1].commentNum;
                            let thumbup_btn = post_items[i].querySelector('.thumbup');
                            let img = thumbup_btn.querySelector('img');
                            thumbup_btn.dataset.articleid = articles[i - 1].articleId;
                            thumbup_btn.dataset.flag = id == userId ? true : false;
                            if (re) {
                                for (let j = 0; j < re.length; j++) {
                                    if (thumbup_btn.dataset.articleid == re[j].articleId) {
                                        thumbup_btn.dataset.flag = true;
                                        break;
                                    }
                                }
                            }
                            thumbup_btn.dataset.flag == 'true' ? img.src = img_dataed : img.src = img_data;
                            thumbup_btn.dataset.flag == 'true' ? thumbup_btn.classList.add('.liked') : thumbup_btn.classList.remove('.liked');
                            callback && callback();
                            thumbUp(like_list_box);
                            article_click(like_list_box);
                            name_click(like_list_box);
                        }
                    } else {
                        post_itme.classList.add('hidden');
                        empty_box.classList.remove('hidden');
                    }
                    // 如果是被辅助调用,则不显示用户点赞的文章
                    if (is) {
                        loadding_box.classList.add('hidden');
                    } else { addClasslist([like_list_box, loadding_box], like_list_box, 'hidden'); }
                    // 清除定时器
                    clearInterval(t);
                    t = null;
                })
            } else {
                let post_itme = like_list_box.querySelector('.post-item');
                let entry_list = like_list_box.querySelector('.entry-list');
                let empty_box = like_list_box.querySelector('.empty');
                let article_num = like_list_box.querySelector('.sub-type.active');
                entry_list.innerHTML = '';
                entry_list.appendChild(post_itme);
                entry_list.appendChild(empty_box);
                articles.length = articles.length == undefined ? 0 : articles.length;
                title_num.innerText = articles.length;
                like_num.innerText = '文章' + articles.length;
                article_num.innerText = '文章(' + articles.length + ')';
                if (articles.length != 0) {
                    for (let i = 0; i < articles.length; i++) {
                        let item = post_itme.cloneNode(true);
                        item.classList.remove('hidden');
                        entry_list.appendChild(item);
                    }
                    let post_items = like_list_box.querySelectorAll('.post-item');
                    post_items[0].classList.add('hidden');
                    empty_box.classList.add('hidden');
                    for (let i = 1; i < articles.length + 1; i++) {
                        post_items[i].dataset.articleid = articles[i - 1].articleId;
                        let article_name = post_items[i].querySelector('.username');
                        article_name.innerText = articles[i - 1].author;
                        article_name.dataset.authorid = articles[i - 1].authorId;
                        let article_title = post_items[i].querySelector('.user-article-title');
                        article_title.innerText = articles[i - 1].title;
                        let thumbup = post_items[i].querySelector('.thumbup-count');
                        thumbup.innerText = articles[i - 1].thumbUpNum;
                        let comment = post_items[i].querySelector('.comment-count');
                        comment.innerText = articles[i - 1].commentNum;
                        let thumbup_btn = post_items[i].querySelector('.thumbup');
                        let img = thumbup_btn.querySelector('img');
                        thumbup_btn.dataset.articleid = articles[i - 1].articleId;
                        thumbup_btn.dataset.flag = id == userId ? true : false;
                        thumbup_btn.dataset.flag = true;
                        thumbup_btn.dataset.flag == 'true' ? img.src = img_dataed : img.src = img_data;
                        thumbup_btn.dataset.flag == 'true' ? thumbup_btn.classList.add('.liked') : thumbup_btn.classList.remove('.liked');
                        callback && callback();
                        thumbUp(like_list_box);
                        article_click(like_list_box);
                        name_click(like_list_box);
                    }
                } else {
                    post_itme.classList.add('hidden');
                    empty_box.classList.remove('hidden');
                }
                // 如果是被辅助调用,则不显示用户点赞的文章
                if (is) {
                    loadding_box.classList.add('hidden');
                } else {
                    addClasslist([like_list_box, loadding_box], like_list_box, 'hidden');
                }
                // 清除定时器
                clearInterval(t);
                t = null;

            }
        })
    }
    // 列出用户的关注
    function concernItem(id) {
        let mysubscribe = [];
        // 显示加载
        addClasslist([concern_list_box, loadding_box], loadding_box, 'hidden');
        let rail = loadding_box.querySelector('.rail');
        let thea = 10;
        // 开启加载
        let t = setInterval(function () {
            rail.style.transform = 'rotate(' + thea + 'deg)';
            thea = thea > 180 ? 0 : thea + 4;
        }, 20)
        axios({
            method: 'GET',
            url: '/user/getMySubscribe',
            params: {
                'userId': id,
            }
        }).then(res => {
            let re = [];
            mysubscribe = res.data.data;
            if (id != userId) {
                // 获取登录者的关注, 判断该id的关注者是否与登录者的关注者相同,以修改关注按钮
                axios({
                    method: 'GET',
                    url: '/user/getMySubscribe',
                    params: {
                        'userId': userId,
                    }
                }).then(res => {
                    re = !res.data.data.message ? res.data.data : null;
                    let interest = concern_list_box.querySelector('.interest');
                    let post_itme = interest.querySelector('.item');
                    let empty_box = interest.querySelector('.empty');
                    interest.innerHTML = '';
                    interest.appendChild(post_itme);
                    interest.appendChild(empty_box);
                    mysubscribe.length = mysubscribe.length == undefined ? 0 : mysubscribe.length;
                    if (mysubscribe.length != 0) {
                        for (let i = 0; i < mysubscribe.length; i++) {
                            let item = post_itme.cloneNode(true);
                            item.classList.remove('hidden');
                            interest.appendChild(item);
                        }
                        let post_items = interest.querySelectorAll('.item');
                        post_items[0].classList.add('hidden');
                        empty_box.classList.add('hidden');
                        for (let i = 1; i < mysubscribe.length + 1; i++) {
                            let subscribe_name = post_items[i].querySelector('.name');
                            let concern_btn = post_items[i].querySelector('.follow-btn');
                            post_items[i].dataset.subid = mysubscribe[i - 1].subId;
                            post_items[i].dataset.authorid = mysubscribe[i - 1].subId;
                            concern_btn.dataset.subid = mysubscribe[i - 1].subId;
                            if (re) {
                                for (let j = 0; j < re.length; j++) {
                                    if (concern_btn.dataset.subid == re[j].subId) {
                                        concern_btn.classList.add('active');
                                        concern_btn.innerText = '已关注';
                                    }
                                }
                            }
                            if (concern_btn.dataset.subid == userId) concern_btn.remove();
                            subscribe_name.innerText = mysubscribe[i - 1].subName;
                            subscribe_name.dataset.authorid = mysubscribe[i - 1].subId;
                            axios({
                                method: 'GET',
                                url: '/user/getUserInfo',
                                params: {
                                    'userId': mysubscribe[i - 1].subId,
                                }
                            }).then(res => {
                                let concern_avatar = post_items[i].querySelector('.avatar.concern-avatar');
                                concern_avatar.src = axios.defaults.baseURL + '/' + res.data.data.avatar;
                            })
                        }
                        concernup();
                        name_click(interest);
                    } else {
                        post_itme.classList.add('hidden');
                        empty_box.classList.remove('hidden');
                    }
                    addClasslist([concern_list_box, loadding_box], concern_list_box, 'hidden');
                    interest_box.classList.remove('hidden');
                    // 清除定时器
                    clearInterval(t);
                    t = null;

                })
            } else {
                let interest = concern_list_box.querySelector('.interest');
                let post_itme = interest.querySelector('.item');
                let empty_box = interest.querySelector('.empty');
                interest.innerHTML = '';
                interest.appendChild(post_itme);
                interest.appendChild(empty_box);
                mysubscribe.length = mysubscribe.length == undefined ? 0 : mysubscribe.length;
                if (mysubscribe.length != 0) {
                    for (let i = 0; i < mysubscribe.length; i++) {
                        let item = post_itme.cloneNode(true);
                        item.classList.remove('hidden');
                        interest.appendChild(item);
                    }
                    let post_items = interest.querySelectorAll('.item');
                    post_items[0].classList.add('hidden');
                    empty_box.classList.add('hidden');
                    for (let i = 1; i < mysubscribe.length + 1; i++) {
                        let subscribe_name = post_items[i].querySelector('.name');
                        let concern_btn = post_items[i].querySelector('.follow-btn');
                        post_items[i].dataset.subid = mysubscribe[i - 1].subId;
                        post_items[i].dataset.authorid = mysubscribe[i - 1].subId;
                        concern_btn.dataset.subid = mysubscribe[i - 1].subId;
                        concern_btn.classList.add('active');
                        concern_btn.innerText = '已关注';
                        if (concern_btn.dataset.subid == userId) concern_btn.remove();
                        subscribe_name.innerText = mysubscribe[i - 1].subName;
                        subscribe_name.dataset.authorid = mysubscribe[i - 1].subId;
                        axios({
                            method: 'GET',
                            url: '/user/getUserInfo',
                            params: {
                                'userId': mysubscribe[i - 1].subId,
                            }
                        }).then(res => {
                            let concern_avatar = post_items[i].querySelector('.avatar.concern-avatar');
                            concern_avatar.src = axios.defaults.baseURL + '/' + res.data.data.avatar;
                        })
                    }
                    concernup();
                    name_click(interest);
                } else {
                    post_itme.classList.add('hidden');
                    empty_box.classList.remove('hidden');
                }
                addClasslist([concern_list_box, loadding_box], concern_list_box, 'hidden');
                interest_box.classList.remove('hidden');
                // 清除加载定时器
                clearInterval(t);
                t = null;

            }
        })
    }
    // 列出用户的关注者
    function concernedItem(id) {
        let subscribeMe = [];
        // 显示加载
        addClasslist([concern_list_box, loadding_box], loadding_box, 'hidden');
        let rail = loadding_box.querySelector('.rail');
        let thea = 10;
        // 开启加载
        let t = setInterval(function () {
            rail.style.transform = 'rotate(' + thea + 'deg)';
            thea = thea > 180 ? 0 : thea + 4;
        }, 20)
        axios({
            method: 'GET',
            url: '/user/getSubscribeMe',
            params: {
                'userId': id,
            }
        }).then(res => {
            let same = [];
            subscribeMe = res.data.data;
            axios({
                method: 'GET',
                url: '/user/getMySubscribe',
                params: {
                    'userId': userId,
                }
            }).then(res => {
                same = !res.data.data.message ? res.data.data : null;
                let interested = concern_list_box.querySelector('.interested');
                let post_itme = interested.querySelector('.item');
                let empty_box = interested.querySelector('.empty');
                interested.innerHTML = '';
                interested.appendChild(post_itme);
                interested.appendChild(empty_box);
                subscribeMe.length = subscribeMe.length == undefined ? 0 : subscribeMe.length;
                if (subscribeMe.length != 0) {
                    for (let i = 0; i < subscribeMe.length; i++) {
                        let item = post_itme.cloneNode(true);
                        item.classList.remove('hidden');
                        interested.appendChild(item);
                    }
                    let post_items = interested.querySelectorAll('.item');
                    post_items[0].classList.add('hidden');
                    empty_box.classList.add('hidden');
                    for (let i = 1; i < subscribeMe.length + 1; i++) {
                        let subscribeMe_name = post_items[i].querySelector('.name');
                        let concerned_btn = post_items[i].querySelector('.follow-btn');
                        post_items[i].dataset.subid = subscribeMe[i - 1].subId;
                        post_items[i].dataset.authorid = subscribeMe[i - 1].subId;
                        concerned_btn.dataset.subid = subscribeMe[i - 1].subId;
                        if (same) {
                            for (let j = 0; j < same.length; j++) {
                                if (subscribeMe[i - 1].subId == same[j].subId) {
                                    concerned_btn.classList.add('active');
                                    concerned_btn.innerText = '已关注';
                                    break;
                                }
                            }
                        }
                        if (concerned_btn.dataset.subid == userId) concerned_btn.remove();
                        subscribeMe_name.innerText = subscribeMe[i - 1].subName;
                        subscribeMe_name.dataset.authorid = subscribeMe[i - 1].subId;
                        axios({
                            method: 'GET',
                            url: '/user/getUserInfo',
                            params: {
                                'userId': subscribeMe[i - 1].subId,
                            }
                        }).then(res => {
                            if (!res.data.data.message) {
                                let concerned_avatar = post_items[i].querySelector('.avatar.concerned-avatar');
                                concerned_avatar.src = axios.defaults.baseURL + '/' + res.data.data.avatar;
                            }
                        })
                    }
                    concernup();
                    name_click(interested);
                } else {
                    post_itme.classList.add('hidden');
                    empty_box.classList.remove('hidden');
                }
                addClasslist([concern_list_box, loadding_box], concern_list_box, 'hidden');
                interested_box.classList.remove('hidden');
                // 清除加载定时器
                clearInterval(t);
                t = null;

            })
        })
    }
    var flag = true;
    // 返回登录者主界面时重新配置登录者主页信息
    function whenHome() {
        homepageInit(userId);
        postItem(userId);
    }
    // 绑定用户删除文章事件
    function deleteArticle() {
        let delete_article = homepage.querySelectorAll('.delete-article');
        for (let i = 0; i < delete_article.length; i++) {
            delete_article[i].addEventListener('click', function () {
                axios({
                    method: 'POST',
                    url: '/article/deleteArticle',
                    data: {
                        'userId': userId,
                        'articleId': delete_article[i].dataset.articleid,
                    }
                }).then(res => {
                    let post_list_box = homepage.querySelector('.post-list-box');
                    let delete_item = post_list_box.querySelector('[data-articleid = "' + delete_article[i].dataset.articleid + '"]');
                    delete_item.remove();
                    whenHome();
                })
            })
        }
    }
    // 绑定用户关注事件
    function concernup() {
        let concern_list_box = homepage.querySelector('.concern-list-box');
        let concern_btn = concern_list_box.querySelectorAll('.follow-btn');
        for (let i = 0; i < concern_btn.length; i++) {
            concern_btn[i].onclick = function (e) {
                e.stopPropagation();
                concern_btn[i].classList.contains('active') ? concern_btn[i].classList.remove('active') : concern_btn[i].classList.add('active');
                concern_btn[i].classList.contains('active') ? concern_btn[i].innerText = '已关注' : concern_btn[i].innerText = '关注';
                if (concern_btn[i].classList.contains('active')) {
                    axios({
                        method: 'POST',
                        url: '/user/subscribeSomeone',
                        data: {
                            'userId': userId,
                            'subscribeId': this.dataset.subid,
                        }
                    }).then(res => {
                        alert('关注成功');
                    })
                } else {
                    axios({
                        method: 'POST',
                        url: '/user/cancelSubscribe',
                        data: {
                            'userId': userId,
                            'subscribeId': this.dataset.subid,
                        }
                    }).then(res => {
                        alert('取消关注成功');
                    })
                }
            }
        }
    }

    // 修改信息
    // 获取待用节点
    var view = document.querySelector('#view');
    var setting_btn = homepage.querySelector('.setting-btn');
    var back_home = view.querySelector('.back-homepage');
    var edit_btn = view.querySelectorAll('.edit-btn');
    var edit_box = view.querySelectorAll('.edit-box');
    var confirm_btn = view.querySelectorAll('.confirm-btn');
    var cancel_btn = view.querySelectorAll('.cancel-btn');
    var edit_input = view.querySelectorAll('.edit-input');
    var nickname_input = view.querySelector('.nickname');
    var intro_input = view.querySelector('.introduction');
    var nickname_btn = view.querySelector('.confirm-btn.nickname-btn');
    var intor_btn = view.querySelector('.confirm-btn.introduction-btn');
    var upload_btn = view.querySelector('.upload-btn');
    var upload_input = view.querySelector('.upload-input');
    // 上传图片
    upload_btn.onclick = function () {
        upload_input.click();
        upload_input.onchange = function () {
            let file = this.files[0];
            let dat = new FormData();
            dat.append('avatar', file);
            dat.append('userId', userId);
            axios({
                method: 'POST',
                url: '/user/changeUserAvatar',
                data: dat,
            }).then(res => {
                // 更新用户头像
                getUserinfo();
                alert('上传成功');
            })
        }
    }
    // 上传用户修改信息
    function changeUserinfo() {
        axios({
            method: 'POST',
            url: '/user/changeUserInfo',
            data: {
                'userId': userId,
                'nickname': nickname_input.value,
                'introduction': intro_input.value,
            }
        }).then(res => {
            alert('修改成功')
        })
    }
    // 列出用户待修改信息
    function listView() {
        nickname_input.value = username;
        intro_input.value = intro;
    }
    // 点击修改按钮
    setting_btn.onclick = function () { addClasslist([index, editor, homepage, view, article_view], view, 'hidden'), listView() }
    // 返回主页
    back_home.onclick = function () { addClasslist([index, editor, homepage, view, article_view], homepage, 'hidden'), whenHome() }
    // 同显同隐点击函数
    function doubleHidden(arr_1, arr_2, arr_3, callback) {
        for (let i = 0; i < arr_1.length; i++) {
            arr_1[i].addEventListener('click', function (e) {
                e.stopPropagation();
                if (arr_3) {
                    arr_3[i].classList.contains('hidden') ? arr_3[i].classList.remove('hidden') : arr_3[i].classList.add('hidden');
                } else {
                    arr_1[i].classList.contains('hidden') ? arr_1[i].classList.remove('hidden') : arr_1[i].classList.add('hidden');
                }
                arr_2[i].classList.contains('hidden') ? arr_2[i].classList.remove('hidden') : arr_2[i].classList.add('hidden');
                callback && callback();
            })
        }
    }
    doubleHidden(edit_btn, edit_box);
    doubleHidden(cancel_btn, edit_btn, edit_box);
    doubleHidden(confirm_btn, edit_btn, edit_box);
    for (let i = 0; i < edit_input.length; i++) {
        edit_input[i].onclick = function () {
            block(edit_btn)
            edit_btn[i].classList.add('hidden');
            hidden(edit_box);
            edit_box[i].classList.remove('hidden');
        }
    }
    // 点击保存按钮 调用函数发送修改请求
    nickname_btn.onclick = function () {
        if (nickname_input.value != username) {
            username = nickname_input.value;
            changeUserinfo();
        }
    }
    intor_btn.onclick = function () {
        if (intro_input.value != intro) {
            intro = intro_input.value;
            changeUserinfo();
        }
    }



    // 查看文章
    // 获取待用节点
    var article_view_id = 0;
    var article_view = document.querySelector('#article-view');
    var input_box = article_view.querySelector('.input-box');
    var action_box = article_view.querySelector('.action-box');
    var comment_input = article_view.querySelector('.rich-input');
    var input_btn = article_view.querySelector('.submit-btn');
    var comment_list = article_view.querySelector('.comment-list');
    var like_btn = article_view.querySelector('.like-btn');
    var dislike_btn = article_view.querySelector('.dislike-btn.notthumbup');
    var comment_like_btn = article_view.querySelector('.like-action.comment-like')
    var comment_dislike_btn = article_view.querySelector('.comment-dislike')
    var comment_btn = article_view.querySelector('.comment-btn');
    var comment_id = [];
    var reply_id = [];
    // 绑定文章点赞/取消点赞事件
    like_btn.onclick = function (e) {
        e.stopPropagation();
        this.dataset.flag = this.dataset.flag == 'true' ? 'false' : 'true';
        this.dataset.flag == 'true' ? this.classList.add('active') : this.classList.remove('active');
        this.dataset.flag == 'true' ? this.dataset.badge++ : this.dataset.badge--;
        axios({
            method: 'POST',
            url: '/article/thumbUpArticle',
            data: {
                'userId': userId,
                'articleId': like_btn.dataset.articleid,
                'flag': this.dataset.flag,
            }
        }).then(res => {
            alert('点击成功')
        })
    }
    // 绑定文章点踩/取消点踩事件
    dislike_btn.onclick = function (e) {
        e.stopPropagation();
        this.dataset.disflag = this.dataset.disflag == 'true' ? 'false' : 'true';
        this.dataset.disflag == 'true' ? this.classList.add('dislike') : this.classList.remove('dislike');
        axios({
            method: 'POST',
            url: '/article/dislikeArticle',
            data: {
                'userId': userId,
                'articleId': like_btn.dataset.articleid,
                'flag': this.dataset.disflag,
            }
        }).then(res => {
            alert('点击成功');
        })
    }
    // 为评论框绑定键盘鼠标点击事件
    comment_input.onfocus = function () {
        input_box.classList.add('focus');
        action_box.classList.remove('hidden')
    }
    comment_input.onblur = function () {
        if (this.innerText == '') {
            action_box.classList.add('hidden');
            input_box.classList.remove('focus');
        }
    }
    comment_input.onkeyup = function () {
        this.innerText != '' ? this.classList.add('focus') : this.classList.remove('focus');
        this.innerText != '' ? input_btn.disabled = false : input_btn.disabled = true;
    }
    comment_input.onkeydown = function () {
        this.innerText != '' ? this.classList.add('focus') : this.classList.remove('focus');
        this.innerText != '' ? input_btn.disabled = false : input_btn.disabled = true;
    }
    comment_input.onkeypress = function () {
        this.innerText != '' ? this.classList.add('focus') : this.classList.remove('focus');
        this.innerText != '' ? input_btn.disabled = false : input_btn.disabled = true;
    }

    // 发送评论请求
    function comment() {
        input_btn.onclick = function () {
            let val = comment_input.innerText;
            comment_input.innerText = '';
            input_btn.disabled = true;
            comment_btn.dataset.badge++;
            axios({
                method: 'POST',
                url: '/comment/postComment',
                data: {
                    'userId': userId,
                    'articleId': article_view_id,
                    'comment': val,
                }
            }).then(res => {
                axios({
                    method: 'GET',
                    url: '/comment/getComment',
                    params: {
                        'userId': userId,
                        'articleId': article_view_id,
                        'page': 1,
                    }
                }).then(res => {
                    let com = res.data.data;
                    let num = 0;
                    for (let i = 0; i < com.length; i++) {
                        let f = flag;
                        for (let j = 0; j < comment_id.length; j++) {
                            if (com[i].commentId == comment_id[j]) {
                                f = true;
                                break;
                            }
                        }
                        if (!f) {
                            num = i;
                            break;
                        }
                    }
                    comment_id = [];
                    let item = comment_list.querySelector('.item');
                    let clone_item = item.cloneNode(true);
                    clone_item.dataset.commentid = com[num].commentId;
                    clone_item.classList.remove('hidden');
                    let user_avatar = clone_item.querySelector('.avatar.comment-avtar');
                    user_avatar.src = axios.defaults.baseURL + '/' + useravatar;
                    let name = clone_item.querySelector('.name');
                    name.innerText = com[num].commentator;

                    let content = clone_item.querySelector('.content');
                    content.innerText = com[num].comment;

                    let like = clone_item.querySelector('.action-box .like-action');
                    let reply = clone_item.querySelector('.action-box .comment-action');
                    let reply_box = clone_item.querySelector('.reply');
                    like.dataset.commentid = com[num].commentId;
                    reply.dataset.commentid = com[num].commentId;
                    // 回复
                    reply.onclick = function (e) {
                        e.stopPropagation();
                        reply_box.classList.contains('hidden') ? reply_box.classList.remove('hidden') : reply_box.classList.add('hidden');
                        comment_ipt.focus();
                    }
                    let comment_ipt = reply_box.querySelector('.rich-input');
                    let ipt_btn = reply_box.querySelector('.submit-btn');
                    comment_ipt.onblur = function () {
                        if (comment_ipt.innerText == '') {
                            reply_box.classList.add('hidden');
                        }
                    }
                    comment_ipt.onkeyup = function () {
                        comment_ipt.innerText != '' ? comment_ipt.classList.add('focus') : comment_ipt.classList.remove('focus');
                        comment_ipt.innerText != '' ? ipt_btn.disabled = false : ipt_btn.disabled = true;
                    }
                    comment_ipt.onkeydown = function () {
                        comment_ipt.innerText != '' ? comment_ipt.classList.add('focus') : comment_ipt.classList.remove('focus');
                        comment_ipt.innerText != '' ? ipt_btn.disabled = false : ipt_btn.disabled = true;
                    }
                    comment_ipt.onkeypress = function () {
                        comment_ipt.innerText != '' ? comment_ipt.classList.add('focus') : comment_ipt.classList.remove('focus');
                        comment_ipt.innerText != '' ? ipt_btn.disabled = false : ipt_btn.disabled = true;
                    }
                    ipt_btn.onclick = function () {
                        let val = comment_ipt.innerText;
                        comment_ipt.innerText = '';
                        ipt_btn.disabled = true;
                        reply_box.classList.add('hidden');
                        axios({
                            method: 'POST',
                            url: '/reply/postReply',
                            data: {
                                'userId': userId,
                                'commentId': com[num].commentId,
                                'reply': val,
                            }
                        }).then(res => {
                            axios({
                                method: 'GET',
                                url: '/reply/getReply',
                                params: {
                                    'userId': userId,
                                    'commentId': com[num].commentId,
                                    'page': 1,
                                }
                            }).then(res => {
                                let rpy = res.data.data;
                                let n = 0;
                                for (let i = 0; i < rpy.length; i++) {
                                    let f = flag;
                                    for (let j = 0; j < comment_id.length; j++) {
                                        if (rpy[i].commentId == comment_id[j]) {
                                            f = true;
                                            break;
                                        }
                                    }
                                    if (!f) {
                                        num = i;
                                        break;
                                    }
                                }
                                let sub_comment = clone_item.querySelector('.sub-comment-list');
                                let reply_item = sub_comment.querySelector('.item');
                                let reply_clone_item = reply_item.cloneNode(true);
                                reply_clone_item.classList.remove('hidden');
                                reply_clone_item.dataset.replyid = rpy[n].replyId;
                                let reply_im = reply_clone_item.querySelector('.avatar.reply-avatar');
                                reply_im.src = axios.defaults.baseURL + '/' + rpy.replierAvatar;
                                let replier = reply_clone_item.querySelector('.name');
                                replier.innerText = username;
                                let reply_content = reply_clone_item.querySelector('.content');
                                reply_content.innerText = val;
                                insertAfter(reply_clone_item, reply_item);

                                let del = reply_clone_item.querySelector('.delete');
                                del.classList.add('reply-removable');
                                del.onclick = function () {
                                    sub_comment.removeChild(reply_clone_item);
                                    axios({
                                        method: 'POST',
                                        url: '/reply/deleteReply',
                                        data: {
                                            'userId': userId,
                                            'replyId': rpy[n].replyId,
                                        }
                                    }).then(res => {
                                        alert('删除回复成功');
                                    })
                                }
                            })
                        })
                    }
                    insertAfter(clone_item, item);
                    let del = clone_item.querySelector('.delete');
                    del.classList.add('removable');
                    del.onclick = function () {
                        comment_btn.dataset.badge--;
                        comment_list.removeChild(clone_item);
                        axios({
                            method: 'POST',
                            url: '/comment/deleteComment',
                            data: {
                                'userId': userId,
                                'commentId': com[num].commentId,
                            }
                        }).then(res => {
                            alert('删除评论成功');
                        })
                    }
                })
            })
        }
    }
    comment();
    // 根据id配置文章页面信息
    function articleView(id) {
        addClasslist([index, editor, homepage, view, article_view], article_view, 'hidden');
        var mes = {};
        var com = []
        axios({
            method: 'GET',
            url: '/article/getContent',
            params: {
                'userId': userId,
                'articleId': id,
            }
        }).then(res => {
            mes = res.data.data;

            let author_name = article_view.querySelectorAll('.author-info-block .name');
            let author_avatar = article_view.querySelectorAll('.avatar.author-avatar');
            let concern_btn = article_view.querySelectorAll('.follow-btn');
            let title = article_view.querySelector('.article-title');
            let content = article_view.querySelector('.article-word');
            author_name.forEach(val => {
                val.innerText = mes.author;
                val.dataset.author = otherId;
            })
            author_avatar.forEach(val => {
                val.src = axios.defaults.baseURL + '/' + mes.authorAvatar;
            })
            // 请求该id是否被关注
            axios({
                method: 'GET',
                url: '/user/getMySubscribe',
                params: {
                    'userId': userId,
                }
            }).then(res => {
                let s = res.data.data;
                if (!s.message) {
                    for (let j = 0; j < s.length; j++) {
                        if (otherId == s[j].subId) {
                            concern_btn.forEach(val => {
                                val.classList.add('active');
                                val.innerText = '已关注';
                            })
                        }
                    }
                }
            })
            // 配置取消 / 关注id
            for (let j = 0; j < concern_btn.length; j++) {
                concern_btn[j].dataset.subid = otherId;
                concern_btn[j].onclick = function (e) {
                    e.stopPropagation();
                    if (concern_btn[j].classList.contains('active')) {
                        concern_btn.forEach(val => {
                            val.classList.remove('active')
                            val.innerText = '关注';
                        })
                        axios({
                            method: 'POST',
                            url: '/user/cancelSubscribe',
                            data: {
                                'userId': userId,
                                'subscribeId': this.dataset.subid,
                            }
                        }).then(res => {
                            alert('取消关注成功')
                        })
                    } else {
                        concern_btn.forEach(val => {
                            val.classList.add('active')
                            val.innerText = '已关注';
                        })
                        axios({
                            method: 'POST',
                            url: '/user/subscribeSomeone',
                            data: {
                                'userId': userId,
                                'subscribeId': this.dataset.subid,
                            }
                        }).then(res => {
                            alert('关注成功');
                        })
                    }
                }
            }
            like_btn.dataset.badge = mes.thumbUpNum;
            like_btn.dataset.articleid = id;
            dislike_btn.dataset.articleid = id;
            comment_btn.dataset.badge = mes.commentNum;
            mes.isDislike == true ? dislike_btn.classList.add('dislike') : dislike_btn.classList.remove('dislike');
            mes.isDislike == true ? dislike_btn.dataset.disflag = 'true' : dislike_btn.dataset.disflag = 'false';
            mes.isThumbUp == true ? like_btn.classList.add('active') : like_btn.classList.remove('active');
            mes.isThumbUp == true ? like_btn.dataset.flag = 'true' : like_btn.dataset.flag = 'false';
            title.innerText = mes.title;
            content.innerText = mes.content;

        })
        // 获取评论数据
        axios({
            method: 'GET',
            url: '/comment/getComment',
            params: {
                'userId': userId,
                'articleId': id,
                'page': 1,
            }
        }).then(res => {
            com = res.data.data;
            let item = comment_list.querySelector('.item');
            comment_list.innerHTML = '';
            comment_list.appendChild(item);
            for (let i = 0; i < com.length; i++) {
                comment_id.push(com[i].commentId);
                let clone_item = item.cloneNode(true);
                clone_item.dataset.commentid = com[i].commentId;
                clone_item.classList.remove('hidden');
                let comment_avatar = clone_item.querySelector('.avatar.comment-avtar');
                comment_avatar.src = axios.defaults.baseURL + '/' + com[i].commentatorAvatar;
                let name = clone_item.querySelector('.name');
                name.innerText = com[i].commentator;
                let content = clone_item.querySelector('.content');
                content.innerText = com[i].comment;
                let like = clone_item.querySelector('.action-box .like-action');
                let like_im = like.querySelector('img');
                let dislike = clone_item.querySelector('.comment-dislike')
                let reply = clone_item.querySelector('.action-box .comment-action');
                let reply_box = clone_item.querySelector('.reply');
                like.dataset.commentid = com[i].commentId;
                dislike.dataset.commentid = com[i].commentId;
                com[i].isThumbUp == true ? like.dataset.comlike = 'true' : like.dataset.comlike = 'false';
                com[i].isThumbUp == true ? like_im.src = img_dataed : like_im.src = img_data;
                com[i].isDislike == true ? dislike.dataset.comdislike = 'true' : dislike.dataset.comdislike = 'false';
                com[i].isDislike == true ? dislike.classList.add('dislike') : dislike.classList.remove('dislike');
                reply.dataset.commentid = com[i].commentId;
                // 配置点踩评论事件
                dislike.onclick = function (e) {
                    e.stopPropagation();
                    dislike.dataset.comdislike = dislike.dataset.comdislike == 'true' ? 'false' : 'true';
                    dislike.dataset.comdislike == 'true' ? dislike.classList.add('dislike') : dislike.classList.remove('dislike');
                    axios({
                        method: 'POST',
                        url: '/comment/dislikeComment',
                        data: {
                            'userId': userId,
                            'commentId': this.dataset.commentid,
                            'flag': this.dataset.comdislike,
                        }
                    }).then(res => {
                        alert('点击成功');
                    })
                }
                // 配置点赞评论事件
                like.onclick = function (e) {
                    e.stopPropagation();
                    like.dataset.comlike = like.dataset.comlike == 'true' ? 'false' : 'true';
                    like.dataset.comlike == 'true' ? like_im.src = img_dataed : like_im.src = img_data;
                    axios({
                        method: 'POST',
                        url: '/comment/thumbUpComment',
                        data: {
                            'userId': userId,
                            'commentId': this.dataset.commentid,
                            'flag': this.dataset.comlike,
                        }
                    }).then(res => {
                        alert('点击成功');
                    })
                }
                // 回复点击
                reply.onclick = function (e) {
                    e.stopPropagation();
                    if(reply_box.classList.contains('hidden')) {
                        reply_box.classList.remove('hidden')
                        comment_ipt.focus();
                    }else {
                        reply_box.classList.add('hidden');
                    }
                }
                let comment_ipt = reply_box.querySelector('.rich-input');
                let ipt_btn = reply_box.querySelector('.submit-btn');
                comment_ipt.onblur = function (e) {
                    e.stopPropagation();
                    if (comment_ipt.innerText == '') {
                        reply_box.classList.add('hidden');
                    }
                }
                comment_ipt.onkeyup = function () {
                    comment_ipt.innerText != '' ? comment_ipt.classList.add('focus') : comment_ipt.classList.remove('focus');
                    comment_ipt.innerText != '' ? ipt_btn.disabled = false : ipt_btn.disabled = true;
                }
                comment_ipt.onkeydown = function () {
                    comment_ipt.innerText != '' ? comment_ipt.classList.add('focus') : comment_ipt.classList.remove('focus');
                    comment_ipt.innerText != '' ? ipt_btn.disabled = false : ipt_btn.disabled = true;
                }
                comment_ipt.onkeypress = function () {
                    comment_ipt.innerText != '' ? comment_ipt.classList.add('focus') : comment_ipt.classList.remove('focus');
                    comment_ipt.innerText != '' ? ipt_btn.disabled = false : ipt_btn.disabled = true;
                }

                // 提交回复请求
                ipt_btn.onclick = function () {
                    let val = comment_ipt.innerText;
                    comment_ipt.innerText = '';
                    ipt_btn.disabled = true;
                    reply_box.classList.add('hidden');
                    axios({
                        method: 'POST',
                        url: '/reply/postReply',
                        data: {
                            'userId': userId,
                            'commentId': com[i].commentId,
                            'reply': val,
                        }
                    }).then(res => {
                        axios({
                            method: 'GET',
                            url: '/reply/getReply',
                            params: {
                                'userId': userId,
                                'commentId': com[i].commentId,
                                'page': 1,
                            }
                        }).then(res => {
                            let rpy = res.data.data;
                            let num = 0;
                            for (let i = 0; i < rpy.length; i++) {
                                let f = flag;
                                for (let j = 0; j < comment_id.length; j++) {
                                    if (rpy[i].commentId == comment_id[j]) {
                                        f = true;
                                        break;
                                    }
                                }
                                if (!f) {
                                    num = i;
                                    break;
                                }
                            }
                            let sub_comment = clone_item.querySelector('.sub-comment-list');
                            let reply_item = sub_comment.querySelector('.item');
                            let reply_clone_item = reply_item.cloneNode(true);
                            reply_clone_item.classList.remove('hidden');
                            reply_clone_item.dataset.replyid = rpy[num].replyId;
                            let reply_im = reply_clone_item.querySelector('.avatar');
                            reply_im.src = axios.defaults.baseURL + '/' + useravatar;
                            let replier = reply_clone_item.querySelector('.name');
                            replier.innerText = username;
                            let reply_content = reply_clone_item.querySelector('.content');
                            reply_content.innerText = val;
                            insertAfter(reply_clone_item, reply_item);


                            let del = reply_clone_item.querySelector('.delete');
                            del.classList.add('reply-removable');
                            del.onclick = function () {
                                sub_comment.removeChild(reply_clone_item);
                                axios({
                                    method: 'POST',
                                    url: '/reply/deleteReply',
                                    data: {
                                        'userId': userId,
                                        'replyId': rpy[num].replyId,
                                    }
                                }).then(res => {
                                    alert('删除回复成功');
                                })
                            }
                        })
                    })
                }

                if (username == com[i].commentator) {
                    insertAfter(clone_item, item);
                    let del = clone_item.querySelector('.delete');
                    del.classList.add('removable');
                    del.onclick = function () {
                        comment_btn.dataset.badge--;
                        comment_list.removeChild(clone_item);
                        axios({
                            method: 'POST',
                            url: '/comment/deleteComment',
                            data: {
                                'userId': userId,
                                'commentId': com[i].commentId,
                            }
                        }).then(res => {
                            alert('删除评论成功');
                        })
                    }
                } else { comment_list.appendChild(clone_item); }

                // 请求回复数据
                axios({
                    method: 'GET',
                    url: '/reply/getReply',
                    params: {
                        'userId': userId,
                        'commentId': com[i].commentId,
                        'page': 1,
                    }
                }).then(res => {
                    let re = res.data.data;
                    let sub_comment = clone_item.querySelector('.sub-comment-list');
                    let reply_item = sub_comment.querySelector('.item');
                    for (let j = 0; j < re.length; j++) {
                        reply_id.push(re[j].replyId);
                        let reply_clone_item = reply_item.cloneNode(true);
                        reply_clone_item.classList.remove('hidden');
                        reply_clone_item.dataset.replyid = re[j].replyId;
                        let reply_avatar = reply_clone_item.querySelector('.avatar.reply-avatar');
                        reply_avatar.src = axios.defaults.baseURL + '/' + re[j].replierAvatar;
                        let replier = reply_clone_item.querySelector('.name');
                        replier.innerText = re[j].replier;
                        let reply_content = reply_clone_item.querySelector('.content');
                        reply_content.innerText = re[j].replyContent;
                        sub_comment.appendChild(reply_clone_item);
                        if (username == re[j].replier) {
                            let del = reply_clone_item.querySelector('.delete');
                            del.classList.add('reply-removable');
                            del.onclick = function () {
                                sub_comment.removeChild(reply_clone_item);
                                axios({
                                    method: 'POST',
                                    url: '/reply/deleteReply',
                                    data: {
                                        'userId': userId,
                                        'replyId': re[j].replyId,
                                    }
                                }).then(res => {
                                    alert('删除回复成功');
                                })
                            }
                        }
                    }
                })
            }
        })
    }
    // 为文章绑定点击事件
    function article_click(ele) {
        let art = ele.querySelectorAll('.article');
        for (let i = 0; i < art.length; i++) {
            art[i].onclick = function () {
                article_view_id = art[i].dataset.articleid;
                articleView(art[i].dataset.articleid);
            }
        }
    }

    //查看用户信息
    var otherId = 0;
    // 绑定ele块的名字点击事件
    function name_click(ele) {
        let names = ele.querySelectorAll('.name');
        for (let i = 0; i < names.length; i++) {
            names[i].onclick = function (e) {
                e.stopPropagation();
                otherId = names[i].dataset.authorid;
                otherView(names[i].dataset.authorid)
            }
        }
    }
    // 传入id显示id的主页信息
    function otherView(id) {
        addClasslist([index, editor, homepage, view, article_view], homepage, 'hidden');
        homepageInit(id);
        postItem(id);
        likeItem(id, true);
    }
})
