# Verifisering – fase 1

## Oppfølging: helteside uten scrolling

Heltesiden er kontrollert i nettleser ved 360 × 640 og 390 × 844, med et navn som består av 20 brede W-tegn. Dokumentets mål var nøyaktig lik viewport i begge tilfeller, uten scrolling. Navnet fikk bryte over to linjer. Våpen, beskrivelse, skade og Tren-knapp var synlige. Tren-knappen var 48 px høy, og bunnen lå ved henholdsvis 610 og 814 px. Portrettet tilpasser seg plassen over informasjonen. Tilpasningen gjelder heltesiden på mobil; opprettelsesskjerm og PC-oppsett beholder eksisterende layout.

## Automatiserte tester

`npm test` kjører 12 tester i `tests/game.test.ts`:

1. To uavhengige trekk, heltall innenfor 1–10, inkludert ytterpunktene.
2. Identiske etterfølgende oppgaver er tillatt, med ulike ID-er.
3. `10 × 10 = 100` gir ett angrep på 8 skade; raske ekstrakall gir ingen flere angrep.
4. Første feil bevarer oppgaven og fjerner svaret etter riktig tidsintervall.
5. Andre feil viser fasit, gir ingen angrep, venter ubegrenset og nullstiller feil ved «Neste».
6. Tom innsending ignoreres; tre-siffergrense og sletting virker.
7. Ledende nuller normaliseres som heltall.
8. Gamle tidtakere kan ikke endre en ny treningsøkt.
9. Fjernede angrepslyttere kalles ikke, og disposisjon stanser tidtakere.
10. Navn trimmes/valideres og ny spilltilstand har ingen lagret helt.
11. Holdt Enter og gjentatte keydown-hendelser kan ikke lukke fasiten; et nytt trykk kan.
12. Et siffer holdt inne under tilbakemelding blir ikke lagt inn i neste oppgave.

`npm run build` kontrollerer TypeScript og lager produksjonsbygget. Phaser ligger i en egen større JavaScript-fil; Vite viser en forventet størrelsesadvarsel for denne filen.

## Faktisk nettlesertesting

Utført i Codex sin Chromium-baserte nettleser, med eksplisitte viewport-størrelser:

| Kontroll | Resultat |
| --- | --- |
| 390 × 844 | Hele treningen synlig; dokument 390 × 844; ingen normal eller horisontal scrolling |
| 360 × 640 | Hele treningen synlig; dokument 360 × 640; alle tallknapper 44 px høye |
| PC 1280 × 900 | Sentrert treningsflate og lesbart oppsett |
| Navn på 21 tegn | Avvist med forklaring |
| Navn på 20 tegn og blå klær | Opprettet; bevart ved retur og nye treningsøkter |
| Første feil via tallknapper | Samme oppgave, rødt feilsvar og inputlås, deretter tomt svarfelt |
| Andre feil via fysisk tastatur | Fasit blir stående; nytt Enter gir neste oppgave |
| Riktig svar via fysisk tastatur | Grønn likhet, låste knapper og automatisk ny oppgave |
| Raske ekstra Enter- og talltrykk | Ingen endring under tilbakemelding |
| Fast tastatur | På 360 × 640: øvre kant 379 px og nedre kant 573 px i normaltilstand, riktig svar og fasit |
| Skille mellom spill og regning | Spillområdets nedre kant og regneområdets øvre kant sammenfaller; canvas ligger helt i spillområdet; begge områder klipper egne effekter |
| Systemtastatur | Ingen input-elementer i treningsskjermen |
| Gjentatt navigering | Fire runder helteside/trening; helt bevart; etter forbedret opprydding nøyaktig ett canvas straks etter bytte |
| Konsoll | Ingen feil eller advarsler observert under testløkken |

## Begrensninger

- Dette er viewport-testing i en PC-nettleser, ikke en fysisk iPhone eller Android-telefon. Ekte berøring, mobilens nettleserverktøylinje og faktiske safe areas er ikke fysisk testet.
- Knapper er prøvd med automatiserte klikk. Holdt Enter og `10 × 10 = 100` er dekket av automatiserte tester; ekte langvarig tastenedtrykk og akkurat denne kombinasjonen ble ikke testet visuelt i nettleseren.
- Redusert bevegelse er implementert i CSS og Phaser, men ikke testet med en endret operativsysteminnstilling.
- Ingen lagring finnes i fase 1; omlasting starter på nytt.
- Ingen generell garanti gis for alle nettlesere eller ekstremt små skjermstørrelser.

