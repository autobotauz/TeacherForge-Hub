// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('wordGeneratorForm');
    const clearBtn = document.getElementById('clearBtn');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const wordsInput = document.getElementById('words');
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        generatePDF();
    });
    
    // Clear button handler
    clearBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all fields?')) {
            form.reset();
        }
    });
    
    // PDF Generation Function
    function generatePDF() {
        // Get form values
        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        const wordsText = wordsInput.value.trim();
        
        // Validate inputs
        if (!title) {
            alert('Please enter a title');
            titleInput.focus();
            return;
        }
        
        if (!wordsText) {
            alert('Please enter at least one word');
            wordsInput.focus();
            return;
        }
        
        // Parse words from textarea (split by newlines and filter empty lines)
        const words = wordsText
            .split('\n')
            .map(word => word.trim())
            .filter(word => word.length > 0);
        
        if (words.length === 0) {
            alert('Please enter at least one word');
            wordsInput.focus();
            return;
        }

        // Create PDF using jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(20);
        doc.text(title, doc.internal.pageSize.width / 2, 20, { align: 'center' });

        // Add description if provided
        if (description) {
            doc.setFontSize(12);
            doc.text(description, 20, 35);
        }

        // Prepare words for table (4 columns)
        const COLUMNS = 4;
        const rows = [];
        for (let i = 0; i < words.length; i += COLUMNS) {
            const row = [];
            for (let j = 0; j < COLUMNS; j++) {
                if (i + j < words.length) {
                    row.push(words[i + j]);
                } else {
                    row.push(''); // Empty cell for incomplete rows
                }
            }
            rows.push(row);
        }

        // Generate table
        doc.autoTable({
            startY: description ? 45 : 30,
            head: [],
            body: rows,
            theme: 'grid',
            styles: {
                fontSize: 14,
                cellPadding: 5,
                halign: 'center',
                font: 'helvetica',
                fontStyle: 'bold',
                textColor: [0, 0, 0], // Pure black text
                lineColor: [0, 0, 0], // Pure black lines
                lineWidth: 0.4 // Slightly thicker lines
            },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 'auto' },
                3: { cellWidth: 'auto' }
            },
            margin: { top: 20 },
            didDrawPage: function(data) {
                // Add footer
                const pageSize = doc.internal.pageSize;
                const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text('Created with TeacherForge Hub', data.settings.margin.left, pageHeight - 10);
            }
        });

        // Save the PDF
        doc.save(title.replace(/\s+/g, '_') + '.pdf');
    }
});
