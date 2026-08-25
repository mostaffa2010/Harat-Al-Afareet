/**
 * حارة العفاريت — Harat El Afareet
 * Spatial Partitioning Collision Engine
 */

export class CollisionSystem {
    constructor(cellSize = 128) {
        this.cellSize = cellSize;
        this.grid = new Map();
    }

    clear() {
        this.grid.clear();
    }

    getCellKey(col, row) {
        return `${col},${row}`;
    }

    insert(entity) {
        const col = Math.floor(entity.x / this.cellSize);
        const row = Math.floor(entity.y / this.cellSize);
        const key = this.getCellKey(col, row);

        if (!this.grid.has(key)) {
            this.grid.set(key, []);
        }
        this.grid.get(key).push(entity);
    }

    /**
     * Get all potential candidate entities within a bounding radius
     */
    queryRadius(x, y, radius) {
        const candidates = [];
        const minCol = Math.floor((x - radius) / this.cellSize);
        const maxCol = Math.floor((x + radius) / this.cellSize);
        const minRow = Math.floor((y - radius) / this.cellSize);
        const maxRow = Math.floor((y + radius) / this.cellSize);

        for (let c = minCol; c <= maxCol; c++) {
            for (let r = minRow; r <= maxRow; r++) {
                const key = this.getCellKey(c, r);
                const cell = this.grid.get(key);
                if (cell) {
                    for (let i = 0; i < cell.length; i++) {
                        candidates.push(cell[i]);
                    }
                }
            }
        }
        return candidates;
    }

    /**
     * Circle-Circle intersection check
     */
    checkCircleOverlap(x1, y1, r1, x2, y2, r2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distSq = dx * dx + dy * dy;
        const radSum = r1 + r2;
        return distSq <= radSum * radSum;
    }

    /**
     * Get distance between two points
     */
    getDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

export const collisionSystem = new CollisionSystem(128);
