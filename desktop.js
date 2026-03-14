/* HARDWARE TYCOON: DESKTOP ARCHITECT
 * PHYSICS ENGINE V1.0 (System Integration, Compatibility & Bottlenecks)
 */

window.desktop = {

    // --- 1. GENERIC COMPONENTS (Chassis, PSU, Cooling) ---
    // Since we don't design these yet, we buy them from suppliers.
    chassis_opts: {
        'Office Mini': { type: 'ITX', airflow: 0, cost: 20 },
        'Standard ATX': { type: 'ATX', airflow: 1, cost: 40 },
        'Gaming Tower': { type: 'ATX', airflow: 2, cost: 80 },
        'E-ATX Super': { type: 'E-ATX', airflow: 3, cost: 150 },
        'Open Bench': { type: 'E-ATX', airflow: 5, cost: 200 }
    },

    psu_opts: {
        '300W Generic': { watts: 300, eff: 0.7, cost: 20 },
        '500W Bronze': { watts: 500, eff: 0.82, cost: 45 },
        '750W Gold': { watts: 750, eff: 0.90, cost: 90 },
        '1000W Platinum': { watts: 1000, eff: 0.92, cost: 150 },
        '1600W Titanium': { watts: 1600, eff: 0.96, cost: 300 }
    },

    cooling_opts: {
        'Stock Cooler': { tdp: 65, cost: 0 },
        'Air Tower': { tdp: 150, cost: 25 },
        'Dual Tower': { tdp: 250, cost: 50 },
        'AIO 240mm': { tdp: 300, cost: 80 },
        'AIO 360mm': { tdp: 400, cost: 120 },
        'Custom Loop': { tdp: 800, cost: 300 }
    },

    // --- 2. RENDER UI ---
    render: function (container) {
        if (!container) return;
        const currentYear = new Date().getFullYear();

        container.innerHTML = `
            <div class="architect-container">
                
                <div class="panel">
                    <h3>System Identity</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Model Name</label>
                            <select id="sys-name-model" onchange="window.desktop.onModelChange()">
                                <!-- Populated dynamically -->
                            </select>
                            <input type="text" id="sys-name-model-new" placeholder="New Model Name" style="display:none; margin-top:5px;">
                        </div>
                        <div class="input-group">
                            <label>Version Name</label>
                            <input type="text" id="sys-name-version" value="X1">
                        </div>
                    </div>
                    <div style="margin-top:10px;">
                        <label style="display:flex; align-items:center; gap:5px; font-size:0.8rem; color:#aaa; cursor:pointer;">
                            <input type="checkbox" id="sys-hide-storefront"> Hide in Storefront
                        </label>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Chassis Model</label>
                            <select id="sys-case" onchange="window.desktop.updatePhysics()">
                                ${this.renderOptions(this.chassis_opts)}
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Launch Year</label>
                            <input type="number" id="sys-year" value="${currentYear}">
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>Compute Core</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Processor (CPU)</label>
                            <select id="sys-cpu" class="part-selector"></select>
                        </div>
                        <div class="input-group">
                            <label>Motherboard</label>
                            <select id="sys-mobo" class="part-selector"></select>
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 2fr; gap:10px; margin-top:10px;">
                        <div class="input-group">
                            <label>RAM Qty</label>
                            <select id="sys-ram-qty">
                                <option value="1">1x Module</option>
                                <option value="2" selected>2x Modules</option>
                                <option value="4">4x Modules</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Memory (RAM)</label>
                            <select id="sys-ram" class="part-selector"></select>
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>Expansion</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Graphics (GPU)</label>
                            <select id="sys-gpu" class="part-selector"></select>
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 2fr; gap:10px;">
                            <div class="input-group">
                                <label>Drive Qty</label>
                                <select id="sys-storage-qty">
                                    <option value="1">1x Drive</option>
                                    <option value="2">2x Drives</option>
                                    <option value="3">3x Drives</option>
                                    <option value="4">4x Drives</option>
                                </select>
                            </div>
                            <div class="input-group">
                                <label>Primary Storage</label>
                                <select id="sys-storage" class="part-selector"></select>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>Power & Thermal</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Power Supply</label>
                            <select id="sys-psu" onchange="window.desktop.updatePhysics()">
                                ${this.renderOptions(this.psu_opts)}
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Thermal Solution</label>
                            <select id="sys-cool" onchange="window.desktop.updatePhysics()">
                                ${this.renderOptions(this.cooling_opts)}
                            </select>
                        </div>
                    </div>
                </div>

                <div class="panel" style="border-color: var(--accent-success);">
                    <h3>Validation & Launch</h3>
                    <div class="input-group">
                        <label>Retail Price ($)</label>
                        <input type="number" id="sys-price" value="1499">
                    </div>

                    <div style="margin-top:15px; background:rgba(0,0,0,0.3); padding:10px; border-radius:4px; margin-bottom:15px;">
                        <ul id="sys-live-stats" style="list-style:none; padding:0; margin:0; font-size:0.8rem; color:#ccc;">
                            <li>Select parts to begin simulation...</li>
                        </ul>
                    </div>

                    <button class="btn-action" onclick="window.desktop.saveSystem()">
                        ASSEMBLE & SHIP
                    </button>
                </div>

                <div class="panel" style="grid-column: 1 / -1; border-color: #444;">
                    <h3 style="border-bottom:1px solid #444; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                        Active Desktops
                        <button onclick="window.desktop.refreshLineup()" style="background:none; border:none; color:#888; cursor:pointer; font-size:0.7rem;">↻ Refresh</button>
                    </h3>
                    <div id="active-desktop-list" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap:10px;"></div>
                </div>

            </div>
        `;

        this.populatePartDropdowns();

        // Bind Events
        container.querySelectorAll('input, select').forEach(el => {
            el.addEventListener('change', () => this.updatePhysics());
            el.addEventListener('input', () => this.updatePhysics());
        });

        this.updatePhysics();
        this.refreshLineup();
        this.populateModelList();
    },

    populateModelList: function() {
        const select = document.getElementById('sys-name-model');
        const newModelInput = document.getElementById('sys-name-model-new');
        if (!select || !window.sys) return;
        const db = window.sys.load();
        const models = new Set();
        db.inventory.filter(i => i.type === 'Desktop').forEach(i => {
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
            document.getElementById('sys-name-model-new').style.display = 'block';
        }
    },

    onModelChange: function() {
        const modelSelect = document.getElementById('sys-name-model');
        const newModelInput = document.getElementById('sys-name-model-new');
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
        
        const matches = db.inventory.filter(i => i.type === 'Desktop' && i.raw && i.raw.modelName === modelName);
        if (matches.length > 0) {
            matches.sort((a,b) => b.id - a.id);
            const latest = matches[0];
            this.loadBase(latest.raw);
            modelSelect.value = modelName; // Ensure the select remains on the chosen model
            document.getElementById('sys-name-version').value = ""; // Clear version for new clone
            if (window.showToast) window.showToast(`Auto-cloned specs from ${latest.name}`, "info");
        }
    },

    // --- HELPER: Render Simple Options ---
    renderOptions: function (obj) {
        return Object.keys(obj).map(k => `<option value="${k}">${k}</option>`).join('');
    },

    loadBase: function (raw) {
        const set = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };
        const setCheck = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.checked = val; };

        const modelSelect = document.getElementById('sys-name-model');
        const newModelInput = document.getElementById('sys-name-model-new');
        
        if (raw.modelName) {
            // Check if the model exists in the dropdown (which we just populated)
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
            newModelInput.value = raw.name; // Fallback to raw.name if modelName is missing
        }

        set('sys-name-version', raw.versionName || "");
        setCheck('sys-hide-storefront', raw.hideStorefront);
        set('sys-year', raw.year);
        set('sys-price', raw.price);
        if (raw.case) set('sys-case', raw.case);
        if (raw.psu) set('sys-psu', raw.psu);
        if (raw.cool) set('sys-cool', raw.cool);
        
        if (raw.components) {
            set('sys-cpu', raw.components.cpu);
            set('sys-gpu', raw.components.gpu);
            set('sys-mobo', raw.components.mobo);
            set('sys-ram', raw.components.ram);
            set('sys-ram-qty', raw.components.ramQty || 1);
            set('sys-storage', raw.components.storage);
            set('sys-storage-qty', raw.components.stoQty || 1);
        }
        this.updatePhysics();
    },

    // --- 3. INVENTORY LINKING ---
    populatePartDropdowns: function () {
        if (!window.sys) return;
        const db = window.sys.load();

        // Helper to fill a specific dropdown
        const fill = (id, type) => {
            const el = document.getElementById(id);
            if (!el) return;

            // Get all active parts of this type
            const parts = db.inventory.filter(i => i.type.toLowerCase() === type.toLowerCase() && i.active === true);

            if (parts.length === 0) {
                if (type === 'GPU') {
                    el.innerHTML = `<option value="">Integrated Graphics (None)</option>`;
                } else {
                    el.innerHTML = `<option value="">No ${type}s Found</option>`;
                }
            } else {
                let html = parts.map(p => {
                    return `<option value="${p.id}">${p.name} ($${p.raw?.price || 0})</option>`;
                }).join('');

                if (type === 'GPU') {
                    html = `<option value="">Integrated Graphics (None)</option>` + html;
                }

                el.innerHTML = html;

                el.value = parts[parts.length - 1].id;
            }
        };

        fill('sys-cpu', 'CPU');
        fill('sys-mobo', 'Motherboard');
        fill('sys-ram', 'RAM');
        fill('sys-gpu', 'GPU');
        fill('sys-storage', 'Storage');
    },

    // --- 4. PHYSICS & COMPATIBILITY ENGINE ---
    updatePhysics: function () {
        if (!window.sys) return;
        const db = window.sys.load();

        // 1. FETCH SELECTED PARTS
        const getPart = (id) => {
            const val = document.getElementById(id).value;
            if (!val) return null;
            return db.inventory.find(i => i.id == val);
        };

        const cpu = getPart('sys-cpu');
        const mobo = getPart('sys-mobo');
        const ram = getPart('sys-ram');
        const gpu = getPart('sys-gpu');
        const sto = getPart('sys-storage');

        const ramQty = parseInt(document.getElementById('sys-ram-qty').value) || 1;
        const stoQty = parseInt(document.getElementById('sys-storage-qty').value) || 1;

        // Fetch Generic Parts
        const chassis = this.chassis_opts[document.getElementById('sys-case').value];
        const psu = this.psu_opts[document.getElementById('sys-psu').value];
        const cooler = this.cooling_opts[document.getElementById('sys-cool').value];

        // 2. COMPATIBILITY CHECKS
        let errors = [];

        // Socket Check
        if (cpu && mobo) {
            if (cpu.raw.socket !== mobo.raw.socket) errors.push(`Socket Mismatch: CPU (${cpu.raw.socket}) vs Mobo (${mobo.raw.socket})`);
        }

        // RAM Generation Check
        if (ram && mobo) {
            // mobo.raw.ram might be "DDR5", ram.raw.gen might be "DDR5"
            // We need to handle potential naming diffs, but assuming consistency based on previous files
            if (mobo.raw.ram !== ram.raw.gen) errors.push(`RAM Incompatible: Mobo needs ${mobo.raw.ram}, got ${ram.raw.gen}`);
        }

        // Form Factor Check
        if (mobo) {
            // Simple size hierarchy: ITX < mATX < ATX < E-ATX
            const sizes = { 'ITX': 1, 'mATX': 2, 'ATX': 3, 'E-ATX': 4 };
            const caseSize = sizes[chassis.type] || 0;
            const moboSize = sizes[mobo.raw.form] || 0;

            if (moboSize > caseSize) errors.push(`Fit Issue: ${mobo.raw.form} mobo won't fit in ${chassis.type} case`);
            
            // Slot Limit Check
            const moboSlots = { 'ITX': 2, 'mATX': 4, 'ATX': 7, 'E-ATX': 8 }[mobo.raw.form] || 3;
            const usedSlots = (gpu ? 1 : 0) + ramQty + stoQty;
            if (usedSlots > moboSlots) {
                errors.push(`Slot Limit Exceeded: Motherboard has ${moboSlots} slots, but ${usedSlots} parts are installed (1 GPU + ${ramQty} RAM + ${stoQty} SSDs).`);
            }
        }

        // 3. POWER & THERMALS
        // Summing TDPs (fallback to 0 if part missing)
        const cpuTDP = cpu ? (cpu.raw.tdp || 65) : 0;
        const gpuTDP = gpu ? (gpu.raw.tdp || 150) : 0; // GPU might not have tdp in raw if old version, assume safe default
        const sysOverhead = 50 + (ramQty * 3) + (stoQty * 5); // Fans, drives, mobo, ram

        const totalWatts = cpuTDP + gpuTDP + sysOverhead;
        const psuWatts = psu ? psu.watts : 0;

        let powerStatus = "Good";
        let powerColor = "var(--accent-success)";

        if (totalWatts > psuWatts) {
            errors.push(`Power Failure: Needs ${totalWatts}W, PSU is ${psuWatts}W`);
            powerStatus = "CRITICAL FAILURE";
            powerColor = "#ff4444";
        } else if (totalWatts > psuWatts * 0.9) {
            powerStatus = "Strained (>90%)";
            powerColor = "#ffaa00";
        }

        // Cooling Check
        const totalHeat = cpuTDP; // GPU usually cools itself, case airflow helps both
        // Cooler TDP is for CPU.
        const coolingCap = (cooler ? cooler.tdp : 0) + (chassis ? chassis.airflow * 10 : 0);

        let thermalStatus = "Cool";
        if (cpuTDP > coolingCap) {
            thermalStatus = "CPU Throttling";
            errors.push("Thermal Throttle: CPU Cooler insufficient");
        }

        // 4. PERFORMANCE & BOTTLENECK
        let cpuScore = cpu ? (cpu.raw.benchmarks?.multiScore || 0) : 0;
        let gpuScore = gpu ? (gpu.raw.benchmarks?.score || 0) : 0;

        // Simple Bottleneck Logic
        // If GPU score is huge but CPU score is tiny, throttle GPU.
        let bottleneck = 0;
        let effectivePerf = 0;

        if (gpuScore > 0 && cpuScore > 0) {
            // Ratio. A balanced gaming PC might have GPU score ~ 1.5x CPU score (arbitrary game scale)
            // If GPU is 5x CPU, CPU is bottleneck.
            const ratio = gpuScore / cpuScore;

            if (ratio > 3.0) {
                bottleneck = (ratio - 3.0) * 10; // % penalty
                if (bottleneck > 50) bottleneck = 50;
                effectivePerf = (cpuScore * 3) + (gpuScore * (1 - (bottleneck / 100)));
            } else {
                effectivePerf = cpuScore + gpuScore;
            }
        }

        // 5. COST ANALYSIS
        const partsCost = (cpu?.raw.price || 0) + (gpu?.raw.price || 0) + ((ram?.raw.price || 0) * ramQty) + ((sto?.raw.price || 0) * stoQty) + (mobo?.raw.price || 0);
        const totalCost = Math.ceil(partsCost * 1.10);

        const sellPrice = parseFloat(document.getElementById('sys-price').value) || 0;
        const profit = sellPrice - totalCost;

        // 6. RENDER STATS
        const display = document.getElementById('sys-live-stats');
        if (display) {
            if (errors.length > 0) {
                display.innerHTML = errors.map(e => `<li style="color:#ff4444">❌ ${e}</li>`).join('');
            } else {
                display.innerHTML = `
                    <li style="display:flex; justify-content:space-between;"><span>Total Power:</span> <b>${totalWatts}W / ${psuWatts}W</b></li>
                    <li style="display:flex; justify-content:space-between;"><span>Thermal Headroom:</span> <b>${(coolingCap - cpuTDP)}W</b></li>
                    <li style="display:flex; justify-content:space-between;"><span>Bottleneck:</span> <b style="color:${bottleneck > 0 ? '#ffaa00' : '#00ff88'}">${bottleneck.toFixed(1)}%</b></li>
                    <li style="display:flex; justify-content:space-between;"><span>Performance:</span> <b style="color:var(--accent)">${Math.floor(effectivePerf)} pts</b></li>
                    <li style="border-top:1px solid #444; margin-top:5px; padding-top:5px; display:flex; justify-content:space-between;">
                        <span>Mfg Cost:</span> <span style="color:#aaa">$${totalCost}</span>
                    </li>
                    <li style="display:flex; justify-content:space-between;">
                        <span>Net Profit:</span> <b style="color:${profit > 0 ? '#00ff88' : '#ff4444'}">$${profit}</b>
                    </li>
                `;
            }
        }

        return { valid: errors.length === 0, totalCost, effectivePerf, errors, parts: { cpu, mobo, ram, gpu, sto, chassis, psu, cooler } };
    },

    scrapeData: function () {
        let modelName = document.getElementById('sys-name-model').value;
        if (modelName === "NEW") {
            modelName = document.getElementById('sys-name-model-new').value || "Custom";
        }
        const versionName = document.getElementById('sys-name-version').value;
        const fullName = `${modelName} ${versionName}`.trim();

        return {
            modelName: modelName,
            versionName: versionName,
            name: fullName,
            hideStorefront: document.getElementById('sys-hide-storefront') ? document.getElementById('sys-hide-storefront').checked : false,
            year: parseFloat(document.getElementById('sys-year').value),
            price: parseFloat(document.getElementById('sys-price').value),
            case: document.getElementById('sys-case') ? document.getElementById('sys-case').value : '',
            psu: document.getElementById('sys-psu') ? document.getElementById('sys-psu').value : '',
            cool: document.getElementById('sys-cool') ? document.getElementById('sys-cool').value : ''
        };
    },

    // --- 5. SAVE & LAUNCH ---
    refreshLineup: function () {
        const container = document.getElementById('active-desktop-list');
        if (!container || !window.sys) return;

        const db = window.sys.load();
        const active = db.inventory.filter(i => i.type === 'Desktop' && i.active === true);

        if (active.length === 0) {
            container.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:#555; padding:10px;">No active Desktops.</div>`;
            return;
        }

        container.innerHTML = active.map(pc => {
            const specs = pc.specs || {};
            return `
            <div style="background:rgba(255,255,255,0.05); border:1px solid #333; padding:10px; border-radius:4px; display:flex; flex-direction:column; gap:5px;">
                <div style="font-weight:bold; color:var(--accent); font-size:0.9rem;">${pc.name}</div>
                <div style="font-size:0.75rem; color:#aaa;">
                    <div>${specs.CPU}</div>
                    <div>${specs.GPU}</div>
                    <div style="margin-top:2px; color:#fff; display:flex; justify-content:space-between;">
                        <span>$${pc.raw?.price || 0}</span>
                        <span style="color:${specs.Profit > 0 ? '#00ff88' : '#f55'}">Profit: $${specs.Profit}</span>
                    </div>
                </div>
                <div style="display:flex; gap:5px; margin-top:5px;">
                    <button onclick="window.cloneToArchitect(${pc.id})" 
                        style="flex:1; background:rgba(0, 230, 118, 0.1); color:var(--accent-success); border:1px solid var(--accent-success); font-size:0.7rem; padding:4px; cursor:pointer; border-radius:3px;">
                        CLONE
                    </button>
                    ${pc.raw && pc.raw.hideStorefront ? 
                        `<button onclick="window.sys.toggleHide(${pc.id})" style="flex:1; background:rgba(255, 255, 255, 0.1); color:#aaa; border:1px solid #444; font-size:0.7rem; padding:4px; cursor:pointer; border-radius:3px;">UNHIDE</button>` : 
                        `<button onclick="window.sys.toggleHide(${pc.id})" style="flex:1; background:rgba(255, 255, 255, 0.1); color:#aaa; border:1px solid #444; font-size:0.7rem; padding:4px; cursor:pointer; border-radius:3px;">HIDE</button>`
                    }
                    <button onclick="window.sys.discontinue(${pc.id})" 
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

        // Gather names for the spec sheet
        const p = physics.parts;
        const ramQty = parseInt(document.getElementById('sys-ram-qty').value) || 1;
        const stoQty = parseInt(document.getElementById('sys-storage-qty').value) || 1;

        const specs = {
            "CPU": p.cpu ? p.cpu.name : "None",
            "GPU": p.gpu ? p.gpu.name : "Integrated",
            "RAM": p.ram ? `${ramQty}x ${p.ram.name}` : "None",
            "Storage": p.sto ? `${stoQty}x ${p.sto.name}` : "None",
            "Score": Math.floor(physics.effectivePerf),
            "Cost": physics.totalCost,
            "Profit": meta.price - physics.totalCost
        };

        window.sys.saveDesign('Desktop', {
            name: meta.name,
            year: meta.year,
            price: meta.price,
            specs: specs,
            // Save IDs of components so we can reference them later if needed
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
