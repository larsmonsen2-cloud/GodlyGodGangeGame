# Implementeringsplan

Gjeldende krav er hele den innsendte spesifikasjonen i `game-spec.md`.

## Fase 1 – implementert

- [x] TypeScript, React, Phaser og Vite med eksakte versjoner og låsefil.
- [x] Opprett helt med validert navn og tre farger.
- [x] Felles stor figur i forhåndsvisning, helteside og trening.
- [x] Helteside med startvåpen, våpenbeskrivelse og fast skade 8.
- [x] Todelt treningsskjerm med isolerte effekter og fast talltastatur.
- [x] Tilfeldige, uavhengige faktorer fra 1 til 10 og unike oppgave-ID-er.
- [x] Alle tre svarreaksjoner, fasit og «Neste».
- [x] Fysisk tastatur, holdt-tast-beskyttelse og inputlås.
- [x] Fysisk angrep, dummyreaksjon og skadetall.
- [x] Opprydding ved sceneskifter og beskyttelse mot gamle tidtakere.
- [x] Redusert bevegelse.
- [x] 12 automatiserte regel- og tastaturtester.
- [x] Nettleserkontroll på 390 × 844, 360 × 640 og PC.
- [x] Produksjonsbygg og lokal spillbar versjon.
- [x] Oppfølging: heltesiden fyller én mobilskjerm uten scrolling. Portrettet tilpasser høyden, og navn, våpenbeskrivelse, skade og Tren er synlige på 360 × 640 og 390 × 844.

Spillet er publisert på https://godly-god-gange-game.vercel.app/ via GitHub og Vercel. Åpningsside og helteside er komprimert uten scrolling på små mobiler.

Se `verification.md` for hva nettlesertestene faktisk dekker. Brukeren har nå bestilt fase 2. Brukeren har også bestilt fase 3. Fase 4 avventer ny bestilling.

## Fase 2 – implementert

- [x] 10 XP per riktig svar, dynamisk terskel, overskytende XP og flere nivåøkninger.
- [x] Ett poeng per nivå, +2 styrke/magi eller +10 maks liv, konkret forhåndsvisning.
- [x] Kort nivåmerke i spillområdet etter korrekt likhet; neste oppgave starter uten pause.
- [x] Nivå, XP, neste treningsmål, egenskaper, poeng og skade på heltesiden. Våpen velges ved opprettelse.
- [x] Gratis magivåpen med eget utseende, prosjektil og datadrevet skalering.
- [x] Versjonert og validert lokal lagring, også gull 0, med varsel ved lagringsfeil.
- [x] 20 regel-, tastatur-, progresjons- og lagringstester.
- [x] Mobilkontroll og komplett løkke gjennom nivåøkning, poengvalg og omlasting.

## Fase 3 – implementert

- [x] Egen introduksjon og Start kamp, med original slimfigur.
- [x] Liv, skade og angrepsmåler for Gøran, med spesifiserte faste verdier.
- [x] Pause under svarrespons og fasit, bevart resttid og aktiv gjenopptakelse etter skjult fane.
- [x] Seier etter fullført likhet, 25 gull én gang, ingen XP i arena.
- [x] Nederlag uten fremgangstap, trening, retur og omkamp med full nullstilling.
- [x] Ingen lagring av aktiv kamp; gamle timere og animasjoner ryddes ved ny kamp.
- [x] 30 automatiserte tester og kontroll av produksjonsbygget i nettleseren.

## Fase 4 – ikke påbegynt

Videre finpuss etter spilling, eventuell lyd med av/på og balansering av de implementerte systemene.


Oppdatert spillflyt: Kampvåpen eller magivåpen velges på «Lag din helt», med oppdatert figurforhåndsvisning. Valget lagres og kan ikke byttes på heltesiden. Eksisterende helter beholder valgt våpen. Nivåøkning vises som et kort merke øverst i treningen uten dialog eller ekstra trykk; neste gangestykke er umiddelbart tilgjengelig etter vanlig svarrespons. Poeng kan fordeles ved senere besøk på heltesiden.
