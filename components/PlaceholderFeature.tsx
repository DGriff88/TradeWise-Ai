
import React from 'react';
import Card from './shared/Card';
import { SparklesIcon } from './shared/Icons';
import { FeatureID } from '../types';

interface PlaceholderFeatureProps {
  onNavigate?: (id: FeatureID) => void;
}

const PlaceholderFeature: React.FC<PlaceholderFeatureProps> = () => {
  return (
    <Card>
      <Card.Body>
        <div className="text-center py-20">
          <SparklesIcon className="mx-auto h-12 w-12 text-[#25D366]" />
          <h3 className="mt-2 text-xl font-semibold text-white">Feature Coming Soon</h3>
          <p className="mt-1 text-[#8B949E]">We're working hard to bring you this new feature. Stay tuned!</p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PlaceholderFeature;