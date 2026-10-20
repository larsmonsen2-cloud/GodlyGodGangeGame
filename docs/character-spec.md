Implementer neste fase i Gangriket: en bedre karakterbygger og en personlig heltebeskrivelse som blir mer pompøs etter hvert som helten utvikler seg.

Les prosjektinstruksjoner, spesifikasjon og eksisterende kode først. Undersøk hvordan helten tegnes, hvordan utstyr vises, og hvordan fremgang lagres.

Bygg videre på eksisterende systemer. Ikke start prosjektet på nytt eller endre teknologistakken.

Lag en kort plan, implementer funksjonene, kjør relevante tester og produksjonsbygg, og oppdater dokumentasjonen.

## 1. Målet

Spilleren skal få sterkere eierskap til helten gjennom:
- Et utseende de selv velger.
- Et stort og levende helteportrett.
- En tittel og heltekrønike som følger faktiske prestasjoner.
- Humor som blir mer overdreven og pompøs med progresjonen.

Helten skal begynne som en lokal optimist med en pinne og gradvis omtales som en nærmest kosmisk autoritet.

Humoren skal være varm, absurd og barnevennlig. Gjør narr av heltens overdrevne selvbilde, ikke av barnets regneferdigheter eller feil.

Dette er kosmetikk og progresjonstekst. Ikke endre kampbalanse, XP, våpenpriser, egenskaper eller oppgaveflyt.

## 2. Karakterbygger

Utvid «Lag helt» med følgende utseendevalg:

- Hudtone: 6 alternativer.
- Hårstil: 5 alternativer, inkludert skallet.
- Hårfarge: 6 alternativer.
- Ansiktsuttrykk: barsk, lur, overlegen og lettere bekymret.
- Ekstra detalj: ingen, skjegg, bart eller ansiktsmaling.
- Klesfarge: 6 alternativer.

Behold:
- Navnevalg.
- Valg av ett startvåpen.
- Eksisterende regler for hva spilleren eier ved opprettelse.

Utseendevalg gir ingen spillmessige fordeler eller ulemper.

Ikke krev valg av kjønn. Alle kombinasjoner skal være tilgjengelige.

Forhåndsvisningen skal:
- Vise helten stor og tydelig.
- Oppdateres umiddelbart.
- Vise valgt startvåpen.
- Ha en enkel hvilebevegelse.
- Gjøre forskjellene mellom valgene lette å se.

Legg til «Tilfeldig utseende»:
- Trekker en gyldig kombinasjon av utseendevalg.
- Endrer ikke navn eller startvåpen.
- Gir ingen endringer i stats.

Ved skallet hårstil kan hårfargekontrollen skjules eller deaktiveres, men valgt hårfarge beholdes til en annen frisyre velges.

## 3. Mobilgrensesnitt

Karakterbyggeren skal fungere godt på mobil:
- Stor forhåndsvisning øverst.
- Kompakte, tydelig merkede kategorier under.
- Visuelle valgknapper, ikke bare nedtrekkslister.
- Tydelig markering av valgt alternativ.
- Tilgjengelige navn på fargeprøver og ikonknapper.
- Farge er ikke eneste signal for valgt tilstand.
- Ingen horisontal sidescrolling.

Karakterbyggeren kan scrolle vertikalt. Regelen om stabil todelt skjerm gjelder fortsatt trening og kamp.

Ikke press alle valgene inn på én skjerm dersom det gir små kontroller. Bruk enkle kategorier eller sammenleggbare seksjoner.

## 4. Endre utseende senere

Legg til «Endre utseende» på heltesiden.

Denne åpner samme karakterbygger, men:
- Endrer bare kosmetikk.
- Tilbyr ikke nytt gratis startvåpen.
- Beholder navn, stats, utstyr, eierskap, gull og progresjon.
- Viser heltens nåværende utstyr i forhåndsvisningen.

Bruk en midlertidig kopi under redigering:
- «Lagre utseende» lagrer endringene.
- «Avbryt» forkaster dem.

