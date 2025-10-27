// Wait for all scripts to load before initializing
window.addEventListener('load', () => {
    // Check if required data is loaded
    if (typeof PhonicsData === 'undefined' || typeof PhonicsSamples === 'undefined' || 
        typeof PdfUtils === 'undefined' || typeof PDF_SYMBOLS === 'undefined') {
        console.error('Required data or utilities not loaded. Please check script loading order.');
        alert('Error: Could not load required data. Please refresh the page.');
        return;
    }

    class PhonicsSheetMaker {
        constructor() {
            this.currentExamples = [];
            this.colorSchemes = {
                beginner: '#FFE0E0',
                intermediate: '#E0FFE0',
                advanced: '#E0E0FF'
            };
            this.initializeColorInputs();
            this.setupEventListeners();
        }

        initializeColorInputs() {
            ['beginnerColor', 'intermediateColor', 'advancedColor'].forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    const colorType = id.replace('Color', '');
                    input.value = this.colorSchemes[colorType];
                }
            });
        }

        setupEventListeners() {
            // Form submission
            const form = document.getElementById('phonicsForm');
            if (form) {
                form.addEventListener('submit', (e) => this.handleFormSubmit(e));
            }

            // Sound type selection
            const soundTypeSelect = document.getElementById('soundType');
            if (soundTypeSelect) {
                soundTypeSelect.addEventListener('change', () => this.updateSoundOptions());
                // Initialize sound options immediately
                this.updateSoundOptions();
            }

            // Sound selection
            const soundSelect = document.getElementById('sound');
            if (soundSelect) {
                soundSelect.addEventListener('change', () => this.updateExampleSuggestions());
            }

            // Example suggestions
            const suggestButton = document.getElementById('suggestExamples');
            if (suggestButton) {
                suggestButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.fillExampleSuggestions();
                });
            }

            // Form clearing
            const clearButton = document.getElementById('clearBtn');
            if (clearButton) {
                clearButton.addEventListener('click', () => this.clearForm());
            }

            // Color customization
            ['beginnerColor', 'intermediateColor', 'advancedColor'].forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    input.addEventListener('change', (e) => {
                        const colorType = id.replace('Color', '');
                        this.colorSchemes[colorType] = e.target.value;
                        this.updateSoundDisplay(); // Refresh the display with new color
                    });
                }
            });
        }

        updateSoundOptions() {
            const soundTypeSelect = document.getElementById('soundType');
            const soundSelect = document.getElementById('sound');
            const selectedType = soundTypeSelect.value;

            // Clear and populate sound options
            soundSelect.innerHTML = '';
            
            if (PhonicsData[selectedType]) {
                Object.keys(PhonicsData[selectedType]).forEach(sound => {
                    const option = document.createElement('option');
                    option.value = sound;
                    option.textContent = sound.toUpperCase();
                    soundSelect.appendChild(option);
                });

                // Select first option and update examples
                if (soundSelect.options.length > 0) {
                    soundSelect.selectedIndex = 0;
                    this.updateExampleSuggestions();
                }
            }
        }

        updateExampleSuggestions() {
            const soundType = document.getElementById('soundType').value;
            const sound = document.getElementById('sound').value;

            if (PhonicsData[soundType]?.[sound]) {
                this.currentExamples = PhonicsSamples.getRandomExamples(soundType, sound);
                this.updateSoundDisplay();
            }
        }

        updateSoundDisplay() {
            const soundType = document.getElementById('soundType').value;
            const sound = document.getElementById('sound').value;
            const soundInfo = PhonicsSamples.getSoundInfo(soundType, sound);
            
            if (soundInfo) {
                const infoDisplay = document.getElementById('soundInfo');
                if (infoDisplay) {
                    const difficulty = this.getDifficulty(soundType);
                    infoDisplay.textContent = `${soundInfo.type} ${PDF_SYMBOLS.soundIcon}`;
                    infoDisplay.style.backgroundColor = this.colorSchemes[difficulty];
                    infoDisplay.dataset.type = soundInfo.type;
                }
            }
        }

        getDifficulty(soundType) {
            switch (soundType) {
                case 'singleSounds': return 'beginner';
                case 'blends': return 'intermediate';
                case 'digraphs': return 'advanced';
                default: return 'beginner';
            }
        }

        fillExampleSuggestions() {
            if (this.currentExamples.length === 0) {
                this.updateExampleSuggestions();
            }

            const inputs = Array.from({ length: 9 }, (_, i) => 
                document.getElementById(`example${i + 1}`));
            
            inputs.forEach((input, index) => {
                if (input && !input.value.trim() && this.currentExamples[index]) {
                    input.value = this.currentExamples[index];
                    input.classList.add('filled-suggestion');
                    setTimeout(() => input.classList.remove('filled-suggestion'), 1000);
                }
            });
        }

        clearForm() {
            const form = document.getElementById('phonicsForm');
            if (form) {
                form.reset();
                this.updateSoundOptions();
            }
        }

        showLoading() {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) overlay.style.display = 'flex';
        }

        hideLoading() {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) overlay.style.display = 'none';
        }

        async handleFormSubmit(e) {
            e.preventDefault();

            try {
                this.showLoading();
                const formData = new FormData(e.target);
                const title = formData.get('title');
                const soundType = formData.get('soundType');
                const sound = formData.get('sound');
                
                // Collect non-empty example words
                const examples = Array.from({ length: 9 }, (_, i) => 
                    formData.get(`example${i + 1}`))
                    .filter(word => word && word.trim());

                if (examples.length < 2) {
                    throw new Error('Please provide at least 2 example words.');
                }

                await this.generatePDF(title, soundType, sound, examples, formData);
            } catch (error) {
                console.error('Error generating worksheet:', error);
                alert(error.message || 'There was an error generating your worksheet. Please try again.');
            } finally {
                this.hideLoading();
            }
        }

        async generatePDF(title, soundType, sound, examples, formData) {
            const doc = PdfUtils.createDocument();
            const pageWidth = doc.internal.pageSize.width;
            let yPosition = 40;

            // Add title
            PdfUtils.addTitle(doc, title || `Phonics Practice: ${sound.toUpperCase()}`, yPosition);
            yPosition += 40;

            // Add instructions from the form or use default
            const customInstructions = formData.get('instructions');
            const defaultInstructions = `Practice the ${soundType === 'digraphs' ? 'digraph' : 
                soundType === 'blends' ? 'blend' : 'sound'} "${sound.toUpperCase()}" in these words.`;
            yPosition = PdfUtils.addInstructions(doc, customInstructions || defaultInstructions, yPosition);
            yPosition += 20;

            // Get color scheme and sound info
            const difficulty = this.getDifficulty(soundType);
            const backgroundColor = this.colorSchemes[difficulty];
            const soundInfo = PhonicsSamples.getSoundInfo(soundType, sound);

            // Draw sound box
            const boxWidth = 100;
            const boxHeight = 100;
            const boxX = (pageWidth - boxWidth) / 2;
            PdfUtils.drawBackground(doc, boxX, yPosition, boxWidth, boxHeight, backgroundColor);
            
            // Add sound text and audio cue
            doc.setFontSize(48);
            doc.setTextColor(0);
            doc.text(sound.toUpperCase(), pageWidth / 2, yPosition + 50, { align: 'center' });
            
            // Add sound icon using standard symbol
            doc.setFontSize(24);
            PdfUtils.addSoundIcon(doc, boxX + boxWidth - 30, yPosition + 30, 24);
            
            yPosition += boxHeight + 40;

            // Add example words
            const examplesPerRow = 3;
            const wordBoxWidth = (pageWidth - 80) / examplesPerRow;
            const wordBoxHeight = 70; // Slightly smaller to fit 3 rows better
            const rowSpacing = 15; // Space between rows
            
            examples.forEach((word, i) => {
                const row = Math.floor(i / examplesPerRow);
                const col = i % examplesPerRow;
                const x = 40 + (col * wordBoxWidth);
                const y = yPosition + (row * (wordBoxHeight + rowSpacing));

                PdfUtils.drawBackground(doc, x, y, wordBoxWidth - 10, wordBoxHeight, backgroundColor);
                
                // Add word only - no audio cue
                doc.setFontSize(24);
                doc.text(word, x + (wordBoxWidth - 10) / 2, y + 40, { align: 'center' });
            });

            // Add footer
            PdfUtils.addFooter(doc, 'Created with TeacherForge Hub - Phonics Sound Sheet Maker');

            // Save the PDF
            doc.save(`phonics_${sound.toLowerCase()}.pdf`);
        }
    }

    // Initialize the application
    new PhonicsSheetMaker();
});