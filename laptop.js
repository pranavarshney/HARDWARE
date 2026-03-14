/* HARDWARE TYCOON: LAPTOP ARCHITECT
 * PHYSICS ENGINE V1.0 (Thermals vs Portability & Battery Life)
 */

window.laptop = {

    // --- 1. GENERIC COMPONENTS ---
    chassis_opts: {
        'Plastic Budget': { type: 'Standard', weight: 2.5, cooling: 45, cost: 20 },
        'Aluminum Ultrabook': { type: 'Thin', weight: 1.2, cooling: 28, cost: 80 },
        'Magnesium Business': { type: 'Thin', weight: 1.0, cooling: 35, cost: 120 },
        'Gaming Plastic': { type: 'Thick', weight: 3.0, cooling: 120, cost: 60 },
        'Gaming Metal': { type: 'Thick', weight: 3.5, cooling: 180, cost: 150 },
        'Workstation Brick': { type: 'Huge', weight: 4.5, cooling: 250, cost: 200 }
    },

    // Battery is now a dynamic input, no longer preset options

    keyboard_opts: {
        'Membrane': { type: 'Basic', height: 0, cost: 5 },
        'Scissor Switch': { type: 'Slim', height: 1, cost: 15 },
        'Mechanical (Low Profile)': { type: 'Clicky', height: 3, cost: 40 },
        'Optical Mech': { type: 'Speed', height: 4, cost: 60 }
    },

    // --- 2. RENDER UI ---
    render: function (container) {
        if (!container) return;
        const currentYear = new Date().getFullYear();

        container.innerHTML = `
            <div class="architect-container">
                
                <div class="panel">
                    <h3>Model Identity</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Model Name</label>
                            <select id="lap-name-model" onchange="window.laptop.onModelChange()">
                                <!-- Populated dynamically -->
                            </select>
                            <input type="text" id="lap-name-model-new" placeholder="New Model Name" style="display:none; margin-top:5px;">
                        </div>
                        <div class="input-group">
                            <label>Version Name</label>
                            <input type="text" id="lap-name-version" value="Pro">
                        </div>
                    </div>
                    <div style="margin-top:10px;">
                        <label style="display:flex; align-items:center; gap:5px; font-size:0.8rem; color:#aaa; cursor:pointer;">
                            <input type="checkbox" id="lap-hide-storefront"> Hide in Storefront
                        </label>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Chassis Type</label>
                            <select id="lap-chassis" onchange="window.laptop.updatePhysics()">
                                ${this.renderOptions(this.chassis_opts)}
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Launch Year</label>
                            <input type="number" id="lap-year" value="${currentYear}">
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>User Interface</h3>
                    <div class="input-group">
                        <label>Display Panel</label>
                        <select id="lap-display" class="part-selector"></select>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px;">
                        <div class="input-group">
                            <label>Webcam</label>
                            <select id="lap-camera" class="part-selector"></select>
                        </div>
                        <div class="input-group">
                            <label>Keyboard Tech</label>
                            <select id="lap-key" onchange="window.laptop.updatePhysics()">
                                ${this.renderOptions(this.keyboard_opts)}
                            </select>
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>Compute Core</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Processor (CPU)</label>
                            <select id="lap-cpu" class="part-selector"></select>
                        </div>
                        <div class="input-group">
                            <label>Graphics (GPU)</label>
                            <select id="lap-gpu" class="part-selector"></select>
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px;">
                        <div class="input-group">
                            <label>Motherboard</label>
                            <select id="lap-mobo" class="part-selector"></select>
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 2fr; gap:10px;">
                            <div class="input-group">
                                <label>RAM Qty</label>
                                <select id="lap-ram-qty">
                                    <option value="1">1x Module</option>
                                    <option value="2" selected>2x Modules</option>
                                    <option value="4">4x Modules</option>
                                </select>
                            </div>
                            <div class="input-group">
                                <label>Memory (RAM)</label>
                                <select id="lap-ram" class="part-selector"></select>
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 2fr; gap:10px;">
                            <div class="input-group">
                                <label>Drive Qty</label>
                                <select id="lap-storage-qty">
                                    <option value="1">1x Drive</option>
                                    <option value="2">2x Drives</option>
                                    <option value="3">3x Drives</option>
                                </select>
                            </div>
                            <div class="input-group">
                                <label>Storage</label>
                                <select id="lap-storage" class="part-selector"></select>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>Power & Mobility</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Battery Capacity (Wh)</label>
                            <input type="number" id="lap-bat" value="50" min="20" max="150" onchange="window.laptop.updatePhysics()">
                        </div>
                        <div class="input-group">
                            <label>Charger (Watts)</label>
                            <input type="number" id="lap-charger" value="65" step="5">
                        </div>
                    </div>
                </div>

                <div class="panel" style="border-color: var(--accent-success);">
                    <h3>Market Launch</h3>
                    <div class="input-group">
                        <label>Retail Price ($)</label>
                        <input type="number" id="lap-price" value="1299">
                    </div>

                    <div style="margin-top:15px; background:rgba(0,0,0,0.3); padding:10px; border-radius:4px; margin-bottom:15px;">
                        <ul id="lap-live-stats" style="list-style:none; padding:0; margin:0; font-size:0.8rem; color:#ccc;">
                            <li>Select parts...</li>
                        </ul>
                    </div>

                    <button class="btn-action" onclick="window.laptop.saveSystem()">
                        ASSEMBLE & SHIP
                    </button>
                </div>

                <div class="panel" style="grid-column: 1 / -1; border-color: #444;">
                    <h3 style="border-bottom:1px solid #444; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                        Active Laptops
                        <button onclick="window.laptop.refreshLineup()" style="background:none; border:none; color:#888; cursor:pointer; font-size:0.7rem;">↻ Refresh</button>
                    </h3>
                    <div id="active-laptop-list" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap:10px;"></div>
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
        const select = document.getElementById('lap-name-model');
        const newModelInput = document.getElementById('lap-name-model-new');
        if (!select || !window.sys) return;
        const db = window.sys.load();
        const models = new Set();
        db.inventory.filter(i => i.type === 'Laptop').forEach(i => {
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
            document.getElementById('lap-name-model-new').style.display = 'block';
        }
    },

    onModelChange: function() {
        const modelSelect = document.getElementById('lap-name-model');
        const newModelInput = document.getElementById('lap-name-model-new');
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
        
        const matches = db.inventory.filter(i => i.type === 'Laptop' && i.raw && i.raw.modelName === modelName);
        if (matches.length > 0) {
            matches.sort((a,b) => b.id - a.id);
            const latest = matches[0];
            this.loadBase(latest.raw);
            modelSelect.value = modelName; // Ensure the select stays on the chosen model
            document.getElementById('lap-name-version').value = "";
            if (window.showToast) window.showToast(`Auto-cloned specs from ${latest.name}`, "info");
        }
    },

    renderOptions: function (obj) {
        return Object.keys(obj).map(k => `<option value="${k}">${k}</option>`).join('');
    },

    loadBase: function (raw) {
        const set = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };
        const setCheck = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.checked = val; };

        const modelSelect = document.getElementById('lap-name-model');
        const newModelInput = document.getElementById('lap-name-model-new');
        
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

        set('lap-name-version', raw.versionName || "");
        setCheck('lap-hide-storefront', raw.hideStorefront);
        set('lap-year', raw.year);
        set('lap-price', raw.price);
        if (raw.chassis) set('lap-chassis', raw.chassis);
        if (raw.bat) set('lap-bat', raw.bat);
        if (raw.charger) set('lap-charger', raw.charger);
        if (raw.key) set('lap-key', raw.key);

        if (raw.components) {
            set('lap-cpu', raw.components.cpu);
            set('lap-gpu', raw.components.gpu);
            set('lap-mobo', raw.components.mobo);
            set('lap-ram', raw.components.ram);
            set('lap-ram-qty', raw.components.ramQty || 1);
            set('lap-storage', raw.components.storage);
            set('lap-storage-qty', raw.components.stoQty || 1);
            set('lap-display', raw.components.disp);
            set('lap-camera', raw.components.cam);
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

            // Get all active parts of this type
            const parts = db.inventory.filter(i => i.type.toLowerCase() === type.toLowerCase() && i.active === true);

            if (parts.length === 0) {
                // Special handling for Optional GPU
                if (type === 'GPU') {
                    el.innerHTML = `<option value="">Integrated Graphics (None)</option>`;
                } else {
                    el.innerHTML = `<option value="">No ${type}s</option>`;
                }
            } else {
                let html = parts.map(p => {
                    let extra = "";
                    if (type === 'Display') extra = ` | ${p.specs.Resolution} ${p.specs.HDR}`;
                    if (type === 'Motherboard') extra = ` | ${p.specs.Form}`;
                    return `<option value="${p.id}">${p.name}${extra} ($${p.raw?.price || Math.floor(p.price) || 0})</option>`;
                }).join('');

                // For GPU, add an "Integrated" option at the top
                if (type === 'GPU') {
                    html = `<option value="">Integrated Graphics Only</option>` + html;
                }

                el.innerHTML = html;

                el.value = parts[parts.length - 1].id;
            }
        };

        fill('lap-cpu', 'CPU');
        fill('lap-mobo', 'Motherboard');
        fill('lap-gpu', 'GPU');
        fill('lap-ram', 'RAM');
        fill('lap-storage', 'Storage');
        fill('lap-display', 'Display');
        fill('lap-camera', 'Camera');
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

        // Get Components
        const cpu = getPart('lap-cpu');
        const mobo = getPart('lap-mobo');
        const gpu = getPart('lap-gpu');
        const ram = getPart('lap-ram');
        const sto = getPart('lap-storage');
        const disp = getPart('lap-display');
        const cam = getPart('lap-camera');

        const ramQty = parseInt(document.getElementById('lap-ram-qty').value) || 1;
        const stoQty = parseInt(document.getElementById('lap-storage-qty').value) || 1;

        // Get Chassis & Power
        const chassisKey = document.getElementById('lap-chassis').value;
        const chassis = this.chassis_opts[chassisKey];

        const batCapacity = parseFloat(document.getElementById('lap-bat').value) || 50;
        const battery = { wh: batCapacity, weight: batCapacity * 0.005, cost: batCapacity * 0.5 };

        const keyKey = document.getElementById('lap-key').value;
        const keyboard = this.keyboard_opts[keyKey];

        const chargerWatts = parseFloat(document.getElementById('lap-charger').value) || 45;

        // --- A. POWER CONSUMPTION & THERMALS ---
        const cpuTDP = cpu ? (cpu.raw.tdp || 45) : 15;
        const gpuTDP = gpu ? (gpu.raw.tdp || 50) : 0;

        // Laptop Thermal Reality:
        // A "Thick" gaming chassis can dissipate ~180W. An "Ultrabook" only ~28W.
        // If CPU+GPU > Cooling, we throttle.
        const totalHeat = cpuTDP + gpuTDP;
        const coolingCap = chassis.cooling;

        let throttle = 1.0;
        let thermalStatus = "Optimal";

        if (totalHeat > coolingCap) {
            throttle = coolingCap / totalHeat;
            thermalStatus = `Throttling (-${((1 - throttle) * 100).toFixed(0)}%)`;
        }

        // --- B. BATTERY LIFE ---
        // Usage Scenario: Mixed Productivity (CPU low, GPU off, Screen 50%)
        // Display Power:
        let dispPwr = 2.0; // Base panel power
        if (disp) {
            const area = (disp.raw.w * disp.raw.h) / 2000000;
            // High refresh rate eats battery
            const hzFactor = disp.raw.hz / 60;
            dispPwr = area * (disp.raw.nits / 100) * (hzFactor * 0.5);
        }

        // Idle / Light Load Power
        const cpuIdle = cpuTDP * 0.15; // Modern CPUs idle well
        const sysOverhead = 3.0 + (ramQty * 1.5) + (stoQty * 2.0); // WiFi, RAM, NVMe
        const avgLoad = cpuIdle + dispPwr + sysOverhead;

        // Gaming Load Power (for Charger check)
        const peakLoad = (totalHeat * throttle) + dispPwr + sysOverhead + 10;

        // Life Calculation
        const batteryLife = battery.wh / avgLoad;

        // Charger Check
        let chargeStatus = "Good";
        if (peakLoad > chargerWatts) chargeStatus = "Drains under load";

        // --- C. PORTABILITY & WEIGHT ---
        // Base weight + Parts
        let totalWeight = chassis.weight + battery.weight;
        if (gpu) totalWeight += 0.2; // Dedicated GPU adds cooling weight
        if (chassis.type === 'Thick') totalWeight += 0.3; // Heatsinks

        // --- D. PERFORMANCE SCORE ---
        let cpuScore = cpu ? (cpu.raw.benchmarks?.multiScore || 0) : 0;
        let gpuScore = gpu ? (gpu.raw.benchmarks?.score || 0) : 0;

        const effectivePerf = (cpuScore + gpuScore) * throttle;

        // --- E. COST & PROFIT ---
        const moboCost = mobo ? (mobo.raw.price || 0) : 0;
        const partsCost = (cpu?.raw.price || 0) + (gpu?.raw.price || 0) + ((ram?.raw.price || 0) * ramQty) + ((sto?.raw.price || 0) * stoQty) + (cam?.raw.price || 0) + (disp?.raw.price || 0) + moboCost + battery.cost + chassis.cost;
        const totalCost = Math.ceil(partsCost * 1.10);
        const sellPrice = parseFloat(document.getElementById('lap-price').value) || 0;
        const profit = sellPrice - totalCost;

        // --- F. RENDER ---
        const display = document.getElementById('lap-live-stats');
        if (display) {
            let lifeColor = batteryLife > 8 ? "#00ff88" : (batteryLife > 4 ? "#ffaa00" : "#ff4444");
            let thermColor = throttle < 0.8 ? "#ff4444" : (throttle < 1.0 ? "#ffaa00" : "#888");

            display.innerHTML = `
                <li style="display:flex; justify-content:space-between;"><span>Battery Life:</span> <b style="color:${lifeColor}">${batteryLife.toFixed(1)} Hrs</b> <span style="font-size:0.7em">(Mixed Usage)</span></li>
                <li style="display:flex; justify-content:space-between;"><span>Thermals:</span> <b style="color:${thermColor}">${thermalStatus}</b> <span style="font-size:0.7em">(${Math.floor(totalHeat * throttle)}W / ${coolingCap}W Cap)</span></li>
                <li style="display:flex; justify-content:space-between;"><span>Weight:</span> <b>${totalWeight.toFixed(2)} kg</b></li>
                <li style="display:flex; justify-content:space-between;"><span>Performance:</span> <b style="color:var(--accent)">${Math.floor(effectivePerf)} pts</b></li>
                <li style="border-top:1px solid #444; margin-top:5px; padding-top:5px; display:flex; justify-content:space-between;">
                    <span>Mfg Cost:</span> <span style="color:#aaa">$${Math.floor(totalCost)}</span>
                </li>
                <li style="display:flex; justify-content:space-between;">
                    <span>Net Profit:</span> <b style="color:${profit > 0 ? '#00ff88' : '#ff4444'}">$${Math.floor(profit)}</b>
                </li>
            `;
        }

        let errors = [];
        if (disp && disp.raw.size > 18) errors.push("Display too huge for Laptop!");
        if (mobo && mobo.raw.form !== 'Laptop Board') errors.push("Motherboard must be a Laptop Board Form Factor!");
        
        // Slot checks limit (Laptops generally have fewer slots)
        const moboSlots = 3; // Laptops generally max out at 3 total slots or so (e.g. 2 RAM, 1 SSD)
        const usedSlots = (gpu ? 1 : 0) + ramQty + stoQty;
        if (usedSlots > moboSlots) {
            errors.push(`Slot Limit Exceeded: Laptop board has ${moboSlots} slots, but ${usedSlots} are occupied (1 GPU + ${ramQty} RAM + ${stoQty} SSDs).`);
        }

        return { valid: errors.length === 0, totalCost, effectivePerf, errors, parts: { cpu, mobo, gpu, ram, sto, disp }, batteryLife };
    },

    scrapeData: function () {
        let modelName = document.getElementById('lap-name-model').value;
        if (modelName === "NEW") {
            modelName = document.getElementById('lap-name-model-new').value || "Custom";
        }
        const versionName = document.getElementById('lap-name-version').value;
        const fullName = `${modelName} ${versionName}`.trim();
        return {
            modelName: modelName,
            versionName: versionName,
            name: fullName,
            hideStorefront: document.getElementById('lap-hide-storefront') ? document.getElementById('lap-hide-storefront').checked : false,
            year: parseFloat(document.getElementById('lap-year').value),
            price: parseFloat(document.getElementById('lap-price').value),
            chassis: document.getElementById('lap-chassis') ? document.getElementById('lap-chassis').value : '',
            bat: document.getElementById('lap-bat') ? parseFloat(document.getElementById('lap-bat').value) : 50,
            charger: document.getElementById('lap-charger') ? parseFloat(document.getElementById('lap-charger').value) : 65,
            key: document.getElementById('lap-key') ? document.getElementById('lap-key').value : ''
        };
    },

    // --- 5. SAVE ---
    refreshLineup: function () {
        const container = document.getElementById('active-laptop-list');
        if (!container || !window.sys) return;

        const db = window.sys.load();
        const active = db.inventory.filter(i => i.type === 'Laptop' && i.active === true);

        if (active.length === 0) {
            container.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:#555; padding:10px;">No active Laptops.</div>`;
            return;
        }

        container.innerHTML = active.map(p => {
            const specs = p.specs || {};
            return `
            <div style="background:rgba(255,255,255,0.05); border:1px solid #333; padding:10px; border-radius:4px; display:flex; flex-direction:column; gap:5px;">
                <div style="font-weight:bold; color:var(--accent); font-size:0.9rem;">${p.name}</div>
                <div style="font-size:0.75rem; color:#aaa;">
                    <div>${specs.CPU} | ${specs.GPU}</div>
                    <div>${specs.Screen}</div>
                    <div style="margin-top:2px; color:#fff; display:flex; justify-content:space-between;">
                        <span>$${p.raw?.price || 0}</span>
                        <span style="color:${specs.Battery.includes('Low') ? '#f55' : '#888'}">${specs.Battery}</span>
                    </div>
                </div>
                <div style="display:flex; gap:5px; margin-top:5px;">
                    <button onclick="window.cloneToArchitect(${p.id})" 
                        style="flex:1; background:rgba(0, 230, 118, 0.1); color:var(--accent-success); border:1px solid var(--accent-success); font-size:0.7rem; padding:4px; cursor:pointer; border-radius:3px;">
                        CLONE
                    </button>
                    ${p.raw && p.raw.hideStorefront ? 
                        `<button onclick="window.sys.toggleHide(${p.id})" style="flex:1; background:rgba(255, 255, 255, 0.1); color:#aaa; border:1px solid #444; font-size:0.7rem; padding:4px; cursor:pointer; border-radius:3px;">UNHIDE</button>` : 
                        `<button onclick="window.sys.toggleHide(${p.id})" style="flex:1; background:rgba(255, 255, 255, 0.1); color:#aaa; border:1px solid #444; font-size:0.7rem; padding:4px; cursor:pointer; border-radius:3px;">HIDE</button>`
                    }
                    <button onclick="window.sys.discontinue(${p.id})" 
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
        const specs = {
            "CPU": p.cpu ? p.cpu.name : "Generic",
            "GPU": p.gpu ? p.gpu.name : "Integrated",
            "Screen": p.disp ? `${p.disp.specs.Resolution} ${p.disp.specs.Panel}` : "Generic LCD",
            "Battery": `${physics.batteryLife.toFixed(1)} Hrs`,
            "Score": Math.floor(physics.effectivePerf)
        };

        window.sys.saveDesign('Laptop', {
            name: meta.name,
            year: meta.year,
            price: meta.price,
            specs: specs,
            // Save IDs of components so we can reference them later if needed
            components: {
                cpu: p.cpu?.id,
                gpu: p.gpu?.id,
                ram: p.ram?.id,
                ramQty: document.getElementById('lap-ram-qty') ? parseInt(document.getElementById('lap-ram-qty').value) : 1,
                mobo: p.mobo?.id,
                storage: p.sto?.id,
                stoQty: document.getElementById('lap-storage-qty') ? parseInt(document.getElementById('lap-storage-qty').value) : 1,
                disp: p.disp?.id,
                cam: p.cam?.id
            },
            ...meta
        });

        this.refreshLineup();
    }
};
