'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Download } from 'lucide-react';
import { SiteNavbar } from '@/components/ui/site-navbar';

export default function AdatkezelesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <SiteNavbar />

      <main className="pt-28 pb-12 flex-grow">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">ADATKEZELÉSI TÁJÉKOZTATÓ</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">a Rosti B2B online felületének használatához<br />(2026. április 2. napjától hatályos)</p>
            </div>
            {/* <a
              href="/documents/ROSTI – ADATKEZELÉSI.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#0B5D3F] hover:text-white transition-all shadow-sm shrink-0"
            >
              <Download size={14} strokeWidth={2.5} />
              PDF letöltés
            </a> */}
          </div>

          <div className="space-y-8 leading-relaxed text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">I. Az Adatkezelő és elérhetőségei</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Cégnév:</strong> DAB Tanácsadó Kft. (&ldquo;Adatkezelő&rdquo;)</li>
                <li><strong>Székhely:</strong> 8200 Veszprém, Egry József utca 27. 1. em. 7. ajtó</li>
                <li><strong>Adószám:</strong> 14114649-2-19</li>
                <li><strong>Adatvédelmi kapcsolattartó e-mail címe:</strong> <a href="mailto:dab.tanacsado.kft@gmail.com" className="text-[#0B5D3F] hover:underline font-bold">dab.tanacsado.kft@gmail.com</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">II. Az adatvédelmi tisztviselő</h2>
              <p>Az Általános Adatvédelmi Rendelet (GDPR) 37. cikke szerint az Adatkezelő nem köteles külön adatvédelmi tisztviselőt kijelölni. Az adatvédelemmel kapcsolatos megkereséseket az I. pontban megadott e-mail címen fogadjuk.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">III. Az Adatkezelési Tájékoztató célja és hatálya</h2>
              <p className="mb-2">3.1. Jelen Adatkezelési Tájékoztató célja, hogy rögzítse az Adatkezelő által alkalmazott adatvédelmi és -kezelési elveket a Rosti webáruház (a továbbiakban: Weboldal) B2B (vállalkozások közötti) értékesítési folyamata során.</p>
              <p className="mb-2">3.2. Jelen tájékoztató kizárólag a természetes személyek (egyéni vállalkozók és céges kapcsolattartók) adatainak kezelésére vonatkozik, a jogi személyek (cégek) hivatalos adatai nem esnek a GDPR hatálya alá.</p>
              <p>3.3. Ellenkező tájékoztatás hiányában a Tájékoztató hatálya nem terjed ki olyan weboldalak, szolgáltatók adatkezeléseire, melyekre a Weboldalon található hivatkozás vezet. Az ilyen szolgáltatásokért az Adatkezelő semmilyen felelősséget nem vállal.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">IV. Az adatkezelés elvei és biztonsága</h2>
              <p className="mb-2">4.1. Az Adatkezelő a személyes adatokat a jóhiszeműség, a tisztesség és az átláthatóság elveinek, valamint a hatályos jogszabályoknak megfelelően, kizárólag célhoz kötötten kezeli. A megadott adatok megfelelőségéért kizárólag az azt megadó személy (a Vállalkozás kapcsolattartója) felel.</p>
              <p>4.2. Az Adatkezelő gondoskodik a személyes adatok biztonságáról, megteszi azokat a technikai és szervezési intézkedéseket, amelyek megakadályozzák az adatok véletlen elvesztését, jogtalan megsemmisülését, jogosulatlan hozzáférését vagy megváltoztatását.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">V. A kezelt adatok köre, célja és jogalapja</h2>

              <div className="mb-6">
                <h3 className="font-bold mb-2">1. Várólistára jelentkezés és Regisztráció</h3>
                <p><strong>Kezelt adatok:</strong> A kapcsolattartó neve, e-mail címe, telefonszáma (amely lehet céges vagy az érintett magán telefonszáma is), valamint a képviselt Vállalkozás adatai. A telefonszám lehet céges vagy az érintett magán telefonszáma is. A kiszállítás során az Adatkezelő kiszállítást végző munkatársa (futárja) a megadott telefonszámot a sikeres és pontos kézbesítés egyeztetése céljából használja fel (a címzettet felhívhatja).</p>
                <p><strong>Az adatkezelés célja:</strong> A B2B partneri kapcsolat előkészítése, a vállalkozás azonosítása, felhasználói fiók létrehozása és az operatív kapcsolattartás.</p>
                <p><strong>Jogalap:</strong> Egyéni vállalkozók esetén a szerződés előkészítése (GDPR 6. cikk (1) bek. b) pont). Jogi személyek (cégek) kapcsolattartói esetén az Adatkezelő jogos érdeke a zökkenőmentes üzleti kommunikációra (GDPR 6. cikk (1) bek. f) pont).</p>
                <p><strong>Időtartam:</strong> Az elbírálásig, elutasítás esetén 30 napon belül töröljük. Sikeres regisztráció esetén a fiók törléséig (az üzleti kapcsolat végéig).</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-2">2. Megrendelések teljesítése és Kiszállítás</h3>
                <p><strong>Kezelt adatok:</strong> A megrendelést leadó/átvevő személy neve, e-mail címe, valamint megadott (céges vagy magán) telefonszáma, szállítási cím. A telefonszám lehet céges vagy az érintett magán telefonszáma is. A kiszállítás során az Adatkezelő kiszállítást végző munkatársa (futárja) a megadott telefonszámot a sikeres és pontos kézbesítés egyeztetése céljából használja fel (a címzettet felhívhatja).</p>
                <p><strong>Az adatkezelés célja:</strong> A megrendelt italok zökkenőmentes, hűtött kiszállítása és átadása.</p>
                <p><strong>Jogalap:</strong> Szerződés teljesítése, illetve az Adatkezelő jogos érdeke a szerződésszerű teljesítéshez (GDPR 6. cikk (1) bek. b) és f) pont).</p>
                <p><strong>Időtartam:</strong> A megrendelés teljesítésétől számított 5 évig (a polgári jogi elévülési idő végéig).</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-2">3. Számlázás és Könyvelés</h3>
                <p><strong>Kezelt adatok:</strong> A Vállalkozás hivatalos számlázási adatai. A céges kapcsolattartók személyes adatai (név, telefonszám) a számlákon nem kerülnek feltüntetésre. Személyes adat kezelése ezen a ponton kizárólag egyéni vállalkozó partnerek esetén valósul meg a számlán szereplő hivatalos név okán.</p>
                <p><strong>Az adatkezelés célja:</strong> A jogszabályoknak megfelelő számviteli bizonylat kiállítása.</p>
                <p><strong>Jogalap:</strong> Jogi kötelezettség teljesítése (GDPR 6. cikk (1) bek. c) pont).</p>
                <p><strong>Időtartam:</strong> A Számviteli törvény (Sztv. 169. §) alapján 8 évig.</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-2">4. Panaszkezelés és Ügyfélszolgálat</h3>
                <p><strong>Kezelt adatok:</strong> A panaszos kapcsolattartó neve, e-mail címe, telefonszáma, a panasz tartalma.</p>
                <p><strong>Az adatkezelés célja:</strong> A felmerülő logisztikai vagy minőségi kérdések rendezése, a partnerek kiszolgálása.</p>
                <p><strong>Jogalap:</strong> Az Adatkezelő jogos érdeke a minőségbiztosításra és a jogviták elkerülésére (GDPR 6. cikk (1) bek. f) pont).</p>
                <p><strong>Időtartam:</strong> A panasz lezárásától számított 5 évig.</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-2">5. Üzleti célú kapcsolattartás (B2B Direkt Marketing)</h3>
                <p><strong>Kezelt adatok:</strong> Kapcsolattartó neve, e-mail címe.</p>
                <p><strong>Az adatkezelés célja:</strong> Tájékoztatás új termékekről, akciókról.</p>
                <p><strong>Jogalap:</strong> Az Adatkezelő jogos érdeke a meglévő partnerek B2B tájékoztatására, illetve az Érintett hozzájárulása (GDPR 6. cikk (1) bek. a) pont).</p>
                <p><strong>Időtartam:</strong> A hozzájárulás visszavonásáig (leiratkozásig) vagy a tiltakozási jog gyakorlásáig.</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-2">6. Weboldal biztonsága és Rendszernaplózás</h3>
                <p><strong>Kezelt adatok:</strong> A látogató IP címe, a látogatás ideje.</p>
                <p><strong>Az adatkezelés célja:</strong> Informatikai rendszer technikai biztonsága, visszaélések megakadályozása.</p>
                <p><strong>Jogalap:</strong> Az Adatkezelő jogos érdeke a hálózatbiztonság fenntartására (GDPR 6. cikk (1) bek. f) pont).</p>
                <p><strong>Időtartam:</strong> A rögzítéstől számított legfeljebb 30 napig.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">VI. Adatfeldolgozók és Adattovábbítás</h2>
              <p className="mb-4">Az Adatkezelő a szolgáltatások biztosításához az alábbi külsős partnereket (adatfeldolgozókat) veszi igénybe. Az Adatfeldolgozók önálló döntést nem hoznak, kizárólag az Adatkezelővel kötött szerződés és utasítások szerint jogosultak eljárni.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>1. Rackhost Zrt.</strong> (Székhely: 6722 Szeged, Tisza Lajos körút 41.) – Tárhelyszolgáltatás, a weboldal adatainak szerveres tárolása.</li>
                <li><strong>2. Google Ireland Limited</strong> (Székhely: Gordon House, Barrow Street, Dublin 4, Írország) – Felhőalapú levelezőrendszer (Gmail) és tárhelyszolgáltatás (Google Drive) biztosítása az operatív kapcsolattartáshoz és a belső nyilvántartások tárolásához.</li>
                <li><strong>3. KBOSS.hu Kft.</strong> (Székhely: 1031 Budapest, Záhony utca 7.) – A MostSzamlazz.hu online számlázó rendszer üzemeltetése.</li>
                <li><strong>4. Veingartner Ágnes E.V.</strong> (Adószám: 66107149-1-39) – Könyvelési feladatok ellátása a számlázási adatok alapján.</li>
                <li><strong>5. Stripe Payments Europe, Ltd.</strong> (Székhely: 1 Grand Canal Street Lower, Dublin, Írország) – Bankkártyás fizetési rendszer üzemeltetése.</li>
              </ul>
              <p className="mt-4 mb-2"><strong>Belső logisztika:</strong> A kiszállítást a DAB Tanácsadó Kft. saját munkavállalóival vagy közvetlen irányítása alatt álló megbízottjaival végzi, harmadik fél (külsős logisztikai cég vagy futárszolgálat) részére személyes adatot nem továbbít. Az Adatkezelő saját futárja a megadott (céges vagy magán) telefonszámhoz kizárólag a kiszállítás időtartama alatt, a sikeres átadás lebonyolítása érdekében fér hozzá.</p>
              <p><strong>Hatósági adattovábbítás:</strong> Az Adatkezelő jogosult és köteles minden olyan rendelkezésére álló és szabályszerűen tárolt személyes adatot az illetékes hatóságoknak továbbítani, amely adattovábbításra jogszabály vagy jogerős hatósági kötelezés kötelezi.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">VII. Sütik (Cookies) kezelése</h2>
              <p>A Weboldal kizárólag olyan munkamenet és technikai sütiket (cookie-kat) használ, amelyek a webshop alapvető működéséhez, a biztonságos bejelentkezés fenntartásához és a kosár kezeléséhez elengedhetetlenek. A cookie-t a Felhasználó képes törölni saját számítógépéről, illetve beállíthatja böngészőjét a tiltásukra, azonban tudomásul veszi, hogy cookie nélkül a Weboldal működése nem teljes értékű. Analitikai vagy marketing célú (követő) sütiket a Weboldal jelenleg nem alkalmaz.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">VIII. Az Adatkezelési Tájékoztató módosítása</h2>
              <p>Az Adatkezelő fenntartja magának a jogot, hogy a jelen Adatkezelési Tájékoztatót egyoldalú döntésével bármikor módosítsa. A módosításokról a Felhasználókat a Weboldalon történő közzététellel, vagy rendszerüzenetben tájékoztatja.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">IX. Információ az érintettek jogairól és jogorvoslatról</h2>
              <p className="mb-4">Érintettként Ön a következő jogokkal rendelkezik a személyes adatai kezelésének tekintetében, amelyeket az I. pontban megadott e-mail címen (<a href="mailto:dab.tanacsado.kft@gmail.com" className="text-[#0B5D3F] hover:underline font-bold">dab.tanacsado.kft@gmail.com</a>) gyakorolhat:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Hozzáférési jog (GDPR 15. cikk):</strong> Jogosult visszajelzést és részletes tájékoztatást kapni arról, hogy személyes adatainak kezelése folyamatban van-e, és ha igen, milyen adatokat, milyen célból kezelünk.</li>
                <li><strong>Helyesbítéshez való jog (GDPR 16. cikk):</strong> Kérheti a pontatlan személyes adatok indokolatlan késedelem nélküli helyesbítését vagy a hiányos adatok kiegészítését (pl. kapcsolattartó cseréje esetén).</li>
                <li><strong>Törléshez való jog / Elfeledtetéshez való jog (GDPR 17. cikk):</strong> Kérheti személyes adatainak törlését, ha az adatkezelés célja megszűnt, vagy visszavonta hozzájárulását. (Nem alkalmazható, ha az adatkezelés jogi kötelezettség – pl. Számviteli törvény – teljesítéséhez szükséges).</li>
                <li><strong>Az adatkezelés korlátozásához való jog (GDPR 18. cikk):</strong> Kérheti az adatok kezelésének korlátozását, például ha vitatja azok pontosságát, az ellenőrzés időtartamára.</li>
                <li><strong>Adathordozhatósághoz való jog (GDPR 20. cikk):</strong> Jogosult a rá vonatkozó, általa rendelkezésre bocsátott adatokat tagolt, géppel olvasható formátumban megkapni, vagy azokat egy másik adatkezelőnek továbbítani.</li>
                <li><strong>Tiltakozáshoz való jog (GDPR 21. cikk):</strong> Saját helyzetével kapcsolatos okokból bármikor tiltakozhat személyes adatainak „Jogos érdek" (GDPR 6. cikk (1) f) pont) alapján történő kezelése, valamint a közvetlen üzletszerzés (Direkt marketing) ellen.</li>
                <li><strong>Hozzájárulás visszavonása (GDPR 7. cikk (3) bek.):</strong> Amennyiben az adatkezelés hozzájáruláson alapul (pl. hírlevél feliratkozás), azt bármikor, korlátozás nélkül visszavonhatja az e-mailekben található leiratkozó linkkel vagy e-mailben.</li>
              </ul>
              <p className="mt-4 mb-2"><strong>Jogorvoslati lehetőségek:</strong> Amennyiben úgy érzi, hogy az Adatkezelő megsértette a személyes adatok védelméhez fűződő jogait, panaszt tehet az illetékes felügyeleti hatóságnál:</p>
              <p><strong>Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH)</strong><br />
                Székhely: 1055 Budapest, Falk Miksa utca 9-11. (Levelezési cím: 1363 Budapest, Pf.: 9.)<br />
                Weboldal: <a href="http://www.naih.hu" target="_blank" rel="noopener noreferrer" className="text-[#0B5D3F] hover:underline font-bold">www.naih.hu</a> | E-mail: <a href="mailto:ugyfelszolgalat@naih.hu" className="text-[#0B5D3F] hover:underline font-bold">ugyfelszolgalat@naih.hu</a></p>
              <p className="mt-2">Jogai megsértése esetén a bírósághoz is fordulhat az Adatkezelővel szemben. A per elbírálása a törvényszék hatáskörébe tartozik. A keresetet választása szerint a lakóhelye vagy a tartózkodási helye szerinti törvényszékhez nyújthatja be.</p>
            </section>
          </div>
        </div>

        {/* CTA */}
        <div className="py-10 flex flex-col items-center text-center">
          <Link
            href="/modern-shop"
            className="group flex flex-col sm:flex-row items-center gap-4"
          >
            <button className="flex items-center gap-2 bg-[#0B5D3F] text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg group-hover:bg-[#147A55] group-hover:shadow-[#0B5D3F]/20 group-hover:scale-105">
              <span>FELTÖLTÖM A HŰTŐT</span>
              <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://cdn.jsdelivr.net/gh/bal1nt/rosti-img@main/ROSTI_WEBSHOP_P_tr.png"
              alt="Friss zöldségek"
              className="h-16 sm:h-20 w-auto object-contain transition-transform duration-300 drop-shadow-sm group-hover:scale-110 group-hover:-rotate-3"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 px-6 mt-auto relative">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6 relative">
          <div className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
            <Image src="/images/logo.png" alt="Rosti" width={96} height={24} className="h-6 w-auto object-contain" />
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 text-[9px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">
              <Link href="/gyik" className="hover:text-[#0B5D3F] transition-colors">GYIK</Link>
              <Link href="/blog" className="hover:text-[#0B5D3F] transition-colors">Blog</Link>
              <Link href="/osszetevok" className="hover:text-[#0B5D3F] transition-colors">Összetevők</Link>
              <Link href="/adatkezeles" className="hover:text-[#0B5D3F] transition-colors">Adatkezelés</Link>
              <Link href="/altalanos-szerzodesi-feltetelek" className="hover:text-[#0B5D3F] transition-colors">ÁSZF</Link>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium text-center md:text-right leading-relaxed">© 2026 Rosti. Minden jog fenntartva.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
