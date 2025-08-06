//greetings to amalgama's developer team, I will solve this while thinking of age of empires.

/* 
class Civilization
name: civ's name. type String
coins: civ's # of coins. type Int
army: type [[Unit], Bool] tuple (units array, ordered flag)
points: civ's points. type Int
battleHistory: history of battles with other civs. type [String]
*/

class Civilization {
    constructor(name, army) {
        this.name = name
        this.coins = 1000
        this.army = this.createArmy(army)
        this.points = this.countPoints()
        this.battleHistory = []
    }

    countPoints() {
        return this.army[0].reduce((sum, unit) => sum + unit.points, 0)
    }

    createArmy(army) {
        let armyArr = []

        const unitCreator = (pikemen, archers, knights) => {
            //set random age for soldier (value between 16 and 60)
            let age = () => Math.floor(Math.random() * (60 - 16 + 1)) + 16;

            for (let i = 0; i < knights; i++) {
                let newKnight = new Unit("knight", age())
                armyArr.push(newKnight)
            }
            for (let i = 0; i < archers; i++) {
                let newArcher = new Unit("archer", age())
                armyArr.push(newArcher)

            }
            for (let i = 0; i < pikemen; i++) {
                let newPikeman = new Unit("pikeman", age())
                armyArr.push(newPikeman)
            }
        }

        unitCreator(army.pikemen, army.archers, army.knights)

        //I initialize it in true because sinde knights are pushed first, archers second and pikemen last the list is ordered
        return [armyArr, true]

    }

    removeSoldier = () => {
        //if the sorted flag is false I sort and set the flag to true
        if (!this.army[1]) {
            this.army[0].sort((a, b) => b.points - a.points)
            this.army[1] = true
        }
        let soldier = this.army[0].shift()

        this.points -= soldier.points
    }

    trainUnit = (type) => {
        let soldierToTrain = this.army[0].find(unit => unit.type === type)

        if (!soldierToTrain) {
            throw new Error(`No ${type} available to train`);
        }

        //I substract the points of the soldier to civ's points before improving the soldier and then I add them after improvement
        this.points -= soldierToTrain.points
        //method train of a unit modifies the unit and returns training cost
        this.coins -= soldierToTrain.train()
        this.points += soldierToTrain.points
        //training a unit implies disorganizing the array
        this.army[1] = false
    }
    transformUnit = (type) => {
        let soldierToTransform = this.army[0].find(unit => unit.type === type)

        if (!soldierToTransform) {
            throw new Error(`No ${type} available to transform`);
        }

        this.points -= soldierToTransform.points
        this.coins -= soldierToTransform.transform()
        this.points += soldierToTransform.points
        this.army[1] = false

    }
}

/* class Unit
type: type of the unit("pikeman", "archer", "knight"). Type String
age: Unit's age. Type Int
points: points provided by the unit. Type Int.
*/

class Unit {
    constructor(type, age) {
        this.type = type
        this.age = age

        if (type === "pikeman") {
            this.points = 5
        }
        else if (type === "archer") {
            this.points = 10
        }
        else if (type === "knight") {
            this.points = 20
        }
        else {
            throw new Error("this unit doesn't exist")
        }
    }

    train() {
        let trainingCost = 0
        let addedPoints = 0

        switch (this.type) {
            case "pikeman":
                trainingCost = 10
                addedPoints = 3
                break
            case "archer":
                trainingCost = 20
                addedPoints = 7
                break
            case "knight":
                trainingCost = 30
                addedPoints = 10
                break
        }

        this.points += addedPoints
        return trainingCost
    }

    transform() {
        switch (this.type) {
            case "pikeman":
                this.type = "archer"
                this.points = 10
                return 30
            case "archer":
                this.type = "knight"
                this.points = 20
                return 40
            case "knight":
                //cannot be transformed
                throw new Error("knights cannot be transformed");

        }
    }


    getAge() {
        return this.age
    }

}

//I initialize the civs
let chinese = new Civilization("chinese", { pikemen: 2, archers: 25, knights: 2 })
let british = new Civilization("british", { pikemen: 10, archers: 10, knights: 10 })
let byzantines = new Civilization("byzantines", { pikemen: 5, archers: 8, knights: 15 })


//functions to call during turns

const battle = (civ1, civ2) => {
    if (civ1.points < civ2.points) {
        civ1.removeSoldier()
        civ1.removeSoldier()
        civ2.coins += 100
        civ1.battleHistory.push(civ2.name)
        civ2.battleHistory.push(civ1.name)
    }
    else if (civ1.points > civ2.points) {
        civ2.removeSoldier()
        civ2.removeSoldier()
        civ1.coins += 100
        civ1.battleHistory.push(civ2.name)
        civ2.battleHistory.push(civ1.name)
    }
    else {
        // I chose to remove best unit from both armies, for simplification
        civ1.removeSoldier()
        civ2.removeSoldier()
        civ1.battleHistory.push(civ2.name)
        civ2.battleHistory.push(civ1.name)
    }
}

const trainSoldier = (civ, type) => {
    let trainingCost = {
        pikeman: 10,
        archer: 20,
        knight: 30
    }

    if (civ.coins >= trainingCost[type]) {
        civ.trainUnit(type)
    } else {
        throw new Error("not enough coins");
    }

}
const transformSoldier = (civ, type) => {

    if(type === "knight"){
        throw new Error("knights cannot be transformed");
    }

    let transformingCost = {
        pikeman: 30,
        archer: 40
    }

    if (civ.coins >= transformingCost[type]) {
        civ.transformUnit(type)
    } else {
        throw new Error("not enough coins");
    }

}


/* 
Notes:

> Why I chose to use Javascript: Firstly, it is the language I have the most experience with. Secondly, for web development and the technologies mentioned in the job application, this is the most used language, so I saw fit to showcase my skills with it.

> About the modelling: I struggled the most with choosing how to represent the army. I thought of several models using max heaps to optimize removing the most valuable soldiers, but the tradeoffs weren't worth it. Here are the models, in case you are curious (I would love to get the opportunity to explain myself further in a meeting):

*Option 1: Single max-heap of all units
Pros: Efficient deletion (O(log n)).
Cons: Training and transforming become really complex, since an arbitrary unit is affected and updating a heap in such conditions is tough. Total time complexity is reduced to O(n) (remove O(n) + insert O(log n)) but implementing is really hard and untidy)

*Option 2: Three separate heaps (pikemen, archers, knights)
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


*/
