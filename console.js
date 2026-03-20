/* HARDWARE TYCOON: CONSOLE ARCHITECT
 * PHYSICS ENGINE V1.0 (SoC Integration & Loss Leader Strategy)
 */

window.consoleArch = {

    // --- 1. GENERIC COMPONENTS ---
    chassis_opts: {
        'Handheld Shell': { type: 'Handheld', airflow: 1, cost: 15 },
        'Compact Box': { type: 'Home', airflow: 2, cost: 25 },
        'Standard Tower': { type: 'Home', airflow: 3, cost: 40 },
        'Dev Kit (Bulk)': { type: 'Dev', airflow: 5, cost: 80 }
    },

    controller_opts: {
        'Basic Pad': { features: 'Buttons', cost: 10 },
        'Analog Pro': { features: 'Joysticks', cost: 25 },
        'Haptic Elite': { features: 'Haptics+Screen', cost: 55 },
        'Integrated (Handheld)': { features: 'Attached', cost: 15 }
    },

    cooling_opts: {
        'Passive Heatspreader': { tdp: 15, cost: 5 },
        'Single Fan Blower': { tdp: 100, cost: 15 },
        'Vapor Chamber': { tdp: 200, cost: 45 },
        'Liquid Metal + Heavy Heatsink': { tdp: 350, cost: 70 }
    },

    // --- 2. RENDER UI ---
    render: function (container) {
        if (!container) return;
        const db = window.sys ? window.sys.load() : null;
        const currentYear = (db && db.gameTime) ? db.gameTime.year : 2010;

        container.innerHTML = `
            <div class="architect-container">
                
                <div class="panel">
                    <h3>Console Identity</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Model Name</label>
                            <select id="con-name-model" onchange="window.consoleArch.onModelChange()">
                                <!-- Populated dynamically -->
                            </select>
                            <input type="text" id="con-name-model-new" placeholder="New Model Name" style="display:none; margin-top:5px;">
                        </div>
                        <div class="input-group">
                            <label>Version Name</label>
                            <input type="text" id="con-name-version" value="360">
                        </div>
                    </div>
                    <div style="margin-top:10px;">
                        <label style="display:flex; align-items:center; gap:5px; font-size:0.8rem; color:#aaa; cursor:pointer;">
                            <input type="checkbox" id="con-hide-storefront"> Hide in Storefront
                        </label>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Form Factor</label>
                            <select id="con-case" onchange="window.consoleArch.updatePhysics()">
                                ${this.renderOptions(this.chassis_opts)}
                            </select>
                        </div>
                        <div style="display:none;" class="input-group">
                            <label>Launch Year</label>
                            <input type="number" id="con-year" value="${currentYear}">
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>Custom SoC (Silicon)</h3>
                    <div style="margin-bottom:10px; font-size:0.8rem; color:#888;">Select your custom CPU and GPU designs to fuse into one chip.</div>
                    
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>CPU Cores</label>
                            <select id="con-cpu" class="part-selector"></select>
                        </div>
                        <div class="input-group">
                            <label>GPU Graphics</label>
                            <select id="con-gpu" class="part-selector"></select>
                        </div>
                    </div>
                    <div class="input-group" style="margin-top:10px;">
                        <label>Motherboard</label>
                        <select id="con-mobo" class="part-selector"></select>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 2fr; gap:10px; margin-top:10px;">
                        <div class="input-group">
                            <label>GDDR Qty</label>
                            <select id="con-ram-qty">
                                <option value="1">1x Module</option>
                                <option value="2">2x Modules</option>
                                <option value="4">4x Modules</option>
                                <option value="8" selected>8x Modules</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Shared Memory (GDDR)</label>
                            <select id="con-ram" class="part-selector"></select>
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>User Experience</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                    <div style="display:grid; grid-template-columns: 1fr 2fr; gap:10px;">
                        <div class="input-group">
                            <label>Internal Storage Qty</label>
                            <select id="con-storage-qty">
                                <option value="1">1x Drive</option>
                                <option value="2">2x Drives</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Internal Storage</label>
                            <select id="con-storage" class="part-selector"></select>
                        </div>
                    </div>
                        <div class="input-group">
                            <label>Controller</label>
                            <select id="con-controller" onchange="window.consoleArch.updatePhysics()">
                                ${this.renderOptions(this.controller_opts)}
                            </select>
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>Engineering</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Thermal Solution</label>
                            <select id="con-cool" onchange="window.consoleArch.updatePhysics()">
                                ${this.renderOptions(this.cooling_opts)}
                            </select>
                        </div>
                        <div class="input-group">
                            <label>PSU Rating (W)</label>
                            <input type="number" id="con-psu" value="250" step="50">
                        </div>
                    </div>
                </div>

                <div class="panel" style="border-color: var(--accent-success);">
                    <h3>Launch Strategy</h3>
                    <div class="input-group">
                        <label>Retail Price ($)</label>
                        <input type="number" id="con-price" value="499">
                    </div>

                    <div style="margin-top:15px; background:rgba(0,0,0,0.3); padding:10px; border-radius:4px; margin-bottom:15px;">
                        <ul id="con-live-stats" style="list-style:none; padding:0; margin:0; font-size:0.8rem; color:#ccc;">
                            <li>Select parts...</li>
                        </ul>
                    </div>

                    <button class="btn-action" onclick="window.consoleArch.saveSystem()">
                        MASS PRODUCE & LAUNCH
                    </button>
                </div>

                <div class="panel" style="grid-column: 1 / -1; border-color: #444;">
                    <h3 style="border-bottom:1px solid #444; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                        Active Consoles
                        <button onclick="window.consoleArch.refreshLineup()" style="background:none; border:none; color:#888; cursor:pointer; font-size:0.7rem;">↻ Refresh</button>
                    </h3>
                    <div id="active-console-list" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap:10px;"></div>
                </div>

            </div>
        `;

        this.populatePartDropdowns();

        container.querySelectorAll('input, select').forEach(el => {
            el.addEventListener('change', () => this.updatePhysics());
            el.addEventListener('input', () => this.updatePhysics());
        });

        this.updatePhysics();
        this.refreshLineup();
        this.populateModelList();
    },

    populateModelList: function() {
        const select = document.getElementById('con-name-model');
        const newModelInput = document.getElementById('con-name-model-new');
        if (!select || !window.sys) return;
        const db = window.sys.load();
        const models = new Set();
        db.inventory.filter(i => i.type === 'Console').forEach(i => {
            if (i.raw && i.raw.modelName) models.add(i.raw.modelName);
        });
        
        let html = `<option value="NEW">+ Create New Model</option>`;
        Array.from(models).forEach(m => {
            html += `<option value="${m}">${m}</option>`;
        });
        select.innerHTML = html;
        
        // Auto-select "NEW" if no models exist
        if (models.size === 0) {
            select.value = "NEW";
            document.getElementById('con-name-model-new').style.display = 'block';
        }
    },

    onModelChange: function() {
        const modelSelect = document.getElementById('con-name-model');
        const newModelInput = document.getElementById('con-name-model-new');
        if (!modelSelect || !window.sys) return;
        
        const modelName = modelSelect.value;
        
        if (modelName === "NEW") {
            newModelInput.style.display = 'block';
            newModelInput.focus();
            return;
        } else {
            newModelInput.style.display = 'none';
        }
        
        const db = window.sys.load();
        
        const matches = db.inventory.filter(i => i.type === 'Console' && i.raw && i.raw.modelName === modelName);
        if (matches.length > 0) {
            matches.sort((a,b) => b.id - a.id);
            const latest = matches[0];
            this.loadBase(latest.raw);
            modelSelect.value = modelName; // Ensure the select is set correctly after loadBase might change it
            document.getElementById('con-name-version').value = "";
            if (window.showToast) window.showToast(`Auto-cloned specs from ${latest.name}`, "info");
        }
    },

    renderOptions: function (obj) {
        return Object.keys(obj).map(k => `<option value="${k}">${k}</option>`).join('');
    },

    loadBase: function (raw) {
        const set = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };
        const setCheck = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.checked = val; };

        const modelSelect = document.getElementById('con-name-model');
        const newModelInput = document.getElementById('con-name-model-new');
        
        if (raw.modelName) {
            let exists = false;
            for (let i = 0; i < modelSelect.options.length; i++) {
                if (modelSelect.options[i].value === raw.modelName) {
                    exists = true;
                    break;
                }
            }
            
            if (exists) {
                modelSelect.value = raw.modelName;
                newModelInput.style.display = 'none';
            } else {
                modelSelect.value = "NEW";
                newModelInput.style.display = 'block';
                newModelInput.value = raw.modelName;
            }
        } else {
            modelSelect.value = "NEW";
            newModelInput.style.display = 'block';
            newModelInput.value = raw.name;
        }

        set('con-name-version', raw.versionName || "");
        setCheck('con-hide-storefront', raw.hideStorefront);
        set('con-price', raw.price);
        if (raw.case) set('con-case', raw.case);
        if (raw.controller) set('con-controller', raw.controller);
        if (raw.cool) set('con-cool', raw.cool);
        if (raw.psu) set('con-psu', raw.psu);
        
        if (raw.components) {
            set('con-cpu', raw.components.cpu);
            set('con-gpu', raw.components.gpu);
            set('con-mobo', raw.components.mobo);
            set('con-ram', raw.components.ram);
            set('con-ram-qty', raw.components.ramQty || 1);
            set('con-storage', raw.components.storage);
            set('con-storage-qty', raw.components.stoQty || 1);
        }
        this.updatePhysics();
    },

    // --- 3. INVENTORY LINKING ---
    populatePartDropdowns: function () {
        if (!window.sys) return;
        const db = window.sys.load();

        const fill = (id, type) => {
            const el = document.getElementById(id);
            if (!el) return;
            const parts = db.inventory.filter(i => i.type.toLowerCase() === type.toLowerCase() && i.active === true);
            if (parts.length === 0) {
                if (type === 'GPU') {
                    el.innerHTML = `<option value="">Integrated Graphics (None)</option>`;
                } else {
                    el.innerHTML = `<option value="">No ${type}s Found</option>`;
                }
            } else {
                let html = parts.map(p => {
                    let extra = "";
                    if (type === 'Motherboard') extra = ` | ${p.specs.Form}`;
                    return `<option value="${p.id}">${p.name}${extra} ($${p.raw?.price || Math.floor(p.price) || 0})</option>`;
                }).join('');

                if (type === 'GPU') {
                    html = `<option value="">Integrated Graphics (None)</option>` + html;
                }

                el.innerHTML = html;

                el.value = parts[parts.length - 1].id;
            }
        };

        fill('con-cpu', 'CPU');
        fill('con-mobo', 'Motherboard');
        fill('con-gpu', 'GPU');
        fill('con-ram', 'RAM'); // In consoles, this is usually Unified Memory
        fill('con-storage', 'Storage');
    },

    // --- 4. PHYSICS ENGINE ---
    updatePhysics: function () {
        if (!window.sys) return;
        const db = window.sys.load();

        const getPart = (id) => {
            const val = document.getElementById(id).value;
            if (!val) return null;
            return db.inventory.find(i => i.id == val);
        };

        const cpu = getPart('con-cpu');
        const mobo = getPart('con-mobo');
        const gpu = getPart('con-gpu');
        const ram = getPart('con-ram');
        const sto = getPart('con-storage');

        const ramQty = parseInt(document.getElementById('con-ram-qty').value) || 1;
        const stoQty = parseInt(document.getElementById('con-storage-qty').value) || 1;

        const chassis = this.chassis_opts[document.getElementById('con-case').value];
        const controller = this.controller_opts[document.getElementById('con-controller').value];
        const cooler = this.cooling_opts[document.getElementById('con-cool').value];
        const psuWatts = parseFloat(document.getElementById('con-psu').value) || 0;

        // --- A. SoC POWER & HEAT ---
        // Consoles optimize power. We assume 85% of desktop TDP for the SoC integration.
        const cpuTDP = cpu ? (cpu.raw.tdp || 65) : 0;
        const gpuTDP = gpu ? (gpu.raw.tdp || 150) : 0;

        const socTDP = (cpuTDP + gpuTDP) * 0.85; // Optimization bonus
        const totalWatts = socTDP + 30 + (ramQty * 2) + (stoQty * 4); // 30W for board, drive, wifi, plus RAM/SSD modules

        let errors = [];

        if (mobo && mobo.raw.form !== 'Console Board') errors.push("Motherboard must be a Console Board Form Factor!");
        
        // Slot limit: Consoles have very tight integration. Max 10 slots typically (8 memory dies, 2 SSD slots).
        const moboSlots = 10; 
        const usedSlots = ramQty + stoQty;
        if (usedSlots > moboSlots) {
            errors.push(`Slot Limit Exceeded: Console board has limit of ${moboSlots} storage/memory modules, but ${usedSlots} are occupied.`);
        }

        if (totalWatts > psuWatts) errors.push(`PSU Weak: Needs ${Math.floor(totalWatts)}W, has ${psuWatts}W`);

        // Soft thermal penalty instead of hard error only
        let thermalPenalty = 0;
        if (socTDP > cooler.tdp) {
            thermalPenalty = Math.min(30, (socTDP - cooler.tdp) * 0.2);
            if (thermalPenalty >= 25) {
                errors.push(`Overheating: SoC is ${Math.floor(socTDP)}W, Cooler is ${cooler.tdp}W`);
            }
        }

        // --- B. PERFORMANCE SCORE ---
        let cpuScore = cpu ? (cpu.raw.benchmarks?.multiScore || 0) : 0;
        let gpuScore = gpu ? (gpu.raw.benchmarks?.score || 0) : 0;

        // Console "Optimization Magic" (consoles perform better than specs suggest)
        let consolePerf = (cpuScore + gpuScore) * 0.85 * (1 - thermalPenalty / 100);

        // --- C. COST & LOSS LEADER MATH ---
        const moboCost = mobo ? (mobo.raw.price || 0) : 0;
        const partsCost = (cpu?.raw.price || 0) + (gpu?.raw.price || 0) + ((ram?.raw.price || 0) * ramQty) + ((sto?.raw.price || 0) * stoQty) + moboCost;
        const manufacturingCost = Math.ceil(partsCost * 1.10);
        const sellPrice = parseFloat(document.getElementById('con-price').value) || 0;
        const profit = sellPrice - manufacturingCost;

        // Declared here so they're always available for the return statement
        const stratText = profit >= 0 ? "Hardware Profit" : "Loss Leader Strategy";
        const profitColor = profit >= 0 ? "#00ff88" : "#ff4444";

        // --- D. RENDER ---
        const display = document.getElementById('con-live-stats');
        if (display) {
            if (errors.length > 0) {
                display.innerHTML = errors.map(e => `<li style="color:#ff4444">❌ ${e}</li>`).join('');
            } else {
                display.innerHTML = `
                    <li style="display:flex; justify-content:space-between;"><span>SoC Power:</span> <b>${Math.floor(socTDP)}W</b></li>
                    <li style="display:flex; justify-content:space-between;"><span>Console Power:</span> <b>${Math.floor(consolePerf)} T-Ops</b></li>
                    <li style="border-top:1px solid #444; margin-top:5px; padding-top:5px; display:flex; justify-content:space-between;">
                        <span>Mfg Cost:</span> <span style="color:#aaa">$${Math.floor(manufacturingCost)}</span>
                    </li>
                    <li style="display:flex; justify-content:space-between;">
                        <span>Net Profit:</span> <b style="color:${profitColor}">$${Math.floor(profit)}</b>
                    </li>
                    <li style="text-align:right; font-size:0.7em; color:${profitColor}; opacity:0.8;">${stratText}</li>
                `;
            }
        }



        return { valid: errors.length === 0, manufacturingCost, consolePerf, errors, parts: { cpu, mobo, gpu, ram, sto }, stratText, profit };
    },

    scrapeData: function () {
        let modelName = document.getElementById('con-name-model').value;
        if (modelName === "NEW") {
            modelName = document.getElementById('con-name-model-new').value || "Custom";
        }
        const versionName = document.getElementById('con-name-version').value;
        const fullName = `${modelName} ${versionName}`.trim();
        const db = window.sys ? window.sys.load() : null;
        const currentYear = (db && db.gameTime) ? db.gameTime.year : 2010;
        return {
            modelName: modelName,
            versionName: versionName,
            name: fullName,
            hideStorefront: document.getElementById('con-hide-storefront') ? document.getElementById('con-hide-storefront').checked : false,
            year: currentYear,
            price: parseFloat(document.getElementById('con-price').value),
            case: document.getElementById('con-case') ? document.getElementById('con-case').value : '',
            controller: document.getElementById('con-controller') ? document.getElementById('con-controller').value : '',
            cool: document.getElementById('con-cool') ? document.getElementById('con-cool').value : '',
            psu: document.getElementById('con-psu') ? document.getElementById('con-psu').value : ''
        };
    },

    // --- 5. SAVE ---
    refreshLineup: function () {
        const container = document.getElementById('active-console-list');
        if (!container || !window.sys) return;

        const db = window.sys.load();
        const active = db.inventory.filter(i => i.type === 'Console' && i.active === true);

        if (active.length === 0) {
            container.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:#555; padding:10px;">No active Consoles.</div>`;
            return;
        }

        container.innerHTML = active.map(c => {
            const specs = c.specs || {};
            const isLoss = specs.Profit < 0;
            return `
            <div style="background:rgba(255,255,255,0.05); border:1px solid #333; padding:10px; border-radius:4px; display:flex; flex-direction:column; gap:5px;">
                <div style="font-weight:bold; color:var(--accent); font-size:0.9rem;">${c.name}</div>
                <div style="font-size:0.75rem; color:#aaa;">
                    <div>${specs.Perf}</div>
                    <div style="margin-top:2px; color:#fff; display:flex; justify-content:space-between;">
                        <span>$${c.raw?.price || 0}</span>
                        <span style="color:${isLoss ? '#ffaa00' : '#00ff88'}">${isLoss ? 'Loss Leader' : 'Profitable'}</span>
                    </div>
                </div>
                <div style="display:flex; gap:5px; margin-top:5px;">
                    <button onclick="window.cloneToArchitect(${c.id})" 
                        style="flex:1; background:rgba(0, 230, 118, 0.1); color:var(--accent-success); border:1px solid var(--accent-success); font-size:0.7rem; padding:4px; cursor:pointer; border-radius:3px;">
                        CLONE
                    </button>
                    ${c.raw && c.raw.hideStorefront ? 
                        `<button onclick="window.sys.toggleHide(${c.id})" style="flex:1; background:rgba(255, 255, 255, 0.1); color:#aaa; border:1px solid #444; font-size:0.7rem; padding:4px; cursor:pointer; border-radius:3px;">UNHIDE</button>` : 
                        `<button onclick="window.sys.toggleHide(${c.id})" style="flex:1; background:rgba(255, 255, 255, 0.1); color:#aaa; border:1px solid #444; font-size:0.7rem; padding:4px; cursor:pointer; border-radius:3px;">HIDE</button>`
                    }
                    <button onclick="window.sys.discontinue(${c.id})" 
                        style="flex:1; background:transparent; color:#ff4444; border:1px solid #522; font-size:0.7rem; padding:4px; cursor:pointer; border-radius:3px;">
                        DISCON.
                    </button>
                </div>
            </div>
            `;
        }).join('');
    },

    saveSystem: function () {
        const physics = this.updatePhysics();
        const meta = this.scrapeData();

        if (!physics.valid) {
            alert("CANNOT LAUNCH: " + physics.errors[0]);
            return;
        }

        const p = physics.parts;
        const ramQty = parseInt(document.getElementById('con-ram-qty').value) || 1;
        const stoQty = parseInt(document.getElementById('con-storage-qty').value) || 1;

        const specs = {
            "SoC": `${p.cpu ? p.cpu.name : 'Unknown'} + ${p.gpu ? p.gpu.name : 'Unknown'}`,
            "Memory": p.ram ? `${ramQty}x ${p.ram.specs.Capacity} Unified` : "None",
            "Perf": `${Math.floor(physics.consolePerf)} T-Ops`,
            "Strategy": physics.stratText,
            "Profit": physics.profit
        };

        window.sys.saveDesign('Console', {
            name: meta.name,
            year: meta.year,
            price: meta.price,
            specs: specs,
            components: {
                cpu: p.cpu?.id,
                gpu: p.gpu?.id,
                ram: p.ram?.id,
                ramQty: ramQty,
                mobo: p.mobo?.id,
                storage: p.sto?.id,
                stoQty: stoQty
            },
            ...meta
        });

        this.refreshLineup();
    }
};
