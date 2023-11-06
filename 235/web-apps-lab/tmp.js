"use strict"

let monsters = [];      // our array of monsters

/**
 * Our onload Event.
 * 
 */
window.onload = function ()
{
    makeSampleMonsters();
    showMonsters("goomba", "#goombas");
    showMonsters("boo", "#boos");
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

    //Boos
    monsters.push(makeBoo("Boona", 5, 150, 100));
    monsters.push(makeBoo("Scramboo", 10, 156, 110));
    monsters.push(makeBoo("Sboonbo", 5, 140, 90));
}

/**
 * Function that shows our monsters (just Goombas for now)
 * @param {string} monsterType 
 * @param {string} element 
 */
function showMonsters(monsterType, element)
{
    let monsterList = document.querySelector(element);

    for (let i = 0; i < monsters.length; i++)
    {
        if(monsters[i].type === monsterType)
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
            monsterList.appendChild(li);
        }
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
        },
        type: "monster"
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
    goomba.type = "goomba";

    Object.seal(goomba);
    return goomba;
}

/**
 * Creates a Boo
 * @param {string} name 
 * @param {number} hp 
 * @param {number} speed 
 * @param {number} score 
 * @returns {object}
 */
function makeBoo(name, hp, speed, score)
{
    let boo = createBaseMonster();
    boo.name = name;
    boo.hp = hp;
    boo.speed = speed;
    boo.score = score;
    boo.takeDamage = function (dmgVal)
    {
        boo.hp -= dmgVal;
    }
    boo.powerUp = powerUp;
    boo.type = "boo";

    Object.seal(boo);
    return boo;
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