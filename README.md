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


kw
  exp
  exp
  exp
end

kw  
  exp
name
  exp
name
  exp
end

(a: Type, b: Type, c: Type): Type => {
  return ...
}


def
set
func
call
struct
sequence
read
write
map
filter
reduce
if
and
or
switch

switch
  if 
    x === 10
  then
    ...
  else
    ...
  end

  if 
    x === 10
  then
    ...
  else
    ...
  end

end


case y => y < 0:
  ...
case z => z > 0:
  ...
end

map
  numbers

  do


  end
end

filter
  numbers

  do


  end
end

reduce
  numbers

  func

  end

  init
end





def
  X
with:
  Field
select:
  (Field, P) -> boolean
  (Field, P) -> boolean
end

kw1 exp
kw2 exp
kw3 exp
end

SIGNATURE IS DIFF

fn signature

end

CALL DATA IS DIFF

def
  x
  exp
end

set
  x
  exp
end

func signature
  ...
end

call f
  a exp
  b exp
  ...
end

struct
  key k value v end
  key k2 value v2 end
  ...
end

sequence
  exp 
  exp
  exp
  ...
end

read
  o
  v
end

write
  o
  k
  v
end




@ name
  a1 exp1
  a2 exp2
  a3 exp3
end

seq
  exp
  exp
  exp
  exp
  exp
  ...
end

def
  obj
struct
  key
    x
  value
    ...
  end

  key
    y
  value
    ...
  end
end

read x v end

write x vvv end

struct
  key
    x
  value
    y
  end


  key
    x
  value
    z
  end
end

sequence

read
  o
key
  k
end

write
  o
key
  y
value
  ...
end

read
  structObj or seqObj
do
  key
    whatever
  value
    thing
  end

  key
    other
  value
    other value
  end
end

write
  structObj or seqObj
do
  key
    whatever
  value
    thing
  end

  key
    other
  value
    other value
  end
end



def
  name
do
  ...
end

kw exp
kw exp
kw exp
kw exp
...

do
  exp
  exp
  exp
  ...
end

and
  exp
  exp
  exp
  ...
end

or
  exp
  exp
  exp
  ...
end



do
  def
    piped
  do
    map
      y
    do
      double
    end
  end

  let
    piped
  do
    map
      piped
    do
      decrement
    end
  end

  let
    piped
  do
    reduce
      piped
    do
      sum
    end
  end
end






with
  thing
map
  y
do
  ...
filter
  thing
do
  ...
end


- Point := (x, y, z)
- Set := Point, Point, ...
- Iterator := Set -> Sequence
- Sequence := Point[]
- Predicate := Set => Boolean
- Type := Predicate, Predicate, Predicate...
- Structure := (Set, Type)

__TODO__

I need to think just a little bit more about what are the primitives. I mean, I'm not even 100% sure I have it clear in my head what makes a good primitive set. The more keywords you have the more "domain knowledge" you need in your head but also your programs will be short. What is the sweet spot for a human programmer? What is the sweet spot for an LLM? Is there a difference?


map, filter, reduce


A Set starts out Unknown -> -> add predicates -> Workable (or whatever)

type X =
  predicate 1
  predicate 2
  predicate 3
  predicate 4

do



end

and
  () end
  () end
  () end
  () end
  () end
end


---

time language
dsl language
dialogue language
state tree

you have a language
you have a program
you have a history
you have an engine


def
  options
with
  goal
do
  'do this thing'

  'do that thing'

  'do something else'
end

def
  best_option
filter
  options
do
  succeeded?
  quickly?
end


// with arc

inputs -> outputs

what is the rule?

the rule is basically

what properties do the inputs have?
what language do the inputs speak?
what properites do the outputs have?
what language do the outputs speak?
what is a description of the relationship between the two?
what is a program written in

type Coordinate = number;

type Energy = number;

type Dimension = number;

type Time = number;

type Datum = {
  t: Time;
  x: Coordinate;
  y: Coordinate;
  energy: Energy;
}

type Set := unordered

type Sequence := ordered

type Field = {
  height: Dimension;
  width: Dimension;
  data: Set<Datum>;
}




Primitive Types

- Undefined
- Null
- Number
- Boolean
- String
- Map
- Array
- Struct

Named Parameters

kw
  name exp
  name exp
  name exp
end

Ordered Parameters

kw
  exp
  exp
  exp
end

Function Call

@name
  name => exp
  name => exp
  name => exp
end

Function Definition

(a: C: b: C c: C): P => exp

Struct

struct
  id: String
  name: String
end

Type

...TODO...

Map Literal

{}

Array Literal

[]

Numerical Operators

+, *, /, -,

Boolean Operators

&&, ||, !

Comments

"hash"

Feedback, Commentary, Thoughts

...TODO...

return
  do

  end
end


Keywords

- {}
- keys
- []
- ...
- def
- let (redef)
- () => {}
- @ (call)
- do
- if
  - when
  - then
  - else
- switch
  - when
  - then
- return

read, write, def, () => {}, do, for, call, struct, map, array, return



def x 5 end



rows
  grid
end

columns
  grid
end

call f
  a n
  b n
  c v
  