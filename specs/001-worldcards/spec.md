# Feature Specification: WorldCards

**Feature Branch**: `001-worldcards`

**Created**: 2026-10-04

**Status**: Draft

**Input**: User description: "Créer WorldCards, un site de trading card game sur les pays du monde."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Créer une collection personnelle (Priority: P1)

En tant que joueur, je crée un compte et me connecte afin de disposer d'une
collection personnelle de cartes.

**Why this priority**: L'identité du joueur et sa collection sont nécessaires
pour conserver les cartes obtenues et suivre la progression.

**Independent Test**: Un utilisateur peut créer un compte, se connecter,
consulter une collection vide, puis retrouver cette collection après une nouvelle
connexion.

**Acceptance Scenarios**:

1. **Given** un visiteur sans compte, **When** il fournit des informations
   d'inscription valides, **Then** un compte est créé et aucune donnée sensible
   n'est affichée publiquement.
2. **Given** un compte existant, **When** le joueur fournit des identifiants
   valides, **Then** il accède uniquement à sa propre collection.
3. **Given** des informations d'inscription invalides ou déjà utilisées,
   **When** le visiteur tente de créer un compte, **Then** l'inscription est
   refusée avec un message compréhensible.

---

### User Story 2 - Ouvrir un booster (Priority: P1)

En tant que joueur connecté, j'ouvre un booster et reçois un lot de cartes
tirées aléatoirement selon les règles de rareté.

**Why this priority**: Le tirage de boosters constitue l'activité principale et
la source de progression de la collection.

**Independent Test**: Un joueur connecté peut ouvrir un booster et voir le lot
obtenu, avec pour chaque carte son type, sa rareté et ses informations
principales.

**Acceptance Scenarios**:

1. **Given** un joueur connecté et un catalogue disponible, **When** il ouvre un
   booster, **Then** il reçoit un lot de cartes et celui-ci est ajouté à sa
   collection.
2. **Given** plusieurs ouvertures successives, **When** le joueur ouvre des
   boosters, **Then** chaque tirage est effectué selon les probabilités de
   rareté et ne peut pas être choisi ou prédit par le joueur.
3. **Given** une tentative d'ouverture par un visiteur non connecté, **When** il
   demande un booster, **Then** aucune carte n'est attribuée et une invitation à
   se connecter est affichée.

---

### User Story 3 - Garantir le stock des cartes spéciales (Priority: P1)

En tant que joueur, je veux que les cartes spéciales soient réellement limitées
afin que leur rareté et leur valeur restent cohérentes.

**Why this priority**: Le stock limité est une règle centrale du jeu et doit
empêcher toute duplication d'un exemplaire unique.

**Independent Test**: En configurant un stock connu, on ouvre suffisamment de
boosters pour l'épuiser, puis on vérifie qu'aucun tirage ultérieur ne contient
une carte spéciale épuisée.

**Acceptance Scenarios**:

1. **Given** une carte spéciale dont le stock est supérieur à zéro, **When** un
   tirage la sélectionne, **Then** elle est attribuée au joueur et son stock
   restant diminue d'une unité.
2. **Given** une carte spéciale dont le stock est égal à zéro, **When** un
   booster est ouvert, **Then** cette carte ne peut pas être renvoyée.
3. **Given** une carte spéciale à stock unique déjà attribuée à un joueur,
   **When** ce joueur consulte ou ouvre des boosters, **Then** il ne voit et
   n'obtient pas un second exemplaire de cette carte.
4. **Given** plusieurs ouvertures simultanées visant le dernier exemplaire,
   **When** les tirages sont traités, **Then** un seul joueur au maximum reçoit
   cet exemplaire et le stock ne devient jamais négatif.

---

### User Story 4 - Consulter et filtrer sa collection (Priority: P2)

En tant que joueur, je consulte ma collection et la filtre par type, rareté ou
continent, avec une recherche par nom.

**Why this priority**: Une collection devient rapidement difficile à parcourir
sans outils de recherche.

**Independent Test**: Une collection de cartes de types, raretés et continents
différents peut être filtrée avec chaque critère et recherchée par nom.

**Acceptance Scenarios**:

1. **Given** une collection contenant plusieurs cartes, **When** le joueur
   sélectionne un type, une rareté ou un continent, **Then** seules les cartes
   correspondant au filtre sont affichées.
2. **Given** une collection contenant plusieurs noms, **When** le joueur saisit
   une recherche correspondant partiellement à un nom, **Then** les résultats
   pertinents sont affichés.
3. **Given** des filtres ne correspondant à aucune carte, **When** le joueur les
   applique, **Then** la collection affiche un état vide explicite.

---

