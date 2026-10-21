Videreutvikle det eksisterende gangetabellspillet. Implementer endringene nedenfor i prosjektet som allerede finnes. Behold spillets etablerte stil, humor og fungerende funksjoner.

Les først prosjektets instruksjoner og undersøk eksisterende kode, lagring, kampberegning og deployoppsett. Tilpass løsningen til det som faktisk er implementert. Ikke bygg parallelle systemer for funksjoner som allerede finnes.

Målet er:
1. Gjøre trening til en tilfredsstillende progresjon med knusbare treningsdukker.
2. Koble bedre våpen og høyere skade til raskere XP-opptjening.
3. Gi tydeligere visuelle og lydlige belønninger.
4. Utvide spillet til 10 arenaer, 100 motstandere inkludert 20 bosser, og 20 våpen per eksisterende kampstil.

Dette er en implementeringsoppgave, ikke bare en plan.

SPILLETS GRUNNREGLER

Behold følgende:
- Mobil først.
- Kamp øverst, regnestykke og svarfelt/tastatur nederst.
- Kampeffekter skal aldri dekke regnedelen eller flytte tastaturet.
- Hver faktor trekkes uavhengig og tilfeldig fra 1–10. Gjentakelser er tillatt.
- Ingen adaptiv oppgavefordeling eller gjennomspilling av en kortstokk med alle regnestykkene.
- Skade beregnes fra relevant ferdighet, våpen og eksisterende bonuser. Level gir ikke direkte skade.
- Styrke brukes til nærkamp, magi til magiske våpen.
- Behold eksisterende valg av styrke, magi eller helse ved leveløkning.
- Behold flere helter med helt separat fremdrift.
- Behold automatisk utrusting ved våpenkjøp og muligheten til å utruste tidligere kjøpte våpen.
- Butikken viser bare neste tilgjengelige våpen per kampstil, basert på høyeste eide våpentrinn, ikke hvilket våpen som er utrustet.
- Behold eksisterende spesialangrep. Feil innsendt svar nullstiller rekken som lader spesialangrepet.
- Ingen konto, serveravhengighet eller AI-generering under spilling er nødvendig.

1. NY TRENINGSSLØYFE

Erstatt den endeløse, uforanderlige treningsdukken med treningsdukker som har helse og kan knuses.

Hvert riktig besvarte regnestykke:
- Gir spillets vanlige grunn-XP.
- Utløser ett angrep med heltens faktiske skade.
- Skader treningsdukken.
- Kan utløse eksisterende spesialangrep etter de etablerte reglene.

Når en dukke knuses:
- Vis en tydelig knuseanimasjon.
- Gi en synlig XP-bonus.
- Sett inn neste dukke automatisk.
- Ikke krev et ekstra knappetrykk.
- Ikke legg en ekstra obligatorisk ventepause oppå den eksisterende svartilbakemeldingen.

Treningsdukker angriper aldri tilbake.

Skade skal gjøre en reell forskjell:
- Bedre våpen og høyere relevante ferdigheter skal gjøre at spilleren knuser flere dukker med samme antall riktige svar.
- Dette skal gi høyere gjennomsnittlig XP per riktig svar.
- Ikke skaler dukkens helse automatisk med heltens skade, våpen eller level. Det ville opphevet oppgraderingen.

Overskytende skade:
- Skade utover gjenværende helse overføres til neste dukke.
- Ett stort angrep kan knuse flere dukker.
- Alle opptjente belønninger må beregnes korrekt, men vis dem samlet ved store angrep fremfor en lang kø med animasjoner.
- Bruk en beregning som håndterer store skadetall uten å låse nettleseren.

Feil svar og avslørt fasit gir verken angrep, grunn-XP eller fremdrift på dukken.

2. TRENINGSPROGRESJON OG BALANSE

Lag en egen, varig treningsprogresjon med treningsranger og stadig mer overdrevne dukker.

Eksempler på tone:
- En sekk med dårlig selvfølelse
- Den kommunalt godkjente slagpålen
- Ridder Kvist av Kryssfiner
- Den overraskende hevngjerrige jerndukken
- Hans Uknuselige Majestet, modell 4
- Den kosmiske katastrofedukken med utvidet garanti

Dukkene skal bli visuelt forskjellige og mer imponerende etter hvert.

