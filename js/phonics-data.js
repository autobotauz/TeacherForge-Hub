// Phonics data with sample words and audio mappings

const PhonicsData = {
    singleSounds: {
        a: {
            examples: [
                'apple', 'ant', 'alligator', 'astronaut', 'ambulance', 'arrow',
                'axe', 'actor', 'anchor', 'atom', 'animal', 'atlas', 'ankle', 'acorn',
                'alphabet', 'answer'
            ],
            soundIcon: '🔊',
            type: 'short vowel',
            alternateExamples: [
                'at', 'an', 'as', 'and', 'act', 'ask', 'add', 'am', 'ax',
                'abs', 'app', 'ash', 'age', 'aid', 'ace'
            ]
        },
        b: {
            examples: [
                'ball', 'bat', 'boy', 'box', 'book', 'bear', 'bike', 'boat',
                'butterfly', 'banana', 'button', 'balloon', 'bridge', 'bottle',
                'brother', 'beach', 'bird', 'bucket'
            ],
            soundIcon: '🔊',
            type: 'consonant',
            alternateExamples: [
                'big', 'but', 'bad', 'bed', 'buy', 'been', 'back', 'best',
                'blue', 'bold', 'burn', 'bend', 'boot', 'bone', 'bag'
            ]
        },
        c: {
            examples: [
                'cat', 'car', 'cup', 'cone', 'cake', 'cave', 'cow', 'corn',
                'camel', 'castle', 'candle', 'cookie', 'carrot', 'camera',
                'candy', 'crown', 'cloud', 'crab'
            ],
            soundIcon: '🔊',
            type: 'consonant',
            alternateExamples: [
                'can', 'cut', 'come', 'cold', 'call', 'city', 'cook',
                'code', 'coat', 'cart', 'cool', 'cage', 'case', 'core', 'curl'
            ]
        },
        d: {
            examples: [
                'dog', 'duck', 'door', 'dig', 'desk', 'dance', 'dolphin',
                'dinosaur', 'dragon', 'doctor', 'donkey', 'dress', 'drum',
                'diamond', 'dentist', 'dove', 'deer', 'daisy'
            ],
            soundIcon: '🔊',
            type: 'consonant',
            alternateExamples: [
                'day', 'dark', 'deep', 'down', 'disk', 'dust', 'dive',
                'draw', 'drop', 'dare', 'dash', 'dome', 'dock', 'dine', 'doll'
            ]
        },
        e: {
            examples: ['egg', 'end', 'elk', 'enter', 'empty', 'exit'],
            soundIcon: '🔊',
            type: 'short vowel',
            alternateExamples: ['elf', 'edge', 'every', 'echo', 'else', 'extra']
        },
        f: {
            examples: ['fish', 'fan', 'fox', 'fire', 'foot', 'farm'],
            soundIcon: '🔊',
            type: 'consonant',
            alternateExamples: ['fun', 'fast', 'five', 'food', 'fall', 'face']
        },
        g: {
            examples: ['goat', 'game', 'girl', 'gate', 'gold', 'gift'],
            soundIcon: '🔊',
            type: 'consonant',
            alternateExamples: ['good', 'get', 'give', 'grab', 'grow', 'gone']
        }
    },
    blends: {
        bl: {
            examples: [
                'blue', 'black', 'blade', 'blow', 'blast', 'bloom', 'blood',
                'blanket', 'blouse', 'blessing', 'blossom', 'blister', 'blame',
                'blender', 'blindfold', 'blizzard', 'blueberry', 'blazer'
            ],
            soundIcon: '🔊',
            type: 'initial blend',
            alternateExamples: [
                'blank', 'block', 'blend', 'blind', 'blink', 'blush',
                'blur', 'blip', 'blob', 'blink', 'blade', 'blaze', 'blow',
                'blame', 'blend'
            ]
        },
        br: {
            examples: [
                'brave', 'brown', 'bread', 'break', 'brush', 'brain', 'brother',
                'breakfast', 'bracelet', 'broccoli', 'bridge', 'breeze', 'branch',
                'brick', 'bright', 'bruise', 'brake', 'broom'
            ],
            soundIcon: '🔊',
            type: 'initial blend',
            alternateExamples: [
                'bring', 'brake', 'brick', 'bridge', 'bright', 'branch',
                'brief', 'brew', 'brag', 'bred', 'browse', 'broil', 'brace',
                'brisk', 'brand'
            ]
        },
        cl: {
            examples: ['cloud', 'clap', 'clock', 'clip', 'climb', 'close'],
            soundIcon: '🔊',
            type: 'initial blend',
            alternateExamples: ['clean', 'clear', 'clay', 'claw', 'class', 'cliff']
        }
        // Add more blends as needed
    },
    digraphs: {
        ch: {
            examples: [
                'chair', 'child', 'chin', 'cheese', 'church', 'chest', 'chicken',
                'chocolate', 'cherry', 'champion', 'chain', 'teacher', 'beach',
                'watch', 'peach', 'porch', 'lunch', 'ranch'
            ],
            soundIcon: '🔊',
            type: 'consonant digraph',
            alternateExamples: [
                'chip', 'chain', 'chop', 'chalk', 'check', 'chart', 'chase',
                'choose', 'cheat', 'chief', 'chick', 'chess', 'chunk', 'rich',
                'much'
            ]
        },
        sh: {
            examples: [
                'ship', 'shoe', 'shell', 'shark', 'sheep', 'shop', 'shower',
                'shadow', 'shoulder', 'shovel', 'shirt', 'shine', 'shape',
                'polish', 'finish', 'trash', 'bush', 'fish'
            ],
            soundIcon: '🔊',
            type: 'consonant digraph',
            alternateExamples: [
                'shut', 'shed', 'shine', 'shake', 'share', 'shade', 'shelf',
                'shop', 'shoot', 'short', 'show', 'sharp', 'shave', 'rush',
                'wash'
            ]
        },
        th: {
            examples: ['thin', 'thumb', 'three', 'think', 'throw', 'thief'],
            soundIcon: '🔊',
            type: 'consonant digraph',
            alternateExamples: ['that', 'this', 'them', 'then', 'there', 'these']
        }
        // Add more digraphs as needed
    }
};

// Helper functions for working with phonics data
const PhonicsSamples = {
    /**
     * Get random example words for a given sound
     * @param {string} soundType Type of sound (singleSounds, blends, digraphs)
     * @param {string} sound The specific sound
     * @param {number} count Number of examples to return
     * @returns {string[]} Array of example words
     */
    getRandomExamples(soundType, sound, count = 9) {
        const data = PhonicsData[soundType][sound];
        if (!data) return [];

        // Combine main and alternate examples
        const allExamples = [...data.examples, ...data.alternateExamples];
        
        // Shuffle and return requested number of examples
        return this.shuffleArray(allExamples).slice(0, count);
    },

    /**
     * Get sound type information
     * @param {string} soundType Type of sound
     * @param {string} sound The specific sound
     * @returns {object} Sound type info
     */
    getSoundInfo(soundType, sound) {
        return PhonicsData[soundType][sound] || null;
    },

    /**
     * Shuffle array using Fisher-Yates algorithm
     * @param {array} array Array to shuffle
     * @returns {array} Shuffled array
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
};

// Export for use in other scripts
window.PhonicsData = PhonicsData;
window.PhonicsSamples = PhonicsSamples;