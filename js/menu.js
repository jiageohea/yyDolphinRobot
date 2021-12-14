var menuClickUser = {"uid":0,"cid":0};//点击按钮的用户信息
var msgToken = 0;

function initMenuApp()
{
	yy.channel.userListPopMenu.addEventListener(IYYChannelUserListPopMenu.CLICKED,onClicked);
}
function removeMenuApp()
{
	
}
function onClicked(eventData)
{
	menuClickUser = eventData;
	return menuClickUser;
}
function setPopMenu(title)
{
	var res = yy.channel.userListPopMenu.setPopMenu(title);
	if(res.ret == 0){
		layer.msg('创建用户右键成功!');
		return res;
	}else{
		layer.msg('右键创建失败!');
		return res;
	}
}
function removePopMenu()
{
	var res = yy.channel.userListPopMenu.unSetPopMenu();
	if(res.ret == 0){
		layer.msg('右键已移除!');
		return res;
	}else{
		layer.msg('右键移除失败!');
		return res;
	}
}
function initSoftApp()
{
	yy.channel.appMsg.addEventListener(IYYChannelAppMsg.APP_LINK_CLICKED,onLinkClicked);
	//yy.channel.appMsg.addEventListener(IYYChannelAppMsg.APP_LINK_EX_CLICKED,onLinkExClicked);
}
function removeSoftApp()
{
	
}
/**
 * @param {int} subChannelId
 * @param {str} msg
 * @param {int} linkstart
 * @param {int} linkend
 * @param {int} token
 */
function sendSoftMsgToChannel(subChannelId, msg, linkstart, linkend, token)
{
	var res = yy.channel.appMsg.sendMsgToSubChannel(subChannelId, msg, linkstart, linkend, token);
	return res;
}
/**
 * @param {arr} userList
 * @param {str} msg
 * @param {int} linkstart
 * @param {int} linkend
 * @param {int} token
 */
function sendSoftMsgToUser(userList, msg, linkstart, linkend, token)
{
	var res = yy.channel.appMsg.sendMsgToUsers(userList, msg, linkstart, linkend, token);
	return res;
}
function onLinkClicked(eventData)
{
	msgToken = eventData.token;
	return msgToken;
}