Ikke lagre hvert klikk permanent mens spilleren fortsatt redigerer.

## 5. Felles grafikk for helten

Bruk eksisterende grafikkteknikk og behold en sammenhengende stil.

Samme utseendedata og visuelle definisjon skal brukes i:
- Karakterbygger.
- Helteside.
- Butikkens helteforhåndsvisning.
- Treningsplass.
- Arena.
- Kjøps- og seiersvisninger der helten vises.

Unngå separate implementeringer som gjør at helten ser forskjellig ut på ulike skjermer.

Bruk tydelig lagdeling for:
- Kropp og hud.
- Klær.
- Hode og ansikt.
- Hår og ekstra detalj.
- Våpen og eksisterende utstyr.

Behold våpenets festepunkt og animasjoner.

Kjøpt utstyr skal ikke forsvinne når utseendet endres. Eventuell eksisterende rustning eller hjelm skal kunne vises over grunnutseendet.

Ansiktsuttrykkene skal være synlig forskjellige med enkle endringer i øyenbryn, øyne og munn. Midlertidige kampreaksjoner kan overstyre uttrykket, men helten går tilbake til valgt uttrykk etterpå.

Ikke bruk eksterne bilde- eller AI-tjenester under spilling.

## 6. Navn, tittel og heltekrønike

Gi helten tre tekstlag:

1. Navn:
   Spillerens eksisterende navn.

2. Tittel:
   En kort, pompøs undertittel som vises under navnet.

3. Heltekrønike:
   To–tre korte setninger på heltesiden.

Tittelen må kunne brytes over flere linjer uten å ødelegge mobiloppsettet. Ikke vis lange titler i kampens kompakte livsmåler; bruk navnet der.

Heltekrøniken skal være lett å lese. Mer pompøs betyr ikke stadig lengre avsnitt.

Bruk norske, håndskrevne maler. Ingen AI-kall under spilling.

## 7. Hva teksten skal bygge på

Bruk faktisk lagret progresjon:

- Heltens nivå bestemmer grunntrinnet for pompøsitet.
- Fordelte egenskapspoeng bestemmer heltens profil.
- Dokumenterte arenaseire bestemmer hvilke bragder som kan omtales.
- Første boss og siste boss skal gi egne formuleringer.

Ikke bruk våpenbytte som grunn til å omskrive heltens personlighet.

Ikke la hudtone, hår eller andre kosmetiske valg påvirke titler eller heltestatus.

Profiler:
- Styrke: kløyver, knuser, fjellflytter.
- Magi: erkemagiker, stormkaller, virkelighetsforstyrrer.
- Helse: urokkelig, standhaftig, påfallende vanskelig å velte.
- Balansert: allsidig helt med egne formuleringer.

Beregn profilen fra antall poeng investert i hver egenskap, ikke fra råverdiene. Health gir større tall per poeng enn Strength og Magic og skal derfor ikke automatisk dominere.

Bruk eksisterende registrering av fordelte poeng hvis tilgjengelig. Ellers utled dem fra grunnverdier og oppgraderingsregler der det er pålitelig.

Ved lik høyeste investering eller ingen fordelte poeng brukes balansert profil. Samle denne regelen ett sted og dokumenter den.

Ikke finn på historiske poenginvesteringer dersom dagens data ikke lar dem beregnes sikkert.

## 8. Fem pompøsitetstrinn

Bruk disse foreløpige nivågrensene, samlet i konfigurasjon:

- Trinn 1: nivå 1–2.
- Trinn 2: nivå 3–5.
- Trinn 3: nivå 6–9.
- Trinn 4: nivå 10–14.
- Trinn 5: nivå 15 og høyere.

Dokumentert arenaprogresjon kan heve trinnet tidligere:
- Første arenaseier: minst trinn 2.
- Seier over første boss: minst trinn 4.
- Seier over siste boss i første arenarekке: trinn 5.

Bruk stabile fiende-ID-er og eksisterende progresjonsdata, ikke matching av navnetekst.