Bruk faste, konfigurerbare trinn:
- Flere dukker kan tilhøre samme treningsrang.
- En tydelig større eksamensdukke avslutter en rang.
- Neste rang får en synlig oppgradering av dukker og gjerne noen detaljer i treningsmiljøet.
- Vis nåværende rang og et konkret neste mål.
- Spilleren skal få tid til å kjenne seg sterk før neste vanskelighetstrinn.

Balanser første dukke til omtrent 6–10 vanlige riktige angrep med en ny helt. Bruk faktiske startverdier fra prosjektet.

XP-bonus må følge dukkens helse på en måte som opprettholder verdien av skade:
- En dukke med vesentlig mer helse må gi tilsvarende bedre bonus.
- Et nytt treningstrinn skal ikke føre til et stort fall i forventet XP per riktig svar ved samme skade.
- En hensiktsmessig modell er bonus proporsjonal med helse, med forsiktig avrunding.
- Hold samlet XP-tempo under kontroll. Ikke gjør de eksisterende levelkravene meningsløse.

Undersøk dagens tall og lag en kort balansetabell for tidlig, midtre og sen progresjon. Sammenlign forventet XP per riktig svar før og etter våpenoppgraderinger. Ta hensyn til spesialangrep i tillegg til vanlige treff.

Trening gir XP og treningsprogresjon.
Arena gir gull og arenaprogresjon.
Ikke innfør gull fra trening eller nye valutaer nå.

Når definert treningsinnhold er brukt opp, skal trening fortsatt fungere med en tydelig gjentakbar sluttrang. Ikke påstå at det finnes nytt håndlaget innhold hvis det ikke gjør det.

Lagre per helt:
- Treningsrang og posisjon i progresjonen.
- Aktiv dukke og gjenværende helse.
- Relevante treningsrekorder og opptjente treningsutmerkelser.

Man skal kunne forlate treningen eller laste siden på nytt uten å miste fremdriften på dukken. Behold eksisterende regler for at selve spesialangrepsrekken nullstilles ved ny økt.

3. TYDELIGERE BELØNNINGER

Gi positive hendelser tydelige reaksjoner. Bruk forskjellig styrke, slik at en bossseier føles større enn et vanlig treff.

Riktig svar:
- Vis hele det korrekte regnestykket med svar.
- La det vokse og bli grønt med en kort, tydelig puls.
- Behold den etablerte lesetiden.
- Utløs angrepet samtidig i øvre del.
- Bruk en kort positiv lyd når lyd er aktivert.

Behold feiltilbakemeldingen:
- Første feil: rist og rødfarg, behold oppgaven og la spilleren prøve igjen.
- Andre feil: rist og rødfarg, vis deretter korrekt komplett regnestykke i roligere grønt, og behold det til spilleren trykker Neste.
- Ikke vis et galt svar som en korrekt likning.
- Ikke gi belønning for avslørt fasit.

Vanlig skade:
- Tydelig treffreaksjon.
- Lett tilbakestøt der det passer.
- Lesbart skadetall.
- Synlig reduksjon i helsemåleren.
- Treningsdukker får synlige skader når helsen synker.

Spesialangrep:
- Tydelig kraftigere enn vanlig angrep.
- Egen effekt for nærkamp og magi.
- Ett tydelig skadetall for angrepet, ikke både vanlig og spesiell skade hvis angrepet erstatter det vanlige.

Knust dukke:
- Deler faller av eller dukken kollapser.
- Vis opptjent bonus-XP.
- Animer XP-måleren.
- Ved flere knuste dukker i samme slag: vis en samlet oppsummering, for eksempel «3 dukker knust! +120 XP».

Arenaseier:
- Tydelig beseiret motstander.
- Synlig gullbelønning og oppdatering av gullsaldo.
- Markering av ny fremdrift.
- Ingen lang obligatorisk opptelling; spilleren skal kunne gå videre.

Ny level:
- Behold og forbedre eksisterende levelfeiring og ferdighetsvalg.
- Vis tydelig hvilken ferdighet som øker og den nye totalverdien.
- Håndter flere leveløkninger fra samme belønning uten tap av XP eller ferdighetspoeng.
- Ikke lag et ekstra, konkurrerende levelsystem.

Våpenkjøp:
- Vis helten med det nye våpenet.
- Vis navn og endring i faktisk angrepsskade, beregnet med riktig ferdighet.
- Gjør presentasjonen kort og tilfredsstillende.

Bossseier og ny arena:
- Større feiring enn vanlig seier.
- Tydelig trofé eller varig seiersmarkering.
- Presenter neste arena når den låses opp.
- Førstegangsbelønninger skal bare gis én gang.

