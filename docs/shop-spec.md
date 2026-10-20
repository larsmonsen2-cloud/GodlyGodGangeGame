Implementer neste fase i Gangriket: våpenbutikk og synlige utstyrsoppgraderinger.

Les prosjektinstruksjoner, eksisterende spesifikasjon og kode først. Bygg videre på det som fungerer. Ikke start prosjektet på nytt eller endre teknologistakken.

Lag en kort plan, implementer funksjonen, kjør relevante tester og produksjonsbygg. Oppdater prosjektdokumentasjonen med faktisk implementert oppførsel.

## 1. Formålet

Vi skal fullføre denne spilløkonomien:

Trene → bli sterkere → vinne arenakamper → tjene gull → kjøpe et kulere våpen → se og prøve forbedringen.

Butikken skal gi spilleren noe konkret å spare til. Kjøpet skal merkes både visuelt og i kamp.

Dette skal være et faktisk fungerende tillegg til eksisterende spill, ikke en isolert butikkdemo.

## 2. Bevar eksisterende designvalg

- Spilleren velger ett startvåpen ved opprettelse av helten.
- Ikke gi spilleren begge startvåpnene gratis.
- Spilleren beholder startvåpenet til et nytt våpen kjøpes.
- Nytt våpen utstyres automatisk.
- Behold enkle egenskapsvalg mellom styrke, magi og helse.
- Ikke legg tilbake detaljerte effektforklaringer i egenskapsvalget.
- Heltens totale stats og synlige utstyr er belønningen for oppgraderingene.
- Behold oppgavegenerering, svarrespons, kampregler og skillet mellom spill og regning.
- Level skal fortsatt ikke legges direkte til skade.

Ikke endre eksisterende arena- eller XP-balanse som del av denne oppgaven.

## 3. Omfang

Implementer:
- Butikk som nås fra heltesiden.
- Kjøp og automatisk utstyr av våpen.
- En enkel oversikt over eide våpen, med mulighet til å utstyre dem igjen.
- Tre kjøpbare nærkampvåpen og tre kjøpbare magivåpen.
- Synlig forskjell mellom våpnene på heltesiden, i trening og i arena.
- Korrekt skade fra aktivt våpen.
- Lokal lagring av kjøp, eierskap og aktivt våpen.
- Ett valgfritt sparemål.
- En kort og tilfredsstillende kjøpssekvens.

Ikke implementer rustning, skjold, salg, forbruksgjenstander, tilfeldig loot, våpenforbedring med materialer, betalt valuta eller nye arenaer nå.

Utstyrsoppgradering betyr i denne fasen å kjøpe og utstyre et bedre våpen.

## 4. Våpenkatalog

Bruk en datadrevet katalog med stabile ID-er.

Hvert våpen skal ha:
- ID.
- Navn.
- Kort humoristisk beskrivelse.
- Våpentype.
- Egenskap det skalerer med.
- Våpenskade.
- Pris.
- Visuell definisjon eller referanse.
- Et enkelt progresjonstrinn.

Behold eksisterende startvåpen og deres verdier.

Legg til følgende startkatalog. Prisene og skaden samles i konfigurasjon og kan senere justeres.

NÆRKAMP – skalerer med Strength:

1. Det urimelig selvsikre jernsverdet
   Pris: 50 gull.
   Våpenskade: 7.
   Beskrivelse: «Har vunnet alle diskusjoner med smørkniver.»
   Utseende: tydelig metallklinge, enkelt håndtak og parerstang.

2. Den fullstendig unødvendige kjempekløyveren
   Pris: 125 gull.
   Våpenskade: 13.
   Beskrivelse: «For deg som mener at presisjon er en unødvendig begrensning.»
   Utseende: bredere, større klinge med markante detaljer.

3. Den katastrofalt overlegne infernoklingen
   Pris: 250 gull.
   Våpenskade: 22.
   Beskrivelse: «Smidd i en døende stjerne. Egner seg også til toast.»
   Utseende: mørk klinge med glødende, varme detaljer og en diskret ildaktig effekt.

MAGI – skalerer med Magic:

1. Den overraskende kompetente lærlingstaven
   Pris: 50 gull.
   Våpenskade: 7.
   Beskrivelse: «Har lest nesten hele bruksanvisningen.»
   Utseende: trestav med en liten tydelig krystall.

2. Den høyst selvhøytidelige stormstaven
   Pris: 125 gull.
   Våpenskade: 13.
   Beskrivelse: «Krever å bli tiltalt som Deres Elektriske Høyhet.»
   Utseende: større krystall med blå detaljer og diskret gnist.

3. Den ultimate kosmiske katastrofekvisten
   Pris: 250 gull.
   Våpenskade: 22.
   Beskrivelse: «Universet har bedt den om å roe seg ned.»
   Utseende: ornamentert stav med stor lilla krystall og en enkel aura.