Pompøsitetstrinnet skal aldri falle.

Fem trinn er første utgave. Ikke bygg uendelig teksteskalering nå.

## 9. Tone og eksempler

Bruk eksemplene som stilretning, og lag et lite, gjennomarbeidet tekstbibliotek for alle fire profiler og fem trinn.

Trinn 1:
Tittel: «Den lovende pinnebæreren»
Krønike: «Har forlatt huset med et våpen og en plan. Våpenet er en pinne. Planen er under utvikling.»

Dette konkrete pinne-eksempelet brukes bare dersom det passer våpenet. Lag et tilsvarende startalternativ for magivåpen, eller bruk en våpennøytral tekst.

Etter første seier:
Tittel: «Slimets overmann»
Krønike: «Gøran er beseiret, og helten har allerede begynt å omtale hendelsen som slaget.»

Bruk bare Gøran dersom den registrerte seieren faktisk gjelder Gøran.

Trinn 3, styrke:
Tittel: «Den urimelig fryktede kløyveren»
Krønike: «Treningsdukker skjelver ved heltens ankomst. Enkelte mener suksessen har gått helten til hodet. Helten krever å få vite hvem.»

Trinn 4, boss beseiret:
Tittel: «Hans eller Hennes Slagkraftige Høyhet» skal IKKE brukes som et kjønnsvalg.
Bruk heller en kjønnsnøytral formulering, eksempelvis:
«Deres Slagkraftige Høyhet, Baronvelteren»
Krønike: «Baron Buldres fall har rystet arenaen. Helten har bestilt et lengre navneskilt og begynt å omtale vanlige stoler som troner.»

Omtal denne bossen bare ved faktisk seier og tilpass til prosjektets eksisterende bossnavn.

Trinn 5:
Tittel: «Klasks Banemann og Øverste Myndighet over Alt som Kan Slås»
Krønike: «Konger hvisker heltens navn. Krønikeskrivere ber om overtidsbetaling. Rommet må fortsatt ryddes.»

Lag tilsvarende pompøse, særegne varianter for:
- Magi.
- Helse.
- Balansert helt.

Humoren skal virke skrevet, ikke som en tilfeldig rekke adjektiver. Bruk komplette tittel- og setningsmaler der det gir bedre grammatikk.

Bruk kjønnsnøytrale formuleringer og heltens navn der det passer. Ikke utled kjønn fra navn eller utseende.

Skill mellom:
- Faktiske bragder, som må være dokumentert.
- Åpenbar komisk overdrivelse, som «fjellene vurderer å flytte».

## 10. Stabil tekst og oppdatering

Teksten skal være stabil mellom skjermbesøk og omlastinger. Ikke trekk en ny tilfeldig beskrivelse hver gang heltesiden rendres.

Bruk deterministiske regler eller lagre valgte mal-ID-er.

Oppdater når:
- Helten når et nytt pompøsitetstrinn.
- Egenskapsprofilen endres etter et bevisst poengvalg.
- En relevant førstegangsbragd registreres.

Kosmetiske endringer og omkamper mot allerede beseirede fiender skal ikke utløse nye beskrivelser.

Prioriter relevante bragder slik at teksten ikke prøver å ramse opp alt:
1. Siste boss.
2. Første boss.
3. Første arenaseier.
4. Generisk helteprogresjon.

En helt som bare har trent til høyt nivå, skal kunne få en svært pompøs tekst uten påstander om bosser den ikke har slått.

## 11. «Ryktet ditt har vokst!»

Ved nytt pompøsitetstrinn eller en ny viktig bossbragd:
- Vis «Ryktet ditt har vokst!».
- Vis den nye tittelen.
- Tilby «Se helten» eller en enkel fortsett-knapp.

Ikke avbryt:
- Inntasting av svar.
- Regnestykkets tilbakemelding.
- Pågående kamp.
- Et uferdig egenskapsvalg.

Integrer helst tittelbelønningen i eksisterende nivå- eller seiersvisning, fremfor å stable flere dialoger oppå hverandre.

