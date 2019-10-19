    /**
 * 账户详细
 */
define(['common/BaseViewPage'], function (BaseViewPage) {
    return BaseViewPage.extend({
        init: function () {
            this.formSelector = "#mainFrame #mhViewForm";
            this._super(this.formSelector);
        },
        bindEvent: function () {
            this._super();
            var _this = this;
            /**
             * 返回上级
             */
            $(_this.formSelector).on("click",".returnSuperior",function (e) {
                var lastTimeSearch=$("a [name='lastTimeSearch']",_this.formSelector).val();
                if(lastTimeSearch!=undefined){
                    var data_url=$("#tab-scroll .active a").attr("data-url");
                    var arr=data_url.split("#");
                    data_url=arr[0].split("?")[0]+"?lastTimeSearch="+lastTimeSearch+"#"+arr[1];
                    $("#tab-scroll .active a").attr("data-url",data_url);
                }

            })
        },
        onPageLoad: function () {
            this._super();
        },
        /**
         * 编辑状态
         */
        editStatus: function (e, option) {
            $("#status-edit").show();
            $(e.currentTarget).hide();
            $(e.currentTarget).unlock();
        },
        /**
         * 取消编辑状态
         */
        cancelEditStatus: function (e, option) {
            $("#status-edit").hide();
            $("[title='修改状态']").show();
            $(e.currentTarget).unlock();
        },
        /**
         * 更新状态
         */
        updateStatus: function (e, option) {
            var _this=this;
            var sta=$("[name='current-status']",_this.formSelector);
            var status = $("[name='result.status']",_this.formSelector).val();
            if(sta.val()==status){
                $(e.currentTarget).formtip("未更改");
                $(e.currentTarget).unlock();
                return;
            }
            var id = $("input[name='result.id']",_this.formSelector).val();
            if(status==""){
                $(e.currentTarget).formtip("状态不能为空");
                $(e.currentTarget).unlock();
                return;
            }
            window.top.topPage.ajax({
                url: root + "/account/account/updateStatus.html",
                data: {'result.status': status, 'result.id': id},
                dataType: 'json',
                type:"get",
                async:false,
                success: function (data) {
                    if (data && data.state == true) {
                        e.page.showPopover(e, option, 'success', window.top.message.common['operation.success'], true);
                        e.returnValue = true;
                        if (status=='1'){
                            $('#player-stauts-detail span',_this.formSelector).text("正常");
                            $('#player-stauts-detail span',_this.formSelector).attr('class','label label-success');
                            //sta.val(1);
                        }
                        if (status=='2'){
                            $('#player-stauts-detail span',_this.formSelector).text("停用");
                            $('#player-stauts-detail span',_this.formSelector).attr('class','label label-danger');
                            ///sta.val(2);
                        }
                        if (status=='3'){
                            $('#player-stauts-detail span',_this.formSelector).text("账号冻结");
                            $('#player-stauts-detail span',_this.formSelector).attr('class','label label-info');
                            //sta.val(3);
                        }
                        if (status=='4'){
                            $('#player-stauts-detail span',_this.formSelector).text("待审核");
                            $('#player-stauts-detail span',_this.formSelector).attr('class','label label-warning');
                            //sta.val(4);
                        }
                        if (status=='5'){
                            $('#player-stauts-detail span',_this.formSelector).text("审核失败");
                            $('#player-stauts-detail span',_this.formSelector).attr('class','label label-danger');
                           // sta.val(5);
                        }
                        $('#status-edit',_this.formSelector).attr('style','display:none');
                        // $("#content").html(data);
                        $("[title='修改状态']",_this.formSelector).show();
                    } else {
                        e.page.showPopover(e, option, 'danger', window.top.message.common['operation.fail'], true);
                    }
                    $(e.currentTarget).unlock();
                }
            });
        },
        /**
         * 编辑真实姓名
         * @param e
         * @param option
         */
        editRealName: function (e, option) {
            var _this = this;
            $("#real-name-edit",_this.formSelector).show();
            $(e.currentTarget).unlock();
        },
        /**
         * 取消编辑真实姓名
         * @param e
         * @param option
         */
        cancelEditRealName: function (e, option) {
            var _this = this;
            $("#real-name-edit",_this.formSelector).hide();
            $(e.currentTarget).unlock();
        },
        /**
         * 保存真实姓名
         * @param e
         * @param option
         */
        updateRealName: function (e, option) {
            var _this = this;
            var realName = $("input[name='result.realName']",_this.formSelector).val();
            var id = $("input[name='result.id']",_this.formSelector).val();
            window.top.topPage.ajax({
                url: root + "/account/account/updateRealName.html",
                data: {'result.realName': realName, 'result.id': id},
                dataType: 'json',
                type:'post',
                success: function (data) {
                    if (data && data.state == true) {
                        e.page.showPopover(e, option, 'success', window.top.message.common['operation.success'], true);
                        e.returnValue = true;
                    } else {
                        e.page.showPopover(e, option, 'danger', window.top.message.common['operation.fail'], true);
                    }
                    $(e.currentTarget).unlock();
                }
            });
        },
        /**
         * 更新成功后回调
         * @param e
         * @param option
         */
        updateBack: function (e, option) {
            if (e.returnValue) {
                window.location.reload(true);
            }
        },
        /**
         * 查看key
         * @param e
         * @param option
         */
        viewKey: function (e, option) {
            var _this = this;
            var id = $("input[name='result.id']", _this.formSelector).val();
            window.top.topPage.ajax({
                url: root + "/boss/account/merchant/viewKey.html",
                data: {'search.id': id},
                dataType: 'json',
                eventCall:function(opt){
                    _this.viewKey(opt);
                },
                eventTarget : {currentTarget: $(_this)[0]},
                success: function (data) {
                    if (data.key) {
                        $("#key", _this.formSelector).text(data.key);
                        $("#key", _this.formSelector).show();
                        $("#updateKey", _this.formSelector).show();
                        if(e.currentTarget.parentTarget) {
                            $(e.currentTarget.parentTarget).addClass("hide");
                        } else {
                            $(e.currentTarget).addClass("hide");
                        }
                    } /*else {
                         e.page.showPopover(e, option, 'danger', '当前密钥为空！', true);
                        $(e.currentTarget.parentTarget).unlock();
                    }*/
                }
            });
        },
        /**
         * 更新key
         * @param e
         * @param option
         */
        updateKey:function(e,option){
            var _this = this;
            var id=$("input[name='result.id']",_this.formSelector).val();
            window.top.topPage.ajax({
                url:root + "/account/account/updateKey.html",
                data:{'search.id':id},
                dataType:'json',
                success:function(data){
                    if(data.key){
                        $("#key",_this.formSelector).text(data.key);
                    } else{
                        e.page.showPopover(e,option,'danger','系统繁忙请稍后再试！',true);
                    }
                    $(e.currentTarget).unlock();
                },
                error:function(data){
                    console.log(data);
                }
            })
        },
        accountCallback: function (e, opt) {
        var _this = this;
        if(opt.data.state){
            page.showPopover(e, {"callback": function (event,option) {
                console.log(opt.data.url);
                window.top.topPage.doDialog({page:_this},{text:window.top.message.common['msg'],
                    target: root + "/siteSubAccount/showUrl.html?username="+opt.data.username+"&host="+opt.data.host+"&secret="+opt.data.secret});
            },"placement":"left"}, 'success', '操作成功', true);
        }else{
            var msg = opt.data.msg;
            if(msg==null||msg==""){
                msg = "操作失败";
            }

            page.showPopover(e, {"callback": function () {
            },"placement":"left"}, 'danger', msg, true);
        }
            $(e.currentTarget).unlock(); //解锁按钮
        },
        /**配额下拉选*/
        saveOrupdateGroup:function (e) {
            var _this=this;
            // if($("[name='gameGroupId']",_this.formSelector).val()!=null && $("[name='gameGroupId']",_this.formSelector).val()!="") {
                var gameGroupId=$("[name='gameGroupId']",_this.formSelector).val();
                var sysUserId=$("#showGroupAdd",_this.formSelector).prev().val();
                $.ajax({
                    url:root + "/account/account/editGameRelation.html",
                    data:{'search.groupId':gameGroupId,
                          "search.sysUserId":sysUserId,
                          "search.groupType":"1",
                          "search.status":"1"},
                    type:"post",
                    dataType:"JSON",
                    success:function(data){
                        if(data.msg){
                            $("#showGroupAdd",_this.formSelector).prev().prev().children("b").text(data.GroupName);
                            $("#showGroupAdd",_this.formSelector).prev().prev().children("i").text(data.GroupId);
                            $('#showGroupAdd',_this.formSelector).hide();
                            $('#showGroupEdit',_this.formSelector).show();
                            $(e.currentTarget).unlock();
                        }
                    },
                    error:function () {
                    }
                })

            // }else{
                // page.showPopover(e, {}, "text", "请选择分组", true);
            // }
        },

        /**游戏开启下拉选*/
        saveOrupdateOpen:function (e) {
            var _this=this;
            // if($("[name='GroupOpenId']",_this.formSelector).val()!=null && $("[name='GroupOpenId']",_this.formSelector).val()!="") {
                var gameGroupId=$("[name='GroupOpenId']",_this.formSelector).val();
                var sysUserId=$("#GroupOpenAdd",_this.formSelector).prev().val();
                $.ajax({
                    url:root + "/account/account/editGameRelation.html",
                    data:{'search.groupId':gameGroupId,
                        "search.sysUserId":sysUserId,
                        "search.groupType":"2",
                        "search.status":"1"},
                    type:"post",
                    dataType:"JSON",
                    success:function(data){
                        if(data.msg){
                            $("#GroupOpenAdd",_this.formSelector).prev().prev().children("b").text(data.GroupName);
                            $("#GroupOpenAdd",_this.formSelector).prev().prev().children("i").text(data.GroupId);
                            $('#GroupOpenAdd',_this.formSelector).hide();
                            $('#GroupOpenEdit',_this.formSelector).show();
                            $(e.currentTarget).unlock();
                        }
                    },
                    error:function () {
                    }
                })

            // }else{
            //     page.showPopover(e, {}, "text", "请选择分组", true);
            // }
        },
        editGame:function (e) {
            var _this=this;
            $('#showGroupAdd',_this.formSelector).show();
            $('#showGroupEdit',_this.formSelector).hide();
            $(e.currentTarget).unlock();
        },
        editGameOpen:function (e) {
            var _this=this;
            $('#GroupOpenAdd',_this.formSelector).show();
            $('#GroupOpenEdit',_this.formSelector).hide();
            $(e.currentTarget).unlock();
        }

    })

});