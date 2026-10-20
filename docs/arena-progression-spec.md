Implementer neste fase i Gangriket: arenaprogresjon med ti kamper, to bosser og mulighet til å spille tidligere kamper igjen.

Les prosjektinstruksjoner, spesifikasjon og eksisterende kode først. Undersøk hvordan butikk, våpen, lagring og arena faktisk er implementert. Behold fungerende løsninger og bygg videre på dem.

Lag en kort plan, implementer funksjonene, kjør relevante tester og produksjonsbygg, og oppdater prosjektdokumentasjonen.

## 1. Målet

Butikken og våpenoppgraderingene skal få en tydelig hensikt gjennom stadig sterkere motstandere.

Spilleren skal oppleve denne rytmen:
- Møte en motstander som er utfordrende.
- Trene eller spare til et bedre våpen.
- Merke et tydelig kraftsprang.
- Klare flere kamper.
- Møte neste utfordring.

Ikke tilpass fiendenes styrke til helten. Hver kamp har faste verdier.

Implementer ti håndlagde kamper nå. Ikke bygg uendelige runder, nye utstyrssystemer eller ekstra spillmoduser i denne oppgaven.

## 2. Bevar eksisterende regler

- Helt tilfeldige gangestykker fra 1–10.
- Riktige svar utløser angrep.
- Eksisterende riktig/feil-respons og fasitvisning beholdes.
- Spill og regning forblir visuelt adskilt.
- Fiendens angrepsklokke pauses under spillstyrt tilbakemelding slik den allerede skal gjøre.
- Trening gir XP.
- Arena gir gull, ikke XP.
- Strength og Magic bestemmer skade sammen med aktivt våpen.
- Health bestemmer heltens maks liv.
- Ingen tap av opptjent fremgang ved nederlag.
- Ingen våpenbytte eller egenskapsfordeling under kamp.

Ikke endre disse grunnreglene for å få balansen til å passe.

## 3. Arenavelger

Knappen «Arena» på heltesiden skal åpne en oversikt over ti kamper.

Bruk en mobilvennlig vertikal løype eller liste med tydelige kampkort. Unngå et stort kart som krever panorering.

Hver kamp har en tydelig status:
- Låst.
- Tilgjengelig, ikke beseiret.
- Beseiret.

Regler:
- Kamp 1 er tilgjengelig fra starten.
- Første seier i kamp N åpner kamp N+1.
- Tidligere beseirede kamper forblir tilgjengelige.
- Tap låser ikke allerede åpne kamper.
- Spilleren kan velge enhver opplåst kamp.
- Bare gyldige, opplåste kamper kan startes, også i selve spillogikken.

Fremhev den neste ubeseirede kampen som hovedmål:
«Neste utfordring: …»

Vis:
- Kampnummer.
- Motstandernavn.
- Liten forhåndsvisning.
- Bossmarkering for kamp 5 og 10.
- Status.
- Gullbelønning.

Neste låste motstander skal være synlig som noe å strekke seg etter. Gjør det tydelig hvilken seier som låser den opp.

## 4. Fiendekatalog

Definer fiendene som data med:
- Stabil ID.
- Kampnummer.
- Navn.
- Kort undertittel eller introduksjon.
- Maks liv.
- Skade.
- Angrepsintervall.
- Gullbelønning per seier.
- Eventuell engangsbonus ved første seier.
- Bossmarkering.
- Visuell definisjon.

Bruk følgende rollebesetning som utgangspunkt:

1. Gøran, den lettere fornærmede slimklumpen.
   Behold eksisterende navn, humor og grunnverdier dersom de ikke er endret i prosjektet.

2. Birger, pinnenes selvutnevnte konge.
   En liten skogkriger med altfor stor selvtillit.

3. Knirk, ridderen av den vaklende rustning.
   En skramlende og overivrig rustningsfigur.

4. Fru Fres, autorisert bråkmaker.
   En liten, hissig ildskapning.

5. BOSS: Baron Buldre, den uforholdsmessig viktige.
   Stor og pompøs, med tydelig bossutseende.

6. Snerk, den nesten usynlige.
   En skyggeaktig figur som er svært fornøyd med egen forkledning.

7. Kaptein Kjepphøy.
   En overdådig utstyrt kriger med mer pynt enn selvinnsikt.

8. Gneldra, den evig misfornøyde.
   En magisk skapning med tydelig temperament.

9. Sir Skrammel, katastrofens nestkommanderende.
   En tung rustningsfigur som forbereder spilleren på sluttbossen.

10. BOSS: Hans Overveldende Majestet, Kong Klask.
    En stor, overdrevet og komisk avslutning på første arenarekке.

Tilpass navn og korte beskrivelser ved behov for å passe spillets tone. Hold dem barnevennlige og lettleste.

