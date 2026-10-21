# Treningsreise og utvidet innhold

## Utvidelse: knusbare dukker og ti arenaer

Implementert 21. oktober 2026 etter expansion-spec.md. Bestillingen gir eksplisitt tillatelse til push på eksisterende main og produksjonsdeploy.

Trening har ti faste ranger med ni vanlige dukker og én eksamensdukke per rang. Sluttrangen gjentas. Første dukke har 64 liv; startskade 8 gir åtte vanlige treff eller sju feilfrie svar med spesial. Grunn-XP er fortsatt 10, knusebonus er maxHP/8. Overkill føres videre, også over ranggrenser; store angrep gir én samlet melding. Beregningen besøker høyst det avgrensede førstegangsinnholdet og hopper deretter hele sluttrangsykluser matematisk. Nivåøkninger beregnes fra eksisterende lineære XP-krav med en korrigert aritmetisk sum, slik at også store belønninger håndteres effektivt.

Hero.training lagrer rang, posisjon, gjenværende liv, antall knuste, største slag og én medalje per fullført rang. Aktiv dukke avledes entydig fra rang/posisjon. Ny økt nullstiller spesialrekken og midlertidige meldinger, men beholder dukkens helse. Trening gir aldri gull. Hver helt har separate data.

Lagringsformat v7. V1–v6 får fersk trening og beholder helter, stats, XP, utstyr, mål, utseende, rykte og seire. Før omskriving beholdes originalbytes i gangriket.save.before-v7; tidligere backup overskrives ikke. Skrive-/backupfeil blokkerer migreringen. Historiske beseirede bosser markeres som allerede belønnet uten å tildele gull. Ugyldige treningsfelt får trygge standardverdier med reparasjonsmelding og backup. Ukjent lagringsversjon starter ikke tomt over gamle data.

Ti arenaer med ti motstandere hver, bosser på plass 5 og 10: 100 motstandere, 20 bosser. De opprinnelige ti er arena 1 med uendrede ID-er/tall. Arealvelger viser ti kamper av gangen og varig trofé for fullført arena. Ny arena følger etter forrige sluttboss. Seire og bonuskrav er fortsatt per motstander, ikke et parallelt progresjonssystem. Sluttbossen i arena 10 gir fullføring, og alle kamper kan gjentas. Angrepsintervallet er alltid fem sekunder. Miljøene tegnes i kamp: skog, myr, borg, is, hav, storm, krystall, vulkan, kosmos og tronsal. Fiender deler syv grunnkropper med ulike våpen, skjold, horn, vinger, hodeplagg, størrelse og bosspynt.

40 våpen: trinn 0–19 for hver av de to eksisterende stilene. Åtte gamle ID-er og eierskap er bevart. Nye ID-er er melee_4–melee_19 og magic_4–magic_19. Skade/pris øker strengt. Styrke/magi og høyeste eide trinn styrer skade og neste tilbud som før. Geometrien deles av SVG og Phaser, med forskjellige nærkampsilhuetter, stavhoder, materialer og ornamenter. Ingen elementskade er lagt til.

Belønninger: grønn komplett likning og eksisterende lesetid, positiv lyd, skade på dukker, kollaps/biter, samlet bonus, XP-overgang, nivåemblem og konkrete ferdighetsverdier etter valg. Bossfeiring har større trofé og fanfare; seiersskjermen viser ny arena, saldo og fremdrift. Våpenkjøp viser faktisk utrustet figur og korrekt skadeforskjell, inkludert negativ forskjell. Ingen ekstra obligatorisk ventetid. Redusert bevegelse fjerner bevegelse/partikler; lyd følger eksisterende innstilling. Timere og animasjoner validerer helt/økt/oppgave og kan ikke gi belønning.

Konfigurasjon: training.ts (ranger, helse, eksamen, bonus), weapons.ts (katalog), enemies.ts (kampdata), arenas.ts (miljø), config.ts (XP, stats, spesial og tider), sound.ts (lydmotiver). Se arena-balance.md for tidlig/midt/sen balanse og helseprioriterte profiler.
