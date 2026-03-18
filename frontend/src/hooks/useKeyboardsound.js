
const keyStrokeSounds = [
    new Audio("/sounds/keystroke1.mp3"),
    new Audio("/sounds/keystroke2.mp3"),
    new Audio("/sounds/keystroke3.mp3"),
    new Audio("/sounds/keystroke4.mp3")
]

function useKeyboardSound () {

    const playRandomKeyStrokeSound = () => {

        const randomSound = keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)];

        randomSound.currentTime = 0;            // for better ux
        randomSound.play().catch(error => console.log("Failed to play keystroke audio", error));

    }   



    return { playRandomKeyStrokeSound }; 

}

export default useKeyboardSound;