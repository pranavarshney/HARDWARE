/* HARDWARE TYCOON: MOTHERBOARD ARCHITECT
 * PHYSICS ENGINE V1.0 (VRM Thermals & Signal Integrity)
 * Optimized for Flat Structure
 */

window.mobo = {

    // --- 1. PRESETS ---
    presets: {
        'Office (H-Series)': { socket: 'LGA-1700', chip: 'H610', form: 'mATX', ram: 'DDR4', pcie: 'Gen3', phases: 4, layers: 4, cool: 'None', price: 80 },
        'Gaming (B-Series)': { socket: 'LGA-1700', chip: 'B760', form: 'ATX', ram: 'DDR5', pcie: 'Gen4', phases: 8, layers: 6, cool: 'Passive', price: 150 },
        'Enthusiast (Z-Series)': { socket: 'LGA-1851', chip: 'Z790', form: 'E-ATX', ram: 'DDR5', pcie: 'Gen5', phases: 16, layers: 8, cool: 'Heatpipe', price: 350 },
        'Workstation (Threadripper)': { socket: 'sTR5', chip: 'WRX90', form: 'E-ATX', ram: 'DDR5', pcie: 'Gen5', phases: 24, layers: 12, cool: 'Active Fan', price: 999 },
        'Retro (Socket 478)': { socket: 'PGA-478', chip: '865PE', form: 'ATX', ram: 'DDR1', pcie: 'AGP', phases: 3, layers: 2, cool: 'None', price: 60 }
    },

    // --- 2. UI RENDERER ---
    render: function(container) {
        if (!container) return;

        // Default year
        const currentYear = new Date().getFullYear();

        container.innerHTML = `
            <div class="architect-container">
                
                <div style="grid-column: 1 / -1; display:flex; gap:10px; margin-bottom:10px; flex-wrap:wrap;">
                    ${Object.keys(this.presets).map(k => 
                        `<button style="background:#333; color:#fff; border:1px solid #555; padding:5px 10px; cursor:pointer; font-size:0.8rem;" onclick="window.mobo.loadPreset('${k}')">${k.split(' ')[0]}</button>`
                    ).join('')}
                </div>

                <div class="panel">
                    <h3>Platform Identity</h3>
                    <div class="input-group">
                        <label>Model Name</label>
                        <input type="text" id="mobo-name" value="Z790 Aorus Master">
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Socket Type</label>
                            <input type="text" id="mobo-socket" value="LGA-1851" list="socket-list">
                            <datalist id="socket-list">
                                <option value="LGA-1700">Intel 12/13/14th</option>
                                <option value="LGA-1851">Intel Core Ultra</option>
                                <option value="AM4">Ryzen 1000-5000</option>
                                <option value="AM5">Ryzen 7000+</option>
                            </datalist>
                        </div>
                        <div class="input-group">
                            <label>Chipset</label>
                            <input type="text" id="mobo-chip" value="Z790">
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>Connectivity</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Memory Standard</label>
                            <select id="mobo-ram">
                                <option value="DDR1">DDR1 (Retro)</option>
                                <option value="DDR2">DDR2</option>
                                <option value="DDR3">DDR3</option>
                                <option value="DDR4">DDR4</option>
                                <option value="DDR5" selected>DDR5</option>
                                <option value="DDR6">DDR6 (Future)</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>PCIe Generation</label>
                            <select id="mobo-pcie">
                                <option value="AGP">AGP (Retro)</option>
                                <option value="Gen3">PCIe Gen 3</option>
                                <option value="Gen4">PCIe Gen 4</option>
                                <option value="Gen5" selected>PCIe Gen 5</option>
                                <option value="Gen6">PCIe Gen 6</option>
                            </select>
                        </div>
                    </div>
                    <div class="input-group" style="margin-top:10px;">
                        <label>Form Factor</label>
                        <select id="mobo-form">
                            <option value="ITX">Mini-ITX (1 Slot)</option>
                            <option value="mATX">Micro-ATX (4 Slots)</option>
                            <option value="ATX">Standard ATX (7 Slots)</option>
                            <option value="E-ATX" selected>E-ATX (Massive)</option>
                        </select>
                    </div>
                </div>

                <div class="panel">
                    <h3>Power Delivery (VRM)</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Power Phases</label>
                            <input type="number" id="mobo-phases" value="16" min="2" max="32">
                        </div>
                        <div class="input-group">
                            <label>VRM Cooling</label>
                            <select id="mobo-cool">
                                <option value="None">Bare MOSFETs</option>
                                <option value="Passive">Aluminum Heatsink</option>
                                <option value="Heatpipe">Heatpipe Fin Stack</option>
                                <option value="Active Fan">Active Fan</option>
                                <option value="Waterblock">Liquid Block</option>
                            </select>
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px;">
                        <div class="input-group">
                            <label>PCB Layers</label>
                            <input type="number" id="mobo-layers" value="8" min="2" max="14">
                        </div>
                        <div></div> 
                    </div>
                </div>

                <div class="panel" style="border-color: var(--accent-success);">
                    <h3>Release & Simulation</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Launch Year</label>
                            <input type="number" id="mobo-year" value="${currentYear}">
                        </div>
                        <div class="input-group">
                            <label>Launch Price ($)</label>
                            <input type="number" id="mobo-price" value="399">
                        </div>
                    </div>

                    <div style="margin-top:15px; background:rgba(0,0,0,0.3); padding:10px; border-radius:4px; margin-bottom:15px;">
                        <ul id="mobo-live-stats" style="list-style:none; padding:0; margin:0; font-size:0.8rem; color:#ccc;">
                            </ul>
                    </div>

                    <button class="btn-action" onclick="window.mobo.saveSystem()">
                        MANUFACTURE & RELEASE
                    </button>
                </div>

                <div class="panel" style="grid-column: 1 / -1; border-color: #444;">
                    <h3 style="border-bottom:1px solid #444; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                        Active Lineup
                        <button onclick="window.mobo.refreshLineup()" style="background:none; border:none; color:#888; cursor:pointer; font-size:0.7rem;">↻ Refresh</button>
                    </h3>
                    
                    <div id="active-mobo-list" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap:10px;">
                        <div style="padding:10px; color:#555;">Loading market data...</div>
                    </div>
                </div>

            </div>
        `;

        // Listeners
        container.querySelectorAll('input, select').forEach(el => {
            el.addEventListener('input', () => this.updatePhysics());
        });
        
        this.updatePhysics();
        this.refreshLineup();
    },

    loadPreset: function(name) {
        const p = this.presets[name];
        if(!p) return;
        
        const set = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };

        set('mobo-name', name);
        set('mobo-socket', p.socket);
        set('mobo-chip', p.chip);
        set('mobo-form', p.form);
        set('mobo-ram', p.ram);
        set('mobo-pcie', p.pcie);
        set('mobo-phases', p.phases);
        set('mobo-layers', p.layers || 6); // Default to 6 if missing in preset
        set('mobo-cool', p.cool);
        set('mobo-price', p.price);
        
        this.updatePhysics();
    },

    // --- 3. PHYSICS ENGINE ---
    updatePhysics: function() {
        const d = this.scrapeData();

        // 1. VRM POWER CAPACITY CALCULATION
        let wattsPerPhase = 25; // Base
        if (d.price > 200) wattsPerPhase = 45; // DrMOS
        if (d.price > 500) wattsPerPhase = 70; // SPS
        if (d.price < 100) wattsPerPhase = 15; // D-PAK

        let rawPowerCap = d.phases * wattsPerPhase;

        // Cooling Multiplier
        const coolingMult = {
            'None': 0.6,
            'Passive': 1.0,
            'Heatpipe': 1.3,
            'Active Fan': 1.5,
            'Waterblock': 2.0
        };
        
        const maxTDP = Math.floor(rawPowerCap * (coolingMult[d.cool] || 1.0));
        
        // 2. SIGNAL INTEGRITY
        let maxRamSpeed = 3200; // Base DDR4
        if (d.ram === 'DDR5') maxRamSpeed = 4800 + (d.layers * 400); 
        
        // 3. EXPANSION CAPACITY
        const slots = { 'ITX': 1, 'mATX': 2, 'ATX': 3, 'E-ATX': 4 }[d.form] || 3;
        const m2Slots = Math.max(1, Math.floor(d.layers / 2)); 

        // 4. VRM TEMP ESTIMATE
        const simLoad = 200; // Standard high-end CPU load
        const loadRatio = simLoad / maxTDP;
        let vrmTemp = 40 + (loadRatio * 60); 
        
        let status = "Stable";
        let color = "#00ff88"; // Success Green
        
        if (vrmTemp > 90) { 
            status = "VRM Thermal Throttle"; 
            color = "#ff4444"; // Danger Red
        } else if (vrmTemp > 75) {
            status = "Running Hot";
            color = "#ffaa00"; // Warning Orange
        } else if (loadRatio > 1.2) {
             status = "VRM FAILURE";
             color = "#ff4444";
        }

        // 5. QUALITY SCORE
        let score = (maxTDP / 2) + (d.layers * 10) + (slots * 20);
        if (d.pcie === 'Gen5') score += 50;

        // UI Updates
        const display = document.getElementById('mobo-live-stats');
        if (display) {
            display.innerHTML = `
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Max Power:</span> <b style="color:var(--accent)">${maxTDP} Watts</b></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>VRM Temp (200W):</span> <b style="color:${color}">${Math.min(120, vrmTemp).toFixed(0)}°C</b></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Memory Max:</span> <b>${maxRamSpeed} MT/s</b></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Expansion:</span> <b>${slots}x PCIe / ${m2Slots}x M.2</b></li>
                <li style="display:flex; justify-content:space-between; border-top:1px solid #444; padding-top:4px;"><span>Platform Score:</span> <b style="color:var(--accent)">${Math.floor(score)}</b></li>
            `;
        }

        return { score, maxTDP, vrmTemp, slots };
    },

    scrapeData: function() {
        const get = (id) => {
            const el = document.getElementById(id);
            if (!el) return 0;
            if (el.tagName === 'SELECT' || el.type === 'text') return isNaN(Number(el.value)) ? el.value : Number(el.value);
            return parseFloat(el.value) || 0;
        };

        return {
            name: document.getElementById('mobo-name').value,
            socket: get('mobo-socket'),
            chip: get('mobo-chip'),
            form: get('mobo-form'),
            ram: get('mobo-ram'),
            pcie: get('mobo-pcie'),
            phases: get('mobo-phases'),
            cool: get('mobo-cool'),
            layers: get('mobo-layers'),
            price: get('mobo-price'),
            year: get('mobo-year')
        };
    },

    // --- 4. DATABASE & SAVE LOGIC ---
    refreshLineup: function() {
        const container = document.getElementById('active-mobo-list');
        if(!container || !window.sys) return;

        const db = window.sys.load();
        const activeMobos = db.inventory.filter(i => i.type === 'Motherboard' && i.active === true);

        if(activeMobos.length === 0) {
            container.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:#555; padding:10px;">No active Motherboards.</div>`;
            return;
        }

        container.innerHTML = activeMobos.map(board => {
            const specs = board.specs || {};
            return `
            <div style="background:rgba(255,255,255,0.05); border:1px solid #333; padding:10px; border-radius:4px; display:flex; flex-direction:column; gap:5px;">
                <div style="font-weight:bold; color:var(--accent); font-size:0.9rem;">${board.name}</div>
                <div style="font-size:0.75rem; color:#aaa;">
                    <div>${specs.Socket || 'N/A'} | ${specs.Chipset || 'N/A'}</div>
                    <div style="margin-top:2px; color:#fff;">$${board.raw?.price || 0}</div>
                </div>
                
                <button onclick="window.sys.discontinue(${board.id})" 
                    style="margin-top:5px; background:transparent; color:#ff4444; border:1px solid #522; font-size:0.7rem; padding:4px; cursor:pointer; border-radius:3px;">
                    DISCONTINUE
                </button>
            </div>
            `;
        }).join('');
    },

    saveSystem: function() {
        if(!window.sys || !window.sys.saveDesign) {
            alert("Error: Save system not found!");
            return;
        }

        const data = this.scrapeData();
        const results = this.updatePhysics();

        window.sys.saveDesign('Motherboard', {
            name: data.name,
            
            // Display Specs
            specs: {
                "Socket": data.socket,
                "Chipset": data.chip,
                "Form": data.form,
                "VRM": `${data.phases} Phase (${data.cool})`,
                "Score": Math.floor(results.score)
            },
            
            // Raw Data
            price: data.price,
            year: data.year,
            ...data
        });

        this.refreshLineup();
    }
};