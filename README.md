# Gangriket – fase 4

Et mobilvennlig fantasyspill for den lille gangetabellen. Lag en helt, velg klær, besøk heltesiden og tren mot en svært tålmodig dummy.

## Kjør lokalt

Bruk Node.js 22.12 eller nyere (verifisert med Node.js 24.15.0) og npm:

```powershell
git clone https://github.com/larsmonsen2-cloud/GodlyGodGangeGame.git
cd GodlyGodGangeGame
npm ci
npm run dev
```

Åpne adressen Vite skriver ut, normalt http://127.0.0.1:5173/.

```powershell
npm test
npm run build
npm run preview
```

`dist/` er ferdigbygget nettside og kan serveres med en vanlig statisk webserver. Den må åpnes over HTTP, ikke som en lokal `file://`-fil. Alle skrifter og illustrasjoner følger med; spillet bruker ingen eksterne API-er.

## Dette er med

- Navn på 1–20 tegn etter trimming, tre klesfarger og stor forhåndsvisning.
- Kompakt helteside med nivå, XP, styrke, magi, maks liv, poeng, våpenvalg og beregnet skade.
- Phaser-scene med egenprodusert skog, leddelt helt, trepinne, angrep, treff og skadetall.
- React-grensesnitt med tydelig skille mellom spill og regning.
- Uavhengige tilfeldige faktorer fra 1 til 10. Identiske oppgaver etter hverandre er tillatt.
- Riktig svar med grønn likhet i 1,2 sekunder og ett angrep.
- Første feil med 0,35 sekunders rist og nytt forsøk på samme oppgave.
- Andre feil med rolig fasit som venter på «Neste».
- Eget talltastatur og fysisk tastatur: tall, Backspace og Enter. Ingen automatisk innsending.
- Redusert bevegelse følger operativsystemets innstilling.

Fase 1–4 er implementert. Riktige svar gir 10 XP. Nivåer gir ett egenskapspoeng; spilleren velger +2 styrke, +2 magi eller +10 maks liv. Gratis pinne og magisk kvist skalerer med hver sin egenskap. Ingen automatisk skadeøkning ved nivåøkning.

Helten lagres automatisk i denne nettleseren på denne enheten. Omlasting åpner heltesiden med beholdt fremgang. Ingen synkronisering mellom telefon og PC. Blokkert lagring varsles, og ugyldige lagringsdata gir en ny opprettelsesside uten krasj. Arenaen har Gøran med 80 liv, 6 skade per fem sekunder og 25 gull per seier. Gull lagres og vises på heltesiden. Arena gir ingen XP. Korte lydeffekter kan slås på og av. Lyd er av som standard, og valget huskes i nettleseren.

## Kode og justering

| Fil | Ansvar |
| --- | --- |
| `src/config.ts` | Alle svartider, animasjonstider, farger, startstyrke og våpendata |
| `src/store.ts` | Én autoritativ spilltilstand, svarbehandling, oppgave-ID-er, engangsangrep og kansellering av tidtakere |
| `src/progression.ts` | XP, nivåer, poeng og datadrevet våpenskade |
| `src/storage.ts` | Versjonert og validert lokal lagring |
| `src/HeroProgress.tsx` | Helteverdier, XP, våpenvalg og tilgjengelige dialoger |
| `src/questions.ts` | Uavhengig tilfeldig trekking og normalisering av svar |
| `src/keyboard.ts` | Tastetrykk, gjentakelser og krav om å slippe Enter |
| `src/art.ts` | Felles figurdefinisjon, separate kropp/våpendeler og festepunkter |
| `src/SceneView.tsx` | Phaser, animasjoner og opprydding av scener/lyttere |
| `src/App.tsx` | Opprettelse, helteside og oppgavegrensesnitt |
| `src/style.css` | Mobiloppsett, visuell stil og regneanimasjoner |

React leser spilltilstanden med `useSyncExternalStore`. Phaser lytter til angrepshendelser og tildeler aldri belønninger eller endrer spillregler. Tilbakemeldingstidtakere kontrollerer både øktgenerasjon og oppgave-ID. Ved navigering kanselleres tidtakeren; Phaser-lytter og canvas kobles fra umiddelbart.

Avhengighetene er låst med eksakte versjoner og `package-lock.json`. Phaser brukes kun som bibliotek. Teknologidokumentasjon: [Phaser 3.90](https://phaser.io/download/release/v3.90.0), [React](https://react.dev/), [Vite](https://vite.dev/guide/).

## Verifisering

Se `docs/verification.md` for utførte kontroller og begrensninger, og `docs/implementation-plan.md` for faseplan og faktisk status.

## Publisering med GitHub og Vercel

Prosjektet har `vercel.json` med Vite, `npm ci`, `npm run build` og outputmappen `dist`.
Bruk prosjektmappen som roten i GitHub-repositoriet og importer repositoriet i Vercel.
Ingen miljøvariabler eller backend er nødvendige. Velg en støttet Node.js-versjon på minst 22.12.
Publisert på https://godly-god-gange-game.vercel.app/ via `main` i `larsmonsen2-cloud/GodlyGodGangeGame`.


Oppdatert spillflyt: Kampvåpen eller magivåpen velges på «Lag din helt», med oppdatert figurforhåndsvisning. Valget lagres og kan ikke byttes på heltesiden. Eksisterende helter beholder valgt våpen. Nivåøkning vises som et kort merke øverst i treningen uten dialog eller ekstra trykk; neste gangestykke er umiddelbart tilgjengelig etter vanlig svarrespons. Poeng kan fordeles ved senere besøk på heltesiden.


## Arena
Velg Arena på heltesiden og deretter Start kamp. Riktige svar angriper. Fiendens klokke stopper under svarrespons, feilrist og fasit. Pause eller skjult fane stanser kampen til spilleren aktivt fortsetter. Seier gir gull én gang; nederlag fjerner ikke fremgang. Omkamp starter med fullt liv. Omlasting avslutter kampen og åpner heltesiden.

`src/combat.ts` styrer fiendens tidsfrist. `src/store.ts` avgjør skade og utfall. Ved likt tidspunkt prioriteres et allerede forfalt fiendeangrep foran et innsendt svar. Forsinkede timere samler ikke opp en serie bakgrunnsangrep. Kampstatus lagres aldri. Balansen står i `CONFIG.enemy`.


Fase 4: Treff og magi har fargede treffringer og gnister, Gøran synker sammen ved seier, og resultatet får et seiersmerke. `src/sound.ts` lager korte Web Audio-toner uten lydfiler eller eksterne tjenester. Nettleserens lydrestriksjoner håndteres uten å blokkere spill. Ingen tale eller bakgrunnsmusikk. Lydnivå og toner justeres i `CONFIG.audio` og `sound.ts`; effekttider i `CONFIG.timing`.
