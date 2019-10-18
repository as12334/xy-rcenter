// artDialog - 榛樿閰嶇疆
define({

    /* -----宸叉敞閲婄殑閰嶇疆缁ф壙鑷� popup.js锛屼粛鍙互鍐嶈繖閲岄噸鏂板畾涔夊畠----- */

    // 瀵归綈鏂瑰紡
    //align: 'bottom left',

    // 鏄惁鍥哄畾瀹氫綅
    //fixed: false,

    // 瀵硅瘽妗嗗彔鍔犻珮搴﹀€�(閲嶈锛氭鍊间笉鑳借秴杩囨祻瑙堝櫒鏈€澶ч檺鍒�)
    //zIndex: 1024,

    // 璁剧疆閬僵鑳屾櫙棰滆壊
    backdropBackground: '#000',

    // 璁剧疆閬僵閫忔槑搴�
    backdropOpacity: 0.7,

    // 娑堟伅鍐呭
    content: '<span class="ui-dialog-loading">Loading..</span>',

    // 鏍囬
    title: '',

    // 瀵硅瘽妗嗙姸鎬佹爮鍖哄煙 HTML 浠ｇ爜
    statusbar: '',

    // 鑷畾涔夋寜閽�
    button: null,

    // 纭畾鎸夐挳鍥炶皟鍑芥暟
    ok: null,

    // 鍙栨秷鎸夐挳鍥炶皟鍑芥暟
    cancel: null,

    // 纭畾鎸夐挳鏂囨湰
    okValue: 'ok',

    // 鍙栨秷鎸夐挳鏂囨湰
    cancelValue: 'cancel',

    cancelDisplay: true,

    // 鍐呭瀹藉害
    width: '',

    // 鍐呭楂樺害
    height: '',

    // 鍐呭涓庤竟鐣屽～鍏呰窛绂�
    padding: '5',

    // 瀵硅瘽妗嗚嚜瀹氫箟 className
    skin: '',

    // 鏄惁鏀寔蹇嵎鍏抽棴锛堢偣鍑婚伄缃╁眰鑷姩鍏抽棴锛�
    quickClose: false,

    // css 鏂囦欢璺緞锛岀暀绌哄垯涓嶄細浣跨敤 js 鑷姩鍔犺浇鏍峰紡
    // 娉ㄦ剰锛歝ss 鍙厑璁稿姞杞戒竴涓�
    cssUri: '../../company/themes/ui-dialog.css',

    // 妯℃澘锛堜娇鐢� table 瑙ｅ喅 IE7 瀹藉害鑷€傚簲鐨� BUG锛�
    // js 浣跨敤 i="***" 灞炴€ц瘑鍒粨鏋勶紝鍏朵綑鐨勫潎鍙嚜瀹氫箟
    innerHTML:
    '<div i="dialog" class="ui-dialog">'
    +       '<div class="ui-dialog-arrow-a"></div>'
    +       '<div class="ui-dialog-arrow-b"></div>'
    +       '<table class="ui-dialog-grid">'
    +           '<tr>'
    +               '<td i="header" class="ui-dialog-header">'
    +                   '<button i="close" class="ui-dialog-close">&#215;</button>'
    +                   '<div i="title" class="ui-dialog-title"></div>'
    +               '</td>'
    +           '</tr>'
    +           '<tr>'
    +               '<td i="body" class="ui-dialog-body">'
    +                   '<div i="content" class="ui-dialog-content"></div>'
    +               '</td>'
    +           '</tr>'
    +           '<tr>'
    // +               '<td i="footer" class="ui-dialog-footer">'
    +               '<td i="footer">'
    +                   '<div i="statusbar" class="ui-dialog-statusbar"></div>'
    +                   '<div i="button" class="ui-dialog-button"></div>'
    +               '</td>'
    +           '</tr>'
    +       '</table>'
    +'</div>'

});