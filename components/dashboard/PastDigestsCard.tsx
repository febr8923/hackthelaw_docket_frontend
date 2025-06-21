
import React, { useState } from 'react';
import { DigestSummary } from '../../types';
import { ICONS, UI_TEXT_ACCENT } from '../../constants';
import Button from '../shared/Button';

interface PastDigestsCardProps {
  digests: DigestSummary[];
}

const PastDigestsCard: React.FC<PastDigestsCardProps> = ({ digests }) => {
  const [selectedDigest, setSelectedDigest] = useState<DigestSummary | null>(null);

  if (selectedDigest) {
    return (
      <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 border border-gray-100">
        <Button onClick={() => setSelectedDigest(null)} variant="link" size="sm" className="mb-4 -ml-2">
          <ICONS.ARROW_RIGHT className="w-5 h-5 mr-1 transform rotate-180" /> Back to List
        </Button>
        <h2 className="text-3xl font-serif font-semibold text-gray-900 mb-2">{selectedDigest.title}</h2>
        <p className={`text-sm ${UI_TEXT_ACCENT} mb-6`}>{selectedDigest.date}</p>
        <div className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-700 space-y-4">
          <p>{selectedDigest.contentPreview}</p>
          <p>This is a placeholder for the full digest content. In a real application, this section would display the complete text, links, and analysis related to the "{selectedDigest.title}" digest.</p>
          <p>Key topics might include:</p>
          <ul>
            <li>Recent legislative changes</li>
            <li>Significant court rulings</li>
            <li>Industry news and trends</li>
            <li>Impact analysis on specific practice areas</li>
          </ul>
          <p>Further details and source materials would be available here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 border border-gray-100">
      <h2 className="text-3xl font-serif font-semibold text-gray-900 mb-8">Past Digests Archive</h2>
      {digests.length === 0 ? (
        <p className="text-gray-600">No past digests available yet. Your first digest will appear here once generated.</p>
      ) : (
        <div className="space-y-4">
          {digests.map((digest) => (
            <div key={digest.id} className="bg-gray-50 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center border border-gray-200">
              <div>
                <h3 className="text-xl font-semibold font-serif text-gray-800 mb-1">{digest.title}</h3>
                <p className={`text-xs ${UI_TEXT_ACCENT} mb-2`}>{digest.date}</p>
                <p className="text-sm text-gray-600 hidden sm:block max-w-xl truncate">{digest.contentPreview}</p>
              </div>
              <Button 
                onClick={() => setSelectedDigest(digest)} 
                variant="secondary" 
                size="sm" 
                className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0"
                leftIcon={<ICONS.EYE className="w-4 h-4" />}
              >
                View Digest
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastDigestsCard;
