<%@ tag import="com.alibaba.dubbo.common.json.JSON" %>
<%@ tag import="org.soul.commons.data.json.JsonTool" %>
<%@ tag import="org.soul.commons.lang.string.I18nTool" %>
<%@ tag import="org.soul.model.sys.po.SysDict" %>
<%@ tag import="so.wwb.creditbox.web.tools.SessionManagerCommon" %>
<%@ tag import="so.wwb.creditbox.web.cache.Cache" %>
<%@ tag import="so.wwb.creditbox.model.manager.lottery.po.Lottery" %>
<%@ tag import="java.util.*" %>
<%@ tag import="org.soul.commons.collections.CollectionTool" %>
<%@ tag import="org.soul.commons.collections.MapTool" %>
<%@ tag import="org.soul.commons.lang.ArrayTool" %>

<%@ tag import="java.lang.reflect.Array" %>

<%@ tag language="java" pageEncoding="UTF-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<%@attribute name="name" type="java.lang.String" required="true" description="名字" %>
<%@attribute name="value" type="java.lang.Object" required="true" description="选择的彩种" %>
<%@attribute name="typeMap" type="java.util.Map" required="false" description="彩种类型" %>
<%@attribute name="codeMap" type="java.util.Map" required="false" description="彩种" %>
<%@attribute name="siteId" type="java.lang.Integer" required="false" description="站点ID,不指定时，取session中的站点ID" %>

<%
    if (siteId == null){
        siteId = SessionManagerCommon.getSiteId();
    }
    if (MapTool.isEmpty(typeMap)) {
        typeMap = Cache.getLotteryType();
    }
    if (MapTool.isEmpty(codeMap)) {
        codeMap = Cache.getLottery(siteId);
    }

    String searchCode = "";
    if (value != null) {
        if (value instanceof List) {
            List codes = (List) value;
            if (CollectionTool.isNotEmpty(codes)) {
                for (int i = 0; i < codes.size(); i++) {
                    searchCode += codes.get(i) + ",";
                }
                searchCode = searchCode.substring(0, searchCode.length() - 1);
            }
        } else if (value instanceof String[]) {
            String[] codes = (String[]) value;
            if (ArrayTool.isNotEmpty(codes)) {
                for (int i = 0; i < codes.length; i++) {
                    searchCode += codes[i] + ",";
                }
                searchCode = searchCode.substring(0, searchCode.length() - 1);
            }
        }
    }
%>
<c:set var="_siteId" value="<%= siteId%>"/>
<c:set var="_typeMap" value="<%= typeMap%>"/>
<c:set var="_codeMap" value="<%= codeMap%>"/>
<c:set var="_searchCode" value="<%= searchCode%>"/>
<div style="display: none">
    <span class="types">
        <c:forEach var="type" items="${typeMap}" varStatus="status">${type.value.typeCode},</c:forEach>
    </span>
    <span class="codes">
        <c:forEach var="code" items="${codeMap}" varStatus="status">${code.value.code},</c:forEach>
    </span>
</div>
<div id="selectLotteryDiv" data-init="false" data-siteid="${_siteId}" data-searchcode="${_searchCode}"
     class="form-group clearfix pull-left col-md-3 col-sm-12 m-b-sm padding-r-none-sm h-line-a senior">
    <div class="input-group">
        <span class="input-group-addon bg-gray" id="code">彩种选择</span>
        <span class="">
            <div class="btn-group" initprompt="10条" callback="query">
                <button type="button" class="btn btn btn-default right-radius select-lottery-toggle">
                    <span prompt="prompt" class="choose-num">请选择</span>
                    <span class="caret-a pull-right"></span>
                </button>
            </div>
        </span>
    </div>
    <div class="type-search type-search-game">
        <div class="search-top-menus">
            <button title="全选" class="btn btn-outline btn-filter choose-btn" type="button" data-type="all">全选</button>
            <button title="清空" class="btn btn-outline btn-filter choose-btn" type="button" data-type="clear">清空</button>
        </div>
        <div class="m-t">
            <table class="table table-bordered m-b-xxs" id="lotteryTable">
                <tbody>
                <c:forEach var="item" items="${_typeMap}" varStatus="status">
                    <tr>
                        <td class="bg-gray al-left lottery-type-group" style="width: 80px;"
                            data-type="${item.value.typeCode}"
                            data-typename="${item.value.typeName}">
                            <label><span class="m-l-xs"><b>${item.value.typeName}</b></span></label>
                        </td>
                        <td class="al-left td-code">
                            <c:forEach var="codeItem" items="${_codeMap}" varStatus="vs">
                                <c:if test="${item.value.typeCode == codeItem.value.type}">
                                    <label class="m-r-sm">
                                        <input type="checkbox" class="i-checks"
                                            ${not empty _searchCode and fn:contains(_searchCode, codeItem.value.code) ? 'checked' : ''}
                                               name="${name}"
                                               value="${codeItem.value.code}"
                                               data-type="${item.value.typeCode}"
                                               data-code="${codeItem.value.code}"
                                               data-codename="${codeItem.value.name}"
                                               data-typename="${item.value.typeName}">
                                        <span class="m-l-xs">${codeItem.value.name}</span>
                                    </label>
                                </c:if>
                            </c:forEach>
                        </td>
                    </tr>
                </c:forEach>
                </tbody>
            </table>
        </div>
    </div>
</div>

