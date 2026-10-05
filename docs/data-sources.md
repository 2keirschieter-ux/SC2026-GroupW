# Data sources

Current country name, population, capital, continent, and flag references are
imported from [REST Countries](https://restcountries.com), retrieved as a
versioned snapshot. The project retains the retrieval date, response checksum,
source URL, and the provider's current terms/license reference with each
snapshot. Flag URLs remain source references; production deployments should
review and retain the provider attribution before publishing.

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
