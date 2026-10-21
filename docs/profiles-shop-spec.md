Implementer neste fase i Gangriket:
1. Flere separate helter på samme enhet.
2. En enklere butikk som viser neste våpen i hver våpenserie.

Les prosjektinstruksjoner, spesifikasjon og eksisterende kode først. Undersøk særlig lagring, helteopprettelse, butikk, våpeneierskap og kampstatus.

Spillet fungerer godt og brukes allerede. Behold fungerende spillregler og eksisterende fremgang.

Lag en kort plan, implementer løsningen, kjør relevante tester og produksjonsbygg, og oppdater dokumentasjonen.

## 1. Mål og avgrensning

Kari og Knut skal kunne ha hver sin helt på samme telefon, uten at fremgang blandes.

Butikken skal gi et tydelig neste mål gjennom å vise neste tilgjengelige oppgradering, fremfor hele våpenkatalogen.

Implementer:
- Heltevelger.
- Opprettelse av flere helter.
- Bytte mellom helter.
- Separat lagring per helt.
- Trygg migrering av dagens lagring.
- Neste-våpen-visning i butikken.
- Egen visning for eide våpen.
- Tilpasning av sparemål til den nye butikklogikken.

Ikke implementer konto, skylagring, synkronisering, sletting av helter, flere fiender, nye våpen, spesialangrep eller ny kampbalanse i denne oppgaven.

## 2. Flere helter på samme enhet

Hver helt får en stabil, unik ID som er uavhengig av navnet.

To helter kan ha samme navn uten å dele data.

Følgende skal tilhøre den enkelte helten:
- Navn og utseende.
- Nivå og XP.
- Egenskaper og ubrukte egenskapspoeng.
- Gull.
- Eide våpen og annet eksisterende utstyr.
- Aktivt våpen.
- Sparemål.
- Arenaprogresjon.
- Registrerte førstegangsbonuser og bragder.
- Tittel, heltekrønike og tilhørende milepælsstatus.
- Andre eksisterende felt som beskriver heltens fremgang.

Felles innstillinger kan ligge på enhetsnivå:
- Lyd av/på.
- Eventuelle eksisterende tilgjengelighetsinnstillinger.

Ingen gull, utstyr, titler eller progresjon skal deles automatisk mellom heltene.

## 3. Heltevelger

Lag en skjerm med tittelen «Velg helt».

Vis ett tydelig kort per helt:
- Figur med heltens faktiske utseende og aktive våpen.
- Navn.
- Tittel.
- Nivå.
- Arenafremgang, eksempelvis «6 av 10 kamper vunnet».

Bruk eksisterende arenadata og antall kamper. Ikke hardkod ti dersom katalogen allerede er utvidet.

Marker sist brukte helt.

Hele kortet skal være lett å trykke på og åpne den valgte heltens helteside.

Legg til et tydelig kort eller en knapp:
«Lag ny helt».

Mobil:
- Store trykkflater.
- Vertikal liste eller oversiktlig rutenett.
- Ingen horisontal sidescrolling.
- Lange navn og titler må brytes pent.
- Heltevelgeren kan scrolle vertikalt.

Hvis det ikke finnes noen helter, åpnes eksisterende «Lag helt»-flyt.

Hvis det finnes minst én helt, vis heltevelgeren ved ny oppstart eller omlasting. Husk sist valgte helt og marker den, men ikke start en pågående kamp automatisk.

## 4. Opprette en ny helt

Gjenbruk eksisterende karakterbygger.

En ny helt starter med:
- Vanlige startverdier.
- Null gull og XP.
- Ingen arvet arenaprogresjon.
- Ingen arvede bragder.
- Bare det startvåpenet spilleren faktisk velger.

Opprett helten først når spilleren fullfører «Lag helt». En avbrutt opprettelse skal ikke lage en tom profil.

