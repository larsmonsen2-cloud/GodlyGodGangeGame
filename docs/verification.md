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
