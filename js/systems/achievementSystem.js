/**
 * حارة العفاريت — Harat El Afareet
 * Achievements & Trophies Engine
 */

import { ACHIEVEMENTS } from '../data/defaultData.js';
import { saveSystem } from './saveSystem.js';
import { audioSystem } from './audioSystem.js';

export class AchievementSystem {
    constructor() {
        this.achievements = ACHIEVEMENTS;
    }

    getAll() {
        const data = saveSystem.data;
        const claimed = data.claimedAchievements || {};

        return this.achievements.map(ach => {
            const currentValue = data[ach.statKey] || 0;
            const isCompleted = currentValue >= ach.target;
            const isClaimed = Boolean(claimed[ach.id]);

            return {
                ...ach,
                currentValue: Math.min(ach.target, currentValue),
                isCompleted,
                isClaimed
            };
        });
    }

    claimReward(achievementId) {
        const ach = this.achievements.find(a => a.id === achievementId);
        if (!ach) return false;

        const data = saveSystem.data;
        if (!data.claimedAchievements) data.claimedAchievements = {};

        const currentValue = data[ach.statKey] || 0;
        if (currentValue >= ach.target && !data.claimedAchievements[achievementId]) {
            data.claimedAchievements[achievementId] = true;
            saveSystem.addCoins(ach.rewardCoins);
            audioSystem.playLevelUp();
            return true;
        }
        return false;
    }
}

export const achievementSystem = new AchievementSystem();