Effektene er kosmetiske i denne fasen. Ikke implementer brannskade, kjedelyn, statuseffekter eller andre skjulte bonusmekanikker.

Tillat direkte kjøp av et senere våpen hvis spilleren har råd. Tidligere våpen i serien er ikke et kjøpskrav.

Katalogen er endelig i denne fasen. Ikke markedsfør den som uendelig. Strukturen skal tillate flere våpen og senere generering uten å endre kjøpslogikken.

## 5. Butikkens grensesnitt

Mobil først, i samme fantasyuttrykk som eksisterende spill.

Øverst:
- Tittel «Våpensmeden».
- Tilgjengelig gull.
- Tydelig retur til helten.
- Enkel filtrering: «Alle», «Nærkamp», «Magi».

Vis hvert våpen med:
- Stor, gjenkjennelig våpenillustrasjon.
- Fullt navn med ryddig linjebryting.
- Humoristisk beskrivelse.
- Våpentype og relevant egenskap.
- Våpenskade.
- Faktisk total skade for denne helten.
- Sammenligning med aktivt våpens totale skade.
- Pris.
- Tydelig kjøps- eller utstyrsknapp.

Eksempel:
«Styrke 7 + våpen 7 = 14 skade»
«+4 skade sammenlignet med våpenet du bruker»

Sammenlign alltid faktisk total skade, ikke bare våpenskade. Det er særlig viktig ved bytte mellom nærkamp og magi.

Vis også negative forskjeller tydelig. Et dyrere magivåpen er ikke nødvendigvis bedre for en helt som har investert mye i Strength.

Bruk tekst og symboler i tillegg til farger.

Tilstander:
- Ikke eid, har råd: «Kjøp og utstyr · 50 gull».
- Ikke eid, mangler gull: deaktivert kjøpsknapp og «Mangler 25 gull».
- Eid, ikke aktivt: «Utstyr».
- Eid og aktivt: «Utstyrt».

Ingen bekreftelsesdialog for vanlige våpenkjøp. Knappeordlyden skal være tydelig.

Butikken kan scrolle. Behold den eksisterende regelen om stabilt, todelt oppsett under trening og kamp.

## 6. Eierskap og automatisk utstyr

Ved kjøp:
1. Kontroller at våpenet finnes og ikke allerede er eid.
2. Kontroller at spilleren har nok gull.
3. Trekk korrekt pris én gang.
4. Legg våpenet til eide våpen.
5. Sett våpenet som aktivt.
6. Lagre den nye tilstanden.
7. Vis kjøpsresponsen.

Utfør endringene som én samlet tilstandsoppdatering. Ikke stol på at en deaktivert knapp alene hindrer dobbeltkjøp.

Gamle våpen beholdes. Spilleren kan utstyre et eid våpen gratis igjen via butikken.

Bare valgt startvåpen skal være eid ved opprettelse. Ikke gjør det andre startvåpenet gratis gjennom migrering eller katalogvisning.

Ingen salg eller refusjon i denne fasen.

Våpenbytte og kjøp er bare mulig utenfor pågående kamp.

## 7. Skade og angrepsform

Behold eksisterende regler:
- Nærkampskade = Strength + aktivt våpens skade.
- Magisk skade = Magic + aktivt våpens skade.
- Ingen direkte Level-bonus.
- Ingen endring av egenskaper ved våpenbytte.

Aktivt våpen bestemmer:
- Hvilken egenskap som brukes.
- Angrepsform.
- Våpenets utseende.
- Relevant prosjektil- eller treffeffekt.

Kontroller at ny skade brukes umiddelbart i både trening og neste arenakamp.

Ikke hardkod spillreglene rundt de opprinnelige to startvåpen-ID-ene. Bruk våpendata og behold én felles skadeberegning for butikk, helteside og kamp.

## 8. Kjøpet skal føles som en belønning

Etter kjøp vises en kort kjøpsvisning:
- «Nytt våpen!».
- Stor forhåndsvisning av helten med det nye våpenet.
- Våpenets navn.
- Gammel → ny total skade.
- En kort glød eller enkel feiring.
- Knapper: «Prøv i trening» og «Fortsett å handle».

Ingen obligatorisk lang ventetid.

På heltesiden oppdateres:
- Våpenet i hånden.
- Navn og beskrivelse.
- Skadeformelen.
- Total skade.
- Gull.

Fremhev endrede tall kort. Ikke gi inntrykk av at et kjøp med lavere total skade er en skadeøkning.

## 9. Synlige våpen

Bruk prosjektets eksisterende grafikkteknikk. Bygg videre på plassholderstilen.

