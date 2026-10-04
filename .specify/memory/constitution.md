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

### I. Draw Integrity
All booster-draw logic, including probabilities and decrementation of special-card
stock, MUST run on the server. The client MUST NOT influence or predict a draw.
Automated tests MUST verify draw rules and stock limits.

### II. Data Consistency
Population, capital, and flag data MUST come from one reliable, documented source.
Every update MUST recalculate rarity consistently and MUST preserve a stable
interpretation for cards already owned by players and for new cards. Data
migrations MUST be explicit and verifiable.

### III. Simplicity First
The implementation MUST favor the simplest solution that satisfies WorldCards'
requirements. Additional complexity MUST be justified by a concrete, documented,
verifiable need. Premature abstractions, extensions, and optimizations MUST NOT
be introduced.

### IV. Critical-Logic Testing
Rarity calculation and booster draws MUST be covered by automated tests for
normal cases, boundaries, and exhausted stock. The visual interface MAY have
lower coverage when business logic is tested independently.

### V. Basic Security
Passwords MUST be hashed with an appropriate mechanism and MUST NEVER be stored
or exposed in plain text. Sensitive data MUST NOT be sent to the client. All
user input MUST be validated on the server before processing or persistence, and
validation errors MUST be returned explicitly.

### VI. Process Traceability
Every significant feature MUST be traceable to a specification and the prompts
used to generate it. Important decisions and deviations between specification
and implementation MUST be documented so that the SDD and vibe-coding process
can be evaluated.

### VII. License Compliance
Country-data sources and flag images MUST be legally usable for the project. The
license or terms of use for each source MUST be identified before integration,
and required attributions MUST be retained in project documentation.

## Project Constraints

WorldCards is a student trading card game project based on the countries of the
world. Base cards represent a country, its capital, or its flag. Special cards
represent a former flag, former capital, or former country name, and have limited
stock. Rarity is determined by country population: the fewer inhabitants a
country has, the rarer its cards are.

Technical choices MUST remain compatible with the time and resources of a
student project. External data, its versions, and its terms of use MUST be
identifiable. No secret data or private identifier MUST be committed to the
repository.

## Development Process

Each new feature MUST begin with a specification and be broken into verifiable
tasks. Changes to critical logic MUST include or update the corresponding
automated tests. Before integration, relevant tests MUST pass and compliance
with this constitution MUST be checked.

Implementations MUST remain traceable to their specification and generation
prompts. Any necessary deviation MUST be reported in the feature documentation
with its justification.

## Governance

This constitution takes precedence over contradictory project practices. Every
change MUST be proposed in a versioned update to this file, describe its impact
in the temporary sync report, and verify that it does not make existing
features non-compliant without a documented migration.

Versioning follows the semantic MAJOR.MINOR.PATCH format:

- MAJOR: removal or incompatible redefinition of an existing principle or
  obligation;
- MINOR: addition of a principle, section, or substantive obligation;
- PATCH: clarification, editorial correction, or non-semantic refinement.

Each significant feature review MUST check the relevant principles, critical-test
coverage, input validation, SDD traceability, and licenses for new sources. A
violation MUST be corrected or explicitly accepted with documented
justification before integration.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date unknown | **Last Amended**: 2026-10-04
