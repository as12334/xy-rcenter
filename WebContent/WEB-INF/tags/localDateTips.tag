
<%@ tag import="so.wwb.lotterybox.web.tools.SessionManagerCommon" %>
<%@ tag import="so.wwb.lotterybox.web.cache.Cache" %>
<%@ tag import="java.util.*" %>
<%@ tag import="org.soul.commons.locale.DateFormat" %>

<%@ tag language="java" pageEncoding="UTF-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib uri="http://soul/fnTag" prefix="soulFn"  %>
<%@taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@taglib uri="http://shiro.apache.org/tags" prefix="shiro"%>
<jsp:doBody var="bodyRes" />
<%@attribute name="type" type="java.lang.String" required="false" description="" %>
<%@attribute name="time" type="java.util.Date" required="true" description="时间" %>
<c:set var="timeZone" value="<%= SessionManagerCommon.getTimeZone() %>"/>
<c:set var="DateFormat" value="<%= new DateFormat() %>"/>
<c:set var="locale" value="<%=SessionManagerCommon.getLocale() %>"/>
<c:if test="${empty type and not empty time}">
    <span data-content="${soulFn:formatDateTz(time, DateFormat.DAY_SECOND, timeZone)}"
          data-placement="top" data-trigger="focus" data-toggle="popover" data-container="body"
          role="button" class="ico-lock" tabindex="0" data-original-title="" title="">
        <apan class="co-grayc2">${soulFn:formatTimeMemo(time, locale)}</apan>
    </span>
</c:if>

