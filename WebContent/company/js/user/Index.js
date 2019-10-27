define(['common/BaseListPage'],function (BaseListPage) {
    return BaseListPage.extend({
        init: function () {
            this.formSelector = "#mainFrame";
            this._super(this.formSelector);
            this.bindEvent();
            this.onPageLoad();
        },
        /**
         * 当前对象事件初始化
         */
        bindEvent: function () {
            this._super();
            var _this = this;
            var url = $("#magAdd").data("url");
            $(this.formSelector).on("click", "#magAdd", function () {
                $.ajax({
                    loading: true,
                    url: root + url,
                    // headers: {
                    //     "Soul-Requested-With": "XMLHttpRequest"
                    // },
                    type: "post",
                    success: function (data) {
                        $(".search-list-container").html(data);
                    },
                    error: function (data, state, msg) {
                        //超时导致后台返回,安全密码验证不做任何处理

                    }
                });
            });

            $(this.formSelector).on("click", "#search", function () {
                var url =$( _this.formSelector).attr("action");
                $.ajax({
                    loading: true,
                    url: url,
                    headers: {
                        "Soul-Requested-With": "XMLHttpRequest"
                    },
                    type: "post",
                    data:$( _this.formSelector).serialize(),
                    success: function (data) {
                        $(".search-list-container").html(data);
                    },
                    error: function (data, state, msg) {
                        //超时导致后台返回,安全密码验证不做任何处理

                    }
                });
            });


        },

        onPageLoad: function () {
            this._super();
        }
    })
});