## Fase 2 – verifisert 20. oktober 2026

- `npm test`: 19 tester består. Dekker tidligere svarregler, flere nivåer i én XP-tildeling, overskytende XP, poengbruk, uavhengig skade, engangsbelønning, utsatt nivådialog, lagringsrundtur, ugyldige data og utilgjengelig lagring.
- `npm run build`: består. Vite gir fortsatt den kjente størrelsesadvarselen for Phaser-pakken.
- Nettleser: fem riktige svar gir nivå 2 etter visning av likheten. Valg av magipoeng gir Magic 7 og 10 skade med kvisten. Omlasting bevarer nivå, XP, egenskaper og våpen, og åpner heltesiden.
- Heltesiden kontrollert uten scrolling på 360 × 640 og 320 × 568, også med navn på 20 brede tegn. Treningsløkken prøvd på 360 × 640 og 390 × 844. PC-oppsett kontrollert på 1280 × 720.
- Produksjonsbygget er prøvd med både nærkamp og magi, navigering og neste oppgave. Ingen konsollfeil i denne kontrollen.
- Phaser-opprydding beskytter nå også mot at en avsluttet instans starter sin scene forsinket, og canvas følger endringer i portrettets tilgjengelige høyde.
- Fortsatt viewport-testing på PC, ikke en fysisk telefon. Lokal lagring er per nettleser og domene, uten synkronisering eller konto. Arena og lyd er ikke implementert.

Den tidligere fase 1-begrensningen om at helten forsvinner ved omlasting gjelder ikke lenger.


## Oppfølging: uavbrutt trening og våpenvalg ved opprettelse
20 tester består. Produksjonsbygg består. Nettleser: magivåpen valgt ved opprettelse, korrekt figur og lagret våpen uten velger på heltesiden. Fem riktige svar førte direkte til en ny oppgave med nivåmerke og aktivt talltastatur, uten dialog. Tastetrykk ble registrert mens merket var synlig. Åpningsside kontrollert på 320 × 568. Tidligere omtale av nivådialog er erstattet av denne flyten.

## Fase 3 – arena

- `npm test`: 30 tester består. Ti nye arenatester dekker startkrav, nøyaktig femsekundersintervall, pauser under alle svarreaksjoner, manuell pause under svarrespons og fasit, gull én gang per seier, ingen arena-XP, omkamp, nederlag, simultane angrep, lagring og kansellering av gamle timere.
- `npm run build`: består, med kjent størrelsesadvarsel for Phaser.
- Produksjonsbygget prøvd i nettleseren: introduksjon, ti riktige svar med magivåpen, seier, 25 gull, omkamp med fullt liv, manuell pause, nederlag, Gå til trening og retur til helten.
- Omlasting bevarte 25 gull, XP og egenskaper. Ingen konsollfeil eller advarsler i denne testøkten.
- Arena, helse og angrepsmåler er isolert fra regneområdet. På 360 × 640 og 320 × 568 samsvarer områdenes kanter; Svar-knappen ligger innenfor skjermen. Tallknapper er minst 44 px høye. Heltesiden med Tren og Arena får også plass på 320 × 568.
- Automatisk pause på `visibilitychange` er implementert med krav om Fortsett. In-app-testnettleseren rapporterte fortsatt fanen som synlig etter åpning av en annen fane, så faktisk bakgrunnsbytte på fysisk telefon er ikke verifisert her. Pausemekanismen og at svarrespons ikke opphever pausen er dekket av tester.
- Fremdeles ingen fysisk telefontest, lyd, butikk eller fase 4. Pågående kamper lagres ikke. Gull er opptjent og lagret; bruk av gull kommer i en senere fase.


## Fase 4 – finpuss
35 automatiserte tester og produksjonsbygg består. Nye lydtester dekker stille oppstart, lagret valg, umiddelbar demping, utilgjengelig lyd/lagring, avvist autoplay og engangslyd for nivå/seier. Produksjonsbygget er prøvd med lyd på, omlasting, trening, uavbrutt nivåøkning, arena, pause og seier. Ingen konsollfeil. Ett canvas ved sceneskifter. Mobiltest på 320 × 568 med synlig lyd- og pauseknapp og uten scrolling. Lydens faktiske opplevde volum/kvalitet og redusert bevegelse er ikke prøvd på fysisk telefon. Balanseverdiene er beholdt.

