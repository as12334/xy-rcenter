
<%@ tag import="so.wwb.lotterybox.web.tools.SessionManagerCommon" %>
<%@ tag import="so.wwb.lotterybox.web.cache.Cache" %>
<%@ tag import="java.util.*" %>

<%@ tag language="java" pageEncoding="UTF-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@taglib uri="http://shiro.apache.org/tags" prefix="shiro"%>
<jsp:doBody var="bodyRes" />
<%@attribute name="queryTitle" type="java.lang.String" required="true" description="搜索" %>
<%@attribute name="queryPrecall" type="java.lang.String" required="false" description="搜索前置方法" %>
<%@attribute name="resetTitle" type="java.lang.String" required="true" description="重置" %>
<%@attribute name="resetCallback" type="java.lang.String" required="false" description="重置回调方法" %>
<%@attribute name="pageType" type="java.lang.String" required="false" description="页面类型" %>

<button id="clearQueryParam" type="reset" class="hide"></button>
<a id="topMenuQuery" title="${queryTitle}" class="btn btn-info btn-addon" data-type="${pageType}" callback="" precall="${queryPrecall}">
    <i class="fa fa-search"></i><span class="hd">${queryTitle}</span>
</a>
<c:if test="${not empty resetTitle}">
    <a id="topMenuReset" title="${resetTitle}" class="btn btn-info btn-addon" style="margin-left: 10px" data-type="${pageType}" callback="${resetCallback}" precall="">
        <i class="fa fa-refresh"></i><span class="hd">${resetTitle}</span>
    </a>
</c:if>