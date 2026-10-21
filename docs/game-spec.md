Du skal bygge et mobilvennlig fantasyspill for å lære den lille gangetabellen.

Denne prompten inneholder hele spesifikasjonen for førsteversjonen og en faseplan. Les alt før du begynner, men implementer KUN FASE 1 nå. De senere fasene er kontekst for arkitektur og videre utvikling.

Ikke stopp ved forslag eller planlegging. Implementer fase 1, verifiser den og lever en spillbar versjon.

## 1. Arbeidsmåte

- Les eksisterende prosjektinstruksjoner og undersøk kodebasen først.
- Behold fungerende kode som passer spesifikasjonen.
- Hvis prosjektet er tomt, opprett nødvendig prosjektstruktur.
- Ta rimelige, reversible valg uten å spørre om små detaljer.
- Lagre denne samlede spesifikasjonen i docs/game-spec.md.
- Lagre faseplan og faktisk status i docs/implementation-plan.md.
- Ved konflikt med eldre spillbeskrivelser gjelder denne spesifikasjonen.
- Ikke implementer senere faser før jeg ber om det.
- Ikke installer eller bruk Phaser sine AI-verktøy. Bruk Phaser som bibliotek i prosjektet.

## 2. Spillidé

Spilleren lager sin egen helt, trener gjennom gangestykker og kjemper mot monstre.

Inspirasjon:
- Swords & Souls: treningsplass, karakterutvikling og arena.
- Swords and Sandals: personlig helt, synlig utstyr, egenskapsvalg og dueller.

Lag egne figurer og eget uttrykk, uten kopierte ressurser.

Gangestykkene er spillets hovedkontroll:
- Riktig svar i trening utløser et angrep mot en dummy.
- Trening gir etter hvert XP og nivåer.
- Riktig svar i arena utløser et angrep mot motstanderen.
- Fienden angriper regelmessig.
- Raske svar gir flere angrep.
- Langsommere spillere kan trene helten sterkere og gjøre mer skade per riktig svar.

Dette er et morsommere alternativ til pugging. Målet er at barnet får lyst til å løse flere gangestykker fordi helten blir sterkere og spillet gir tilfredsstillende respons.

Ingen passiv fremgang eller offlineinntekt.

## 3. Langsiktig retning

Spillet skal senere kunne få:
- Stadig vanskeligere fiender, arenaer og bosser.
- Butikk med nye våpen og rustninger.
- Utstyrsnivåer som kan fortsette å stige.
- Nye egenskaper, eksempelvis Dexterity for bue.
- Spesialangrep og våpenegenskaper.
- Synlig utstyr på helten.
- Genererte, pompøse våpennavn og humoristiske beskrivelser.

Eksempel på tone:
«Den ultimate, katastrofalt overlegne infernoklingen»
«Smidd i en døende stjerne. Egner seg også til toast.»

Heltesiden skal etter hvert være et troférom der det er gøy å se egen figur, utstyr og høye tall.

Spilleren skal ha et nært mål og noe større å strekke seg etter. Ikke vis falske belønninger eller funksjonsløse knapper for innhold som ikke finnes.

Disse fremtidige systemene skal IKKE bygges nå. Unngå overkomplisert arkitektur for hypotetiske behov.

## 4. Teknologi

Bruk:
- TypeScript.
- React til menyer, helteside, oppgavefelt og talltastatur.
- Phaser til spillscener, figurer, angrep og effekter.
- Vite hvis prosjektet ikke allerede har et passende oppsett.

Velg kompatible, stabile pakkeversjoner og lås avhengighetene.

Spillet skal kjøre i nettleseren, med mobil som hovedplattform. Mulighet for senere appinnpakning skal ikke føre til ekstra appteknologi nå.

Ingen backend, konto, betaling eller eksterne AI-kall.

## 5. Arkitektur

Hold følgende adskilt:
- Spilltilstand.
- Oppgavegenerering og svarbehandling.
- Progresjon og egenskaper.
- Kampregler og tidtaking.
- Rendering og animasjoner.
- Lagring.

Implementer modulene når fasen trenger dem. Ikke lag tomme rammeverk for alt fremtidig innhold.

Ha én autoritativ spilltilstand. React og Phaser skal ikke ha konkurrerende kopier av verdiene.

