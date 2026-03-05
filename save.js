/* HARDWARE TYCOON: DATABASE & INVENTORY MANAGER
 * INCLUDES: Save System, Advanced Search, Sort, Filter, Edit Module, and Storefront UI
 */

const DB_KEY = "HT_DATA_V2"; 

window.sys = {
    // --- 1. CORE STORAGE ---
    load: function() {
        const data = localStorage.getItem(DB_KEY);
        return data ? JSON.parse(data) : { inventory: [] };
    },

    save: function(data) {
        localStorage.setItem(DB_KEY, JSON.stringify(data));
    },

    // --- 2. API ---
    saveDesign: function(type, specs) {
        const db = this.load();
        
        // Extract numeric score for sorting purposes
        let scoreVal = 0;
        if(specs.specs && specs.specs.Score) scoreVal = parseFloat(specs.specs.Score) || 0; // if "1200"
        if(scoreVal === 0 && typeof specs.specs.Score === 'string') scoreVal = parseFloat(specs.specs.Score.replace(/[^0-9.]/g, '')) || 0; // if "1200 pts"
        
        const newItem = {
            id: Date.now(),
            type: type,
            name: specs.name,
            active: true, // Currently selling
            specs: specs.specs, // The display strings
            raw: specs, // The raw math data
            date: new Date().toLocaleDateString(),
            year: specs.year,
            score: scoreVal
        };
        
        db.inventory.push(newItem);
        this.save(db);
        
        if(window.showToast) window.showToast(`RELEASED: ${newItem.name} is now on the market!`, 'success');
        else alert(`RELEASED: ${newItem.name} is now on the market!`);
        
        // Refresh specific architect view if open
        const moduleName = type.toLowerCase();
        if(window[moduleName] && window[moduleName].refreshLineup) {
            window[moduleName].refreshLineup();
        }
    },

    discontinue: function(id) {
        const db = this.load();
        const item = db.inventory.find(i => i.id === id);
        
        if (item) {
            item.active = false;
            this.save(db);
            
            if(window.showToast) window.showToast(`${item.name} has been discontinued.`, 'info');

            // Refresh views if visible
            if(window.currentView === 'inventory' && window.renderInventory) window.renderInventory();
            if(window.currentView === 'storefront' && window.renderStorefront) window.renderStorefront();
            
            // Refresh specific architect view
            const moduleName = item.type.toLowerCase();
            if(window[moduleName] && window[moduleName].refreshLineup) {
                window[moduleName].refreshLineup();
            }
        }
    },

    deleteDesign: function(id) {
        if(window.showConfirm) {
            window.showConfirm("Permanently delete this record? This cannot be undone.", () => {
                this._executeDelete(id);
            });
        } else if(confirm("Permanently delete this record? This cannot be undone.")) {
            this._executeDelete(id);
        }
    },

    _executeDelete: function(id) {
        const db = this.load();
        db.inventory = db.inventory.filter(item => item.id !== id);
        this.save(db);
        
        if(window.currentView === 'inventory' && window.renderInventory) window.renderInventory();
        if(window.currentView === 'storefront' && window.renderStorefront) window.renderStorefront();
        if(window.showToast) window.showToast('Product record deleted.', 'error');
    },

    // --- 3. EDIT SYSTEM ---
    openEditModal: function(id) {
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

        overlay.innerHTML = `
            <div class="confirm-dialog" style="transform: translateY(0); opacity: 1;">
                <h3 style="color: var(--accent); border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px;">Edit Product Metadata</h3>
                <p style="font-size: 0.8rem; color: #888; margin-bottom: 20px;">
                    Hardware specifications cannot be altered post-launch. You may update the marketing data below.
                </p>
                
                <div class="input-group">
                    <label>Product Name</label>
                    <input type="text" id="edit-name" value="${item.name}">
                </div>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                    <div class="input-group">
                        <label>Release Year</label>
                        <input type="number" id="edit-year" value="${item.year || item.raw.year}">
                    </div>
                    <div class="input-group">
                        <label>Retail Price ($)</label>
                        <input type="number" id="edit-price" value="${item.raw.price || 0}">
                    </div>
                </div>

                <div class="confirm-actions" style="margin-top: 20px;">
                    <button class="btn-cancel" onclick="document.getElementById('edit-modal-overlay').remove()">CANCEL</button>
                    <button class="btn-action" onclick="window.sys.saveEdit(${item.id})">SAVE CHANGES</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    },

    saveEdit: function(id) {
        const db = this.load();
        const itemIndex = db.inventory.findIndex(i => i.id === id);
        if (itemIndex === -1) return;

        const newName = document.getElementById('edit-name').value;
        const newYear = parseInt(document.getElementById('edit-year').value) || 0;
        const newPrice = parseFloat(document.getElementById('edit-price').value) || 0;

        // Apply changes
        db.inventory[itemIndex].name = newName;
        db.inventory[itemIndex].year = newYear;
        db.inventory[itemIndex].raw.name = newName;
        db.inventory[itemIndex].raw.year = newYear;
        db.inventory[itemIndex].raw.price = newPrice;

        this.save(db);
        document.getElementById('edit-modal-overlay').remove();

        if (window.showToast) window.showToast('Product updated successfully!', 'success');
        
        // Re-render views
        if(window.currentView === 'inventory' && window.renderInventory) window.renderInventory();
        if(window.currentView === 'storefront' && window.renderStorefront) window.renderStorefront();
        
        const moduleName = db.inventory[itemIndex].type.toLowerCase();
        if (window[moduleName] && window[moduleName].refreshLineup) {
            window[moduleName].refreshLineup();
        }
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
window.renderInventory = function() {
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
        switch(invState.sort) {
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

    listContainer.innerHTML = items.map(item => {
        // Color coding
        const typeColors = {
            'CPU': '#00aaff', 'GPU': '#76b900', 'RAM': '#ffaa00', 'Storage': '#ff4444',
            'Motherboard': '#888', 'Camera': '#00ffff', 'Display': '#ff00ff',
            'Desktop': '#bd00ff', 'Console': '#ff8800', 'Smartphone': '#00ffaa', 'Laptop': '#4488ff', 'Server': '#00ff88'
        };
        const accent = typeColors[item.type] || 'var(--accent)';
        const opacity = item.active ? 1 : 0.6;
        const statusBadge = item.active 
            ? `<span style="color:#00e676; font-size:0.65rem; font-weight:bold; border:1px solid rgba(0,230,118,0.3); background:rgba(0,230,118,0.1); padding:3px 6px; border-radius:4px;">ACTIVE</span>`
            : `<span style="color:#8b8d98; font-size:0.65rem; font-weight:bold; border:1px solid #3f414d; background:rgba(255,255,255,0.05); padding:3px 6px; border-radius:4px;">ARCHIVED</span>`;

        // Format Specs
        let specHtml = Object.entries(item.specs).map(([k,v]) => 
            `<div style="display:flex; justify-content:space-between; font-size:0.8rem; padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
                <span style="color:var(--text-muted); font-weight:600;">${k}</span>
                <span style="color:#fff; font-family:var(--font-mono);">${v}</span>
            </div>`
        ).join('');

        return `
            <div class="panel" style="--panel-color: ${accent}; opacity:${opacity}; display:flex; flex-direction:column;">
                <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:12px;">
                    <div>
                        <div style="font-size:0.7rem; color:${accent}; font-weight:800; letter-spacing:1px; text-transform:uppercase; margin-bottom:4px;">${item.type}</div>
                        <h3 style="margin:0; color:#fff; font-size:1.15rem; border:none; padding:0;">${item.name}</h3>
                        <div style="margin-top:6px;">${statusBadge}</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:1.2rem; color:var(--accent); font-family:var(--font-mono); font-weight:bold;">$${item.raw.price || 0}</div>
                        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:bold; margin-top:2px;">YEAR ${item.year || 'N/A'}</div>
                    </div>
                </div>
                
                <div style="flex:1; margin-bottom:20px; background:rgba(0,0,0,0.3); padding:10px 12px; border-radius:6px; border:1px solid var(--border-dim);">
                    ${specHtml}
                </div>

                <div style="display:flex; gap:8px; margin-top:auto;">
                    <button onclick="window.sys.openEditModal(${item.id})" 
                        style="flex:1; background:rgba(255,255,255,0.05); color:#fff; border:1px solid var(--border-light); padding:10px; font-weight:bold; font-size:0.75rem; cursor:pointer; border-radius:4px; transition:0.2s;">
                        EDIT
                    </button>
                    ${item.active ? 
                        `<button onclick="window.sys.discontinue(${item.id})" 
                            style="flex:1; background:rgba(255,23,68,0.1); color:#ff1744; border:1px solid rgba(255,23,68,0.3); padding:10px; font-weight:bold; font-size:0.75rem; cursor:pointer; border-radius:4px; transition:0.2s;">
                            DISCONTINUE
                        </button>` 
                        : `<button onclick="window.sys.deleteDesign(${item.id})" 
                            style="flex:1; background:transparent; color:var(--text-muted); border:1px solid var(--border-dim); padding:10px; font-weight:bold; font-size:0.75rem; cursor:pointer; border-radius:4px; transition:0.2s;">
                            DELETE
                        </button>`
                    }
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
window.updateInvState = function(key, val) {
    if(key === 'minScore' || key === 'minPrice') val = parseFloat(val);
    invState[key] = val;
    window.renderInventory();
};

window.toggleAdvFilter = function() {
    invState.advOpen = !invState.advOpen;
    window.renderInventory();
};

// --- 6. RENDER STOREFRONT (MARKETPLACE) ---
window.renderStorefront = function() {
    const workspace = document.getElementById('workspace');
    const db = window.sys.load();
    
    // 1. Filter only ACTIVE products
    const activeProducts = db.inventory.filter(i => i.active);

    // Empty State Check
    if (activeProducts.length === 0) {
        workspace.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon pulse" style="filter: none; text-shadow: 0 0 20px var(--accent);">🛒</div>
                <h2 class="empty-title">STOREFRONT EMPTY</h2>
                <p class="empty-desc">You currently have no products on the market.</p>
                <small>Navigate to the sidebar to begin R&D and launch a product.</small>
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
    // Just a fun aesthetic calc for "Company Valuation" based on product prices/scores
    const estValue = activeProducts.reduce((sum, item) => sum + (item.raw.price || 0) * (item.score || 100) * 10, 0);
    const formattedValue = estValue > 1000000 ? `$${(estValue/1000000).toFixed(1)}M` : `$${estValue.toLocaleString()}`;

    // 4. Color Mapping for UI
    const typeColors = {
        'CPU': '#00aaff', 'GPU': '#76b900', 'RAM': '#ffaa00', 'Storage': '#ff4444',
        'Motherboard': '#a1a1aa', 'Camera': '#00ffff', 'Display': '#ff00ff',
        'Desktop': '#bd00ff', 'Console': '#ff8800', 'Smartphone': '#00ffaa', 'Laptop': '#4488ff', 'Server': '#00ff88'
    };

    // 5. Build HTML
    let html = `
        <!-- Stats Glass Bar -->
        <div class="storefront-stats-bar">
            <div class="stat-block">
                <span class="stat-label">PRODUCTS ON MARKET</span>
                <span class="stat-value" style="color:#fff;">${totalProducts}</span>
            </div>
            <div class="stat-block">
                <span class="stat-label">ACTIVE DIVISIONS</span>
                <span class="stat-value" style="color:var(--accent);">${activeDivisions}</span>
            </div>
            <div class="stat-block">
                <span class="stat-label">EST. MARKET CAP</span>
                <span class="stat-value" style="color:#00e676;">${formattedValue}</span>
            </div>
        </div>
    `;

    // Iterate through each division
    for (const [type, group] of Object.entries(groups)) {
        const color = typeColors[type] || 'var(--accent)';
        
        // Sort items in the group by score descending (so Flagship is first)
        group.items.sort((a, b) => (b.score || 0) - (a.score || 0));

        html += `
            <div class="storefront-section">
                <h2 class="storefront-section-title" style="border-left: 4px solid ${color};">
                    ${type} LINEUP
                    <span class="storefront-section-count">${group.items.length} MODELS</span>
                </h2>
                <div class="storefront-grid">
        `;

        group.items.forEach(item => {
            const isFlagship = item.id === group.flagshipId;
            
            // Extract top 3 specs for the hero card
            const topSpecs = Object.entries(item.specs).slice(0, 3);
            const specsHtml = topSpecs.map(([k, v]) => `
                <div class="hero-spec">
                    <span class="hero-spec-label">${k}</span>
                    <span class="hero-spec-value">${v}</span>
                </div>
            `).join('');

            html += `
                <div class="storefront-card ${isFlagship ? 'flagship' : ''}" style="--theme-color: ${color};">
                    ${isFlagship ? `<div class="flagship-badge">🏆 FLAGSHIP</div>` : ''}
                    
                    <div class="storefront-card-header">
                        <div class="storefront-card-year">${item.year || ''}</div>
                        <h3 class="storefront-card-title">${item.name}</h3>
                    </div>

                    <div class="storefront-card-specs">
                        ${specsHtml}
                    </div>

                    <div class="storefront-card-footer">
                        <div class="storefront-price">$${item.raw.price || 0}</div>
                        <button class="storefront-edit-btn" onclick="window.sys.openEditModal(${item.id})">EDIT INFO</button>
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