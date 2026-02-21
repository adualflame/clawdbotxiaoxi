from PIL import Image, ImageDraw, ImageFont
import datetime

def create_poster(bg_path, data, output_path):
    img = Image.open(bg_path).convert('RGBA')
    img = img.resize((1080, 1920), Image.LANCZOS)
    
    overlay = Image.new('RGBA', img.size, (0, 0, 0, 140))
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)
    
    try:
        font_title = ImageFont.truetype("msyh.ttc", 80)
        font_large = ImageFont.truetype("msyh.ttc", 46)
        font_medium = ImageFont.truetype("msyh.ttc", 36)
        font_small = ImageFont.truetype("msyh.ttc", 30)
    except:
        font_title = font_large = font_medium = font_small = ImageFont.load_default()
    
    draw.text((540, 70), "Alpha速递", font=font_title, fill='#00d4ff', anchor='mt')
    draw.text((540, 165), datetime.datetime.now().strftime("%Y年%m月%d日"), font=font_medium, fill='#aaaaaa', anchor='mt')
    
    left_x, right_x = 50, 550
    
    # 左栏
    y = 260
    draw.text((left_x, y), "▲ 热门涨幅", font=font_large, fill='#ff6b6b')
    y += 70
    for item in data.get('gainers', [])[:4]:
        draw.text((left_x+15, y), f"{item['name']} {item['change']}", font=font_medium, fill='#4ade80')
        y += 48
        draw.text((left_x+15, y), f"${item['price']} {item['desc']}", font=font_small, fill='#888888')
        y += 58
    
    y += 30
    draw.text((left_x, y), "▼ 回调中", font=font_large, fill='#f87171')
    y += 70
    for item in data.get('losers', [])[:2]:
        draw.text((left_x+15, y), f"{item['name']} {item['change']}", font=font_medium, fill='#f87171')
        y += 48
        draw.text((left_x+15, y), f"${item['price']} {item['desc']}", font=font_small, fill='#888888')
        y += 58
    
    y += 30
    draw.text((left_x, y), "◆ 主流币", font=font_large, fill='#fbbf24')
    y += 70
    for item in data.get('majors', []):
        draw.text((left_x+15, y), f"{item['name']} ${item['price']} ({item['change']})", font=font_medium, fill='#e0e0e0')
        y += 55
    
    # 右栏
    y = 260
    draw.text((right_x, y), "★ NFT热门", font=font_large, fill='#f472b6')
    y += 70
    for n in data.get('nfts', [])[:4]:
        draw.text((right_x+15, y), f"{n['name']}", font=font_medium, fill='#e0e0e0')
        y += 48
        draw.text((right_x+15, y), f"{n['change']} {n.get('desc','')}", font=font_small, fill='#888888')
        y += 58
    
    y += 30
    draw.text((right_x, y), "● 板块表现", font=font_large, fill='#38bdf8')
    y += 70
    for s in data.get('sectors', [])[:4]:
        draw.text((right_x+15, y), f"{s['name']}", font=font_medium, fill='#e0e0e0')
        y += 48
        draw.text((right_x+15, y), f"{s['change']} {s.get('desc','')}", font=font_small, fill='#888888')
        y += 58
    
    # 底部趋势
    y = 1400
    draw.text((50, y), "◇ 新趋势分析", font=font_large, fill='#a78bfa')
    y += 70
    for i, line in enumerate(data.get('trends', [])[:4], 1):
        draw.text((70, y), f"{i}. {line}", font=font_small, fill='#c0c0c0')
        y += 52
    
    draw.text((540, 1850), "小晰 · 每日速递", font=font_small, fill='#666666', anchor='mt')
    img.convert('RGB').save(output_path, quality=95)

if __name__ == '__main__':
    data = {
        'gainers': [
            {'name': 'Zama', 'change': '+21%', 'price': '0.024', 'desc': 'FHE加密龙头'},
            {'name': 'AZTEC', 'change': '+19%', 'price': '0.037', 'desc': '隐私L2热度不减'},
            {'name': 'TIBBIR', 'change': '+16%', 'price': '0.17', 'desc': 'Virtuals生态'},
            {'name': 'ZRO', 'change': '+13%', 'price': '1.69', 'desc': '跨链协议强势'},
        ],
        'losers': [
            {'name': 'VVV', 'change': '-8%', 'price': '4.31', 'desc': 'AI代币回吐'},
            {'name': 'AAVE', 'change': '-2.5%', 'price': '122', 'desc': 'DeFi承压'},
        ],
        'majors': [
            {'name': 'BTC', 'price': '68,177', 'change': '+0.1%'},
            {'name': 'ETH', 'price': '1,972', 'change': '+0.3%'},
            {'name': 'SOL', 'price': '85', 'change': '+0.9%'},
        ],
        'nfts': [
            {'name': 'Moonbirds', 'change': '+27%', 'desc': '蓝筹反弹'},
            {'name': 'NodeMonkes', 'change': '+22%', 'desc': 'BTC NFT'},
            {'name': 'OMB', 'change': '+18%', 'desc': '持续走强'},
            {'name': 'Puppets', 'change': '+8%', 'desc': 'Ordinals'},
        ],
        'sectors': [
            {'name': 'Layer 0', 'change': '+5.7%', 'desc': '跨链热'},
            {'name': 'IP Meme', 'change': '+5.7%', 'desc': '叙事强'},
            {'name': 'Rollup', 'change': '+3.5%', 'desc': 'L2扩容'},
            {'name': 'DeFi', 'change': '+2.9%', 'desc': '稳步回暖'},
        ],
        'trends': [
            '隐私/FHE赛道继续领涨，Zama、AZTEC双双20%+',
            '跨链协议LayerZero突破$1.7，全链互操作需求旺盛',
            'BTC NFT系列连续两日上涨，Ordinals生态回暖',
            '大盘横盘整理，山寨币轮动明显',
        ]
    }
    create_poster('alpha_bg.png', data, 'alpha_poster.png')
    print('Done')