Samle balansetall og animasjonstider i en konfigurasjon.

Bruk tydelige tilstander for oppgaven:
- Venter på svar.
- Viser riktig svar.
- Viser første feil.
- Viser andre feil.
- Viser fasit og venter på «Neste».

Gi hver oppgave en egen identitet, også når samme regnestykke trekkes to ganger på rad.

Belønninger og angrep skal utløses én gang fra svarbehandlingen. Animasjonenes fullføring skal ikke tildele nye belønninger.

Rydd opp Phaser-instanser, hendelseslyttere og tidtakere ved skjermbytte og remontering. Forsinkede hendelser fra en gammel scene skal ikke påvirke en ny scene.

## 6. Mobiloppsett: absolutt skille mellom kamp og regning

Trening og arena skal ha to klart adskilte områder.

ØVRE OMRÅDE – SPILLET:
- Helt og dummy eller monster.
- Angrep, magi og treffreaksjoner.
- Skadetall.
- Liv og fiendens angrepsmåler når arena implementeres.
- XP og neste mål når progresjon implementeres.

NEDRE OMRÅDE – REGNING:
- Gangestykket.
- Svarfelt.
- Tilbakemelding og fasit.
- Eget talltastatur.
- «Svar» eller «Neste».

Ingen elementer skal krysse skillet:
- Ingen skadetall i regneområdet.
- Ingen regnestykker som flyr opp til monsteret.
- Ingen kamppartikler over tastaturet.
- Kameraristing påvirker bare spillområdet.
- Regneanimasjoner påvirker bare oppgaven.
- Tastaturet og resten av oppsettet står stille.

Todelingen trenger ikke være 50/50. Gi regning og tastatur nødvendig plass og bruk resten til spillscenen.

Prioriter:
- Stående mobilskjerm.
- Store trykkflater, som utgangspunkt minst 44 × 44 CSS-piksler.
- God kontrast og tydelige tall.
- Fast plassering av oppgave og knapper.
- Ingen horisontal scrolling.
- Ingen vanlig skjermscrolling under spilling på typiske mobilskjermer.
- Tilgjengelige kontroller også på mindre skjermer.
- Håndtering av safe areas og varierende nettleserhøyde.

På PC brukes en sentrert spillflate.

## 7. Visuell stil og plassholdere

Lag en sjarmerende, fargerik fantasyverden med tydelige figurer og litt humor.

Helten skal ha:
- Gjenkjennelig hode, kropp, armer og bein.
- Litt overdrevne proporsjoner.
- Tydelig våpen.
- Enkel hvilebevegelse.
- En lesbar angrepsbevegelse.

Bruk egenprodusert, enkel 2D-grafikk. Ikke vent på eksterne bilder. Ikke representer figurene bare som firkanter eller grensesnittikoner.

Bruk en sammenhengende palett og en enkel treningsbakgrunn.

Bygg kropp og våpen som separate deler med faste festepunkter. Det skal senere være mulig å legge til hjelm og skjold.

Bruk samme visuelle figurdefinisjon i forhåndsvisning, på heltesiden og i trening/arena.

Ferdige bilder skal senere kunne erstatte plassholderne uten å endre spillreglene.

Prioriter spillfølelse og tydelig respons fremfor detaljert plassholdergrafikk.

## 8. Opprett helt

Spilleren velger:
- Navn, 1–20 tegn etter trimming.
- En av tre farger på klærne.

Vis stor forhåndsvisning av helten.

Etter opprettelse vises heltesiden.

I fase 1:
- Vis navn, figur, aktivt startvåpen og fast angrepsskade.
- Vis knappen «Tren».
- Behold helten i minnet ved navigasjon mellom helteside og trening.
- Ingen lagring ved omlasting ennå.
- Ikke vis arena, egenskapspoeng, XP eller gull før funksjonene er implementert.

Startvåpen:
«En pinne med ambisjoner»

Beskrivelse:
«Overbevist om at den en dag skal bli et legendarisk sverd.»

I fase 1 har helten Strength 5 og våpenet skade 3, totalt 8 skade.

## 9. Gangestykker og input

Trekk begge faktorene uavhengig og tilfeldig fra heltallene 1–10 for hver ny oppgave.

