import { OrganizationalPillarInfo } from '../types/game';

export const PILLARS: OrganizationalPillarInfo[] = [
  {
    id: 'people',
    title: 'PEOPLE',
    subtitle: 'Human Capital & Culture',
    iconName: 'Users',
    accentColor: '#38BDF8', // cyan
    represents: [
      'Employee satisfaction & well-being',
      'Leadership & empowerment',
      'Motivation & psychological safety',
      'Continuous training & career growth',
      'Workforce retention & loyalty'
    ],
    description: 'Focuses on nurturing talent, fostering inspirational leadership, and building an engaged, motivated workforce.'
  },
  {
    id: 'performance',
    title: 'PERFORMANCE',
    subtitle: 'Execution & Operations',
    iconName: 'Target',
    accentColor: '#34D399', // emerald
    represents: [
      'Strategic planning & clear milestones',
      'Measurable objectives & KPIs',
      'Operational productivity & speed',
      'Performance measurement & feedback',
      'Optimal resource efficiency'
    ],
    description: 'Ensures systematic alignment, robust resource allocation, and predictable delivery of strategic goals.'
  },
  {
    id: 'innovation',
    title: 'INNOVATION',
    subtitle: 'Agility & Adaptability',
    iconName: 'Lightbulb',
    accentColor: '#FBBF24', // amber/gold
    represents: [
      'Creative problem-solving & R&D',
      'Calculated experimentation & testing',
      'Continuous organizational learning',
      'Agile adaptation to market shifts',
      'Nurturing disruptive new ideas'
    ],
    description: 'Powers NEXORA’s ability to pioneer smart solutions, embrace change, and thrive in dynamic environments.'
  },
  {
    id: 'purpose',
    title: 'PURPOSE & ETHICS',
    subtitle: 'Values & Sustainability',
    iconName: 'ShieldCheck',
    accentColor: '#A78BFA', // violet
    represents: [
      'Ethical practices & fair governance',
      'Environmental sustainability & ESG',
      'Social responsibility & community trust',
      'Integrity in leadership & operations',
      'Long-term stakeholder value creation'
    ],
    description: 'Anchors the organization with a moral compass, social stewardship, and responsible societal contribution.'
  },
  {
    id: 'structure',
    title: 'STRUCTURE & TEAMWORK',
    subtitle: 'Coordination & Synergy',
    iconName: 'Network',
    accentColor: '#22D3EE', // sky/teal
    represents: [
      'Transparent communication flow',
      'Cross-departmental coordination',
      'Clear organizational architecture',
      'Collaborative team dynamics',
      'Mutual accountability across units'
    ],
    description: 'Bridges departments, eliminates silos, and establishes seamless coordination across NEXORA’s network.'
  }
];
