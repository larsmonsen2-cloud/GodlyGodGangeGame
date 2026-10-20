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