- Ingen stokket liste med alle 100 kombinasjonene.
- Ingen mestringstilpasning eller vekting.
- Samme oppgave kan komme flere ganger på rad.
- Ikke filtrer bort gjentakelser.
- Første feil beholder samme oppgave.

Eget talltastatur:
- Tall 0–9.
- Slett siste siffer.
- «Svar».
- Plass til opptil tre sifre.

Bruk ikke telefonens systemtastatur under spilling.

Støtt fysisk tastatur:
- Tall.
- Backspace.
- Enter.

Svaret sendes bare med «Svar» eller Enter, aldri automatisk mens spilleren skriver.

Tom innsending gjør ingenting og teller ikke som feil.

Normaliser svaret som et heltall. Unngå utilsiktet nettleser- eller skjemaoppførsel.

Feiltelleren gjelder bare den aktuelle oppgaven.

## 10. Respons på riktig og feil svar

Denne responsen er en sentral del av spillet og skal implementeres fullt i fase 1.

A. RIKTIG SVAR

Eksempel: Spilleren svarer 56 på 7 × 8.

- Vis hele likheten «7 × 8 = 56».
- Likheten vokser tydelig, blir grønn og får én kort glød eller lysimpuls.
- Bruk en størrelsespuls og et lite bekreftelsessymbol.
- Ingen gjentatt blinking.
- Hele likheten blir stående i cirka 1,2 sekunder.
- Deretter vises neste tilfeldige oppgave.
- Helten angriper samtidig øverst.
- Dummyen reagerer og viser skadetallet i øvre område.

Senere:
- Trening gir XP én gang.
- Arena gir ett angrep.

B. FØRSTE FEIL

- Oppgaven og det innskrevne svaret rister kort horisontalt og blir rødt.
- Vis et lite feilsymbol i tillegg til fargen.
- Etter cirka 0,35 sekunder fjernes feilsvaret.
- Oppgaven går tilbake til normal stil.
- Spilleren forsøker samme oppgave igjen.
- Ingen angrep eller belønning.
- Ingen tap av opptjent fremgang.

Behold det innskrevne feilsvaret i et separat svarfelt. Ikke sett det opp som en korrekt likhet med «=».

C. ANDRE FEIL

- Gjenta den korte røde risten.
- Fjern feilsvaret.
- La hele den korrekte likheten vokse rolig frem i grønt.
- Bruk en roligere effekt enn ved eget riktig svar.
- Ingen seiersglimt.
- Vis «Riktig svar».
- Likheten blir stående til spilleren trykker «Neste».
- Ingen angrep eller belønning.
- «Neste» starter en ny tilfeldig oppgave og nullstiller feiltelleren.

Under tilbakemelding:
- Sperr ny svarinnsending.
- Ikke kø gamle tastetrykk til neste oppgave.
- Håndter holdt Enter og gjentatte tastetrykk.
- Ved fasit kan et nytt Enter-trykk brukes som «Neste».
- Tastetrykket som sendte feilsvaret, må ikke også lukke fasiten.
- Tastaturet skal ikke flytte på seg når knapper endrer tilstand.

Respekter redusert bevegelse med enklere symbol- og fargerespons.

Alle tider skal være lette å justere i konfigurasjonen.

## 11. Treningsplass

Vis helten på én side og en treningsdummy på den andre.

- Ingen tidspress.
- Ingen skade på helten.
- Ingen tap.
- Riktig svar utløser et fysisk slag i fase 1.
- Dummyen rister eller vipper ved treff.
- Flytende skadetall vises bare i øvre område.
- Dummyen kan brukes ubegrenset og trenger ingen livsmåler.
- Tydelig vei tilbake til heltesiden.

I fase 1 er dette hele den spillbare løkken:
Lag helt → se helten → tren → få respons på svar → returner til helten.

## 12. Fase 2: progresjon, egenskaper, magi og lagring

Dette skal IKKE implementeres i fase 1.

Startverdier:
- Level: 1.
- Strength: 5.
- Magic: 5.
- Maks liv: 40.
- Gull: 0.
- Ubrukte egenskapspoeng: 0.

Hvert riktig svar i trening gir 10 XP.

XP til neste nivå:
50 + 20 × (nåværende nivå − 1).

