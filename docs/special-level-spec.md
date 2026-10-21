Implementer to forbedringer i Gangriket:
1. Spesialangrep som utløses av fem riktige svar på rad.
2. En tydelig og stilig nivåvisning på heltesiden.

Denne spesifikasjonen erstatter tidligere forslag om spesialangrep der feil svar ikke nullstilte ladningen.

Les prosjektinstruksjoner, spesifikasjon og eksisterende kode først. Bygg videre på fungerende løsninger. Dersom deler allerede er implementert, tilpass disse fremfor å lage parallelle systemer.

Lag en kort plan, implementer funksjonene, kjør relevante tester og produksjonsbygg, og oppdater dokumentasjonen.

## 1. Mål og avgrensning

Gi spilleren et konkret mål under trening og kamp:
«Ett riktig svar til, så kommer superslaget!»

Spesialangrepet skal belønne presisjon. Feil bryter rekken.

Gjør samtidig heltens nivå til en tydelig visuell prestasjon på heltesiden.

Behold:
- Helt tilfeldige gangestykker.
- Eksisterende riktig/feil-respons og fasitvisning.
- Enkle egenskapsvalg.
- Separate helter og deres fremgang.
- Butikk, våpen, titler og arenaprogresjon.
- Absolutt visuelt skille mellom spill og regning.

Ikke legg til nye våpen, fiender, egenskaper, mana eller ekstra kampknapper. Ikke endre eksisterende XP- eller økonomibalanse.

## 2. Fem riktige svar på rad

Bruk fem sammenhengende riktige, innsendte svar som terskel. Samle terskelen i konfigurasjon.

Regler:
- Hvert riktig svar øker rekken med én.
- Riktige svar nummer 1–4 gir vanlige angrep.
- Det femte riktige svaret utløser spesialangrepet automatisk.
- Spesialangrepet erstatter det vanlige angrepet på dette svaret.
- Etter utløsning nullstilles rekken.
- Ethvert innsendt feil svar nullstiller rekken umiddelbart, også første feil på en oppgave.
- Et riktig svar på andre forsøk starter en ny rekke på 1/5 og gir et vanlig angrep.
- Andre feil, fasitvisning og «Neste» gir ingen ladning.
- Tom innsending, sletting og inntasting uten innsending påvirker ikke rekken.

Eksempler:
- Riktig, riktig, riktig, riktig, riktig → spesialangrep.
- Fire riktige, feil → 0/5.
- Fire riktige, feil, riktig på andre forsøk → 1/5.
- Etter et spesialangrep starter neste riktige svar en ny rekke på 1/5.

Det kreves ingen bestemt svarhastighet. Langsomt, riktig svar teller like mye som et raskt.

Ingen ekstra aktiveringsknapp. Gangestykkene er fortsatt eneste kontroll for angrep.

Nullstillingen gir ingen ekstra skade på helten, XP-tap eller gulltap.

## 3. Skade

Start med:
Spesialskade = 2 × vanlig angrepsskade.

Bruk eksisterende felles skadeberegning:
- Nærkamp bruker Strength og aktivt våpen.
- Magi bruker Magic og aktivt våpen.
- Level gir ingen direkte skadebonus.

Det femte riktige svaret gir ett angrep på dobbel skade, ikke et vanlig angrep i tillegg.

Spesialangrepet gir:
- Vanlig XP for ett riktig svar i trening.
- Ingen ekstra XP eller gull.
- Ett samlet skadeutfall.

Ingen tilfeldige kritiske treff, statuseffekter eller ekstra mål i denne fasen.

Ikke øk automatisk fiendenes verdier for å oppheve fordelen. Dokumenter eventuelle tydelige balanseproblemer før andre justeringer vurderes.

## 4. Rekketøyens levetid

