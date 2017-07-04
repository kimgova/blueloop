<div id="sidebar" class="mini-menu">
    <ul class="sidebar-menu" id="nav-accordion">
        <li class="<g:if test="${pageProperty(name: 'meta.pageActive') == 'home'}"> active</g:if>">
            <g:link controller="index" action="index">
                <i class="icon-home"></i>
                <span class="menu-text breadcrump">Home</span>
            </g:link>
        </li>
        <%--
        <li class="<g:if test="${pageProperty(name: 'meta.pageActive') == 'profile'}"> active</g:if>">
            <g:link controller="user" action="profile" class="myProfile">
                <i class="fa fa-user"></i>
                <span class="menu-text"><g:message code="user.MyProfile" /></span>
            </g:link>
        </li>
        --%>
        <li class="sub-menu">
            <a href="#" class="<g:if test="${pageProperty(name: 'meta.pageActive') == 'users'}"> active</g:if>">
                <i class="icon-people"></i> 
                <span class="menu-text"><g:message code="general.users" /></span>
            </a>
            <ul class="sub">
                <li class="<g:if test="${pageProperty(name: 'meta.navActive') == 'search'}"> active</g:if>">
                    <g:link elementId="people" controller="search" class="breadcrump">   
                        <g:message code="contacts.people" />
                    </g:link>
                </li>
                <li class="<g:if test="${pageProperty(name: 'meta.navActive') == 'teamworks'}"> active</g:if>">
                    <g:link elementId="list" controller="teamwork" action="list" class="breadcrump">
                        <g:message code="general.teamworks" />
                    </g:link>
                </li>
            </ul>
        </li>
        <li class="<g:if test="${pageProperty(name: 'meta.navActive') == 'buildingBlocks'}"> active</g:if>">
            <g:link controller="buildingBlock" action="list">
                <i class="icon-grid"></i>
                 <span class="menu-text"><g:message code="bb.myBBs" /></span>
            </g:link>
        </li>
        <li class="<g:if test="${pageProperty(name: 'meta.navActive') == 'loops'}"> active</g:if>">
            <g:link controller="chain" action="list" class="breadcrump">
                <i class="icon-refresh"></i> 
                <span class="menu-text"><g:message code="user.loops" /></span>
            </g:link>
        </li>
    </ul>
</div>