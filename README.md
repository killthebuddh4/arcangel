# DRAFT tiny-arc

I recently listened to [this
episode](https://www.preposterousuniverse.com/podcast/2024/06/24/280-francois-chollet-on-deep-learning-and-the-meaning-of-intelligence/)
of Sean Carrol's Mindscape podcast.

The basic purpose of the episode is to disabuse us of our belief that AGI is
imminent. I began the episode with a kind of soft anxiety about the AGI
takeover. I wasn't super worried about existential risk, but I was pretty worried
about a ton of people losing their jobs to AI, including myself. I was also of
the opinion that GPT-4+-tier models are "quite intelligent". Sure, there's some
things where they fall all over themselves, but for the most part they're pretty
smart. These ideas have been mostly drawn from my use of the models ass
programmer copilots, they're capability as such seem to be improving _quite
rapidly_.

I began the episode with these ideas that people like Yann LeCunn and Sean
Carrol (and as it turns out Francois Chollet) are missing the forest for the
trees and/or making distinctions without differences.

The episode, and some follow up investigations I've done, haven't really quantitatively
changed my ideas, but I definitely see the (idk) "anti-doomers" position in a
more charitable light.

The crux of Chollet's argument, and the thing that has done the most work on
changing my ideas a bit, is that GPT-4 et al don't "just kind of fall over in
certain situations", they're actually really really dumb in cases where you'd
really really expect them to not be if they're at all "generally intelligent".

Chollet's [ARC competition](https://arcprize.org/) makes a much stronger
argument than I expected. It's questions are actually _very very easy_ and GPT-4
et al just _really don't solve them well at all_. Additionally, it seems clear
that the way we can hammer the models into eventually getting the right answer
doesn't really show any intelligence. IMO Claude is the least bad, but even with
Claude it doesn't seem like we are helping the model reason, it feels more like
prompt engineering. (Maybe the difference is moot, FWIW).

So, what I'm wondering is what can we give an LLM to make it solve ARC. Right
now an LLM can't solve ARC, but could an LLM with function calling solve ARC?
What would the right functions be? How general can we make the functions so that
they can solve ARC?