Rekken er midlertidig økttilstand:
- Starter på null ved ny treningsøkt.
- Starter på null ved ny arenakamp og omkamp.
- Beholdes ved manuell pause i samme økt.
- Beholdes når fanen skjules og samme økt gjenopptas.
- Nullstilles når økten avsluttes.
- Overføres ikke mellom trening og arena.
- Overføres ikke mellom helter.
- Lagres ikke ved omlasting.

Ikke nullstill rekken ved nivådialog eller egenskapsvalg dersom spilleren fortsetter i samme treningsøkt.

Spilleren skal ikke kunne lade på dummyen og ta med ladningen til arenaen.

## 5. Måler i spillområdet

Vis en kompakt måler med fem segmenter i ØVRE spillområde, både i trening og arena.

Vis:
- Spesialangrepets navn eller en kort passende etikett.
- Fem tydelige segmenter.
- Status som «3/5 riktige på rad».

Ved 4/5:
- Vis «Ett riktig til superslag!» eller tilsvarende for magi.
- Gi måleren en tydelig, rolig glød.

Ved riktig svar:
- Neste segment fylles med en kort puls.

Ved femte riktige svar:
- Full måler vises kort samtidig med spesialangrepet.
- Deretter går den visuelt tilbake til tom.

Den logiske rekken nullstilles ved utløsning. Visuell fullføring kan skje separat uten å påvirke spillreglene.

Ved feil:
- Nullstill logisk rekke umiddelbart.
- Hvis rekken var større enn null, slukk fylte segmenter med en kort effekt.
- Vis kort «Rekken brutt».
- Ikke legg til en dialog eller ekstra ventetid.
- Hvis rekken allerede er null, er vanlig feilrespons tilstrekkelig.

Måleren skal:
- Ha fast plass og størrelse.
- Ikke flytte livsmålere eller andre kontroller.
- Bruke tekst eller form i tillegg til farge.
- Ikke dekke figurene.
- Ikke krysse skillet til regneområdet.
- Ikke gjøre mobiloppsettet høyere enn skjermen.

Prioriter liv og fiendens angrepsmåler hvis plassen er trang. Gjør spesialmåleren kompakt fremfor å krympe regnefelt eller tastatur.

## 6. Spesialangrep for nærkamp og magi

NÆRKAMP:
Navn: «Det fullstendig unødvendige superslaget».

Visuelt:
- Et kort, tydelig opptrekk.
- Helten løfter eller trekker våpenet bakover.
- Et raskt, kraftig slag med større slagbue.
- Dummyen eller fienden får tydeligere tilbakeslag.
- Ett stort skadetall merket «SUPER!».
- Eventuelt en kort, lokal risting av spillområdet.

MAGI:
Navn: «Den urimelig store magismellen».

Visuelt:
- Stavhodet eller krystallen lyser opp.
- Et større magisk prosjektil skytes ut.
- En kort eksplosjon eller magisk ring ved treff.
- Målet reagerer tydelig.
- Ett stort skadetall merket «SUPER!».

Bruk eksisterende figur- og effektteknikk. Våpenet spilleren faktisk har utstyrt, skal fortsatt vises riktig.

Effektene skal være tydelig kraftigere enn vanlige angrep, men korte og lesbare.

De lange navnene må ikke sprenge mobiloppsettet. Bruk korte etiketter i den kompakte måleren ved behov.

## 7. Timing og regnefelt

Behold eksisterende grønne bekreftelse av korrekt likhet og røde feilrespons.

Spesialangrepet spiller samtidig med riktig-svar-visningen. Tilpass animasjonen slik at den normalt fullføres innen eksisterende feedbackperiode.

Ikke legg til lang obligatorisk ventetid etter hvert femte riktige svar.

Behold eksisterende pause av fiendens angrepsklokke under svarfeedback. Ikke opprett en konkurrerende pausemekanisme.

All kamprespons skjer øverst:
- Ingen eksplosjoner over gangestykket.
- Ingen skadetall over tastaturet.
- Ingen fullskjermsristing.
- Ingen partikler over skillet.