### User Story 5 - Consulter une carte et sa progression (Priority: P2)

En tant que joueur, je consulte la fiche détaillée d'une carte et ma
progression par rapport au total disponible.

**Why this priority**: Les détails et la progression donnent un objectif de
collection et permettent de comprendre les cartes obtenues.

**Independent Test**: Depuis une collection, le joueur ouvre une carte, vérifie
toutes ses informations, puis consulte le nombre de cartes possédées et le total
disponible.

**Acceptance Scenarios**:

1. **Given** une carte visible dans la collection, **When** le joueur ouvre sa
   fiche, **Then** il voit son nom, son type, sa rareté et les informations
   géographiques ou historiques disponibles.
2. **Given** une collection partiellement complétée, **When** le joueur consulte
   sa progression, **Then** le nombre possédé et le total disponible sont
   affichés sans compter deux fois un même exemplaire spécial.
3. **Given** une carte spéciale épuisée, **When** un joueur qui ne la possède pas
   consulte le catalogue ou sa progression, **Then** son statut de disponibilité
   est présenté de manière cohérente.

---

### User Story 6 - Gérer les cartes spéciales (Priority: P2)

En tant qu'administrateur, j'ajoute ou modifie une carte spéciale et son stock
restant.

**Why this priority**: L'administration du catalogue est nécessaire pour
maintenir les contenus historiques et les stocks limités.

**Independent Test**: Un administrateur peut créer une carte spéciale avec un
stock valide, modifier ses informations, puis vérifier que le nouveau stock est
pris en compte dans les tirages.

**Acceptance Scenarios**:

1. **Given** un administrateur authentifié, **When** il crée une carte spéciale
   avec des informations complètes et un stock valide, **Then** la carte devient
   disponible selon ce stock.
2. **Given** une carte spéciale existante, **When** l'administrateur modifie ses
   informations ou son stock avec une valeur valide, **Then** les changements
   sont enregistrés et appliqués aux tirages futurs.
3. **Given** un joueur sans droits d'administration, **When** il tente de gérer
   une carte spéciale, **Then** l'action est refusée.
4. **Given** un stock déjà attribué, **When** l'administrateur saisit un stock
   inférieur au nombre d'exemplaires attribués, **Then** la modification est
   refusée avec une explication.

### Edge Cases

- Un booster demandé alors qu'aucune carte disponible ne peut être tirée est
  refusé sans modifier la collection ni les stocks.
- Une carte spéciale supprimée ou rendue indisponible reste identifiable dans
  les collections où elle a déjà été attribuée.
- Une population absente, nulle ou invalide empêche la génération ou la mise à
  jour de la rareté au lieu de produire une rareté arbitraire.
- Une mise à jour de population peut changer la rareté affichée pour les
  nouvelles générations, mais ne doit pas créer de doublon ni supprimer une
  carte déjà possédée.
- Une recherche sans résultat, une collection vide et un catalogue vide ont des
  états d'interface distincts et explicites.
- Une perte de connexion ou une double soumission lors d'un tirage ne doit pas
  attribuer deux fois le même exemplaire spécial.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le système DOIT permettre à un visiteur de créer un compte avec des
  informations valides et à un joueur de se connecter pour accéder à sa
  collection.
- **FR-002**: Le système DOIT isoler chaque collection afin qu'un joueur ne
  puisse consulter ou modifier que ses propres cartes.
- **FR-003**: Le système DOIT représenter les cartes Pays avec un nom, une
  population, un continent et un drapeau.
- **FR-004**: Le système DOIT représenter les cartes Capitale avec la capitale
  actuelle du pays associé.
- **FR-005**: Le système DOIT représenter les cartes Drapeau avec le drapeau
  actuel du pays associé.
- **FR-006**: Le système DOIT permettre des cartes spéciales d'ancien drapeau,
  d'ancienne capitale et d'ancien nom de pays, sans exiger qu'elles existent
  pour tous les pays.
- **FR-007**: Le système DOIT attribuer une rareté basée sur la population du
  pays, avec les niveaux Commune, Peu commune, Rare, Épique et Légendaire, et
  la catégorie Spéciale au-dessus de ces niveaux.
- **FR-008**: Le système DOIT calculer la rareté de manière cohérente à partir
  de la population actuellement enregistrée au moment de la génération ou de
  la mise à jour des cartes.
- **FR-009**: Le système DOIT ouvrir un booster uniquement pour un joueur
  connecté et lui attribuer un lot de cartes tirées aléatoirement selon les
  règles de rareté.
- **FR-010**: Le tirage, ses probabilités et la décrémentation du stock spécial
  DOIVENT être exécutés de manière non contrôlable par le client.
