/* HARDWARE TYCOON: DATABASE & INVENTORY MANAGER
 * INCLUDES: Save System, Advanced Search, Sort, Filter, Edit Module, and Storefront UI
 */

const DB_KEY = "HT_DATA_V2";

window.sys = {
    // --- 1. CORE STORAGE ---
    load: function () {
        const data = localStorage.getItem(DB_KEY);
        let parsed = data ? JSON.parse(data) : { inventory: [], gameTime: { year: 2010, quarter: 1 } };
        if (!parsed.gameTime) parsed.gameTime = { year: 2010, quarter: 1 };
        return parsed;
    },

    save: function (data) {
        localStorage.setItem(DB_KEY, JSON.stringify(data));
    },

    formatUnits: function (value, baseUnit) {
        if (!value || isNaN(value)) return `0 ${baseUnit}`;

        let val = Number(value);
        let unit = baseUnit;

        if (baseUnit === 'MB/s' || baseUnit === 'MBps') {
            if (val >= 1000000) { val = val / 1000000; unit = 'TB/s'; }
            else if (val >= 1000) { val = val / 1000; unit = 'GB/s'; }
        } else if (baseUnit === 'GB/s' || baseUnit === 'GBps') {
            if (val >= 1000) { val = val / 1000; unit = 'TB/s'; }
            else if (val < 1 && val > 0) { val = val * 1000; unit = 'MB/s'; }
        } else if (baseUnit === 'MB') {
            if (val >= 1000000) { val = val / 1000000; unit = 'TB'; }
            else if (val >= 1000) { val = val / 1000; unit = 'GB'; }
        } else if (baseUnit === 'GB') {
            if (val >= 1000) { val = val / 1000; unit = 'TB'; }
        } else if (baseUnit === 'W') {
            if (val >= 1000000) { val = val / 1000000; unit = 'MW'; }
            else if (val >= 1000) { val = val / 1000; unit = 'kW'; }
        } else if (baseUnit === 'Hz') {
            if (val >= 1000000000) { val = val / 1000000000; unit = 'GHz'; }
            else if (val >= 1000000) { val = val / 1000000; unit = 'MHz'; }
            else if (val >= 1000) { val = val / 1000; unit = 'kHz'; }
        } else if (baseUnit === 'MHz') {
            if (val >= 1000) { val = val / 1000; unit = 'GHz'; }
        } else if (baseUnit === 'Flops' || baseUnit === 'FLOPS') {
            if (val >= 1000000000000000) { val = val / 1000000000000000; unit = 'PFLOPS'; }
            else if (val >= 1000000000000) { val = val / 1000000000000; unit = 'TFLOPS'; }
            else if (val >= 1000000000) { val = val / 1000000000; unit = 'GFLOPS'; }
            else if (val >= 1000000) { val = val / 1000000; unit = 'MFLOPS'; }
        } else if (baseUnit === 'TFLOPS') {
            if (val >= 1000) { val = val / 1000; unit = 'PFLOPS'; }
            else if (val < 1 && val >= 0.001) { val = val * 1000; unit = 'GFLOPS'; }
            else if (val < 0.001 && val > 0) { val = val * 1000000; unit = 'MFLOPS'; }
        }

        // Format to max 2 decimal places, but drop .00
        return `${Number(val.toFixed(2))} ${unit}`;
    },

    updateTimeDisplay: function () {
        const db = this.load();
        const display = document.getElementById('game-time-display');
        if (display) {
            display.textContent = `${db.gameTime.year} Q${db.gameTime.quarter}`;
        }
    },

    nextQuarter: function () {
        const db = this.load();
        db.gameTime.quarter++;
        if (db.gameTime.quarter > 4) {
            db.gameTime.quarter = 1;
            db.gameTime.year++;
        }
        this.save(db);
        this.updateTimeDisplay();
        if (window.showToast) window.showToast(`Advanced to ${db.gameTime.year} Q${db.gameTime.quarter}`, 'info');
    },

    prevQuarter: function () {
        const db = this.load();
        if (db.gameTime.year === 2010 && db.gameTime.quarter === 1) {
            if (window.showToast) window.showToast(`Cannot go back before starting date.`, 'error');
            return;
        }

        const targetYearStr = `${db.gameTime.year} Q${db.gameTime.quarter}`;
        // UNDO Logic: Delete products created in this current quarter before moving back
        const itemsToDelete = db.inventory.filter(i => i.year === targetYearStr);
        if (itemsToDelete.length > 0) {
            db.inventory = db.inventory.filter(i => i.year !== targetYearStr);
            if (window.showToast) window.showToast(`Undid ${itemsToDelete.length} product(s) from ${targetYearStr}.`, 'error');
        }

        db.gameTime.quarter--;
        if (db.gameTime.quarter < 1) {
            db.gameTime.quarter = 4;
            db.gameTime.year--;
        }
        this.save(db);
        this.updateTimeDisplay();
        if (window.showToast && itemsToDelete.length === 0) window.showToast(`Reverted to ${db.gameTime.year} Q${db.gameTime.quarter}`, 'info');
        
        // Refresh views
        if (window.currentView === 'inventory' && window.renderInventory) window.renderInventory();
        if (window.currentView === 'storefront' && window.renderStorefront) window.renderStorefront();
        if (window.currentPart) {
            let moduleName = window.currentPart;
            if (moduleName === 'console') moduleName = 'consoleArch';
            if (window[moduleName] && window[moduleName].refreshLineup) {
                window[moduleName].refreshLineup();
            }
        }
    },

    // --- 2. API ---
    saveDesign: function (type, specs) {
        const db = this.load();

        // Normalize top-level retail price so inventory sorting/display is stable.
        const normalizedPrice = Number.isFinite(Number(specs.price)) ? Number(specs.price) : 0;
        specs.price = normalizedPrice;
        if (specs.raw && !Number.isFinite(Number(specs.raw.price))) specs.raw.price = normalizedPrice;

        // Extract numeric score for sorting purposes
        let scoreVal = 0;
        if (specs.specs && specs.specs.Score) scoreVal = parseFloat(specs.specs.Score) || 0; // if "1200"
        if (scoreVal === 0 && typeof specs.specs.Score === 'string') scoreVal = parseFloat(specs.specs.Score.replace(/[^0-9.]/g, '')) || 0; // if "1200 pts"

        const newItem = {
            id: Date.now(),
            type: type,
            name: specs.name,
            active: true, // Currently selling
            specs: specs.specs, // The display strings
            raw: specs, // The raw math data
            date: new Date().toLocaleDateString(),
            year: `${db.gameTime.year} Q${db.gameTime.quarter}`,
            score: scoreVal
        };

        db.inventory.push(newItem);
        this.save(db);

        if (window.showToast) window.showToast(`RELEASED: ${newItem.name} is now on the market!`, 'success');
        else alert(`RELEASED: ${newItem.name} is now on the market!`);

        // Refresh specific architect view if open
        const moduleName = type.toLowerCase();
        if (window[moduleName] && window[moduleName].refreshLineup) {
            window[moduleName].refreshLineup();
        }
    },

    discontinue: function (id) {
        const db = this.load();
        const item = db.inventory.find(i => i.id === id);

        if (item) {
            item.active = false;
            this.save(db);

            if (window.showToast) window.showToast(`${item.name} has been discontinued.`, 'info');

            // Refresh views if visible
            if (window.currentView === 'inventory' && window.renderInventory) window.renderInventory();
            if (window.currentView === 'storefront' && window.renderStorefront) window.renderStorefront();

            // Refresh specific architect view
            const moduleName = item.type.toLowerCase();
            if (window[moduleName] && window[moduleName].refreshLineup) {
                window[moduleName].refreshLineup();
            }
        }
    },

    toggleHide: function (id) {
        const db = this.load();
        const item = db.inventory.find(i => i.id === id);

        if (item && item.raw) {
            item.raw.hideStorefront = !item.raw.hideStorefront;
            this.save(db);

            const status = item.raw.hideStorefront ? "HIDDEN from" : "VISIBLE in";
            if (window.showToast) window.showToast(`${item.name} is now ${status} Storefront.`, 'info');

            // Refresh views if visible
            if (window.currentView === 'inventory' && window.renderInventory) window.renderInventory();
            if (window.currentView === 'storefront' && window.renderStorefront) window.renderStorefront();

            // Refresh specific architect view
            const moduleName = item.type.toLowerCase();
            if (window[moduleName] && window[moduleName].refreshLineup) {
                window[moduleName].refreshLineup();
            }
        }
    },

    deleteDesign: function (id) {
        if (window.showConfirm) {
            window.showConfirm("Permanently delete this record? This cannot be undone.", () => {
                this._executeDelete(id);
            });
        } else if (confirm("Permanently delete this record? This cannot be undone.")) {
            this._executeDelete(id);
        }
    },

    _executeDelete: function (id) {
        const db = this.load();
        db.inventory = db.inventory.filter(item => item.id !== id);
        this.save(db);

        if (window.currentView === 'inventory' && window.renderInventory) window.renderInventory();
        if (window.currentView === 'storefront' && window.renderStorefront) window.renderStorefront();
        if (window.showToast) window.showToast('Product record deleted.', 'error');
    },

    startNewSave: function() {
        if (window.showConfirm) {
            window.showConfirm("WARNING: This will wipe your company and restart the game. Are you sure?", () => {
                this.save({ inventory: [] });
                if (window.showToast) window.showToast("Save file wiped. Starting fresh.", "success");
                window.location.reload();
            });
        }
    },

    // --- 3. EDIT SYSTEM ---
    openEditModal: function (id) {
        const db = this.load();
        const item = db.inventory.find(i => i.id === id);
        if (!item) return;

        // Remove existing modal if any
        const existing = document.getElementById('edit-modal-overlay');
        if (existing) existing.remove();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'edit-modal-overlay';
        overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.8); backdrop-filter:blur(5px); display:flex; align-items:center; justify-content:center; z-index:10000;';

        // Generate dynamic inputs for all specs
        let specsHtml = '';
        if (item.specs) {
            specsHtml = `<div style="margin-top:15px; border-top:1px solid #333; padding-top:15px;">
                <h4 style="color:var(--accent-secondary); margin-bottom:10px; font-size:0.9rem;">Technical Specifications</h4>
                <p style="font-size: 0.75rem; color: #888; margin-bottom: 10px;">Warning: Modifying these will not change the benchmark physics, but will alter how it appears to customers.</p>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                    ${Object.entries(item.specs).map(([key, val], index) => `
                        <div class="input-group">
                            <label>${key}</label>
                            <input type="text" id="edit-spec-${index}" data-speckey="${key}" value="${val}">
                        </div>
                    `).join('')}
                </div>
            </div>`;
        }

        overlay.innerHTML = `
            <div class="confirm-dialog" style="transform: translateY(0); opacity: 1; max-height:80vh; overflow-y:auto; width:500px;">
                <h3 style="color: var(--accent); border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px;">Edit Product Database</h3>
                
                <div class="input-group">
                    <label>Product Name</label>
                    <input type="text" id="edit-name" value="${item.name}">
                </div>
                
                <div class="input-group">
                    <label>Retail Price ($)</label>
                    <input type="number" id="edit-price" value="${item.raw.price || 0}">
                </div>
                
                ${specsHtml}

                <div class="confirm-actions" style="margin-top: 20px;">
                    <button class="btn-cancel" onclick="document.getElementById('edit-modal-overlay').remove()">CANCEL</button>
                    <button class="btn-action" style="background:#00aaff; color:#fff;" onclick="window.sys.saveAsNew(${item.id})">SAVE AS NEW</button>
                    <button class="btn-action" onclick="window.sys.saveEdit(${item.id})">SAVE CHANGES</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    },

    saveAsNew: function(id) {
        const db = this.load();
        const baseItem = db.inventory.find(i => i.id === id);
        if (!baseItem) return;

        const newName = document.getElementById('edit-name').value;
        const newPrice = parseFloat(document.getElementById('edit-price').value) || 0;

        // Clone the item
        const newItem = JSON.parse(JSON.stringify(baseItem));
        newItem.id = Date.now();
        newItem.name = newName;
        // Keep existing year from base item since we don't edit it anymore
        newItem.raw.name = newName;
        newItem.raw.price = newPrice;
        
        // Apply spec changes safely
        const specsContainer = document.getElementById('edit-modal-overlay');
        const specInputs = specsContainer.querySelectorAll('input[id^="edit-spec-"]');
        specInputs.forEach(input => {
            const key = input.getAttribute('data-speckey');
            if (key && newItem.specs[key] !== undefined) {
                newItem.specs[key] = input.value;
            }
        });

        db.inventory.push(newItem);
        this.save(db);
        document.getElementById('edit-modal-overlay').remove();

        if (window.showToast) window.showToast('Product cloned and saved as new!', 'success');

        // Re-render views
        if (window.currentView === 'inventory' && window.renderInventory) window.renderInventory();
        if (window.currentView === 'storefront' && window.renderStorefront) window.renderStorefront();

        const moduleName = newItem.type.toLowerCase();
        if (window[moduleName] && window[moduleName].refreshLineup) {
            window[moduleName].refreshLineup();
        }
    },

    saveEdit: function (id) {
        const db = this.load();
        const itemIndex = db.inventory.findIndex(i => i.id === id);
        if (itemIndex === -1) return;

        const newName = document.getElementById('edit-name').value;
        const newPrice = parseFloat(document.getElementById('edit-price').value) || 0;

        // Apply base changes
        db.inventory[itemIndex].name = newName;
        // Do not update year
        db.inventory[itemIndex].raw.name = newName;
        db.inventory[itemIndex].raw.price = newPrice;

        // Apply spec changes safely
        const specsContainer = document.getElementById('edit-modal-overlay');
        const specInputs = specsContainer.querySelectorAll('input[id^="edit-spec-"]');

        specInputs.forEach(input => {
            const key = input.getAttribute('data-speckey');
            if (key && db.inventory[itemIndex].specs[key] !== undefined) {
                db.inventory[itemIndex].specs[key] = input.value;
            }
        });

        this.save(db);
        document.getElementById('edit-modal-overlay').remove();

        if (window.showToast) window.showToast('Product updated successfully!', 'success');

        // Re-render views
        if (window.currentView === 'inventory' && window.renderInventory) window.renderInventory();
        if (window.currentView === 'storefront' && window.renderStorefront) window.renderStorefront();

        const moduleName = db.inventory[itemIndex].type.toLowerCase();
        if (window[moduleName] && window[moduleName].refreshLineup) {
            window[moduleName].refreshLineup();
        }
    },

    // --- DETAILS & COMPARE MODAL ---
    openStorefrontDetails: function(id) {
        const db = this.load();
        const item = db.inventory.find(i => i.id === id);
        if (!item) return;

        // Remove existing overlay
        const existing = document.getElementById('details-modal-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'details-modal-overlay';
        overlay.className = 'details-modal-overlay';
        overlay.onclick = (e) => { if(e.target === overlay) overlay.remove(); };

        // Format Specs
        let specsHtml = '';
        if (item.specs) {
            specsHtml = Object.entries(item.specs).map(([key, val]) => {
                return `<div class="spec-item"><div class="spec-label">${key}</div><div class="spec-value">${val}</div></div>`;
            }).join('');
        }

        const typeColors = {
            'CPU': '#00aaff', 'GPU': '#76b900', 'RAM': '#ffaa00', 'Storage': '#ff4444',
            'Motherboard': '#a1a1aa', 'Camera': '#00ffff', 'Display': '#ff00ff',
            'Desktop': '#bd00ff', 'Console': '#ff8800', 'Smartphone': '#00ffaa', 'Laptop': '#4488ff', 'Server': '#00ff88'
        };
        const color = typeColors[item.type] || 'var(--accent)';

        overlay.innerHTML = `
            <div class="details-modal-content confirm-dialog" style="max-height:85vh; overflow-y:auto; width:600px; transform: translateY(0); opacity: 1; border-top:4px solid ${color};">
                <button onclick="document.getElementById('details-modal-overlay').remove()" style="position:absolute; top:15px; right:15px; background:none; border:none; color:#cfcfcf; font-size:1.5rem; cursor:pointer;">&times;</button>
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 20px;">
                    <div>
                        <div style="font-size:0.8rem; color:${color}; font-weight:bold; letter-spacing:1px; text-transform:uppercase; margin-bottom:5px;">${item.type} | ${item.year}</div>
                        <h2 style="margin:0; font-size:1.8rem;">${item.name}</h2>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:1.5rem; font-weight:bold; color:#00e676;">$${item.raw && item.raw.price ? item.raw.price : 0}</div>
                        <span style="font-size:0.75rem; color:#00e676; font-weight:bold; background:rgba(0,230,118,0.1); padding:4px 8px; border-radius:4px; border:1px solid rgba(0,230,118,0.3); display:inline-block; margin-top:5px;">IN STOCK</span>
                    </div>
                </div>

                <h4 style="color:var(--accent-secondary); margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:5px;">Specifications</h4>
                <div class="spec-grid">
                    ${specsHtml || '<div style="color:#aaa; font-style:italic;">No specs recorded.</div>'}
                </div>

                <div style="margin-top: 25px; padding-top:15px; border-top:1px solid #333; display:flex; gap:10px; justify-content:center;">
                    <button class="btn-action" style="background:#333; color:#fff; flex:1;" onclick="window.sys.openCompareModal(${item.id})">COMPARE WITH...</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    },

    openCompareModal: function(baseId) {
        const db = this.load();
        const baseItem = db.inventory.find(i => i.id === baseId);
        if (!baseItem) return;

        // Get comparable items (same type, active)
        const comparableItems = db.inventory.filter(i => i.type === baseItem.type && i.active && i.id !== baseId);

        let dropdownHtml = '';
        if (comparableItems.length === 0) {
            dropdownHtml = `<option value="">No other active products to compare</option>`;
        } else {
            dropdownHtml = `<option value="">-- Select Product --</option>` + comparableItems.map(i => `<option value="${i.id}">${i.name} (${i.year}) - $${i.raw && i.raw.price ? i.raw.price : 0}</option>`).join('');
        }

        const detailsOverlay = document.getElementById('details-modal-overlay');
        if (detailsOverlay) {
             detailsOverlay.querySelector('.details-modal-content').innerHTML = `
                <button onclick="window.sys.openStorefrontDetails(${baseId})" style="position:absolute; top:15px; left:15px; background:none; border:none; color:#888; font-size:1.5rem; cursor:pointer;">&larr;</button>
                <button onclick="document.getElementById('details-modal-overlay').remove()" style="position:absolute; top:15px; right:15px; background:none; border:none; color:#cfcfcf; font-size:1.5rem; cursor:pointer;">&times;</button>
                
                <h3 style="text-align:center; margin-bottom:20px; color:var(--accent);">Product Comparison</h3>
                
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; gap:15px;">
                    <div style="flex:1; text-align:center;">
                        <div style="font-weight:bold; color:var(--text-main); font-size:1.2rem;">${baseItem.name}</div>
                        <div style="color:#888; font-size:0.9rem;">Base Product</div>
                    </div>
                    <div style="flex:1; text-align:center;">
                        <select id="compare-select" onchange="window.sys.renderCompareTable(${baseId}, this.value)" style="width:100%; padding:8px; background:#111; color:#fff; border:1px solid #444; border-radius:4px; font-size:1rem;">
                            ${dropdownHtml}
                        </select>
                    </div>
                </div>

                <div id="compare-table-container" style="min-height:200px; max-height:50vh; overflow-y:auto;">
                    <div style="text-align:center; color:#555; padding:40px 0; font-style:italic;">Select a product to compare.</div>
                </div>
             `;
        }
    },

    renderCompareTable: function(baseId, compareId) {
        if (!compareId) {
            document.getElementById('compare-table-container').innerHTML = `<div style="text-align:center; color:#555; padding:40px 0; font-style:italic;">Select a product to compare.</div>`;
            return;
        }

        const db = this.load();
        const baseItem = db.inventory.find(i => i.id === baseId);
        const compItem = db.inventory.find(i => i.id === parseInt(compareId));

        if (!baseItem || !compItem) return;

        let html = '<table class="compare-table" style="width:100%; border-collapse: collapse; text-align:center; font-size:0.9rem;">';
        html += `<tr style="border-bottom: 2px solid #333; position:sticky; top:0; background:var(--bg-panel);"><th style="padding:10px; text-align:left; width:30%;">Metric</th><th style="padding:10px; width:35%;">${baseItem.name}</th><th style="padding:10px; width:35%;">${compItem.name}</th></tr>`;

        const renderRow = (label, val1, val2, invertGood = false, neutral = false) => {
             let match1 = String(val1).match(/-?\d+(\.\d+)?/);
             let match2 = String(val2).match(/-?\d+(\.\d+)?/);
             let num1 = match1 ? parseFloat(match1[0]) : NaN;
             let num2 = match2 ? parseFloat(match2[0]) : NaN;
             
             let color1 = '', color2 = '';
             let arrow1 = '', arrow2 = '';
             if (!neutral && !isNaN(num1) && !isNaN(num2)) {
                 if (num1 > num2) {
                     color1 = invertGood ? '#ff4444' : '#00e676';
                     color2 = invertGood ? '#00e676' : '#ff4444';
                     arrow1 = invertGood ? ' &#9660;' : ' &#9650;';
                 } else if (num2 > num1) {
                     color1 = invertGood ? '#00e676' : '#ff4444';
                     color2 = invertGood ? '#ff4444' : '#00e676';
                     arrow2 = invertGood ? ' &#9660;' : ' &#9650;';
                 }
             }

             return `<tr style="border-bottom:1px solid #222;">
                <td style="padding:10px; text-align:left; color:#888;">${label}</td>
                <td style="padding:10px; color:${color1 || '#ddd'}; font-weight:${color1 ? 'bold' : 'normal'};">${val1 !== undefined && val1 !== null ? val1 : 'N/A'}${arrow1}</td>
                <td style="padding:10px; color:${color2 || '#ddd'}; font-weight:${color2 ? 'bold' : 'normal'};">${val2 !== undefined && val2 !== null ? val2 : 'N/A'}${arrow2}</td>
             </tr>`;
        };

        html += renderRow('Release Year', baseItem.year, compItem.year, false, true);
        html += renderRow('Price ($)', baseItem.raw?.price || 0, compItem.raw?.price || 0, true);
        
        html += `<tr><td colspan="3" style="padding:15px 10px 5px; text-align:left; font-weight:bold; color:var(--accent-secondary); font-size:0.85rem; text-transform:uppercase;">Specifications</td></tr>`;
        const allSpecKeys = new Set([...Object.keys(baseItem.specs || {}), ...Object.keys(compItem.specs || {})]);
        for (let key of Array.from(allSpecKeys)) {
             let invert = false;
             if (key.toLowerCase().includes('tdp') || key.toLowerCase().includes('power') || key.toLowerCase().includes('process') || key.toLowerCase().includes('limits')) {
                 invert = true; 
             }
             html += renderRow(key, baseItem.specs?.[key], compItem.specs?.[key], invert);
        }

        html += '</table>';
        document.getElementById('compare-table-container').innerHTML = html;
    }
};