## Fase 5 – 20. oktober 2026

47 automatiserte tester består (35 eksisterende, 12 nye). Dekker nøyaktig pris, for lite gull, duplikatkjøp, automatisk utstyr, gratis bytte, negativ skadeforskjell mellom egenskaper, målbytte/fjerning, lagring/omlasting, v1-migrering for begge startvåpen, ukjente ID-er og skrivefeil. Integrasjonstesten bekrefter nytt våpens skade i trening og arena samt blokkert shopping under kamp.

Produksjonsbygg fullført. Kun den eksisterende advarselen om stor Phaser-pakke. Ingen feil eller advarsler registrert i nettleserkonsollen under testen.

Nettleser på isolert localhost:4173-profil: eksisterende nivå 3-helt med 50 gull og magisk startvåpen ble bevart ved migrering. Valgte jernsverd som sparemål, kjøpte for nøyaktig 50 gull, fikk 8 → 12 skade og fjernet mål. Prøvde trening (+10 XP, ingen gull), valgte stormstav som nytt mål, vant arena med sverdet på sju riktige svar, fikk 25 gull og oppdatert mål 25/125. Åpnet butikk fra seiersmålet, filtrerte eide våpen, så negativ forskjell −4 for gammel kvist, utstyrte den gratis og lastet om. Gull 25, XP 10, mål, begge eide våpen og aktiv kvist ble bevart. Brukerens helter på andre nettleseropprinnelser ble ikke nullstilt.

Visuell kontroll: helteside med sparemål uten scrolling på 320×568 og 360×640; trening med 44 px taster på 320×568; butikk og kamp på 390×844; butikk i to kolonner på 1280×900. Lange navn brytes over flere linjer. Butikken scroller som tilsiktet. Ingen horisontal overskridelse på kontrollerte flater.

Begrensninger: Ikke testet på fysisk telefon. Alle seks butikkillustrasjoner deler definisjon med spillet; jernsverd og startstav er prøvd i faktisk kamp/trening. De kostbare våpnene er ikke kjøpt gjennom flere timers nettleserspilling. Redusert bevegelse bruker eksisterende globale CSS- og Phaser-regler. Ingen utrulling eller push i denne fasen.

## Fase 6 – 20. oktober 2026

60 automatiserte tester består, inkludert tidligere kamp-, tastatur-, lyd-, butikk- og lagringskontroller. Nye tester dekker ti kamper, låste/ukjente ID-er, eksplisitt start, opplåsning, tap, vanlig belønning én gang, bossbonus én gang på tvers av omkamp/omlasting, sluttkamp uten neste motstander, korrekt fiende, gamle kampklokker, nytt våpen og v1/v2-migrering. En deterministisk test sammenligner faktisk GameStore med balansestimatet for 4 helter × 10 motstandere × 3 svartempo (120 scenarier). Produksjonsbygg består; kun kjent stor Phaser-pakke-advarsel.

Nettleser, isolerte profiler på port 4180 (ingen brukerlagringer nullstilt):
- Opprettet ny helt; bare Gøran var åpen. Vant med ti riktige svar, fikk 25 gull og åpnet Birger. Neste motstander viste introduksjonen før start.
- Lot Birger vinne; fikk Prøv igjen, Tren og Arenaoversikt.
- Brukte separat testfixture med gyldig nivå 25-helt, kløyver og fire registrerte seire for å prøve bossflyten uten å måtte trene i timevis. Baron Buldre ga 95 + 50 = 145 gull, åpnet Snerk og gjorde infernoklingen kjøpbar via sparemålet.
- Kjøpte infernoklingen fra resultatet. Etter omlasting var 95 gull, 47 skade, våpen og progresjon bevart. Snerk startet med 230 liv; ett riktig svar reduserte dette til 183.
- Omkamp mot Baron Buldre ga bare 95 gull. Ingen ny bonus eller ny opplåsning ble vist.
- Separat sluttfixture med ni seire: Kong Klask ga 230 + 125 = 355 gull, «Tronen er din!» og «Alle ti kampene er beseiret!». Ingen Neste-knapp, fortsatt Kjemp igjen og Arenaoversikt.

