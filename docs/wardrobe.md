# Karakterbygger, garderobe og personlig historie

Tre trinn: Utseende, Antrekk og Bakgrunn. Forhåndsvisning og lagreknapper er faste; bare valglisten ruller på små skjermer. 15 frisyrer, 10 hårfarger, 6 ansiktsuttrykk, 5 detaljer, 4 skjeggvalg, 12 antrekk i seks stiler, 7 hodeplagg og tre kappevalg. Hovedfarge og aksent velges separat. Seks stilforslag og tilfeldig utseende endrer bare kosmetikk. Samme figurgeometri brukes i alle spillvisninger.

Seks valgfrie opphav og seks mål gir deterministiske, kjønnsnøytrale historier. Ønsker omtales som ønsker; senere formuleringer bygger på faktisk nivå, utrustning og bosstroféer. Eksisterende titler og opptjente prestasjoner er bevart. Utseende og bakgrunn redigeres i ett utkast med lagre/avbryt.

Lagring v8 bevarer gamle ID-er og fremgang. Gammelt skjegg flyttes fra detalj til eget skjeggvalg. Eksisterende helter får ingen automatisk bakgrunn. Original lagring sikres i gangriket.save.before-v8 før migrering; sikkerhetskopier overskrives ikke. Mislykket backup blokkerer migrering.

## Kontroll

- 153 tester i 13 filer: migrering, backupfeil, separate helter, utkast, kosmetikk uten statseffekt, alle 36 opphav/mål og historie ved flere nivåer, store våpen og innramming med alle hår/hatt-kombinasjoner.
- Produksjonsbygg med TypeScript og Vite.
- Isolert nettlesertest på 360 × 640, 390 × 844 og desktop. Figur og handlinger forblir synlige i byggeren.
- Visuelt galleri av alle frisyrer i stor/liten størrelse, alle antrekk med nærkamp og magi, lange frisyrer med kjoler/hjelm/hatt samt alle hudtoner/ansiktsuttrykk.
- Opprettelse med stilforslag, magivåpen og bakgrunn; trening med fem-riktige-spesial, knusebonus og nivåøkning; avbryt gjenoppretter begge utkast; lagring og omlasting beholder utseende, mål og nivå. Ekstra helt beholder separate standardvalg.
- Ingen konsollfeil i den testede byggerflyten. Brukerens faktiske helter er ikke berørt.

Begrensning: nettleserens mobilvisning er brukt, ikke en fysisk telefon. Ikke hver av de mange mulige kosmetiske kombinasjonene er animert manuelt; felles geometri og målrettede tester dekker innrammingen.
