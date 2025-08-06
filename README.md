Hi!

I also left the following notes in the file, in case it feels more natural to read it after reviewing the code.

> Why I chose to use Javascript: Firstly, it is the language I have the most experience with. Secondly, for web development and the technologies mentioned in the job application, this is the most used language, so I saw fit to showcase my skills with it.

> About the modelling: I struggled the most with choosing how to represent the army. I thought of several models using max heaps to optimize removing the most valuable soldiers, but the tradeoffs weren't worth it. Here are the models, in case you are curious (I would love to get the opportunity to explain myself further in a meeting):

*Option 1: Single max-heap of all units
Pros: Efficient deletion (O(log n)).
Cons: Training and transforming become really complex, since an arbitrary unit is affected and updating a heap in such conditions is tough. Total time complexity is reduced to O(n) (remove O(n) + insert O(log n)) but implementing is really hard and untidy)

*Option 2: Three separate heaps (pikemen, archers, cavalry)
Pros: Efficient deletion (compare 3 roots). Compare θ(1), Extract O(log n)
Cons: Always training/transforming the "best" unit. Makes no sense as a player (although this wasn't asked in the task) to transform your best unit of a type. Mantaining Heap structure between three heaps might be hard with transformations, but less complex than option 1, because you are moving one unit from a Heap to another. O(log n) (If chosen an implementation that improves an arbitrary unit, the same problem with option 1 arises).
Note: In terms of complexity this is the best option.

*Option 3: Three arrays for each unit type + one heap with whole army. O(n) to train and update probably (I didn't explore this option very thoroughly)
Pros: Easy training/transforming using arrays, freedom to choose improving unit.
Cons: Heap becomes out of sync when units are modified, and really difficult to update.

Main tradeoff:
Heaps optimize deletions but complicate modifications
Arrays simplify modifications but make deletions slower
Hybrid approaches add synchronization complexity

My option: Single unsorted (most of the times) array. I added a flag to only sort it is unsorted, which creates θ(1) in best case scenario.

Pros: 
- Easily the simplest to implement. Considering armies are small and can't grow I chose the most clear and easiest option to code and read. 

Cons:
- Time complexity grows from O(log n) to O(n log n) (sorting the array)
- Always same unit is improved (since it's the first appearence of a unit with a certain type). However, solving it in this model is probably easier than in Option 2.

One may argue that the requirement "any unit can be trained or transformed" is not met. I consider this to be partially true: my algorithm always modifies the first unit found of the given type, meaning no other unit is affected unless the first one is removed.

However, since every unit implements the train method, each one is capable of being trained or transformed. So technically, every unit could be modified, it just doesn't happen in most cases.