Behold overskytende XP og støtt flere nivåøkninger fra én tildeling.

Hver nivåøkning gir ett egenskapspoeng.

Nivå gir ikke automatisk mer skade, egenskaper eller liv.

Ett poeng kan brukes på:
- Strength: +2.
- Magic: +2.
- Health: +10 maks liv.

Vis konkret effekt før valget tas. Ett poeng skal bare kunne brukes én gang.

Fullfør korrekt likhet før nivåfeiring og egenskapsvalg vises. Spilleren kan velge senere, og ubrukte poeng vises på heltesiden.

Heltesiden utvides med:
- Level og XP.
- Strength og Magic.
- Maks liv.
- Ubrukte poeng.
- Våpenvalg.
- Beregnet skade.

Ikke implementer samlet kampkrafttall nå.

Legg til gratis magivåpen:
«En kvist med stormannsgalskap»

Beskrivelse:
«Har foreløpig bare satt fyr på sine egne forventninger.»

Våpenskade: 3.
Skalerer med Magic.
Vis et magisk prosjektil ved riktig svar.

Skade:
- Nærkamp = Strength + våpenskade.
- Magi = Magic + våpenskade.
- Level legges aldri til skade.
- Strength påvirker ikke magisk skade.
- Magic påvirker ikke nærkampskade.

Våpenet angir som data hvilken egenskap det skalerer med, så Dexterity og bue senere kan legges til uten å skrive om hele systemet.

Ingen mana eller ammunisjon.

Vis et konkret nært treningsmål, for eksempel:
«4 riktige svar til nivå 3».
Beregn dette fra faktisk gjenstående XP.

Lagring:
- Versjonert og validert lokal lagring.
- Lagre navn, farge, level, XP, egenskaper, ubrukte poeng, aktivt våpen og gull.
- Lagre etter viktige endringer.
- Bevar fremgang ved omlasting.
- Håndter ødelagt eller utilgjengelig lagring uten krasj.
- Vis beskjed dersom fremgangen bare kan beholdes i den aktive økten.

## 13. Fase 3: første arenakamp

Dette skal IKKE implementeres i fase 1 eller 2.

Motstander:
«Gøran, den lettere fornærmede slimklumpen»

Introduksjon:
«Har aldri tapt en kamp han selv har ført statistikk over.»

Verdier:
- 80 liv.
- 6 skade per angrep.
- Ett angrep hvert femte sekund.
- 25 gull ved seier.

Vis introduksjon og «Start kamp». Kampen begynner ikke før spilleren starter den.

Spilleren og fienden starter med fullt liv. Første fiendeangrep kommer etter ett helt intervall.

- Riktig svar utløser ett angrep med valgt våpen.
- Arena gir gull ved seier, men ingen XP.
- Vis liv og fiendens angrepsmåler øverst.
- Fienden har fast styrke, uavhengig av heltens nivå.
- Ingen samlet tidsfrist.
- Våpen og egenskaper kan ikke endres midt i kampen.

Pause fiendens angrepsklokke mens spillstyrt tilbakemelding sperrer svarinput:
- Riktig svar vises.
- Feilrist vises.
- Fasit vises frem til «Neste».

Fortsett fra samme sted når input blir tilgjengelig. Ikke nullstill måleren, og ikke samle opp skjulte angrep.

Treffanimasjoner kan fullføres selv om angrepsklokken er pauset.

Ha manuell pause. Pause ved skjult fane og krev aktiv gjenopptakelse. Avsluttet tilbakemelding skal ikke oppheve manuell pause.

Ved seier:
- Avslutt kampreglene umiddelbart.
- Gi 25 gull nøyaktig én gang.
- La korrekt likhet fullføre visningen før resultatvisning.
- Vis seier og valg om omkamp eller retur.

Ved nederlag:
- Stopp kamp og svarbehandling.
- Behold all opptjent fremgang.
- Vis «Tren litt mer og prøv igjen!».
- Tilby trening eller nytt forsøk.

Omkamp nullstiller liv, oppgave, feilteller og kampklokke. Hver ny seier kan gi belønning én gang.

Bruk en entydig rekkefølge ved nesten samtidige angrep. Avsluttede kamper ignorerer senere hendelser.

En pågående kamp skal ikke lagres. Omlasting returnerer til heltesiden uten kampbelønning eller tap.