Ved opprettelse fra heltevelgeren:
- Ha en tydelig «Avbryt» eller «Tilbake».
- Behold alle eksisterende helter uendret.
- Etter fullført opprettelse blir den nye helten aktiv.

Ikke legg inn en unødvendig lav grense på antall helter.

## 5. Bytte helt

Legg til «Bytt helt» på heltesiden.

Dette skal:
1. Bevare fremgangen til nåværende helt.
2. Åpne heltevelgeren.
3. Bytte aktiv helt når et kort velges.
4. Vise riktig figur, stats, våpen og progresjon umiddelbart.

Bytte helt skal ikke være tilgjengelig midt i en aktiv kamp.

Ved heltebytte må gamle:
- Kampinstanser.
- Oppgaver og svarinput.
- Tidtakere.
- Animasjonscallbacks.
- Kjøpsvisninger.
- Nivådialoger.
- Midlertidige redigeringsutkast.

avsluttes eller ryddes bort.

En forsinket hendelse fra helt A skal aldri gi XP, gull, skade eller utstyr til helt B. Bind relevante handlinger til riktig helte-ID og kamp-/øktidentitet fremfor bare å lese «aktiv helt» når en callback kjører.

## 6. Lagring og migrering

Undersøk dagens lagringsformat før implementering.

Utvid til et versjonert format som støtter:
- Flere helter med stabile ID-er.
- Sist valgte helte-ID.
- Felles enhetsinnstillinger.

Behold én autoritativ kilde for heltedata. Unngå at aktiv helt og heltesamlingen blir to uavhengige kopier som kan komme ut av synkronisering.

Migrer eksisterende enkelthelt:
- Ta en lokal sikkerhetskopi av den gamle lagringen før første migrering.
- Behold samtlige eksisterende felt og all fremgang.
- Legg helten inn som første profil med unik ID.
- Sett den som sist valgt helt.
- Ikke gi ekstra gull, startvåpen eller belønninger.
- Ikke spill av gamle milepælsmeldinger på nytt.

Migreringen skal være idempotent: omlasting skal ikke lage flere kopier av samme helt.

Ikke overskriv en gyldig gammel lagring dersom migreringen feiler. Vis en forståelig melding og behold muligheten til å prøve igjen.

Håndter ukjent eller ugyldig sist-valgt-ID med en trygg reserve som ikke sletter helter.

Hvis én profil er ugyldig, skal øvrige gyldige profiler ikke gå tapt.

Gjenbruk eksisterende håndtering av utilgjengelig lagring. Ikke vis «lagret» dersom lagringen faktisk feilet.

## 7. Ny butikklogikk

Butikken skal vise:
- Neste nærkampvåpen.
- Neste magivåpen.

Vis aktiv våpentype først.

Ikke vis hele katalogen med fremtidige våpen. Ikke vis låste senere våpen som en lang liste.

Behold eksisterende:
- Våpennavn.
- Beskrivelser.
- Priser.
- Skade.
- Grafikk.
- Kjøpsfeiring.

Ikke endre balansen i denne oppgaven.

## 8. Definisjon av «neste våpen»

Bruk en eksplisitt, stabil progresjonsrekkefølge per våpenserie.

Ikke bruk:
- Alfabetisk sortering.
- Pris alene.
- Tilfeldig arrayrekkefølge.
- Aktivt våpen alene.

Regelen er:

Neste tilbud i en serie er første kjøpbare våpen etter det høyeste progresjonstrinnet den aktive helten allerede eier i den serien.

Viktig:
- Bytte til et eldre eid våpen skal ikke flytte butikkens tilbud bakover.
- Eierskap gjelder bare aktiv helt.
- Et kjøp i nærkampserien endrer ikke magiseriens progresjon.
- Har helten ingen våpen i en serie, vis det første ordinære kjøpbare våpenet i serien.
- Ikke gi eller tilby det andre startvåpenet gratis.