Våpnene skal kunne skilles på mer enn farge:
- Silhuett.
- Størrelse.
- Klinge eller stavhode.
- Detaljer.
- Diskrete effekter på de sterkeste våpnene.

Samme våpendefinisjon skal brukes i:
- Butikkillustrasjon.
- Helteside.
- Trening.
- Arena.

Behold riktige festepunkter i hånden. Store våpen må ikke klippes eller dekke regneområdet. Partikler og glød må ikke krysse skillet mellom spill og regning.

Støtt redusert bevegelse. Ikke bruk eksterne bilde- eller AI-tjenester i spillet.

## 10. Ett tydelig sparemål

Spilleren kan velge ett ikke-eid våpen med «Spar til dette».

Lagre valget.

Vis en kompakt målvisning:
- På heltesiden.
- I øvre spillområde under trening og arena dersom plassen tillater det.
- Etter arenaseier.

Eksempel:
«Neste våpen: Det urimelig selvsikre jernsverdet»
«25 / 50 gull – mangler 25»

Når spilleren har råd:
«Du har råd!» med vei til butikken utenfor aktiv kamp.

Under kamp er målvisningen kun informasjon, ikke en vei ut til kjøp.

Viktig:
- Trening gir fortsatt XP, ikke gull.
- Ikke antyd at riktige treningssvar øker gullmålet.
- Behold treningsmålet om neste nivå.
- Ikke press ekstra måltekst inn hvis det ødelegger mobiloppsettet.

Når mål-våpenet kjøpes, fjern målet og tilby å velge et nytt i butikken. Ikke sett et nytt mål automatisk på spillerens vegne.

Ikke beregn «én seier igjen» fra en hardkodet belønning dersom prosjektet har andre belønningsregler. Vis heller manglende gull.

## 11. Lagring og migrering

Eksisterende helter og fremgang skal bevares.

Undersøk dagens lagringsformat før endring.

Utvid formatet med:
- Eide våpen-ID-er.
- Aktiv våpen-ID.
- Valgfri sparemål-ID.
- Oppdatert versjon hvis nødvendig.

Migrer gamle lagringer:
- Behold navn, utseende, XP, nivå, egenskaper, gull og innstillinger.
- Registrer eksisterende aktivt startvåpen som eid.
- Ikke tildel ekstra gratis våpen.
- Ikke nullstill helten.

Valider referanser mot katalogen. Bruk en tydelig, trygg reservehåndtering for ukjente ID-er uten å slette øvrig fremgang.

Gjenbruk prosjektets håndtering av utilgjengelig lagring.

## 12. Test og verifisering

Skriv fokuserte tester for:
- Kjøp med akkurat nok gull.
- Avvist kjøp med for lite gull.
- At gull aldri blir negativt.
- At gjentatte kjøpshendelser ikke tar betalt flere ganger.
- At eid våpen ikke kan kjøpes på nytt.
- Automatisk utstyr etter kjøp.
- Gratis bytte til tidligere eid våpen.
- Korrekt skade ved bytte mellom nærkamp og magi.
- At egenskapene ikke endres ved våpenbytte.
- At sparemål oppdateres eller fjernes riktig.
- At gamle lagringer migreres uten tap.
- At kjøp og aktivt våpen overlever omlasting.

Test hele løkken i nettleser når miljøet støtter det:
1. Åpne en eksisterende helt.
2. Gå til butikken.
3. Velg et sparemål.
4. Kontroller oppførsel med for lite gull.
5. Tjen gull i arenaen.
6. Kjøp og utstyr et våpen.
7. Se våpenet og ny skade på heltesiden.
8. Prøv det i trening og arena.
9. Bytt til et annet eid våpen.
10. Last siden på nytt og kontroller tilstanden.

Bruk isolerte testdata ved behov. Ikke nullstill eksisterende brukerfremgang.

Kontroller mobil rundt 390 × 844 og 360 × 640, samt PC. Lange navn, våpenillustrasjoner og pris-/skadetekst skal ikke ødelegge oppsettet.

Kjør relevante eksisterende tester og produksjonsbygg. Rapporter hva som faktisk er verifisert.

## 13. Leveranse og avgrensning

Lever en fungerende butikk integrert med spillet.

Oppsummer:
- Hva som er implementert.
- Hvordan kjøp, eierskap og utstyr fungerer.
- Hvordan gamle lagringer bevares.
- Utførte tester og eventuelle begrensninger.
- Hvor katalog, priser, skade og visuelle definisjoner endres.

Ikke implementer nye arenaer eller uendelig utstyrsgenerering i denne oppgaven. Ikke deploy eller push til produksjonsgrenen med mindre prosjektinstruksjoner eller en separat instruks fra meg autoriserer det.

Målet er at jeg etter en arenaseier får lyst til å kjøpe et våpen, se det på helten og umiddelbart prøve hvor mye hardere jeg slår.