## 14. Fase 4: finpuss

Dette skal ikke implementeres før de foregående fasene er spillbare.

- Forbedre animasjoner og visuell sammenheng.
- Juster mobiloppsett etter testing.
- Legg eventuelt til enkle treff-, magi-, nivå- og seierslyder.
- Ha lyd av/på.
- Ingen tale eller bakgrunnsmusikk er nødvendig.
- Lyd må ikke blokkere spill eller skape feil ved nettleserrestriksjoner.
- Juster balanse og visningstider etter faktisk spilling.
- Kontroller hele løkken og overgangene mellom skjermene.

## 15. Verifisering for fase 1

Lag noen få meningsfulle tester for:
- Oppgavenes faktorer er heltall fra 1 til 10.
- Gjentatte identiske oppgaver er tillatt.
- Riktig svar gir én angrepshendelse.
- Første feil beholder oppgaven.
- Andre feil viser fasit og venter på «Neste».
- Feiltelleren nullstilles for ny oppgave.
- Input under tilbakemelding ikke lager ekstra handlinger.
- Tom innsending ikke teller som feil.

Test i nettleser dersom miljøet støtter det:
- Omtrent 390 × 844.
- Omtrent 360 × 640.
- PC.
- Fysisk tastatur og tilgjengelig touch-testing.
- 10 × 10 = 100.
- Lange heltenavn.
- Raske gjentatte trykk og holdt Enter.
- Gjentatt navigering inn og ut av trening.
- Ingen doble angrep eller gamle tidtakere.
- Ingen effekter som krysser skillet mellom spill og regning.
- Ingen flytting av tastaturet under tilbakemeldinger.

Kjør bygg og relevante tester. Oppgi ærlig hva som faktisk er verifisert.

Når senere faser implementeres, utvid testene for progresjon, skadeformler, poengfordeling, lagring, kampklokke, pause og engangsbelønninger.

## 16. Leveranse nå

Implementer KUN FASE 1:
- Prosjektoppsett.
- Opprett helt.
- Enkel helteside.
- Todelt treningsskjerm.
- Tilfeldige gangestykker.
- Eget talltastatur og fysisk tastatur.
- Alle tre svarreaksjonene.
- Ett startvåpen med faste verdier.
- Heltens angrep og dummyens treffreaksjon.
- Fungerende mobiloppsett.

Ikke bygg XP, nivåer, egenskapsvalg, magi, lagring, arena eller lyd ennå.

Lever en spillbar implementasjon med:
- Oppstartsinstruksjon.
- Kort oversikt over det som er bygget.
- Utførte tester.
- Eventuelle begrensninger.
- Hvor animasjonstider og andre konfigurasjonsverdier endres.
- Oppdatert faseplan.

Stopp etter fase 1, slik at jeg kan prøve spillfølelsen før vi fortsetter.

## Godkjent endring etter fase 2
Brukeren har endret våpenvalg til opprettelsessiden; det skal ikke kunne byttes på heltesiden. Nivåøkning skal vises grafisk uten å stoppe treningen eller åpne dialog. Dette overstyrer tidligere krav om nivådialog og våpenvalg på heltesiden.

## Implementert tillegg: fase 6 – arenarekке

Den opprinnelige arenaen er nå kamp 1 i en rekke på ti, definert i `src/enemies.ts`. Faste verdier erstatter aldri heltens faktiske stats. Fem sekunders angrepsintervall beholdes i alle kamper. Kamp 1 har fortsatt 80 liv, 6 skade og 25 gull. Butikkpriser, våpenskade og XP-regler er uendret.

Arena-knappen åpner oversikten; et kampkort åpner introduksjonen, og bare Start kamp starter klokken. Låste kamper avvises også av GameStore. Seier lagrer gull, beseirede ID-er og brukt bossbonus i én oppdatering. Neste motstander åpner introduksjonen. Omkamp gir full nullstilling og vanlig belønning. Ved tap beholdes all fremgang. Kamp 10 avslutter rekken med feiring; omkamp og vanlig navigasjon fortsetter.