Når rekken brytes, skjer målereffekten øverst samtidig med eksisterende feilrespons nederst.

Spillreglene beregner skade nøyaktig én gang. Animasjonens treffpunkt visualiserer resultatet og må ikke tildele skade på nytt.

Hvis spesialangrepet beseirer fienden:
- Avslutt kampreglene umiddelbart.
- Fullfør den korte treffeffekten og korrekt likhet.
- Vis deretter seiersresultatet.
- Gi belønning én gang.

## 8. Robust implementering

Håndter rekke og spesialangrep i den autoritative spillogikken, ikke som selvstendige tellere i animasjonskomponenter.

Knytt handlinger til:
- Helte-ID.
- Økt- eller kamp-ID.
- Oppgave-ID.

Én korrekt innsending skal bare kunne:
- Øke rekken én gang.
- Gi ett angrep.
- Gi én vanlig XP-belønning der dette gjelder.

Gjenta ikke handlinger ved React-remontering, raske tastetrykk eller animasjonscallbacks.

Gamle callbacks skal ikke påvirke ny oppgave, ny kamp eller ny helt.

## 9. Lyd, tilgjengelighet og ytelse

Gjenbruk eksisterende lydinnstilling.

Spesialangrep kan ha:
- En kort oppladningslyd.
- En kraftigere trefflyd.

Ingen ny bakgrunnsmusikk.

Respekter redusert bevegelse:
- Ingen kameraristing.
- Færre partikler og mindre skalering.
- Behold tydelig tekst og skadetall.

Unngå gjentatt blinking og kraftige fullskjermsglimt.

Begrens effekter på mobil og rydd opp partikler, lyder og animasjoner etter bruk.

## 10. Tydelig nivåvisning på heltesiden

Gjør nivået til et synlig fantasyemblem ved helten eller navnet.

Emblemet skal ha:
- Stor, tydelig nivåverdi.
- «NIVÅ» som mindre etikett.
- Form som skjold, medaljong eller lignende.
- God kontrast og en tydelig silhuett.
- Stil som passer eksisterende spill.

Ikke dekk ansikt, våpen, tittel eller viktige kontroller.

Helten skal fortsatt være hovedattraksjonen. Emblemet skal være betydelig tydeligere enn liten vanlig nivåtekst, men ikke dominere hele siden.

Plasser eksisterende XP-måler i tydelig sammenheng med emblemet:
- Nåværende XP / XP til neste nivå.
- Antall riktige svar til neste nivå.

Unngå unødvendig duplisering av nivåinformasjon flere steder på samme skjerm.

Bruk faktisk nivå fra spilltilstanden. Ikke innfør et separat kosmetisk nivå eller kampkrafttall.

## 11. Emblemet utvikler seg

Bruk følgende foreløpige visuelle trinn, samlet i konfigurasjon:

- Nivå 1–4: enkelt jernemblem.
- Nivå 5–9: bronse med tydelig kant.
- Nivå 10–19: sølv med dekor.
- Nivå 20–39: gull med liten krone eller vinger.
- Nivå 40+: rikt dekorert emblem med diskret magisk glød.

Dette gir ingen spillmessig bonus.

Bruk forskjeller i form og dekor, ikke bare farge.

Emblemet skal bare følge faktisk level. Ikke bruk heltekrønikens pompøsitetstrinn, siden dette også kan påvirkes av bossseire.

Vis hele nivåverdien. Støtt to, tre og flere sifre ved å tilpasse skriftstørrelse eller emblemets bredde.

## 12. Feiring ved nivåøkning

Gjenbruk eksisterende nivåfeiring og egenskapsvalg.

Ved nivåøkning:
- Vis nytt nivå med emblemet i eksisterende feiring.
- Behold enkle valg mellom styrke, magi og helse.
- Ikke legg til en egen modal bare for emblemet.
- Ikke avbryt korrekt-likhet-visningen eller et spesialangrep.

