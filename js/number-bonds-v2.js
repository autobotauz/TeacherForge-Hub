// Number Bond Creator logic

window.addEventListener('load', () => {
    class NumberBondMaker {
        constructor() {
            this.problemTypes = ['whole'];
            this.visualAids = {
                dots: true,
                grid: false,
                lines: true
            };
            this.setupEventListeners();
            this.initializeState();
            this.updatePreview();
        }

        setupEventListeners() {
            // Form submission
            const form = document.getElementById('numberBondForm');
            if (form) {
                form.addEventListener('submit', (e) => this.handleFormSubmit(e));
            }

            // Problem type checkboxes
            document.querySelectorAll('input[name="problemTypes"]').forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    console.log('Problem type changed');
                    this.updateProblemTypes();
                    this.updatePreview();
                });
            });

            // Visual aid toggles
            document.querySelectorAll('.visualization-options input').forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    console.log('Visual aid changed');
                    this.updateVisualAids();
                    this.updatePreview();
                });
            });

            // Number range inputs
            ['minNumber', 'maxNumber'].forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    input.addEventListener('change', () => {
                        console.log('Number range changed');
                        this.validateNumberRange();
                        this.updatePreview();
                    });
                }
            });

            // Form clearing
            const clearButton = document.getElementById('clearBtn');
            if (clearButton) {
                clearButton.addEventListener('click', () => this.clearForm());
            }
        }

        initializeState() {
            // Initialize problem types from checked boxes
            this.updateProblemTypes();
            
            // Initialize visual aids from checkboxes
            this.updateVisualAids();
            
            // Validate initial number range
            this.validateNumberRange();
        }

        updateProblemTypes() {
            const checkboxes = document.querySelectorAll('input[name="problemTypes"]:checked');
            this.problemTypes = Array.from(checkboxes).map(cb => cb.value);
            console.log('Updated problem types:', this.problemTypes);
            
            // Ensure at least one type is selected
            if (this.problemTypes.length === 0) {
                this.problemTypes = ['whole'];
                const wholeCheckbox = document.querySelector('input[value="whole"]');
                if (wholeCheckbox) wholeCheckbox.checked = true;
            }
        }

        updateVisualAids() {
            const visualAids = {};
            document.querySelectorAll('.visualization-options input').forEach(checkbox => {
                visualAids[checkbox.name.replace('show', '').toLowerCase()] = checkbox.checked;
            });
            this.visualAids = visualAids;
            console.log('Updated visual aids:', this.visualAids);
        }

        validateNumberRange() {
            const minInput = document.getElementById('minNumber');
            const maxInput = document.getElementById('maxNumber');
            
            let min = parseInt(minInput.value) || 0;
            let max = parseInt(maxInput.value) || 10;

            // Ensure min is between 0 and 19
            min = Math.max(0, Math.min(19, min));
            minInput.value = min;

            // Ensure max is between min+1 and 20
            max = Math.max(min + 1, Math.min(20, max));
            maxInput.value = max;
        }

        updatePreview() {
            console.log('Updating preview...');
            const svg = document.querySelector('.number-bond svg');
            if (!svg) {
                console.error('SVG element not found');
                return;
            }

            const min = parseInt(document.getElementById('minNumber').value);
            const max = parseInt(document.getElementById('maxNumber').value);

            // Generate random numbers for the preview
            const whole = Math.floor(Math.random() * (max - min + 1)) + min;
            const part1 = Math.floor(Math.random() * (whole + 1));
            const part2 = whole - part1;

            // Get random problem type from selected types
            const problemType = this.problemTypes[Math.floor(Math.random() * this.problemTypes.length)];
            console.log('Selected problem type:', problemType);

            // Update numbers and operation text
            const numberTexts = svg.querySelectorAll('text:not(.operation)');
            const operationText = svg.querySelector('text.operation');

            if (problemType === 'whole') {
                // Addition: Find the whole (e.g., 3 + 4 = ?)
                numberTexts[0].textContent = '?';
                numberTexts[1].textContent = part1;
                numberTexts[2].textContent = part2;
                operationText.textContent = `${part1} + ${part2} = ?`;
            } else if (problemType === 'part') {
                // Subtraction: Find a part (e.g., 7 - 3 = ?)
                numberTexts[0].textContent = whole;
                numberTexts[1].textContent = part1;
                numberTexts[2].textContent = '?';
                operationText.textContent = `${whole} - ${part1} = ?`;
            } else {
                // Mixed practice showing completed equation
                numberTexts[0].textContent = whole;
                numberTexts[1].textContent = part1;
                numberTexts[2].textContent = part2;
                operationText.textContent = `${part1} + ${part2} = ${whole}`;
            }

            // Clear and update visual aids
            const visualAidsContainer = svg.querySelector('.visual-aids');
            while (visualAidsContainer.firstChild) {
                visualAidsContainer.removeChild(visualAidsContainer.firstChild);
            }

            if (this.visualAids.dots) {
                this.drawDots(svg, {whole, part1, part2, problemType});
            }
        }

        drawDots(svg, problem) {
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.classList.add('dots-container');

            const dotSize = 4;
            const spacing = 12;
            const baseY = 200;

            if (problem.problemType === 'whole') {
                // Show dots for parts to be added
                this.createDotGroup(g, problem.part1, 50, baseY, dotSize, spacing);
                this.createDotGroup(g, problem.part2, 200, baseY, dotSize, spacing);
            } else if (problem.problemType === 'part') {
                // Show whole with highlighted part for subtraction
                this.createDotGroup(g, problem.whole, 125, baseY, dotSize, spacing, problem.part1);
            } else {
                // Show all dots
                this.createDotGroup(g, problem.whole, 125, baseY, dotSize, spacing);
            }

            svg.querySelector('.visual-aids').appendChild(g);
        }

        createDotGroup(g, count, startX, startY, size, spacing, highlightCount = 0) {
            for (let i = 0; i < count; i++) {
                const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                dot.setAttribute('cx', startX + (i % 5) * spacing);
                dot.setAttribute('cy', startY + Math.floor(i / 5) * spacing);
                dot.setAttribute('r', size);
                dot.setAttribute('fill', i < highlightCount ? '#ff6b6b' : '#333');
                g.appendChild(dot);
            }
        }

        clearForm() {
            const form = document.getElementById('numberBondForm');
            if (form) {
                form.reset();
                this.initializeState();
                this.updatePreview();
            }
        }
    }

    // Initialize the application
    console.log('Initializing NumberBondMaker...');
    new NumberBondMaker();
});