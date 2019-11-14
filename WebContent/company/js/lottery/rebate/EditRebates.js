define(['common/BaseEditPage'], function (BaseEditPage) {
    return BaseEditPage.extend({
        init: function () {
            this.formSelector = "#edidRebateForm";
            this._super();
        },
        /**
         * 当前对象事件初始化
         */
        bindEvent: function () {
            this._super();
            var _this = this;

            $(this.formSelector).on("click",".btnBS",function () {
                var sid = $(this).attr("data-sid");
                var btr = $(this).parent().parent();
                var arrT = ['a', 'b', 'c', 'd', 'e', 'f'];
                $.each(arrT, function (i, t) {
                    $(_this.formSelector).find("table[name='data-content'] tr[data-sid=" + sid + "] input[data-" + t + "='']").each(function () {
                        $(this).val($(btr).find("input[data-" + t + "='']").val());
                    });
                });
            });


            $(this.formSelector).on("click","em.addBtns",function () {
                var av = parseFloat($(_this.formSelector).find("#kc_plwt").val()) * 100;
                $(_this.formSelector).find("table[name='data-content'] input[data-a=''],table[name='data-content'] input[data-b=''],table[name='data-content'] input[data-c='']").each(function () {
                    var v = $(this).val();
                    var v0 = isNaN(v) ? 0 : parseFloat(v) * 100;
                    $(this).val(_this._f2((v0 + av) / 100));
                });
            });
            $(this.formSelector).on("click","i.minBtns",function () {
                var sv = parseFloat($(_this.formSelector).find("#kc_plwt").val()) * 100;
                $(_this.formSelector).find("table[name='data-content'] input[data-a=''],table[name='data-content'] input[data-b=''],table[name='data-content'] input[data-c='']").each(function () {
                    var v = $(this).val();
                    var v0 = isNaN(v) ? 0 : parseFloat(v) * 100;
                    $(this).val(v0 - sv > 0 ? _this._f2((v0 - sv) / 100) : 0);
                });
            });
        },

            //快捷設置賠率

        onPageLoad: function () {
            this._super();
            var _this = this;
        },
        _f2 : function (v) {
        var v1 = v + "";
        if (v1.indexOf('.') >= 0) {
            var v2 = v1.substring(0, v1.indexOf('.') + 3);
            var i = 0;
            while (i < 3) {
                var pi = v2.substring(v2.length - 1, v2.length);
                if (pi != "0" && pi != ".") {
                    break;
                }
                v2 = v2.substring(0, v2.length - 1);
                i++;
            }
            return v2;
        } else {
            return v1;
        }
    },

        /**
         * 保存赔率
         * @param e
         */
        saveLotteryRebate: function (e, option) {
            var $target = $(e.currentTarget);
            var array = [];
            var obj;
            var data = {};
            if(!this.validateForm(e)){
                $target.unlock();
                return false;
            }

            $(".betSortTr").each(function () {
                var code = $(this).find("input[name='code']").val();
                var betSort = $(this).find("input[name='betSort']").val();
                var minBet = $(this).find("input[name^='minBet']").val();
                var maxBet = $(this).find("input[name^='maxBet']").val();
                var maxExpectBet = $(this).find("input[name^='maxExpectBet']").val();
                var rebateA = $(this).find("input[name^='rebateA']").val();
                var rebateB = $(this).find("input[name^='rebateB']").val();
                var rebateC = $(this).find("input[name^='rebateC']").val();
                obj = {
                    'code': code,
                    'betSort': betSort,
                    'minBet': minBet,
                    'maxBet': maxBet,
                    'maxExpectBet': maxExpectBet,
                    'rebateA': rebateA,
                    'rebateB': rebateB,
                    'rebateC': rebateC
                };
                array.push(obj);
            });
            if (array.length <= 0) {
                e.page.showPopover(e, option, 'success', '保存成功', true);
                $target.unlock();
                return;
            }
            var url = root + "/siteLotteryRebates/saveSiteLotteryRebates.html";
            data['lotteryRebatesJson'] = JSON.stringify(array);
            $target.unlock();
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
                }
            });
        },
        //重置選項
        resetOption: function (e, option) {
            $(this.formSelector).find("tr.myqhs").removeClass("myqhs");
            $(this.formSelector).find("td input[type='checkbox']").attr("checked", false);
        },
        forDight: function (Dight, How) {
            Dight = Math.round(Dight * Math.pow(10, How)) / Math.pow(10, How);
            return parseFloat(Dight);
        }

    });
});