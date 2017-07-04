<div id="chatbox_${idChat}" class="chatbox cListChats">
	<div class="chatboxhead">
		<h3>${title}</h3>
		<div class="chatboxoptions">
			<a class="close" href="javascript:void(0)"
				onclick="chat.closeChatBox(this)">×</a>
			<div id="cssmenuch"></div>
		</div>
		<span class="tools pull-right"> 
			<a class="fa fa-chevron-down" href="javascript:;"></a>
		</span> 
		<br clear="all" />
	</div>
	<div class="cConversation" id="chatMessages${idChat}"></div>
	<footer>
		<div class="chat-text">
			<input name="${idChat}" id="message${idChat}" onkeypress="messageKeyPress(this,event);" type="text" class="chatboxinput">
		</div>
		<div class="btnsChat">
			<div class="btn-group">
				<button style="display:none;" class="btn btn-white" type="button">
					<i class="fa fa-meh-o fa-2"></i>
				</button>
				<button style="display:none;" class="btn btn-white" type="button">
					<i class=" fa fa-paperclip"></i>
				</button>
			</div>
			<button class="btn btn-danger" onclick="btnSendChat(this,event)">Send</button>
		</div>
	</footer>
</div>