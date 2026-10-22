# Illustrert helt: avgrenset bildeprøve

Åpne `/?test=hero-pack`. Vanlig adresse bruker eksisterende grafikk og lagring.

Prøven tilbyr kort hår/flette, tunika/kjole og sverd/stav: åtte kombinasjoner. Samme komposisjon brukes i forhåndsvisning, heltvelger, helteside, trening og arena. Prøvevalg åpnes fra topplinjen; under trening/kamp brukes spillets vanlige tilbakeknapp først.

To midlertidige nivå-6-helter har hvert sitt faktiske startvåpen og 12 skade. Bildevalget endrer aldri våpen, kampstil eller skade. Heltene og lydvalget holdes i minnet; omlasting nullstiller prøven uten å lese eller skrive vanlig spillerlagring.

De sju originale PNG-filene er bevart byte for byte. Manifestets 440 × 590-koordinater og desimaler brukes til lagene kropp, hode, hår og våpen med hånd. Komposisjoner mellomlagres og gjenbrukes. Hele figuren speiles og beveges sammen. Ansikt/hud er fast; øvrig utseende er ikke del av denne prøven. Ved bildefeil eller utstyr uten støttet bilde brukes eksisterende figur. Avkryssing lar denne sammenlignes direkte.

Kontrollert i nettleser på 360 × 640, 390 × 844 og skrivebord: alle åtte kombinasjoner, små portretter, trening med femtesvarsspesial og knusebonus, magikamp med pause og seier, samt tvunget bildefeil. Vanlige helter var bevart på samme opprinnelse. Fysisk telefon er ikke testet.

168 tester passerer med `npm test -- --testTimeout=20000`; standardgrensen på fem sekunder ble overskredet av eksisterende omfattende kameratest. Produksjonsbygg passerer. Nye tester dekker originale filhasher, laggeometri, kameragrenser, isolert lagring og bildeinnlasting med nytt forsøk etter feil.
