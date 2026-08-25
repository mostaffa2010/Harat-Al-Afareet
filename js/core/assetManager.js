/**
 * حارة العفاريت — Harat El Afareet
 * Asset Manager & Procedural 2D Pixel-Art Sprite Engine
 */

export class AssetManager {
    constructor() {
        this.sprites = {};
        this.illustrations = {};
        this.icons = {};
        this.tiles = {};
        this.initialized = false;
    }

    /**
     * Initialize and bake all pixel-art sprites into offscreen canvases
     */
    async init() {
        if (this.initialized) return;

        // Generate Tiles & Environment
        this.generateEnvironmentTiles();

        // Generate Character Sprites (walk frames, idle, hurt) & Large Selection Illustrations
        this.generateCharacterSprites();

        // Generate Enemy Sprites
        this.generateEnemySprites();

        // Generate Boss Sprites
        this.generateBossSprites();

        // Generate Weapon & Projectile Sprites
        this.generateProjectileSprites();

        // Generate Pickup Sprites
        this.generatePickupSprites();

        // Generate UI Icons
        this.generateUIIcons();

        this.initialized = true;
    }

    /**
     * Helper to create an offscreen canvas
     */
    createCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        return { canvas, ctx };
    }

    /**
     * Draw pixel matrix on a canvas
     * matrix: array of strings where each character is a color index in palette
     */
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
        // Cobblestone Alley Ground (64x64)
        const { canvas: floorCanvas, ctx: fCtx } = this.createCanvas(64, 64);
        fCtx.fillStyle = '#1c1714';
        fCtx.fillRect(0, 0, 64, 64);

        // Cobblestone stones with subtle shading
        const stones = [
            { x: 2, y: 2, w: 28, h: 18, c: '#2e2620', hi: '#3e342c', sh: '#14100e' },
            { x: 34, y: 2, w: 28, h: 18, c: '#28211b', hi: '#383027', sh: '#120e0c' },
            { x: 2, y: 24, w: 18, h: 16, c: '#241e19', hi: '#342c24', sh: '#100c0a' },
            { x: 24, y: 24, w: 38, h: 16, c: '#312922', hi: '#423830', sh: '#161210' },
            { x: 2, y: 44, w: 32, h: 18, c: '#2a221c', hi: '#3a3129', sh: '#130f0d' },
            { x: 38, y: 44, w: 24, h: 18, c: '#221b16', hi: '#322922', sh: '#0f0c09' }
        ];

        for (const s of stones) {
            fCtx.fillStyle = s.c;
            fCtx.fillRect(s.x, s.y, s.w, s.h);
            // Highlight top/left
            fCtx.fillStyle = s.hi;
            fCtx.fillRect(s.x, s.y, s.w, 2);
            fCtx.fillRect(s.x, s.y, 2, s.h);
            // Shadow bottom/right
            fCtx.fillStyle = s.sh;
            fCtx.fillRect(s.x, s.y + s.h - 2, s.w, 2);
            fCtx.fillRect(s.x + s.w - 2, s.y, 2, s.h);
        }

        // Sand / dust flecks
        fCtx.fillStyle = '#4a3b2c';
        fCtx.fillRect(10, 8, 2, 2);
        fCtx.fillRect(45, 12, 2, 2);
        fCtx.fillRect(28, 30, 2, 2);
        fCtx.fillRect(15, 50, 2, 2);
        fCtx.fillRect(52, 54, 2, 2);

        this.tiles['ground_cobble'] = floorCanvas;

        // Mystic Ancient Ground Rune Tile (64x64)
        const { canvas: runeCanvas, ctx: rCtx } = this.createCanvas(64, 64);
        rCtx.drawImage(floorCanvas, 0, 0);
        rCtx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
        rCtx.lineWidth = 2;
        rCtx.beginPath();
        rCtx.arc(32, 32, 24, 0, Math.PI * 2);
        rCtx.stroke();
        rCtx.beginPath();
        rCtx.moveTo(32, 8); rCtx.lineTo(32, 56);
        rCtx.moveTo(8, 32); rCtx.lineTo(56, 32);
        rCtx.stroke();
        // Glowing glyph center
        rCtx.fillStyle = 'rgba(245, 158, 11, 0.6)';
        rCtx.fillRect(30, 30, 4, 4);
        this.tiles['ground_rune'] = runeCanvas;

        // Egyptian Lantern Wall Prop (32x48)
        const { canvas: lanternCanvas, ctx: lCtx } = this.createCanvas(32, 48);
        // Hanging chain
        lCtx.fillStyle = '#78350f';
        lCtx.fillRect(15, 0, 2, 10);
        // Lantern Bronze Dome
        lCtx.fillStyle = '#b45309';
        lCtx.fillRect(10, 10, 12, 4);
        lCtx.fillStyle = '#d97706';
        lCtx.fillRect(12, 8, 8, 2);
        // Glass Cage
        lCtx.fillStyle = '#1e1b18';
        lCtx.fillRect(9, 14, 14, 18);
        // Golden/Orange Flame Core
        lCtx.fillStyle = '#f59e0b';
        lCtx.fillRect(12, 18, 8, 10);
        lCtx.fillStyle = '#fef08a';
        lCtx.fillRect(14, 20, 4, 6);
        // Bottom Base
        lCtx.fillStyle = '#b45309';
        lCtx.fillRect(11, 32, 10, 4);
        lCtx.fillRect(14, 36, 4, 4);
        this.tiles['lantern'] = lanternCanvas;
    }

    // ==========================================
    // 2. PLAYABLE CHARACTERS & SELECTION ART
    // ==========================================
    generateCharacterSprites() {
        this.sprites.characters = {};
        this.illustrations.characters = {};

        // ----------------------------------------------------
        // A. APPRENTICE (Zaki) - Teal & Gold (#06b6d4 / #f59e0b)
        // ----------------------------------------------------
        const apprenticePalette = {
            'K': '#0f172a', // Outline
            'S': '#fcd34d', // Skin
            'D': '#d97706', // Skin shadow
            'T': '#06b6d4', // Teal robe main
            'L': '#67e8f9', // Teal light
            'B': '#0891b2', // Teal dark
            'G': '#f59e0b', // Gold sash/accent
            'Y': '#fef08a', // Gold bright
            'W': '#ffffff', // Eye white
            'E': '#22d3ee', // Eye glow
            'H': '#1e293b', // Hair / Turban dark
            'F': '#78350f'  // Staff wood
        };

        const apprenticeIdle = [
            "......KKKKKK......",
            "....KKTTTTTTKK....",
            "...KTTLYYYYYLTK...",
            "...KTSSSSSSSSSK...",
            "...KTSWESSSWESK...",
            "...KTSSDSSSSDSK...",
            "....KSSSSSSSSK....",
            "....KGGGGGGGGK....",
            "...KTTTTTTTTTTK...",
            "..KTLLTTTTTTLLTK..",
            ".KTTLLTTGGTTLLTTK.",
            ".KTLLTTGGGGTTLLTK.",
            ".KFLLTTTTTTTTLLTF.",
            "KFFLKKTTTTTTKKLFFK",
            "KFFK..KTTTTK..KFFK",
            ".KK...KBBBBK...KK.",
            "......KBBBBK......",
            "......KSSKSSK.....",
            "......KK..KK......"
        ];

        const apprenticeWalk1 = [
            "......KKKKKK......",
            "....KKTTTTTTKK....",
            "...KTTLYYYYYLTK...",
            "...KTSSSSSSSSSK...",
            "...KTSWESSSWESK...",
            "...KTSSDSSSSDSK...",
            "....KSSSSSSSSK....",
            "....KGGGGGGGGK....",
            "...KTTTTTTTTTTK...",
            "..KTLLTTTTTTLLTK..",
            ".KTTLLTTGGTTLLTTK.",
            ".KTLLTTGGGGTTLLTK.",
            ".KFLLTTTTTTTTLLTF.",
            "KFFLKKTTTTTTKKLFFK",
            "KFFK.KTT..TTK.KFFK",
            ".KK..KBB..BBK..KK.",
            ".....KSS..KK......",
            ".....KK...KSSK....",
            "..........KK......"
        ];

        const apprenticeWalk2 = [
            "......KKKKKK......",
            "....KKTTTTTTKK....",
            "...KTTLYYYYYLTK...",
            "...KTSSSSSSSSSK...",
            "...KTSWESSSWESK...",
            "...KTSSDSSSSDSK...",
            "....KSSSSSSSSK....",
            "....KGGGGGGGGK....",
            "...KTTTTTTTTTTK...",
            "..KTLLTTTTTTLLTK..",
            ".KTTLLTTGGTTLLTTK.",
            ".KTLLTTGGGGTTLLTK.",
            ".KFLLTTTTTTTTLLTF.",
            "KFFLKKTTTTTTKKLFFK",
            "KFFK.KTT..TTK.KFFK",
            ".KK..KBB..BBK..KK.",
            ".....KK...KSSK....",
            "....KSSK..KK......",
            "....KK............"
        ];

        this.sprites.characters['apprentice'] = {
            idle: this.bakeSprite(apprenticeIdle, apprenticePalette, 2),
            walk1: this.bakeSprite(apprenticeWalk1, apprenticePalette, 2),
            walk2: this.bakeSprite(apprenticeWalk2, apprenticePalette, 2),
            hurt: this.bakeHurtSprite(apprenticeIdle, apprenticePalette, 2)
        };

        // Large Character Selection Illustration (160 x 200)
        this.illustrations.characters['apprentice'] = this.generateApprenticeIllustration();

        // ----------------------------------------------------
        // B. FIRE MAGE (Rayan) - Crimson & Amber (#ef4444 / #f59e0b)
        // ----------------------------------------------------
        const fireMagePalette = {
            'K': '#0f172a',
            'S': '#fed7aa',
            'D': '#ea580c',
            'R': '#dc2626', // Red cloak
            'L': '#f87171', // Red light
            'B': '#991b1b', // Red dark
            'O': '#f97316', // Orange fire / sash
            'Y': '#fef08a', // Yellow flame
            'W': '#ffffff',
            'E': '#ef4444', // Red eye glow
            'H': '#b91c1c', // Fiery hair
            'F': '#fbbf24'  // Wand gold
        };

        const fireMageIdle = [
            "......KKHHHH......",
            "....KKHHHHHHHH....",
            "...KHHSSSSSSSHK...",
            "...KHSWESSSWESHK..",
            "...KHSSDSSSSDSHK..",
            "....KSSSSSSSSK....",
            "....KOOOOOOOOK....",
            "...KRRRRRRRRRRK...",
            "..KRLLRRRRRRLLRK..",
            ".KRRLLRROORRLLRRK.",
            ".KRLLRROOOORRLLRK.",
            ".KFLLRRRRRRRRLLTF.",
            "KFFLKKRRRRRRKKLFFK",
            "KYYK..KRRRRK..KYYK",
            ".KK...KBBBBK...KK.",
            "......KBBBBK......",
            "......KSSKSSK.....",
            "......KK..KK......"
        ];

        const fireMageWalk1 = [
            "......KKHHHH......",
            "....KKHHHHHHHH....",
            "...KHHSSSSSSSHK...",
            "...KHSWESSSWESHK..",
            "...KHSSDSSSSDSHK..",
            "....KSSSSSSSSK....",
            "....KOOOOOOOOK....",
            "...KRRRRRRRRRRK...",
            "..KRLLRRRRRRLLRK..",
            ".KRRLLRROORRLLRRK.",
            ".KRLLRROOOORRLLRK.",
            ".KFLLRRRRRRRRLLTF.",
            "KFFLKKRRRRRRKKLFFK",
            "KYYK.KRR..RRK.KYYK",
            ".KK..KBB..BBK..KK.",
            ".....KSS..KK......",
            ".....KK...KSSK....",
            "..........KK......"
        ];

        const fireMageWalk2 = [
            "......KKHHHH......",
            "....KKHHHHHHHH....",
            "...KHHSSSSSSSHK...",
            "...KHSWESSSWESHK..",
            "...KHSSDSSSSDSHK..",
            "....KSSSSSSSSK....",
            "....KOOOOOOOOK....",
            "...KRRRRRRRRRRK...",
            "..KRLLRRRRRRLLRK..",
            ".KRRLLRROORRLLRRK.",
            ".KRLLRROOOORRLLRK.",
            ".KFLLRRRRRRRRLLTF.",
            "KFFLKKRRRRRRKKLFFK",
            "KYYK.KRR..RRK.KYYK",
            ".KK..KBB..BBK..KK.",
            ".....KK...KSSK....",
            "....KSSK..KK......",
            "....KK............"
        ];

        this.sprites.characters['fireMage'] = {
            idle: this.bakeSprite(fireMageIdle, fireMagePalette, 2),
            walk1: this.bakeSprite(fireMageWalk1, fireMagePalette, 2),
            walk2: this.bakeSprite(fireMageWalk2, fireMagePalette, 2),
            hurt: this.bakeHurtSprite(fireMageIdle, fireMagePalette, 2)
        };

        this.illustrations.characters['fireMage'] = this.generateFireMageIllustration();

        // ----------------------------------------------------
        // C. AMULET KEEPER (Layla) - Lapis Blue & Gold (#2563eb / #f59e0b)
        // ----------------------------------------------------
        const amuletKeeperPalette = {
            'K': '#0f172a',
            'S': '#fde047',
            'D': '#ca8a04',
            'U': '#1e40af', // Lapis Blue
            'L': '#60a5fa', // Blue light
            'B': '#172554', // Dark blue
            'G': '#f59e0b', // Gold headdress / amulets
            'Y': '#fef08a', // Gold light
            'W': '#ffffff',
            'E': '#3b82f6', // Eye glow
            'H': '#09090b', // Black Egyptian braided hair
            'A': '#38bdf8'  // Amulet glow
        };

        const amuletKeeperIdle = [
            "......KKGGGGKK......",
            "....KKGGGGGGGGKK....",
            "...KGGHSSSSSSSHGK...",
            "...KGHWESSSWESHGK...",
            "...KGHSSDSSSSDSK....",
            "....KSSSSSSSSK......",
            "....KGGGAAGGK.......",
            "...KUUUUUUUUUUK.....",
            "..KULLUUUUUULLUK....",
            ".KUULLUUGGUULLUUK...",
            ".KULLUUGGGGUULLUK...",
            ".KAALLUUUUUUULLAK...",
            "KAAAKKUUUUUUKKAAAK..",
            "KAYK..KUUUUK..KAYK..",
            ".KK...KBBBBK...KK...",
            "......KBBBBK........",
            "......KSSKSSK.......",
            "......KK..KK........"
        ];

        const amuletKeeperWalk1 = [
            "......KKGGGGKK......",
            "....KKGGGGGGGGKK....",
            "...KGGHSSSSSSSHGK...",
            "...KGHWESSSWESHGK...",
            "...KGHSSDSSSSDSK....",
            "....KSSSSSSSSK......",
            "....KGGGAAGGK.......",
            "...KUUUUUUUUUUK.....",
            "..KULLUUUUUULLUK....",
            ".KUULLUUGGUULLUUK...",
            ".KULLUUGGGGUULLUK...",
            ".KAALLUUUUUUULLAK...",
            "KAAAKKUUUUUUKKAAAK..",
            "KAYK.KUU..UUK.KAYK..",
            ".KK..KBB..BBK..KK...",
            ".....KSS..KK........",
            ".....KK...KSSK......",
            "..........KK........"
        ];

        const amuletKeeperWalk2 = [
            "......KKGGGGKK......",
            "....KKGGGGGGGGKK....",
            "...KGGHSSSSSSSHGK...",
            "...KGHWESSSWESHGK...",
            "...KGHSSDSSSSDSK....",
            "....KSSSSSSSSK......",
            "....KGGGAAGGK.......",
            "...KUUUUUUUUUUK.....",
            "..KULLUUUUUULLUK....",
            ".KUULLUUGGUULLUUK...",
            ".KULLUUGGGGUULLUK...",
            ".KAALLUUUUUUULLAK...",
            "KAAAKKUUUUUUKKAAAK..",
            "KAYK.KUU..UUK.KAYK..",
            ".KK..KBB..BBK..KK...",
            ".....KK...KSSK......",
            "....KSSK..KK........",
            "....KK.............."
        ];

        this.sprites.characters['amuletKeeper'] = {
            idle: this.bakeSprite(amuletKeeperIdle, amuletKeeperPalette, 2),
            walk1: this.bakeSprite(amuletKeeperWalk1, amuletKeeperPalette, 2),
            walk2: this.bakeSprite(amuletKeeperWalk2, amuletKeeperPalette, 2),
            hurt: this.bakeHurtSprite(amuletKeeperIdle, amuletKeeperPalette, 2)
        };

        this.illustrations.characters['amuletKeeper'] = this.generateAmuletKeeperIllustration();
    }

    // ==========================================
    // 3. LARGE CHARACTER ILLUSTRATIONS (For Menu)
    // ==========================================
    generateApprenticeIllustration() {
        const { canvas, ctx } = this.createCanvas(160, 200);

        // Background Aura & Mystic Egyptian Arc
        const grad = ctx.createRadialGradient(80, 100, 10, 80, 100, 75);
        grad.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
        grad.addColorStop(0.7, 'rgba(245, 158, 11, 0.15)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 160, 200);

        // Mystic Ring
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(80, 100, 68, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(80, 100, 62, 0, Math.PI * 2);
        ctx.stroke();

        // Pixel Art Body (Rendered at 4x scale)
        const illApprentice = [
            "........KKKKKKKK........",
            "......KKTTTTTTTTKK......",
            "....KKTTLYYYYYYLTKK.....",
            "...KTTLLYYYYYYYYLLTTK...",
            "...KTSSSSSSSSSSSSSTK....",
            "..KTSSSWWESSSSWWESSTK...",
            "..KTSSSWWESSSSWWESSTK...",
            "..KTSSSDDDSSSSDDDDSSTK..",
            "...KSSSSSSSSSSSSSSSK....",
            "....KGGGGGGGGGGGGGK.....",
            "....KGGYYYYYYYGGGGK.....",
            "...KTTTTTTTTTTTTTTTK....",
            "..KTLLTTTTTTTTTTLLTTK...",
            ".KTTLLTTTTGGTTTTLLTTTK..",
            ".KTLLTTTTGGGGTTTTLLTTK..",
            ".KFLLTTTTGGGGTTTTLLTTK..",
            "KFFLLTTTTTTTTTTTTLLTFKK.",
            "KFFLLKKTTTTTTTTKKLLTFKK.",
            "KYYLKK.KKTTTTKK.KKLYYKK.",
            ".KKK.....KKKK.....KKK..."
        ];

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
            'F': '#78350f'
        };

        this.drawPixelMatrix(ctx, illApprentice, palette, 4.5, 26, 35);

        // Glowing Arcane Staff Orb
        ctx.fillStyle = '#67e8f9';
        ctx.beginPath();
        ctx.arc(28, 105, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(28, 105, 5, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    generateFireMageIllustration() {
        const { canvas, ctx } = this.createCanvas(160, 200);

        const grad = ctx.createRadialGradient(80, 100, 10, 80, 100, 75);
        grad.addColorStop(0, 'rgba(239, 68, 68, 0.5)');
        grad.addColorStop(0.7, 'rgba(249, 115, 22, 0.2)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 160, 200);

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(80, 100, 68, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(80, 100, 62, 0, Math.PI * 2);
        ctx.stroke();

        const illFireMage = [
            "........KKHHHHHH........",
            "......KKHHHHHHHHHH......",
            "....KKHHHHHHHHHHHHHH....",
            "...KHHSSSSSSSSSSSSSHK...",
            "..KHHSSSWWESSSSWWESSSTK.",
            "..KHHSSSWWESSSSWWESSSTK.",
            "..KHHSSSDDDSSSSDDDDSSTK.",
            "...KSSSSSSSSSSSSSSSK....",
            "....KOOOOOOOOOOOOOOK....",
            "....KOOYYYYYYYOOOOK.....",
            "...KRRRRRRRRRRRRRRRK....",
            "..KRLLRRRRRRRRRRLLRRK...",
            ".KRRLLRRRROORRRRLLRRRK..",
            ".KRLLRRRROOOORRRRLLRRK..",
            ".KFLLRRRROOOORRRRLLRRK..",
            "KFFLLRRRRRRRRRRRRLLRFKK.",
            "KFFLLKKRRRRRRRRKKLLRFKK.",
            "KYYLKK.KKRRRRKK.KKLYYKK.",
            ".KKK.....KKKK.....KKK..."
        ];

        const palette = {
            'K': '#090d16',
            'S': '#fed7aa',
            'D': '#ea580c',
            'R': '#b91c1c',
            'L': '#f87171',
            'O': '#ea580c',
            'Y': '#fde047',
            'W': '#ffffff',
            'E': '#ef4444',
            'H': '#dc2626',
            'F': '#fbbf24'
        };

        this.drawPixelMatrix(ctx, illFireMage, palette, 4.5, 26, 35);

        // Fiery Hand Spells
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(28, 115, 14, 0, Math.PI * 2);
        ctx.arc(132, 115, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(28, 115, 6, 0, Math.PI * 2);
        ctx.arc(132, 115, 6, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    generateAmuletKeeperIllustration() {
        const { canvas, ctx } = this.createCanvas(160, 200);

        const grad = ctx.createRadialGradient(80, 100, 10, 80, 100, 75);
        grad.addColorStop(0, 'rgba(37, 99, 235, 0.45)');
        grad.addColorStop(0.7, 'rgba(245, 158, 11, 0.2)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 160, 200);

        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(80, 100, 68, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(80, 100, 62, 0, Math.PI * 2);
        ctx.stroke();

        const illAmulet = [
            "......KKGGGGGGGGKK......",
            "....KKGGGGGGGGGGGGKK....",
            "...KGGHSSSSSSSSSSSHGK...",
            "..KGGHSSWWESSSSWWESHGK..",
            "..KGGHSSWWESSSSWWESHGK..",
            "..KGGHSSDDDSSSSDDDDSGK..",
            "...KSSSSSSSSSSSSSSSK....",
            "....KGGGGAAAAAGGGGK.....",
            "....KGGGYAAAAAYGGGK.....",
            "...KUUUUUUUUUUUUUUUK....",
            "..KULLUUUUUUUUUULLUUK...",
            ".KUULLUUUUGGUUUULLUUUK..",
            ".KULLUUUUGGGGUUUULLUUK..",
            ".KALLUUUUGGGGUUUULLAAK..",
            "KAALLUUUUUUUUUUUULLAAYK.",
            "KAALLKKUUUUUUUUKKLLAAYK.",
            "KYYLKK.KKUUUUKK.KKLYYKK.",
            ".KKK.....KKKK.....KKK..."
        ];

        const palette = {
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
            'A': '#38bdf8'
        };

        this.drawPixelMatrix(ctx, illAmulet, palette, 4.5, 26, 35);

        // Orbiting glowing talisman
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(22, 100, 14, 18);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(25, 104, 8, 10);

        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(124, 100, 14, 18);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(127, 104, 8, 10);

        return canvas;
    }

    // ==========================================
    // 4. ENEMIES
    // ==========================================
    generateEnemySprites() {
        this.sprites.enemies = {};

        // 1. Small Afreet (عفريت الشعلة / Shadow Wisp)
        const smallAfreetPalette = {
            'K': '#090d16',
            'P': '#7e22ce', // Purple core
            'L': '#c084fc', // Lilac glow
            'R': '#ef4444', // Red fiery eyes
            'D': '#3b0764'  // Dark shadow
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
        const smallAfreetWalk = [
            "......KKKK......",
            "....KKLLLLKK....",
            "...KLLPPPLLLK...",
            "..KLPPPPPPLPK...",
            "..KLPRPPPRPLK...",
            "..KLPRPPPRPLK...",
            "..KLPPDDDPPLK...",
            "...KLPDDDPLK....",
            "....KLLLLLK.....",
            ".....KLPK.......",
            "......KKK......."
        ];

        this.sprites.enemies['smallAfreet'] = {
            idle: this.bakeSprite(smallAfreetIdle, smallAfreetPalette, 2),
            walk1: this.bakeSprite(smallAfreetIdle, smallAfreetPalette, 2),
            walk2: this.bakeSprite(smallAfreetWalk, smallAfreetPalette, 2),
            hurt: this.bakeHurtSprite(smallAfreetIdle, smallAfreetPalette, 2)
        };

        // 2. Fast Afreet (عفريت الريح / Djinn Stalker)
        const fastAfreetPalette = {
            'K': '#090d16',
            'G': '#059669', // Emerald body
            'L': '#34d399', // Emerald light
            'Y': '#fde047', // Glowing yellow eyes
            'D': '#064e3b', // Deep green shadow
            'H': '#10b981'  // Horns
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

        // 3. Ranged Afreet (عفريت القاذف / Sand Spitter)
        const rangedAfreetPalette = {
            'K': '#090d16',
            'S': '#d97706', // Sand shroud
            'L': '#fbbf24', // Sand light
            'B': '#78350f', // Sand dark
            'Y': '#fef08a', // Mystic eye
            'C': '#b45309'  // Clay vase
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

        // 4. Giant Afreet (مارد الحارة / Alley Brute)
        const giantAfreetPalette = {
            'K': '#090d16',
            'O': '#334155', // Obsidian stone
            'L': '#64748b', // Stone highlight
            'M': '#f97316', // Magma glowing cracks
            'Y': '#fef08a', // Burning eye
            'H': '#1e293b'  // Horns
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
    }

    // ==========================================
    // 5. BOSSES (Afreet King / ملك العفاريت)
    // ==========================================
    generateBossSprites() {
        this.sprites.bosses = {};

        const kingPalette = {
            'K': '#090d16',
            'R': '#991b1b', // Royal crimson cloak
            'L': '#f87171', // Red light
            'G': '#d97706', // Gold crown/jewelry
            'Y': '#fde047', // Glowing eyes & gems
            'B': '#3b0764', // Demonic purple body
            'H': '#18181b', // Horns
            'F': '#ef4444'  // Dark fire
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
    // 6. WEAPONS & PROJECTILES
    // ==========================================
    generateProjectileSprites() {
        this.sprites.projectiles = {};

        // Magic Staff Bolt (16x16)
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

        // Fire Wand Fireball (24x24)
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

        // Lightning Rod Arc Impact (32x32)
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

        // Magical Talisman (24x24)
        const { canvas: talismanCanvas, ctx: tCtx } = this.createCanvas(24, 24);
        tCtx.fillStyle = '#f59e0b';
        tCtx.fillRect(4, 2, 16, 20);
        tCtx.fillStyle = '#fde047';
        tCtx.fillRect(6, 4, 12, 16);
        // Eye of Horus in cyan
        tCtx.fillStyle = '#0284c7';
        tCtx.fillRect(8, 9, 8, 6);
        tCtx.fillStyle = '#ffffff';
        tCtx.fillRect(11, 11, 2, 2);
        this.sprites.projectiles['magicalTalismanShield'] = talismanCanvas;

        // Enemy Projectile (Dark Sand Bolt 16x16)
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

    // ==========================================
    // 7. PICKUPS (XP Crystals, Coins, Potions)
    // ==========================================
    generatePickupSprites() {
        this.sprites.pickups = {};

        // Small XP Crystal (Cyan diamond 16x16)
        const { canvas: xpSCanvas, ctx: xsCtx } = this.createCanvas(16, 16);
        xsCtx.fillStyle = '#06b6d4';
        xsCtx.beginPath();
        xsCtx.moveTo(8, 2); xsCtx.lineTo(14, 8); xsCtx.lineTo(8, 14); xsCtx.lineTo(2, 8);
        xsCtx.closePath();
        xsCtx.fill();
        xsCtx.fillStyle = '#a5f3fc';
        xsCtx.fillRect(6, 6, 4, 4);
        this.sprites.pickups['XP_SMALL'] = xpSCanvas;

        // Medium XP Crystal (Emerald diamond 18x18)
        const { canvas: xpMCanvas, ctx: xmCtx } = this.createCanvas(18, 18);
        xmCtx.fillStyle = '#10b981';
        xmCtx.beginPath();
        xmCtx.moveTo(9, 2); xmCtx.lineTo(16, 9); xmCtx.lineTo(9, 16); xmCtx.lineTo(2, 9);
        xmCtx.closePath();
        xmCtx.fill();
        xmCtx.fillStyle = '#6ee7b7';
        xmCtx.fillRect(7, 7, 4, 4);
        this.sprites.pickups['XP_MEDIUM'] = xpMCanvas;

        // Large XP Crystal (Amethyst diamond 20x20)
        const { canvas: xpLCanvas, ctx: xlCtx } = this.createCanvas(20, 20);
        xlCtx.fillStyle = '#8b5cf6';
        xlCtx.beginPath();
        xlCtx.moveTo(10, 2); xlCtx.lineTo(18, 10); xlCtx.lineTo(10, 18); xlCtx.lineTo(2, 10);
        xlCtx.closePath();
        xlCtx.fill();
        xlCtx.fillStyle = '#c4b5fd';
        xlCtx.fillRect(8, 8, 4, 4);
        this.sprites.pickups['XP_LARGE'] = xpLCanvas;

        // Ancient Egyptian Gold Coin (18x18)
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

        // Health Elixir (20x20)
        const { canvas: hpCanvas, ctx: hCtx } = this.createCanvas(20, 20);
        hCtx.fillStyle = '#94a3b8'; // Cork
        hCtx.fillRect(8, 2, 4, 3);
        hCtx.fillStyle = '#ef4444'; // Red potion
        hCtx.beginPath();
        hCtx.arc(10, 12, 7, 0, Math.PI * 2);
        hCtx.fill();
        hCtx.fillStyle = '#fca5a5';
        hCtx.fillRect(8, 9, 3, 3);
        this.sprites.pickups['HEALTH'] = hpCanvas;

        // Magnet Scarab (20x20)
        const { canvas: magCanvas, ctx: mCtx } = this.createCanvas(20, 20);
        mCtx.fillStyle = '#f59e0b';
        mCtx.beginPath();
        mCtx.arc(10, 10, 8, 0, Math.PI * 2);
        mCtx.fill();
        mCtx.fillStyle = '#06b6d4';
        mCtx.fillRect(8, 6, 4, 8);
        this.sprites.pickups['MAGNET'] = magCanvas;
    }

    // ==========================================
    // 8. UI ICONS & WEAPON ICONS
    // ==========================================
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

    // ==========================================
    // UTILITY BUILDERS
    // ==========================================
    bakeSprite(matrix, palette, scale = 2) {
        const width = matrix[0].length * scale;
        const height = matrix.length * scale;
        const { canvas, ctx } = this.createCanvas(width, height);
        this.drawPixelMatrix(ctx, matrix, palette, scale);
        return canvas;
    }

    bakeHurtSprite(matrix, palette, scale = 2) {
        const hurtPalette = {};
        for (const k in palette) {
            hurtPalette[k] = '#ffffff'; // White flash
        }
        return this.bakeSprite(matrix, hurtPalette, scale);
    }

    /**
     * Get sprite canvas for rendering
     */
    get(category, id, anim = 'idle') {
        if (this.sprites[category] && this.sprites[category][id]) {
            return this.sprites[category][id][anim] || this.sprites[category][id].idle || this.sprites[category][id];
        }
        return null;
    }

    /**
     * Get character selection illustration
     */
    getIllustration(characterId) {
        return this.illustrations.characters[characterId] || null;
    }
}

export const assetManager = new AssetManager();
