/**
 * Guide Content - Bilingual (VI/EN)
 * Content data for the RPG Guide page
 */

export type Language = "vi" | "en";

export interface GuideSection {
  id: string;
  icon: string;
  title: { vi: string; en: string };
  content: { vi: string; en: string };
}

export const guideContent: GuideSection[] = [
  {
    id: "attributes",
    icon: "📊",
    title: {
      vi: "Chỉ số Nhân vật",
      en: "Character Attributes",
    },
    content: {
      vi: `
**5 chỉ số cơ bản** quyết định sức mạnh của Hero:

| Chỉ số | Ý nghĩa | Tăng bằng cách |
|--------|---------|----------------|
| 💪 **STR** (Sức mạnh) | Sức tấn công vật lý | Hoàn thành Ritual habits |
| 🧠 **INT** (Trí tuệ) | Sức tấn công phép | Hoàn thành Project habits |
| 🎯 **DEX** (Khéo léo) | Tỉ lệ chí mạng | Hoàn thành Practice habits |
| 🧘 **WIS** (Trí khôn) | Mana & kháng phép | Hoàn thành Recovery habits |
| ❤️ **VIT** (Sinh lực) | HP tối đa | Chọn Archetype phù hợp |

**Mẹo:** Mỗi Habit bạn tạo có một "Stat Affinity" - hoàn thành nó sẽ tăng chỉ số tương ứng!
      `,
      en: `
**5 core attributes** determine your Hero's power:

| Stat | Meaning | Increased by |
|------|---------|--------------|
| 💪 **STR** (Strength) | Physical attack | Completing Ritual habits |
| 🧠 **INT** (Intelligence) | Magic attack | Completing Project habits |
| 🎯 **DEX** (Dexterity) | Critical chance | Completing Practice habits |
| 🧘 **WIS** (Wisdom) | Mana & magic resist | Completing Recovery habits |
| ❤️ **VIT** (Vitality) | Max HP | Choosing the right Archetype |

**Tip:** Each Habit you create has a "Stat Affinity" - completing it will increase the corresponding stat!
      `,
    },
  },
  {
    id: "archetypes",
    icon: "🎭",
    title: {
      vi: "Hệ phái (Class)",
      en: "Archetypes (Classes)",
    },
    content: {
      vi: `
Chọn **1 trong 4 Archetype** khi đạt Level 5:

| Class | Chỉ số chính | Bonus |
|-------|--------------|-------|
| 🏗️ **Builder** | STR + VIT | +10% XP, tăng trưởng STR x1.2 |
| 📚 **Scholar** | INT + WIS | +10% XP, tăng trưởng INT x1.2 |
| 🏃 **Athlete** | VIT + DEX | +10% XP, tăng trưởng VIT x1.2 |
| 🎨 **Creator** | DEX + INT | +10% XP, tăng trưởng DEX x1.2 |

⚠️ **Lưu ý:** Sau khi chọn, bạn không thể đổi Archetype!
      `,
      en: `
Choose **1 of 4 Archetypes** when you reach Level 5:

| Class | Primary Stats | Bonus |
|-------|---------------|-------|
| 🏗️ **Builder** | STR + VIT | +10% XP, STR growth x1.2 |
| 📚 **Scholar** | INT + WIS | +10% XP, INT growth x1.2 |
| 🏃 **Athlete** | VIT + DEX | +10% XP, VIT growth x1.2 |
| 🎨 **Creator** | DEX + INT | +10% XP, DEX growth x1.2 |

⚠️ **Note:** Once chosen, you cannot change your Archetype!
      `,
    },
  },
  {
    id: "resources",
    icon: "💰",
    title: {
      vi: "Tài nguyên",
      en: "Resources",
    },
    content: {
      vi: `
**3 loại tài nguyên chính:**

| Tài nguyên | Cách kiếm | Công dụng |
|------------|-----------|-----------|
| 💰 **Gold** | Hoàn thành Quest | Mua vật phẩm, Crafting |
| 💎 **Essence Shards** | Đánh bại Boss | Mở khóa Talent Tree |
| 🏆 **Relics** | Đánh bại Raid Boss | Buff vĩnh viễn |

**Công thức Gold:**
- Base: 5 Gold/Quest
- Bonus từ Difficulty: x0.5 → x1.6
- Bonus từ Streak: +2% mỗi ngày (tối đa +60%)
      `,
      en: `
**3 main resources:**

| Resource | How to get | Used for |
|----------|------------|----------|
| 💰 **Gold** | Complete Quests | Buy items, Crafting |
| 💎 **Essence Shards** | Defeat Bosses | Unlock Talent Tree |
| 🏆 **Relics** | Defeat Raid Bosses | Permanent buffs |

**Gold formula:**
- Base: 5 Gold/Quest
- Difficulty bonus: x0.5 → x1.6
- Streak bonus: +2% per day (max +60%)
      `,
    },
  },
  {
    id: "energy-morale",
    icon: "⚡",
    title: {
      vi: "Năng lượng & Tinh thần",
      en: "Energy & Morale",
    },
    content: {
      vi: `
**⚡ Energy (Năng lượng)**
- Tối đa: 100
- Tiêu hao: 15/Quest
- Hồi phục: 5/giờ (tự động)
- Uống Energy Potion: +25

**😊 Morale (Tinh thần)**
- Tối đa: 100
- Tăng: +2 khi hoàn thành Quest
- Giảm: -5 khi bỏ lỡ Quest
- Dưới 30: Phạt -20% rewards

**Mẹo:** Giữ Morale cao để nhận thêm XP và Gold!
      `,
      en: `
**⚡ Energy**
- Max: 100
- Cost: 15/Quest
- Regen: 5/hour (automatic)
- Energy Potion: +25

**😊 Morale**
- Max: 100
- Gain: +2 when completing Quest
- Loss: -5 when missing Quest
- Below 30: -20% rewards penalty

**Tip:** Keep Morale high for bonus XP and Gold!
      `,
    },
  },
  {
    id: "streak",
    icon: "🔥",
    title: {
      vi: "Hệ thống Streak",
      en: "Streak System",
    },
    content: {
      vi: `
**🔥 Streak Bonus**
- +2% XP/Gold mỗi ngày giữ streak
- Tối đa: +60% (30 ngày)

**🎫 Grace Token**
- Bảo vệ streak khi bỏ lỡ Quest
- Tối đa: 2 tokens
- Nhận thêm: 1/tuần hoặc Craft

**🛡️ Streak Shield**
- Nhận 1 Shield mỗi 14 ngày streak liên tục
- Tự động sử dụng khi mất streak
      `,
      en: `
**🔥 Streak Bonus**
- +2% XP/Gold per day of streak
- Max: +60% (30 days)

**🎫 Grace Token**
- Protects streak when missing Quest
- Max: 2 tokens
- Earn: 1/week or Craft

**🛡️ Streak Shield**
- Earn 1 Shield every 14 consecutive days
- Auto-used when streak is about to break
      `,
    },
  },
  {
    id: "boss",
    icon: "⚔️",
    title: {
      vi: "Chiến đấu Boss",
      en: "Boss Battles",
    },
    content: {
      vi: `
**Mở khóa:** Level 8

**📅 Weekly Boss**
- Xuất hiện: Mỗi thứ Hai
- Máu: Dựa trên quests bạn miss tuần trước
- Sát thương: Mỗi Quest hoàn thành = 1 đòn đánh
- Phần thưởng: 10 Essence Shards

**👹 Raid Boss (Monthly)**
- Mở khóa: Level 18
- Khó hơn nhiều, cần chuẩn bị kỹ
- Phần thưởng: 25 Shards + Relic hiếm
      `,
      en: `
**Unlocks at:** Level 8

**📅 Weekly Boss**
- Spawns: Every Monday
- HP: Based on quests you missed last week
- Damage: Each Quest completed = 1 hit
- Reward: 10 Essence Shards

**👹 Raid Boss (Monthly)**
- Unlocks: Level 18
- Much harder, requires preparation
- Reward: 25 Shards + Rare Relic
      `,
    },
  },
  {
    id: "talents",
    icon: "✨",
    title: {
      vi: "Cây Tài năng",
      en: "Talent Tree",
    },
    content: {
      vi: `
**3 nhánh:**
- 🎯 **Discipline** - Tăng hiệu quả Quest
- 🧘 **Focus** - Tăng Energy & Recovery
- 💪 **Resilience** - Bảo vệ Streak

**Tier mở khóa theo Level:**
| Tier | Level yêu cầu |
|------|---------------|
| T1 | Level 1 |
| T2 | Level 5 |
| T3 | Level 12 |
| T4 | Level 18 |

**Chi phí:** Essence Shards (5-20 mỗi talent)
      `,
      en: `
**3 branches:**
- 🎯 **Discipline** - Quest efficiency
- 🧘 **Focus** - Energy & Recovery
- 💪 **Resilience** - Streak protection

**Tier unlocks by Level:**
| Tier | Required Level |
|------|----------------|
| T1 | Level 1 |
| T2 | Level 5 |
| T3 | Level 12 |
| T4 | Level 18 |

**Cost:** Essence Shards (5-20 per talent)
      `,
    },
  },
  {
    id: "crafting",
    icon: "⚗️",
    title: {
      vi: "Chế tạo",
      en: "Crafting",
    },
    content: {
      vi: `
**Mở khóa:** Level 10

**Công thức:**
| Vật phẩm | Chi phí | Hiệu ứng |
|----------|---------|----------|
| 🎫 Grace Token | 50 Gold | +1 Token bảo vệ streak |
| ⚡ Energy Potion | 30 Gold | +25 Energy |
| ✨ Morale Boost | 40 Gold | +15 Morale |
      `,
      en: `
**Unlocks at:** Level 10

**Recipes:**
| Item | Cost | Effect |
|------|------|--------|
| 🎫 Grace Token | 50 Gold | +1 Streak protection token |
| ⚡ Energy Potion | 30 Gold | +25 Energy |
| ✨ Morale Boost | 40 Gold | +15 Morale |
      `,
    },
  },
  {
    id: "progression",
    icon: "📈",
    title: {
      vi: "Tiến trình Mở khóa",
      en: "Progression Milestones",
    },
    content: {
      vi: `
| Level | Tính năng mở khóa |
|-------|-------------------|
| 1 | Daily Quests, XP System |
| 3 | Streak System, Grace Tokens |
| 5 | **Archetypes**, Talent T2 |
| 8 | **Weekly Boss** |
| 10 | **Crafting** |
| 12 | Talent T3 |
| 15 | Monthly Raid |
| 18 | Talent T4 |
| 20 | Capstones |

**Công thức XP:** \`100 × Level^1.35\`
      `,
      en: `
| Level | Unlocked Features |
|-------|-------------------|
| 1 | Daily Quests, XP System |
| 3 | Streak System, Grace Tokens |
| 5 | **Archetypes**, Talent T2 |
| 8 | **Weekly Boss** |
| 10 | **Crafting** |
| 12 | Talent T3 |
| 15 | Monthly Raid |
| 18 | Talent T4 |
| 20 | Capstones |

**XP Formula:** \`100 × Level^1.35\`
      `,
    },
  },
];

export const pageTitle = {
  vi: "Sổ tay Anh hùng",
  en: "Hero's Handbook",
};

export const pageSubtitle = {
  vi: "Hướng dẫn đầy đủ về hệ thống RPG",
  en: "Your complete guide to the RPG system",
};
