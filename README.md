# Arcangel

Arcangel is a programming language and agent for solving [ARC](https://arcprize.org/arc). It's a first step on a path to the world's first [system 2 compiler](https://gadfly.run) and, eventually, AGI.

# Language

_The language will certainly change as we experiment with various tradeoffs between expressiveness, compactness, etc._

So, `arcangel` is a language for solving ARC, so it's fundamentally about colored grids. But also the colors produce structure, so we need something more flexible than just grid. Let's just brainstorm some primitives:

- field
- point
- row
- column
- boundary
- line
- ray
- shape
- color
- direction
- predicate
- region
- set
- box
- coordinate

What about LLM primitives like maybe "system" or "message" or "natural language"? Or conversation?

- system
- message
- model
- language
- conversation
- agent

Or maybe the agent is another language altogether?

What about ARC primitives that aren't about the Grid?

- task
- pair
- rule

What about primitives for exploration?

- fork
- merge
- select
- expand
- generate
- evolution
- simulate
- commit

Is this another language as well?

- git
- agent
- arc

And these languages interact with eachother?
  

---

So I think we have

- Point := (x, y, energy)
- Set := Predicate

- Predicate (Grid, Point) -> Boolean
- Property Grid -> Boolean
- Relation Grid, Grid -> Boolean
- Invariant Grid[] -> Boolean

Point, Set

1P:1P
1P:NP
1P:1S
1P:NS
NP:1P
NP:NP
NP:1S
NP:NS
1S:1S
1S:NS
1S:1P
1S:NP
NS:1S
NS:NS
NS:1P
NS:NP

the set of all points within 1 unit from (x, y)

the set of all blue points

predicate
  isRay
conditions
  isField
  isBlue
  isGood
description
  ""
signature
  (set, point)
function
  // do stuff
end

NW    N    NE
W  (x, y)  E
SW    S    SE


iter ray
  (point, dir) => {
    //
  }
end

with
  X
ray
  (2, 3), NE
do |point|
  // do stuff
end



def:
  X
with:
  Field
select:
  (Field, P) -> boolean
  (Field, P) -> boolean
end

-> methods


- Point := (x, y, z)
- Set := Point, Point, ...
- Ordering := Set => Point[]
- Predicate := Set => Boolean

__TODO__

I need to think just a little bit more about what are the primitives. I mean, I'm not even 100% sure I have it clear in my head what makes a good primitive set. The more keywords you have the more "domain knowledge" you need in your head but also your programs will be short. What is the sweet spot for a human programmer? What is the sweet spot for an LLM? Is there a difference?