Lagring versjon 3: `defeatedEnemies` og `claimedBossBonuses` sammen med eksisterende hero-data. Gamle versjoner hadde ikke seiershistorikk, så migreringen åpner bare kamp 1 og beholder alt annet. Validering beholder en sammenhengende rekke kjente seire og kjente registrerte bossutbetalinger; ukjente og ugyldige referanser gir reparasjonsvarsel. Aktive kamper lagres aldri.

Full bestilling finnes i `arena-progression-spec.md`. Faktiske verdier, modell og begrensninger finnes i `arena-balance.md`. Verifiserte flyter finnes i `verification.md`.

## Implementert tillegg: fase 7 – personlig helt

Bestillingen i character-spec.md er implementert. Karakterbyggeren bruker seks kosmetikkategorier og samme figurrigg som resten av spillet. Utseenderedigering er midlertidig frem til Lagre og endrer ingen spillverdier. Heltesiden har en poengbasert profil, fem varige pompøsitetstrinn og en deterministisk kort krønike. Bare registrerte seire gir bragdtekst.

Detaljerte regler, nivågrenser, bragdprioritet og lagringsversjon 4 er dokumentert i character-system.md. Rykteoppdatering fra trening utsettes til heltesiden; bossoppdatering vises i eksisterende seier. Byggeren kan scrolle, og spillhandlingene er faste nederst på mobilheltesiden. Eksisterende regne-, pause-, poeng- og balanseregler beholdes.

## Implementert tillegg: fase 8 – flere helter og fokusert butikk

Gjeldende tillegg er profiles-shop-spec.md. profiles-shop.md beskriver implementasjonen og lagringsformatet. Versjon 5 lagrer separate helteprofiler og sist valgt ID. Oppstart viser velgeren, og Bytt helt finnes på heltesiden. Gamle lagringsdata sikkerhetskopieres før migrering, med feilskjerm og ny prøve ved skrivefeil.

Butikkens tidligere frie kjøp av senere våpen erstattes av ett neste tilbud per serie basert på høyeste eide tier. Tidligere direktekjøp beholdes. Mitt utstyr viser egne våpen, og nye sparemål må være aktuelle tilbud. Ingen konto, sletting, nye våpen eller kampbalanse er innført.

## Fase 9 – spesialangrep og nivåemblem (21. oktober 2026)

Implementert lokalt. Ikke publisert. Fase 8 ble publisert separat på commit f927d0e816e718659340af15d14cc003460f2b8b.

Fem riktige svar på rad gir ett angrep med dobbel beregnet skade. Første feil bryter rekken straks; riktig andre forsøk starter på 1/5. Tom innsending og redigering endrer ingenting. Ny økt, omkamp, avslutning og heltebytte nullstiller. Pause og nivåbanner bevarer rekken. Logisk nullstilling skjer før den korte visningen av fem fulle segmenter. Skade og belønning beregnes bare i spillogikken; animasjonen kan ikke gi ekstra skade. Trening gir fortsatt 10 XP per riktig svar, arena gir samme gull og ingen XP.

Nærkamp har større sving og rekyl, magi har oppladning og større prosjektil. Begge viser ett SUPER-skadetall med det utstyrte våpenet. Effektene holder seg innen eksisterende svarpause. Måleren har reservert plass utenfor figurer, liv og regneområde. Redusert bevegelse bruker roligere statiske effekter; eksisterende lydinnstilling respekteres.

Heltesiden viser skjoldemblem sammen med XP og antall svar til neste nivå. Jern 1–4, bronse 5–9, sølv 10–19, gull 20–39 og magisk fra 40; både dekor og farger endres. Hele nivånummeret beholdes med tilpasset bredde og skrift. Nivåbanner stopper ikke trening. Ved retur feires høyeste nye nivå én gang per helt. Lagringsformat v6 legger til seenLevel; eldre profiler migreres med nåværende nivå allerede sett. Fremgang og øvrige profilfelt bevares.

Konfigurasjon i src/config.ts: special.threshold (5), special.multiplier (2), special.windup/projectile/impact/damageFloat og emblem.thresholds/celebration. Eksisterende timing styrer svarpause og måleroverganger. Presentasjon i SpecialMeter.tsx, LevelEmblem.tsx, SceneView.tsx og style.css. Spillregler i store.ts, migrering i storage.ts.

