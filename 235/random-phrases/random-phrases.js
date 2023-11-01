const PHRASES = 
[
    "Listen to the music to help time your jumps",
    "Back for more are ya?",
    "Use practice mode to learn the layout of a level",
    "If at first you don't succeed, try, try again...",
    "Customize your character's icon and color!",
    "You can download all songs from the level select page!",
    "Spikes are not your friends. don't forget to jump",
    "Build your own levels using the level editor",
    "Go online to play other players levels!",
    "Can you beat them all?",
    "Here be dragons...",
    "Pro tip: Don't crash",
    "Hold down to keep jumping",
    "The spikes whisper to me...",
    "Looking for pixels",
    "Loading awesome soundtracks...",
    "What if the spikes are the good guys?",
    "Pro tip: Jump",
    "Does anyone even read this?",
    "Collecting scrap metal",
    "Waiting for planets to align",
    "Starting the flux capacitor",
    "Wandering around aimlessly",
    "Where did I put that coin...",
    "Loading the progressbar",
    "Calculating chance of success",
    "Hiding secrets",
    "Drawing pretty pictures",
    "Programmer is sleeping, please wait",
    "RobTop is Love, RobTop is Life",
    "Play, Crash, Rage, Quit, Repeat",
    "Only one button required to crash",
    "Such wow, very amaze.",
    "Fus Ro DASH!",
    "Loading Rage Cannon",
    "Counting to 1337",
    "It's all in the timing",
    "Fake spikes are fake",
    "Spikes... OF DOOM!",
    "Why don't you go outside?",
    "Loading will be finished... soon",
    "This seems like a good place to hide a secret...",
    "The vault Keeper's name is 'Spooky'...",
    "Hop the big guy doesn't wakt up...",
    "Shhhh! You're gonna wake the big one!",
    "I have been expecting you.",
    "A wild RubRub appeared!",
    "So many secrets...",
    "Hiding rocket launcher",
    "It's Over 9000!",
    "Programming amazing AI",
    "Hiding secret vault",
    "Spooky doesn't get out much",
    "RubRub was here",
    "Warp Speed",
    "So, what's up?",
    "Hold on, reading the manual",
    "I don't know how this works...",
    "Why u have to be mad?",
    "It is only game...",
    "Unlock new icons and colors by completing achievements"
]

window.onload = () =>
{
    document.querySelector("button").onclick = displayQuote;
    displayQuote();
};

/**
 * Generates a random index within phrases length and returns entry
 * @returns string phrase
 */
let getRandomPhrase = () =>
{
    return PHRASES[Math.floor(Math.random() * PHRASES.length)];
};

/**
 * Sets the phrase on the site to a random entry of phrases
 * @param {string} phrase 
 */
let populatePhrase = phrase =>
{
    document.querySelector("article").innerHTML = phrase;
};

/**
 * Displays the random phrase
 */
let displayQuote = () => populatePhrase(getRandomPhrase());