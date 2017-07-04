<div>
	<div class="col-lg-12">
		<!--latest product info start-->
<%--		<section class="panel post-wrap pro-box">--%>
<%--			<aside>--%>
<%--				<div class="post-info">--%>
<%--					<span class="arrow-pro right"></span>--%>
<%--					<div class="panel-body">--%>
<%--						<h1>--%>
<%--							<strong>popular</strong> <br> BB of this week--%>
<%--						</h1>--%>
<%--						<div class="desk yellow">--%>
<%--							<h3>North Warehouse</h3>--%>
<%--							<p>Lorem ipsum dolor set amet lorem ipsum dolor set amet--%>
<%--								ipsum dolor set amet</p>--%>
<%--						</div>--%>
<%--						<div class="post-btn">--%>
<%--							<a href="javascript:;"> <i class="fa fa-chevron-circle-left"></i>--%>
<%--							</a> <a href="javascript:;"> <i--%>
<%--								class="fa fa-chevron-circle-right"></i>--%>
<%--							</a>--%>
<%--						</div>--%>
<%--					</div>--%>
<%--				</div>--%>
<%--			</aside>--%>
<%----%>
<%--			<aside class="post-highlight yellow v-align">--%>
<%--				<div class="panel-body text-center">--%>
<%--					<div class="pro-thumb">--%>
<%--						<img--%>
<%--							src="${resource(dir: 'images/img/', file: 'warehouse_ex.jpg')}"--%>
<%--							alt="">--%>
<%--					</div>--%>
<%--				</div>--%>
<%--			</aside>--%>
<%--		</section>--%>
		<!--latest product info end-->

		<!--twitter feedback start-->
		<section class="panel post-wrap pro-box">
			<aside class="post-highlight terques v-align">
				<div class="panel-body">
					<h2>
						Blue-loop is new model of supply chain <a href="javascript:;">
							http://blue-loop.com/</a> 4 days ago by Andres Hernandez
					</h2>
				</div>
				<footer class="social-footer">
							<ul>
								<li><a href="#"> <i class="fa fa-facebook"></i></a></li>
								<li class="active"><a href="#"> <i
										class="fa fa-twitter"></i></a></li>
								<li><a href="#"> <i class="fa fa-google-plus"></i></a></li>
								<li><a href="#"> <i class="fa fa-pinterest"></i></a></li>
							</ul>
					</footer>
			</aside>

			<aside>
				<div class="post-info">
					<span class="arrow-pro left"></span>
					<div class="panel-body" style="padding:0">
								<g:if test="${screen_name != ''}">
									<a class="twitter-timeline"
										href="https://twitter.com/${screen_name}"
										data-screen-name="${screen_name}"
										data-widget-id="527947517359443969"
										lang='<g:message code="default.language"/>' width="600" height="305"> Tweets by ${screen_name}
									</a>
								</g:if>
					</div>
				</div>
			</aside>
		</section>
		<!--twitter feedback end-->
	</div>

	<!--end row  -->
	
</div>