Eksisterende helter kan tidligere ha kjøpt et sent våpen uten å kjøpe alle tidligere våpen:
- Behold disse kjøpene.
- Bruk høyeste eide progresjonstrinn som utgangspunkt.
- Ikke krev at spilleren kjøper svakere, hoppede-over våpen for å komme videre.
- Ikke tildel de hoppede-over våpnene automatisk.

I den nye butikken kan spilleren kjøpe det aktuelle neste tilbudet. Senere våpen blir tilgjengelige etter hvert kjøp.

Håndhev dette også i kjøpslogikken, ikke bare gjennom hva grensesnittet viser.

Når siste våpen i en serie er eid:
- Vis en kompakt melding om at alle nåværende oppgraderinger i serien er kjøpt.
- Ikke lag et falskt neste tilbud.
- Ikke lov mer innhold på en bestemt dato.

## 9. Våpenkort

Hvert av de inntil to tilbudene viser:
- Stor våpenillustrasjon.
- Pompøst navn.
- Humoristisk beskrivelse.
- Nærkamp eller magi.
- Våpenskade.
- Faktisk total skade for aktiv helt.
- Forskjell fra aktivt våpens totale skade.
- Pris.
- Manglende gull.
- «Kjøp og utstyr».
- Mulighet til å markere som sparemål.

Beregn total skade gjennom spillets eksisterende felles skadefunksjon.

Eksempel:
«Styrke 7 + våpen 7 = 14 skade»
«+4 sammenlignet med våpenet du bruker»

Ved våpentypebytte skal sammenligningen bruke riktig egenskap. Et dyrere våpen må ikke presenteres som bedre dersom heltens faktiske skade blir lavere.

Tilstander:
- Har råd: aktiv kjøpsknapp.
- Mangler gull: deaktivert kjøpsknapp og tydelig restbeløp.
- Allerede eid: ikke et kjøpstilbud.

## 10. Kjøp og avsløring av neste våpen

Ved «Kjøp og utstyr»:
1. Kontroller aktiv helte-ID.
2. Kontroller at varen fortsatt er et gyldig neste tilbud.
3. Kontroller eierskap og gull.
4. Trekk gull én gang.
5. Registrer eierskap.
6. Utstyr våpenet automatisk.
7. Oppdater sparemål ved behov.
8. Lagre tilstanden.
9. Vis eksisterende kjøpsfeiring.

Bruk én samlet tilstandsoppdatering.

Behold gamle våpen i heltens eie.

Etter kjøpsfeiringen:
- Avdekk neste våpen i samme serie.
- Gi det en kort, diskret introduksjon.
- Ikke la neste kjøp skje fra et dobbelttrykk som var ment for forrige kjøp.
- Ikke la kortbyttet flytte en ny aktiv kjøpsknapp inn under et pågående trykk.

Alle kjøpshendelser skal være knyttet til konkret helt og konkret våpen.

Hvis helten byttes eller tilstanden endres før handlingen fullføres, skal handlingen valideres på nytt eller avvises trygt.

## 11. Mitt utstyr

Legg til en egen visning eller fane «Mitt utstyr» i butikken.

Den viser bare våpen den aktive helten eier:
- Illustrasjon.
- Navn.
- Total skade for helten.
- «Utstyr» eller «Utstyrt».

Utstyring er gratis og endrer ikke egenskaper.

Behold automatisk utstyring ved kjøp.

Et startvåpen som tilhører en annen helt, skal ikke dukke opp her.

Ingen salg eller sletting av våpen.

## 12. Sparemål

Sparemål er individuelt per helt.

Spilleren kan velge ett av butikkens aktuelle neste tilbud som mål.

Når mål-våpenet kjøpes:
- Fjern det fullførte målet.
- Vis neste tilbud.
- La spilleren selv velge et nytt mål.
- Ikke sett nytt mål automatisk.

Behold eksisterende målvisning på heltesiden og etter arenaseier, og i spillområdet der det allerede fungerer.

