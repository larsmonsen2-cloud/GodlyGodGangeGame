# Flere helter og neste våpen – fase 8

## Brukerflyt

Med minst én helt åpner spillet «Velg helt» ved oppstart og omlasting. Sist valgte helt markeres. Hvert kort viser faktisk utseende og aktivt våpen, navn, tittel, nivå og antall registrerte seire av antall fiender i katalogen. Hele kortet åpner heltesiden. På mobil brukes en vertikal liste; PC har to kolonner. Figurer utenfor den synlige listen monteres ikke, og kort bruker Canvas-rendering uten å opprette en WebGL-kontekst per helt.

«Lag ny helt» gjenbruker karakterbyggeren. Ingen profil opprettes før fullført skjema; Avbryt går tilbake. Navnet er ikke identiteten: to like navn får hver sin UUID. Nye helter starter uten arvet fremgang og med bare valgt startvåpen. Ingen kunstig profilgrense, sletting, konto eller synkronisering er lagt til.

«Bytt helt» er en sekundær knapp på heltesiden. Heltevalg er ikke tilgjengelig under kamp. Bytte rydder spørsmål, input, timere, kamp, kjøpsvisning, nivåmerke og utseendeutkast. Forsinket svarrespons kontrollerer helte-ID, øktgenerasjon og oppgave-ID. Fiendeklokker kontrollerer både helte-ID og kamp-ID. Butikkhandlinger bærer helte-ID og butikkøkt, samt konkret våpen-ID.

## Lagring

SAVE_KEY er fortsatt gangriket.save. Versjon 5 inneholder profiles (id, hero og eventuell engangsmelding), lastHeroId og rejectedProfiles. Hele hero-objektet tilhører én profil: utseende, XP, stats, gull, våpen, sparemål, arena, bonus og ryktestatus. GameState.hero er alltid samme objektreferanse som valgt profil i den autoritative samlingen; den lagres ikke separat. En oppdatering skriver hele samlingen samlet. Eksisterende lydvalg beholdes i sin separate enhetsnøkkel.

Før versjon 1–4 erstattes, kopieres de originale lagringsbytene til gangriket.save.before-profiles. Denne sikkerhetskopien overskrives ikke. Deretter får enkelthelten én UUID og blir sist valgt. Fremgang, tidligere kjøp og øvrige gyldige felt beholdes. Historiske rykter markeres som vist; ventende rykter i eksisterende versjon 5 bevares.

Mislykket sikkerhetskopi eller migreringsskriving lar den gamle lagringen stå urørt og viser en egen skjerm med «Prøv igjen». Ingen ny helt kan overskrive den fra denne skjermen. Vellykket migrering lagres før spilleren går videre og lager ingen duplikater ved omlasting. Ugyldig sist-valgt-ID faller tilbake til første gyldige profil. Ugyldige profiler beholdes som rådata i rejectedProfiles, mens andre profiler fortsatt kan brukes; er ingen profiler lesbare, vises gjenopprettingsskjermen. Manglende/dupliserte profil-ID-er får nye UUID-er. Vanlig utilgjengelig lagring og senere skrivefeil bruker øktmodus med tydelig varsel, uten falsk «lagret»-bekreftelse.

Sikkerhetskopien er lokal i samme nettleser. Den er ingen skybackup og forsvinner dersom nettleserdata slettes.

## Neste butikktilbud

Våpnenes eksisterende, eksplisitte tier-felt er progresjonsrang innen melee og magic. nextWeapon finner høyeste eide rang i serien og deretter minste høyere kjøpbare rang. Pris, katalogrekkefølge, navn og aktivt våpen avgjør ikke progresjonen. Ingen eierskap i en serie gir dens første ordinære betalte våpen. Det andre startvåpenet gis eller selges ikke.

Butikken viser høyst ett tilbud per serie, aktiv type først. «Mitt utstyr» viser bare den valgte heltens eide våpen og gratis utstyring. Alle skadetall bruker den eksisterende damageFor-funksjonen, inkludert negativ forskjell ved våpentypebytte. Priser, skader, navn, illustrasjoner og kampbalanse er uendret.

Kjøp validerer helte-ID, butikkøkt, neste tilbud, eierskap og gull før én samlet oppdatering trekker gull, registrerer eierskap, utstyrer våpenet og fjerner et fullført mål. Kjøpsdialogen blokkerer nye kjøp. Etter lukking er kjøpsknappene låst i 500 ms for å hindre at dobbelttrykket treffer et nytt tilbud. Neste våpen introduseres diskret. Siste eide trinn gir en kompakt sluttmelding.

Gamle hoppede-over kjøp beholdes, uten å kreve eller tildele svakere våpen. Sparemål er separate. Bare aktuelle tilbud kan velges som nye mål; gyldige gamle mål beholdes. Ukjente eller eide mål fjernes. Et mål bak et tidligere kjøpstrinn fjernes med en profilbundet engangsmelding. Kjøp setter aldri et nytt mål automatisk.

## Endringssteder

- src/storage.ts: bibliotekformat, UUID-er, sikkerhetskopi, migrering og reparasjon.
- src/store.ts: profilvalg, samlet oppdatering, opprydding og butikkøktkontroll.
- src/HeroSelect.tsx: kort og lazy-monterte figurer.
- src/CharacterBuilder.tsx, src/App.tsx og src/HeroProgress.tsx: opprettelse og navigasjon.
- src/weapons.ts: stabile progresjonstrinn; src/shop.ts: tilbud, kjøp og mål.
- src/WeaponShop.tsx og src/style.css: butikkvisninger og responsiv utforming.
- tests/profiles-shop.test.ts: integrasjon, migreringsfeil og tilbudsregler.

Se profiles-shop-spec.md for bestillingen og verification.md for faktiske tester. Fase 8 er kun implementert lokalt.
