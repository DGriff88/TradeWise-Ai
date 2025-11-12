
import React from 'react';
import { FeatureID } from './types';

// Mock icons for navigation items. In a real app, these would be real icons.
const NavIcon = () => <div className="w-5 h-5 bg-gray-600 rounded-sm mr-3" />;

interface NavItem {
  id: FeatureID;
  label: string;
  icon: React.ReactNode;
  isNew?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <NavIcon /> },
  { id: 'market', label: 'Market Overview', icon: <NavIcon /> },
  { id: 'chatbot', label: 'Quant AI Chat', icon: <NavIcon /> },
];

export const AI_TOOLS_NAV: NavItem[] = [
  { id: 'marketSignal', label: 'Market Signal', icon: <NavIcon /> },
  { id: 'advancedAnalysis', label: 'Advanced Analysis', icon: <NavIcon /> },
  { id: 'chartAnalysis', label: 'Chart Pattern Analysis', icon: <NavIcon /> },
  { id: 'aiScreener', label: 'AI Stock Screener', icon: <NavIcon />, isNew: true },
  { id: 'earningsPrediction', label: 'Earnings Predictor', icon: <NavIcon /> },
  { id: 'secIntelligence', label: 'SEC Intelligence', icon: <NavIcon /> },
  { id: 'warriorScanner', label: 'Warrior Scanner', icon: <NavIcon />, isNew: true },
];
