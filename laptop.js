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

    battery_opts: {
        '30Wh (Basic)': { wh: 30, weight: 0.15, cost: 15 },
        '50Wh (Standard)': { wh: 50, weight: 0.25, cost: 25 },
        '80Wh (Long Life)': { wh: 80, weight: 0.40, cost: 50 },
        '99Wh (Flight Max)': { wh: 99, weight: 0.50, cost: 75 }
    },

    keyboard_opts: {
        'Membrane': { type: 'Basic', height: 0, cost: 5 },
        'Scissor Switch': { type: 'Slim', height: 1, cost: 15 },
        'Mechanical (Low Profile)': { type: 'Clicky', height: 3, cost: 40 },
        'Optical Mech': { type: 'Speed', height: 4, cost: 60 }
    },

    // --- 2. RENDER UI ---
    render: function(container) {
        if (!container) return;
        const currentYear = new Date().getFullYear();

        container.innerHTML = `
            <div class="architect-container">
                
                <div class="panel">
                    <h3>Model Identity</h3>
                    <div class="input-group">
                        <label>Model Name</label>
                        <input type="text" id="lap-name" value="Stealth Book Pro">
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
                            <label>Memory (RAM)</label>
                            <select id="lap-ram" class="part-selector"></select>
                        </div>
                        <div class="input-group">
                            <label>Storage</label>
                            <select id="lap-storage" class="part-selector"></select>
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>Power & Mobility</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Battery</label>
                            <select id="lap-bat" onchange="window.laptop.updatePhysics()">
                                ${this.renderOptions(this.battery_opts)}
                            </select>
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
                // Special handling for Optional GPU
                if(type === 'GPU') {
                    el.innerHTML = `<option value="">Integrated Graphics (None)</option>`;
                } else {
                    el.innerHTML = `<option value="">No ${type}s</option>`;
                }
            } else {
                let html = parts.map(p => {
                    let extra = "";
                    if(type === 'Display') extra = ` | ${p.specs.Resolution} ${p.specs.HDR}`;
                    return `<option value="${p.id}">${p.name}${extra}</option>`;
                }).join('');
                
                // For GPU, add an "Integrated" option at the top
                if(type === 'GPU') {
                    html = `<option value="">Integrated Graphics Only</option>` + html;
                }
                
                el.innerHTML = html;
                // Default select the last one (usually newest)
                el.value = parts[parts.length-1].id; 
            }
        };

        fill('lap-cpu', 'CPU');
        fill('lap-gpu', 'GPU');
        fill('lap-ram', 'RAM');
        fill('lap-storage', 'Storage');
        fill('lap-display', 'Display');
        fill('lap-camera', 'Camera');
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

        // Get Components
        const cpu = getPart('lap-cpu');
        const gpu = getPart('lap-gpu');
        const ram = getPart('lap-ram');
        const sto = getPart('lap-storage');
        const disp = getPart('lap-display');
        const cam = getPart('lap-camera');

        // Get Chassis & Power
        const chassisKey = document.getElementById('lap-chassis').value;
        const chassis = this.chassis_opts[chassisKey];
        
        const batKey = document.getElementById('lap-bat').value;
        const battery = this.battery_opts[batKey];
        
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
            thermalStatus = `Throttling (-${((1-throttle)*100).toFixed(0)}%)`;
        }

        // --- B. BATTERY LIFE ---
        // Usage Scenario: Mixed Productivity (CPU low, GPU off, Screen 50%)
        // Display Power:
        let dispPwr = 2.0; // Base panel power
        if(disp) {
            const area = (disp.raw.w * disp.raw.h) / 2000000;
            // High refresh rate eats battery
            const hzFactor = disp.raw.hz / 60;
            dispPwr = area * (disp.raw.nits / 100) * (hzFactor * 0.5);
        }

        // Idle / Light Load Power
        const cpuIdle = cpuTDP * 0.15; // Modern CPUs idle well
        const sysOverhead = 3.0; // WiFi, RAM, NVMe
        const avgLoad = cpuIdle + dispPwr + sysOverhead;
        
        // Gaming Load Power (for Charger check)
        const peakLoad = (totalHeat * throttle) + dispPwr + sysOverhead + 10; 

        // Life Calculation
        const batteryLife = battery.wh / avgLoad;

        // Charger Check
        let chargeStatus = "Good";
        if(peakLoad > chargerWatts) chargeStatus = "Drains under load";

        // --- C. PORTABILITY & WEIGHT ---
        // Base weight + Parts
        let totalWeight = chassis.weight + battery.weight;
        if(gpu) totalWeight += 0.2; // Dedicated GPU adds cooling weight
        if(chassis.type === 'Thick') totalWeight += 0.3; // Heatsinks

        // --- D. PERFORMANCE SCORE ---
        let cpuScore = cpu ? (cpu.raw.benchmarks?.multiScore || 0) : 0;
        let gpuScore = gpu ? (gpu.raw.benchmarks?.score || 0) : 0;
        
        const effectivePerf = (cpuScore + gpuScore) * throttle;

        // --- E. COST & PROFIT ---
        const partsCost = (cpu?.raw.price||0) + (gpu?.raw.price||0) + (ram?.raw.price||0) + (sto?.raw.price||0) + (disp?.raw.price||0) + (cam?.raw.price||0);
        const infraCost = chassis.cost + battery.cost + keyboard.cost + (chargerWatts * 0.5);
        
        const totalCost = partsCost + infraCost;
        const sellPrice = parseFloat(document.getElementById('lap-price').value) || 0;
        const profit = sellPrice - totalCost;

        // --- F. RENDER ---
        const display = document.getElementById('lap-live-stats');
        if(display) {
            let lifeColor = batteryLife > 8 ? "#00ff88" : (batteryLife > 4 ? "#ffaa00" : "#ff4444");
            let thermColor = throttle < 0.8 ? "#ff4444" : (throttle < 1.0 ? "#ffaa00" : "#888");

            display.innerHTML = `
                <li style="display:flex; justify-content:space-between;"><span>Battery Life:</span> <b style="color:${lifeColor}">${batteryLife.toFixed(1)} Hrs</b> <span style="font-size:0.7em">(Mixed Usage)</span></li>
                <li style="display:flex; justify-content:space-between;"><span>Thermals:</span> <b style="color:${thermColor}">${thermalStatus}</b> <span style="font-size:0.7em">(${Math.floor(totalHeat*throttle)}W / ${coolingCap}W Cap)</span></li>
                <li style="display:flex; justify-content:space-between;"><span>Weight:</span> <b>${totalWeight.toFixed(2)} kg</b></li>
                <li style="display:flex; justify-content:space-between;"><span>Performance:</span> <b style="color:var(--accent)">${Math.floor(effectivePerf)} pts</b></li>
                <li style="border-top:1px solid #444; margin-top:5px; padding-top:5px; display:flex; justify-content:space-between;">
                    <span>Bill of Materials:</span> <span style="color:#aaa">$${Math.floor(totalCost)}</span>
                </li>
                <li style="display:flex; justify-content:space-between;">
                    <span>Net Profit:</span> <b style="color:${profit>0?'#00ff88':'#ff4444'}">$${Math.floor(profit)}</b>
                </li>
            `;
        }

        let errors = [];
        if(disp && disp.raw.size > 18) errors.push("Display too huge for Laptop!");
        
        return { valid: errors.length === 0, totalCost, effectivePerf, errors, parts: {cpu, gpu, ram, sto, disp}, batteryLife };
    },

    scrapeData: function() {
        return {
            name: document.getElementById('lap-name').value,
            year: parseFloat(document.getElementById('lap-year').value),
            price: parseFloat(document.getElementById('lap-price').value),
            chassis: document.getElementById('lap-chassis').value
        };
    },

    // --- 5. SAVE ---
    refreshLineup: function() {
        const container = document.getElementById('active-laptop-list');
        if(!container || !window.sys) return;

        const db = window.sys.load();
        const active = db.inventory.filter(i => i.type === 'Laptop' && i.active === true);

        if(active.length === 0) {
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
                <button onclick="window.sys.discontinue(${p.id})" 
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
            ...meta
        });

        this.refreshLineup();
    }
};