Visuell kontroll på 390×844 og 360×640 samt 1280×900: vertikal liste uten panorering, bossintroduksjon og seiersdialog, nytt våpen og figur i adskilt spillområde. Store bosser holder seg i spillområdet. Balanse og gull/min er beregnede anslag, ikke resultater fra barne-/spillertesting. Ikke prøvd på fysisk telefon. Bakgrunnsfanepause har samme tidligere nettleserbegrensning (verktøyets faner rapporterer synlig); logikken er automatisert testet. Ingen produksjonsdeploy i denne fasen.

## Fase 7 – 20. oktober 2026

83 automatiserte tester består (60 eksisterende og 23 nye). Nye kontroller dekker gyldig/ugyldig kosmetikk, tilfeldig utseende, avbrutt og lagret redigering, uendret utstyr/spillverdier, hårfarge ved skallet, poengprofiler og like investeringer, nivågrenser, høyeste oppnådde trinn, dokumenterte bragder, stabile tekster, engangsvarsler og migrering. Produksjonsbygg består; bare eksisterende advarsel om stor Phaser-pakke.

Nettleserkontroll på isolerte testopprinnelser på port 4181:
- Opprettet helt med kastanjehud, blonde krøller, bekymret uttrykk, ansiktsmaling og lilla klær. Valgt magisk startvåpen og riktige startverdier ble bevart.
- Prøvde tilfeldig utseende og Avbryt, skallet med deaktivert hårfarge, deretter langt hår, bart og stolt uttrykk. Lagre og omlasting bevarte utseendet.
- Trening på 360×640 beholdt samme figur og tydelig regneområde med minst 44 px taster.
- Migrert nivå 2-testhelt steg til nivå 3; neste regnestykke kom automatisk. Rykte kom først på heltesiden. To magipoeng endret profilen uten ny feiring; omlasting gjentok ikke meldingen.
- Migrert bosstesthelt fikk nytt mørkt utseende med skjegg. Baron Buldre-seier ga vanlig gull og engangsbonus samt én integrert rykteoppdatering. Kjøpsvisningen for infernoklingen beholdt samme utseende.
- Lange navn (20 W-er), tittel på høyeste trinn og stort våpen ble kontrollert på 360×640, samt bygger og helt på 390×844 og PC 1280×900. Ingen horisontal overskridelse på kontrollerte flater; mobilknappene Tren, Arena og Butikk ligger synlig nederst.

Den eksisterende forhåndsvisningshelten på localhost:4173 ble lastet om uten nullstilling: nivå 3, XP 10/90, 25 gull, stats 5/5/40, to ledige poeng, aktiv kvist og stormstav som sparemål ble bevart. Riktig tittel ble beregnet uten historiske ryktemeldinger.

Begrensninger: Ingen fysisk telefontest eller visuell gjennomgang av alle kosmetiske kombinasjoner. Isolerte høynivå-fixtures ble brukt til bosskontroll. Eksisterende begrensning ved simulering av bakgrunnsfane gjelder fortsatt. Ingen balanseendring. Fase 7 er ikke publisert.

## Fase 8 – 21. oktober 2026

101 automatiserte tester består (83 eksisterende og 18 nye). Tidligere spilltester velger eksplisitt sist brukte profil etter oppstart; gamle målforventninger er tilpasset det nye kravet om neste tilbud. Nye tester dekker like navn/ulike ID-er, ingen arv, separate XP/stats/gull/utstyr/mål/seire, avbrutt opprettelse, bytte og omlasting, gamle callbacks, forbudt bytte under kamp, foreldede butikkhendelser, dobbelttrykk, sikkerhetskopi, idempotens, backup-/migreringsskrivefeil og retry, delvis ugyldig samling, ugyldige/dupliserte ID-er, ventende v5-rykter og vanlig skrivefeil. Tilbudstester dekker uavhengige serier, høyeste eierskap, hoppede-over kjøp, eldre utstyr, avsluttet serie, ugyldige tilbud, manglende gull og faktisk skade.

Produksjonsbygg består. Bare eksisterende advarsel om Phaser-pakkens størrelse. Ingen konsollfeil eller advarsler under den kontrollerte nettleserflyten. Spillet bruker lokal lagring direkte, uten backend eller nye miljøvariabler.

