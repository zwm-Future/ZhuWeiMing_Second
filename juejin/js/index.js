window.addEventListener('load', function () {
    var header = document.querySelector('.main-header');
    var banner = document.querySelector('.aside-fixed')
    var last_scroll = 0;
    window.onscroll = function () {
        let t = document.documentElement.scrollTop || document.body.scrollTop;
        t >= 200 ? header.style.top = -60 + 'px' : 0;
        last_scroll > t ? header.style.top = 0 : 0;
        last_scroll > t ? banner.style.top = 120 + 'px' : banner.style.top = 60 + 'px';
        t >= 1420 ? banner.style.opacity = 1 : banner.style.top = 60 + 'px';
        t >= 1420 ? 0 : banner.style.opacity = 0;
        last_scroll = t;
    }
    var avatar = document.querySelector('.main-header').querySelector('.avatar');
    var avatar_more = avatar.querySelector('.user-dropdown-list');
    var more = document.querySelector('.main-header').querySelector('.more');
    var add_dropdpwn_list = document.querySelector('.main-header').querySelector('.add-dropdpwn-list');
    var share = document.querySelector('.article-container').querySelector('.share');
    var share_panel = share.querySelector('.share-panel')
    function hidden_block(ele_1, ele_2) {
        ele_1.addEventListener('click', function (e) {
            e.stopPropagation();
            ele_2.classList.contains('hidden') ? ele_2.classList.remove('hidden') : ele_2.classList.add('hidden');
        })
    }
    hidden_block(avatar, avatar_more);
    hidden_block(share, share_panel);
    hidden_block(more, add_dropdpwn_list);
    var index = document.querySelector('#index');
    index.addEventListener('click', function (e) {
        avatar_more.classList.contains('hidden') ? 0 : avatar_more.classList.add('hidden');
        add_dropdpwn_list.classList.contains('hidden') ? 0 : add_dropdpwn_list.classList.add('hidden');
        share_panel.classList.contains('hidden') ? 0 : share_panel.classList.add('hidden');
    })
})
