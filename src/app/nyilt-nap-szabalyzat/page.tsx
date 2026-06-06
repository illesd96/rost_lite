import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { SiteNavbar } from '@/components/ui/site-navbar';

const EMAIL = 'rendeles@rosti.hu';

export default function NyiltNapSzabalyzatPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <SiteNavbar />

      <main className="pt-28 pb-12 flex-grow">
        <div className="container mx-auto max-w-4xl px-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">Nyílt Napi Vásárlási és Kóstoló Szabályzat</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">(Hatályos: 2026. június 7., vasárnap)</p>

          <p className="mb-8 font-medium text-gray-700 dark:text-gray-300">A jelen szabályzat a DAB Tanácsadó Kft. (székhely: 8200 Veszprém, Egry József utca 27. 1. em. 7. ajtó; adószám: 14114649-2-19; a továbbiakban: Szolgáltató) által a Struve Fitness Prime (üzemeltető: Prime Wellness Kft.) Nyílt Napján biztosított vásárlási és kóstolási lehetőségek feltételeit tartalmazza.</p>

          <div className="space-y-8 leading-relaxed text-gray-700 dark:text-gray-300">
            <section>
              <p className="mb-4 font-bold text-gray-900 dark:text-gray-100">Tartalom:</p>
              <ul className="list-decimal pl-5 space-y-1 mb-8">
                <li><a href="#vasarlas" className="text-[#0B5D3F] hover:underline">Vásárlási és Részvételi Szabályzat</a></li>
                <li><a href="#adatkezeles" className="text-[#0B5D3F] hover:underline">Adatkezelési Tájékoztató (GDPR)</a></li>
                <li><a href="#munkaltatoi-program" className="text-[#0B5D3F] hover:underline">Rosti munkahelyi prémium zöldség-smoothie program</a></li>
              </ul>
            </section>

            <section id="vasarlas" className="scroll-mt-28">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">I. Vásárlási és Részvételi Szabályzat</h2>

              <div className="mb-6">
                <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">1. Helyszín és felelősségkizárás</h3>
                <p className="mb-2">A Szolgáltató a Struve Fitness Prime (1133 Budapest, Bessenyei utca 1-3.) által szervezett Nyílt Napon független, meghívott kiállítóként van jelen. A Szolgáltató kizárólag a saját maga által értékesített vagy kóstolásra biztosított Rosti italok minőségéért felel a hatályos élelmiszer-biztonsági jogszabályok keretei között.</p>
                <p>A rendezvény egyéb programjaival (pl. edzések), a helyszín általános biztonságával és a balesetvédelemmel kapcsolatos mindennemű felelősség a létesítmény üzemeltetőjét (Prime Wellness Kft.) terheli; ezekért a Szolgáltató felelősségét kizárja.</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">2. Vásárlás (Click &amp; Collect)</h3>
                <p className="mb-4">A Click &amp; Collect vásárlási folyamat a kóstolási részvételtől elkülönülő, önálló folyamat. A Click &amp; Collect útján leadott rendelés fizetési kötelezettséggel járó vásárlásnak minősül.</p>

                <h4 className="font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">2.1 Átvételi feltételek és határidő</h4>
                <p className="mb-2">A Rosti italok nyers, hőkezelés nélküli, romlandó friss termékek, amelyek folyamatos hűtést igényelnek. Az élelmiszerbiztonsági és technológiai előírások betartása érdekében a Szolgáltató hűtőkapacitása korlátozott.</p>
                <p className="mb-2">Az online előre kifizetett termékeket a Vásárló a fizetést visszaigazoló e-mail kézhezvételétől számított 15 percen belül köteles átvenni a Rosti pultnál. Az átvétel legkésőbb 2026. június 7-én 16:00 óráig lehetséges.</p>
                <p className="mb-2"><strong>Fontos tájékoztatás, amelyet a Vásárló a fizetés előtt tudomásul vesz:</strong> amennyiben az átvétel a fenti határidőkön belül nem történik meg, a Szolgáltató – az élelmiszerbiztonsági hűtési lánc fenntarthatósága és a korlátozott hűtőkapacitás miatt – a terméket megsemmisítheti. Ebben az esetben a vételár visszatérítésére nem kerül sor.</p>
                <p>A Vásárló kérésére a Szolgáltató munkatársa – amennyiben a készlet és a hűtési feltételek ezt lehetővé teszik – egyedi méltányossági alapon meghosszabbíthatja az átvételi határidőt. Ilyen kérés a Rosti pultnál személyesen vagy a <strong><a href={`mailto:${EMAIL}`} className="text-[#0B5D3F] hover:underline font-bold">{EMAIL}</a></strong> e-mail címen jelezhető.</p>

                <h4 className="font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">2.2 Visszaigazolás és rendelésazonosítás</h4>
                <p className="mb-2">A sikeres fizetést követően a Vásárló e-mailben visszaigazolást kap, amely tartalmazza:</p>
                <ul className="list-disc pl-5 space-y-1 mb-2">
                  <li>az egyedi rendelésazonosítót,</li>
                  <li>a megrendelt mennyiséget,</li>
                  <li>az átvétel helyét (Rosti pult, 1133 Budapest, Bessenyei utca 1-3.),</li>
                  <li>az átvételi határidőt (15 perc a visszaigazolástól, de legkésőbb 16:00),</li>
                  <li>az allergén tájékoztatót.</li>
                </ul>

                <h4 className="font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">2.3 Készletkorlát</h4>
                <p>A rendezvényre szánt készlet véges. Amennyiben a készlet eléri a napi maximumot, a rendelési lehetőség automatikusan lezárásra kerül. Egy vásárló alkalmanként legfeljebb 50 palackot rendelhet, a készlet erejéig. Ezen felüli igény esetén a Szolgáltató fenntartja a jogot a rendelés részleges teljesítésére és az összeg arányos visszatérítésére.</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">3. Kóstoló</h3>
                <p className="mb-2">A kóstolási részvétel a vásárlástól elkülönülő, önálló folyamat, és nem minősül vásárlásnak.</p>
                <p className="mb-2">A kóstoló a helyszínen, a regisztrációs adatlap kitöltését és a kóstolójegy átvételét követően, a készlet erejéig vehető igénybe.</p>
                <p className="mb-2">A kóstolójegy egyedi, véletlenszerűen generált azonosítóval rendelkezik, kizárólag a 2026. június 7-i rendezvényen, és kizárólag a bemutatás napján érvényes. A jegy másra nem ruházható át.</p>
                <p className="mb-2">A regisztráció (név és e-mail cím megadása, valamint a kötelező checkbox elfogadása) feltétele a kóstolásban való részvételnek.</p>
                <p className="mb-2">Egy természetes személy a kóstolót csak egy alkalommal veheti igénybe, függetlenül a kitöltések vagy a használt e-mail-címek számától. A helyszíni kollégák jogosultak a kiszolgálást megtagadni, ha megalapozottan feltehető, hogy ugyanaz a személy ismételten próbál ingyenes kóstolót igénybe venni.</p>
                <p>A kóstolót kizárólag 18. életévüket betöltött természetes személyek vehetik igénybe; egy regisztráló személy legfeljebb egy kóstolójegyre jogosult, és a helyszíni kollégák jogosultak megtagadni a kiszolgálást, ha a kóstoló igénybevétele nem a regisztrált nagykorú személy részére történik.</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">4. Szavatosság és elállási jog</h3>
                <p className="mb-2">Tekintettel arra, hogy a Rosti italok friss, gyorsan romló élelmiszerek, a fogyasztó és a vállalkozás közötti szerződések részletes szabályairól szóló 45/2014. (II.26.) Korm. rendelet 29. § (1) bekezdés d) pontja alapján a Vásárlót a 14 napos indokolás nélküli elállási jog nem illeti meg.</p>
                <p>A Vásárlót azonban a Polgári Törvénykönyvről szóló 2013. évi V. törvény szerinti kellékszavatossági jogok megilletik hibás vagy romlott termék átadása esetén. Hibás teljesítés esetén a Vásárló a terméket az átvételtől számított észszerű időn belül jelezheti a <strong><a href={`mailto:${EMAIL}`} className="text-[#0B5D3F] hover:underline font-bold">{EMAIL}</a></strong> e-mail címen.</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">5. Allergén- és összetevő-tájékoztató</h3>
                <p className="mb-2">A Rosti italok az alábbi friss, nyers, hőkezelés nélküli összetevőkből készülnek:</p>
                <ul className="list-disc pl-5 space-y-1 mb-2">
                  <li>cékla,</li>
                  <li>sárgarépa,</li>
                  <li>uborka,</li>
                  <li>zellergumó (allergén: zeller),</li>
                  <li>lilakáposzta,</li>
                  <li>citrom,</li>
                  <li>alma (100%-os gyümölcstartalmú almalé alapján),</li>
                  <li>szűrt víz.</li>
                </ul>
                <p className="mb-2">A termék a fenti összetevőkön kívül más összetevőt, adalékanyagot, tartósítószert vagy ízfokozót nem tartalmaz. A 14 kötelező EU-allergén közül kizárólag a zeller van jelen. A termék gluténmentes, tejtermékmentes és vegán alapanyagokból készül, azonban a Szolgáltató külön tanúsítvánnyal nem rendelkezik, és a gyártási körülményekből eredő keresztszennyeződés lehetőségét nem zárja ki.</p>
                <p>A fogyasztás saját egészségi állapot és esetleges ételérzékenység figyelembevételével történik. Ez a tájékoztatás nem mentesíti a Szolgáltatót a termékfelelősségről szóló 1993. évi X. törvény szerinti kötelező felelőssége alól.</p>
              </div>
            </section>

            <section id="adatkezeles" className="scroll-mt-28">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">II. Adatkezelési Tájékoztató (GDPR)</h2>

              <div className="mb-6">
                <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">1. Kezelt adatok és célok</h3>

                <h4 className="font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">A) Vásárlási folyamat (Click &amp; Collect)</h4>
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                      <tr>
                        <th className="px-4 py-2 border dark:border-gray-700">Adat</th>
                        <th className="px-4 py-2 border dark:border-gray-700">Cél</th>
                        <th className="px-4 py-2 border dark:border-gray-700">Jogalap</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-2 border dark:border-gray-700 font-medium">Név, e-mail cím</td>
                        <td className="px-4 py-2 border dark:border-gray-700">Rendelés azonosítása, visszaigazolás küldése</td>
                        <td className="px-4 py-2 border dark:border-gray-700">GDPR 6. cikk (1) b) – szerződés teljesítése</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border dark:border-gray-700 font-medium">Számlázási cím (irányítószám, város, utca, házszám)</td>
                        <td className="px-4 py-2 border dark:border-gray-700">Számlakiállítás</td>
                        <td className="px-4 py-2 border dark:border-gray-700">GDPR 6. cikk (1) c) – jogi kötelezettség (2000. évi C. törvény)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm mb-4">Az adatok bekérésekor a Vásárló tudomásul veszi, hogy azokat a Szolgáltató a fenti célokra kezeli. Részletes tájékoztatás: jelen dokumentum II. fejezete, valamint a <Link href="/adatkezeles" className="text-[#0B5D3F] hover:underline">rosti.hu/adatkezeles</Link> oldalon elérhető Adatkezelési Tájékoztató.</p>

                <h4 className="font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">B) Kóstoló regisztráció</h4>
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                      <tr>
                        <th className="px-4 py-2 border dark:border-gray-700">Adat</th>
                        <th className="px-4 py-2 border dark:border-gray-700">Cél</th>
                        <th className="px-4 py-2 border dark:border-gray-700">Jogalap</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-2 border dark:border-gray-700 font-medium">Név, e-mail cím</td>
                        <td className="px-4 py-2 border dark:border-gray-700">Kóstolójegy azonosítása és digitális küldése</td>
                        <td className="px-4 py-2 border dark:border-gray-700">GDPR 6. cikk (1) b) – a kóstolási részvétel feltételeinek teljesítése</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border dark:border-gray-700 font-medium">Név, e-mail cím (csak önkéntes marketing hozzájárulás esetén)</td>
                        <td className="px-4 py-2 border dark:border-gray-700">A Szolgáltató saját Rosti irodai / munkahelyi prémium zöldség-smoothie programjával kapcsolatos e-mailes tájékoztatás és ajánlatküldés</td>
                        <td className="px-4 py-2 border dark:border-gray-700">GDPR 6. cikk (1) a) – önkéntes hozzájárulás</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm">A „Rosti irodai / munkahelyi prémium zöldség-smoothie program” a Szolgáltató vállalati partnerek részére nyújtott, munkahelyi fogyasztásra szánt smoothie-ajánlatait és kapcsolódó ajánlatkéréseit jelenti.</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">2. A kóstolóhoz kapcsolódó checkboxok szövege (a digitális felületen)</h3>
                <p className="mb-2"><strong>Önkéntes marketing checkbox:</strong><br />„Hozzájárulok, hogy e-mailben értesítést kapjak a <a href="#munkaltatoi-program" className="text-[#0B5D3F] hover:underline">Rosti irodai / munkahelyi prémium zöldség-smoothie programról</a>. A hozzájárulásom bármikor visszavonható.”</p>
                <p className="mb-2"><strong>Kötelező checkbox a kóstolóhoz:</strong><br />„Elolvastam és elfogadom a Nyílt Nap Szabályzatát, és tudomásul veszem az Adatkezelési Tájékoztatót.”</p>
                <p>A marketing hozzájárulás megadása nem feltétele a kóstolójegy igénylésének. A „Kérem a kóstolójegyem!” gomb kizárólag a kötelező checkbox bepipálásától és a név + e-mail cím megadásától függ; az önkéntes marketing checkbox állapota ezt nem befolyásolja.</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">3. Utókövetés (kizárólag az önkéntes marketing checkbox megjelölése esetén)</h3>
                <p className="mb-2">A Szolgáltató a hozzájárulást adó résztvevőnek kizárólag e-mail csatornán, a hozzájárulás megadásától számított 365 napon belül összesen 3–4 alkalommal küld megkeresést az alábbi tervezett ütemezés szerint:</p>
                <ul className="list-disc pl-5 space-y-4 mb-2">
                  <li>1. levél: 2026. augusztus vége – szeptember eleje,</li>
                  <li>2. levél: 2026. november,</li>
                  <li>3. levél: 2027. január,</li>
                  <li>4. levél: 2027. február vége – március eleje.</li>
                </ul>
                <p className="mb-2">A megkeresések tartalma: a Szolgáltató saját Rosti irodai / munkahelyi prémium zöldség-smoothie programjára vonatkozó tájékoztatás és ajánlat.</p>
                <p>Telefonos megkeresésre, valamint harmadik fél részére történő adatátadásra marketing célból nem kerül sor.</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">4. Adatkezelés időtartama</h3>
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                      <tr>
                        <th className="px-4 py-2 border dark:border-gray-700">Adatkör</th>
                        <th className="px-4 py-2 border dark:border-gray-700">Megőrzési idő</th>
                        <th className="px-4 py-2 border dark:border-gray-700">Alap</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-2 border dark:border-gray-700 font-medium">Számlázási adatok (név, cím)</td>
                        <td className="px-4 py-2 border dark:border-gray-700">8 év</td>
                        <td className="px-4 py-2 border dark:border-gray-700">2000. évi C. törvény 169. §</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border dark:border-gray-700 font-medium">Marketing hozzájáruláshoz kapcsolódó adatok</td>
                        <td className="px-4 py-2 border dark:border-gray-700">A hozzájárulás visszavonásáig, de legfeljebb 365 napig</td>
                        <td className="px-4 py-2 border dark:border-gray-700">GDPR 5. cikk (1) e)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border dark:border-gray-700 font-medium">Kóstolóregisztrációs adatok (marketing hozzájárulás nélkül)</td>
                        <td className="px-4 py-2 border dark:border-gray-700">A rendezvény napját követő 30. napon törlésre kerülnek</td>
                        <td className="px-4 py-2 border dark:border-gray-700">GDPR 5. cikk (1) e) – tárolási korlát elve</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">5. Adattovábbítás és adatfeldolgozók</h3>
                <p className="mb-2">Az adatokat a Szolgáltató biztonságos szervereken tárolja. Az alábbi adatfeldolgozókkal a Szolgáltató a GDPR 28. cikke szerinti adatfeldolgozói szerződést kötött:</p>
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                      <tr>
                        <th className="px-4 py-2 border dark:border-gray-700">Adatfeldolgozó</th>
                        <th className="px-4 py-2 border dark:border-gray-700">Tevékenység</th>
                        <th className="px-4 py-2 border dark:border-gray-700">Székhely</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-2 border dark:border-gray-700 font-medium">Stripe Payments Europe, Ltd.</td>
                        <td className="px-4 py-2 border dark:border-gray-700">Fizetési tranzakció feldolgozása</td>
                        <td className="px-4 py-2 border dark:border-gray-700">Dublin, Írország</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border dark:border-gray-700 font-medium">KBOSS.hu Kft. (MostSzámlázz.hu)</td>
                        <td className="px-4 py-2 border dark:border-gray-700">Számlázás</td>
                        <td className="px-4 py-2 border dark:border-gray-700">Magyarország</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border dark:border-gray-700 font-medium">Veingartner Ágnes E.V.</td>
                        <td className="px-4 py-2 border dark:border-gray-700">Könyvelés (számlázási adatokhoz korlátozott hozzáféréssel)</td>
                        <td className="px-4 py-2 border dark:border-gray-700">8412 Veszprém, Posta utca 58.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>A személyes adatok főszabály szerint az Európai Gazdasági Térségen belül kerülnek kezelésre. A Stripe fizetési szolgáltatás használata esetén ugyanakkor előfordulhat, hogy bizonyos személyes adatok megfelelő garanciák mellett az EGT-n kívüli országokba is továbbításra kerülnek. Ilyen garancia lehet különösen az Európai Bizottság által elfogadott Standard Contractual Clauses (SCC), illetve – ahol alkalmazható – az EU–USA Data Privacy Framework.</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">6. Az érintett jogai és jogérvényesítés</h3>
                <p className="mb-2">Az érintett bármikor jogosult:</p>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li>hozzáférni a kezelt adataihoz (GDPR 15. cikk),</li>
                  <li>kérni azok helyesbítését (GDPR 16. cikk),</li>
                  <li>kérni azok törlését (GDPR 17. cikk),</li>
                  <li>visszavonni az önkéntes marketing hozzájárulást; a visszavonás a jövőre nézve hatályos, és nem érinti a visszavonás előtti adatkezelés jogszerűségét (GDPR 7. cikk (3)),</li>
                  <li>kérni az adatkezelés korlátozását (GDPR 18. cikk),</li>
                  <li>tiltakozni az adatkezelés ellen (GDPR 21. cikk), ha annak jogalapja ezt lehetővé teszi.</li>
                </ul>
                <p className="mb-4"><strong>Joggyakorlás:</strong> <a href={`mailto:${EMAIL}`} className="text-[#0B5D3F] hover:underline font-bold">{EMAIL}</a> e-mail címen, vagy a kiküldött marketing levelek alján található leiratkozó linken.</p>
                <p className="mb-2"><strong>Panasz esetén az érintett a Nemzeti Adatvédelmi és Információszabadság Hatósághoz (NAIH) fordulhat:</strong></p>
                <p>
                  <strong>Cím:</strong> 1055 Budapest, Falk Miksa utca 9-11.<br />
                  <strong>E-mail:</strong> <a href="mailto:ugyfelszolgalat@naih.hu" className="text-[#0B5D3F] hover:underline font-bold">ugyfelszolgalat@naih.hu</a><br />
                  <strong>Web:</strong> <a href="http://www.naih.hu" target="_blank" rel="noopener noreferrer" className="text-[#0B5D3F] hover:underline font-bold">www.naih.hu</a>
                </p>
              </div>
            </section>

            <section id="munkaltatoi-program" className="scroll-mt-28">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">III. Rosti munkahelyi prémium zöldség-smoothie program</h2>

              <div className="mb-6">
                <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">1. Rosti munkahelyi prémium zöldség-smoothie program összefoglaló</h3>
                <p className="mb-2">A Rosti munkahelyi prémium zöldség-smoothie program a Rosti céges, irodába rendelt zöldség-smoothie szolgáltatása. A programban hűtve szállított, frissen készített italokat kínálunk vállalati partnereknek, jellemzően hétfőn vagy kedden, előre egyeztetett időablakban, valamint nagyobb céges rendezvényekre is.</p>
                <p>Ha szeretnél róla értesítést kapni, a hozzájárulásod alapján e-mailben írunk neked erről a programról és a kapcsolódó ajánlatokról.</p>
              </div>
            </section>
          </div>
        </div>

        {/* CTA */}
        <div className="py-10 flex flex-col items-center text-center">
          <Link href="/nyiltnap" className="group flex flex-col sm:flex-row items-center gap-4">
            <button className="flex items-center gap-2 bg-[#0B5D3F] text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg group-hover:bg-[#147A55] group-hover:shadow-[#0B5D3F]/20 group-hover:scale-105">
              <span>RENDELEK A NYÍLT NAPRA</span>
              <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
            </button>
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
