import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Crosshair } from 'lucide-react';

interface Enemy {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  type: 'basic' | 'fast' | 'tank' | 'swarm';
  size: number;
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const W = 360;
const H = 360;

export default function SwarmArena() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [playerHP, setPlayerHP] = useState(100);
  const [gameState, setGameState] = useState<'playing' | 'dead'>('playing');
  const [best, setBest] = useState(0);

  const stateRef = useRef({
    player: { x: W / 2, y: H / 2 },
    enemies: [] as Enemy[],
    bullets: [] as Bullet[],
    particles: [] as Particle[],
    mouse: { x: W / 2, y: H / 2 },
    lastShot: 0,
    kills: 0,
    waveKills: 0,
    waveTarget: 5,
    nextEnemyId: 0,
    playerHP: 100,
    invincible: 0,
  });

  const reset = useCallback(() => {
    const s = stateRef.current;
    s.player = { x: W / 2, y: H / 2 };
    s.enemies = [];
    s.bullets = [];
    s.particles = [];
    s.kills = 0;
    s.waveKills = 0;
    s.waveTarget = 5;
    s.playerHP = 100;
    s.invincible = 0;
    s.lastShot = 0;
    setScore(0);
    setWave(1);
    setPlayerHP(100);
    setGameState('playing');
  }, []);

