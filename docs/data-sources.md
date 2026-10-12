# Data sources

Current country name, population, capital, continent, and flag references are
imported from [REST Countries](https://restcountries.com), retrieved as a
versioned snapshot. The seed catalog is restricted to the 195 countries
officially covered by the United Nations: 193 member states plus the Holy See
and the State of Palestine. The project retains the retrieval date, response
checksum, source URL, and the provider's current terms/license reference with
each snapshot. Flag URLs remain source references; production deployments
should review and retain the provider attribution before publishing.

Country-card images are selected as landscapes or recognizable sites from the
country. Capital-card images are selected as recognizable landmarks, monuments,
architecture, or skylines from the capital city. Wikimedia Commons is preferred
over Openverse, with Wikipedia summaries used only as a lower-priority fallback.
Flags, maps, coats of arms, logos, and other non-photographic images are
excluded.
The seed requires an image for every country and capital card. If no suitable
capital photo is available after all source queries, the country's photo is
used as a final fallback so that no seeded card is image-less. If no country
photo can be retrieved, seeding fails explicitly rather than creating a
placeholder card.

## Import evidence required

Every `DataSnapshot` import must retain:

| Imported field | Evidence |
|---|---|
| Name, population, continent, capital | REST Countries endpoint URL, retrieval UTC timestamp, response checksum/version |
| Flag reference | Exact flag URL or asset identifier and retrieval timestamp |
| Snapshot identity | Source name, checksum/release identifier, validation status |
| Legal basis | REST Countries license/terms URL and the attribution text shown in the application |

Historical special-card fields additionally require the source URL, citation or
archive identifier, retrieval date, license/terms reference, and attribution
text before an administrator can publish the record. The seed data is a
development fixture and must not be treated as production source evidence.
