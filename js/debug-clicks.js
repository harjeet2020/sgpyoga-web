/**
 * Debug script to log all clicks on the page
 * Load this FIRST before any other scripts to catch everything
 */

console.log('[DEBUG] Click debug script loaded');

// Create visual debug overlay
const debugOverlay = document.createElement('div');
debugOverlay.id = 'debug-overlay';
debugOverlay.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 400px;
    max-height: 300px;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.9);
    color: lime;
    font-family: monospace;
    font-size: 11px;
    padding: 10px;
    z-index: 999999;
    pointer-events: none;
`;

function addDebugLog(msg, color = 'lime') {
    const logLine = document.createElement('div');
    logLine.style.color = color;
    logLine.style.marginBottom = '4px';
    logLine.textContent = new Date().toLocaleTimeString() + ' - ' + msg;
    debugOverlay.appendChild(logLine);
    
    // Keep only last 20 logs
    while (debugOverlay.childNodes.length > 20) {
        debugOverlay.removeChild(debugOverlay.firstChild);
    }
    
    console.log(msg);
}

// Add overlay when DOM is ready
if (document.body) {
    document.body.appendChild(debugOverlay);
} else {
    document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(debugOverlay);
    });
}

addDebugLog('[DEBUG] Click debug script loaded', 'cyan');

// Capture phase to catch clicks before any other handlers
document.addEventListener('click', function(e) {
    addDebugLog('[CLICK] Detected on: ' + e.target.tagName, 'yellow');
    
    // Check if it's a link or inside a link
    if (e.target.tagName === 'A' || e.target.closest('a')) {
        const link = e.target.tagName === 'A' ? e.target : e.target.closest('a');
        addDebugLog('[LINK] href: ' + link.href, 'lime');
        addDebugLog('[LINK] text: ' + link.textContent.trim().substring(0, 30), 'lime');
        addDebugLog('[LINK] prevented: ' + e.defaultPrevented, 'orange');
        addDebugLog('[DEBUG] Allowing navigation...', 'green');
    }
}, true); // Use capture phase

addDebugLog('[DEBUG] Click listener installed', 'cyan');
