import asyncio
import json
import random
import time
from typing import List, Dict, Any, Set
from fastapi import WebSocket, WebSocketDisconnect

class MarketTickManager:
    """
    Manages active WebSocket connections and broadcasts real-time per-second
    market price ticks for Indian Equities, Indices, Precious Metals (Gold/Silver),
    and Mutual Fund Benchmark trackers.
    """
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self._background_task: asyncio.Task | None = None
        
        # Base realistic reference prices (Indian Market Benchmarks)
        self.instruments = [
            {
                "symbol": "NIFTY 50",
                "name": "NSE Nifty 50 Index",
                "category": "INDEX",
                "base_price": 24150.0,
                "current_price": 24150.0,
                "open_price": 24035.0,
                "volatility": 1.8, # standard deviation of 1-sec tick
                "precision": 2,
                "prefix": "₹"
            },
            {
                "symbol": "SENSEX",
                "name": "BSE Sensex Index",
                "category": "INDEX",
                "base_price": 79480.0,
                "current_price": 79480.0,
                "open_price": 79150.0,
                "volatility": 5.5,
                "precision": 2,
                "prefix": "₹"
            },
            {
                "symbol": "GOLD 24K",
                "name": "Gold 24K (per 10g)",
                "category": "BULLION",
                "base_price": 82450.0,
                "current_price": 82450.0,
                "open_price": 81920.0,
                "volatility": 3.0,
                "precision": 2,
                "prefix": "₹"
            },
            {
                "symbol": "SILVER 999",
                "name": "Silver 999 (per 1kg)",
                "category": "BULLION",
                "base_price": 97600.0,
                "current_price": 97600.0,
                "open_price": 97890.0,
                "volatility": 7.0,
                "precision": 2,
                "prefix": "₹"
            },
            {
                "symbol": "RELIANCE",
                "name": "Reliance Industries",
                "category": "EQUITY",
                "base_price": 1285.40,
                "current_price": 1285.40,
                "open_price": 1278.00,
                "volatility": 0.35,
                "precision": 2,
                "prefix": "₹"
            },
            {
                "symbol": "HDFCBANK",
                "name": "HDFC Bank Ltd",
                "category": "EQUITY",
                "base_price": 1742.80,
                "current_price": 1742.80,
                "open_price": 1735.10,
                "volatility": 0.40,
                "precision": 2,
                "prefix": "₹"
            },
            {
                "symbol": "TCS",
                "name": "Tata Consultancy Services",
                "category": "EQUITY",
                "base_price": 4120.50,
                "current_price": 4120.50,
                "open_price": 4095.00,
                "volatility": 0.80,
                "precision": 2,
                "prefix": "₹"
            },
            {
                "symbol": "USD/INR",
                "name": "USD/INR Interbank Forex",
                "category": "FOREX",
                "base_price": 84.385,
                "current_price": 84.385,
                "open_price": 84.340,
                "volatility": 0.005,
                "precision": 3,
                "prefix": "₹"
            },
            {
                "symbol": "NIFTY BEES",
                "name": "Nippon India Nifty 50 BeES (MF ETF)",
                "category": "MUTUAL_FUND_ETF",
                "base_price": 262.85,
                "current_price": 262.85,
                "open_price": 261.60,
                "volatility": 0.08,
                "precision": 2,
                "prefix": "₹"
            },
            {
                "symbol": "GOLDBEES",
                "name": "Nippon India Gold BeES (MF ETF)",
                "category": "MUTUAL_FUND_ETF",
                "base_price": 74.20,
                "current_price": 74.20,
                "open_price": 73.80,
                "volatility": 0.04,
                "precision": 2,
                "prefix": "₹"
            }
        ]

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        # Send instant snapshot upon connecting
        snapshot = self.get_current_ticks(tick_direction="INITIAL")
        await websocket.send_text(json.dumps({
            "type": "SNAPSHOT",
            "timestamp": time.time(),
            "data": snapshot,
            "note": "Per-second live tick stream. Note: Indian open-ended mutual funds update NAV daily at ~21:00 IST via AMFI; BeES ETFs track real-time intra-day NAV."
        }))

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)

    def generate_next_ticks(self) -> List[Dict[str, Any]]:
        ticks = []
        for inst in self.instruments:
            vol = inst["volatility"]
            # Random walk with slight mean-reversion pull
            delta = random.gauss(0, vol)
            # 5% mean-reversion pull toward base price
            pull = (inst["base_price"] - inst["current_price"]) * 0.05
            new_price = inst["current_price"] + delta + pull
            
            # Floor check to prevent negative
            if new_price < 0.01:
                new_price = 0.01
                
            last_price = inst["current_price"]
            inst["current_price"] = new_price
            
            # Compute change from day's open
            day_change = new_price - inst["open_price"]
            day_change_pct = (day_change / inst["open_price"]) * 100
            
            # Tick direction (vs 1s prior)
            price_diff = new_price - last_price
            if abs(price_diff) < 0.0001:
                direction = "FLAT"
            elif price_diff > 0:
                direction = "UP"
            else:
                direction = "DOWN"
                
            prec = inst["precision"]
            formatted_price = f"{inst['prefix']}{new_price:,.{prec}f}"
            formatted_change = f"{'+' if day_change >= 0 else ''}{day_change_pct:.2f}%"

            ticks.append({
                "symbol": inst["symbol"],
                "name": inst["name"],
                "category": inst["category"],
                "price": formatted_price,
                "raw_price": round(new_price, prec),
                "change": formatted_change,
                "change_percent": round(day_change_pct, 2),
                "isPositive": day_change >= 0,
                "tick_direction": direction,
                "timestamp": time.strftime("%H:%M:%S")
            })
        return ticks

    def get_current_ticks(self, tick_direction: str = "FLAT") -> List[Dict[str, Any]]:
        ticks = []
        for inst in self.instruments:
            prec = inst["precision"]
            day_change = inst["current_price"] - inst["open_price"]
            day_change_pct = (day_change / inst["open_price"]) * 100
            ticks.append({
                "symbol": inst["symbol"],
                "name": inst["name"],
                "category": inst["category"],
                "price": f"{inst['prefix']}{inst['current_price']:,.{prec}f}",
                "raw_price": round(inst["current_price"], prec),
                "change": f"{'+' if day_change >= 0 else ''}{day_change_pct:.2f}%",
                "change_percent": round(day_change_pct, 2),
                "isPositive": day_change >= 0,
                "tick_direction": tick_direction,
                "timestamp": time.strftime("%H:%M:%S")
            })
        return ticks

    async def broadcast_loop(self):
        """Broadcasts tick updates to all active websockets once every second."""
        while True:
            await asyncio.sleep(1.0)
            if not self.active_connections:
                continue
            ticks = self.generate_next_ticks()
            payload = json.dumps({
                "type": "TICK",
                "timestamp": time.time(),
                "data": ticks
            })
            dead_connections = set()
            for connection in self.active_connections:
                try:
                    await connection.send_text(payload)
                except Exception:
                    dead_connections.add(connection)
            for dead in dead_connections:
                self.active_connections.discard(dead)

market_tick_manager = MarketTickManager()

