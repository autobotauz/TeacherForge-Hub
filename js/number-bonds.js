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
            this.updatePreview();
        }

        setupEventListeners() {
            // Form submission
            const form = document.getElementById('numberBondForm');
            if (form) {
                form.addEventListener('submit', (e) => this.handleFormSubmit(e));
            }

            // Number range inputs
            ['minNumber', 'maxNumber'].forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    input.addEventListener('change', () => this.validateNumberRange());
                }
            });

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

            // Form clearing
            const clearButton = document.getElementById('clearBtn');
            if (clearButton) {
                clearButton.addEventListener('click', () => this.clearForm());
            }
        }

        validateNumberRange() {
            const minInput = document.getElementById('minNumber');
            const maxInput = document.getElementById('maxNumber');
            
            let min = parseInt(minInput.value);
            let max = parseInt(maxInput.value);

            // Ensure min is between 0 and 19
            min = Math.max(0, Math.min(19, min));
            minInput.value = min;

            // Ensure max is between min+1 and 20
            max = Math.max(min + 1, Math.min(20, max));
            maxInput.value = max;

            this.updateTrackingGrid();
            this.updatePreview();
        }

        updateProblemTypes() {
            this.problemTypes = Array.from(document.querySelectorAll('input[name="problemTypes"]:checked'))
                .map(cb => cb.value);
        }

        updateVisualAids() {
            const options = document.querySelectorAll('.visualization-options input');
            options.forEach(option => {
                this.visualAids[option.name.replace('show', '').toLowerCase()] = option.checked;
            });
        }

        initializeTrackingGrid() {
            const grid = document.getElementById('trackingGrid');
            if (!grid) return;

            const min = parseInt(document.getElementById('minNumber').value);
            const max = parseInt(document.getElementById('maxNumber').value);

            grid.innerHTML = '';
            for (let i = min; i <= max; i++) {
                const cell = document.createElement('div');
                cell.className = 'tracking-cell';
                cell.textContent = i;
                cell.addEventListener('click', () => {
                    cell.classList.toggle('completed');
                });
                grid.appendChild(cell);
            }
        }

        updateTrackingGrid() {
            this.initializeTrackingGrid();
        }

        updatePreview() {
            const previewSvg = document.querySelector('.number-bond svg');
            if (!previewSvg) return;

            const min = parseInt(document.getElementById('minNumber').value);
            const max = parseInt(document.getElementById('maxNumber').value);

            // Generate a random number bond for preview
            const whole = Math.floor(Math.random() * (max - min)) + min;
            const part1 = Math.floor(Math.random() * whole);
            const part2 = whole - part1;

            // Determine the problem type
            const selectedTypes = this.problemTypes;
            const problemType = selectedTypes[Math.floor(Math.random() * selectedTypes.length)];

            // Update the numbers in the preview
            const texts = previewSvg.querySelectorAll('text');
            if (problemType === 'whole') {
                // Addition: Find the whole (e.g., 3 + 4 = ?)
                texts[0].textContent = '?';
                texts[1].textContent = part1;
                texts[2].textContent = part2;
                texts[3].textContent = `${part1} + ${part2} = ?`;
            } else if (problemType === 'part') {
                // Subtraction: Find a part (e.g., 7 - 3 = ?)
                texts[0].textContent = whole;
                texts[1].textContent = part1;
                texts[2].textContent = '?';
                texts[3].textContent = `${whole} - ${part1} = ?`;
        }

        clearForm() {
            const form = document.getElementById('numberBondForm');
            if (form) {
                form.reset();
                this.validateNumberRange();
                this.updateProblemTypes();
                this.updateVisualAids();
                this.initializeTrackingGrid();
                this.updatePreview();
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
                
                const worksheetData = {
                    title: formData.get('title'),
                    instructions: formData.get('instructions'),
                    minNumber: parseInt(formData.get('minNumber')),
                    maxNumber: parseInt(formData.get('maxNumber')),
                    problemTypes: this.problemTypes,
                    visualAids: this.visualAids
                };

                await this.generatePDF(worksheetData);
            } catch (error) {
                console.error('Error generating worksheet:', error);
                alert(error.message || 'There was an error generating your worksheet. Please try again.');
            } finally {
                this.hideLoading();
            }
        }

        generateNumberBond(whole, part1, part2, hidePosition = 'none') {
            return {
                whole,
                parts: [part1, part2],
                hidden: hidePosition
            };
        }

        async generatePDF(data) {
            const doc = new window.jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'letter'
            });

            // Add title
            doc.setFontSize(20);
            doc.text(data.title || 'Number Bonds Practice', doc.internal.pageSize.width / 2, 40, { align: 'center' });

            // Add instructions
            if (data.instructions) {
                doc.setFontSize(12);
                doc.text(data.instructions, 40, 70);
            }

            // Generate problems
            const problems = this.generateProblems(data);

            // Add problems to PDF
            let y = 100;
            const itemsPerRow = 2;
            const itemWidth = (doc.internal.pageSize.width - 80) / itemsPerRow;
            const itemHeight = 200;

            problems.forEach((problem, index) => {
                const row = Math.floor(index / itemsPerRow);
                const col = index % itemsPerRow;
                const x = 40 + (col * itemWidth);
                y = 100 + (row * itemHeight);

                this.drawNumberBond(doc, problem, x, y, itemWidth - 20, itemHeight - 20);
            });

            // Add footer
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text('Created with TeacherForge Hub - Number Bond Creator', 40, doc.internal.pageSize.height - 20);

            // Save the PDF
            doc.save('number_bonds.pdf');
        }

        generateProblems(data) {
            const problems = [];
            const count = 6; // Number of problems per page

            for (let i = 0; i < count; i++) {
                const whole = Math.floor(Math.random() * (data.maxNumber - data.minNumber + 1)) + data.minNumber;
                const part1 = Math.floor(Math.random() * (whole + 1));
                const part2 = whole - part1;

                const hidePosition = this.problemTypes.includes('mixed') ?
                    ['none', 'whole', 'part'][Math.floor(Math.random() * 3)] :
                    this.problemTypes.includes('whole') ? 'whole' : 'part';

                problems.push(this.generateNumberBond(whole, part1, part2, hidePosition));
            }

            return problems;
        }

        drawNumberBond(doc, problem, x, y, width, height) {
            // Draw circles and lines for the number bond
            const centerX = x + width / 2;
            const bottomY = y + height - 30;
            const topY = y + 30;

            // Draw lines
            doc.setDrawColor(0);
            doc.setLineWidth(1);
            doc.line(centerX, bottomY, centerX, bottomY - 50); // Vertical line
            doc.line(centerX, bottomY - 50, centerX - 50, topY); // Left diagonal
            doc.line(centerX, bottomY - 50, centerX + 50, topY); // Right diagonal

            // Draw circles
            this.drawCircle(doc, centerX, bottomY, 25); // Bottom circle
            this.drawCircle(doc, centerX - 50, topY, 20); // Left circle
            this.drawCircle(doc, centerX + 50, topY, 20); // Right circle

            // Add numbers
            doc.setFontSize(14);
            if (problem.hidden !== 'whole') {
                doc.text(problem.whole.toString(), centerX, bottomY, { align: 'center' });
            } else {
                doc.text('?', centerX, bottomY, { align: 'center' });
            }

            if (problem.hidden !== 'part') {
                doc.text(problem.parts[0].toString(), centerX - 50, topY, { align: 'center' });
                doc.text(problem.parts[1].toString(), centerX + 50, topY, { align: 'center' });
            } else {
                doc.text(problem.parts[0].toString(), centerX - 50, topY, { align: 'center' });
                doc.text('?', centerX + 50, topY, { align: 'center' });
            }

            // Add visual aids if enabled
            if (this.visualAids.dots) {
                this.addDotPattern(doc, problem, x, y, width, height);
            }
        }

        drawCircle(doc, x, y, radius) {
            // Use ellipse instead of lines for circle drawing
            doc.setDrawColor(0);
            doc.setLineWidth(1);
            doc.setFillColor(255, 255, 255);  // White fill
            
            // Draw filled circle with black border
            doc.ellipse(x, y, radius, radius, 'FD');
        }

        addDotPattern(doc, problem, x, y, width, height) {
            // Add dot patterns below the number bond
            const dotSize = 4;
            const spacing = 8;
            const startX = x + 20;
            const startY = y + height - 20;

            doc.setFillColor(0);

            if (problem.hidden !== 'whole') {
                for (let i = 0; i < problem.whole; i++) {
                    const dx = startX + (i % 5) * spacing;
                    const dy = startY + Math.floor(i / 5) * spacing;
                    doc.circle(dx, dy, dotSize, 'F');
                }
            }
        }
    }

    // Initialize the application
    new NumberBondMaker();
});