Isolert nettlesertest på 127.0.0.1:4182; ingen eksisterende brukerprofil ble nullstilt:
- Migrerte en v4-fixture «Kari»: nivå 25, 500 gull, kjempekløyver, fire seire, langt sølvhår og ansiktsmaling. Senere magimål ble fjernet med én forståelig melding. Ingen gammel ryktedialog.
- Valgte infernoklingen som Karis nye mål. Opprettet Knut med annet utseende og magisk startvåpen, null gull/XP og ingen seire.
- Knut svarte riktig fem ganger i trening og nådde nivå 2. Vant to komplette Gøran-kamper med ti svar hver og opptjente 50 gull. Bare første seier åpnet Birger og ga ryktemelding.
- Valgte lærlingstaven som Knuts mål, kjøpte for nøyaktig 50 gull og så 8 → 12 skade. Målet ble fjernet uten automatisk erstatning. Neste tilbud ble stormstaven; nærkamp forble jernsverd.
- Mitt utstyr inneholdt bare Knuts kvist og lærlingstav. Utstyrte gammel kvist gratis; tilbudet forble stormstaven. Valgte den som nytt mål.
- Byttet til Kari: fortsatt 500 gull, kjempekløyver, fire seire og infernoklingen som mål. Flere bytter og omlasting bevarte begge profiler og riktig sist-brukt-markering.
- Avbrutt opprettelse ga ingen ekstra profil. En tredje profil med 20 W-er testet linjebryting og flere kort.
- Testet Karis kjøp over til magi: faktisk skade falt 38 → 12 og ble vist korrekt. Kjøp av infernoklingen fullførte nærkampserien uten falskt neste tilbud og fjernet hennes mål.

Visuell kontroll: heltevelger på 390×844 og 360×640, butikk og lange våpennavn på liten mobil, samt to kolonner på PC 1280×900. Lange navn og titler brytes; kort viser ulike faktiske figurer og våpen. Målt ingen horisontal overskridelse på kontrollerte sider. En kontrastfeil i neste-tilbud-meldingen ble rettet og kontrollert i nytt bygg. Kort utenfor synsfeltet avmonteres for å begrense figurkostnad.

Begrensninger: Ingen fysisk telefontest eller stresstest med svært mange profiler. Vanlig lokal nettleserlagring er fortsatt eneste lagring; ingen synkronisering mellom faner/enheter er lagt til. Backup-/kvotefeil og forsinkede gamle hendelser er automatisert testet. Eksisterende bakgrunnsfane-begrensning gjelder fortsatt. Ingen produksjonspublisering av fase 8.


## Fase 9 – 21. oktober 2026

124 tester i ti filer består, inkludert 23 nye spesial-/emblemtester. Dekker fire vanlige treff/femte dobbelt uten ekstratreff, flere våpen, XP, første/andre feil, fasit, redigering, pause, nivåbanner, ny økt, bytte, omlasting, gamle hendelser, dødelig femtetreff, én belønning, materialgrenser, lange nivåverdier, engangsfeiring og v5-migrering. Produksjonsbygg består; eksisterende advarsel om Phaser-pakkens størrelse gjenstår.

Isolert nettleser på 127.0.0.1:4183, uten å nullstille brukerens profiler: fem riktige med kvist og magistav; samtidig nivåøkning og spesial; automatisk neste oppgave og retur til nivå 2-emblem; fire riktige så feil viste Rekken brutt, riktig andre forsøk viste 1/5. Arenatest med jernsverd endte med femte treff, 32 skade, 0/80 fiendeliv og én belønning på 25 gull. Infernoklinge ga SUPER og 54 skade i trening. Lyd var av. Ingen konsollfeil/advarsler i kontrollert flyt.

Visuell kontroll på 360×640, 390×844 og PC 1280×900. Talltastene målte 44 px på minste mobil; ingen horisontal overskridelse på kontrollerte flater. Figuren blir liten på kort mobil fordi regnefelt og taster prioriteres. Nivå 999999 ble kontrollert; skjoldet ble utvidet etter første visuelle test og kontrollert igjen i nytt bygg. Lange titler og sekundære heltevalg kan gi vertikal scrolling; hovedhandlingene ligger fast nederst. Eksisterende lokal forhåndsvisning på port 4173 ble oppdatert uten å nullstille Kvisthero.