  const spawnEnemy = useCallback((wave: number) => {
    const s = stateRef.current;
    const side = Math.floor(Math.random() * 4);
    let x = 0, y = 0;
    if (side === 0) { x = Math.random() * W; y = -10; }
    else if (side === 1) { x = W + 10; y = Math.random() * H; }
    else if (side === 2) { x = Math.random() * W; y = H + 10; }
    else { x = -10; y = Math.random() * H; }

    const types: Enemy['type'][] = ['basic'];
    if (wave >= 2) types.push('fast');
    if (wave >= 3) types.push('tank');
    if (wave >= 4) types.push('swarm');
    const type = types[Math.floor(Math.random() * types.length)];

    const speed = type === 'fast' ? 2.5 : type === 'tank' ? 0.8 : type === 'swarm' ? 1.8 : 1.2;
    const hp = type === 'tank' ? 3 : type === 'swarm' ? 1 : 2;
    const size = type === 'tank' ? 12 : type === 'swarm' ? 4 : type === 'fast' ? 5 : 7;

    const angle = Math.atan2(s.player.y - y, s.player.x - x);
    s.enemies.push({
      id: s.nextEnemyId++,
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      hp, type, size,
    });
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let spawnTimer = 0;
    let currentWave = 1;

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      stateRef.current.mouse.x = (e.clientX - rect.left) * (W / rect.width);
      stateRef.current.mouse.y = (e.clientY - rect.top) * (H / rect.height);
    };

    const handleClick = (e: MouseEvent) => {
      const s = stateRef.current;
      const now = Date.now();
      if (now - s.lastShot < 150) return;
      s.lastShot = now;
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (W / rect.width);
      const my = (e.clientY - rect.top) * (H / rect.height);
      const angle = Math.atan2(my - s.player.y, mx - s.player.x);
      s.bullets.push({
        x: s.player.x, y: s.player.y,
        vx: Math.cos(angle) * 6, vy: Math.sin(angle) * 6,
        life: 60,
      });
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const mx = (touch.clientX - rect.left) * (W / rect.width);
      const my = (touch.clientY - rect.top) * (H / rect.height);
      stateRef.current.mouse.x = mx;
      stateRef.current.mouse.y = my;
      const s = stateRef.current;
      const angle = Math.atan2(my - s.player.y, mx - s.player.x);
      s.bullets.push({
        x: s.player.x, y: s.player.y,
        vx: Math.cos(angle) * 6, vy: Math.sin(angle) * 6,
        life: 60,
      });
    };

    canvas.addEventListener('mousemove', handleMouse);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });

    const loop = () => {
      const s = stateRef.current;

      // Move player toward mouse
      const dx = s.mouse.x - s.player.x;
      const dy = s.mouse.y - s.player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 3) {
        s.player.x += (dx / dist) * 3;
        s.player.y += (dy / dist) * 3;
      }
      s.player.x = Math.max(8, Math.min(W - 8, s.player.x));
      s.player.y = Math.max(8, Math.min(H - 8, s.player.y));

      // Spawn enemies
      spawnTimer++;
      const spawnRate = Math.max(15, 60 - currentWave * 5);
      if (spawnTimer >= spawnRate) {
        spawnTimer = 0;
        const count = currentWave >= 4 ? 3 : currentWave >= 2 ? 2 : 1;
        for (let i = 0; i < count; i++) spawnEnemy(currentWave);
      }

      // Update enemies
      for (const e of s.enemies) {
        const angle = Math.atan2(s.player.y - e.y, s.player.x - e.x);
        const speed = e.type === 'fast' ? 2.2 : e.type === 'tank' ? 0.7 : e.type === 'swarm' ? 1.5 : 1;
        e.vx = Math.cos(angle) * speed;
        e.vy = Math.sin(angle) * speed;

        // Swarm avoidance
        if (e.type === 'swarm') {
          for (const o of s.enemies) {
            if (o.id === e.id) continue;
            const d = Math.sqrt((o.x - e.x) ** 2 + (o.y - e.y) ** 2);
            if (d < 15 && d > 0) {
              e.vx -= (o.x - e.x) / d * 0.3;
              e.vy -= (o.y - e.y) / d * 0.3;
            }
          }
        }

        e.x += e.vx;
        e.y += e.vy;

        // Collision with player
        const pd = Math.sqrt((e.x - s.player.x) ** 2 + (e.y - s.player.y) ** 2);
        if (pd < e.size + 8 && s.invincible <= 0) {
          s.playerHP -= 10;
          s.invincible = 30;
          setPlayerHP(s.playerHP);
          // Knockback
          e.x += (e.x - s.player.x) * 2;
          e.y += (e.y - s.player.y) * 2;
          if (s.playerHP <= 0) {
            setGameState('dead');
            setBest(b => Math.max(b, s.kills));
            return;
          }
        }
      }
      if (s.invincible > 0) s.invincible--;

      // Update bullets
      for (const b of s.bullets) {
        b.x += b.vx;
        b.y += b.vy;
        b.life--;
      }
      s.bullets = s.bullets.filter(b => b.life > 0 && b.x > -10 && b.x < W + 10 && b.y > -10 && b.y < H + 10);

      // Bullet-enemy collision
      for (const b of s.bullets) {
        for (const e of s.enemies) {
          const d = Math.sqrt((b.x - e.x) ** 2 + (b.y - e.y) ** 2);
          if (d < e.size + 3) {
            e.hp--;
            b.life = 0;
            // Particles
            for (let i = 0; i < 4; i++) {
              s.particles.push({
                x: e.x, y: e.y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 20,
                color: e.type === 'tank' ? '#f59e0b' : e.type === 'fast' ? '#ef4444' : '#00ff88',
              });
            }
            break;
          }
        }
      }

      // Remove dead enemies
      const before = s.enemies.length;
      s.enemies = s.enemies.filter(e => e.hp > 0);
      const killed = before - s.enemies.length;
      if (killed > 0) {
        s.kills += killed;
        s.waveKills += killed;
        setScore(s.kills);
        if (s.waveKills >= s.waveTarget) {
          currentWave++;
          s.waveKills = 0;
          s.waveTarget = Math.floor(5 + currentWave * 3);
          setWave(currentWave);
        }
      }

      // Remove off-screen enemies
      s.enemies = s.enemies.filter(e => e.x > -50 && e.x < W + 50 && e.y > -50 && e.y < H + 50);

      // Update particles
      for (const p of s.particles) { p.x += p.vx; p.y += p.vy; p.life--; }
      s.particles = s.particles.filter(p => p.life > 0);

      // DRAW
      ctx.fillStyle = 'hsl(220, 20%, 4%)';
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = 'rgba(0, 200, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // Particles
      for (const p of s.particles) {
        ctx.globalAlpha = p.life / 20;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Enemies
      for (const e of s.enemies) {
        const colors = { basic: '#00c8ff', fast: '#ef4444', tank: '#f59e0b', swarm: '#a855f7' };
        ctx.fillStyle = colors[e.type];
        ctx.beginPath();
        if (e.type === 'tank') {
          ctx.rect(e.x - e.size, e.y - e.size, e.size * 2, e.size * 2);
        } else {
          ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        }
        ctx.fill();
        // Glow
        ctx.shadowColor = colors[e.type];
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Bullets
      ctx.fillStyle = '#00ff88';
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 6;
      for (const b of s.bullets) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Player
      const flash = s.invincible > 0 && Math.floor(s.invincible / 3) % 2 === 0;
      if (!flash) {
        ctx.fillStyle = '#00ff88';
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(s.player.x, s.player.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        // Inner
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(s.player.x, s.player.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Crosshair
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(s.mouse.x, s.mouse.y, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s.mouse.x - 15, s.mouse.y);
      ctx.lineTo(s.mouse.x + 15, s.mouse.y);
      ctx.moveTo(s.mouse.x, s.mouse.y - 15);
      ctx.lineTo(s.mouse.x, s.mouse.y + 15);
      ctx.stroke();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', handleMouse);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleTouch);
    };
  }, [gameState, spawnEnemy]);

  return (
    <div className="glass rounded-xl p-4 sm:p-6 max-w-md mx-auto w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Crosshair size={16} className="text-primary" /> Swarm Arena
        </h3>
        <button onClick={reset} className="p-2 text-muted-foreground hover:text-primary transition-colors">
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex justify-between mb-3 text-xs font-mono">
        <span className="text-primary">Wave {wave}</span>
        <span className="text-accent">Kills: {score}</span>
        <span className="text-muted-foreground">Best: {best}</span>
        <span className={`${playerHP > 50 ? 'text-accent' : playerHP > 25 ? 'text-yellow-500' : 'text-destructive'}`}>
          HP: {playerHP}
        </span>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-border cursor-crosshair">
        <canvas ref={canvasRef} width={W} height={H} className="w-full" style={{ imageRendering: 'pixelated' }} />
        {gameState === 'dead' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
            <p className="text-destructive font-display font-bold text-lg mb-1">Swarm Overrun!</p>
            <p className="text-xs font-mono text-muted-foreground mb-3">Wave {wave} · {score} kills</p>
            <button onClick={reset}
              className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm font-display hover:bg-primary/20 transition-all">
              Try Again
            </button>
          </motion.div>
        )}
      </div>

      <div className="flex justify-between mt-2 text-[10px] font-mono text-muted-foreground/50">
        <span>🟢 You</span>
        <span>🔵 Basic</span>
        <span>🔴 Fast</span>
        <span>🟡 Tank</span>
        <span>🟣 Swarm</span>
      </div>
      <p className="text-[10px] text-center text-muted-foreground/40 font-mono mt-1">Click to shoot · Mouse to move</p>
    </div>
  );
}
