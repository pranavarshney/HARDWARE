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
    render: function(container) {
        if (!container) return;
        const currentYear = new Date().getFullYear();

        container.innerHTML = `
            <div class="architect-container">
                
                <div class="panel">
                    <h3>Console Identity</h3>
                    <div class="input-group">
                        <label>Console Name</label>
                        <input type="text" id="con-name" value="GameBox 360">
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Form Factor</label>
                            <select id="con-case" onchange="window.consoleArch.updatePhysics()">
                                ${this.renderOptions(this.chassis_opts)}
                            </select>
                        </div>
                        <div class="input-group">
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
                        <label>Shared Memory (GDDR)</label>
                        <select id="con-ram" class="part-selector"></select>
                    </div>
                </div>

                <div class="panel">
                    <h3>User Experience</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Internal Storage</label>
                            <select id="con-storage" class="part-selector"></select>
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
    },

    renderOptions: function(obj) {
        return Object.keys(obj).map(k => `<option value="${k}">${k}</option>`).join('');
    },

    // --- 3. INVENTORY LINKING ---
    populatePartDropdowns: function() {
        if(!window.sys) return;
        const db = window.sys.load();
        
        const fill = (id, type) => {
            const el = document.getElementById(id);
            if(!el) return;
            const parts = db.inventory.filter(i => i.type.toLowerCase() === type.toLowerCase());
            if(parts.length === 0) {
                el.innerHTML = `<option value="">No ${type}s Found</option>`;
            } else {
                el.innerHTML = parts.map(p => `<option value="${p.id}">${p.name} ($${p.raw?.price || 0})</option>`).join('');
                el.value = parts[parts.length-1].id; 
            }
        };

        fill('con-cpu', 'CPU');
        fill('con-gpu', 'GPU');
        fill('con-ram', 'RAM'); // In consoles, this is usually Unified Memory
        fill('con-storage', 'Storage');
    },

    // --- 4. PHYSICS ENGINE ---
    updatePhysics: function() {
        if(!window.sys) return;
        const db = window.sys.load();
        
        const getPart = (id) => {
            const val = document.getElementById(id).value;
            if(!val) return null;
            return db.inventory.find(i => i.id == val);
        };

        const cpu = getPart('con-cpu');
        const gpu = getPart('con-gpu');
        const ram = getPart('con-ram');
        const sto = getPart('con-storage');

        const chassis = this.chassis_opts[document.getElementById('con-case').value];
        const controller = this.controller_opts[document.getElementById('con-controller').value];
        const cooler = this.cooling_opts[document.getElementById('con-cool').value];
        const psuWatts = parseFloat(document.getElementById('con-psu').value) || 0;

        // --- A. SoC POWER & HEAT ---
        // Consoles optimize power. We assume 80% of desktop TDP for the SoC integration.
        const cpuTDP = cpu ? (cpu.raw.tdp || 65) : 0;
        const gpuTDP = gpu ? (gpu.raw.tdp || 150) : 0;
        
        const socTDP = (cpuTDP + gpuTDP) * 0.85; // Optimization bonus
        const totalWatts = socTDP + 30; // 30W for board, drive, wifi

        let errors = [];
        
        if(totalWatts > psuWatts) errors.push(`PSU Weak: Needs ${Math.floor(totalWatts)}W, has ${psuWatts}W`);
        
        if(socTDP > cooler.tdp) errors.push(`Overheating: SoC is ${Math.floor(socTDP)}W, Cooler is ${cooler.tdp}W`);

        // --- B. PERFORMANCE SCORE ---
        let cpuScore = cpu ? (cpu.raw.benchmarks?.multiScore || 0) : 0;
        let gpuScore = gpu ? (gpu.raw.benchmarks?.score || 0) : 0;
        
        // Console "Optimization Magic" (Consoles perform better than specs suggest)
        const consolePerf = (cpuScore * 0.4) + (gpuScore * 0.6);

        // --- C. COST & LOSS LEADER MATH ---
        const partsCost = (cpu?.raw.price||0) + (gpu?.raw.price||0) + (ram?.raw.price||0) + (sto?.raw.price||0);
        // SoC Discount: Fusing chips is cheaper than buying separate parts
        const socCost = partsCost * 0.7; 
        
        const infraCost = (chassis?.cost||0) + (controller?.cost||0) + (cooler?.cost||0) + (psuWatts * 0.15);
        const manufacturingCost = socCost + infraCost;
        
        const sellPrice = parseFloat(document.getElementById('con-price').value) || 0;
        const profit = sellPrice - manufacturingCost;

        // Declared here so they're always available for the return statement
        const stratText = profit >= 0 ? "Hardware Profit" : "Loss Leader Strategy";
        const profitColor = profit >= 0 ? "#00ff88" : "#ff4444";

        // --- D. RENDER ---
        const display = document.getElementById('con-live-stats');
        if(display) {
            if(errors.length > 0) {
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

        return { valid: errors.length === 0, manufacturingCost, consolePerf, errors, parts: {cpu, gpu, ram, sto}, stratText, profit };
    },

    scrapeData: function() {
        return {
            name: document.getElementById('con-name').value,
            year: parseFloat(document.getElementById('con-year').value),
            price: parseFloat(document.getElementById('con-price').value)
        };
    },

    // --- 5. SAVE ---
    refreshLineup: function() {
        const container = document.getElementById('active-console-list');
        if(!container || !window.sys) return;

        const db = window.sys.load();
        const active = db.inventory.filter(i => i.type === 'Console' && i.active === true);

        if(active.length === 0) {
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
                <button onclick="window.sys.discontinue(${c.id})" 
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

        const p = physics.parts;
        const specs = {
            "SoC": `${p.cpu ? p.cpu.name : 'Unknown'} + ${p.gpu ? p.gpu.name : 'Unknown'}`,
            "Memory": p.ram ? `${p.ram.specs.Capacity} Unified` : "None",
            "Perf": `${Math.floor(physics.consolePerf)} T-Ops`,
            "Strategy": physics.stratText,
            "Profit": physics.profit
        };

        window.sys.saveDesign('Console', {
            name: meta.name,
            year: meta.year,
            price: meta.price,
            specs: specs,
            ...meta
        });

        this.refreshLineup();
    }
};