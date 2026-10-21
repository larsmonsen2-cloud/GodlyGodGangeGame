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

Se `verification.md` for hva nettlesertestene faktisk dekker. Brukeren har nå bestilt fase 2. Brukeren har også bestilt fase 3. Brukeren har også bestilt fase 4.

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

## Fase 4 – implementert

Treffringer og gnister, egen magifarge, Gørans nederlagsanimasjon og seiersmerke. Korte syntetiserte lyder for treff, magi, skade, nivå og seier; av som standard, med lagret av/på-valg. Lydfeil påvirker aldri spillregler. Redusert bevegelse beholdes. 35 tester består, og trening, nivåøkning, pause, arena og seier er prøvd i nettleseren. Eksisterende balanseverdier er beholdt; videre balansering bør bygge på brukerens spilling.


Oppdatert spillflyt: Kampvåpen eller magivåpen velges på «Lag din helt», med oppdatert figurforhåndsvisning. Valget lagres og kan ikke byttes på heltesiden. Eksisterende helter beholder valgt våpen. Nivåøkning vises som et kort merke øverst i treningen uten dialog eller ekstra trykk; neste gangestykke er umiddelbart tilgjengelig etter vanlig svarrespons. Poeng kan fordeles ved senere besøk på heltesiden.

## Fase 5 – implementert lokalt

- [x] Seks datadrevne kjøpbare våpen med egne silhuetter, priser og skadeverdier.
- [x] Atomisk kjøp, automatisk utstyr, beskyttelse mot dobbeltkjøp og gratis gjenutstyr.
- [x] Butikk med filtre, eierskap, faktisk skadesammenligning og kjøpsvisning.
- [x] Ett lagret sparemål på helt, etter seier og på høye spillflater.
- [x] Lagringsversjon 2 med migrering og reparasjon av ukjente utstyrsreferanser.
- [x] 47 tester består, produksjonsbygg fullført og lokal nettleserløkke kontrollert.
- [x] Lokal leveranse; ingen push eller utrulling av fase 5.

Presisering av fase 2: Egenskapsvalget viser bare Styrke, Magi og Helse, uten effektforhåndsvisning. Bare ett startvåpen gis; senere bytte skjer via eide våpen i butikken.

## Fase 6 – implementert lokalt

- [x] Ti faste kamper, arenavelger, introduksjon og status for låst/åpen/beseiret.
- [x] Første seier åpner neste kamp; omkamper forblir tilgjengelige.
- [x] Datadrevne motstandere med sju figurtyper og egne bossbannere.
- [x] Kampbelønning hver seier, separate engangsbonuser for boss 5 og 10.
- [x] Atomisk lagring av gull, seire og utbetalte bonuser i versjon 3.
- [x] Ny kampidentitet, nullstilte klokker og samme eksisterende feedback- og pauseregler.
- [x] Fullført arenarekке med feiring og omkamper, ingen kamp 11.
- [x] Deterministisk balansetabell og sammenligning mot kampmotoren i 120 scenarier.
- [x] Lokal nettleserkontroll av ny helt, opplåsning, tap, boss, omkamp, butikk, nytt våpen og omlasting.

Ingen push eller produksjonsdeploy for fase 6. Fase 5 ble separat publisert etter brukerens uttrykkelige bestilling.

## Fase 7 – implementert lokalt

- [x] Felles kosmetikkmodell med seks valgkategorier og umiddelbar figurforhåndsvisning.
- [x] Tilfeldig utseende og midlertidig redigering med Lagre/Avbryt.
- [x] Samme figur og aktive utstyr på helt, i trening, arena og butikk.
- [x] Fire poengprofiler, fem varige pompøsitetstrinn og 20 deterministiske grunnmaler.
- [x] Bragder basert på faktisk seiershistorikk; én samlet rykteoppdatering uten avbrutt trening.
- [x] Versjon 4-migrering med bevart progresjon og trygge kosmetikkstandarder.
- [x] Mobil- og PC-kontroll, lange navn/titler og faste spillknapper på mobil.
- [x] 83 automatiserte tester og produksjonsbygg består.
- [x] Spesifikasjon, regelbeskrivelse og verifisering oppdatert.

Fase 5 og 6 er senere publisert etter separate bestillinger. Fase 7 er ikke pushet eller publisert.

## Fase 8 – implementert lokalt

- [x] Heltevelger med faktisk figur, tittel, nivå, arenafremgang og sist-valgt-markering.
- [x] Flere profiler med unik ID; samme navn tillatt, opprettelse med Avbryt.
- [x] Separat fremgang og full opprydding ved heltebytte.
- [x] Versjon 5 med lokal sikkerhetskopi, idempotent migrering og gjenopprettingsskjerm ved feil.
- [x] Bevaring av gyldige profiler dersom en annen er ugyldig.
- [x] Ett neste tilbud per serie, styrt av eksplisitt tier og høyeste eierskap.
- [x] Kjøpskontroll med helte-ID, butikkøkt, pris, eierskap og aktuelt tilbud.
- [x] Egen utstyrsvisning, gratis bytte og tilpassede individuelle sparemål.
- [x] Kjøpsfeiring og beskyttelse mot dobbelttrykk på neste tilbud.
- [x] 101 tester, produksjonsbygg og isolert nettleserflyt på mobil/PC.

Fase 7 er publisert etter egen beskjed. Ingen push eller deploy av fase 8.

## Fase 9 – ferdig lokalt

- [x] Konfigurerbar rekke, én dobbel skadehendelse og sikre øktgrenser.
- [x] Fem segmenter, feilbrudd, nærkamp- og magieffekt.
- [x] Nivåemblem med fem materialer og engangsfeiring per profil.
- [x] v6-migrering uten historiske nivåfeiringer.
- [x] 124 tester, produksjonsbygg og isolert mobil-/PC-kontroll.
- [x] Oppdatert balanse og spesifikasjon; se special-level.md.
- [ ] Separat eventuell publisering etter beskjed.

Statuskorreksjon: Fase 8 er publisert på f927d0e; fase 9 er ikke publisert.

## Utvidelse til ti arenaer

- [x] Eksisterende systemer, ID-er og publiseringsflyt kartlagt.
- [x] Varig trening med overkill, eksamen og gjentakbar sluttrang.
- [x] Skadebasert XP-bonus og effektiv håndtering av mange nivåer.
- [x] Belønninger, lyder, synlige skader og rolige alternativer.
- [x] 100 motstandere, 20 bosser, ti kampmiljøer og 40 våpen.
- [x] v7-migrering og særskilt backup uten tap av gamle seire/kjøp.
- [x] 140 tester, balanseberegning, produksjonsbygg og isolert nettleserkontroll.
- [ ] Bekreft produksjonsdeploy og funksjonstest på publisert bygg.
