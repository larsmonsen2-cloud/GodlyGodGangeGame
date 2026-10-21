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

## Fase 5 – våpenbutikk (lokalt implementert)

Våpensmeden åpnes fra heltesiden. Seks kjøpbare våpen, filter for nærkamp/magi og en oversikt over eide våpen. Kjøp trekker gull én gang, beholder gammelt utstyr, utstyrer det nye våpenet og lagrer samlet. Eide våpen kan utstyres gratis. Bare valgt startvåpen gis ved opprettelse. Alle kjøpbare trinn kan kjøpes direkte når man har råd.

Butikken viser faktisk skade og positiv/negativ forskjell mot aktivt våpen. Kjøpsvisningen viser helten, gammel → ny skade og direkte valg om å trene eller handle videre. Felles geometriske våpendefinisjoner brukes i SVG-kortene og Phaser-helten. Ett valgfritt sparemål lagres og vises på heltesiden, etter seier og i spillområdet på høye skjermer (minst 800 px). Under spill er målet kun informasjon.

Lagringsversjon 2 migrerer gamle helter og registrerer bare eksisterende startvåpen som eid. Ukjente utstyrsreferanser repareres med varsel uten å kaste øvrig fremgang. Lydinnstilling ligger separat og beholdes. Ingen endring av XP, gullbelønning eller arenabalanse.

Endringssteder: `src/weapons.ts` (katalog/navn/type), `src/config.ts` → `shop` (priser og skade), `src/weaponVisuals.ts` (felles former og effektfarger), `src/shop.ts` (kjøpsregler), `src/storage.ts` (migrering).

Test lokalt: `npm run dev` eller `npm run build` og `npm run preview`. Fase 5 er ikke pushet eller publisert til Vercel.

## Fase 6 – ti arenakamper (lokal versjon)

Arena åpner nå en vertikal oversikt med ti faste kamper. Velg en opplåst motstander, les introduksjonen og trykk Start kamp. Første seier åpner akkurat neste motstander. Beseirede kamper kan spilles igjen uten begrensninger. Kamp 5 og 10 er bosser; Kong Klask avslutter rekken uten å tilby en kamp 11.

Hver seier gir vanlig gull. Baron Buldre gir i tillegg 50 gull første gang, Kong Klask 125. Gull, seiersprogresjon og brukt bonus lagres samlet før resultatdialogen vises. Omkamper gir ingen ny førstegangsbonus. Våpen og egenskaper hentes ved hver kampstart, med fullt liv og ny kampidentitet.

Versjon 3 migrerer eldre helter og bevarer utstyr, sparemål, gull, nivå og egenskaper. Versjon 1–2 lagret ikke seiere: alle begynner derfor med kamp 1 åpen, uten å tolke gull som tidligere seiere. Ukjente referanser repareres med varsel; ingen pågående kamp lagres. Innstillinger beholdes separat.

- Fiendekatalog, priser per seier, bonus og faste kampverdier: `src/enemies.ts`.
- Felles figurer for kort og Phaser: `src/enemyVisuals.ts`.
- Balansemodell: `src/balance.ts`. Kjør `npm run balance` for å regenerere `docs/arena-balance.md`.
- Spesifikasjon: `docs/arena-progression-spec.md`.

Se `docs/arena-balance.md` for alle ti kamper og beregnede utfall ved 2, 5 og 8 sekunders aktiv tenketid. Modellen er kontrollert mot kampmotoren i 120 kombinasjoner. Balanseanslagene erstatter ikke spillerprøving. Fase 6 er ikke pushet eller publisert.

## Fase 7 – karakterbygger og heltekrønike (lokalt)

Stor forhåndsvisning med 6 hudtoner, 5 frisyrer, 6 hårfarger, 4 uttrykk, 4 ansiktsdetaljer og 6 klesfarger. Tilfeldig utseende påvirker bare kosmetikk. Endre utseende har Lagre og Avbryt og bevarer all progresjon og utstyr.

Heltesiden viser en deterministisk tittel og kort krønike fra investerte poeng, fem pompøsitetstrinn og dokumenterte arenabragder. Rykte fra trening vises først ved retur til heltesiden; bossrykte inngår i seiersvisningen. Versjon 4 migrerer eksisterende helter uten gamle meldingskøer. Viktige spillknapper holdes synlige nederst på mobil.

Regler, konfigurasjonssteder og migrering: [docs/character-system.md](docs/character-system.md). Full bestilling: [docs/character-spec.md](docs/character-spec.md). 83 tester og produksjonsbygg består. Lokal prøve: npm run dev, eller npm run build og npm run preview.

Publiseringsstatus: fase 5 og 6 ble senere publisert etter egne bestillinger. Fase 7 er bare lokal; de eldre fasenes notater om lokal levering beskriver status ved deres opprinnelige leveranse.

## Fase 8 – flere helter og neste butikktilbud (lokalt)

«Velg helt» vises ved oppstart. «Lag ny helt» og «Bytt helt» gir separate profiler med stabil ID, også ved like navn. All fremgang og utstyr er individuelt; lyd er felles på enheten. Versjon 5 tar lokal sikkerhetskopi før migrering av gammel enkelthelt og stopper trygt dersom migreringen ikke kan lagres.

Butikken viser neste nærkampvåpen og neste magivåpen ut fra høyeste eide progresjonstrinn. Eide våpen finnes i «Mitt utstyr». Gamle kjøp beholdes; sparemål som ikke lenger er aktuelle tilbud fjernes med engangsmelding når de peker for langt frem.

[Regler og lagring](docs/profiles-shop.md) · [Full bestilling](docs/profiles-shop-spec.md). 101 tester og produksjonsbygg består. Lokal server: npm run build og npm run preview. Fase 7 er publisert etter separat beskjed; fase 8 er ikke pushet eller publisert.
