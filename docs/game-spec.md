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