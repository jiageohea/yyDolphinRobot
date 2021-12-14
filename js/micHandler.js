var operateUid = null; //操作员ID
var channelMode = 2;//频道模式 0=自由模式，1=主席模式，2=麦序模式。
var userInfo = {}; //用户的信息
var adminInfo = {}; //当前管理信息
var speakState = false;//用户的说话状态
var autoSetMicList = true;//自动恢复麦序-锁麦模式
var micList = []; //麦序列表
var micHistoryList = [];
var micListTotal = 0;//麦序总人数
var linkMicTotal = 0;//连麦总人数
var linkMicList = [];//连麦列表
var micModeLock = true;//麦序模式锁定-锁厅模式
var micControlFlag = false;//控-true放-false麦状态
var micEnableFlag = true;//开-true禁麦-false状态
var firstMicBalance = 0;//首麦麦序时间
var firstMicUid = 0;//首麦UID
var notificationInfo = {"hasPush":false,"uid":0,"username":"时稚麦"};//发送麦提信息

function initMicApp()
{
	yy.channel.micList.addEventListener(IYYChannelMicList.CONTROLLED,onMicControlled);
	yy.channel.micList.addEventListener(IYYChannelMicList.RELEASED,onMicReleased);
	yy.channel.micList.addEventListener(IYYChannelMicList.DISABLE_JOIN,onMicDisableJoin);
	yy.channel.micList.addEventListener(IYYChannelMicList.ENABLE_JOIN,onMicEnableJoin);
	yy.channel.micList.addEventListener(IYYChannelMicList.MODE_CHANGED,onModeChanged);
	yy.channel.micList.addEventListener(IYYChannelMicList.NOTIFICATION,onRecvNotification);
	yy.channel.micList.addEventListener(IYYChannelMicList.SPEAKING_STATE_CHANGED,onSpeakingStateChanged);
	yy.channel.micList.addEventListener(IYYChannelMicList.TIME_CHANGED,onMicTimeChanged);
	yy.channel.micList.addEventListener(IYYChannelMicList.USER_JOIN,onUserJoin);
	yy.channel.micList.addEventListener(IYYChannelMicList.USER_LEAVE,onUserLeave);
	yy.channel.micList.addEventListener(IYYChannelMicList.USER_LINKED,onUserLinked);
	yy.channel.micList.addEventListener(IYYChannelMicList.USER_UNLINKED,onUserUnlinked);
	yy.channel.micList.addEventListener(IYYChannelMicList.USER_MOVE,onUserMove);
	yy.channel.micList.addEventListener(IYYChannelMicList.CLEAR,onUserClear);
	getMicState();
}
function removeMicApp()
{
	
}
function getMicState()
{
	var ch =  yy.channel.micList.getMicListMode();
	if(ch.mode == 2){
		var res = yy.channel.micList.isMicListControlled();
		var res2 = yy.channel.micList.isJoinMicListEnabled();
		micControlFlag = res.controlled;
		micEnableFlag = res2.enabled;
		changeBtnSate(micControlFlag,'mic_long',micControlFlag ? '放麦':'控麦','layui-btn-warn');
		changeBtnSate(micEnableFlag,'mic_stop',micControlFlag ? '禁麦':'开麦','layui-btn-warn');
		refreshMicList();
		refreshLinkMicList();
		setInterval(refreshMicTime,1000);
	}else if(micModeLock){
		var res = yy.channel.micList.setMicListMode(2);
		if(res.ret != 0){
			layer.msg('麦序保障启动失败...');
			$('#mic_app').text('麦序管理(非麦序)');
		}
	}else{
		$('#mic_app').text('麦序管理(非麦序)');
	}	
}
function onMicControlled(eventData)
{
	operateUid = eventData.adminUid;
	return operateUid
}
function onMicReleased(eventData)
{
	operateUid = eventData.adminUid;
	return operateUid
}
function onMicDisableJoin(eventData)
{
	operateUid = eventData.adminUid;
	return operateUid
}
function onMicEnableJoin(eventData)
{
	operateUid = eventData.adminUid;
	return operateUid
}
function onModeChanged(eventData)
{
	if(micModeLock){
		var res = yy.channel.micList.setMicListMode(2);
		if(res.ret != 0){
			layer.msg('麦序保障启动失败...');
			$('#mic_app').text('麦序管理(非麦序)');
		}else{
			return false;
		}
	}
	if(mode != eventData.mode){
		removeMicApp();
		$('#mic_app').text('麦序管理(非麦序)');
	}else if(eventData.mode == 2){
		initMicApp();
	}
}
function onRecvNotification(eventData)
{
	operateUid = eventData.adminUid;
	return operateUid
}
function onSpeakingStateChanged(eventData)
{
	userInfo['uid'] = eventData.uid;
	userInfo['speaking'] = eventData.speaking;
	userInfo['speak'] = eventData.speaking ? '说话中':'闭麦中';
	//更改用户说话的状态
	var png = '/images/sound_on.gif';
	var lpng = '/images/sound_on2.gif';
	var opng = '/images/sound_off.gif';
	var muid = eventData.uid;
	var flag = eventData.speaking;
	if(flag){
		if(muid in micList){
			if(muid in linkMicList){
				$('#user-mic-state_' + muid).attr('src',lpng);
			}else{
				$('#user-mic-state_' + muid).attr('src',png);
			}
		}else{
			//处理非麦序又开麦事件
			console.log('处理非麦序又开麦事件-待开发');
			return '';
		}
	}else{
		$('#user-mic-state_' + muid).attr('src',opng);
	}	
	return userInfo;
}
function onMicTimeChanged(eventData)
{
	operateUid = eventData.adminUid;
	var uid = eventData.uid;
	var total = eventData.seconds;
}
function onUserJoin(eventData)
{	
	//更新用户加入麦序的时间
	var uid = eventData.uid;
	refreshMicList();
}
function onUserLeave(eventData)
{
	//更新用户离开麦序的时间
	var uid = eventData.uid;
	refreshMicList();
}
function onUserLinked(eventData)
{
	var uid = eventData.uid;
	refreshLinkMicList();
}
function onUserUnlinked(eventData)
{
	var uid = eventData.uid;
	refreshLinkMicList();
}
function onUserMove(eventData)
{
	var uid = eventData.uid;
	var afterUid = eventData.toAfterId;
	refreshMicList();
}
function onUserClear(eventData)
{
	if(autoSetMicList){
		//自动恢复麦序
		micList.forEach(item=>{
			pushUserToMic(item);
		});
		//自动恢复连麦
		linkMicList.forEach(item=>{
			setUserLink(item);
		});
	}
}
function onMicLong()
{
	if(micControlFlag){
		var res = yy.channel.micList.controlMicList();
		if(res.ret == 0){
			!micControlFlag;
			changeBtnSate(true,'mic_long','放麦','layui-btn-warn');
		}
	}else{
		var res = yy.channel.micList.releaseMicList();
		if(res.ret == 0){
			!micControlFlag;
			changeBtnSate(false,'mic_long','控麦','layui-btn-warn');
		}
	}
}
function onMicStop()
{
	if(micEnableFlag){
		var res = yy.channel.micList.disableJoinMicList();
		if(res.ret == 0){
			!micEnableFlag;
			changeBtnSate(true,'mic_stop','开麦','layui-btn-warn');
		}
	}else{
		var res = yy.channel.micList.enableJoinMicList();
		if(res.ret == 0){
			!micEnableFlag;
			changeBtnSate(false,'mic_stop','禁麦','layui-btn-warn');
		}
	}
}
function changeBtnSate(type,elem,text,cls)
{
	$('#'+elem).text(text);
	if(type){
		$('#'+elem).addClass(cls);
	}else{
		$('#'+elem).removeClass(cls);
	}
}
function onMicTimeAdd(type)
{
	var res = yy.channel.micList.doubleFirstMicSeconds();
	var currTime = refreshMicTime();
	if(type == 1){
		return false;
	}
	if(type == 999 && currTime < 9996){
		onMicTimeAdd(type);
	}
}
function refreshMicTime()
{
	var res = yy.channel.micList.getFirstMicSeconds();
	micBalance = res.ret == 0 ? res.seconds : 0;
	$('#mic_balance').text(micBalance);//刷新麦序时间
	return micBalance;
}
function refreshMicList()
{
	var res = yy.channel.micList.getMicList();
	micList = res.micList;
	micListTotal = micList.length;
	if(micListTotal > 0){
		$('#mic_clear').removeClass('layui-btn-disable');
	}
	if(micListTotal> 1){
		$('#mic_notification').removeClass('layui-btn-disable');
	}
	//绘制麦序列表
	drawMicListView();
	if(res.ret == 0 && micListTotal>0){
		//获取所有用户信息
	}
}
function refreshLinkMicList()
{
	var res = yy.channel.micList.linkedMicList();
	linkMicList = res.linkedMicList;
	linkMicTotal = linkMicList.length;
	return false;
}
function onMicNotification()
{
	if(micList[1] !== notificationInfo.uid){
		var res = yy.channel.micList.sendMicListNotification();
		if(res.ret == 0){
			notificationInfo.hasPush = true;
		}		
	}else{
		layer.msg('已经发送用户['+notificationInfo.username+']过麦提了');
	}	
}
function onMicListClear()
{
	if(autoSetMicList){
		layer.msg('管理员['+adminInfo.name+']开启麦序自动恢复,本次不可操作!')
	}else{
		var res = yy.channel.micList.clearMicList();
	}
}
function pushUserToMic(uid)
{
	var res = yy.channel.micList.pullUserToMicList(uid);
	return res;
}
function kickUserFromMic(uid)
{
	var res = yy.channel.micList.kickMicListUser(uid);
	return res;
}
function moveUserDown(uid)
{
	var res = yy.channel.micList.moveDownOnePosition(uid);
	return res;
}
function moveUserUp(uid)
{
	var res = yy.channel.micList.moveUpOnePosition(uid);
	return res;
}
function moveUserTop(uid)
{
	var res = yy.channel.micList.moveUserToTop(uid);
	return res;
}
function removeUserLink(uid)
{
	var res = yy.channel.micList.removeFromLinkedMicList(uid);
	return res;
}
function setUserLink(uid)
{
	var res = yy.channel.micList.linkMicToTheQueueHead(uid);
	return res;
}
function drawMicListView()
{
	//绘制麦序列表数据
	var html = '';
	var index = 0;
	micList.forEach(uid=>{
		var user = getOneUserInfo(uid);
		index++;
		html += '<li>'
		var link = index != 1 && linkMicTotal < 5 ? '':'layui-btn-disable';
		var top = index >=3  && micListTotal >= 3 ? '':'layui-btn-disable';
		var up = index >=3 && micListTotal >= index ? '':'layui-btn-disable';
		var down = index >=3 && micListTotal > index ? '':'layui-btn-disable';
		var kick = index != 1 > index ? '':'layui-btn-disable';
		html += '<button class="layui-btn layui-btn-sm layui-btn-normal' + link + '" onclick="setUserLink(' + uid + ')">连</button>';
		html += '<button class="layui-btn layui-btn-sm layui-btn-normal' + top + '" onclick="moveUserTop(' + uid + ')">顶</button>';
		html += '<button class="layui-btn layui-btn-sm layui-btn-normal' + up + '" onclick="moveUserUp(' + uid + ')">上</button>';
		html += '<button class="layui-btn layui-btn-sm layui-btn-normal' + down + '" onclick="moveUserDown(' + uid + ')">下</button>';
		html += '<button class="layui-btn layui-btn-sm layui-btn-danger' + kick + '" onclick="kickUserFromMic(' + uid + ')">踢</button>';
		html += '<span class="mic-list-item">' + index + '.</span>';
		html += '<img src="images/sound_off.gif" class="mic-list-item-img" id="user-mic-state_' + uid + '"/>';
		html += '<img src="images/' + user.user_role + '.png" class="mic-list-item-img">';
		html += '<a href="javascript:onChatToUser(' + uid + ')">' + user.name + '</a>';
		html += '</li>';
	});
	$('#mic-list-area-id').html(html);
}
function logMicHistory()
{
	//读写上下麦的记录
	//micHistoryList
}