- **FR-011**: Le système NE DOIT JAMAIS attribuer une carte spéciale dont le
  stock restant est nul.
- **FR-012**: Le système DOIT empêcher qu'un même exemplaire d'une carte
  spéciale à stock unique soit attribué ou visible deux fois pour un joueur.
- **FR-013**: Le système DOIT garantir qu'une concurrence entre tirages ne rend
  jamais le stock d'une carte spéciale négatif et ne distribue pas deux fois le
  dernier exemplaire.
- **FR-014**: Le système DOIT permettre de filtrer la collection par type,
  rareté et continent, et de rechercher par nom.
- **FR-015**: Le système DOIT afficher une fiche détaillée avec toutes les
  informations disponibles pour une carte.
- **FR-016**: Le système DOIT afficher la progression d'un joueur avec le nombre
  de cartes possédées et le total de cartes disponibles, en comptant correctement
  les exemplaires spéciaux.
- **FR-017**: Le système DOIT permettre à un administrateur autorisé d'ajouter
  et de modifier une carte spéciale ainsi que son stock restant.
- **FR-018**: Le système DOIT refuser un stock administré inférieur au nombre
  d'exemplaires déjà attribués.
- **FR-019**: Le système DOIT valider les entrées utilisateur et afficher des
  erreurs explicites sans exposer de données sensibles.
- **FR-020**: Les mots de passe DOIVENT être protégés et ne doivent jamais être
  affichés ou stockés en clair.
- **FR-021**: Le système DOIT conserver la traçabilité de cette fonctionnalité
  vers sa spécification et les prompts utilisés pour la générer.
- **FR-022**: Les sources de population, capitales, drapeaux et images DOIVENT
  être identifiées et leurs conditions d'utilisation compatibles avec le projet.

### Key Entities

- **Joueur**: compte authentifié qui possède une collection et un rôle joueur ou
  administrateur.
- **Pays**: entité géographique de référence avec nom, population, continent,
  capitale actuelle et drapeau actuel.
- **Carte**: représentation collectionnable liée à un pays, avec un type, une
  rareté et les informations nécessaires à sa fiche.
- **Carte spéciale**: carte historique liée à un pays, avec une description de
  l'ancienne information et un stock limité.
- **Exemplaire**: attribution d'une carte à un joueur, identifiant un exemplaire
  spécial afin d'empêcher sa duplication.
- **Booster**: opération qui produit un lot de cartes pour un joueur selon les
  règles de tirage.
- **Progression**: indicateurs du nombre de cartes possédées par rapport au
  total disponible.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Au moins 95 % des utilisateurs de test peuvent créer un compte,
  se connecter et retrouver leur collection sans aide lors de leur première
  tentative.
- **SC-002**: 100 % des tirages de test n'attribuent aucune carte spéciale dont
  le stock est nul, y compris lors de tirages concurrents.
- **SC-003**: 100 % des cartes générées ou mises à jour dans les tests affichent
  une rareté correspondant à la population actuellement enregistrée.
- **SC-004**: 100 % des tests de stock unique empêchent la double attribution ou
  la double visibilité d'un même exemplaire spécial pour un joueur.
- **SC-005**: Au moins 90 % des utilisateurs de test trouvent une carte donnée
  en moins de 30 secondes en combinant les filtres et la recherche.
- **SC-006**: Au moins 90 % des utilisateurs de test consultent la fiche d'une
  carte et identifient ses informations principales sans assistance.
- **SC-007**: Un administrateur de test peut ajouter ou modifier une carte
  spéciale et vérifier le stock résultant en moins de 2 minutes.
- **SC-008**: Aucune fonctionnalité de la version 1 ne permet l'échange entre
  joueurs, le classement ou la conversion de doublons.

## Assumptions

- La version 1 est accessible via un navigateur et vise des joueurs disposant
  d'une connexion internet stable.
- L'inscription standard repose sur une adresse ou un identifiant unique et un
  mot de passe ; aucun fournisseur d'identité externe n'est requis.
- Un booster possède un nombre fixe de cartes défini par les règles du jeu,
  mais ce nombre pourra être précisé pendant la planification.
- Les seuils numériques exacts entre les niveaux de rareté et les probabilités
  de tirage seront définis dans la conception sans modifier les règles de
  classement énoncées ici.
- Les cartes spéciales à stock supérieur à un peuvent être obtenues par
  plusieurs joueurs, tandis qu'un stock égal à un identifie un exemplaire unique.
- Les données de référence sont maintenues par une source unique validée et
  versionnée ; leur mise à jour ne supprime pas les historiques déjà collectés.
- Les échanges entre joueurs, le classement et la conversion de doublons sont
  explicitement hors périmètre de cette version.