Ikke bruk eksterne AI-kall for å generere innhold under spilling.

## 5. Visuell variasjon

Bruk eksisterende grafikkteknikk og stil.

Motstanderne skal ikke bare være samme slimklump med ulik farge. Lag noen få gjenbrukbare figurtyper og varier:
- Silhuett.
- Proporsjoner.
- Farger.
- Våpen eller rekvisitt.
- Hode og ansiktsuttrykk.
- Enkel hvile- og treffanimasjon.

Bossene skal være tydelig større og mer teatralske, men fortsatt passe i kampområdet.

Prioriter lesbare figurer fremfor detaljrikdom. Effekter, figurer og skadetall må aldri dekke regneområdet.

Gi bosskampene en enkel visuell variasjon i arenaen, eksempelvis bannere, lys eller bakgrunnsfarge.

## 6. Balanse mot eksisterende helt og butikk

Undersøk dagens:
- Heltestats.
- Skadeformler.
- Våpenskade.
- Våpenpriser.
- XP-progresjon.
- Gullbelønning.

Lag deretter en konkret balansetabell for de ti kampene og lagre den i dokumentasjonen.

Bruk eksisterende Gøran som anker. Hvis han fortsatt har 80 liv, 6 skade og 5 sekunders angrepsintervall, behold dette som kamp 1.

Øk vanskelighetsgraden hovedsakelig gjennom liv og skade. Behold som utgangspunkt fem sekunder mellom angrep i denne første arenarekken.

Ikke gjør stadig raskere svar til et absolutt krav. En langsommere spiller skal kunne vinne gjennom mer trening, helse og bedre våpen.

Boss 5 og 10 skal være tydelige milepæler. Kamp 6 skal representere videre progresjon, men trenger ikke være vanskeligere enn boss 5 på alle enkeltverdier.

Lag små kraftsprang:
- Et relevant våpenkjøp skal redusere antall nødvendige riktige svar merkbart.
- Noen kamper etter en oppgradering skal føles lettere.
- Ikke skalér fienden automatisk slik at gevinsten fra oppgraderingen forsvinner.

Ikke endre butikkprisene eller heltens progresjon uten et konkret behov. Hvis en mindre justering er nødvendig, dokumenter hvorfor og hvilke verdier som endres.

## 7. Gull og omkamper

Hver seier gir kampens vanlige gullbelønning, også ved omkamp.

Belønningen skal øke med arenafremgangen, slik at vanskeligere kamper gir grunn til å fortsette.

Gi boss 5 og 10 en tydelig engangsbonus ved første seier. Skill denne fra vanlig kampbelønning i både data og resultatvisning.

Eksempel på resultat:
- Kampbelønning: X gull.
- Første bossseier: Y gull.
- Totalt: Z gull.

Ikke gi bonus flere ganger ved:
- Dobbelttrykk.
- Gjentatte slutthendelser.
- Omlasting.
- Omkamp.

Tidligere kamper skal være en legitim måte å spare til neste våpen på. Ikke innfør energisystem, ventetid, daglige begrensninger eller straff for omkamp.

Vurder gull per omtrentlig kamptid, ikke bare gull per seier. Unngå at kamp 1 blir klart beste gullkilde gjennom hele arenarekken. Dokumenter beregningene som anslag, ikke som spillertestet balanse.

## 8. Kampintroduksjon

Når spilleren velger en tilgjengelig kamp, vis:
- Motstanderen.
- Navn og kort humoristisk introduksjon.
- Liv.
- Skade og angrepsintervall.
- Vanlig gullbelønning.
- Eventuell gjenstående førstegangsbonus.
- «Start kamp».
- Retur til arenaoversikten.

Hver kamp starter med:
- Fullt liv for helten.
- Fullt liv for fienden.
- Ny oppgave og null feil.
- Nullstilt angrepsmåler.
- Ingen videreførte effekter eller tidtakere fra forrige kamp.

Ingen kamp starter automatisk ved valg i oversikten.

## 9. Resultat og neste mål

Ved seier:
- Stopp kampreglene.
- Registrer belønning og progresjon samlet.
- Fullfør eksisterende visning av korrekt regnestykke.
- Vis seiersresultatet.

Hvis en ny kamp låses opp:
- Vis tydelig hvem som er låst opp.
- Gi hovedknappen «Neste motstander».
- Knappen åpner introduksjonen, ikke en kamp som begynner umiddelbart.

Andre valg:
- «Kjemp igjen».
- «Arenaoversikt».

Hvis spilleren har et aktivt sparemål:
- Vis oppdatert gullfremgang.
- Hvis våpenet nå kan kjøpes, vis en tydelig vei til butikken.
- Ikke bytt eller kjøp utstyr automatisk.

