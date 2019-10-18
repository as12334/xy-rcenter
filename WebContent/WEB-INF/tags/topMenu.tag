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
<%@ tag import="sun.rmi.runtime.Log" %>
<%@ tag import="so.wwb.creditbox.model.common.TopMenuJson" %>


<%@ tag language="java" pageEncoding="UTF-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@taglib uri="http://shiro.apache.org/tags" prefix="shiro"%>
<jsp:doBody var="bodyRes" />
<%@attribute name="menuJson" type="java.lang.String" required="true" description="菜单json" %>
<%@attribute name="search" type="java.lang.String" required="true" description="激活的标签类型" %>
<%@attribute name="callback" type="java.lang.String" required="false" description="回调函数" %>

<%
    List list = new ArrayList();
    if (menuJson != null && !menuJson.equals("")) {
        try {
            if (menuJson.contains("},{")){
                if (menuJson.startsWith("[")){
                    menuJson = menuJson.substring(1, menuJson.length());
                }
                if (menuJson.endsWith("]")){
                    menuJson = menuJson.substring(0, menuJson.length() - 1);
                }
                menuJson = menuJson.replaceAll("},\\{", "}@@@{");
                String[] splits = menuJson.split("@@@");
                for (int i = 0; i < splits.length; i++){
                    list.add(JsonTool.fromJson(splits[i], TopMenuJson.class));
                }
            }
        }catch (Exception e){

        }
    }
%>

<ul id="diyTopMenuUl" class="clearfix sys_tab_wrap top_menu_ul" loaded="false" callback="${callback}">
    <c:forEach items="<%= list%>" var="li" varStatus="status">
        <c:if test="${fn:length(fn:trim(li['permission'])) == 0}">
            <li class="${(empty search and status.index == 0) or search eq li['pageType'] ? 'active' : ''}"
                data-permission="${li['permission']}"
                data-url="${li['url']}"
                data-soul="false"
                data-page="${li['pageType']}">
                <a href="javascript: void (0)">${li['name']}</a>
            </li>
        </c:if>
        <c:if test="${fn:length(fn:trim(li['permission'])) > 0}">
            <shiro:hasPermission name="${fn:trim(li['permission'])}">
                <li class="${(empty search and status.index == 0) or search eq li['pageType'] ? 'active' : ''}"
                    data-url="${li['url']}"
                    data-soul="false"
                    data-page="${li['pageType']}">
                    <a href="javascript: void (0)">${li['name']}</a>
                </li>
            </shiro:hasPermission>
        </c:if>
    </c:forEach>
</ul>
