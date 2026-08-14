# Reverse: 1999 Notes — Data Model

## Core Entities

The application currently uses three main entities:

- Arcanist
- Mechanic
- Status Effect

## Arcanist

Fields:

- id
- name
- afflatus
- damageType
- roles
- skills
- portray
- mechanics
- tags
- notes

## Mechanic

Fields:

- id
- name
- category
- shortDescription
- detailedDescription
- examples
- relatedArcanists
- relatedStatusEffects
- tags
- notes

## Status Effect

Fields:

- id
- name
- category
- description
- effect
- duration
- stackable
- relatedArcanists
- relatedMechanics
- tags
- notes

## Relationships

Arcanists can be related to:

- Mechanics
- Status Effects

Mechanics can be related to:

- Arcanists
- Status Effects

Status Effects can be related to:

- Arcanists
- Mechanics