Migrering av gamle sparemål:
- Behold målet dersom våpenet fortsatt er et aktuelt neste tilbud.
- Fjern det dersom våpenet allerede er eid eller ikke lenger finnes.
- Hvis målet peker på et senere våpen som nå ligger bak et tidligere kjøpstrinn, fjern selve målvalget og informer kort én gang om at butikken nå viser neste oppgradering.
- Ikke endre gull eller eierskap.
- Ikke erstatt målet med et annet uten spillerens valg.

## 13. Helteside og navigasjon

Heltesiden skal fortsatt være lett å bruke.

Behold:
- Stor helt.
- Navn, tittel og krønike.
- Stats.
- Trening.
- Arena.
- Butikk.
- Endre utseende.

Legg til «Bytt helt» som en tydelig, men sekundær handling.

Etter heltebytte skal alle skjermer bruke den nye heltens data. Dette gjelder også butikktilbud, sparemål, arenaoversikt og figur.

Ikke endre regneskjermenes oppsett eller svaranimasjoner.

## 14. Testkrav

Lag fokuserte tester for:

Flere helter:
- Ny helt får unik ID.
- Like navn gir separate profiler.
- Ny helt arver ikke fremgang.
- XP, gull, egenskaper, våpen og arena holdes adskilt.
- Bytte og omlasting beholder riktig fremgang.
- Avbrutt opprettelse lager ingen profil.
- Forsinkede hendelser fra gammel helt ikke endrer ny helt.
- Migrering bevarer dagens helt uten duplikater.
- Ugyldig sist-valgt-ID ikke sletter profiler.

Butikk:
- Første tilbud uten eierskap i serien.
- Neste tilbud etter kjøp.
- Uavhengig progresjon per våpenserie.
- Høyeste eide trinn styrer tilbudet.
- Utstyring av et eldre våpen ikke flytter tilbudet bakover.
- Hoppede-over gamle kjøp håndteres korrekt.
- For lite gull avviser kjøp.
- Dobbelttrykk ikke gir dobbeltkjøp eller kjøp av neste vare.
- Ugyldige eller utdaterte tilbud avvises.
- Siste våpen gir korrekt sluttstatus.
- Total skade bruker riktig egenskap.
- Mitt utstyr bare viser aktiv helts eiendeler.
- Sparemål er separate og migreres riktig.

## 15. Manuell verifisering

Bruk isolerte testdata. Ikke nullstill brukerens eksisterende lagring.

Test denne flyten i nettleser når miljøet støtter det:
1. Åpne en gammel enkelthelt og kontroller migrering.
2. Opprett en ny helt med annet utseende og startvåpen.
3. Tren og tjen gull med den nye helten.
4. Bytt tilbake og kontroller at første helt er uendret.
5. Velg hvert sitt sparemål.
6. Kjøp et våpen med én helt.
7. Kontroller at bare denne heltens gull, tilbud og utstyr endres.
8. Utstyr et eldre eid våpen og kontroller at neste butikktilbud er uendret.
9. Bytt helt flere ganger.
10. Last siden på nytt og kontroller begge profiler og sist-valgt-markering.

Kontroller mobil rundt 390 × 844 og 360 × 640, samt PC.

Test lange navn og titler, flere heltekort og de lengste våpennavnene.

Kjør relevante tester og produksjonsbygg. Rapporter hva som faktisk er verifisert.

## 16. Leveranse

Lever begge funksjonene integrert med eksisterende spill.

Oppsummer:
- Hvordan heltevalg og bytte fungerer.
- Hva som er separat per helt og felles per enhet.
- Hvordan eksisterende lagring migreres og sikkerhetskopieres.
- Hvordan neste butikktilbud beregnes.
- Hvordan eksisterende kjøp og sparemål håndteres.
- Utførte tester og eventuelle begrensninger.

Oppdater spesifikasjon og implementeringsplan.

Ikke push eller deploy til produksjonsgrenen med mindre prosjektinstruksjoner eller separat autorisasjon tillater det.