// --- 4. INVENTORY VIEW STATE ---
let invState = {
    sort: 'newest',
    filterType: 'all',
    search: '',
    minScore: 0,
    minPrice: 0,
    showDiscontinued: false,
    advOpen: false
};

// --- 5. RENDER INVENTORY SYSTEM ---
window.renderInventory = function () {
    const workspace = document.getElementById('workspace');
    const db = window.sys.load();

    // --- RENDER TOOLBAR ---
    workspace.innerHTML = `
        <div class="panel" style="margin-bottom:20px; border-color:var(--border-light); background:rgba(0,0,0,0.2);">
            <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                
                <div style="flex:2; min-width:200px;">
                    <input type="text" id="inv-search" placeholder="Search product name..." value="${invState.search}" 
                        oninput="window.updateInvState('search', this.value)"
                        style="width:100%; padding:10px; background:#000; border:1px solid var(--border-light); color:#fff; border-radius:4px; font-family:var(--font-mono);">
                </div>
                
                <div style="flex:1; min-width:120px;">
                    <select onchange="window.updateInvState('filterType', this.value)" style="width:100%; padding:10px; background:#000; border:1px solid var(--border-light); color:#fff; border-radius:4px;">
                        <option value="all" ${invState.filterType === 'all' ? 'selected' : ''}>All Types</option>
                        <option value="CPU" ${invState.filterType === 'CPU' ? 'selected' : ''}>Processors</option>
                        <option value="GPU" ${invState.filterType === 'GPU' ? 'selected' : ''}>Graphics</option>
                        <option value="RAM" ${invState.filterType === 'RAM' ? 'selected' : ''}>Memory</option>
                        <option value="Storage" ${invState.filterType === 'Storage' ? 'selected' : ''}>Storage</option>
                        <option value="Motherboard" ${invState.filterType === 'Motherboard' ? 'selected' : ''}>Motherboards</option>
                        <option value="Camera" ${invState.filterType === 'Camera' ? 'selected' : ''}>Cameras</option>
                        <option value="Display" ${invState.filterType === 'Display' ? 'selected' : ''}>Displays</option>
                        <option value="Desktop" ${invState.filterType === 'Desktop' ? 'selected' : ''}>Desktops</option>
                        <option value="Console" ${invState.filterType === 'Console' ? 'selected' : ''}>Consoles</option>
                        <option value="Smartphone" ${invState.filterType === 'Smartphone' ? 'selected' : ''}>Phones</option>
                        <option value="Laptop" ${invState.filterType === 'Laptop' ? 'selected' : ''}>Laptops</option>
                        <option value="Server" ${invState.filterType === 'Server' ? 'selected' : ''}>Servers</option>
                    </select>
                </div>

                <div style="flex:1; min-width:120px;">
                    <select onchange="window.updateInvState('sort', this.value)" style="width:100%; padding:10px; background:#000; border:1px solid var(--border-light); color:#fff; border-radius:4px;">
                        <option value="newest" ${invState.sort === 'newest' ? 'selected' : ''}>Newest First</option>
                        <option value="oldest" ${invState.sort === 'oldest' ? 'selected' : ''}>Oldest First</option>
                        <option value="price_high" ${invState.sort === 'price_high' ? 'selected' : ''}>Price: High to Low</option>
                        <option value="price_low" ${invState.sort === 'price_low' ? 'selected' : ''}>Price: Low to High</option>
                        <option value="score_high" ${invState.sort === 'score_high' ? 'selected' : ''}>Performance: Best</option>
                    </select>
                </div>

                <button onclick="window.toggleAdvFilter()" style="padding:10px 16px; background:var(--border-dim); border:1px solid var(--border-light); color:#fff; cursor:pointer; border-radius:4px; font-weight:bold;">
                    ${invState.advOpen ? 'HIDE FILTERS ▲' : 'ADVANCED ▼'}
                </button>
            </div>

            <div style="display:${invState.advOpen ? 'grid' : 'none'}; grid-template-columns: 1fr 1fr 1fr; gap:15px; margin-top:15px; padding-top:15px; border-top:1px solid var(--border-dim);">
                <div class="input-group">
                    <label>Min Performance Score</label>
                    <input type="number" value="${invState.minScore}" onchange="window.updateInvState('minScore', this.value)" placeholder="0">
                </div>
                <div class="input-group">
                    <label>Min Price ($)</label>
                    <input type="number" value="${invState.minPrice}" onchange="window.updateInvState('minPrice', this.value)" placeholder="0">
                </div>
                <div style="display:flex; align-items:end; padding-bottom:10px;">
                    <label style="display:flex; align-items:center; gap:8px; cursor:pointer; color:var(--text-main); font-size:0.8rem; font-weight:bold;">
                        <input type="checkbox" ${invState.showDiscontinued ? 'checked' : ''} onchange="window.updateInvState('showDiscontinued', this.checked)"> 
                        SHOW DISCONTINUED PRODUCTS
                    </label>
                </div>
            </div>
        </div>
        
        <div id="inv-list" class="architect-container">
        </div>
    `;

    // --- FILTER & SORT LOGIC ---
    let items = db.inventory;

    // A. Filter by Type
    if (invState.filterType !== 'all') {
        items = items.filter(i => i.type === invState.filterType);
    }

    // B. Filter by Active/Discontinued
    if (!invState.showDiscontinued) {
        items = items.filter(i => i.active);
    }

    // C. Search Text
    if (invState.search) {
        const term = invState.search.toLowerCase();
        items = items.filter(i => i.name.toLowerCase().includes(term) || i.type.toLowerCase().includes(term));
    }

    // D. Advanced Numeric Filters
    if (invState.minScore > 0) items = items.filter(i => (i.score || 0) >= invState.minScore);
    if (invState.minPrice > 0) items = items.filter(i => (i.raw.price || 0) >= invState.minPrice);

    // E. Sorting
    items.sort((a, b) => {
        switch (invState.sort) {
            case 'newest': return b.id - a.id;
            case 'oldest': return a.id - b.id;
            case 'price_high': return (b.raw.price || 0) - (a.raw.price || 0);
            case 'price_low': return (a.raw.price || 0) - (b.raw.price || 0);
            case 'score_high': return (b.score || 0) - (a.score || 0);
            default: return 0;
        }
    });

    // --- RENDER ITEMS ---
    const listContainer = document.getElementById('inv-list');

    if (items.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1; min-height:200px;">
                <div class="empty-icon">📭</div>
                <h3 class="empty-title">NO PRODUCTS FOUND</h3>
                <p class="empty-desc">Adjust your filters or start manufacturing.</p>
            </div>`;
        return;
    }

    listContainer.className = 'storefront-grid';
    listContainer.innerHTML = items.map(item => {
        // Color coding matching storefront UI
        const typeColors = {
            'CPU': '#00aaff', 'GPU': '#76b900', 'RAM': '#ffaa00', 'Storage': '#ff4444',
            'Motherboard': '#a1a1aa', 'Camera': '#00ffff', 'Display': '#ff00ff',
            'Desktop': '#bd00ff', 'Console': '#ff8800', 'Smartphone': '#00ffaa', 'Laptop': '#4488ff', 'Server': '#00ff88'
        };
        const color = typeColors[item.type] || 'var(--accent)';
        const opacity = item.active ? 1 : 0.5;
        const statusBadge = item.active
            ? `<div class="flagship-badge" style="background:rgba(0,230,118,0.2); color:#00e676; border:1px solid rgba(0,230,118,0.5);">ACTIVE</div>`
            : `<div class="flagship-badge" style="background:rgba(255,255,255,0.05); color:#888; border:1px solid #444;">ARCHIVED</div>`;

        // Format top 3 Specs to match storefront cards
        const topSpecs = Object.entries(item.specs).slice(0, 3);
        const specsHtml = topSpecs.map(([k, v]) => `
            <div class="hero-spec">
                <span class="hero-spec-label">${k}</span>
                <span class="hero-spec-value">${v}</span>
            </div>
        `).join('');

        // Prefer explicit Score string, fallback to gaming score
        const displayScore = item.specs.Score ? item.specs.Score : (item.score || 0);

        return `
            <div class="storefront-card" style="--theme-color: ${color}; opacity:${opacity};">
                ${statusBadge}
                
                <div class="storefront-card-header">
                    <div style="font-size:0.75rem; color:${color}; font-weight:800; letter-spacing:1px; text-transform:uppercase; margin-bottom:4px;">${item.type}</div>
                    <div class="storefront-card-year">${item.year || ''}</div>
                    <h3 class="storefront-card-title">${item.name}</h3>
                    <div style="margin-top:5px; font-size:0.75rem; color:var(--text-main); font-weight:bold; background:rgba(0,0,0,0.5); padding:3px 6px; border-radius:4px; display:inline-block; border:1px solid var(--border-light);">
                        BENCHMARK: <span style="color:var(--accent);">${displayScore}</span>
                    </div>
                </div>

                <div class="storefront-card-specs">
                    ${specsHtml}
                </div>

                <div class="storefront-card-footer">
                    <div class="storefront-price">$${item.raw.price || 0}</div>
                    <div style="display:flex; gap:5px; flex-wrap:wrap; width:100%; margin-top:10px;">
                        <button class="storefront-edit-btn" style="flex:1; padding:6px 0;" onclick="window.cloneToArchitect(${item.id})">CLONE</button>
                        <button class="storefront-edit-btn" style="flex:1; padding:6px 0; color:var(--accent-secondary); border-color:var(--accent-secondary);" onclick="window.sys.openEditModal(${item.id})">EDIT</button>
                        ${item.raw && item.raw.hideStorefront ? 
                            `<button class="storefront-edit-btn" style="flex:1; padding:6px 0; color:#aaa; border-color:#444;" onclick="window.sys.toggleHide(${item.id})">UNHIDE</button>` : 
                            `<button class="storefront-edit-btn" style="flex:1; padding:6px 0; color:#aaa; border-color:#444;" onclick="window.sys.toggleHide(${item.id})">HIDE</button>`
                        }
                        ${item.active ?
                            `<button class="storefront-edit-btn" style="flex:1; padding:6px 0; color:#ff1744; border-color:rgba(255,23,68,0.5);" onclick="window.sys.discontinue(${item.id})">DISCONTINUE</button>`
                            : `<button class="storefront-edit-btn" style="flex:1; padding:6px 0; color:#666; border-color:#444;" onclick="window.sys.deleteDesign(${item.id})">DELETE</button>`
                        }
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Focus management for search
    const searchInput = document.getElementById('inv-search');
    if (searchInput && document.activeElement === searchInput) {
        const val = searchInput.value;
        searchInput.focus();
        searchInput.value = '';
        searchInput.value = val;
    }
};

// --- HELPERS ---
window.updateInvState = function (key, val) {
    if (key === 'minScore' || key === 'minPrice') val = parseFloat(val);
    invState[key] = val;
    window.renderInventory();
};

window.toggleAdvFilter = function () {
    invState.advOpen = !invState.advOpen;
    window.renderInventory();
};

// --- 6. RENDER STOREFRONT (MARKETPLACE) ---
window.renderStorefront = function () {
    const workspace = document.getElementById('workspace');
    const db = window.sys.load();
    
    window.storefrontFilter = window.storefrontFilter || 'ALL';

    // 1. Filter only ACTIVE products and not hidden in storefront
    const activeProducts = db.inventory.filter(i => i.active && !i.raw.hideStorefront);

    // Empty State Check
    if (activeProducts.length === 0) {
        workspace.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon pulse" style="filter: none; text-shadow: 0 0 20px var(--accent);">🛒</div>
                <h2 class="empty-title">STOREFRONT EMPTY</h2>
                <div class="empty-guide" style="margin-top: 20px; padding: 20px; background: rgba(0, 230, 118, 0.05); border: 1px dashed var(--accent-success); border-radius: 8px; color: #ccc;">
                    <p style="margin:0 0 10px 0;">No products have been released to the market yet.</p>
                    <p style="margin:0; font-size:1.1rem;">👈 Start in <span style="color:var(--accent-success); font-weight:bold;">R&D</span> by selecting a component from the sidebar.</p>
                </div>
            </div>`;
        return;
    }

    // 2. Group by Type & Find Flagships
    const groups = {};
    activeProducts.forEach(item => {
        const type = item.type;
        if (!groups[type]) {
            groups[type] = {
                items: [],
                flagshipId: null,
                highestScore: -1
            };
        }

        groups[type].items.push(item);

        // Calculate Flagship
        const score = item.score || 0;
        if (score > groups[type].highestScore) {
            groups[type].highestScore = score;
            groups[type].flagshipId = item.id;
        }
    });

    // 3. Global Stats Calculation
    const totalProducts = activeProducts.length;
    const activeDivisions = Object.keys(groups).length;

    // 4. Color Mapping for UI
    const typeColors = {
        'CPU': '#00aaff', 'GPU': '#76b900', 'RAM': '#ffaa00', 'Storage': '#ff4444',
        'Motherboard': '#a1a1aa', 'Camera': '#00ffff', 'Display': '#ff00ff',
        'Desktop': '#bd00ff', 'Console': '#ff8800', 'Smartphone': '#00ffaa', 'Laptop': '#4488ff', 'Server': '#00ff88'
    };

    // 5. Build HTML
    let html = `
        <!-- Stats Glass Bar -->
        <div class="storefront-stats-bar" style="display:flex; justify-content:center; gap:30px; margin-bottom: 25px;">
            <div class="stat-block">
                <span class="stat-label">PRODUCTS AVAILABLE</span>
                <span class="stat-value" style="color:#fff;">${totalProducts}</span>
            </div>
            <div class="stat-block">
                <span class="stat-label">DIVISIONS</span>
                <span class="stat-value" style="color:var(--accent);">${activeDivisions}</span>
            </div>
        </div>
    `;

    // Category filtering UI
    const categories = ['ALL', 'PARTS', 'PRODUCTS', 'CPU', 'GPU', 'RAM', 'Storage', 'Motherboard', 'Camera', 'Display', 'Desktop', 'Console', 'Smartphone', 'Laptop', 'Server'];
    let filterHtml = '<div class="storefront-filters" style="display:flex; gap:10px; margin-bottom: 40px; flex-wrap:wrap; justify-content:center;">';
    categories.forEach(cat => {
        const activeStyle = window.storefrontFilter === cat ? 'background:var(--accent); color:var(--bg-base);' : 'background:rgba(255,255,255,0.05); color:var(--text-muted); border:1px solid var(--border-dim);';
        filterHtml += `<button onclick="window.storefrontFilter='${cat}'; window.renderStorefront()" style="padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; cursor:pointer; ${activeStyle}">${cat}</button>`;
    });
    filterHtml += '</div>';
    html += filterHtml;

    const parts = ['CPU', 'GPU', 'RAM', 'Storage', 'Motherboard', 'Camera', 'Display'];
    const products = ['Desktop', 'Console', 'Smartphone', 'Laptop', 'Server'];

    // Iterate through each division
    for (const [type, group] of Object.entries(groups)) {
        if (window.storefrontFilter !== 'ALL') {
            if (window.storefrontFilter === 'PARTS' && !parts.includes(type)) continue;
            else if (window.storefrontFilter === 'PRODUCTS' && !products.includes(type)) continue;
            else if (window.storefrontFilter !== 'PARTS' && window.storefrontFilter !== 'PRODUCTS' && type !== window.storefrontFilter) continue;
        }
        const color = typeColors[type] || 'var(--accent)';

        // Sort items in the group by score descending (so Flagship is first)
        group.items.sort((a, b) => (b.score || 0) - (a.score || 0));

        html += `
            <div class="storefront-section" id="section-${type}">
                <h2 class="storefront-section-title" style="border-left: 4px solid ${color}; display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:15px;">
                        ${type} LINEUP
                        <span class="storefront-section-count">${group.items.length} MODELS</span>
                    </div>
                    <button onclick="
                        const grid = this.parentElement.nextElementSibling;
                        if(grid.style.display === 'none') {
                            grid.style.display = 'grid';
                            this.innerHTML = '▼';
                        } else {
                            grid.style.display = 'none';
                            this.innerHTML = '▶';
                        }
                    " style="font-size:1rem; color:var(--text-muted); background:none; border:none; cursor:pointer; padding:5px;">▼</button>
                </h2>
                <div class="storefront-grid" style="display:grid;">
        `;

        group.items.forEach(item => {
            const isFlagship = item.id === group.flagshipId;

            // Extract all specs, split them
            const allSpecs = Object.entries(item.specs);
            const topSpecs = allSpecs.slice(0, 3);
            const restSpecs = allSpecs.slice(3);

            const specsHtml = topSpecs.map(([k, v]) => `
                <div class="hero-spec">
                    <span class="hero-spec-label">${k}</span>
                    <span class="hero-spec-value">${v}</span>
                </div>
            `).join('');

            const restSpecsHtml = restSpecs.length > 0 ? `
                <div class="rest-specs" style="display:none; margin-top:10px; border-top:1px dashed rgba(255,255,255,0.1); padding-top:10px;">
                    ${restSpecs.map(([k, v]) => `
                        <div class="hero-spec">
                            <span class="hero-spec-label">${k}</span>
                            <span class="hero-spec-value">${v}</span>
                        </div>
                    `).join('')}
                </div>
                <button class="toggle-specs-btn" onclick="
                    const rest = this.previousElementSibling;
                    if(rest.style.display === 'none') {
                        rest.style.display = 'block';
                        this.innerText = 'HIDE SPECS ▲';
                    } else {
                        rest.style.display = 'none';
                        this.innerText = 'SHOW ALL SPECS ▼';
                    }
                " style="width:100%; background:none; border:none; color:var(--text-muted); font-size:0.7rem; font-weight:bold; cursor:pointer; padding:8px 0; margin-top:5px; text-transform:uppercase;">SHOW ALL SPECS ▼</button>
            ` : '';

            // Prefer explicit Score string, fallback to gaming score
            const displayScore = item.specs.Score ? item.specs.Score : (item.score || 0);

            html += `
                <div class="storefront-card ${isFlagship ? 'flagship' : ''}" style="--theme-color: ${color};">
                    ${isFlagship ? `<div class="flagship-badge">🏆 FLAGSHIP</div>` : ''}
                    
                    <div class="storefront-card-header">
                        <div class="storefront-card-year">${item.year || ''}</div>
                        <h3 class="storefront-card-title">${item.name}</h3>
                        <div style="margin-top:5px; font-size:0.75rem; color:var(--text-main); font-weight:bold; background:rgba(0,0,0,0.5); padding:3px 6px; border-radius:4px; display:inline-block; border:1px solid var(--border-light);">
                            BENCHMARK: <span style="color:var(--accent);">${displayScore}</span>
                        </div>
                    </div>

                    <div class="storefront-card-specs">
                        ${specsHtml}
                        ${restSpecsHtml}
                    </div>

                    <div class="storefront-card-footer" style="flex-direction:column; gap:8px;">
                        <div style="display:flex; justify-content:space-between; align-items:flex-end; width:100%; border-bottom:1px solid #333; padding-bottom:8px;">
                            <span style="font-size:0.75rem; color:#00e676; font-weight:bold; background:rgba(0,230,118,0.1); padding:4px 8px; border-radius:4px; border:1px solid rgba(0,230,118,0.3);">IN STOCK</span>
                            <div class="storefront-price">$${item.raw.price || 0}</div>
                        </div>
                        <div style="display:flex; gap:8px; width:100%;">
                            <button onclick="window.sys.openStorefrontDetails(${item.id})" style="flex:1; background:var(--theme-color); color:#fff; border:none; padding:8px 0; font-weight:bold; font-size:0.75rem; cursor:pointer; border-radius:4px; text-transform:uppercase; letter-spacing:1px; box-shadow:0 0 10px var(--theme-color)44;">VIEW SPECS</button>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    }

    workspace.innerHTML = html;
};