import React from "react";

interface TrustBlockSectionProps {
  trustBlocks: any[];
}

const typeLabel: Record<string, string> = {
  license: "Лицензия",
  payment: "Платежи",
  security: "Безопасность",
};

const TrustBlockSection: React.FC<TrustBlockSectionProps> = ({ trustBlocks }) => {
  if (!Array.isArray(trustBlocks) || trustBlocks.length === 0) return null;
  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4">Доверие</h2>
      <div className="flex flex-wrap gap-6">
        {trustBlocks.map(block => (
          <div key={block.id} className="bg-gray-800 rounded-lg p-4 flex items-center gap-4 w-72">
            {Array.isArray(block.icon) && block.icon.length > 0 && (
              <img src={`http://localhost:1337${block.icon[0].url}`} alt={block.type} className="w-12 h-12 object-contain" />
            )}
            <div>
              <div className="font-semibold text-lg">{typeLabel[block.type] || block.type}</div>
              <div className="text-gray-300 text-sm">{block.description}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBlockSection; 