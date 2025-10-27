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
        
        // Create and open print-friendly page
        createPrintablePage(title, description, words);
    }
    
    // Create a printable page that opens in a new window
    function createPrintablePage(title, description, words) {
        // Create HTML for the printable page
        const printWindow = window.open('', '_blank');
        
        if (!printWindow) {
            alert('Please allow pop-ups to generate the PDF');
            return;
        }
        
        // Organize words into table rows (4 columns)
        const columns = 4;
        let tableRows = '';
        
        for (let i = 0; i < words.length; i += columns) {
            tableRows += '<tr>';
            for (let j = 0; j < columns; j++) {
                const word = i + j < words.length ? words[i + j] : '';
                tableRows += `<td>${word}</td>`;
            }
            tableRows += '</tr>';
        }
        
        const currentDate = new Date().toLocaleDateString();
        
        // Build the complete HTML document
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            padding: 40px;
            max-width: 8.5in;
            margin: 0 auto;
        }
        
        h1 {
            text-align: center;
            font-size: 24pt;
            margin-bottom: 20px;
            color: #333;
        }
        
        .description {
            text-align: center;
            font-size: 12pt;
            color: #666;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        td {
            border: 2px solid #333;
            padding: 20px;
            text-align: center;
            font-size: 18pt;
            font-weight: 500;
            height: 80px;
            vertical-align: middle;
        }
        
        .footer {
            text-align: center;
            font-size: 9pt;
            color: #999;
            margin-top: 40px;
            page-break-after: avoid;
        }
        
        @media print {
            body {
                padding: 20px;
            }
            
            .no-print {
                display: none;
            }
            
            @page {
                margin: 0.75in;
            }
        }
        
        .button-container {
            text-align: center;
            margin-bottom: 20px;
        }
        
        .print-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            font-size: 14pt;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
        }
        
        .print-btn:hover {
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="button-container no-print">
        <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
    </div>
    
    <h1>${escapeHtml(title)}</h1>
    
    ${description ? `<div class="description">${escapeHtml(description)}</div>` : ''}
    
    <table>
        ${tableRows}
    </table>
    
    <div class="footer">
        Created with TeacherForge Hub - ${currentDate}
    </div>
    
    <script>
        // Auto-print dialog after a short delay
        setTimeout(() => {
            window.print();
        }, 500);
    </script>
</body>
</html>
        `;
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    }
    
    // Helper function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