Balansen er beregnet på nytt i arena-balance.md: en feilfri femsvarsrekke gir totalt seks normale angreps skade, altså 20 prosent mer skade over en komplett rekke. Fiender, priser, XP og belønningssatser er uendret. Gøran med startvåpen krever ni feilfrie svar mot tidligere ti.

## Utvidelse: knusbare dukker og ti arenaer

Implementert 21. oktober 2026 etter expansion-spec.md. Bestillingen gir eksplisitt tillatelse til push på eksisterende main og produksjonsdeploy.

Trening har ti faste ranger med ni vanlige dukker og én eksamensdukke per rang. Sluttrangen gjentas. Første dukke har 64 liv; startskade 8 gir åtte vanlige treff eller sju feilfrie svar med spesial. Grunn-XP er fortsatt 10, knusebonus er maxHP/8. Overkill føres videre, også over ranggrenser; store angrep gir én samlet melding. Beregningen besøker høyst det avgrensede førstegangsinnholdet og hopper deretter hele sluttrangsykluser matematisk. Nivåøkninger beregnes fra eksisterende lineære XP-krav med en korrigert aritmetisk sum, slik at også store belønninger håndteres effektivt.

Hero.training lagrer rang, posisjon, gjenværende liv, antall knuste, største slag og én medalje per fullført rang. Aktiv dukke avledes entydig fra rang/posisjon. Ny økt nullstiller spesialrekken og midlertidige meldinger, men beholder dukkens helse. Trening gir aldri gull. Hver helt har separate data.

Lagringsformat v7. V1–v6 får fersk trening og beholder helter, stats, XP, utstyr, mål, utseende, rykte og seire. Før omskriving beholdes originalbytes i gangriket.save.before-v7; tidligere backup overskrives ikke. Skrive-/backupfeil blokkerer migreringen. Historiske beseirede bosser markeres som allerede belønnet uten å tildele gull. Ugyldige treningsfelt får trygge standardverdier med reparasjonsmelding og backup. Ukjent lagringsversjon starter ikke tomt over gamle data.

Ti arenaer med ti motstandere hver, bosser på plass 5 og 10: 100 motstandere, 20 bosser. De opprinnelige ti er arena 1 med uendrede ID-er/tall. Arealvelger viser ti kamper av gangen og varig trofé for fullført arena. Ny arena følger etter forrige sluttboss. Seire og bonuskrav er fortsatt per motstander, ikke et parallelt progresjonssystem. Sluttbossen i arena 10 gir fullføring, og alle kamper kan gjentas. Angrepsintervallet er alltid fem sekunder. Miljøene tegnes i kamp: skog, myr, borg, is, hav, storm, krystall, vulkan, kosmos og tronsal. Fiender deler syv grunnkropper med ulike våpen, skjold, horn, vinger, hodeplagg, størrelse og bosspynt.

40 våpen: trinn 0–19 for hver av de to eksisterende stilene. Åtte gamle ID-er og eierskap er bevart. Nye ID-er er melee_4–melee_19 og magic_4–magic_19. Skade/pris øker strengt. Styrke/magi og høyeste eide trinn styrer skade og neste tilbud som før. Geometrien deles av SVG og Phaser, med forskjellige nærkampsilhuetter, stavhoder, materialer og ornamenter. Ingen elementskade er lagt til.

Belønninger: grønn komplett likning og eksisterende lesetid, positiv lyd, skade på dukker, kollaps/biter, samlet bonus, XP-overgang, nivåemblem og konkrete ferdighetsverdier etter valg. Bossfeiring har større trofé og fanfare; seiersskjermen viser ny arena, saldo og fremdrift. Våpenkjøp viser faktisk utrustet figur og korrekt skadeforskjell, inkludert negativ forskjell. Ingen ekstra obligatorisk ventetid. Redusert bevegelse fjerner bevegelse/partikler; lyd følger eksisterende innstilling. Timere og animasjoner validerer helt/økt/oppgave og kan ikke gi belønning.

Konfigurasjon: training.ts (ranger, helse, eksamen, bonus), weapons.ts (katalog), enemies.ts (kampdata), arenas.ts (miljø), config.ts (XP, stats, spesial og tider), sound.ts (lydmotiver). Se arena-balance.md for tidlig/midt/sen balanse og helseprioriterte profiler.
