/**
 * حارة العفاريت — Harat El Afareet
 * Asset Manager & 256x256 High-Definition Pixel-Art Character Illustrations
 */

export class AssetManager {
    constructor() {
        this.sprites = {};
        this.illustrations = {};
        this.icons = {};
        this.tiles = {};
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        this.generateEnvironmentTiles();
        this.generateTopDownCharacterSprites();
        this.generateHighResCharacterIllustrations();
        this.generateEnemySprites();
        this.generateBossSprites();
        this.generateProjectileSprites();
        this.generatePickupSprites();
        this.generateUIIcons();

        this.initialized = true;
    }

    createCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        return { canvas, ctx };
    }

    drawPixelMatrix(ctx, matrix, palette, scale = 1, offsetX = 0, offsetY = 0) {
        for (let y = 0; y < matrix.length; y++) {
            const row = matrix[y];
            for (let x = 0; x < row.length; x++) {
                const char = row[x];
                if (char !== '.' && char !== ' ' && palette[char]) {
                    ctx.fillStyle = palette[char];
                    ctx.fillRect(offsetX + x * scale, offsetY + y * scale, scale, scale);
                }
            }
        }
    }

    // ==========================================
    // 1. ENVIRONMENT & TILES
    // ==========================================
    generateEnvironmentTiles() {
        const { canvas: floorCanvas, ctx: fCtx } = this.createCanvas(64, 64);
        fCtx.fillStyle = '#14121a';
        fCtx.fillRect(0, 0, 64, 64);

        const stones = [
            { x: 2, y: 2, w: 28, h: 18, c: '#231f2b', hi: '#332d3d', sh: '#0f0d14' },
            { x: 34, y: 2, w: 28, h: 18, c: '#1f1b26', hi: '#2f293a', sh: '#0c0a12' },
            { x: 2, y: 24, w: 18, h: 16, c: '#1c1822', hi: '#2c2636', sh: '#0a0810' },
            { x: 24, y: 24, w: 38, h: 16, c: '#262130', hi: '#363042', sh: '#110f17' },
            { x: 2, y: 44, w: 32, h: 18, c: '#211c2a', hi: '#312b3c', sh: '#0d0b13' },
            { x: 38, y: 44, w: 24, h: 18, c: '#1a1622', hi: '#2a2434', sh: '#0a0810' }
        ];

        for (const s of stones) {
            fCtx.fillStyle = s.c;
            fCtx.fillRect(s.x, s.y, s.w, s.h);
            fCtx.fillStyle = s.hi;
            fCtx.fillRect(s.x, s.y, s.w, 2);
            fCtx.fillRect(s.x, s.y, 2, s.h);
            fCtx.fillStyle = s.sh;
            fCtx.fillRect(s.x, s.y + s.h - 2, s.w, 2);
            fCtx.fillRect(s.x + s.w - 2, s.y, 2, s.h);
        }

        fCtx.fillStyle = '#4a3b2c';
        fCtx.fillRect(10, 8, 2, 2);
        fCtx.fillRect(45, 12, 2, 2);
        fCtx.fillRect(28, 30, 2, 2);
        fCtx.fillRect(15, 50, 2, 2);
        fCtx.fillRect(52, 54, 2, 2);

        this.tiles['ground_cobble'] = floorCanvas;

        const { canvas: runeCanvas, ctx: rCtx } = this.createCanvas(64, 64);
        rCtx.drawImage(floorCanvas, 0, 0);
        rCtx.strokeStyle = 'rgba(217, 119, 6, 0.45)';
        rCtx.lineWidth = 2;
        rCtx.beginPath();
        rCtx.arc(32, 32, 24, 0, Math.PI * 2);
        rCtx.stroke();
        rCtx.beginPath();
        rCtx.moveTo(32, 8); rCtx.lineTo(32, 56);
        rCtx.moveTo(8, 32); rCtx.lineTo(56, 32);
        rCtx.stroke();
        rCtx.fillStyle = 'rgba(245, 158, 11, 0.7)';
        rCtx.fillRect(30, 30, 4, 4);
        this.tiles['ground_rune'] = runeCanvas;
    }

    // ==========================================
    // 2. TOP-DOWN GAMEPLAY CHARACTER SPRITES
    // ==========================================
    generateTopDownCharacterSprites() {
        this.sprites.characters = {};

        // A. APPRENTICE (الواد زكي)
        const apprenticePalette = {
            'K': '#0f172a',
            'T': '#06b6d4',
            'L': '#67e8f9',
            'B': '#0891b2',
            'G': '#f59e0b',
            'Y': '#fef08a',
            'S': '#fcd34d',
            'W': '#78350f',
            'O': '#22d3ee'
        };

        const apprenticeTopDownIdle = [
            "......KKKKKK......",
            "....KKTTLLTTKK....",
            "...KTTLLGGLLTTK...",
            "..KTLLGGYYGGLLTK..",
            "..KTTLGGYYGGLBTK..",
            ".KSTTLLGGLLTBBTSK.",
            "KSSTTTLLLLTTBBTSSK",
            "KSWKKTTTTTTTKKWSSK",
            ".KW..KTTTTTK..WK..",
            ".KO..KBBBBBK..OK..",
            ".....KBBBBBK......",
            "......KSSKSSK.....",
            "......KK..KK......"
        ];

        const apprenticeTopDownWalk1 = [
            "......KKKKKK......",
            "....KKTTLLTTKK....",
            "...KTTLLGGLLTTK...",
            "..KTLLGGYYGGLLTK..",
            "..KTTLGGYYGGLBTK..",
            ".KSTTLLGGLLTBBTSK.",
            "KSSTTTLLLLTTBBTSSK",
            "KSWKKTTTTTTTKKWSSK",
            ".KW..KTTTTTK..WK..",
            ".KO..KBBBBBK..OK..",
            ".....KSS..KK......",
            ".....KK...KSSK....",
            "..........KK......"
        ];

        const apprenticeTopDownWalk2 = [
            "......KKKKKK......",
            "....KKTTLLTTKK....",
            "...KTTLLGGLLTTK...",
            "..KTLLGGYYGGLLTK..",
            "..KTTLGGYYGGLBTK..",
            ".KSTTLLGGLLTBBTSK.",
            "KSSTTTLLLLTTBBTSSK",
            "KSWKKTTTTTTTKKWSSK",
            ".KW..KTTTTTK..WK..",
            ".KO..KBBBBBK..OK..",
            ".....KK...KSSK....",
            "....KSSK..KK......",
            "....KK............"
        ];

        const apprenticeTopDownAttack = [
            "......KKKKKK...KOO",
            "....KKTTLLTTKK.KOO",
            "...KTTLLGGLLTTKWWK",
            "..KTLLGGYYGGLLTWSS",
            "..KTTLGGYYGGLBTKSS",
            ".KSTTLLGGLLTBBTK..",
            "KSSTTTLLLLTTBBTK..",
            ".K.KKTTTTTTTKK....",
            ".....KTTTTTK......",
            ".....KBBBBBK......",
            "......KSSKSSK.....",
            "......KK..KK......"
        ];

        this.sprites.characters['apprentice'] = {
            idle: this.bakeSprite(apprenticeTopDownIdle, apprenticePalette, 2.3),
            walk1: this.bakeSprite(apprenticeTopDownWalk1, apprenticePalette, 2.3),
            walk2: this.bakeSprite(apprenticeTopDownWalk2, apprenticePalette, 2.3),
            attack: this.bakeSprite(apprenticeTopDownAttack, apprenticePalette, 2.3),
            hurt: this.bakeHurtSprite(apprenticeTopDownIdle, apprenticePalette, 2.3)
        };

        // B. FIRE MAGE (الأسطى ريان)
        const fireMagePalette = {
            'K': '#0f172a',
            'R': '#dc2626',
            'L': '#f87171',
            'B': '#991b1b',
            'O': '#f97316',
            'Y': '#fef08a',
            'S': '#fed7aa',
            'W': '#fbbf24'
        };

        const fireMageTopDownIdle = [
            "......KKOOOK......",
            "....KKOOYOOOKK....",
            "...KROOYYYOOORK...",
            "..KRLOOYYYOOLBRK..",
            "..KRLLOOOOLLBRRK..",
            ".KSRRLLRRLLRBBRSK.",
            "KSSRLLLLLLLLRBSSSK",
            "KSWKKRRRRRRRKKWSSK",
            ".KW..KRRRRRK..WK..",
            ".KY..KBBBBBK..YK..",
            ".....KBBBBBK......",
            "......KSSKSSK.....",
            "......KK..KK......"
        ];

        const fireMageTopDownWalk1 = [
            "......KKOOOK......",
            "....KKOOYOOOKK....",
            "...KROOYYYOOORK...",
            "..KRLOOYYYOOLBRK..",
            "..KRLLOOOOLLBRRK..",
            ".KSRRLLRRLLRBBRSK.",
            "KSSRLLLLLLLLRBSSSK",
            "KSWKKRRRRRRRKKWSSK",
            ".KW..KRRRRRK..WK..",
            ".KY..KBBBBBK..YK..",
            ".....KSS..KK......",
            ".....KK...KSSK....",
            "..........KK......"
        ];

        const fireMageTopDownWalk2 = [
            "......KKOOOK......",
            "....KKOOYOOOKK....",
            "...KROOYYYOOORK...",
            "..KRLOOYYYOOLBRK..",
            "..KRLLOOOOLLBRRK..",
            ".KSRRLLRRLLRBBRSK.",
            "KSSRLLLLLLLLRBSSSK",
            "KSWKKRRRRRRRKKWSSK",
            ".KW..KRRRRRK..WK..",
            ".KY..KBBBBBK..YK..",
            ".....KK...KSSK....",
            "....KSSK..KK......",
            "....KK............"
        ];

        const fireMageTopDownAttack = [
            "......KKOOOK...KYY",
            "....KKOOYOOOKKKYYK",
            "...KROOYYYOOORKWWK",
            "..KRLOOYYYOOLBRWSS",
            "..KRLLOOOOLLBRRKSS",
            ".KSRRLLRRLLRBBRK..",
            "KSSRLLLLLLLLRB.K..",
            ".K.KKRRRRRRRKK....",
            ".....KRRRRRK......",
            ".....KBBBBBK......",
            "......KSSKSSK.....",
            "......KK..KK......"
        ];

        this.sprites.characters['fireMage'] = {
            idle: this.bakeSprite(fireMageTopDownIdle, fireMagePalette, 2.3),
            walk1: this.bakeSprite(fireMageTopDownWalk1, fireMagePalette, 2.3),
            walk2: this.bakeSprite(fireMageTopDownWalk2, fireMagePalette, 2.3),
            attack: this.bakeSprite(fireMageTopDownAttack, fireMagePalette, 2.3),
            hurt: this.bakeHurtSprite(fireMageTopDownIdle, fireMagePalette, 2.3)
        };

        // C. AMULET KEEPER (الست ليلى)
        const amuletKeeperPalette = {
            'K': '#0f172a',
            'U': '#1e40af',
            'L': '#60a5fa',
            'B': '#172554',
            'G': '#f59e0b',
            'Y': '#fef08a',
            'S': '#fde047',
            'A': '#38bdf8'
        };

        const amuletKeeperTopDownIdle = [
            "......KKGGGGKK......",
            "....KKGGYYYYGGKK....",
            "...KUGGYYYYYYGUK....",
            "..KULGGYYYYYYGLBUK..",
            "..KULLGGGGGGLLBUUK..",
            ".KSUULLUUUUULLBBUUSK",
            "KSSUULLLLLLLLUBBUUSK",
            "KSAKKUUUUUUUUKKAUUSK",
            ".KA..KUUUUUK..AK....",
            ".KY..KBBBBBK..YK....",
            ".....KBBBBBK........",
            "......KSSKSSK.......",
            "......KK..KK........"
        ];

        const amuletKeeperTopDownWalk1 = [
            "......KKGGGGKK......",
            "....KKGGYYYYGGKK....",
            "...KUGGYYYYYYGUK....",
            "..KULGGYYYYYYGLBUK..",
            "..KULLGGGGGGLLBUUK..",
            ".KSUULLUUUUULLBBUUSK",
            "KSSUULLLLLLLLUBBUUSK",
            "KSAKKUUUUUUUUKKAUUSK",
            ".KA..KUUUUUK..AK....",
            ".KY..KBBBBBK..YK....",
            ".....KSS..KK........",
            ".....KK...KSSK......",
            "..........KK........"
        ];

        const amuletKeeperTopDownWalk2 = [
            "......KKGGGGKK......",
            "....KKGGYYYYGGKK....",
            "...KUGGYYYYYYGUK....",
            "..KULGGYYYYYYGLBUK..",
            "..KULLGGGGGGLLBUUK..",
            ".KSUULLUUUUULLBBUUSK",
            "KSSUULLLLLLLLUBBUUSK",
            "KSAKKUUUUUUUUKKAUUSK",
            ".KA..KUUUUUK..AK....",
            ".KY..KBBBBBK..YK....",
            ".....KK...KSSK......",
            "....KSSK..KK........",
            "....KK.............."
        ];

        const amuletKeeperTopDownAttack = [
            "......KKGGGGKK..KAAK",
            "....KKGGYYYYGGKKKYYK",
            "...KUGGYYYYYYGUKAUUK",
            "..KULGGYYYYYYGLBAUUS",
            "..KULLGGGGGGLLBUUKSS",
            ".KSUULLUUUUULLBBUK..",
            "KSSUULLLLLLLLUBB.K..",
            ".K.KKUUUUUUUUKK.....",
            ".....KUUUUUK........",
            ".....KBBBBBK........",
            "......KSSKSSK.......",
            "......KK..KK........"
        ];

        this.sprites.characters['amuletKeeper'] = {
            idle: this.bakeSprite(amuletKeeperTopDownIdle, amuletKeeperPalette, 2.3),
            walk1: this.bakeSprite(amuletKeeperTopDownWalk1, amuletKeeperPalette, 2.3),
            walk2: this.bakeSprite(amuletKeeperTopDownWalk2, amuletKeeperPalette, 2.3),
            attack: this.bakeSprite(amuletKeeperTopDownAttack, amuletKeeperPalette, 2.3),
            hurt: this.bakeHurtSprite(amuletKeeperTopDownIdle, amuletKeeperPalette, 2.3)
        };
    }

    // ==========================================
    // 3. 256x256 HIGH-RESOLUTION CHARACTER ART
    // (NO geometric background circle!)
    // ==========================================
    generateHighResCharacterIllustrations() {
        this.illustrations.characters = {};

        // 1. الواد زكي (المبتدئ) — 256x256 High Definition Pixel Illustration
        const { canvas: c1, ctx: ctx1 } = this.createCanvas(256, 256);
        // Soft atmospheric radial mist only (NO hard geometric circle)
        const g1 = ctx1.createRadialGradient(128, 128, 10, 128, 128, 110);
        g1.addColorStop(0, 'rgba(6, 182, 212, 0.28)');
        g1.addColorStop(0.6, 'rgba(245, 158, 11, 0.08)');
        g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx1.fillStyle = g1;
        ctx1.fillRect(0, 0, 256, 256);

        // Detailed 32x32 matrix drawn at 6x scale
        const zakiMatrix = [
            "..........KKKKKKKKKK..........",
            "........KKTTTTTTTTTTKK........",
            ".......KTTTTLLLLTTTTTK........",
            "......KTTLLYGGGGYLLTTTK.......",
            ".....KTTLLYGGYYYYGGYLLTK......",
            ".....KTTLYYYYYYYYYYLLTK.......",
            "....KTTSSSSSSSSSSSSSTTK.......",
            "...KTTSSWESSSSSSSSWESSTTK.....",
            "...KTTSSWESSSSSSSSWESSTTK.....",
            "...KTTSSSWWSSSSSSSSWWSSTK.....",
            "....KTSSSSDDSSSSDDSSSSTK......",
            "....KTSSSSSDDDDDDSSSSSTK......",
            ".....KTSSSSSSSSSSSSSSTK.......",
            ".....KTGGGGGGGGGGGGGGTTK......",
            "....KTTGGYYYYYYYYYYGGTTK......",
            "...KTTTTTTTTTTTTTTTTTTTTK.....",
            "..KTTLLTTTTTTTTTTTTTTLLTTK....",
            ".KTTLLTTTTTTGGGGTTTTTTLLTTK...",
            ".KTLLTTTTTTGGGGGGTTTTTTLLTK...",
            ".KTLLTTTTTGGYYYYGGTTTTTLLTK...",
            ".KWLLTTTTTGGYYYYGGTTTTTLLWKK..",
            "KWWLLTTTTTTGGGGGGTTTTTTLLWWKK.",
            "KWWLLTTTTTTTTTTTTTTTTTTLLWWKK.",
            "KYYLLKKTTTTTTTTTTTTTTKKLLYYKK.",
            ".KKKK..KKTTTTTTTTTTKK..KKKK...",
            ".........KKBBBBBBKK...........",
            ".........KKBBBBBBKK...........",
            ".........KKSSKKSSKK..........."
        ];

        const zakiPal = {
            'K': '#090d16',
            'S': '#fde047',
            'D': '#d97706',
            'T': '#0891b2',
            'L': '#22d3ee',
            'G': '#d97706',
            'Y': '#fef08a',
            'W': '#ffffff',
            'E': '#06b6d4',
            'B': '#155e75'
        };
        this.drawPixelMatrix(ctx1, zakiMatrix, zakiPal, 6.8, 24, 25);

        // Glowing arcane staff crystal orb
        const orbGrad1 = ctx1.createRadialGradient(38, 165, 2, 38, 165, 18);
        orbGrad1.addColorStop(0, '#ffffff');
        orbGrad1.addColorStop(0.4, '#22d3ee');
        orbGrad1.addColorStop(1, 'rgba(6, 182, 212, 0)');
        ctx1.fillStyle = orbGrad1;
        ctx1.beginPath();
        ctx1.arc(38, 165, 18, 0, Math.PI * 2);
        ctx1.fill();

        this.illustrations.characters['apprentice'] = c1;

        // 2. الأسطى ريان (ساحر النار) — 256x256 High Definition Pixel Illustration
        const { canvas: c2, ctx: ctx2 } = this.createCanvas(256, 256);
        const g2 = ctx2.createRadialGradient(128, 128, 10, 128, 128, 110);
        g2.addColorStop(0, 'rgba(239, 68, 68, 0.32)');
        g2.addColorStop(0.6, 'rgba(249, 115, 22, 0.08)');
        g2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx2.fillStyle = g2;
        ctx2.fillRect(0, 0, 256, 256);

        const rayanMatrix = [
            "..........KKHHHHHHHH..........",
            "........KKHHHHHHHHHHHH........",
            ".......KHHHHHLLLLHHHHHK.......",
            "......KHHLLOOOOOOLLHHHK.......",
            ".....KHHLLOOOOOOOOLLHHHK......",
            ".....KHHLOOYYYYYYOOLHHHK......",
            "....KHHSSSSSSSSSSSSSHHK.......",
            "...KHHSSWESSSSSSSSWESSHHK.....",
            "...KHHSSWESSSSSSSSWESSHHK.....",
            "...KHHSSSWWSSSSSSSSWWSSHK.....",
            "....KHSSSSDDSSSSDDSSSSHHK.....",
            "....KHSSSSSDDDDDDSSSSSHK......",
            ".....KHSSSSSSSSSSSSSSSHK......",
            ".....KHOOOOOOOOOOOOOOOHK......",
            "....KRRROOYYYYYYYYYYOORRRK....",
            "...KRRRRRRRRRRRRRRRRRRRRRK....",
            "..KRRLLRRRRRRRRRRRRRRLLRRK....",
            ".KRRLLRRRRRROOOORRRRRRLLRRK...",
            ".KRLLRRRRRROOOOOORRRRRRLLRK...",
            ".KRLLRRRRROOYYYYOORRRRRLLRK...",
            ".KWLLRRRRROOYYYYOORRRRRLLWKK..",
            "KWWLLRRRRRROOOOOORRRRRRLLWWKK.",
            "KWWLLRRRRRRRRRRRRRRRRRRLLWWKK.",
            "KYYLLKKRRRRRRRRRRRRRRKKLLYYKK.",
            ".KKKK..KKRRRRRRRRRRKK..KKKK...",
            ".........KKBBBBBBKK...........",
            ".........KKBBBBBBKK...........",
            ".........KKSSKKSSKK..........."
        ];

        const rayanPal = {
            'K': '#090d16',
            'S': '#fed7aa',
            'D': '#ea580c',
            'R': '#b91c1c',
            'L': '#f87171',
            'O': '#ea580c',
            'Y': '#fef08a',
            'W': '#ffffff',
            'E': '#ef4444',
            'H': '#dc2626',
            'B': '#7f1d1d'
        };
        this.drawPixelMatrix(ctx2, rayanMatrix, rayanPal, 6.8, 24, 25);

        // Blazing hand flames
        const flameGrad1 = ctx2.createRadialGradient(38, 175, 2, 38, 175, 18);
        flameGrad1.addColorStop(0, '#fef08a');
        flameGrad1.addColorStop(0.5, '#f97316');
        flameGrad1.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx2.fillStyle = flameGrad1;
        ctx2.beginPath();
        ctx2.arc(38, 175, 18, 0, Math.PI * 2);
        ctx2.arc(218, 175, 18, 0, Math.PI * 2);
        ctx2.fill();

        this.illustrations.characters['fireMage'] = c2;

        // 3. الست ليلى (حارسة التميمة) — 256x256 High Definition Pixel Illustration
        const { canvas: c3, ctx: ctx3 } = this.createCanvas(256, 256);
        const g3 = ctx3.createRadialGradient(128, 128, 10, 128, 128, 110);
        g3.addColorStop(0, 'rgba(37, 99, 235, 0.32)');
        g3.addColorStop(0.6, 'rgba(245, 158, 11, 0.08)');
        g3.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx3.fillStyle = g3;
        ctx3.fillRect(0, 0, 256, 256);

        const laylaMatrix = [
            "..........KKGGGGGGGG..........",
            "........KKGGGGGGGGGGKK........",
            ".......KGGGGYYYYYYYYGGK.......",
            "......KGGLLYYYYYYYYLLGGK......",
            ".....KGGLLYYYYYYYYYYLLGGK.....",
            ".....KGGHSSSSSSSSSSSHGGK......",
            "....KGGHSSWESSSSSSWESHGGK.....",
            "...KGGHSSWESSSSSSWESHGGK......",
            "...KGGHSSSWWSSSSSWWSHGGK......",
            "....KGHSSSSDDSSDDSSSSHGK......",
            "....KGHSSSSSDDDDSSSSSHGK......",
            ".....KHSSSSSSSSSSSSSSHK.......",
            ".....KAAAAAGGGGGAAAAAAK.......",
            "....KUAAAYYYYYYYYAAAUUUK......",
            "...KUUUUUUUUUUUUUUUUUUUUK.....",
            "..KUULLUUUUUUUUUUUUUULLUUK....",
            ".KUULLUUUUUUGGGGUUUUUULLUUK...",
            ".KULLUUUUUUGGGGGGUUUUUULLUK...",
            ".KALLUUUUUGGYYYYGGUUUUULLAK...",
            ".KALLUUUUUGGYYYYGGUUUUULLAK...",
            "KAALLUUUUUUGGGGGGUUUUUULLAAK..",
            "KAALLUUUUUUUUUUUUUUUUUULLAAK..",
            "KYYLLKKUUUUUUUUUUUUUUKKLLYYKK.",
            ".KKKK..KKUUUUUUUUUUKK..KKKK...",
            ".........KKBBBBBBKK...........",
            ".........KKBBBBBBKK...........",
            ".........KKSSKKSSKK..........."
        ];

        const laylaPal = {
            'K': '#090d16',
            'S': '#fde047',
            'D': '#ca8a04',
            'U': '#1d4ed8',
            'L': '#60a5fa',
            'G': '#d97706',
            'Y': '#fde047',
            'W': '#ffffff',
            'E': '#38bdf8',
            'H': '#09090b',
            'A': '#38bdf8',
            'B': '#172554'
        };
        this.drawPixelMatrix(ctx3, laylaMatrix, laylaPal, 6.8, 24, 25);

        // Orbiting glowing Eye of Horus Talisman
        ctx3.fillStyle = '#f59e0b';
        ctx3.fillRect(32, 140, 20, 26);
        ctx3.fillStyle = '#38bdf8';
        ctx3.fillRect(36, 146, 12, 14);

        ctx3.fillStyle = '#f59e0b';
        ctx3.fillRect(204, 140, 20, 26);
        ctx3.fillStyle = '#38bdf8';
        ctx3.fillRect(208, 146, 12, 14);

        this.illustrations.characters['amuletKeeper'] = c3;
    }

    // ==========================================
    // 4. ENEMIES
    // ==========================================
    generateEnemySprites() {
        this.sprites.enemies = {};

        const smallAfreetPalette = {
            'K': '#090d16',
            'P': '#7e22ce',
            'L': '#c084fc',
            'R': '#ef4444',
            'D': '#3b0764'
        };
        const smallAfreetIdle = [
            "......KKKK......",
            "....KKLLLLKK....",
            "...KLLPPPLLLK...",
            "..KLPPPPPPLPK...",
            "..KLPRPPPRPLK...",
            "..KLPRPPPRPLK...",
            "..KLPPDDDPPLK...",
            "...KLPDDDPLK....",
            "....KLLLLLK.....",
            ".....KLPLK......",
            "......KPK......."
        ];
        this.sprites.enemies['smallAfreet'] = {
            idle: this.bakeSprite(smallAfreetIdle, smallAfreetPalette, 2),
            walk1: this.bakeSprite(smallAfreetIdle, smallAfreetPalette, 2),
            walk2: this.bakeSprite(smallAfreetIdle, smallAfreetPalette, 2),
            hurt: this.bakeHurtSprite(smallAfreetIdle, smallAfreetPalette, 2)
        };

        const fastAfreetPalette = {
            'K': '#090d16',
            'G': '#059669',
            'L': '#34d399',
            'Y': '#fde047',
            'D': '#064e3b',
            'H': '#10b981'
        };
        const fastAfreetIdle = [
            "..KK......KK....",
            ".KHHk....kHHK...",
            "..KLLKKKKLLK....",
            "...KLLGGLLK.....",
            "..KLGGGGGGLK....",
            "..KLGYGGYGLK....",
            "..KLGGDDDGLK....",
            "...KLGGGGLLK....",
            "....KLLLLK......",
            "...KLLKKLLK.....",
            "..KLK....KLK...."
        ];
        this.sprites.enemies['fastAfreet'] = {
            idle: this.bakeSprite(fastAfreetIdle, fastAfreetPalette, 2),
            walk1: this.bakeSprite(fastAfreetIdle, fastAfreetPalette, 2),
            walk2: this.bakeSprite(fastAfreetIdle, fastAfreetPalette, 2),
            hurt: this.bakeHurtSprite(fastAfreetIdle, fastAfreetPalette, 2)
        };

        const rangedAfreetPalette = {
            'K': '#090d16',
            'S': '#d97706',
            'L': '#fbbf24',
            'B': '#78350f',
            'Y': '#fef08a',
            'C': '#b45309'
        };
        const rangedAfreetIdle = [
            ".....KKKKKK.....",
            "...KKLLLLLLKK...",
            "..KLLSSSSSSLLK..",
            ".KLLSSYYYYSSLLK.",
            ".KLSSSDDDDSSSLK.",
            "..KSSSSSSSSSSK..",
            "..KSSCCCCSSSK...",
            "..KSCCCCCCCSSK..",
            "..KSCCCCCCCSSK..",
            "...KBBBBBBBBK...",
            "....KK....KK...."
        ];
        this.sprites.enemies['rangedAfreet'] = {
            idle: this.bakeSprite(rangedAfreetIdle, rangedAfreetPalette, 2),
            walk1: this.bakeSprite(rangedAfreetIdle, rangedAfreetPalette, 2),
            walk2: this.bakeSprite(rangedAfreetIdle, rangedAfreetPalette, 2),
            hurt: this.bakeHurtSprite(rangedAfreetIdle, rangedAfreetPalette, 2)
        };

        const giantAfreetPalette = {
            'K': '#090d16',
            'O': '#334155',
            'L': '#64748b',
            'M': '#f97316',
            'Y': '#fef08a',
            'H': '#1e293b'
        };
        const giantAfreetIdle = [
            "..KK........KK..",
            ".KHHk......kHHK.",
            "KHHHHLLLLLLHHHHK",
            ".KLLOOOOOOOOLLK.",
            ".KLOOMMYYMMOOLK.",
            "KLOOOMYYYYMOOOLK",
            "KLOOOOMMMMOOOOLK",
            "KLLOOOOOOOOOOLLK",
            ".KLLLLMMMMLLLLK.",
            "..KLOOOOOOOOLK..",
            "..KLOOOMMOOOLK..",
            "...KLLOOOOLLK...",
            "...KOOK..KOOK...",
            "..KLLK....KLLK.."
        ];
        this.sprites.enemies['giantAfreet'] = {
            idle: this.bakeSprite(giantAfreetIdle, giantAfreetPalette, 3),
            walk1: this.bakeSprite(giantAfreetIdle, giantAfreetPalette, 3),
            walk2: this.bakeSprite(giantAfreetIdle, giantAfreetPalette, 3),
            hurt: this.bakeHurtSprite(giantAfreetIdle, giantAfreetPalette, 3)
        };

        const explodingPalette = {
            'K': '#090d16',
            'R': '#ef4444',
            'Y': '#fde047',
            'O': '#ea580c',
            'W': '#ffffff'
        };
        const explodingIdle = [
            "......KKKK......",
            "....KKYYYYKK....",
            "...KYYROORYYK...",
            "..KYYRROORRYYK..",
            "..KYRWWWWRRRYK..",
            "..KYRWYYWRRRYK..",
            "..KYRWWWWRRRYK..",
            "...KYRRRRRRYK...",
            "....KKROORKK....",
            ".....KROOK......",
            "......KKK......."
        ];
        this.sprites.enemies['explodingGhoul'] = {
            idle: this.bakeSprite(explodingIdle, explodingPalette, 2),
            walk1: this.bakeSprite(explodingIdle, explodingPalette, 2),
            walk2: this.bakeSprite(explodingIdle, explodingPalette, 2),
            hurt: this.bakeHurtSprite(explodingIdle, explodingPalette, 2)
        };

        const shamanPalette = {
            'K': '#090d16',
            'P': '#6b21a8',
            'L': '#c084fc',
            'Y': '#fde047',
            'G': '#f59e0b',
            'W': '#ffffff'
        };
        const shamanIdle = [
            "..KK......KK....",
            ".KLLK....KLLK...",
            "..KLLKKKKLLK....",
            "...KPLLLLPK.....",
            "..KPLLYYLLPK....",
            "..KPLYWWYLPK....",
            "..KPLLYYLLPK....",
            "...KPLLLLPK.....",
            "...KPGGGGPK.....",
            "..KPPLLLLPPK....",
            ".KPLLK..KLLPK..."
        ];
        this.sprites.enemies['djinnShaman'] = {
            idle: this.bakeSprite(shamanIdle, shamanPalette, 2.2),
            walk1: this.bakeSprite(shamanIdle, shamanPalette, 2.2),
            walk2: this.bakeSprite(shamanIdle, shamanPalette, 2.2),
            hurt: this.bakeHurtSprite(shamanIdle, shamanPalette, 2.2)
        };

        const batPalette = {
            'K': '#090d16',
            'D': '#1e1b4b',
            'L': '#4338ca',
            'C': '#38bdf8'
        };
        const batIdle = [
            "KK............KK",
            "KLLKK......KKLLK",
            ".KLLDDKKKKDDLLK.",
            "..KLLDCCDDLLK...",
            "...KLLDCDLLK....",
            "....KLLLLK......",
            ".....KLLK.......",
            "......KK........"
        ];
        this.sprites.enemies['cryptBat'] = {
            idle: this.bakeSprite(batIdle, batPalette, 2),
            walk1: this.bakeSprite(batIdle, batPalette, 2),
            walk2: this.bakeSprite(batIdle, batPalette, 2),
            hurt: this.bakeHurtSprite(batIdle, batPalette, 2)
        };
    }

    // ==========================================
    // 5. BOSS (Afreet King)
    // ==========================================
    generateBossSprites() {
        this.sprites.bosses = {};

        const kingPalette = {
            'K': '#090d16',
            'R': '#991b1b',
            'L': '#f87171',
            'G': '#d97706',
            'Y': '#fde047',
            'B': '#3b0764',
            'H': '#18181b',
            'F': '#ef4444'
        };

        const afreetKingMatrix = [
            "...KK....KK....KK...",
            "..KFFK..KGGK..KFFK..",
            ".KFFFKKKGGGGKKKFFFK.",
            ".KFFFFKGGYYGGKFFFFK.",
            "..KHHBBYYYYYYBBHHK..",
            "..KHBBYYYYYYYYBHHK..",
            ".KHBBYWEYYYYWEYBHHK.",
            ".KHBBBYYYYYYYYBBBHK.",
            "..KBBBDDDDDDDDBBK...",
            "...KGGGGGGGGGGGK....",
            "..KRRRRRRRRRRRRRK...",
            ".KRLLRRRRRRRRRRLLRK.",
            ".KRLLRRGYYYYGRRLLRK.",
            "KFRLLRRGYYYYGRRLLRFK",
            "KFFLLRRRRRRRRRRLLFFK",
            "KFFLLKKRRRRRRKKLLFFK",
            ".KKK...KBBBBK...KKK.",
            ".......KBBBBK.......",
            "......KSSKKSSK......",
            "......KK....KK......"
        ];

        this.sprites.bosses['afreetKing'] = {
            idle: this.bakeSprite(afreetKingMatrix, kingPalette, 3.5),
            walk1: this.bakeSprite(afreetKingMatrix, kingPalette, 3.5),
            walk2: this.bakeSprite(afreetKingMatrix, kingPalette, 3.5),
            hurt: this.bakeHurtSprite(afreetKingMatrix, kingPalette, 3.5)
        };
    }

    // ==========================================
    // 6. PROJECTILES & PICKUPS
    // ==========================================
    generateProjectileSprites() {
        this.sprites.projectiles = {};

        const { canvas: staffCanvas, ctx: sCtx } = this.createCanvas(24, 24);
        const sGrad = sCtx.createRadialGradient(12, 12, 2, 12, 12, 10);
        sGrad.addColorStop(0, '#ffffff');
        sGrad.addColorStop(0.4, '#22d3ee');
        sGrad.addColorStop(0.8, '#0891b2');
        sGrad.addColorStop(1, 'rgba(8, 145, 178, 0)');
        sCtx.fillStyle = sGrad;
        sCtx.beginPath();
        sCtx.arc(12, 12, 11, 0, Math.PI * 2);
        sCtx.fill();
        this.sprites.projectiles['magicStaffBolt'] = staffCanvas;

        const { canvas: fireCanvas, ctx: fCtx } = this.createCanvas(28, 28);
        const fGrad = fCtx.createRadialGradient(14, 14, 2, 14, 14, 12);
        fGrad.addColorStop(0, '#ffffff');
        fGrad.addColorStop(0.3, '#fde047');
        fGrad.addColorStop(0.6, '#f97316');
        fGrad.addColorStop(0.9, '#dc2626');
        fGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');
        fCtx.fillStyle = fGrad;
        fCtx.beginPath();
        fCtx.arc(14, 14, 13, 0, Math.PI * 2);
        fCtx.fill();
        this.sprites.projectiles['fireWandBolt'] = fireCanvas;

        const { canvas: lightCanvas, ctx: lCtx } = this.createCanvas(32, 32);
        lCtx.strokeStyle = '#67e8f9';
        lCtx.lineWidth = 3;
        lCtx.beginPath();
        lCtx.moveTo(16, 0);
        lCtx.lineTo(10, 14);
        lCtx.lineTo(20, 16);
        lCtx.lineTo(16, 32);
        lCtx.stroke();
        lCtx.strokeStyle = '#ffffff';
        lCtx.lineWidth = 1.5;
        lCtx.stroke();
        this.sprites.projectiles['lightningStrike'] = lightCanvas;

        const { canvas: talismanCanvas, ctx: tCtx } = this.createCanvas(24, 24);
        tCtx.fillStyle = '#f59e0b';
        tCtx.fillRect(4, 2, 16, 20);
        tCtx.fillStyle = '#fde047';
        tCtx.fillRect(6, 4, 12, 16);
        tCtx.fillStyle = '#0284c7';
        tCtx.fillRect(8, 9, 8, 6);
        tCtx.fillStyle = '#ffffff';
        tCtx.fillRect(11, 11, 2, 2);
        this.sprites.projectiles['magicalTalismanShield'] = talismanCanvas;

        const { canvas: darkBoltCanvas, ctx: dCtx } = this.createCanvas(20, 20);
        const dGrad = dCtx.createRadialGradient(10, 10, 2, 10, 10, 8);
        dGrad.addColorStop(0, '#fde047');
        dGrad.addColorStop(0.5, '#d97706');
        dGrad.addColorStop(1, 'rgba(120, 53, 15, 0)');
        dCtx.fillStyle = dGrad;
        dCtx.beginPath();
        dCtx.arc(10, 10, 9, 0, Math.PI * 2);
        dCtx.fill();
        this.sprites.projectiles['sandBolt'] = darkBoltCanvas;
    }

    generatePickupSprites() {
        this.sprites.pickups = {};

        const { canvas: xpSCanvas, ctx: xsCtx } = this.createCanvas(16, 16);
        xsCtx.fillStyle = '#06b6d4';
        xsCtx.beginPath();
        xsCtx.moveTo(8, 2); xsCtx.lineTo(14, 8); xsCtx.lineTo(8, 14); xsCtx.lineTo(2, 8);
        xsCtx.closePath();
        xsCtx.fill();
        xsCtx.fillStyle = '#a5f3fc';
        xsCtx.fillRect(6, 6, 4, 4);
        this.sprites.pickups['XP_SMALL'] = xpSCanvas;

        const { canvas: xpMCanvas, ctx: xmCtx } = this.createCanvas(18, 18);
        xmCtx.fillStyle = '#10b981';
        xmCtx.beginPath();
        xmCtx.moveTo(9, 2); xmCtx.lineTo(16, 9); xmCtx.lineTo(9, 16); xmCtx.lineTo(2, 9);
        xmCtx.closePath();
        xmCtx.fill();
        xmCtx.fillStyle = '#6ee7b7';
        xmCtx.fillRect(7, 7, 4, 4);
        this.sprites.pickups['XP_MEDIUM'] = xpMCanvas;

        const { canvas: xpLCanvas, ctx: xlCtx } = this.createCanvas(20, 20);
        xlCtx.fillStyle = '#8b5cf6';
        xlCtx.beginPath();
        xlCtx.moveTo(10, 2); xlCtx.lineTo(18, 10); xlCtx.lineTo(10, 18); xlCtx.lineTo(2, 10);
        xlCtx.closePath();
        xlCtx.fill();
        xlCtx.fillStyle = '#c4b5fd';
        xlCtx.fillRect(8, 8, 4, 4);
        this.sprites.pickups['XP_LARGE'] = xpLCanvas;

        const { canvas: coinCanvas, ctx: cCtx } = this.createCanvas(18, 18);
        cCtx.fillStyle = '#d97706';
        cCtx.beginPath();
        cCtx.arc(9, 9, 8, 0, Math.PI * 2);
        cCtx.fill();
        cCtx.fillStyle = '#f59e0b';
        cCtx.beginPath();
        cCtx.arc(9, 9, 6.5, 0, Math.PI * 2);
        cCtx.fill();
        cCtx.fillStyle = '#fef08a';
        cCtx.fillRect(7, 7, 4, 4);
        this.sprites.pickups['COIN'] = coinCanvas;

        const { canvas: hpCanvas, ctx: hCtx } = this.createCanvas(20, 20);
        hCtx.fillStyle = '#94a3b8';
        hCtx.fillRect(8, 2, 4, 3);
        hCtx.fillStyle = '#22c55e';
        hCtx.beginPath();
        hCtx.arc(10, 12, 7, 0, Math.PI * 2);
        hCtx.fill();
        hCtx.fillStyle = '#86efac';
        hCtx.fillRect(8, 9, 3, 3);
        this.sprites.pickups['HEALTH'] = hpCanvas;

        const { canvas: magCanvas, ctx: mCtx } = this.createCanvas(20, 20);
        mCtx.fillStyle = '#f59e0b';
        mCtx.beginPath();
        mCtx.arc(10, 10, 8, 0, Math.PI * 2);
        mCtx.fill();
        mCtx.fillStyle = '#06b6d4';
        mCtx.fillRect(8, 6, 4, 8);
        this.sprites.pickups['MAGNET'] = magCanvas;
    }

    generateUIIcons() {
        this.icons = {
            magicStaff: '🪄',
            fireWand: '🔥',
            lightningRod: '⚡',
            magicalTalisman: '🧿',
            dash: '💨',
            shield: '🛡️',
            vitality: '❤️',
            sword: '⚔️',
            gold: '🪙',
            xp: '💎',
            speed: '👟'
        };
    }

    bakeSprite(matrix, palette, scale = 2) {
        const width = matrix[0].length * scale;
        const height = matrix.length * scale;
        const { canvas, ctx } = this.createCanvas(width, height);
        this.drawPixelMatrix(ctx, matrix, palette, scale);
        return canvas;
    }

    // Red Hurt Flash Sprite for instant clear hit feedback!
    bakeHurtSprite(matrix, palette, scale = 2) {
        const hurtPalette = {};
        for (const k in palette) {
            hurtPalette[k] = '#ef4444'; // Vivid Red Flash
        }
        return this.bakeSprite(matrix, hurtPalette, scale);
    }

    get(category, id, anim = 'idle') {
        if (this.sprites[category] && this.sprites[category][id]) {
            return this.sprites[category][id][anim] || this.sprites[category][id].idle || this.sprites[category][id];
        }
        return null;
    }

    getIllustration(characterId) {
        return this.illustrations.characters[characterId] || null;
    }
}

export const assetManager = new AssetManager();
