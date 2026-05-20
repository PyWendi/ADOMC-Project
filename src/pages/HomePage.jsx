import { Link } from 'react-router-dom'

const sections = [
  {
    title: 'Recherche aveugle & optimale',
    description: 'BFS, DFS, UCS et A* pour explorer un graphe avec visualisation des étapes et chemins trouvés.',
    to: '/search'
  },
  {
    title: 'Cho-Demoucron (Min/Max)',
    description: 'Calcul min/max sur graphe orienté, matrices et étendue Floyd-Warshall.',
    to: '/chodemoucron'
  },
  {
    title: 'Arbres couvrants',
    description: 'Kruskal et Prim avec affichage des arêtes sélectionnées et structure union-find.',
    to: '/spanning-tree'
  }
]

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="w-full mx-auto px-2 sm:px-3 lg:px-4">
        <div className="bg-white shadow sm:rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Plateforme d’algorithmes de graphes</h1>
          <p className="text-gray-600 leading-7">
            Explore les principaux algorithmes de graphes avec une interface simple :
            recherche aveugle et optimale, Cho-Demoucron pour min/max, et arbres couvrants.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <Link
                key={section.title}
                to={section.to}
                className="group block rounded-lg border border-gray-200 bg-gray-50 p-6 transition hover:border-blue-400 hover:bg-white"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{section.title}</h2>
                <p className="text-gray-600">{section.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-3">Documentation rapide</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li><strong>BFS / DFS :</strong> exploration par largeur ou profondeur.</li>
              <li><strong>UCS / A* :</strong> recherche de chemin avec coût et heuristique.</li>
              <li><strong>Cho-Demoucron :</strong> calcul de chemin min/max sur graphe orienté.</li>
              <li><strong>Kruskal / Prim :</strong> calcul d’arbres couvrants minimaux.</li>
            </ul>
          </div>

          <div className="bg-white shadow sm:rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-3">Navigation</h2>
            <p className="text-gray-600 mb-4">Choisis une page pour accéder aux simulations et visualisations.</p>
            <div className="space-y-3">
              {sections.map((section) => (
                <Link
                  key={section.title}
                  to={section.to}
                  className="block rounded-lg border border-gray-200 px-4 py-3 text-gray-800 hover:border-blue-400 hover:bg-blue-50"
                >
                  {section.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