Ved nederlag:
- Behold all fremgang.
- Vis «Tren litt mer eller prøv et bedre våpen».
- Tilby «Prøv igjen», «Tren» og «Arenaoversikt».
- Gjør butikken tilgjengelig gjennom den vanlige navigasjonen.

Ved seier over kamp 10:
- Vis en tydelig avslutningsfeiring for første arenarekке.
- Opplys at alle ti kampene er beseiret.
- Behold omkamper og butikk tilgjengelig.
- Ikke vis en fungerende «Neste»-knapp til innhold som ikke finnes.
- Ikke implementer uendelig skalering nå.

## 10. Kampsystem

Gjenbruk eksisterende kamplogikk. Den skal motta fiendedata fremfor å være hardkodet til Gøran.

Bevar:
- Én autoritativ kampstatus.
- Entydig rekkefølge på angrep.
- Pause under svarfeedback.
- Manuell pause.
- Pause ved skjult fane med aktiv gjenopptakelse.
- Ingen skjulte oppsamlede angrep.
- Ingen hendelser etter avsluttet kamp.
- Ingen doble tidtakere ved omkamp eller skjermbytte.

Gi hver kampinstans en egen identitet. Forsinkede hendelser fra en gammel kamp skal ikke påvirke den neste.

Kontroller at våpenet og statsene spilleren faktisk har utstyrt, brukes i hver nye kamp.

## 11. Lagring og migrering

Utvid eksisterende versjonerte lagring med arenaprogresjon og registrering av utbetalte førstegangsbonuser.

Behold:
- Helt og utseende.
- XP og nivå.
- Egenskaper.
- Gull.
- Eide våpen.
- Aktivt våpen.
- Sparemål.
- Innstillinger.

Hvis eksisterende lagring allerede registrerer seier over Gøran, bruk dette til å migrere progresjonen korrekt.

Hvis tidligere seiere ikke er lagret, ikke gjett basert på gull eller nivå. Start arenaoversikten med kamp 1 tilgjengelig og behold all annen fremgang.

Lagre ikke en pågående kamp. Omlasting returnerer til en trygg skjerm uten ny belønning eller straff for avbrutt kamp.

Valider lagringsdata og håndter ukjente fiende-ID-er uten å slette øvrig fremgang.

## 12. Tester og balanseverifisering

Test:
- Bare kamp 1 er åpen for en ny helt.
- Seier åpner akkurat neste kamp.
- Tap endrer ikke opplåsning.
- Tidligere kamper kan spilles igjen.
- Låste kamper ikke kan startes gjennom spillogikken.
- Vanlig belønning gis én gang per kampinstans.
- Førstegangsbonus gis én gang totalt.
- Omkamp gir vanlig belønning, men ikke brukt bonus.
- Kamp 10 håndteres uten ugyldig neste kamp.
- Fiendeverdiene kommer fra riktig katalogoppføring.
- Gamle kampinstanser ikke påvirker nye.
- Lagring og migrering bevarer fremgangen.

Lag en enkel, deterministisk balanseberegning eller simulering for representative helter:
- Starthelt.
- Helt med første kjøpte våpen.
- Helt med mellomste våpen.
- Helt med sterkeste våpen og flere fordelte egenskapspoeng.

Sammenlign omtrentlige svarintervaller på 2, 5 og 8 sekunder med riktige svar. Modellér feedbackpauser slik spillet faktisk fungerer.

Målet er å oppdage åpenbare problemer, ikke å bevise at balansen er perfekt.

Vis for utvalgte tilfeller:
- Antall riktige svar for å vinne.
- Omtrent hvor mange fiendeangrep helten tåler.
- Om helten rekker å vinne.
- Omtrent gull per minutt.

Test deretter den faktiske flyten i nettleser når miljøet støtter det:
- Ny helt.
- Seier og opplåsning.
- Nederlag.
- Omkamp.
- Bossbonus.
- Butikk etter seier.
- Nytt våpen i neste kamp.
- Omlasting.
- Mobil og PC.

Bruk isolerte testdata. Ikke nullstill brukerens eksisterende fremgang.

## 13. Leveranse

Lever en fungerende arenarekке integrert med helten og butikken.

Oppsummer:
- Hva som er implementert.
- Balansetabellen for alle ti kamper.
- Hvordan opplåsning og belønninger fungerer.
- Hvordan gamle lagringer migreres.
- Testresultater og kjente begrensninger.
- Hvor fiender, belønninger og balanseverdier endres.

Oppdater spesifikasjon og faseplan.

Ikke push eller deploy til produksjonsgrenen med mindre prosjektinstruksjoner eller separat autorisasjon fra meg tillater det.

Målet er at neste motstander alltid er et tydelig mål, og at trening og nye våpen gir en merkbar mulighet til å komme videre.