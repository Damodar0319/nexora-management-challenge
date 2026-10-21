import { BlueprintDefinition } from '../types/game';

// Exactly 1 level: The 10-Block Management Pyramid
export const BLUEPRINTS: BlueprintDefinition[] = [
  {
    id: 'mega-pyramid',
    name: 'The 10-Block Management Pyramid',
    description: 'A 4-tier architectural pyramid. Place the 10 correct management attributes to achieve peak organizational performance!',
    icon: 'Building',
    tagline: '10-Block Organizational Pyramid',
    targetCount: 10,
    layout: 'pyramid',
    tierDescriptions: {
      4: {
        title: '👑 TIER 4: CROWN PEAK',
        attributeText: 'Target Attribute: 🔴 Executive Leadership & Vision'
      },
      3: {
        title: '🚀 TIER 3: STRATEGIC BRIDGE',
        attributeText: 'Target Attributes: 🟡 Agility & 🔴 Cross-Unit Synergy'
      },
      2: {
        title: '⚡ TIER 2: CORE ENGINE',
        attributeText: 'Target Attributes: 🔴 Direction, 🟡 Innovation & 🟢 Culture'
      },
      1: {
        title: '🏛️ TIER 1: STRONG FOUNDATION',
        attributeText: 'Target Attributes: 🔵 Operations, 🔵 Governance, 🟡 Tech & 🟢 Well-Being'
      }
    },
    slots: [
      // ---------------------------------------------------------------------
      // TIER 4: CROWN PEAK (1 Slot)
      // ---------------------------------------------------------------------
      {
        id: 'mp-t4-1',
        tier: 4,
        tierLabel: '👑 TIER 4: CROWN PEAK',
        tierAttributeHint: '🔴 Attribute: Executive Leadership & Vision',
        slotIndex: 0,
        label: 'Apex Vision',
        targetAttribute: 'Leadership & Vision',
        attributeColor: 'red',
        attributeHint: 'Put 🔴 Red Leadership block here',
      },

      // ---------------------------------------------------------------------
      // TIER 3: STRATEGIC BRIDGE (2 Slots)
      // ---------------------------------------------------------------------
      {
        id: 'mp-t3-1',
        tier: 3,
        tierLabel: '🚀 TIER 3: STRATEGIC BRIDGE',
        tierAttributeHint: '🟡 Agility & 🔴 Synergy',
        slotIndex: 0,
        label: 'Agility & Speed',
        targetAttribute: 'Innovation & Agility',
        attributeColor: 'yellow',
        attributeHint: 'Put 🟡 Yellow Innovation block here',
      },
      {
        id: 'mp-t3-2',
        tier: 3,
        tierLabel: '🚀 TIER 3: STRATEGIC BRIDGE',
        tierAttributeHint: '🟡 Agility & 🔴 Synergy',
        slotIndex: 1,
        label: 'Cross-Unit Synergy',
        targetAttribute: 'Goals & Team Action',
        attributeColor: 'red',
        attributeHint: 'Put 🔴 Red Action block here',
      },

      // ---------------------------------------------------------------------
      // TIER 2: CORE ENGINE (3 Slots)
      // ---------------------------------------------------------------------
      {
        id: 'mp-t2-1',
        tier: 2,
        tierLabel: '⚡ TIER 2: CORE ENGINE',
        tierAttributeHint: '🔴 Leadership, 🟡 Innovation & 🟢 Culture',
        slotIndex: 0,
        label: 'Decisive Leadership',
        targetAttribute: 'Leadership & Direction',
        attributeColor: 'red',
        attributeHint: 'Put 🔴 Red Leadership block here',
      },
      {
        id: 'mp-t2-2',
        tier: 2,
        tierLabel: '⚡ TIER 2: CORE ENGINE',
        tierAttributeHint: '🔴 Leadership, 🟡 Innovation & 🟢 Culture',
        slotIndex: 1,
        label: 'Creative Innovation',
        targetAttribute: 'Ideas & Innovation',
        attributeColor: 'yellow',
        attributeHint: 'Put 🟡 Yellow Ideas block here',
      },
      {
        id: 'mp-t2-3',
        tier: 2,
        tierLabel: '⚡ TIER 2: CORE ENGINE',
        tierAttributeHint: '🔴 Leadership, 🟡 Innovation & 🟢 Culture',
        slotIndex: 2,
        label: 'Team Culture',
        targetAttribute: 'People & Trust',
        attributeColor: 'green',
        attributeHint: 'Put 🟢 Green Culture block here',
      },

      // ---------------------------------------------------------------------
      // TIER 1: STRONG FOUNDATION (4 Slots)
      // ---------------------------------------------------------------------
      {
        id: 'mp-t1-1',
        tier: 1,
        tierLabel: '🏛️ TIER 1: STRONG FOUNDATION',
        tierAttributeHint: '🔵 Operations, 🔵 Systems, 🟡 Tech & 🟢 People',
        slotIndex: 0,
        label: 'Operations & Flow',
        targetAttribute: 'Operations & Systems',
        attributeColor: 'blue',
        attributeHint: 'Put 🔵 Blue Operations block here',
      },
      {
        id: 'mp-t1-2',
        tier: 1,
        tierLabel: '🏛️ TIER 1: STRONG FOUNDATION',
        tierAttributeHint: '🔵 Operations, 🔵 Systems, 🟡 Tech & 🟢 People',
        slotIndex: 1,
        label: 'Governance & Rules',
        targetAttribute: 'Quality & Governance',
        attributeColor: 'blue',
        attributeHint: 'Put 🔵 Blue Systems block here',
      },
      {
        id: 'mp-t1-3',
        tier: 1,
        tierLabel: '🏛️ TIER 1: STRONG FOUNDATION',
        tierAttributeHint: '🔵 Operations, 🔵 Systems, 🟡 Tech & 🟢 People',
        slotIndex: 2,
        label: 'Smart Technology',
        targetAttribute: 'Tech & Digital AI',
        attributeColor: 'yellow',
        attributeHint: 'Put 🟡 Yellow Tech block here',
      },
      {
        id: 'mp-t1-4',
        tier: 1,
        tierLabel: '🏛️ TIER 1: STRONG FOUNDATION',
        tierAttributeHint: '🔵 Operations, 🔵 Systems, 🟡 Tech & 🟢 People',
        slotIndex: 3,
        label: 'Well-Being & Care',
        targetAttribute: 'People & Wellness',
        attributeColor: 'green',
        attributeHint: 'Put 🟢 Green People block here',
      },
    ]
  }
];