Når spilleren kommer tilbake til heltesiden etter nivåøkning:
- Gi emblemet én kort puls eller glød.
- Fremhev nytt nivå.
- La effekten roe seg helt ned.

Hvis flere nivåer er oppnådd siden sist:
- Vis én samlet effekt for siste nivå.
- Ikke spill en kø av animasjoner.

Feiringen skal ikke gjentas ved hver rendering eller hvert skjermbesøk.

Ved heltebytte skal riktig emblem og eventuell uviste feiring følge riktig helt.

## 13. Lagring og migrering

Rekken for spesialangrep skal ikke lagres permanent.

Nivåemblemet beregnes fra eksisterende level.

Hvis du trenger et felt for sist viste nivåfeiring:
- Lagre det per helt.
- Migrer eksisterende helter med nåværende nivå som allerede vist.
- Ikke spill av gamle nivåfeiringer ved første åpning etter oppdatering.

Behold alle eksisterende helter og deres:
- XP og nivå.
- Egenskaper.
- Gull.
- Utstyr.
- Sparemål.
- Arenaprogresjon.
- Utseende.
- Titler og krøniker.
- Innstillinger.

Ingen unødvendig nullstilling eller endring av eksisterende fremgang.

## 14. Tester

Test spesialangrep:
- De første fire riktige svarene gir vanlig skade.
- Femte riktige på rad gir nøyaktig dobbel skade.
- Femte svar gir ikke vanlig skade i tillegg.
- Rekken nullstilles etter spesialangrepet.
- Fire riktige og én feil gir 0/5.
- Første feil på en oppgave nullstiller umiddelbart.
- Riktig svar på andre forsøk starter på 1/5.
- Andre feil og fasitvisning gir ingen ladning.
- Tom innsending og redigering påvirker ikke rekken.
- Trening gir vanlig XP ved spesialangrep.
- Nærkamp og magi bruker korrekt egenskap og våpen.
- Pause og nivådialog beholder rekken i samme økt.
- Ny kamp, omkamp, ny treningsøkt og heltebytte nullstiller.
- Gamle callbacks ikke påvirker ny helt eller økt.
- Dødelig spesialangrep gir én seier og én belønning.

Test nivåvisning:
- Riktig nivå og XP vises.
- Emblem skifter ved riktige nivågrenser.
- Bossseier alene ikke endrer nivåemblemet.
- Lange nivåverdier passer.
- Feiring ikke gjentas ved vanlig rendering eller navigasjon.
- Helter har uavhengig visning.
- Migrering bevarer fremgangen.

Test visuelt i nettleser hvis miljøet støtter det:
- Fem riktige på rad i trening og arena.
- Fire riktige, så feil.
- Ny rekke etter feil.
- Begge våpentyper.
- Store våpen.
- Spesialangrep som avslutter kamp.
- Nivåøkning som sammenfaller med spesialangrep.
- Retur til heltesiden etter nivåøkning.
- Mobil rundt 390 × 844 og 360 × 640, samt PC.
- Redusert bevegelse og lyd av.

Bruk isolerte testdata. Ikke endre brukerens eksisterende fremgang for å teste høye nivåer.

Kjør relevante tester og produksjonsbygg. Rapporter ærlig hva som er verifisert.

## 15. Leveranse

Lever begge forbedringene integrert med eksisterende spill.

Oppsummer:
- Hva som er implementert.
- Hvordan riktig-rekken, nullstilling og skade fungerer.
- Hvordan nivåemblemet utvikler seg.
- Hvor terskel, skademultiplikator, effektvarigheter og emblemgrenser endres.
- Utførte tester og eventuelle begrensninger.

Oppdater spesifikasjon og implementeringsplan.

Ikke push eller deploy til produksjonsgrenen uten autorisasjon fra prosjektinstruksjoner eller en separat beskjed.

Målet er at fem riktige på rad gir et tydelig og tilfredsstillende superslag, og at heltesiden viser nivået som en prestasjon spilleren er stolt av.