Alle effekter:
- Respekter eksisterende lydinnstilling og redusert bevegelse.
- Unngå gjentatte skjermblink og kraftig risting.
- Hold regnedelen lesbar.
- Ikke legg ekstra ventetid mellom vanlige oppgaver.
- Behold korrekt pause av motstanderens angrepsklokke under svartilbakemelding, dialoger og skjult fane. Ikke nullstill klokken for å gi utilsiktet fordel.
- Unngå at gamle animasjoner eller callbacks påvirker neste kamp eller en annen helt.

4. 10 ARENAER OG 100 MOTSTANDERE

Utvid innholdet til:
- 10 arenaer.
- 10 motstandere per arena.
- Motstander 5 og 10 i hver arena er bosser.
- Totalt 80 vanlige motstandere og 20 bosser.

Dette erstatter ikke de eksisterende ti motstanderne med ti arenaer. Kartlegg eksisterende innhold og gjenbruk det som en sammenhengende del av den nye reisen.

Hver arena skal ha:
- Eget navn og miljøtema.
- Et visuelt særpreg som faktisk vises i kamp.
- Ti navngitte motstandere.
- Tydelig oversikt over beseirede, neste og låste motstandere.
- En sluttboss som låser opp neste arena.

Motstanderne skal:
- Ha pompøse, morsomme navn og korte beskrivelser.
- Variere visuelt i silhuett, kropp, utstyr eller uttrykk.
- Ha lesbare angrep og treffreaksjoner.
- Ikke bare være samme figur med nytt navn og fargetone.
- Kunne dele en gjennomtenkt grafisk grunnmodell, men bosser må skille seg tydelig ut.

Bruk prosjektets eksisterende grafikkteknikk. Ikke gjør løsningen avhengig av betalte tjenester eller runtime-genererte bilder.

Progresjon:
- Lås opp motstandere i rekkefølge.
- Behold tidligere arenaer og motstandere spillbare.
- Spilleren skal kunne vende tilbake og kjenne hvor mye sterkere helten har blitt.
- Ikke skaler gamle motstandere automatisk opp med helten.
- Gjentatte seire gir vanlig gullbelønning.
- Eventuelle førstegangs- og bossbonuser gis bare én gang per helt.
- Nederlag fjerner ikke allerede opptjent fremdrift.

Balanser hovedsakelig med helse, skade og belønning. Ikke gjør senere innhold avhengig av stadig kortere svartid. Behold rom for spillere som trenger lengre tid og heller trener helten mer.

5. 20 VÅPEN PER KAMPSTIL

Lag 20 våpen totalt per eksisterende kampstil, inkludert startvåpenet:
- 20 nærkampvåpen for styrke.
- 20 magiske våpen for magi.
- Totalt 40 våpen.

Ikke innfør dexterity eller bue nå, men organiser våpendata slik at flere kampstiler kan legges til senere.

Behold eksisterende våpen, stabile ID-er og eierskap. Plasser dem i den utvidede progresjonen uten å ta fra spilleren kjøpte våpen.

Hvert våpen trenger:
- Stabil ID.
- Kampstil og progresjonstrinn.
- Navn.
- Kort, pompøs beskrivelse.
- Skade.
- Pris.
- Et visuelt uttrykk som vises på helten og i kamp.

Visuell progresjon:
- Tidlige våpen er beskjedne og komiske.
- Senere våpen får større og mer imponerende silhuetter, materialer og detaljer.
- De siste våpnene er fullstendig overdrevne.
- Magi og nærkamp skal se forskjellige ut.
- Navn som antyder ild eller kosmiske krefter trenger ikke nye skadeelementer. Ikke innfør skjulte kampmekanikker bare på grunn av teksten.

Fordel våpenprogresjonen gjennom de ti arenaene. Priser og belønninger må gjøre nye våpen oppnåelige og verdifulle uten at spilleren må gjenta samme motstander urimelig mange ganger.

Behold butikkregelen:
- Bare neste våpen i hver kampstil vises som kjøpbart.
- Neste bestemmes av høyeste eide våpentrinn.
- Kjøp utruster våpenet automatisk.
- Tidligere eide våpen finnes i «Mitt utstyr».
- Vis tydelig når en våpenserie er fullført.
- Dobbelttrykk skal ikke kjøpe både det viste våpenet og det som dukker opp etterpå.
- Valider kjøpet mot riktig helt og våpen-ID.

