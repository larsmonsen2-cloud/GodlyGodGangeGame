# Spesialangrep og nivåemblem

## Fase 9 – spesialangrep og nivåemblem (21. oktober 2026)

Implementert lokalt. Ikke publisert. Fase 8 ble publisert separat på commit f927d0e816e718659340af15d14cc003460f2b8b.

Fem riktige svar på rad gir ett angrep med dobbel beregnet skade. Første feil bryter rekken straks; riktig andre forsøk starter på 1/5. Tom innsending og redigering endrer ingenting. Ny økt, omkamp, avslutning og heltebytte nullstiller. Pause og nivåbanner bevarer rekken. Logisk nullstilling skjer før den korte visningen av fem fulle segmenter. Skade og belønning beregnes bare i spillogikken; animasjonen kan ikke gi ekstra skade. Trening gir fortsatt 10 XP per riktig svar, arena gir samme gull og ingen XP.

Nærkamp har større sving og rekyl, magi har oppladning og større prosjektil. Begge viser ett SUPER-skadetall med det utstyrte våpenet. Effektene holder seg innen eksisterende svarpause. Måleren har reservert plass utenfor figurer, liv og regneområde. Redusert bevegelse bruker roligere statiske effekter; eksisterende lydinnstilling respekteres.

Heltesiden viser skjoldemblem sammen med XP og antall svar til neste nivå. Jern 1–4, bronse 5–9, sølv 10–19, gull 20–39 og magisk fra 40; både dekor og farger endres. Hele nivånummeret beholdes med tilpasset bredde og skrift. Nivåbanner stopper ikke trening. Ved retur feires høyeste nye nivå én gang per helt. Lagringsformat v6 legger til seenLevel; eldre profiler migreres med nåværende nivå allerede sett. Fremgang og øvrige profilfelt bevares.

Konfigurasjon i src/config.ts: special.threshold (5), special.multiplier (2), special.windup/projectile/impact/damageFloat og emblem.thresholds/celebration. Eksisterende timing styrer svarpause og måleroverganger. Presentasjon i SpecialMeter.tsx, LevelEmblem.tsx, SceneView.tsx og style.css. Spillregler i store.ts, migrering i storage.ts.

Balansen er beregnet på nytt i arena-balance.md: en feilfri femsvarsrekke gir totalt seks normale angreps skade, altså 20 prosent mer skade over en komplett rekke. Fiender, priser, XP og belønningssatser er uendret. Gøran med startvåpen krever ni feilfrie svar mot tidligere ti.
