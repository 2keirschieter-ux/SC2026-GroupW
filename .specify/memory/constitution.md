<!--
Sync Impact Report
- Version change: template/unversioned -> 1.0.0
- Modified principles: none; initial project constitution
- Added sections: WorldCards project identity, seven core principles, constraints,
  development workflow, governance
- Removed sections: none
- Follow-up TODOs: determine the original ratification date
-->

# WorldCards Constitution

## Core Principles

### I. Intégrité des tirages
Toute la logique de tirage des boosters, y compris les probabilités et la
décrémentation du stock des cartes spéciales, DOIT s'exécuter côté serveur. Le
client NE DOIT ni influencer ni prédire un tirage. Les tests automatisés DOIVENT
vérifier que les règles de tirage et les limites de stock sont respectées.

### II. Cohérence des données
Les données de population, de capitale et de drapeau DOIVENT provenir d'une
source unique, fiable et documentée. Toute mise à jour DOIT recalculer la rareté
de manière cohérente et DOIT préserver une interprétation stable des cartes déjà
possédées par les joueurs et des nouvelles cartes. Les migrations de données
DOIVENT être explicites et vérifiables.

### III. Simplicité avant tout
L'implémentation DOIT privilégier la solution la plus simple qui satisfait les
exigences de WorldCards. Toute complexité supplémentaire DOIT être justifiée par
un besoin concret, documenté et vérifiable. Les abstractions, extensions et
optimisations prématurées NE DOIVENT PAS être introduites.

### IV. Tests de la logique critique
Le calcul de la rareté et le tirage des boosters DOIVENT être couverts par des
tests automatisés couvrant les cas normaux, les limites et les stocks épuisés.
L'interface visuelle PEUT avoir une couverture moindre lorsque la logique métier
est testée indépendamment.

### V. Sécurité de base
Les mots de passe DOIVENT être hachés avec un mécanisme adapté et NE DOIVENT
JAMAIS être stockés ou exposés en clair. Les données sensibles NE DOIVENT PAS
être envoyées au client. Toute entrée utilisateur DOIT être validée côté serveur
avant traitement ou persistance, et les erreurs de validation DOIVENT être
retournées explicitement.

### VI. Traçabilité de la démarche
Chaque fonctionnalité significative DOIT être reliée à une spécification et aux
prompts utilisés pour sa génération. Les décisions importantes et les écarts
entre la spécification et l'implémentation DOIVENT être documentés afin de
permettre l'évaluation de la démarche SDD et du vibe coding.

### VII. Respect des licences
Les sources de données sur les pays et les images de drapeaux DOIVENT être
utilisables légalement pour le projet. La licence ou les conditions
d'utilisation de chaque source DOIVENT être identifiées avant son intégration,
et les attributions requises DOIVENT être conservées dans la documentation du
projet.

## Contraintes du projet

WorldCards est un projet étudiant de jeu de cartes à échanger fondé sur les
pays du monde. Les cartes de base représentent un pays, sa capitale ou son
drapeau. Les cartes spéciales représentent un ancien drapeau, une ancienne
capitale ou un ancien nom de pays, et leur stock est limité. La rareté est
déterminée par la population du pays : moins un pays a d'habitants, plus ses
cartes sont rares.

Les choix techniques DOIVENT rester compatibles avec le temps et les moyens
d'un projet étudiant. Les données externes, leurs versions et leurs conditions
d'utilisation DOIVENT être identifiables. Aucune donnée secrète ou identifiant
privé NE DOIT être intégré au dépôt.

## Processus de développement

Une nouvelle fonctionnalité DOIT commencer par une spécification et être
décomposée en tâches vérifiables. Les changements de logique critique DOIVENT
inclure ou mettre à jour les tests automatisés correspondants. Avant
intégration, les tests pertinents DOIVENT réussir et la conformité aux principes
de cette constitution DOIT être vérifiée.

Les implémentations DOIVENT rester traçables jusqu'à leur spécification et à
leurs prompts de génération. Toute déviation nécessaire DOIT être signalée dans
la documentation de la fonctionnalité avec sa justification.

## Gouvernance

Cette constitution prévaut sur les pratiques contradictoires du projet. Toute
modification DOIT être proposée dans une mise à jour versionnée de ce fichier,
décrire son impact dans le rapport de synchronisation temporaire et vérifier
qu'elle ne rend pas les fonctionnalités existantes non conformes sans migration
documentée.

Le versionnage suit le format sémantique MAJEUR.MINEUR.PATCH :

- MAJEUR : suppression ou redéfinition incompatible d'un principe ou d'une
  obligation existante ;
- MINEUR : ajout d'un principe, d'une section ou d'une obligation substantielle ;
- PATCH : clarification, correction rédactionnelle ou précision non sémantique.

Chaque revue de fonctionnalité significative DOIT contrôler les principes
concernés, la couverture des tests critiques, la validation des entrées, la
traçabilité SDD et les licences des nouvelles sources. Une violation DOIT être
corrigée ou explicitement acceptée avec une justification documentée avant
intégration.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): date d'adoption initiale inconnue | **Last Amended**: 2026-10-04
