window.addEventListener('load', function() {
    'use strict';

    // Constructor
    function NumberBondMaker() {
        this.problemTypes = ['whole'];
        this.visualAids = {
            dots: true,
            lines: true
        };

        // Initialize the instance
        this.setupEventListeners();
        this.initializeState();
        this.updatePreview();
    }

    // Methods
    NumberBondMaker.prototype = {
        setupEventListeners: function() {
            var self = this;
            var generateBtn = document.getElementById('generateBtn');
            if (generateBtn) {
                generateBtn.addEventListener('click', function() {
                    generateBtn.disabled = true;
                    generateBtn.textContent = 'Generating...';
                    
                    self.generatePDF().catch(function(error) {
                        console.error('Error generating PDF:', error);
                        alert('Failed to generate PDF. Check console for details.');
                    }).finally(function() {
                        generateBtn.disabled = false;
                        generateBtn.textContent = 'Generate Worksheet';
                    });
                });
            }

            var form = document.getElementById('numberBondForm');
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    self.generatePDF();
                });
            }

            var problemTypeBoxes = document.querySelectorAll('input[name="problemTypes"]');
            for (var i = 0; i < problemTypeBoxes.length; i++) {
                problemTypeBoxes[i].addEventListener('change', function() {
                    self.updateProblemTypes();
                    self.updatePreview();
                });
            }

            var visualAidBoxes = document.querySelectorAll('.visualization-options input');
            for (var i = 0; i < visualAidBoxes.length; i++) {
                visualAidBoxes[i].addEventListener('change', function() {
                    self.updateVisualAids();
                    self.updatePreview();
                });
            }

            var rangeInputs = ['minNumber', 'maxNumber'];
            for (var i = 0; i < rangeInputs.length; i++) {
                var input = document.getElementById(rangeInputs[i]);
                if (input) {
                    input.addEventListener('change', function() {
                        self.validateNumberRange();
                        self.updatePreview();
                    });
                }
            }

            var clearButton = document.getElementById('clearBtn');
            if (clearButton) {
                clearButton.addEventListener('click', function() {
                    self.clearForm();
                });
            }
        },

        initializeState: function() {
            this.updateProblemTypes();
            this.updateVisualAids();
            this.validateNumberRange();
        },

        updateProblemTypes: function() {
            var checkboxes = document.querySelectorAll('input[name="problemTypes"]:checked');
            this.problemTypes = Array.prototype.map.call(checkboxes, function(cb) {
                return cb.value;
            });
            
            if (this.problemTypes.length === 0) {
                this.problemTypes = ['whole'];
                var wholeCheckbox = document.querySelector('input[value="whole"]');
                if (wholeCheckbox) wholeCheckbox.checked = true;
            }
        },

        updateVisualAids: function() {
            var visualAids = {};
            var checkboxes = document.querySelectorAll('.visualization-options input');
            for (var i = 0; i < checkboxes.length; i++) {
                var checkbox = checkboxes[i];
                visualAids[checkbox.name.replace('show', '').toLowerCase()] = checkbox.checked;
            }
            this.visualAids = visualAids;
            console.log('Visual aids updated:', this.visualAids);
        },

        validateNumberRange: function() {
            var minInput = document.getElementById('minNumber');
            var maxInput = document.getElementById('maxNumber');
            
            var min = parseInt(minInput.value) || 0;
            var max = parseInt(maxInput.value) || 10;

            min = Math.max(0, Math.min(19, min));
            minInput.value = min;

            max = Math.max(min + 1, Math.min(20, max));
            maxInput.value = max;
        },

        updatePreview: function() {
            var svg = document.querySelector('.number-bond svg');
            if (!svg) return;

            var min = parseInt(document.getElementById('minNumber').value);
            var max = parseInt(document.getElementById('maxNumber').value);

            var whole = Math.floor(Math.random() * (max - min + 1)) + min;
            var part1 = Math.floor(Math.random() * (whole + 1));
            var part2 = whole - part1;

            var problemType = this.problemTypes[Math.floor(Math.random() * this.problemTypes.length)];
            
            var numberTexts = svg.querySelectorAll('text:not(.operation)');
            var operationText = svg.querySelector('text.operation');

            if (problemType === 'whole') {
                numberTexts[1].textContent = part1;
                numberTexts[2].textContent = part2;
                numberTexts[0].textContent = '?';
                operationText.textContent = part1 + ' + ' + part2 + ' = ?';
            } else if (problemType === 'part') {
                numberTexts[1].textContent = whole;
                numberTexts[2].textContent = part1;
                numberTexts[0].textContent = '?';
                operationText.textContent = whole + ' - ' + part1 + ' = ?';
            } else {
                numberTexts[1].textContent = part1;
                numberTexts[2].textContent = part2;
                numberTexts[0].textContent = whole;
                operationText.textContent = part1 + ' + ' + part2 + ' = ' + whole;
            }

            var visualAidsContainer = svg.querySelector('.visual-aids');
            while (visualAidsContainer.firstChild) {
                visualAidsContainer.removeChild(visualAidsContainer.firstChild);
            }

            console.log('Checking visual aids - dots:', this.visualAids.dots, 'lines:', this.visualAids.lines);

            if (this.visualAids.dots) {
                this.drawDots(svg, {
                    whole: whole,
                    part1: part1,
                    part2: part2,
                    problemType: problemType
                });
            }
            
            if (this.visualAids.lines) {
                console.log('Drawing number line...');
                this.drawNumberLine(svg, {
                    whole: whole,
                    part1: part1,
                    part2: part2,
                    problemType: problemType
                });
            }
        },

        drawDots: function(svg, problem) {
            var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.classList.add('dots-container');

            var dotSize = 4;
            var spacing = 10;
            
            // Position dots next to (to the right of) each node, aligned vertically
            var positions = {
                topLeft: { x: 95, y: 30 },    // Right of top-left node, adjust y if needed for alignment
                topRight: { x: 245, y: 30 },  // Right of top-right node
                bottom: { x: 170, y: 120 }    // Right of bottom node
            };

            if (problem.problemType === 'whole') {
                this.createDotGroup(g, problem.part1, positions.topLeft.x, positions.topLeft.y, dotSize, spacing);
                this.createDotGroup(g, problem.part2, positions.topRight.x, positions.topRight.y, dotSize, spacing);
            } else if (problem.problemType === 'part') {
                this.createDotGroup(g, problem.whole, positions.topLeft.x, positions.topLeft.y, dotSize, spacing);
                this.createDotGroup(g, problem.part1, positions.topRight.x, positions.topRight.y, dotSize, spacing);
            } else {
                this.createDotGroup(g, problem.part1, positions.topLeft.x, positions.topLeft.y, dotSize, spacing);
                this.createDotGroup(g, problem.part2, positions.topRight.x, positions.topRight.y, dotSize, spacing);
                this.createDotGroup(g, problem.whole, positions.bottom.x, positions.bottom.y, dotSize, spacing);
            }

            svg.querySelector('.visual-aids').appendChild(g);
        },

        createDotGroup: function(g, count, startX, startY, size, spacing) {
            var dotsPerRow = 5;
            
            for (var i = 0; i < count; i++) {
                var dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                dot.setAttribute('cx', startX + (i % dotsPerRow) * spacing);
                dot.setAttribute('cy', startY + Math.floor(i / dotsPerRow) * spacing);
                dot.setAttribute('r', size);
                dot.setAttribute('fill', '#333');
                g.appendChild(dot);
            }
        },

        drawNumberLine: function(svg, problem) {
            console.log('drawNumberLine called', problem);
            var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.classList.add('number-line-container');
            
            // Make the line wider and lower to avoid overlap
            var startX = 8;
            var endX = 325;
            var lineY = 260;
            
            // Get min and max from form
            var minNum = parseInt(document.getElementById('minNumber').value) || 0;
            var maxNum = parseInt(document.getElementById('maxNumber').value) || 20;
            
            // Draw the main dashed number line
            var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute('x1', startX);
            line.setAttribute('y1', lineY);
            line.setAttribute('x2', endX);
            line.setAttribute('y2', lineY);
            line.setAttribute('stroke', '#999');
            line.setAttribute('stroke-width', '1');
            line.setAttribute('stroke-dasharray', '3,3');
            g.appendChild(line);
            
            // Calculate tick mark positions with better spacing
            var range = maxNum - minNum;
            var tickSpacing = (endX - startX) / range;
            var tickHeight = 6;
            
            // Add tick marks and numbers
            for (var i = 0; i <= range; i++) {
                var value = minNum + i;
                var x = startX + (i * tickSpacing);
                
                // Draw tick mark
                var tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
                tick.setAttribute('x1', x);
                tick.setAttribute('y1', lineY - tickHeight);
                tick.setAttribute('x2', x);
                tick.setAttribute('y2', lineY + tickHeight);
                tick.setAttribute('stroke', '#666');
                tick.setAttribute('stroke-width', '1');
                g.appendChild(tick);
                
                // Add number - odd numbers above, even numbers below with more spacing
                var numText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                numText.setAttribute('x', x);
                if (value % 2 === 0) {
                    // Even numbers below with more space
                    numText.setAttribute('y', lineY + tickHeight + 14);
                } else {
                    // Odd numbers above with more space
                    numText.setAttribute('y', lineY - tickHeight - 6);
                }
                numText.setAttribute('text-anchor', 'middle');
                numText.setAttribute('font-size', '9');
                numText.setAttribute('fill', '#333');
                numText.textContent = value;
                g.appendChild(numText);
            }
            
            svg.querySelector('.visual-aids').appendChild(g);
        },

        generatePDF: function() {
            var self = this;
            return new Promise(function(resolve, reject) {
                try {
                    var overlay = document.getElementById('loadingOverlay');
                    if (overlay) overlay.style.display = 'flex';

                    var title = document.getElementById('title').value || 'Number Bonds Practice';
                    var instructions = document.getElementById('instructions').value;
                    var minNumber = parseInt(document.getElementById('minNumber').value);
                    var maxNumber = parseInt(document.getElementById('maxNumber').value);

                    var doc = new window.jspdf.jsPDF();
                    var pageWidth = doc.internal.pageSize.getWidth();
                    var pageHeight = doc.internal.pageSize.getHeight();

                    doc.setFontSize(16);
                    doc.text(title, pageWidth / 2, 20, { align: 'center' });

                    if (instructions) {
                        doc.setFontSize(12);
                        doc.text(instructions, 20, 35);
                    }

                    // Exactly 4 problems per page (2 x 2 grid)
                    var problems = [];
                    for (var i = 0; i < 4; i++) {
                        var whole = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
                        var part1 = Math.floor(Math.random() * (whole + 1));
                        var part2 = whole - part1;
                        var problemType = self.problemTypes[Math.floor(Math.random() * self.problemTypes.length)];
                        problems.push({
                            whole: whole,
                            part1: part1,
                            part2: part2,
                            problemType: problemType
                        });
                    }

                    var outerMargin = 12;               // page margin
                    var cellGap = 8;                    // gap between quadrants
                    var startY = instructions ? 45 : 35;
                    var footerReserve = 18;             // space for footer text

                    // Compute 2x2 grid cell sizes
                    var gridWidth = pageWidth - (2 * outerMargin) - cellGap;
                    var gridHeight = (pageHeight - startY - footerReserve) - ((1 * cellGap));
                    var colWidth = gridWidth / 2;
                    var rowHeight = gridHeight / 2;

                    for (var j = 0; j < problems.length; j++) {
                        var col = j % 2;
                        var row = Math.floor(j / 2);
                        var cellX = outerMargin + col * (colWidth + cellGap);
                        var cellY = startY + row * (rowHeight + cellGap);

                        // Inner padding inside the cell
                        var pad = 8;
                        var innerX = cellX + pad;
                        var innerY = cellY + pad;
                        var innerW = colWidth - 2 * pad;
                        var innerH = rowHeight - 2 * pad;

                        // Draw bond, dots, and number line within the inner rect
                        self.drawNumberBondPDF(doc, problems[j], innerX, innerY, innerW, innerH);

                        if (self.visualAids.dots) {
                            self.drawDotsPDF(doc, problems[j], innerX, innerY, innerW, innerH);
                        }
                        if (self.visualAids.lines) {
                            self.drawNumberLinePDF(doc, problems[j], innerX, innerY, innerW, innerH);
                        }
                    }

                    doc.setFontSize(10);
                    doc.setTextColor(150);
                    doc.text('Created with TeacherForge Hub - Number Bond Creator', pageWidth / 2, pageHeight - 10, { align: 'center' });

                    doc.save('number-bonds-worksheet.pdf');
                    resolve();
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    reject(error);
                } finally {
                    if (overlay) overlay.style.display = 'none';
                }
            });
        },

        drawNumberBondPDF: function(doc, problem, x, y, cellWidth, cellHeight) {
            // Triangle layout scaled to available cell
            var cx = x + cellWidth / 2;
            var r = Math.max(7, Math.min(12, cellWidth * 0.09));
            var topY = y + Math.max(8, Math.min(16, cellHeight * 0.2));
            var bottomY = topY + Math.max(16, Math.min(28, cellHeight * 0.22));
            var dx = Math.max(28, Math.min(48, cellWidth * 0.33));
            var left = { x: cx - dx, y: topY, r: r };
            var right = { x: cx + dx, y: topY, r: r };
            var bottom = { x: cx, y: bottomY, r: r };

            // Draw circles
            doc.circle(left.x, left.y, r);
            doc.circle(right.x, right.y, r);
            doc.circle(bottom.x, bottom.y, r);

            // Helper: line from edge of circle to edge of circle
            function lineBetween(c1, c2) {
                var dx = c2.x - c1.x;
                var dy = c2.y - c1.y;
                var len = Math.sqrt(dx * dx + dy * dy) || 1;
                var ux = dx / len;
                var uy = dy / len;
                var x1 = c1.x + ux * c1.r;
                var y1 = c1.y + uy * c1.r;
                var x2 = c2.x - ux * c2.r;
                var y2 = c2.y - uy * c2.r;
                doc.line(x1, y1, x2, y2);
            }

            // Connect parts to whole (stop at edges)
            lineBetween(left, bottom);
            lineBetween(right, bottom);

            // Numbers and operation text
            doc.setFontSize(10);
            if (problem.problemType === 'whole') {
                doc.text(String(problem.part1), left.x, left.y + 2, { align: 'center' });
                doc.text(String(problem.part2), right.x, right.y + 2, { align: 'center' });
                doc.text('?', bottom.x, bottom.y + 2, { align: 'center' });
                doc.text(problem.part1 + ' + ' + problem.part2 + ' = ?', cx, bottom.y + r + 8, { align: 'center' });
            } else if (problem.problemType === 'part') {
                doc.text(String(problem.whole), left.x, left.y + 2, { align: 'center' });
                doc.text(String(problem.part1), right.x, right.y + 2, { align: 'center' });
                doc.text('?', bottom.x, bottom.y + 2, { align: 'center' });
                doc.text(problem.whole + ' - ' + problem.part1 + ' = ?', cx, bottom.y + r + 8, { align: 'center' });
            } else {
                doc.text(String(problem.part1), left.x, left.y + 2, { align: 'center' });
                doc.text(String(problem.part2), right.x, right.y + 2, { align: 'center' });
                doc.text(String(problem.whole), bottom.x, bottom.y + 2, { align: 'center' });
                doc.text(problem.part1 + ' + ' + problem.part2 + ' = ' + problem.whole, cx, bottom.y + r + 8, { align: 'center' });
            }
        },

        drawNumberLinePDF: function(doc, problem, x, y, cellWidth, cellHeight) {
            // Fit within the cell and sit near the bottom
            var innerMargin = 8;
            var lineWidth = Math.max(80, cellWidth - innerMargin * 2);
            var tickHeight = 2;
            var lineStartX = x + innerMargin;
            var lineY = y + cellHeight - 10;

            doc.setDrawColor(0);
            doc.setLineWidth(0.5);
            doc.line(lineStartX, lineY, lineStartX + lineWidth, lineY);

            var minNum = parseInt(document.getElementById('minNumber').value) || 0;
            var maxNum = parseInt(document.getElementById('maxNumber').value) || 20;

            var range = Math.max(1, maxNum - minNum);
            var tickSpacing = lineWidth / range;
            var desiredMinSpacing = 8; // px
            var labelStep = Math.max(1, Math.ceil(desiredMinSpacing / tickSpacing));

            doc.setFontSize(7);
            for (var i = 0; i <= range; i++) {
                var tickX = lineStartX + (i * tickSpacing);
                var value = minNum + i;

                doc.line(tickX, lineY - tickHeight, tickX, lineY + tickHeight);

                if (i % labelStep === 0) {
                    var offset = (value % 2 === 0) ? (tickHeight + 5) : -(tickHeight + 3);
                    doc.text(value.toString(), tickX, lineY + offset, { align: 'center' });
                }
            }
        },

        drawDotsPDF: function(doc, problem, x, y, cellWidth, cellHeight) {
            // Anchor dots next to (to the right of) the associated nodes
            var dotSize = 1.4;
            var spacing = 3.6;
            var dotsPerRow = 5;

            // Recompute the same geometry used by drawNumberBondPDF
            var cx = x + cellWidth / 2;
            var r = Math.max(7, Math.min(12, cellWidth * 0.09));
            var topY = y + Math.max(8, Math.min(16, cellHeight * 0.2));
            var bottomY = topY + Math.max(16, Math.min(28, cellHeight * 0.22));
            var dx = Math.max(28, Math.min(48, cellWidth * 0.33));
            var left = { x: cx - dx, y: topY, r: r };
            var right = { x: cx + dx, y: topY, r: r };
            var bottom = { x: cx, y: bottomY, r: r };

            function drawDotGroup(count, node) {
                if (count === 0) return;

                // Calculate block dimensions
                var rows = Math.ceil(count / dotsPerRow);
                var maxCols = Math.min(dotsPerRow, count);
                var blockWidth = (maxCols - 1) * spacing + dotSize * 2;
                var blockHeight = (rows - 1) * spacing + dotSize * 2;

                // Position to the right of the node, top-aligned with the node
                var anchorX = node.x + node.r + 2; // Right of circle + reduced padding for closer placement
                var anchorY = node.y - r + dotSize; // Align top of dot group with top of node

                for (var i = 0; i < count; i++) {
                    var row = Math.floor(i / dotsPerRow);
                    var col = i % dotsPerRow;

                    var dxp = anchorX + col * spacing;
                    var dyp = anchorY + row * spacing;

                    doc.setFillColor(0);
                    doc.circle(dxp, dyp, dotSize, 'F');
                }
            }

            if (problem.problemType === 'whole') {
                drawDotGroup(problem.part1, left);
                drawDotGroup(problem.part2, right);
            } else if (problem.problemType === 'part') {
                drawDotGroup(problem.whole, left);
                drawDotGroup(problem.part1, right);
            } else {
                drawDotGroup(problem.part1, left);
                drawDotGroup(problem.part2, right);
                drawDotGroup(problem.whole, bottom);
            }
        }
    };

    // Initialize the application
    try {
        console.log('Initializing NumberBondMaker...');
        window.numberBondMaker = new NumberBondMaker();
        console.log('NumberBondMaker initialized successfully');
    } catch (error) {
        console.error('Error initializing NumberBondMaker:', error);
    }
});