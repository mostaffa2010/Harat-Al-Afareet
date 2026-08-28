/**
 * حارة العفاريت — Harat El Afareet
 * Asset Manager & High-Resolution Character Artwork Engine (256x256)
 * (Updated: Mini-Bosses, 8 Weapons, Evolved Visuals & Authentic Slang)
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

    bakeSprite(matrix, palette, scale = 2) {
        const h = matrix.length;
        const w = matrix[0].length;
        const { canvas, ctx } = this.createCanvas(w * scale, h * scale);
        this.drawPixelMatrix(ctx, matrix, palette, scale);
        return canvas;
    }

    bakeRedHurtSprite(matrix, scale = 2) {
        const h = matrix.length;
        const w = matrix[0].length;
        const { canvas, ctx } = this.createCanvas(w * scale, h * scale);
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const char = matrix[y][x];
                if (char !== '.' && char !== ' ') {
                    ctx.fillStyle = '#ef4444';
                    ctx.fillRect(x * scale, y * scale, scale, scale);
                }
            }
        }
        return canvas;
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

        this.tiles['ground_cobble'] = floorCanvas;

        const { canvas: runeCanvas, ctx: rCtx } = this.createCanvas(64, 64);
        rCtx.drawImage(floorCanvas, 0, 0);
        rCtx.strokeStyle = '#d97706';
        rCtx.lineWidth = 2;
        rCtx.beginPath();
        rCtx.arc(32, 32, 22, 0, Math.PI * 2);
        rCtx.stroke();
        rCtx.fillStyle = '#f59e0b';
        rCtx.font = '16px serif';
        rCtx.textAlign = 'center';
        rCtx.textBaseline = 'middle';
        rCtx.fillText('𓂀', 32, 32);
        this.tiles['ground_rune'] = runeCanvas;
    }

    // ==========================================
    // 2. TOP-DOWN CHARACTER SPRITES & 256x256 ART
    // ==========================================
    generateTopDownCharacterSprites() {
        this.sprites.characters = {};
        this.illustrations.characters = {};

        // A. APPRENTICE (الواد زكي)
        const apprenticePalette = {
            'K': '#0f172a',
            'T': '#0891b2',
            'L': '#22d3ee',
            'S': '#fed7aa',
            'G': '#d97706',
            'W': '#f8fafc',
            'B': '#1e293b'
        };

        const apprenticeTopDownIdle = [
            "......KKTTTK......",
            "....KKTTLLTTKK....",
            "...KTLLWWWWLLTK...",
            "..KTLLWWWWWWLLTK..",
            "..KTLLWWWWWWLLTK..",
            ".KSKKLLLLLLLLKKSK.",
            "KSSKTTTTTTTTTTKSSK",
            "KSGKKLLLLLLLLKKGSK",
            ".KG..KTTTTTTK..GK.",
            ".KW..KBBBBBBK..WK.",
            ".....KBBBBBBK.....",
            "......KSSKSSK.....",
            "......KK..KK......"
        ];

        const apprenticeTopDownWalk1 = [
            "......KKTTTK......",
            "....KKTTLLTTKK....",
            "...KTLLWWWWLLTK...",
            "..KTLLWWWWWWLLTK..",
            "..KTLLWWWWWWLLTK..",
            ".KSKKLLLLLLLLKKSK.",
            "KSSKTTTTTTTTTTKSSK",
            "KSGKKLLLLLLLLKKGSK",
            ".KG..KTTTTTTK..GK.",
            ".KW..KBBBBBBK..WK.",
            ".....KSS..KK......",
            ".....KK...KSSK....",
            "..........KK......"
        ];

        const apprenticeTopDownWalk2 = [
            "......KKTTTK......",
            "....KKTTLLTTKK....",
            "...KTLLWWWWLLTK...",
            "..KTLLWWWWWWLLTK..",
            "..KTLLWWWWWWLLTK..",
            ".KSKKLLLLLLLLKKSK.",
            "KSSKTTTTTTTTTTKSSK",
            "KSGKKLLLLLLLLKKGSK",
            ".KG..KTTTTTTK..GK.",
            ".KW..KBBBBBBK..WK.",
            ".....KK...KSSK....",
            "....KSSK..KK......",
            "....KK............"
        ];

        const apprenticeTopDownAttack = [
            "......KKTTTK...KWW",
            "....KKTTLLTTKKKWWK",
            "...KTLLWWWWLLTKGGK",
            "..KTLLWWWWWWLLTGSS",
            "..KTLLWWWWWWLLTGSS",
            ".KSKKLLLLLLLLKKSK.",
            "KSSKTTTTTTTTTTK...",
            "KSGKKLLLLLLLLKK...",
            ".KG..KTTTTTTK.....",
            ".KW..KBBBBBBK.....",
            ".....KBBBBBBK.....",
            "......KSSKSSK.....",
            "......KK..KK......"
        ];

        this.sprites.characters['apprentice'] = {
            idle: this.bakeSprite(apprenticeTopDownIdle, apprenticePalette, 2.3),
            walk1: this.bakeSprite(apprenticeTopDownWalk1, apprenticePalette, 2.3),
            walk2: this.bakeSprite(apprenticeTopDownWalk2, apprenticePalette, 2.3),
            attack: this.bakeSprite(apprenticeTopDownAttack, apprenticePalette, 2.3),
            hurt: this.bakeRedHurtSprite(apprenticeTopDownIdle, 2.3)
        };
        this.illustrations.characters['apprentice'] = this.generateApprenticeIllustration256();

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
            "..KRLLOOOOLLBRRWSS",
            ".KSRRLLRRLLRBBRSK.",
            "KSSRLLLLLLLLRB....",
            "KSWKKRRRRRRRKK....",
            ".KW..KRRRRRK......",
            ".KY..KBBBBBK......",
            ".....KBBBBBK......",
            "......KSSKSSK.....",
            "......KK..KK......"
        ];

        this.sprites.characters['fireMage'] = {
            idle: this.bakeSprite(fireMageTopDownIdle, fireMagePalette, 2.3),
            walk1: this.bakeSprite(fireMageTopDownWalk1, fireMagePalette, 2.3),
            walk2: this.bakeSprite(fireMageTopDownWalk2, fireMagePalette, 2.3),
            attack: this.bakeSprite(fireMageTopDownAttack, fireMagePalette, 2.3),
            hurt: this.bakeRedHurtSprite(fireMageTopDownIdle, 2.3)
        };
        this.illustrations.characters['fireMage'] = this.generateFireMageIllustration256();

        // C. AMULET KEEPER (الست ليلى)
        const amuletKeeperPalette = {
            'K': '#0f172a',
            'B': '#1d4ed8',
            'L': '#60a5fa',
            'G': '#f59e0b',
            'Y': '#fef08a',
            'S': '#fde68a',
            'W': '#ffffff',
            'D': '#1e3a8a'
        };

        const amuletKeeperTopDownIdle = [
            "......KKGGGK......",
            "....KKGGYYGGKK....",
            "...KBGGYYYYGGBK...",
            "..KBLGGYYYYGGLBK..",
            "..KBLLGGGGLLBBK...",
            ".KSBBLLBBLLBBBSK..",
            "KSSBLLLLLLLLBBSSSK",
            "KSGKKBBBBBBBBKKGSK",
            ".KG..KDDDDDDK..GK.",
            ".KY..KDDDDDDK..YK.",
            ".....KDDDDDDK.....",
            "......KSSKSSK.....",
            "......KK..KK......"
        ];

        const amuletKeeperTopDownWalk1 = [
            "......KKGGGK......",
            "....KKGGYYGGKK....",
            "...KBGGYYYYGGBK...",
            "..KBLGGYYYYGGLBK..",
            "..KBLLGGGGLLBBK...",
            ".KSBBLLBBLLBBBSK..",
            "KSSBLLLLLLLLBBSSSK",
            "KSGKKBBBBBBBBKKGSK",
            ".KG..KDDDDDDK..GK.",
            ".KY..KDDDDDDK..YK.",
            ".....KSS..KK......",
            ".....KK...KSSK....",
            "..........KK......"
        ];

        const amuletKeeperTopDownWalk2 = [
            "......KKGGGK......",
            "....KKGGYYGGKK....",
            "...KBGGYYYYGGBK...",
            "..KBLGGYYYYGGLBK..",
            "..KBLLGGGGLLBBK...",
            ".KSBBLLBBLLBBBSK..",
            "KSSBLLLLLLLLBBSSSK",
            "KSGKKBBBBBBBBKKGSK",
            ".KG..KDDDDDDK..GK.",
            ".KY..KDDDDDDK..YK.",
            ".....KK...KSSK....",
            "....KSSK..KK......",
            "....KK............"
        ];

        const amuletKeeperTopDownAttack = [
            "......KKGGGK...KYY",
            "....KKGGYYGGKKKYYK",
            "...KBGGYYYYGGBKGGK",
            "..KBLGGYYYYGGLBGSS",
            "..KBLLGGGGLLBBBGSS",
            ".KSBBLLBBLLBBBSK..",
            "KSSBLLLLLLLLBB....",
            "KSGKKBBBBBBBBK....",
            ".KG..KDDDDDDK.....",
            ".KY..KDDDDDDK.....",
            ".....KDDDDDDK.....",
            "......KSSKSSK.....",
            "......KK..KK......"
        ];

        this.sprites.characters['amuletKeeper'] = {
            idle: this.bakeSprite(amuletKeeperTopDownIdle, amuletKeeperPalette, 2.3),
            walk1: this.bakeSprite(amuletKeeperTopDownWalk1, amuletKeeperPalette, 2.3),
            walk2: this.bakeSprite(amuletKeeperTopDownWalk2, amuletKeeperPalette, 2.3),
            attack: this.bakeSprite(amuletKeeperTopDownAttack, amuletKeeperPalette, 2.3),
            hurt: this.bakeRedHurtSprite(amuletKeeperTopDownIdle, 2.3)
        };
        this.illustrations.characters['amuletKeeper'] = this.generateAmuletKeeperIllustration256();
    }

    generateApprenticeIllustration256() {
        const { canvas, ctx } = this.createCanvas(256, 256);

        const palette = {
            'K': '#090d16',
            'S': '#fde047',
            'D': '#d97706',
            'T': '#0891b2',
            'L': '#22d3ee',
            'G': '#d97706',
            'Y': '#fde047',
            'W': '#ffffff',
            'E': '#06b6d4',
            'F': '#78350f',
            'B': '#0e7490',
            'H': '#155e75'
        };

        const art = [
            "..............KKKKKKKKKKKKKK..............",
            "............KKTTTTTTTTTTTTTTKK............",
            "..........KKTTLLYYYYYYYYYYLLTTKK..........",
            "........KKTTLLYYYYYYYYYYYYYYLLTTKK........",
            ".......KTTLLYYYYGGGGGGGGGGYYYYLLTTK.......",
            ".......KTTLLYYYYGGYYGGYYGGYYYYLLTTK.......",
            ".......KTLLTTTTTTTTTTTTTTTTTTTTLLTK.......",
            "......KTLLTSSSSSSSSSSSSSSSSSSSSSTLLTK.....",
            "......KTLLTSSWWWWWWESSSSWWWWWWESSTLLTK....",
            "......KTLLTSSWWWWWWESSSSWWWWWWESSTLLTK....",
            "......KTLLTSSSSSSSSSSTTTSSSSSSSSSSTLLTK...",
            "......KTLLTSSDDDDDDDDDDDDDDDDDDDSSTLLTK...",
            ".......KTLLTSSSSSSSSSSSSSSSSSSSSSTLLTK....",
            "........KTTLLTSSSSSSSSSSSSSSSSSTLLTTK.....",
            ".........KKKTTLLTGGGGGGGGGGGTLLTTKKK......",
            "...........KKTTLLGGYYYYYYYYGGLLTTKK.......",
            "..........KTTTTLLGGYYYYYYYYGGLLTTTTK......",
            "........KTTTTLLTTTTGGGGGGGGTTTTLLTTTTK....",
            ".......KTTTTLLTTTTTTTTTTTTTTTTTTLLTTTTK...",
            "......KTTTTLLTTTTTTTTTTTTTTTTTTTTLLTTTTK..",
            ".....KTTTTLLTTTTTTTTTTTTTTTTTTTTTTLLTTTTK.",
            "....KFFFFLLTTTTTTTTTTTTTTTTTTTTTTTTLLFFFFK",
            "...KFFFFFFLLTTTTTTTTTTTTTTTTTTTTTTLLFFFFFFK",
            "...KFFFFFFLLTTTTTTTTTTTTTTTTTTTTTTLLFFFFFFK",
            "...KFFFFFFLLTTTTTTTTTTTTTTTTTTTTTTLLFFFFFFK",
            "....KKKKKKLLTTTTTTTTTTTTTTTTTTTTTTLLKKKKKK.",
            ".........KLLTTTTTTTTTTTTTTTTTTTTTTLLK.....",
            ".........KLLTTTTTTTTTTTTTTTTTTTTTTLLK.....",
            ".........KLLTTTTTTTTTTTTTTTTTTTTTTLLK.....",
            ".........KLLTTTTTTTTTTTTTTTTTTTTTTLLK.....",
            "..........KKKKKKKKKKKKKKKKKKKKKKKKKK......"
        ];

        this.drawPixelMatrix(ctx, art, palette, 5.8, 8, 12);
        return canvas;
    }

    generateFireMageIllustration256() {
        const { canvas, ctx } = this.createCanvas(256, 256);

        const palette = {
            'K': '#090d16',
            'S': '#fed7aa',
            'R': '#dc2626',
            'L': '#f87171',
            'O': '#f97316',
            'Y': '#fef08a',
            'W': '#ffffff',
            'B': '#991b1b',
            'G': '#b91c1c'
        };

        const art = [
            "..............KKKKKKKKKKKKKK..............",
            "............KKRRRRRRRRRRRRRRKK............",
            "..........KKRROOYYYYYYYYYYOORRKK..........",
            "........KKRROOYYYYYYYYYYYYYYOORRKK........",
            ".......KRROOYYYYBBBBBBBBBBYYYYOORRK.......",
            ".......KRROOYYYYBBYYBBYYBBYYYYOORRK.......",
            ".......KROORRRRRRRRRRRRRRRRRRRROORK.......",
            "......KROORSSSSSSSSSSSSSSSSSSSSROORK......",
            "......KROORSSWWWWWWOSSSSWWWWWWOSROORK.....",
            "......KROORSSWWWWWWOSSSSWWWWWWOSROORK.....",
            "......KROORSSSSSSSSSBBBSSSSSSSSSROORK.....",
            "......KROORSSBBBBBBBBBBBBBBBBBBSSROORK....",
            ".......KROORSSSSSSSSSSSSSSSSSSSSROORK.....",
            "........KRROORSSSSSSSSSSSSSSSSROORRK......",
            ".........KKKRROORBBBBBBBBBBRROORKKK.......",
            "...........KKRROOBBYYYYYYYYBBOORRKK.......",
            "..........KRRRROOBBYYYYYYYYBBOORRRRK......",
            "........KRRRROORRRRBBBBBBBBRRRROORRRRK....",
            ".......KRRRROORRRRRRRRRRRRRRRRRROORRRRK...",
            "......KRRRROORRRRRRRRRRRRRRRRRRRROORRRRK..",
            ".....KRRRROORRRRRRRRRRRRRRRRRRRRRROORRRRK.",
            "....KGGGGLLRRRRRRRRRRRRRRRRRRRRRRLLGGGGK..",
            "...KGGGGGGLLRRRRRRRRRRRRRRRRRRRRLLGGGGGGK.",
            "...KGGGGGGLLRRRRRRRRRRRRRRRRRRRRLLGGGGGGK.",
            "...KGGGGGGLLRRRRRRRRRRRRRRRRRRRRLLGGGGGGK.",
            "....KKKKKKLLRRRRRRRRRRRRRRRRRRRRLLKKKKKK..",
            ".........KLLRRRRRRRRRRRRRRRRRRRRLLK.......",
            ".........KLLRRRRRRRRRRRRRRRRRRRRLLK.......",
            ".........KLLRRRRRRRRRRRRRRRRRRRRLLK.......",
            ".........KLLRRRRRRRRRRRRRRRRRRRRLLK.......",
            "..........KKKKKKKKKKKKKKKKKKKKKKKKKK......"
        ];

        this.drawPixelMatrix(ctx, art, palette, 5.8, 8, 12);
        return canvas;
    }

    generateAmuletKeeperIllustration256() {
        const { canvas, ctx } = this.createCanvas(256, 256);

        const palette = {
            'K': '#090d16',
            'S': '#fde68a',
            'B': '#1d4ed8',
            'L': '#60a5fa',
            'G': '#f59e0b',
            'Y': '#fef08a',
            'W': '#ffffff',
            'D': '#1e3a8a'
        };

        const art = [
            "..............KKKKKKKKKKKKKK..............",
            "............KKGGGGGGGGGGGGGGKK............",
            "..........KKGGLLYYYYYYYYYYLLGGKK..........",
            "........KKGGLLYYYYYYYYYYYYYYLLGGKK........",
            ".......KGGLLYYYYDDDDDDDDDDYYYYLLGGK.......",
            ".......KGGLLYYYYDDYYDDYYDDYYYYLLGGK.......",
            ".......KGLLGGGGGGGGGGGGGGGGGGGGLLGK.......",
            "......KGLLGSSSSSSSSSSSSSSSSSSSSGLLGK......",
            "......KGLLGSSWWWWWWGSSSSWWWWWWGSGLLGK.....",
            "......KGLLGSSWWWWWWGSSSSWWWWWWGSGLLGK.....",
            "......KGLLGSSSSSSSSSGGGGSSSSSSSSGLLGK.....",
            "......KGLLGSSDDDDDDDDDDDDDDDDDDSGLLGK.....",
            ".......KGLLGSSSSSSSSSSSSSSSSSSSSGLLGK.....",
            "........KGGLLGSSSSSSSSSSSSSSSSGLLGGK......",
            ".........KKKGGLLGDDDDDDDDDDGLLGGKKK.......",
            "...........KKGGLLDDYYYYYYYYDDLLGGKK.......",
            "..........KGGGGLLDDYYYYYYYYDDLLGGGGK......",
            "........KGGGGLLGGGGDDDDDDDDGGGGLLGGGGK....",
            ".......KGGGGLLGGGGGGGGGGGGGGGGGGLLGGGGK...",
            "......KGGGGLLGGGGGGGGGGGGGGGGGGGGLLGGGGK..",
            ".....KGGGGLLGGGGGGGGGGGGGGGGGGGGGGLLGGGGK.",
            "....KDDDDLLGGGGGGGGGGGGGGGGGGGGGGLLDDDDK..",
            "...KDDDDDDLLGGGGGGGGGGGGGGGGGGGGLLDDDDDDK.",
            "...KDDDDDDLLGGGGGGGGGGGGGGGGGGGGLLDDDDDDK.",
            "...KDDDDDDLLGGGGGGGGGGGGGGGGGGGGLLDDDDDDK.",
            "....KKKKKKLLGGGGGGGGGGGGGGGGGGGGLLKKKKKK..",
            ".........KLLGGGGGGGGGGGGGGGGGGGGLLK.......",
            ".........KLLGGGGGGGGGGGGGGGGGGGGLLK.......",
            ".........KLLGGGGGGGGGGGGGGGGGGGGLLK.......",
            ".........KLLGGGGGGGGGGGGGGGGGGGGLLK.......",
            "..........KKKKKKKKKKKKKKKKKKKKKKKKKK......"
        ];

        this.drawPixelMatrix(ctx, art, palette, 5.8, 8, 12);
        return canvas;
    }

    // ==========================================
    // 3. ENEMIES SPRITES (7 Types)
    // ==========================================
    generateEnemySprites() {
        this.sprites.enemies = {};

        // 1. smallAfreet
        const smallAfreetPalette = { 'K': '#090d16', 'R': '#ef4444', 'O': '#f97316', 'Y': '#fef08a', 'W': '#ffffff' };
        const smallAfreetIdle = [
            "...KK....KK...",
            "..KRRK..KRRK..",
            ".KROORKKROORK.",
            ".KROYYROOYROK.",
            "KROYYYYYYYYORK",
            "KROYYWWYYWWYRK",
            "KROYYYYYYYYORK",
            ".KROOOOOOOORK.",
            "..KRRRRRRRRK..",
            "...KRR..RRK...",
            "....KK..KK...."
        ];
        this.sprites.enemies['smallAfreet'] = {
            idle: this.bakeSprite(smallAfreetIdle, smallAfreetPalette, 2),
            walk1: this.bakeSprite(smallAfreetIdle, smallAfreetPalette, 2),
            walk2: this.bakeSprite(smallAfreetIdle, smallAfreetPalette, 2),
            hurt: this.bakeRedHurtSprite(smallAfreetIdle, 2)
        };

        // 2. fastAfreet
        const fastAfreetPalette = { 'K': '#090d16', 'C': '#06b6d4', 'L': '#67e8f9', 'W': '#ffffff' };
        const fastAfreetIdle = [
            "....KK....",
            "...KCCK...",
            "..KLLLLK..",
            ".KCLLLLCK.",
            "KCWWLLWWCK",
            "KCLLLLLLCK",
            ".KCCCCCCK.",
            "..KCCCCK..",
            "...KCCK...",
            "....KK...."
        ];
        this.sprites.enemies['fastAfreet'] = {
            idle: this.bakeSprite(fastAfreetIdle, fastAfreetPalette, 2.2),
            walk1: this.bakeSprite(fastAfreetIdle, fastAfreetPalette, 2.2),
            walk2: this.bakeSprite(fastAfreetIdle, fastAfreetPalette, 2.2),
            hurt: this.bakeRedHurtSprite(fastAfreetIdle, 2.2)
        };

        // 3. rangedAfreet
        const rangedAfreetPalette = { 'K': '#090d16', 'Y': '#f59e0b', 'D': '#78350f', 'W': '#ffffff' };
        const rangedAfreetIdle = [
            "...KKKK...",
            "..KYYYYK..",
            ".KYYYYYYK.",
            "KYWWYYWWYK",
            "KYYYYYYYYK",
            ".KDDDDDDK.",
            "..KYYYYK..",
            "...KYYK...",
            "....KK...."
        ];
        this.sprites.enemies['rangedAfreet'] = {
            idle: this.bakeSprite(rangedAfreetIdle, rangedAfreetPalette, 2.2),
            walk1: this.bakeSprite(rangedAfreetIdle, rangedAfreetPalette, 2.2),
            walk2: this.bakeSprite(rangedAfreetIdle, rangedAfreetPalette, 2.2),
            hurt: this.bakeRedHurtSprite(rangedAfreetIdle, 2.2)
        };

        // 4. giantAfreet
        const giantAfreetPalette = { 'K': '#090d16', 'S': '#475569', 'L': '#94a3b8', 'R': '#ef4444', 'W': '#ffffff' };
        const giantAfreetIdle = [
            "....KKKKKK....",
            "...KSSSSSSK...",
            "..KSSLLLLSSK..",
            ".KSSLLLLLLSSK.",
            ".KSWWRLLRWWSK.",
            ".KSSLLLLLLSSK.",
            "..KSSSSSSSSK..",
            ".KSSSSSSSSSSK.",
            ".KSS..SS..SSK.",
            "..KK..KK..KK.."
        ];
        this.sprites.enemies['giantAfreet'] = {
            idle: this.bakeSprite(giantAfreetIdle, giantAfreetPalette, 2.8),
            walk1: this.bakeSprite(giantAfreetIdle, giantAfreetPalette, 2.8),
            walk2: this.bakeSprite(giantAfreetIdle, giantAfreetPalette, 2.8),
            hurt: this.bakeRedHurtSprite(giantAfreetIdle, 2.8)
        };

        // 5. explodingGhoul
        const ghoulPalette = { 'K': '#090d16', 'R': '#dc2626', 'Y': '#fef08a', 'W': '#ffffff' };
        const ghoulIdle = [
            "...KKKK...",
            "..KRRRRK..",
            ".KRYYYYRK.",
            "KRYWWRWYRK",
            "KRYYYYYYRK",
            ".KRRRRRRK.",
            "..KRRRRK..",
            "...KKKK..."
        ];
        this.sprites.enemies['explodingGhoul'] = {
            idle: this.bakeSprite(ghoulIdle, ghoulPalette, 2.2),
            walk1: this.bakeSprite(ghoulIdle, ghoulPalette, 2.2),
            walk2: this.bakeSprite(ghoulIdle, ghoulPalette, 2.2),
            hurt: this.bakeRedHurtSprite(ghoulIdle, 2.2)
        };

        // 6. djinnShaman
        const shamanPalette = { 'K': '#090d16', 'P': '#9333ea', 'L': '#c084fc', 'W': '#ffffff' };
        const shamanIdle = [
            "...KKKK...",
            "..KPPPPK..",
            ".KPLLLLPK.",
            "KPWWLLWWPK",
            "KPLLLLLLPK",
            ".KPPPPPPK.",
            "..KPPPPK..",
            "...KKKK..."
        ];
        this.sprites.enemies['djinnShaman'] = {
            idle: this.bakeSprite(shamanIdle, shamanPalette, 2.4),
            walk1: this.bakeSprite(shamanIdle, shamanPalette, 2.4),
            walk2: this.bakeSprite(shamanIdle, shamanPalette, 2.4),
            hurt: this.bakeRedHurtSprite(shamanIdle, 2.4)
        };

        // 7. cryptBat
        const batPalette = { 'K': '#090d16', 'B': '#1e1b4b', 'P': '#7c3aed', 'R': '#ef4444' };
        const batIdle = [
            "K...KK...K",
            "KB.KPPK.BK",
            "KBBKPPKBBK",
            ".KBKRKKBK.",
            "..KK..KK.."
        ];
        this.sprites.enemies['cryptBat'] = {
            idle: this.bakeSprite(batIdle, batPalette, 2.4),
            walk1: this.bakeSprite(batIdle, batPalette, 2.4),
            walk2: this.bakeSprite(batIdle, batPalette, 2.4),
            hurt: this.bakeRedHurtSprite(batIdle, 2.4)
        };
    }

    // ==========================================
    // 4. BOSS & MINI-BOSS SPRITES
    // ==========================================
    generateBossSprites() {
        this.sprites.bosses = {};

        // A. Final Big Boss: Afreet King (سلطان الجان)
        const kingPalette = { 'K': '#090d16', 'R': '#991b1b', 'L': '#f87171', 'G': '#d97706', 'Y': '#fde047', 'B': '#3b0764', 'W': '#ffffff' };
        const afreetKingMatrix = [
            "...KK....KK....KK...",
            "..KRRK..KGGK..KRRK..",
            ".KRRRKKKGGGGKKKRRRK.",
            ".KRRRRKGGYYGGKRRRRK.",
            "..KBBBBYYYYYYBBBBK..",
            "..KBBBYYYYYYYYBBBK..",
            ".KBBBYWWYYYYWWYBBBK.",
            ".KBBBBYYYYYYYYBBBBK.",
            "..KBBBDDDDDDDDBBK...",
            "...KGGGGGGGGGGGK....",
            "..KRRRRRRRRRRRRRK...",
            ".KRLLRRRRRRRRRRLLRK.",
            ".KRLLRRGYYYYGRRLLRK.",
            "KRRLLRRGYYYYGRRLLRRK",
            "KRRLLRRRRRRRRRRLLRRK",
            "KRRLLKKRRRRRRKKLLRRK"
        ];
        this.sprites.bosses['afreetKing'] = {
            idle: this.bakeSprite(afreetKingMatrix, kingPalette, 3.2),
            walk1: this.bakeSprite(afreetKingMatrix, kingPalette, 3.2),
            walk2: this.bakeSprite(afreetKingMatrix, kingPalette, 3.2),
            hurt: this.bakeRedHurtSprite(afreetKingMatrix, 3.2)
        };

        // B. Mini-Boss 1: Rock Brute Boss (مارد الصخر)
        const rockPalette = { 'K': '#090d16', 'S': '#334155', 'L': '#64748b', 'G': '#94a3b8', 'R': '#ef4444', 'W': '#ffffff' };
        const rockBossMatrix = [
            "....KKKKKKKK....",
            "...KSSSSSSSSK...",
            "..KSSLLLLLLSSK..",
            ".KSSLLGGGGLLSSK.",
            ".KSWWRLGGRLWWSK.",
            ".KSSLLGGGGLLSSK.",
            "..KSSSSSSSSSSK..",
            ".KSSSSSSSSSSSSK.",
            ".KSS..SSSS..SSK.",
            "..KK..KKKK..KK.."
        ];
        this.sprites.bosses['rockBruteBoss'] = {
            idle: this.bakeSprite(rockBossMatrix, rockPalette, 3.0),
            walk1: this.bakeSprite(rockBossMatrix, rockPalette, 3.0),
            walk2: this.bakeSprite(rockBossMatrix, rockPalette, 3.0),
            hurt: this.bakeRedHurtSprite(rockBossMatrix, 3.0)
        };

        // C. Mini-Boss 2: Necro Shaman Boss (كاهن المقابر)
        const necroPalette = { 'K': '#090d16', 'P': '#581c87', 'L': '#a855f7', 'Y': '#fde047', 'R': '#ef4444', 'W': '#ffffff' };
        const necroBossMatrix = [
            "....KKKKKK....",
            "...KPPPPPPK...",
            "..KPLLLLLLPK..",
            ".KPLLYYLLYYLLPK.",
            ".KPWWRLGGRLWWPK.",
            ".KPLLLLLLLLLLPK.",
            "..KPPPPPPPPPPK..",
            ".KPPPPPPPPPPPK..",
            "..KK..KKKK..KK.."
        ];
        this.sprites.bosses['necroShamanBoss'] = {
            idle: this.bakeSprite(necroBossMatrix, necroPalette, 3.0),
            walk1: this.bakeSprite(necroBossMatrix, necroPalette, 3.0),
            walk2: this.bakeSprite(necroBossMatrix, necroPalette, 3.0),
            hurt: this.bakeRedHurtSprite(necroBossMatrix, 3.0)
        };

        // D. Mini-Boss 3: Infernal Brute Boss (مارد اللهب)
        const infernalPalette = { 'K': '#090d16', 'R': '#b91c1c', 'O': '#ea580c', 'Y': '#fde047', 'W': '#ffffff' };
        const infernalBossMatrix = [
            "....KKKKKKKK....",
            "...KRRRRRRRRK...",
            "..KRROOOOOOORRK..",
            ".KRROOYYYYOORRK.",
            ".KRWWRYYYYRWWRK.",
            ".KRROOYYYYOORRK.",
            "..KRRRRRRRRRRK..",
            ".KRRRRRRRRRRRRK.",
            ".KRR..RRRR..RRK.",
            "..KK..KKKK..KK.."
        ];
        this.sprites.bosses['infernalBruteBoss'] = {
            idle: this.bakeSprite(infernalBossMatrix, infernalPalette, 3.0),
            walk1: this.bakeSprite(infernalBossMatrix, infernalPalette, 3.0),
            walk2: this.bakeSprite(infernalBossMatrix, infernalPalette, 3.0),
            hurt: this.bakeRedHurtSprite(infernalBossMatrix, 3.0)
        };
    }

    // ==========================================
    // 5. PROJECTILES & WEAPON SPRITES
    // ==========================================
    generateProjectileSprites() {
        this.sprites.projectiles = {};

        // 1. magicStaffBolt
        const { canvas: sCanvas, ctx: sCtx } = this.createCanvas(24, 24);
        const sGrad = sCtx.createRadialGradient(12, 12, 2, 12, 12, 10);
        sGrad.addColorStop(0, '#ffffff');
        sGrad.addColorStop(0.4, '#22d3ee');
        sGrad.addColorStop(0.8, '#0891b2');
        sGrad.addColorStop(1, 'rgba(8, 145, 178, 0)');
        sCtx.fillStyle = sGrad;
        sCtx.beginPath();
        sCtx.arc(12, 12, 11, 0, Math.PI * 2);
        sCtx.fill();
        this.sprites.projectiles['magicStaffBolt'] = sCanvas;

        // Evolved Magic Staff (Arch-Sage Orb)
        const { canvas: seCanvas, ctx: seCtx } = this.createCanvas(36, 36);
        const seGrad = seCtx.createRadialGradient(18, 18, 2, 18, 18, 16);
        seGrad.addColorStop(0, '#ffffff');
        seGrad.addColorStop(0.3, '#38bdf8');
        seGrad.addColorStop(0.7, '#0284c7');
        seGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
        seCtx.fillStyle = seGrad;
        seCtx.beginPath();
        seCtx.arc(18, 18, 17, 0, Math.PI * 2);
        seCtx.fill();
        this.sprites.projectiles['magicStaffEvolved'] = seCanvas;

        // 2. fireWandFireball
        const { canvas: fCanvas, ctx: fCtx } = this.createCanvas(28, 28);
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
        this.sprites.projectiles['fireWandFireball'] = fCanvas;

        // Evolved Fire Wand (Solar Inferno)
        const { canvas: feCanvas, ctx: feCtx } = this.createCanvas(40, 40);
        const feGrad = feCtx.createRadialGradient(20, 20, 3, 20, 20, 18);
        feGrad.addColorStop(0, '#ffffff');
        feGrad.addColorStop(0.2, '#fef08a');
        feGrad.addColorStop(0.5, '#f59e0b');
        feGrad.addColorStop(0.8, '#ef4444');
        feGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
        feCtx.fillStyle = feGrad;
        feCtx.beginPath();
        feCtx.arc(20, 20, 19, 0, Math.PI * 2);
        feCtx.fill();
        this.sprites.projectiles['fireWandEvolved'] = feCanvas;

        // 3. magicalTalismanOrb
        const { canvas: tCanvas, ctx: tCtx } = this.createCanvas(28, 28);
        tCtx.fillStyle = '#2563eb';
        tCtx.beginPath();
        tCtx.arc(14, 14, 11, 0, Math.PI * 2);
        tCtx.fill();
        tCtx.fillStyle = '#f59e0b';
        tCtx.beginPath();
        tCtx.arc(14, 14, 6, 0, Math.PI * 2);
        tCtx.fill();
        this.sprites.projectiles['magicalTalismanOrb'] = tCanvas;

        // Evolved Talisman (Celestial Ankh)
        const { canvas: teCanvas, ctx: teCtx } = this.createCanvas(36, 36);
        teCtx.fillStyle = '#fbbf24';
        teCtx.beginPath();
        teCtx.arc(18, 18, 15, 0, Math.PI * 2);
        teCtx.fill();
        teCtx.fillStyle = '#ffffff';
        teCtx.beginPath();
        teCtx.arc(18, 18, 8, 0, Math.PI * 2);
        teCtx.fill();
        this.sprites.projectiles['talismanEvolved'] = teCanvas;

        // 4. flyingClogItem (Brawler Clog)
        const { canvas: cCanvas, ctx: cCtx } = this.createCanvas(28, 28);
        cCtx.fillStyle = '#b45309';
        cCtx.fillRect(6, 8, 16, 12);
        cCtx.fillStyle = '#78350f';
        cCtx.fillRect(8, 6, 12, 4);
        cCtx.fillStyle = '#fbbf24';
        cCtx.fillRect(10, 10, 8, 4);
        this.sprites.projectiles['flyingClogItem'] = cCanvas;

        // Evolved Clog (Titan Clog)
        const { canvas: ceCanvas, ctx: ceCtx } = this.createCanvas(36, 36);
        ceCtx.fillStyle = '#fbbf24';
        ceCtx.fillRect(6, 8, 24, 16);
        ceCtx.fillStyle = '#d97706';
        ceCtx.fillRect(10, 6, 16, 6);
        this.sprites.projectiles['clogEvolved'] = ceCanvas;

        // 5. acidFlaskItem
        const { canvas: aCanvas, ctx: aCtx } = this.createCanvas(24, 24);
        aCtx.fillStyle = '#10b981';
        aCtx.beginPath();
        aCtx.arc(12, 14, 8, 0, Math.PI * 2);
        aCtx.fill();
        aCtx.fillStyle = '#6ee7b7';
        aCtx.fillRect(10, 4, 4, 6);
        this.sprites.projectiles['acidFlaskItem'] = aCanvas;

        // Evolved Acid Flask
        const { canvas: aeCanvas, ctx: aeCtx } = this.createCanvas(32, 32);
        aeCtx.fillStyle = '#22c55e';
        aeCtx.beginPath();
        aeCtx.arc(16, 18, 12, 0, Math.PI * 2);
        aeCtx.fill();
        aeCtx.fillStyle = '#fef08a';
        aeCtx.fillRect(14, 4, 4, 8);
        this.sprites.projectiles['acidFlaskEvolved'] = aeCanvas;

        // 6. shotgunPellet
        const { canvas: shCanvas, ctx: shCtx } = this.createCanvas(14, 14);
        shCtx.fillStyle = '#f8fafc';
        shCtx.beginPath();
        shCtx.arc(7, 7, 5, 0, Math.PI * 2);
        shCtx.fill();
        this.sprites.projectiles['shotgunPellet'] = shCanvas;

        const { canvas: sheCanvas, ctx: sheCtx } = this.createCanvas(20, 20);
        sheCtx.fillStyle = '#ef4444';
        sheCtx.beginPath();
        sheCtx.arc(10, 10, 8, 0, Math.PI * 2);
        sheCtx.fill();
        this.sprites.projectiles['shotgunEvolved'] = sheCanvas;

        // Sand Bolt
        const { canvas: sbCanvas, ctx: sbCtx } = this.createCanvas(20, 20);
        sbCtx.fillStyle = '#f59e0b';
        sbCtx.beginPath();
        sbCtx.arc(10, 10, 7, 0, Math.PI * 2);
        sbCtx.fill();
        this.sprites.projectiles['sandBolt'] = sbCanvas;
    }

    // ==========================================
    // 6. PICKUPS & ICONS
    // ==========================================
    generatePickupSprites() {
        this.sprites.pickups = {};

        // XP Small
        const { canvas: xps, ctx: xpsCtx } = this.createCanvas(16, 16);
        xpsCtx.fillStyle = '#06b6d4';
        xpsCtx.beginPath();
        xpsCtx.moveTo(8, 1);
        xpsCtx.lineTo(15, 8);
        xpsCtx.lineTo(8, 15);
        xpsCtx.lineTo(1, 8);
        xpsCtx.closePath();
        xpsCtx.fill();
        this.sprites.pickups['XP_SMALL'] = xps;

        // XP Medium
        const { canvas: xpm, ctx: xpmCtx } = this.createCanvas(20, 20);
        xpmCtx.fillStyle = '#3b82f6';
        xpmCtx.beginPath();
        xpmCtx.moveTo(10, 1);
        xpmCtx.lineTo(19, 10);
        xpmCtx.lineTo(10, 19);
        xpmCtx.lineTo(1, 10);
        xpmCtx.closePath();
        xpmCtx.fill();
        this.sprites.pickups['XP_MEDIUM'] = xpm;

        // XP Large
        const { canvas: xpl, ctx: xplCtx } = this.createCanvas(24, 24);
        xplCtx.fillStyle = '#8b5cf6';
        xplCtx.beginPath();
        xplCtx.moveTo(12, 1);
        xplCtx.lineTo(23, 12);
        xplCtx.lineTo(12, 23);
        xplCtx.lineTo(1, 12);
        xplCtx.closePath();
        xplCtx.fill();
        this.sprites.pickups['XP_LARGE'] = xpl;

        // Coin
        const { canvas: coin, ctx: cCtx } = this.createCanvas(18, 18);
        cCtx.fillStyle = '#f59e0b';
        cCtx.beginPath();
        cCtx.arc(9, 9, 8, 0, Math.PI * 2);
        cCtx.fill();
        cCtx.fillStyle = '#fbbf24';
        cCtx.beginPath();
        cCtx.arc(9, 9, 5, 0, Math.PI * 2);
        cCtx.fill();
        this.sprites.pickups['COIN'] = coin;

        // Health Potion
        const { canvas: hp, ctx: hpCtx } = this.createCanvas(18, 18);
        hpCtx.fillStyle = '#22c55e';
        hpCtx.beginPath();
        hpCtx.arc(9, 11, 7, 0, Math.PI * 2);
        hpCtx.fill();
        hpCtx.fillStyle = '#ffffff';
        hpCtx.fillRect(7, 3, 4, 5);
        this.sprites.pickups['HEALTH'] = hp;

        // Magnet
        const { canvas: mag, ctx: magCtx } = this.createCanvas(18, 18);
        magCtx.strokeStyle = '#ef4444';
        magCtx.lineWidth = 3;
        magCtx.beginPath();
        magCtx.arc(9, 9, 6, Math.PI, 0);
        magCtx.stroke();
        this.sprites.pickups['MAGNET'] = mag;

        // Chest
        const { canvas: chest, ctx: chCtx } = this.createCanvas(24, 24);
        chCtx.fillStyle = '#d97706';
        chCtx.fillRect(3, 6, 18, 14);
        chCtx.fillStyle = '#fbbf24';
        chCtx.fillRect(9, 10, 6, 6);
        this.sprites.pickups['CHEST'] = chest;
    }

    generateUIIcons() {
        this.icons = {
            magicStaff: '🪄',
            fireWand: '🔥',
            lightningRod: '⚡',
            magicalTalisman: '🧿',
            flyingClog: '🪵',
            acidFlask: '🧪',
            hunterShotgun: '🔫',
            spiritSmoke: '💨'
        };
    }

    get(category, entityId, frameName = 'idle') {
        if (this.sprites[category] && this.sprites[category][entityId]) {
            return this.sprites[category][entityId][frameName] || this.sprites[category][entityId].idle || null;
        }
        return null;
    }

    getIllustration(characterId) {
        return this.illustrations.characters[characterId] || null;
    }
}

export const assetManager = new AssetManager();
