// PDF Utility functions for TeacherForge Hub tools

// Initialize jsPDF with font support
window.jsPDF = window.jspdf.jsPDF;

const PdfUtils = {
    /**
     * Creates a new PDF document with standard configuration
     * @returns {jsPDF} Configured PDF document
     */
    createDocument() {
        return new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'letter'
        });
    },

    /**
     * Adds a title to the PDF
     * @param {jsPDF} doc PDF document
     * @param {string} title Title text
     * @param {number} y Y position (optional)
     */
    addTitle(doc, title, y = 40) {
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text(title, doc.internal.pageSize.width / 2, y, { align: 'center' });
    },

    /**
     * Adds instructions or description text
     * @param {jsPDF} doc PDF document
     * @param {string} text Instruction text
     * @param {number} y Y position
     */
    addInstructions(doc, text, y) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(text, 40, y);
        return doc.getTextDimensions(text).h + y + 10;
    },

    /**
     * Adds a footer to the page
     * @param {jsPDF} doc PDF document
     * @param {string} text Footer text
     */
    addFooter(doc, text = 'Created with TeacherForge Hub') {
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(text, 40, pageHeight - 20);
    },

    /**
     * Creates a header cell with specific styling
     * @param {object} cell Cell configuration
     * @param {object} data Row data
     */
    styleHeaderCell(cell, data) {
        cell.styles.fontStyle = 'bold';
        cell.styles.fontSize = 14;
        cell.styles.cellPadding = 8;
    },

    /**
     * Creates a data cell with specific styling
     * @param {object} cell Cell configuration
     * @param {object} data Row data
     */
    styleDataCell(cell, data) {
        cell.styles.fontSize = 12;
        cell.styles.cellPadding = 5;
    },

    /**
     * Draws a colored background for a section
     * @param {jsPDF} doc PDF document
     * @param {number} x X position
     * @param {number} y Y position
     * @param {number} width Width
     * @param {number} height Height
     * @param {string} color Color in hex format
     */
    drawBackground(doc, x, y, width, height, color) {
        doc.setFillColor(color);
        doc.rect(x, y, width, height, 'F');
    },

    /**
     * Placeholder for sound icon - currently disabled
     * @param {jsPDF} doc PDF document
     * @param {number} x X position
     * @param {number} y Y position
     * @param {number} size Font size for the icon
     */
    addSoundIcon(doc, x, y, size = 16) {
        // Sound icon temporarily removed
        return;
    }
};

// Export for use in other scripts
window.PdfUtils = PdfUtils;