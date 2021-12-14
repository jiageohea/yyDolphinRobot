var currentUserInfo = {};//当前用户信息

function initUserApp()
{
	yy.user.addEventListener(IYYUser.USER_INFO_CHANGED,onUserInfoChange);
}
function onUserInfoChange(eventData)
{
	console.log('用户信息变化'+eventData);
}
function setUserName(newName)
{	
	//两次需要大于1秒
	var name = yy.user.rename(newName);
	return name;
}
function getCurrentUser()
{
	var user = yy.user.getCurrentUserInfo();
	currentUserInfo; = formatUserInfo(user);
	return currentUserInfo;
}
function formatUserInfo(user)
{
	if(user.ret == 0){
		userInfo = user;
		var role = user.role;
		var sexStr = user.sex == 0 ? '_f':'_m';
		switch(role){
			case 0:
				userInfo.roleName = '无效角色';
				userInfo.roleDesc = '无效';
				userInfo.user_role = 'no' + sexStr;
				break;
			case 20:
				userInfo.roleName = '未知用户';
				userInfo.roleDesc = '灰马';
				userInfo.user_role = 'gray' + sexStr;
				break;
			case 25:
				userInfo.roleName = '游客';
				userInfo.roleDesc = '白马';
				userInfo.user_role = 'u' + sexStr;
				break;
			case 66:
				userInfo.roleName = '临时嘉宾';
				userInfo.roleDesc = '浅绿色马';
				userInfo.user_role = 'g' + sexStr;
				break;
			case 88:
				userInfo.roleName = '嘉宾';
				userInfo.roleDesc = '绿马';
				userInfo.user_role = 'vip' + sexStr;
				break;
			case 100:
				userInfo.roleName = '会员';
				userInfo.roleDesc = '蓝马';
				userInfo.user_role = 'r' + sexStr;
				break;
			case 150:
				userInfo.roleName = '二级子管理';
				userInfo.roleDesc = '粉马';
				userInfo.user_role = 'ca2' + sexStr;
				break;
			case 175:
				userInfo.roleName = '一级子管理';
				userInfo.roleDesc = '红马';
				userInfo.user_role = 'ca' + sexStr;
				break;
			case 200:
				userInfo.roleName = '全频管理';
				userInfo.roleDesc = '黄马';
				userInfo.user_role = 'ma' + sexStr;
				break;
			case 230:
				userInfo.roleName = '全频总管理';
				userInfo.roleDesc = '橙马';
				userInfo.user_role = 'vp' + sexStr;
				break;
			case 255:
				userInfo.roleName = '创建者';
				userInfo.roleDesc = '紫马';
				userInfo.user_role = 'ow' + sexStr;
				break;
			case 300:
				userInfo.roleName = '官方客服';
				userInfo.roleDesc = '未知客服';
				userInfo.user_role = 'ow' + sexStr;
				break;
			case 1000:
				userInfo.roleName = '官方人员';
				userInfo.roleDesc = '黑马';
				userInfo.user_role = 'ow' + sexStr;
				break;
		}
	}
	return userInfo;
}