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
    render: function(container) {
        if (!container) return;
        const currentYear = new Date().getFullYear();

        container.innerHTML = `
            <div class="architect-container">
                
                <div class="panel">
                    <h3>System Identity</h3>
                    <div class="input-group">
                        <label>System Name</label>
                        <input type="text" id="sys-name" value="Titanium X1">
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
                    <div class="input-group" style="margin-top:10px;">
                        <label>Memory (RAM)</label>
                        <select id="sys-ram" class="part-selector"></select>
                    </div>
                </div>

                <div class="panel">
                    <h3>Expansion</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Graphics (GPU)</label>
                            <select id="sys-gpu" class="part-selector"></select>
                        </div>
                        <div class="input-group">
                            <label>Primary Storage</label>
                            <select id="sys-storage" class="part-selector"></select>
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
    },

    // --- HELPER: Render Simple Options ---
    renderOptions: function(obj) {
        return Object.keys(obj).map(k => `<option value="${k}">${k}</option>`).join('');
    },

    // --- 3. INVENTORY LINKING ---
    populatePartDropdowns: function() {
        if(!window.sys) return;
        const db = window.sys.load();
        
        // Helper to fill a specific dropdown
        const fill = (id, type) => {
            const el = document.getElementById(id);
            if(!el) return;
            
            // Get parts of this type
            const parts = db.inventory.filter(i => i.type.toLowerCase() === type.toLowerCase());
            
            if(parts.length === 0) {
                el.innerHTML = `<option value="">No ${type}s Found</option>`;
            } else {
                // Add an "None" option for optional parts like GPU? No, desktop needs gpu usually, but let's assume iGPU exists if none selected
                // actually let's just list them.
                el.innerHTML = parts.map(p => `<option value="${p.id}">${p.name} ($${p.raw?.price || 0})</option>`).join('');
                
                // Select the newest one by default
                el.value = parts[parts.length-1].id; 
            }
        };

        fill('sys-cpu', 'CPU');
        fill('sys-mobo', 'Motherboard');
        fill('sys-ram', 'RAM');
        fill('sys-gpu', 'GPU');
        fill('sys-storage', 'Storage');
    },

    // --- 4. PHYSICS & COMPATIBILITY ENGINE ---
    updatePhysics: function() {
        if(!window.sys) return;
        const db = window.sys.load();
        
        // 1. FETCH SELECTED PARTS
        const getPart = (id) => {
            const val = document.getElementById(id).value;
            if(!val) return null;
            return db.inventory.find(i => i.id == val);
        };

        const cpu = getPart('sys-cpu');
        const mobo = getPart('sys-mobo');
        const ram = getPart('sys-ram');
        const gpu = getPart('sys-gpu');
        const sto = getPart('sys-storage');

        // Fetch Generic Parts
        const chassis = this.chassis_opts[document.getElementById('sys-case').value];
        const psu = this.psu_opts[document.getElementById('sys-psu').value];
        const cooler = this.cooling_opts[document.getElementById('sys-cool').value];

        // 2. COMPATIBILITY CHECKS
        let errors = [];
        
        // Socket Check
        if(cpu && mobo) {
            if(cpu.raw.socket !== mobo.raw.socket) errors.push(`Socket Mismatch: CPU (${cpu.raw.socket}) vs Mobo (${mobo.raw.socket})`);
        }
        
        // RAM Generation Check
        if(ram && mobo) {
            // mobo.raw.ram might be "DDR5", ram.raw.gen might be "DDR5"
            // We need to handle potential naming diffs, but assuming consistency based on previous files
            if(mobo.raw.ram !== ram.raw.gen) errors.push(`RAM Incompatible: Mobo needs ${mobo.raw.ram}, got ${ram.raw.gen}`);
        }

        // Form Factor Check
        if(mobo) {
            // Simple size hierarchy: ITX < mATX < ATX < E-ATX
            const sizes = { 'ITX': 1, 'mATX': 2, 'ATX': 3, 'E-ATX': 4 };
            const caseSize = sizes[chassis.type] || 0;
            const moboSize = sizes[mobo.raw.form] || 0;
            
            if(moboSize > caseSize) errors.push(`Fit Issue: ${mobo.raw.form} mobo won't fit in ${chassis.type} case`);
        }

        // 3. POWER & THERMALS
        // Summing TDPs (fallback to 0 if part missing)
        const cpuTDP = cpu ? (cpu.raw.tdp || 65) : 0;
        const gpuTDP = gpu ? (gpu.raw.tdp || 150) : 0; // GPU might not have tdp in raw if old version, assume safe default
        const sysOverhead = 50; // Fans, drives, mobo
        
        const totalWatts = cpuTDP + gpuTDP + sysOverhead;
        const psuWatts = psu ? psu.watts : 0;
        
        let powerStatus = "Good";
        let powerColor = "var(--accent-success)";
        
        if(totalWatts > psuWatts) {
            errors.push(`Power Failure: Needs ${totalWatts}W, PSU is ${psuWatts}W`);
            powerStatus = "CRITICAL FAILURE";
            powerColor = "#ff4444";
        } else if(totalWatts > psuWatts * 0.9) {
            powerStatus = "Strained (>90%)";
            powerColor = "#ffaa00";
        }

        // Cooling Check
        const totalHeat = cpuTDP; // GPU usually cools itself, case airflow helps both
        // Cooler TDP is for CPU.
        const coolingCap = (cooler ? cooler.tdp : 0) + (chassis ? chassis.airflow * 10 : 0);
        
        let thermalStatus = "Cool";
        if(cpuTDP > coolingCap) {
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

        if(gpuScore > 0 && cpuScore > 0) {
            // Ratio. A balanced gaming PC might have GPU score ~ 1.5x CPU score (arbitrary game scale)
            // If GPU is 5x CPU, CPU is bottleneck.
            const ratio = gpuScore / cpuScore;
            
            if(ratio > 3.0) {
                bottleneck = (ratio - 3.0) * 10; // % penalty
                if(bottleneck > 50) bottleneck = 50;
                effectivePerf = (cpuScore * 3) + (gpuScore * (1 - (bottleneck/100)));
            } else {
                effectivePerf = cpuScore + gpuScore;
            }
        }

        // 5. COST ANALYSIS
        const partsCost = (cpu?.raw.price||0) + (mobo?.raw.price||0) + (ram?.raw.price||0) + (gpu?.raw.price||0) + (sto?.raw.price||0);
        const infraCost = (chassis?.cost||0) + (psu?.cost||0) + (cooler?.cost||0);
        const totalCost = partsCost + infraCost;
        
        const sellPrice = parseFloat(document.getElementById('sys-price').value) || 0;
        const profit = sellPrice - totalCost;

        // 6. RENDER STATS
        const display = document.getElementById('sys-live-stats');
        if(display) {
            if(errors.length > 0) {
                display.innerHTML = errors.map(e => `<li style="color:#ff4444">❌ ${e}</li>`).join('');
            } else {
                display.innerHTML = `
                    <li style="display:flex; justify-content:space-between;"><span>Total Power:</span> <b>${totalWatts}W / ${psuWatts}W</b></li>
                    <li style="display:flex; justify-content:space-between;"><span>Thermal Headroom:</span> <b>${(coolingCap - cpuTDP)}W</b></li>
                    <li style="display:flex; justify-content:space-between;"><span>Bottleneck:</span> <b style="color:${bottleneck>0?'#ffaa00':'#00ff88'}">${bottleneck.toFixed(1)}%</b></li>
                    <li style="display:flex; justify-content:space-between;"><span>Performance:</span> <b style="color:var(--accent)">${Math.floor(effectivePerf)} pts</b></li>
                    <li style="border-top:1px solid #444; margin-top:5px; padding-top:5px; display:flex; justify-content:space-between;">
                        <span>Bill of Materials:</span> <span style="color:#aaa">$${totalCost}</span>
                    </li>
                    <li style="display:flex; justify-content:space-between;">
                        <span>Net Profit:</span> <b style="color:${profit>0?'#00ff88':'#ff4444'}">$${profit}</b>
                    </li>
                `;
            }
        }

        return { valid: errors.length === 0, totalCost, effectivePerf, errors, parts: {cpu, mobo, ram, gpu, sto, chassis, psu, cooler} };
    },

    scrapeData: function() {
        return {
            name: document.getElementById('sys-name').value,
            year: parseFloat(document.getElementById('sys-year').value),
            price: parseFloat(document.getElementById('sys-price').value)
        };
    },

    // --- 5. SAVE & LAUNCH ---
    refreshLineup: function() {
        const container = document.getElementById('active-desktop-list');
        if(!container || !window.sys) return;

        const db = window.sys.load();
        const active = db.inventory.filter(i => i.type === 'Desktop' && i.active === true);

        if(active.length === 0) {
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
                <button onclick="window.sys.discontinue(${pc.id})" 
                    style="margin-top:5px; background:transparent; color:#ff4444; border:1px solid #522; font-size:0.7rem; padding:4px; cursor:pointer; border-radius:3px;">
                    DISCONTINUE
                </button>
            </div>
            `;
        }).join('');
    },

    saveSystem: function() {
        const physics = this.updatePhysics();
        const meta = this.scrapeData();

        if(!physics.valid) {
            alert("CANNOT LAUNCH: " + physics.errors[0]);
            return;
        }

        // Gather names for the spec sheet
        const p = physics.parts;
        const specs = {
            "CPU": p.cpu ? p.cpu.name : "None",
            "GPU": p.gpu ? p.gpu.name : "Integrated",
            "RAM": p.ram ? `${p.ram.name} (${p.ram.specs.Capacity})` : "None",
            "Storage": p.sto ? `${p.sto.name} (${p.sto.specs.Capacity})` : "None",
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
                mobo: p.mobo?.id,
                storage: p.sto?.id
            }
        });

        this.refreshLineup();
    }
};