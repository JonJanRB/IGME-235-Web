"use strict"

let monsters = [];      // our array of monsters

/**
 * Our onload Event.
 * 
 */
window.onload = function ()
{
    makeSampleMonsters();
    showMonsters();
}

/**
 * Create a set of Sample Monsters.
 * 
 */
function makeSampleMonsters()
{
    let monster;

    monster = makeGoomba("John", 20, 30, 100);
    monsters.push(monster);
    monster = makeGoomba("Fred", 30, 100, 150);
    monsters.push(monster);
    monster = makeGoomba("Alice", 40, 150, 200);
    monsters.push(monster);
}

/**
 * Function that shows our monsters (just Goombas for now)
 * 
 */
function showMonsters()
{
    let goombaList = document.querySelector("#goombas");

    for (let i = 0; i < monsters.length; i++)
    {
        let liStr = "";
        let li = document.createElement("li");

        for (let key in monsters[i])
        {
            if (typeof monsters[i][key] !== "function")
            {
                liStr += `<b>${key}:</b> ${monsters[i][key]}<br />`;
            }
        }
        li.innerHTML = liStr;
        goombaList.appendChild(li);
    }
}

/**
 * create our base monster object with defaults.
 * 
 */
function createBaseMonster()
{
    return {
        name: "",
        hp: 100,
        speed: 10,
        score: 100,
        status: function ()
        {
            console.log("name: " + this.name + ", hp: " + this.hp + ", speed: " + this.speed + ", score: " + this.score);
        }
    }
}

/**
 * Create a Goomba.
 * 
 */
function makeGoomba(name, hp, speed, score)
{
    let goomba = createBaseMonster();
    goomba.name = name;
    goomba.hp = hp;
    goomba.speed = speed;
    goomba.score = score;
    goomba.takeDamage = function (dmgVal)
    {
        goomba.hp -= dmgVal;
    }
    goomba.powerUp = powerUp;

    Object.seal(goomba);
    return goomba;
}

/**
 * Function that can be used inside a monster object.
 * 
 */
function powerUp(val)
{
    this.speed += val;
    this.hp += val
    this.status();
};