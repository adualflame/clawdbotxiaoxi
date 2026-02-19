"""
PredictMe Market Observer
先观察 20+ 轮，收集数据，不下注
"""
import requests
import time
import json
from datetime import datetime
from pathlib import Path

API_BASE = "https://api.predictme.me/api/v1/agent"
API_KEY = "pm_agent_01d29cc86d9b24571dd2f171f860c151"
HEADERS = {"Authorization": f"Bearer {API_KEY}"}

DATA_FILE = Path(__file__).parent.parent / "memory" / "predictme_observations.json"

def load_observations():
    if DATA_FILE.exists():
        return json.loads(DATA_FILE.read_text(encoding="utf-8"))
    return {"rounds": [], "stats": {"total": 0, "up": 0, "down": 0}}

def save_observations(data):
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    DATA_FILE.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")

def get_odds(asset="BTC"):
    """获取当前赔率数据"""
    try:
        r = requests.get(f"{API_BASE}/odds/{asset}", headers=HEADERS, timeout=15)
        if r.status_code == 200:
            return r.json()
    except Exception as e:
        print(f"Error: {e}")
    return None

def analyze_round(odds_data):
    """分析一轮数据"""
    if not odds_data or not odds_data.get("success"):
        return None
    
    data = odds_data["data"]
    base_price = float(data["basePrice"])
    current_price = float(data["currentPrice"])
    grids = data.get("grids", [])
    
    if not grids:
        return None
    
    price_diff = current_price - base_price
    price_move_pct = (price_diff / base_price) * 100
    direction = "UP" if price_diff > 0 else "DOWN"
    
    # 找到当前价格所在的 grid
    current_grid = None
    for grid in grids:
        strike_min = float(grid["strikePriceMin"])
        strike_max = float(grid["strikePriceMax"])
        if strike_min <= current_price <= strike_max:
            current_grid = grid
            break
    
    return {
        "timestamp": datetime.now().isoformat(),
        "base_price": base_price,
        "current_price": current_price,
        "price_move_pct": round(price_move_pct, 4),
        "direction": direction,
        "expiry_at": grids[0]["expiryAt"] if grids else None,
        "grid_count": len(grids),
        "current_grid_odds": float(current_grid["odds"]) if current_grid else None,
        "odds_range": [float(grids[-1]["odds"]), float(grids[0]["odds"])] if grids else None
    }

def observe_one_round():
    """观察一轮"""
    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] 获取 BTC 数据...")
    odds = get_odds("BTC")
    
    if not odds:
        print("  无法获取数据")
        return None
    
    analysis = analyze_round(odds)
    if not analysis:
        print("  无有效数据")
        return None
    
    print(f"  基准价: ${analysis['base_price']:,.2f}")
    print(f"  当前价: ${analysis['current_price']:,.2f}")
    print(f"  变动: {analysis['price_move_pct']:+.4f}% ({analysis['direction']})")
    print(f"  当前 grid 赔率: {analysis['current_grid_odds']}x" if analysis['current_grid_odds'] else "  当前价格不在任何 grid 内")
    
    return analysis

def main():
    print("=" * 50)
    print("PredictMe 市场观察器")
    print("目标: 观察 20+ 轮，收集数据，暂不下注")
    print("=" * 50)
    
    observations = load_observations()
    target_rounds = 20
    
    print(f"\n已有 {len(observations['rounds'])} 轮数据")
    
    if len(observations['rounds']) >= target_rounds:
        print(f"\n✓ 已完成 {target_rounds} 轮观察!")
        print(f"  UP: {observations['stats']['up']} 次")
        print(f"  DOWN: {observations['stats']['down']} 次")
        
        # 计算平均价格变动
        moves = [r['price_move_pct'] for r in observations['rounds'] if r.get('price_move_pct')]
        if moves:
            avg_move = sum(abs(m) for m in moves) / len(moves)
            print(f"  平均变动幅度: {avg_move:.4f}%")
        return observations
    
    remaining = target_rounds - len(observations['rounds'])
    print(f"还需观察 {remaining} 轮\n")
    
    last_expiry = None
    
    while len(observations['rounds']) < target_rounds:
        analysis = observe_one_round()
        
        if analysis:
            # 检查是否是新的一轮
            if analysis['expiry_at'] != last_expiry:
                observations['rounds'].append(analysis)
                observations['stats']['total'] += 1
                if analysis['direction'] == 'UP':
                    observations['stats']['up'] += 1
                else:
                    observations['stats']['down'] += 1
                
                last_expiry = analysis['expiry_at']
                save_observations(observations)
                print(f"  [已记录 {len(observations['rounds'])}/{target_rounds}]")
            else:
                print("  (同一轮，跳过)")
        
        # 等待下一轮 (每轮 10 秒)
        print("  等待 12 秒...")
        time.sleep(12)
    
    print("\n" + "=" * 50)
    print(f"观察完成! 共 {len(observations['rounds'])} 轮")
    print(f"UP: {observations['stats']['up']} | DOWN: {observations['stats']['down']}")
    print("=" * 50)
    
    return observations

if __name__ == "__main__":
    main()
