import React from "react";

interface GamesSectionProps {
  games: any[];
  categories: any[];
}

const GamesSection: React.FC<GamesSectionProps> = ({ games, categories }) => {
  if (!Array.isArray(games) || games.length === 0) return null;
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">Игры</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map(game => (
          <div key={game.id} className="bg-gray-800 rounded-xl p-4 flex flex-col items-center">
            <h4 className="font-semibold mb-2 text-center">{game.name}</h4>
            {Array.isArray(game.image) && game.image.length > 0 ? (
              <img
                src={`http://localhost:1337${game.image[0].formats?.thumbnail?.url || game.image[0].url}`}
                alt={game.image[0].alternativeText || game.name}
                className="w-36 h-24 object-cover rounded mb-2"
              />
            ) : (
              <div className="w-36 h-24 bg-gray-700 rounded mb-2 flex items-center justify-center text-gray-500">Нет изображения</div>
            )}
            {game.game_category && <div className="text-xs text-gray-400">Категория: {game.game_category.name}</div>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default GamesSection; 