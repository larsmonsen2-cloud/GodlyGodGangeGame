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

Mobiltilpasningen er klar for publisering via GitHub og Vercel. Repositoriet heter `larsmonsen2-cloud/GodlyGodGangeGame`, og `vercel.json` inneholder byggeoppsettet. Vercel-publisering gjenstår. Den tidligere Sites-lenken viser fortsatt førsteversjonen.

Se `verification.md` for hva nettlesertestene faktisk dekker. Neste fase skal ikke påbegynnes før brukeren har prøvd spillfølelsen og bedt om videre utvikling.

## Fase 2 – ikke påbegynt

Progresjon, XP, nivåer, egenskapspoeng, magi, våpenvalg og versjonert lokal lagring. Bruk verdier og regler i spesifikasjonen. Ingen tomme moduler for disse systemene er laget.

## Fase 3 – ikke påbegynt

Gøran, arenakamp, fiendeklokke, liv, pause, seier/nederlag og engangsbelønning i gull.

## Fase 4 – ikke påbegynt

Videre finpuss etter spilling, eventuell lyd med av/på og balansering av de implementerte systemene.
