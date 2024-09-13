// tests/unit/getNextPlayerId.spec.js
import playerHelper from "@/Lib/PlayerHelper";

describe('getNextPlayerId', () => {
  it('should return Player_6 when the list is missing Player_4', () => {
    const playerList = [
      { id: 'Player_1' },
      { id: 'Player_2' },
      { id: 'Player_3' },
      { id: 'Player_5' },
    ];
    
    const result = playerHelper.getNextPlayerId(playerList);
    expect(result).toBe('Player_6');
  });

  it('should return Player_5 when there are 4 players in sequential order', () => {
    const playerList = [
      { id: 'Player_1' },
      { id: 'Player_2' },
      { id: 'Player_3' },
      { id: 'Player_4' },
    ];
    
    const result = playerHelper.getNextPlayerId(playerList);
    expect(result).toBe('Player_5');
  });

  it('should return Player_2 when there is only Player_1', () => {
    const playerList = [
      { id: 'Player_1' },
    ];
    
    const result = playerHelper.getNextPlayerId(playerList);
    expect(result).toBe('Player_2');
  });

  it('should return Player_1 when the player list is empty', () => {
    const playerList:any[]|any = [];
    
    const result = playerHelper.getNextPlayerId(playerList);
    expect(result).toBe('Player_1');
  });
});
