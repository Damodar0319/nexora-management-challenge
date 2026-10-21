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
  Globe,
  BookOpen,
  Activity,
  Award,
  Zap,
  RotateCcw,
  ShieldAlert,
  Crown,
  Flame,
  Rocket,
  Shield,
  Database,
  CheckCheck,
  Smile,
  Sparkle,
  Triangle,
  Castle,
  Building,
  Trophy,
  Volume2,
  VolumeX,
  Play,
  Share2,
  RefreshCw,
  Plus,
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
    case 'Globe':
      return <Globe {...props} />;
    case 'BookOpen':
      return <BookOpen {...props} />;
    case 'Activity':
      return <Activity {...props} />;
    case 'Award':
      return <Award {...props} />;
    case 'Zap':
      return <Zap {...props} />;
    case 'Crown':
      return <Crown {...props} />;
    case 'Flame':
      return <Flame {...props} />;
    case 'Rocket':
      return <Rocket {...props} />;
    case 'Shield':
      return <Shield {...props} />;
    case 'Database':
      return <Database {...props} />;
    case 'CheckCheck':
      return <CheckCheck {...props} />;
    case 'Smile':
      return <Smile {...props} />;
    case 'Sparkle':
      return <Sparkle {...props} />;
    case 'Triangle':
      return <Triangle {...props} />;
    case 'Castle':
      return <Castle {...props} />;
    case 'Building':
      return <Building {...props} />;
    case 'Trophy':
      return <Trophy {...props} />;
    case 'Volume2':
      return <Volume2 {...props} />;
    case 'VolumeX':
      return <VolumeX {...props} />;
    case 'Play':
      return <Play {...props} />;
    case 'Share2':
      return <Share2 {...props} />;
    case 'RefreshCw':
      return <RefreshCw {...props} />;
    case 'Plus':
      return <Plus {...props} />;
    case 'Clock':
      return <Activity {...props} />;
    case 'FileText':
      return <Layers {...props} />;
    default:
      return <Building2 {...props} />;
  }
};