Begrensninger: Ingen fysisk telefon- eller lydavspillingstest. Redusert bevegelse er implementert og kodegjennomgått, men ikke visuelt testet med endret systempreferanse. Pause, bakgrunnshendelser og engangsfeiring over omlasting er automatisert testet; ikke alle kombinasjoner ble manuelt gjentatt. Fase 9 er ikke pushet eller publisert.

Publisert etter separat beskjed: commit 64262045f9aa55743268f674f8ac1216519873b2 på main. Vercel-produksjon 7c4K8jPwV4n2RD5mUCTSoaMrAbuh viste Ready. Hovedlenken svarte HTTP 200 med index-DW-JI4CB.js og index-C4B8j5eV.css, identisk med det testede lokale bygget.

## Utvidelse til ti arenaer – 21. oktober 2026

140 tester i 11 filer består. 16 nye tester dekker skadebevaring og overkill, eksamen/ranggrenser, én billion skade uten løkke per dukke, likt resultat for oppdelt skade, XP-gevinst ved våpenoppgradering på flere ranger, store XP-beløp med eksakt rest, separate helter og reload, feil/fasit uten fremdrift, flere knusinger og to nivåøkninger fra ett slag, v6-migrering og backupfeil, alle innholds-ID-er, opplåsing av alle hundre og tjue engangsbonuser, kjøp gjennom begge komplette våpenserier og unik geometri. Tidligere forventninger om ti motstandere/seks betalvåpen og flat trenings-XP er oppdatert; de gamle fiendenes og våpnenes verdier kontrolleres fortsatt. Eksisterende pause-, skjult-klokke-, dobbelttrykk- og foreldet-hendelse-tester består.

Produksjonsbygg består; kjent Phaser-størrelsesadvarsel gjenstår. Balanserapport regenerert med npm run balance. Ingen ny backend, konto, miljøvariabel eller runtime-bildetjeneste. React-gjennomgang: komponenter på toppnivå, tydelige etiketter, én autoritativ lagringskilde, opprydding av Phaser/listeners og avledet arena-/våpenprogresjon.

Nettleser på isolerte porter 4184 og 4185: sju riktige med starthelt knuste første dukke og ga 18 XP på siste svar; samme økt fortsatte automatisk. Stort våpen knuste ni dukker, viste +72 bonus og ga nivå 1→3 med to poeng; Styrke-valg viste korrekt ny total 7. Eksamensdukke med 12/1536 liv ble knust av magi, ga 192 bonus og neste rang med 1009/1024 liv. Reload og heltebytte beholdt data. Hundrede motstander ble beseiret etter 20 svar med testmagiker, inklusive manuell pause og spesial: 4607 gull + 2066 engangsbonus, 100/100 seire. Omlasting og ny intro tilbød ikke bonusen igjen. Butikken viste fullført magiserie, korrekt lavere nærkampskade ved bytte, deretter kjøp av trinn 1,2,3,4 med automatisk utrusting og neste tilbud. Ingen konsollfeil/advarsler i kontrollert flyt.

Visuell kontroll: 360×640 og 390×844, samt desktop. Første mobiltest avdekket avklippet Svar-knapp; luft ble redusert og hele regneområdet målte deretter nøyaktig innenfor 640 px med 44 px taster. Lange bossnavn fikk avkorting i kampheader uten å skyve lyd/pause av skjermen; fullt navn finnes i introen. Nytt tronsalmiljø og størst magivåpen kontrollert. Redusert bevegelse ble testet i en separat server som bare i testresponsen erstattet mediespørringen med en alltid-sann betingelse; både JS-grenen og CSS-reglene var aktive. Målt animation-name:none for svar og knusebonus, uten å endre brukerens systeminnstillinger. Lyd var av i nettlesertestene; av/på og lydhendelser er automatisert testet.

Begrensninger: Ingen fysisk telefon- eller hørbar lydtest. Ingen full langtidsspilling gjennom hundre kamper med reelle spillere. Mobilens korteste kampfelt har små figurer for å bevare regnestykke og 44 px-taster. Hver visuelle variant er datatestet, men ikke manuelt inspisert enkeltvis. Sekundære sider kan scrolle. Eksisterende profiler ble ikke brukt til å simulere høye nivåer.
