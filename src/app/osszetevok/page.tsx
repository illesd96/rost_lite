import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import { UnifiedNavbar } from '@/components/ui/unified-navbar';

// Ingredient data matching the photos
const ingredients = [
  {
    id: 'cekla',
    name: 'Cékla',
    icon: '/images/emoji/beetroot.png', 
    color: 'ingredient-beetroot',
    description: 'Étrendi nitrátokkal és betalain antioxidánsokkal a vérkeringés támogatásáért'
  },
  {
    id: 'sargarep',
    name: 'Sárgarépa',
    icon: '/images/emoji/carrot.png',
    color: 'ingredient-carrot',
    description: 'Magas béta-karotin (A-vitamin) és élelmi rost tartalom a szép bőrért és jó látásért'
  },
  {
    id: 'uborka',
    name: 'Uborka',
    icon: '/images/emoji/cucumber.png',
    color: 'ingredient-cucumber',
    description: 'Elektrolitokban és természetes káliumban gazdag a megfelelő hidratációért'
  },
  {
    id: 'lilakaposzta',
    name: 'Lilakaposzta',
    icon: '/images/emoji/red-cabbage.png',
    color: 'ingredient-berry',
    description: 'Antociánok, C és K-vitamin, valamint glükozinolátok az erek és a szív védelméért'
  },
  {
    id: 'citrom',
    name: 'Citrom',
    icon: '/images/emoji/lemon.png',
    color: 'ingredient-citrus',
    description: 'Magas C-vitaminnal támogatja az immunrendszert és segíti a növényi vas felszívódását'
  },
  {
    id: 'zellergum',
    name: 'Zellergumó',
    icon: '/images/emoji/celery.png',
    color: 'ingredient-mint',
    description: 'Természetes kálium-, K-vitamin- és élelmirost-forrás a csontok egészségéért'
  },
  {
    id: 'alma',
    name: 'Alma',
    icon: '/images/emoji/red-apple.png',
    color: 'ingredient-apple',
    description: 'Antioxidánsai támogatják az immunrendrt, polifenoljai pedig a szív egészségét védik'
  }
];

export default function OsszetevokPage() {
  return (
    <div className="min-h-screen bg-rosti-cream">
      {/* Unified Navigation with Back Button */}
      <UnifiedNavbar showBackButton={true} backHref="/" backText="Vissza" />

      {/* Main Content */}
      <main className="py-12 pt-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              A mai friss összetevők
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ezek a vibráló, friss és nyers összetevők a kezdetben tartott Rostiban
            </p>
          </div>

          {/* Ingredients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {ingredients.map((ingredient) => (
              <div 
                key={ingredient.id}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full bg-${ingredient.color}/10 flex-shrink-0 flex items-center justify-center`}>
                    {ingredient.icon.startsWith('/') ? (
                      <Image
                        src={ingredient.icon}
                        alt={ingredient.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <span className="text-4xl">{ingredient.icon}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {ingredient.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {ingredient.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Why Fiber is Important Section */}
          <div className="bg-rosti-gold rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              MIÉRT FONTOS A <span className="text-rosti-cream">ROST</span>?
            </h2>
            
            <div className="max-w-4xl mx-auto mb-8">
              <p className="text-lg md:text-xl text-white leading-relaxed mb-6">
                A rost hozzájárul a jóllakottság érzéséhez, támogatja az egészséges emésztést és létfontosságú 
                szerepet játszik a bélrendszer, valamint a vércukorszint megfelelő működésében.
              </p>
              
              <p className="text-lg md:text-xl text-rosti-cream leading-relaxed mb-8">
                A tudomány jelenlegi állása szerint a megfelelő rostbevitel 
                az egyik legerősebb prevenciós tényező a <strong>krónikus betegségek ellen</strong>.
              </p>
            </div>

            {/* Scientific Sources */}
            <div className="mt-6 text-sm text-center">
              <h4 className="font-semibold mb-2">Tudományos források:</h4>
              <div className="flex flex-wrap justify-center items-center gap-x-2">
                <span>Frontiers in Nutrition</span>
                <a
                  href="https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2024.1510564/full"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  [1]
                </a>
                <span className="text-rosti-cream">|</span>
                <span>Cell Host & Microbe</span>
                <a
                  href="https://www.cell.com/cell-host-microbe/fulltext/S193131281830266X"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  [2]
                </a>
                <span className="text-rosti-cream">|</span>
                <span>News-Medical.net</span>
                <a
                  href="https://www.news-medical.net/health/The-Role-of-Fiber-in-Preventing-Chronic-Disease.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  [3]
                </a>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-x-2 mt-2">
                <span>National Library of Medicine</span>
                <a
                  href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10498976"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  [4]
                </a>
                <a
                  href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9268622"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  [5]
                </a>
                <span className="text-rosti-cream">|</span>
                <span>PubMed</span>
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/35471164/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  [6]
                </a>
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/36193993/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  [7]
                </a>
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/32142510/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  [8]
                </a>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-8 py-4 bg-rosti-brown text-white font-semibold rounded-xl hover:bg-rosti-brown-dark transition-colors duration-200 shadow-lg transform hover:scale-105"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Próbáld ki a Rosti termékeket
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Rosti</h3>
            <p className="text-gray-400 mb-4">
              Minden jog fenntartva.
            </p>
            <p className="text-gray-500 text-sm">
              &copy; 2024 Rosti. Minden jog fenntartva.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
