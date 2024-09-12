function getNextPlayerId(playerList:[any]) {
	// 提取playerList中的所有玩家ID的数字部分
	const playerNumbers = playerList.map((player:any) => {
	  const match = player.id.match(/Player_(\d+)/); // 使用正则表达式匹配Player_后面的数字
	  return match ? parseInt(match[1], 10) : 0; // 将匹配到的数字转换为整数
	});
  
	// 找到最大数字
	const maxNumber = Math.max(...playerNumbers);
  
	// 检查最大数字是否大于玩家数量
	const nextNumber = maxNumber > playerList.length ? maxNumber + 1 : playerList.length + 1;
  
	// 返回新的玩家ID
	return `Player_${nextNumber}`;
  }
  
  // 示例用法



  export default {
	getNextPlayerId
  }