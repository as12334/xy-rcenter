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
            $(this.formSelector).on("change", "td input[type='checkbox']", function () {
                if ($(this).is(':checked')) {
                    $(this).parent().parent("tr").addClass("myqhs");
                } else {
                    $(this).parent().parent("tr").removeClass("myqhs");
                }
            });


            $(this.formSelector).on("click","#od-set .odds-kj span",function () {
                var value = parseFloat($(this).html());
                var od_a = $(_this.formSelector).find("input[name='od-a']").is(':checked');
                var od_b = $(_this.formSelector).find("input[name='od-b']").is(':checked');
                var od_c =$(_this.formSelector).find("input[name='od-c']").is(':checked');
                var od_max = $(_this.formSelector).find("input[name='od-max']").is(':checked');
                var dow;
                $(_this.formSelector).find("tbody tr.myqhs").each(function () {
                    $(_this.formSelector).find("input[type='text']").each(function (i) {
                        dow = value + parseFloat($(this).val());
                        if (i == 0) {
                            if (od_a && dow >= 0) {
                                $(this).val(_this.forDight(dow, 4));
                            } else if (od_a) {
                                $(this).val("0");
                            }
                        } else if (i == 1) {
                            if (od_b && dow >= 0) {
                                $(this).val(_this.forDight(dow, 4));
                            } else if (od_b) {
                                $(this).val("0");
                            }
                        } else if (i == 2) {
                            if (od_c && dow >= 0) {
                                $(this).val(_this.forDight(dow, 4));
                            } else if (od_c) {
                                $(this).val("0");
                            }
                        } else if (i == 3) {
                            if (od_max && dow >= 0) {
                                $(this).val(_this.forDight(dow, 4));
                            } else if (od_max) {
                                $(this).val("0");
                            }
                        }
                    });
                });
            });
        },

            //快捷設置賠率

        onPageLoad: function () {
            this._super();
            var _this = this;
        },


        /**
         * 保存赔率
         * @param e
         */
        saveLotterysOdd: function (e, option) {
            var $target = $(e.currentTarget);
            var array = [];
            var obj;
            var data = {};
            if(!this.validateForm(e)){
                $target.unlock();
                return false;
            }

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
            data['lotteryOddsJson'] = JSON.stringify(array);
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