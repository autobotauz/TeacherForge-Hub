// Number Bond Creator logic

// Define operation types
const NumberBondOperations = {
    ADDITION: 'addition',
    SUBTRACTION: 'subtraction',
    
    getOperationDisplay(whole, part1, part2, operation, hidePosition = 'none') {
        if (operation === this.ADDITION) {
            if (hidePosition === 'whole') {
                return `${part1} + ${part2} = ?`;
            } else if (hidePosition === 'part') {
                return `${part1} + ? = ${whole}`;
            }
            return `${part1} + ${part2} = ${whole}`;
        } else {
            if (hidePosition === 'part') {
                return `${whole} - ${part1} = ?`;
            }
            return `${whole} = ${part1} + ${part2}`;
        }
    }
};

window.addEventListener('load', () => {
    class NumberBondMaker {
        constructor() {
            this.problemTypes = ['whole', 'part'];
            this.visualAids = {
                dots: true,
                grid: false,
                lines: true
            };
            this.setupEventListeners();
            this.initializeTrackingGrid();
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
                    this.updateProblemTypes();
                    this.updatePreview();
                });
            });

            // Visual aid toggles
            document.querySelectorAll('.visualization-options input').forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    this.updateVisualAids();
                    this.updatePreview();
                });
            });
        }

        updatePreview() {
            const previewSvg = document.querySelector('.number-bond svg');
            if (!previewSvg) return;

            const min = parseInt(document.getElementById('minNumber').value);
            const max = parseInt(document.getElementById('maxNumber').value);

            // Generate a random number bond
            const whole = Math.floor(Math.random() * (max - min)) + min;
            const part1 = Math.floor(Math.random() * whole);
            const part2 = whole - part1;

            // Determine problem type and operation
            const selectedTypes = this.problemTypes;
            const problemType = selectedTypes[Math.floor(Math.random() * selectedTypes.length)];
            const operation = problemType === 'whole' ? NumberBondOperations.ADDITION : NumberBondOperations.SUBTRACTION;

            // Update the number bond visualization
            const numberTexts = previewSvg.querySelectorAll('text:not(.operation)');
            const operationText = previewSvg.querySelector('text.operation');

            if (problemType === 'whole') {
                // Addition: Find the whole
                numberTexts[0].textContent = '?';
                numberTexts[1].textContent = part1;
                numberTexts[2].textContent = part2;
            } else if (problemType === 'part') {
                // Subtraction: Find a part
                numberTexts[0].textContent = whole;
                numberTexts[1].textContent = part1;
                numberTexts[2].textContent = '?';
            }

            // Update operation display
            operationText.textContent = NumberBondOperations.getOperationDisplay(
                whole, part1, part2, operation, problemType === 'whole' ? 'whole' : 'part'
            );

            // Update visual aids
            this.updateVisualAids(previewSvg, {
                whole,
                part1,
                part2,
                problemType,
                operation
            });
        }

        updateVisualAids(svg, problem) {
            // Clear existing aids
            svg.querySelectorAll('.visual-aid').forEach(el => el.remove());

            if (this.visualAids.dots) {
                this.drawDotPattern(svg, problem);
            }

            if (this.visualAids.lines) {
                this.drawNumberLine(svg, problem);
            }

            if (this.visualAids.grid) {
                this.drawTenFrame(svg, problem);
            }
        }

        drawDotPattern(svg, problem) {
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.classList.add('visual-aid', 'dots');

            // Draw dots based on the operation type
            const dotSize = 4;
            const spacing = 12;
            let y = 160;

            if (problem.operation === NumberBondOperations.ADDITION) {
                // Draw dots for each part
                this.drawDots(g, problem.part1, 50, y, dotSize, spacing);
                this.drawDots(g, problem.part2, 200, y, dotSize, spacing);
            } else {
                // Draw dots for whole and subtract
                this.drawDots(g, problem.whole, 120, y, dotSize, spacing);
            }

            svg.appendChild(g);
        }

        drawDots(g, count, startX, startY, size, spacing) {
            for (let i = 0; i < count; i++) {
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute('cx', startX + (i % 5) * spacing);
                circle.setAttribute('cy', startY + Math.floor(i / 5) * spacing);
                circle.setAttribute('r', size);
                circle.setAttribute('fill', '#333');
                g.appendChild(circle);
            }
        }

        drawNumberLine(svg, problem) {
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.classList.add('visual-aid', 'number-line');

            // Add number line implementation here
            // TODO: Implement number line visualization
        }

        drawTenFrame(svg, problem) {
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.classList.add('visual-aid', 'ten-frame');

            // Add ten frame implementation here
            // TODO: Implement ten frame visualization
        }

        // ... rest of the existing methods ...
    }

    // Initialize the application
    new NumberBondMaker();
});

// Make NumberBondOperations available globally
window.NumberBondOperations = NumberBondOperations;