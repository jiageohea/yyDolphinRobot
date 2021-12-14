/**
 * 初始化所有内容
 */
function initApp()
{
	console.log('正在初始化所有APP中...');
}
/**
 * @param {Object} uid
 * @param {Object} msg
 */
function onChatToUser(uid,msg)
{
	msg = msg || '我正在这边嗨哦,快来围观';
	let ret = yy.im.chatTo(uid,msg);
	return ret;
}

function onJumpToChannel(cid)
{
	let ret = yy.channel.userController.jumpToSubChannel(cid);
	return ret;
}

function onPlayMusic()
{
	
}