
import React, { useState } from 'react';
import { FeatureID } from './types';
import { NAV_ITEMS, AI_TOOLS_NAV } from './constants';

// Import all feature components
import Dashboard from './components/Dashboard';
import StockMarket from './components/StockMarket';
import MarketSignal from './components/MarketSignal';
import AdvancedAnalysis from './components/AdvancedAnalysis';
import ImageAnalyzer from './components/ImageAnalyzer';
import Chatbot from './components/Chatbot';
import PlaceholderFeature from './components/PlaceholderFeature';
import SecIntelligence from './components/SecIntelligence';
import WarriorScanner from './components/WarriorScanner';
import AIScreener from './components/AIScreener';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<FeatureID>('dashboard');

  const renderFeature = () => {
    switch (activeFeature) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveFeature} />;
      case 'market':
        return <StockMarket />;
      case 'marketSignal':
        return <MarketSignal />;
      case 'advancedAnalysis':
        return <AdvancedAnalysis />;
      case 'chartAnalysis':
        return <ImageAnalyzer />;
      case 'chatbot':
        return <Chatbot />;
      case 'secIntelligence':
        return <SecIntelligence />;
      case 'warriorScanner':
        return <WarriorScanner />;
      case 'aiScreener':
        return <AIScreener />;
      case 'earningsPrediction':
        return <PlaceholderFeature />; // Placeholder for this one
      default:
        return <Dashboard onNavigate={setActiveFeature} />;
    }
  };

  const NavLink: React.FC<{ id: FeatureID; label: string; isNew?: boolean }> = ({ id, label, isNew }) => (
    <button
      onClick={() => setActiveFeature(id)}
      className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-colors flex items-center justify-between ${
        activeFeature === id ? 'bg-[#25D366] text-black font-semibold' : 'text-[#8B949E] hover:bg-[#30363D] hover:text-white'
      }`}
    >
      <span>{label}</span>
      {isNew && <span className="text-xs bg-blue-500 text-white font-bold px-2 py-0.5 rounded-full">NEW</span>}
    </button>
  );

  return (
    <div className="bg-[#0D1117] min-h-screen text-[#E6EDF3] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#161B22] p-4 border-r border-[#30363D] flex-shrink-0 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 bg-gradient-to-br from-[#25D366] to-green-600 rounded-lg"></div>
          <h1 className="text-xl font-bold text-white">Quant AI</h1>
        </div>
        <nav className="space-y-2 flex-grow">
          <p className="px-4 py-2 text-xs font-semibold text-[#8B949E] uppercase tracking-wider">Main</p>
          {NAV_ITEMS.map(item => <NavLink key={item.id} {...item} />)}
          
          <p className="px-4 pt-6 pb-2 text-xs font-semibold text-[#8B949E] uppercase tracking-wider">AI Tools</p>
          {AI_TOOLS_NAV.map(item => <NavLink key={item.id} {...item} />)}
        </nav>
        <div className="text-center text-xs text-[#484f58]">
            <p>Version 1.0.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {renderFeature()}
      </main>
    </div>
  );
};

export default App;
