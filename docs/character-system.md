# Karakterbygger og heltekrønike – fase 7

Karakterbyggeren har seks hudtoner, fem frisyrer (inkludert skallet), seks hårfarger, fire ansiktsuttrykk, fire ansiktsdetaljer og seks klesfarger. Valgene forhåndsvises umiddelbart på samme Phaser-figur som brukes på heltesiden, i trening, arena og kjøpsvisning. Tilfeldig utseende endrer bare kosmetikk. Navn og ett startvåpen velges kun ved opprettelse.

Endre utseende åpner en midlertidig kopi. Lagre endrer bare utseende og den gamle klesfargereferansen; Avbryt forkaster kopien. Ingen enkeltklikk i byggeren skriver til den lagrede helten. Skallet skjuler hårfargevalget visuelt i figuren og deaktiverer fargeknappene, men beholder valgt hårfarge.

## Profil og pompøsitet

Profilen beregnes fra investerte poeng: forskjellen fra startverdien deles på økningen per poeng. Entydig største investering gir styrke, magi eller helse. Lik fordeling, ingen investering eller ugyldige verdier gir balansert profil. Aktivt våpen og kosmetikk påvirker ikke tekst eller profil.

| Trinn | Nivågrense |
| --- | --- |
| 1 | 1 |
| 2 | 3 |
| 3 | 6 |
| 4 | 10 |
| 5 | 15 |

Registrert seier over Gøran gir minst trinn 2, Baron Buldre minst 4 og Kong Klask trinn 5. Høyeste oppnådde trinn lagres og faller aldri. Fire profiler og fem trinn gir 20 håndskrevne grunnmaler. Faktiske bragder prioriteres Kong Klask, Baron Buldre, Gøran, deretter generell tekst. Historikken kommer bare fra lagrede beseirede fiende-ID-er. Gull tolkes aldri som en seier.

Tittel og kort krønike beregnes deterministisk; omlasting og kosmetikkvalg trekker ingen ny tekst. Endret poengfordeling kan endre profilteksten uten feiring. Nytt trinn eller ny bossbragd gir én samlet rykteoppdatering. Under trening venter den til retur til heltesiden; neste regnestykke fortsetter normalt. Bossoppdateringen inngår i den eksisterende seiersvisningen etter svarresponsen. Vist trinn og boss lagres så meldingen ikke gjentas ved omlasting eller omkamp.

## Lagring og mobil

Lagringsversjon 4 migrerer versjon 1–3 med standardutseende nær den gamle figuren og bevart klesfarge. Navn, egenskaper, XP, nivå, gull, våpen, eierskap, sparemål og tilgjengelig arenahistorikk beholdes. Lydinnstilling ligger fortsatt separat. Gamle versjoner uten seiershistorikk får ingen oppdiktede bragder. Passende eksisterende rykte markeres som vist uten en kø av gamle meldinger. Ukjente visuelle ID-er repareres med standardverdier uten å slette fremgang.

Byggeren kan scrolle. Heltesiden bryter lange navn og titler; Tren, Arena og Butikk ligger fast nederst på mobil. Innhold kan scrolle på korte skjermer. Regneområdets eksisterende faste oppdeling og minst 44 px høye tallknapper er beholdt.

## Endringssteder

- src/appearance.ts: kosmetikkatalog, standarder, validering og tilfeldig utseende.
- src/art.ts: felles figur og visuelle lag; src/SceneView.tsx kobler den til spillet.
- src/CharacterBuilder.tsx og src/style.css: valg og responsivt oppsett.
- src/reputation.ts: profiler, tekstmaler, bragdprioritet og rykteregler.
- src/config.ts → reputation.levelThresholds: nivågrenser; colors: klesfarger.
- src/storage.ts: versjon 4 og migrering; src/store.ts: midlertidig redigering og meldingstidspunkt.
- tests/character.test.ts: fokuserte karakter-, krønike- og migreringstester.

Spillbalanse, XP, priser, våpenskade og kampverdier er uendret. Se verification.md for utførte kontroller. Fase 7 er ikke pushet eller publisert.