Hvis flere årsaker oppstår samtidig, vis én samlet oppdatering med den endelige tittelen.

Profilendring alene kan oppdatere teksten stille på heltesiden. Ikke vis «Ryktet ditt har vokst» for hver omfordeling eller kosmetisk redigering.

Ikke gi ekstra XP, gull eller skade for titler. Dette er en egen visuell og humoristisk belønning.

## 12. Heltesiden

Prioriter denne rekkefølgen:
- Stor helt med aktivt utstyr.
- Navn.
- Tittel.
- Kort heltekrønike.
- Eksisterende stats og progresjon.
- Eksisterende navigasjon.
- «Endre utseende».

Tilpass til eksisterende oppsett uten å gjøre siden unødvendig lang.

Stats og spillhandlinger skal fortsatt være lette å finne. Krøniken må ikke presse alle viktige knapper langt ned.

Ikke endre det enkle valget mellom styrke, magi og helse.

## 13. Lagring og migrering

Utvid eksisterende versjonerte lagring.

Lagre nødvendig informasjon for:
- Utseendevalg.
- Stabil tittel og tekstvariant dersom de ikke beregnes deterministisk.
- Høyeste oppnådde pompøsitetstrinn.
- Hvilke rykteoppdateringer som allerede er vist, ved behov.

Migrer eksisterende helter:
- Behold nåværende klesfarge.
- Velg standardverdier som ligger nær dagens figur.
- Behold navn, stats, XP, nivå, gull, våpen, eierskap, sparemål, arena og innstillinger.
- Beregn passende tittel fra faktisk eksisterende fremgang.
- Ikke spill av en kø av gamle milepælsmeldinger ved første oppstart etter migrering.

Bruk trygge standardverdier for ukjente kosmetikk-ID-er. Ikke slett øvrig fremgang hvis en visuell variant mangler.

Undersøk data før du velger migreringsstrategi. Ikke anta at historiske bragder er lagret dersom de ikke er det.

## 14. Tester

Lag fokuserte tester for:
- Gyldige og ugyldige kosmetikkvalg.
- At tilfeldig utseende ikke endrer navn, våpen eller stats.
- At avbrutt redigering ikke lagres.
- At kosmetiske endringer ikke påvirker spillregler eller utstyr.
- Profilberegning fra investerte poeng, inkludert lik fordeling.
- Pompøsitetstrinn og milepæler.
- At høyeste trinn ikke faller.
- At beskrivelser ikke påstår udokumenterte bossseire.
- At tekst er stabil ved omlasting.
- At samme ryktebelønning ikke vises gjentatte ganger.
- Migrering uten tap av eksisterende fremgang.

Test visuelt i nettleser hvis miljøet støtter det:
- Ny helt med flere ulike utseender.
- Eksisterende helt etter migrering.
- Redigering og avbryt.
- Redigering og lagring.
- Helten på helteside, i butikk, trening og arena.
- Store våpen med ulike frisyrer og ansiktsdetaljer.
- Lange navn og titler på mobil.
- Ny tittel ved nivåmilepæl.
- Ny tittel ved bossseier.
- Omlasting etter endringer.

Kontroller omtrent 390 × 844 og 360 × 640, samt PC.

Bruk isolerte testdata. Ikke nullstill brukerens eksisterende helt.

## 15. Leveranse

Lever en fungerende karakterbygger og et integrert heltekrønikesystem.

Oppsummer:
- Hva som er implementert.
- Hvilke utseendevalg som finnes.
- Reglene for profil, tittel og pompøsitet.
- Hvordan eksisterende helter migreres.
- Hva som er testet.
- Eventuelle begrensninger.
- Hvor kosmetikk, tekstmaler og nivågrenser endres.

Oppdater spesifikasjon og faseplan.

Ikke push eller deploy til produksjonsgrenen uten autorisasjon fra prosjektinstruksjoner eller en separat beskjed.

Målet er at spilleren både vil se på helten sin og glede seg til hva spillet vil kalle den neste gang.