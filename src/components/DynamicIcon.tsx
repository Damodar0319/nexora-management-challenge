import React from 'react';
import {
  Users,
  Target,
  Lightbulb,
  ShieldCheck,
  Network,
  Compass,
  HeartHandshake,
  MessageSquareShare,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Boxes,
  Leaf,
  BarChart3,
  Eye,
  Lock,
  HelpCircle,
  MessageSquareOff,
  XCircle,
  AlertTriangle,
  Building2,
  TrendingUp,
  Cpu,
  Layers,
  LucideProps
} from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Users':
      return <Users {...props} />;
    case 'Target':
      return <Target {...props} />;
    case 'Lightbulb':
      return <Lightbulb {...props} />;
    case 'ShieldCheck':
      return <ShieldCheck {...props} />;
    case 'Network':
      return <Network {...props} />;
    case 'Compass':
      return <Compass {...props} />;
    case 'HeartHandshake':
      return <HeartHandshake {...props} />;
    case 'MessageSquareShare':
      return <MessageSquareShare {...props} />;
    case 'CheckCircle2':
      return <CheckCircle2 {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    case 'GraduationCap':
      return <GraduationCap {...props} />;
    case 'Boxes':
      return <Boxes {...props} />;
    case 'Leaf':
      return <Leaf {...props} />;
    case 'BarChart3':
      return <BarChart3 {...props} />;
    case 'Eye':
      return <Eye {...props} />;
    case 'Lock':
      return <Lock {...props} />;
    case 'HelpCircle':
      return <HelpCircle {...props} />;
    case 'MessageSquareOff':
      return <MessageSquareOff {...props} />;
    case 'XCircle':
      return <XCircle {...props} />;
    case 'AlertTriangle':
      return <AlertTriangle {...props} />;
    case 'Building2':
      return <Building2 {...props} />;
    case 'TrendingUp':
      return <TrendingUp {...props} />;
    case 'Cpu':
      return <Cpu {...props} />;
    case 'Layers':
      return <Layers {...props} />;
    default:
      return <Building2 {...props} />;
  }
};
