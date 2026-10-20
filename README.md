# Gangriket – fase 1

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
- Helteside med samme figur, startvåpenet og 8 skade (styrke 5 + våpen 3).
- Phaser-scene med egenprodusert skog, leddelt helt, trepinne, angrep, treff og skadetall.
- React-grensesnitt med tydelig skille mellom spill og regning.
- Uavhengige tilfeldige faktorer fra 1 til 10. Identiske oppgaver etter hverandre er tillatt.
- Riktig svar med grønn likhet i 1,2 sekunder og ett angrep.
- Første feil med 0,35 sekunders rist og nytt forsøk på samme oppgave.
- Andre feil med rolig fasit som venter på «Neste».
- Eget talltastatur og fysisk tastatur: tall, Backspace og Enter. Ingen automatisk innsending.
- Redusert bevegelse følger operativsystemets innstilling.

Kun fase 1 er implementert. Helten beholdes ved navigasjon, men forsvinner ved omlasting. Det finnes ingen XP, nivåer, egenskapspoeng, magi, lagring, arena, gull eller lyd.

## Kode og justering

| Fil | Ansvar |
| --- | --- |
| `src/config.ts` | Alle svartider, animasjonstider, farger, startstyrke og våpendata |
| `src/store.ts` | Én autoritativ spilltilstand, svarbehandling, oppgave-ID-er, engangsangrep og kansellering av tidtakere |
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
Vercel-publisering er neste steg. Importer `larsmonsen2-cloud/GodlyGodGangeGame` med prosjektroten `./`.