6. SAMMENHENGEN MELLOM SYSTEMENE

Den ønskede sløyfen er:

Riktige svar → XP og trening → ferdigheter →
arenaseire → gull → bedre våpen →
mer skade → raskere opptjening av trenings-XP →
sterkere helt → nye arenaer.

Kontroller at denne sammenhengen faktisk finnes i tallene:
- Bedre relevant våpen gir mer skade.
- Mer skade gir høyere forventet trenings-XP per riktig svar.
- Ferdighetspoeng forbedrer relevant kampstil.
- Helse hjelper spilleren å overleve arenaen.
- Senere arenaer gir bedre gullmuligheter.
- Våpenkjøp skal ikke bli meningsløse på grunn av automatisk skalering.

Lag en kort intern balansedokumentasjon med representative helter og utstyr fra begynnelsen, midten og slutten av spillet. Ikke anta at alle spillere investerer poengene likt.

7. LAGRING OG MIGRERING

Bevar all eksisterende fremdrift:
- Alle helter og utseender.
- XP, level og ubrukte ferdighetspoeng.
- Ferdigheter og helseverdier.
- Gull, våpeneierskap og utrustning.
- Arenaseire, bossbonuser, titler og beskrivelser.
- Innstillinger.

Bruk versjonert og idempotent migrering.
- Ta vare på gammel lagring før den omskrives.
- En feil ved innlesing skal ikke overskrive eksisterende data med en ny tom helt.
- Kartlegg gamle arenaseire til tilsvarende motstandere.
- Ikke gi gamle førstegangsbelønninger på nytt.
- Nye treningsdata får trygge standardverdier.
- Hver helt skal ha helt separat trenings- og arenafremdrift.
- Ved eksisterende kjøpte våpen som hopper over nye mellomtrinn: behold eierskapet og la neste kjøp følge høyeste eide trinn.

8. GJENNOMFØRING OG VERIFISERING

Arbeid i gjennomførbare steg, men fullfør hele oppgaven:
1. Undersøk eksisterende systemer og tall.
2. Implementer treningsprogresjon og XP-koblingen.
3. Forbedre belønningseffektene.
4. Utvid våpen- og arenainnholdet.
5. Kontroller balanse, migrering og mobilvisning.
6. Deploy til eksisterende Vercel-prosjekt.

Test særlig:
- Vanlige treff, spesialangrep og overskytende skade.
- Flere dukker og flere leveløkninger fra ett angrep.
- Feil svar gir ingen XP eller skade.
- Sterkere våpen gir bedre forventet trenings-XP per svar.
- Fremdrift beholdes ved reload og heltbytte.
- Gamle lagringer migreres uten tap eller doble belønninger.
- Alle 100 motstandere og 40 våpen har gyldige data og riktig rekkefølge.
- Opplåsing mellom arenaer.
- Kjøp, automatisk utrusting og dobbelttrykk.
- Pause, skjult fane og gamle callbacks.
- Ingen effekter dekker regnedelen.
- Mobilvisning rundt 360 × 640 og 390 × 844 samt desktop.
- Lyd av og redusert bevegelse.

Bruk isolerte testdata. Ikke slett eller endre brukerens faktiske helter for å teste.

Kjør prosjektets relevante tester og produksjonsbygg. Legg til målrettede tester for kampberegning, belønninger, migrering og progresjon der det er nødvendig.

9. PUSH OG VERCEL

Du har tillatelse til å committe og pushe endringene til prosjektets eksisterende GitHub-repository og deploye dem til det eksisterende Vercel-prosjektet. Det er ønskelig å teste løsningen der.

Følg prosjektets etablerte publiseringsflyt:
- Hvis push til riktig branch utløser Vercel-deploy, bruk den.
- Hvis prosjektet bruker direkte Vercel-deploy, bruk eksisterende kobling.
- Ikke opprett et nytt repository eller et nytt Vercel-prosjekt.
- Ikke force-push eller overskriv uvedkommende arbeid.
- Kontroller at produksjonsbygget lykkes før publisering.
- Kontroller deploystatus og gjør en kort funksjonstest på den publiserte løsningen.
- Hvis tilgang eller autentisering mangler, oppgi konkret hva som blokkerer. Ikke rapporter at noe er publisert før det er bekreftet.

Avslutt med en kort oppsummering av:
- Hva som er implementert.
- De viktigste balansevalgene.
- Hva som er testet.
- Eventuelle kjente begrensninger.
- Lenken til den publiserte løsningen.