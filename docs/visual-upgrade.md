# Visuell oppgradering

Samme Phaser-tegning brukes i karakterbygger, helteside, trening og arena. Heltens kontur, ansiktsdetaljer, hårglans, stofffolder, støvler og håndgrep er tydeligere. Alle utseendevalg består. Ansiktsblekk skifter kontrast på de mørkeste hudtonene. Våpnenes opprinnelige geometri og materialer er bevart.

Kampcanvas fyller sin reserverte flate. Et kamerautsitt beregnes fra våpenets sveip og motstanderens faktiske geometri. Bossens silhuett får større mål enn vanlige fiender. Tomrom er redusert, mens HUD, XP, spesialmåler og regneområde har egne områder. På kort mobil er overflødig luft og overskrift fjernet fra regnefeltet; tastene er fortsatt minst 44 px. Vanlige slag har 70 ms forberedelse, tunge våpen 110 ms, spesialangrep eksisterende 140 ms. Alle hendelser er innen eksisterende 1200 ms svarperiode. Magi har egen armbevegelse. Knusing og vanlig treffreaksjon konkurrerer ikke lenger om samme figur.

Neste bonus kommer fra dummyBonus, samme funksjon som tildeler bonus ved knusing. Knusemeldingen erstatter forventet bonus i samme felt, med samlet antall og sum. Nivåfeiring i trening ligger ved XP-måleren, uten panel foran figurene. Skadestadier viser sprekker, fliser og skjev positur. Ingen balanseverdier, lagringsformat eller innholds-ID-er er endret.

## Kontroll

142 tester består, inklusive alle tidligere regel-, migrerings-, pause-, profil- og spesialangrepstester. Nye tester kontrollerer kamerarammen for alle 40 våpen mot alle 100 motstandere og samsvar mellom vist og faktisk bonus på alle normale dukker og eksamener. Produksjonsbygg består (eksisterende Phaser-størrelsesadvarsel).

Isolerte nettleserdata på porter 4186/4187 og et utviklingsgalleri på 4188. Kontrollert 360×640, 390×844 og desktop. Startvåpen, sent nærkampvåpen, magi, Gøran, siste boss, skadet eksamen og rangskifte kontrollert visuelt. Svar-knapp slutter på y=630 ved 640 px skjermhøyde. Kamera/HUD-overlapping funnet og rettet. Sju normale svar og spesialregler dekkes av tidligere regresjonstester; ny praktisk kontroll av ni knuste dukker i ett slag: +72 bonus, totalt82XP, nivå1→3 og neste eksamen91/128. Magi mot12/1536HP ga192bonus og neste dukke1009/1024. Alle seks hudtoner og fire ansiktsuttrykk inspisert i et galleri med den faktiske delte tegnefunksjonen.

Redusert bevegelse kontrollert i isolert testserver som aktiverer eksisterende mediespørring i JS/CSS. Nivåvisning viste «Nivå3 ↑ Poeng klare», neste oppgave allerede tilgjengelig, CSS animation-name:none. Brukerens systempreferanser og eksisterende helter ble ikke endret. Lyd av i nettleseren, eksisterende lydtester består. Ingen hørbar lydtest eller fysisk telefon. Ikke hvert animasjonsbilde av alle 4000 kombinasjoner er manuelt inspisert; geometrien er automatisk kontrollert.
