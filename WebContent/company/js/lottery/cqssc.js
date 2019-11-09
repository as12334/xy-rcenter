define(['common/BaseEditPage'], function (BaseEditPage) {
    return BaseEditPage.extend({
        init: function () {
            this.formSelector = "#edidOddForm";
            this._super();
        },
        /**
         * 当前对象事件初始化
         */
        bindEvent: function () {
            this._super();
            var _this = this;


        },
        onPageLoad: function () {
            this._super();
            var _this = this;
        },


        /**
         * 保存赔率
         * @param e
         */
        saveLotteryOdd: function (e, option) {
            var siteId = $("#search_id").val();
            if (!siteId) {
                e.page.showPopover(e, option, 'danger', '站点id不能为空', true);
                $(e.currentTarget).unlock();
                return;
            }
            var code = $("#searchDiv a.ssc-active").attr("code");
            var $form = $(this.getCurrentForm(e));
            var $target = $(e.currentTarget);
            var validate = $form.validate();
            var array = [];
            var group;
            var oddObj;
            var $input;
            var odd;
            var ori;
            var obj;
            var limit;
            var data = {};
            var rebateObj;


            var code = $("#lotteryCode").val();
            $(".betSortTr").each(function () {
                var betSort = $(this).find("input[name='betSort']").val();
                var oddA = $(this).find("input[name='oddA']").val();
                var oddB = $(this).find("input[name='oddB']").val();
                var oddC = $(this).find("input[name='oddC']").val();
                var maxOdd = $(this).find("input[name='maxOdd']").val();
                obj = {
                    'code': code,
                    'betSort': betSort,
                    'oddA': oddA,
                    'oddB': oddB,
                    'oddC': oddC,
                    'maxOdd': maxOdd
                };
                array.push(obj);
            });
            if (array.length <= 0) {
                e.page.showPopover(e, option, 'success', '保存成功', true);
                $target.unlock();
                return;
            }
            var url = root + "/siteLotteryOdds/saveSiteLotteryOdds.html";
            data['lotteryOddJson'] = JSON.stringify(array);
            window.top.topPage.ajax({
                url: url,
                data: data,
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                    if (data.state == true) {
                        alert(data.msg)
                        $target.unlock();
                    } else {
                        e.page.showPopover(e, option, 'danger', '保存失败', true);
                    }
                    $target.unlock();
                }
            });
        }

    });
});