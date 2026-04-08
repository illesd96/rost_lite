'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Download } from 'lucide-react';
import { SiteNavbar } from '@/components/ui/site-navbar';

export default function AszfPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <SiteNavbar />

      <main className="pt-28 pb-12 flex-grow">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">ÁLTALÁNOS SZERZŐDÉSI FELTÉTELEK</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">a Rosti B2B online felületének használatához<br />(2026. április 2. napjától hatályos)</p>
            </div>
            <a
              href="/documents/ROSTI – ÁSZF.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#0B5D3F] hover:text-white transition-all shadow-sm shrink-0"
            >
              <Download size={14} strokeWidth={2.5} />
              PDF letöltés
            </a>
          </div>

          <div className="space-y-8 leading-relaxed text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">1. A Szolgáltató adatai</h2>
              <p className="mb-4">A Webáruházat (Rosti) üzemeltető és a szolgáltatást nyújtó vállalkozás adatai:</p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li><strong>Cégnév:</strong> DAB Tanácsadó Korlátolt Felelősségű Társaság (rövidített név: DAB Tanácsadó Kft.)</li>
                <li><strong>Székhely:</strong> 8200 Veszprém, Egry József utca 27. 1. em. 7. ajtó</li>
                <li><strong>Cégjegyzékszám:</strong> 19-09-524323</li>
                <li><strong>Adószám:</strong> 14114649-2-19</li>
                <li><strong>Statisztikai szám:</strong> 14114649-7020-113-19</li>
                <li><strong>Nyilvántartó bíróság:</strong> Veszprémi Törvényszék Cégbírósága</li>
                <li><strong>Hivatalos céges e-mail cím:</strong> <a href="mailto:dab.tanacsado.kft@gmail.com" className="text-[#0B5D3F] hover:underline font-bold">dab.tanacsado.kft@gmail.com</a></li>
                <li><strong>Megrendelésekkel és ügyfélszolgálattal kapcsolatos e-mail cím:</strong> <a href="mailto:rendeles@rosti.hu" className="text-[#0B5D3F] hover:underline font-bold">rendeles@rosti.hu</a></li>
              </ul>
              <p className="mb-2"><strong>A kereskedelmi és vendéglátó tevékenységhez kapcsolódó hatósági adatok:</strong></p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Engedélyezett tevékenység végzésének helye:</strong> 2040 Budaörs, Patkó utca 1. fszt., 1036/5/A/100 hrsz.</li>
                <li><strong>Üzlet elnevezése:</strong> DAB Smoothie Kitchen</li>
                <li><strong>Üzlettípus és látogatási rend:</strong> Alkoholmentes italokra specializálódott vendéglátóhely (kávézó). Helyben fogyasztásra, valamint előzetes online megrendelés nélküli, utcai (eseti) vásárlásra semmilyen formában nincs lehetőség. A telephely zárt logisztikai és átadópontként működik.</li>
                <li><strong>Nyitvatartás:</strong> vasárnap: 19:00-21:00, hétfő: 19:00-21:00, szerda-szombat: zárva</li>
                <li><strong>Kereskedelmi nyilvántartási szám (OKNYIR):</strong> 372037/B/1</li>
                <li><strong>Jegyző által kiadott nyilvántartási szám:</strong> 5264</li>
                <li><strong>FELIR azonosító:</strong> AB4683248</li>
                <li><strong>NTAK regisztrációs szám:</strong> ΚΑ25115163</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">2. Alapvető rendelkezések és a Fogyasztók kizárása</h2>
              <p className="mb-2">2.1. A Szolgáltató a Webáruházban kínált prémium italokat és szolgáltatásokat kizárólag szakmája, önálló foglalkozása vagy üzleti tevékenysége körében eljáró személyek és szervezetek (a továbbiakban: Vállalkozás vagy Megrendelő) részére értékesíti.</p>
              <p className="mb-2">2.2. A Megrendelő a várólistára történő jelentkezéssel, illetve a megrendelés leadásával kifejezetten nyilatkozik és szavatolja, hogy a szerződéskötés során nem minősül a Polgári Törvénykönyvről szóló 2013. évi V. törvény (Ptk.) 8:1. § (1) bekezdés 3. pontja szerinti fogyasztónak.</p>
              <p>2.3. Erre tekintettel a felek közötti jogviszonyra nem alkalmazandóak a fogyasztó és a vállalkozás közötti szerződések részletes szabályairól szóló 45/2014. (II. 26.) Korm. rendelet rendelkezései, így a Megrendelőt nem illeti meg az indokolás nélküli elállás joga, továbbá nem fordulhat Békéltető Testülethez.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">3. A Szerződéskötés és a Regisztráció folyamata</h2>
              <p className="mb-2"><strong>3.1. Várólista és Kapcsolatfelvétel:</strong> A Szolgáltató prémium, kézműves termékeket forgalmaz, így a magas minőség garantálása érdekében a vásárlói közösséget fokozatosan bővíti. A Webáruházban történő vásárlás előzetes regisztrációhoz kötött, nyílt regisztrációra nincs lehetőség. Az érdeklődő Vállalkozások a Szolgáltató weboldalán található űrlap kitöltésével (cég neve, kapcsolattartó neve, e-mail címe, telefonszáma, szállítási cím, irodai dolgozók átlagos létszáma, tervezett palackmennyiség alkalmanként) vagy e-mail útján jelentkezhetnek a várólistára. Az űrlap elküldésével az érdeklődő elfogadja a Szolgáltató Adatkezelési Tájékoztatóját.</p>
              <p className="mb-2"><strong>3.2. Felhasználói fiók létrehozása:</strong> A Szolgáltató a jelentkezéseket egyedileg bírálja el, és fenntartja a jogot a csatlakozási kérelem indokolás nélküli elutasítására. Sikeres elbírálás és/vagy direkt értékesítési (direct sales) megállapodás esetén a Szolgáltató hozza létre a Vállalkozás felhasználói fiókját. A fiókhoz a Szolgáltató hozzáférést biztosít a Vállalkozás kapcsolattartója részére, aki az első belépéssel kifejezetten elfogadja a jelen ÁSZF rendelkezéseit.</p>
              <p><strong>3.3. Minimum rendelési mennyiség és kapacitás:</strong> A Szolgáltató a megrendelések teljesítését minimális rendelési mennyiséghez (alapértelmezetten 20 db termék) köti, melyről a Webáruház felületén ad pontos tájékoztatást. A Szolgáltató fenntartja a jogot, hogy alapanyaghiány vagy kapacitáshiány esetén a már leadott és kifizetett megrendelést is indokolás nélkül visszautasítsa. Ilyen esetben a Szolgáltató a Megrendelőt haladéktalanul értesíti, és a teljes vételárat levonások nélkül visszatéríti.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">4. A Felhasználó kötelezettségei és a Fiók biztonsága</h2>
              <p className="mb-2">4.1. A Megrendelő köteles a regisztráció és a megrendelések során a valóságnak megfelelő adatokat megadni. A létrehozott felhasználói fiókhoz tartozó belépési adatok titokban tartása a Megrendelő kizárólagos felelőssége.</p>
              <p>4.2. A Szolgáltató minden olyan megrendelést, amelyet a Megrendelő fiókjából adtak le, a Megrendelő által jogszerűen megtett jognyilatkozatnak tekint. A Szolgáltató kizárja a felelősségét minden olyan kárért, amely a jelszó illetéktelen személyek általi felhasználásából ered.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">5. Fizetési feltételek</h2>
              <p className="mb-2"><strong>5.1. Online bankkártyás fizetés:</strong> A Webáruházon keresztül leadott rendelések ellenértékének kiegyenlítése főszabály szerint – a rendelés véglegesítésének feltételeként – előre, online bankkártyás fizetéssel történik. Utólagos bankkártyás, illetve előzetes vagy utólagos készpénzes fizetésre a Szolgáltató nem biztosít lehetőséget.</p>
              <p><strong>5.2. Egyedi fizetési megállapodás:</strong> A Szolgáltató kizárólag előzetes, írásbeli megállapodás és egyedi elbírálás alapján, kivételes esetekben biztosíthat lehetőséget banki átutalással történő fizetésre. Ez a fizetési mód a Webáruház felületén alapértelmezetten nem választható opció.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">6. Szállítási feltételek és Kárveszély</h2>
              <p className="mb-2"><strong>6.1. Kiszállítás:</strong> A megrendelt termékek kiszállítását a Szolgáltató saját hűtött gépjárműveivel (vagy megbízott partnere útján) végzi munkanapokon 08:00 és 14:00 óra között, biztosítva a termékek megfelelő hőmérsékletét. A pontosabb szállítási intervallumról a Szolgáltató elektronikus úton nyújt tájékoztatást.</p>
              <p className="mb-2"><strong>6.2. Mennyiségi és minőségi átvétel:</strong> A Megrendelő köteles a kiszállított termékeket az átvételkor a Szolgáltató munkatársának jelenlétében azonnal ellenőrizni. Amennyiben az áru láthatóan sérült, a Megrendelő köteles ezt a tényt az átvételkor a kísérőokmányon rögzíteni, amelyet a Szolgáltató munkatársa aláírásával igazol.</p>
              <p className="mb-2"><strong>6.3. Rejtett hibák:</strong> A nem látható, rejtett sérüléseket a Megrendelő legkésőbb az átvételt követő 24 órán belül köteles írásban, részletes leírással és a sérülést igazoló fényképekkel együtt a Szolgáltató 1. pontban megadott ügyfélszolgálati e-mail címére bejelenteni. A határidőn túli, vagy a kísérőokmányon átvételkor nem rögzített látható sérülésekből eredő reklamációkat a Szolgáltató nem köteles elfogadni.</p>
              <p className="mb-2"><strong>6.4. Meghiúsult kézbesítés:</strong> A termékek kizárólag nyers, friss összetevőkből álló, rendkívül romlandó jellegére tekintettel a Szolgáltató a kiszállítást az adott címre csak egy alkalommal kísérli meg. Amennyiben a kézbesítés a Megrendelő érdekkörében felmerülő okból (pl. zárt ajtó, elérhetetlen kapcsolattartó, téves cím) meghiúsul, a megrendelés teljesítettnek minősül. Ebben az esetben a romlandó áru megsemmisítésre kerül, a Szolgáltató ismételt kiszállítást nem vállal, és a Megrendelő a vételár visszatérítésére nem jogosult.</p>
              <p><strong>6.5. Hűtve szállítás és tárolás (2–4 °C):</strong> A Szolgáltató a termékek megfelelő hőmérsékletét kizárólag az átadás időpontjáig szavatolja. Mivel a termékek nyers, hőkezelés nélküli italok, az átvételt követően, egészen a fogyasztásig a hűtés folyamatos fenntartása és a termékek szigorúan 2–4 °C közötti tárolása a Megrendelő kizárólagos felelőssége. A Szolgáltató nem vállal felelősséget semmilyen olyan minőségromlásért vagy egészségügyi panaszért, amely az átadást követő helytelen (nem kellően hűtött) tárolásból, vagy a termék nyitva hagyásából ered.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">7. Göngyöleg és Visszaváltási Rendszer (DRS)</h2>
              <p>A Szolgáltató kijelenti, hogy jelenleg csekély mennyiségű kibocsátónak (legfeljebb 5000 db/év) minősül, így a 450/2023. (X. 4.) Korm. rendelet alapján az általa forgalomba hozott italtermékek csomagolása nem tartozik a kötelező visszaváltási díjas rendszer (DRS) hatálya alá. Ennek megfelelően a Szolgáltató termékei után visszaváltási díj nem kerül felszámításra, és a Szolgáltató az üres palackok visszaváltására sem kötelezett.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">8. Felelősségkorlátozás és Vis Maior</h2>
              <p className="mb-2"><strong>8.1. Felelősségkorlátozás:</strong> A B2B értékesítés jellegéből fakadóan a Szolgáltató a jogszabályok által megengedett legteljesebb mértékben kizárja a felelősségét az esetleges informatikai fennakadásokból eredő károkért. A Szolgáltató semmilyen esetben sem felel a Megrendelőnél a termékek esetleges késedelmes szállításából vagy a teljesítés elmaradásából eredő elmaradt haszonért vagy közvetett károkért. A Szolgáltató kártérítési felelőssége legfeljebb a vitatott megrendelés ellenértékének összegéig terjed.</p>
              <p className="mb-2"><strong>8.2. Vis Maior:</strong> Egyik fél sem vonható felelősségre kötelezettségeinek nem teljesítéséért, amennyiben azt Vis Maior esemény (pl. természeti katasztrófa, szélsőséges időjárás, közlekedési akadály, sztrájk, hatósági intézkedés, áramszünet) okozza. A teljesítési határidők a Vis Maior esemény időtartamával meghosszabbodnak.</p>
              <p><strong>8.3. Összetevők, allergének és fogyasztás:</strong> A Szolgáltató a termékek állandó allergénjeiről (pl. zeller) a palackok címkéjén nyújt tájékoztatást. Az esetlegesen változó, aktuális friss zöldség-összetevők pontos listája a termék címkéjén található QR-kód beolvasásával, a www.rosti.hu/osszetevok oldalon ismerhető meg. Mivel a Szolgáltató a végfelhasználókkal (a Megrendelő alkalmazottaival) nincs közvetlen kapcsolatban, a termékek egyéni ételérzékenység vagy allergia figyelembevételével történő elfogyasztása, valamint a címkén szereplő utasítások (felbontás előtti felrázás, rögtöni elfogyasztás) betartása kizárólag a végfelhasználó felelőssége. Az ebből eredő egészségügyi problémákért a Szolgáltató a felelősségét teljes körűen kizárja.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">9. A Szerződés módosítása és Fiók törlése</h2>
              <p className="mb-2"><strong>9.1. Egyoldalú módosítás joga:</strong> A Szolgáltató jogosult a jelen ÁSZF-et, a Webáruházban kínált termékek körét és vételárát bármikor egyoldalúan módosítani. A módosításokat a Webáruház felületén közzéteszi. A módosítások a már visszaigazolt megrendeléseket nem érintik. A Webáruház módosítás utáni használata az új ÁSZF elfogadásának minősül.</p>
              <p><strong>9.2. Fiók törlése:</strong> A Megrendelő jogosult fiókjának törlését bármikor írásban kérelmezni. A Szolgáltató jogosult a Megrendelő fiókját azonnali hatállyal törölni, amennyiben a Megrendelő megsérti a jelen ÁSZF rendelkezéseit, fizetési késedelembe esik, vagy valótlan adatokat ad meg.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">10. Panaszkezelés és Jogvita</h2>
              <p className="mb-2"><strong>10.1. Panaszok:</strong> A Megrendelő a Szolgáltatással kapcsolatos kifogásait írásban, a Szolgáltató ügyfélszolgálati elektronikus elérhetőségén terjesztheti elő. A Szolgáltató a panaszt 15 napon belül érdemben megválaszolja.</p>
              <p><strong>10.2. Jogvita (Bírósági kikötés):</strong> A felek az esetleges vitás kérdéseket elsődlegesen békés úton rendezik. Amennyiben ez nem vezet eredményre, a felek – a B2B jogviszonyra tekintettel – kikötik a Szolgáltató székhelye szerint illetékes, hatáskörrel rendelkező bíróság (Veszprémi Járásbíróság vagy Veszprémi Törvényszék) kizárólagos illetékességét.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">11. Vegyes rendelkezések</h2>
              <p>A jelen ÁSZF-ben és az egyedi megrendelésekben nem szabályozott kérdésekben a magyar jog, különösen a Polgári Törvénykönyvről szóló 2013. évi V. törvény (Ptk.) vállalkozások közötti (B2B) szerződésekre vonatkozó rendelkezései az irányadók.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">12. Rendelések módosítása és lemondása</h2>
              <p className="mb-2"><strong>12.1. Egyedi gyártás:</strong> A Megrendelő tudomásul veszi, hogy a Szolgáltató a termékeket (Rostik) nem raktárkészletről értékesíti. Minden rendelés egyedi, azok gyártása közvetlenül a kiszállítást megelőzően, frissen beszerzett alapanyagokból történik.</p>
              <p className="mb-2"><strong>12.2. Lemondási és módosítási határidő:</strong> Tekintettel a friss alapanyagok beszerzési rendjére, a leadott és visszaigazolt megrendelések módosítására vagy lemondására a Megrendelőnek legkésőbb a vállalt kiszállítási napot megelőző utolsó munkanap 15:00 óráig van lehetősége.</p>
              <p className="mb-2"><strong>12.3. Ünnepnapok és munkaszüneti napok:</strong> Amennyiben a kiszállítás napját megelőző nap munkaszüneti napra esik, a lemondási határidő az azt megelőző legutolsó olyan munkanap 15:00 órája, amikor a Szolgáltató az alapanyag-rendeléseit a beszállítók felé véglegesíti.</p>
              <p className="mb-2"><strong>12.4. A lemondás módja:</strong> A módosítási vagy lemondási igényt minden esetben írásban, a <a href="mailto:rendeles@rosti.hu" className="text-[#0B5D3F] hover:underline font-bold">rendeles@rosti.hu</a> e-mail címen kell jelezni. A lemondás a Szolgáltató írásos visszaigazolásával válik érvényessé.</p>
              <p className="mb-2"><strong>12.5. Késedelmes lemondás:</strong> A fenti határidőt (utolsó munkanap 15:00) követően a Szolgáltató a nyersanyagrendelést lezártnak, a gyártási folyamatot pedig megkezdettnek tekinti. Ezt követően a lemondást nem áll módunkban elfogadni, a Megrendelő a teljes vételár és a szállítási díj megfizetése alól nem mentesül.</p>
              <p><strong>12.6. Visszatérítés:</strong> Határidőn belüli lemondás esetén a vételár visszajár. A Megrendelő kifejezetten tudomásul veszi, hogy a visszatérítés összege a tranzakciókkal kapcsolatban a Szolgáltatónál ténylegesen felmerült, vissza nem téríthető pénzügyi költségekkel – így különösen a fizetési szolgáltató (pl. Stripe) által felszámított jutalékkal, valamint banki visszautalás esetén a számlavezető bank által felszámított utalási díjjal és tranzakciós illetékkel – csökkentett összeg.</p>
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
