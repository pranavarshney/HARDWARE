/* HARDWARE TYCOON: MEMORY ARCHITECT
 * PHYSICS ENGINE V1.0 (True Latency & Bandwidth)
 * Optimized for Flat Structure
 */

window.ram = {

    // --- 1. GENERATION PRESETS ---
    presets: {
        'DDR1 Retro': { gen: 'DDR1', size: 1, freq: 400, cl: 3, volts: 2.5, channels: 1, price: 50 },
        'DDR2 Standard': { gen: 'DDR2', size: 2, freq: 800, cl: 5, volts: 1.8, channels: 2, price: 80 },
        'DDR3 Gaming': { gen: 'DDR3', size: 8, freq: 1600, cl: 9, volts: 1.5, channels: 2, price: 120 },
        'DDR4 Performance': { gen: 'DDR4', size: 16, freq: 3200, cl: 16, volts: 1.35, channels: 2, price: 150 },
        'DDR5 Enthusiast': { gen: 'DDR5', size: 32, freq: 6000, cl: 30, volts: 1.1, channels: 2, price: 250 },
        'DDR6 Next-Gen': { gen: 'DDR6', size: 64, freq: 12800, cl: 40, volts: 1.0, channels: 4, price: 450 },
        'DDR7 Prototype': { gen: 'DDR7', size: 128, freq: 24000, cl: 46, volts: 0.9, channels: 4, price: 999 }
    },

    // --- 2. UI RENDERER ---
    render: function (container) {
        if (!container) return;

        // Default year logic
        const currentYear = new Date().getFullYear();

        container.innerHTML = `
            <div class="architect-container">
                
                <div style="grid-column: 1 / -1; display:flex; gap:10px; margin-bottom:10px; flex-wrap:wrap;">
                    ${Object.keys(this.presets).map(k =>
            `<button style="background:#333; color:#fff; border:1px solid #555; padding:5px 10px; cursor:pointer; font-size:0.8rem;" onclick="window.ram.loadPreset('${k}')">${k}</button>`
        ).join('')}
                </div>

                <div class="panel">
                    <h3>Identity & Type</h3>
                    <div class="input-group">
                        <label>Model Name</label>
                        <input type="text" id="ram-name" value="Dominator X">
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Generation</label>
                            <select id="ram-gen">
                                <option value="DDR1">DDR1</option>
                                <option value="DDR2">DDR2</option>
                                <option value="DDR3">DDR3</option>
                                <option value="DDR4" selected>DDR4</option>
                                <option value="DDR5">DDR5</option>
                                <option value="DDR6">DDR6 (Exp)</option>
                                <option value="DDR7">DDR7 (Proto)</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Launch Price ($)</label>
                            <input type="number" id="ram-price" value="149">
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>Speed & Latency</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Speed (MT/s)</label>
                            <input type="number" id="ram-freq" value="3200" step="100">
                        </div>
                        <div class="input-group">
                            <label>CAS Latency (CL)</label>
                            <input type="number" id="ram-cl" value="16" step="1">
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px;">
                        <div class="input-group">
                            <label>Voltage (V)</label>
                            <input type="number" id="ram-volts" value="1.35" step="0.05">
                        </div>
                        <div class="input-group">
                            <label>True Latency</label>
                            <input type="text" id="calc-latency" disabled value="10.00 ns" style="color:var(--accent); border:none; background:transparent; font-weight:bold; text-align:right;">
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>Capacity & Bus</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Total Size (GB)</label>
                            <input type="number" id="ram-size" value="16">
                        </div>
                        <div class="input-group">
                            <label>Channels</label>
                            <select id="ram-channels">
                                <option value="1">Single (64-bit)</option>
                                <option value="2" selected>Dual (128-bit)</option>
                                <option value="4">Quad (256-bit)</option>
                                <option value="8">Octa (512-bit)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="panel" style="border-color: var(--accent-success);">
                    <h3>Release & Simulation</h3>
                    
                    <div class="input-group">
                        <label>Launch Year</label>
                        <input type="number" id="ram-year" value="${currentYear}">
                    </div>

                    <div style="margin-top:15px; background:rgba(0,0,0,0.3); padding:10px; border-radius:4px; margin-bottom:15px;">
                        <ul id="ram-live-stats" style="list-style:none; padding:0; margin:0; font-size:0.8rem; color:#ccc;">
                            </ul>
                    </div>

                    <button class="btn-action" onclick="window.ram.saveSystem()">
                        MANUFACTURE & RELEASE
                    </button>
                </div>

                <div class="panel" style="grid-column: 1 / -1; border-color: #444;">
                    <h3 style="border-bottom:1px solid #444; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                        Active Lineup
                        <button onclick="window.ram.refreshLineup()" style="background:none; border:none; color:#888; cursor:pointer; font-size:0.7rem;">↻ Refresh</button>
                    </h3>
                    
                    <div id="active-ram-list" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap:10px;">
                        <div style="padding:10px; color:#555;">Loading market data...</div>
                    </div>
                </div>

            </div>
        `;

        // Bind Events
        container.querySelectorAll('input, select').forEach(el => {
            el.addEventListener('input', () => this.updatePhysics());
        });

        this.updatePhysics();
        this.refreshLineup();
    },

    loadPreset: function (name) {
        const p = this.presets[name];
        if (!p) return;

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };

        set('ram-name', name);
        set('ram-gen', p.gen);
        set('ram-size', p.size);
        set('ram-freq', p.freq);
        set('ram-cl', p.cl);
        set('ram-volts', p.volts);
        set('ram-channels', p.channels);
        set('ram-price', p.price);

        this.updatePhysics();
    },

    loadBase: function (raw) {
        const set = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };
        set('ram-name', raw.name);
        set('ram-gen', raw.gen);
        set('ram-size', raw.size);
        set('ram-freq', raw.freq);
        set('ram-cl', raw.cl);
        set('ram-volts', raw.volts);
        set('ram-channels', raw.channels);
        set('ram-price', raw.price);
        set('ram-year', raw.year);

        this.updatePhysics();
    },

    // --- 3. PHYSICS ENGINE ---
    updatePhysics: function () {
        const d = this.scrapeData();

        // 1. TRUE LATENCY CALCULATION (The Real Physics)
        // Formula: (CAS Latency * 2000) / Frequency (in MT/s) = Nanoseconds
        // Example: CL16 @ 3200MHz = (16 * 2000) / 3200 = 10ns
        const trueLatency = (d.cl * 2000) / (d.freq || 1);

        const latencyEl = document.getElementById('calc-latency');
        if (latencyEl) latencyEl.value = trueLatency.toFixed(2) + " ns";

        // 2. BANDWIDTH CALCULATION
        // Formula: Frequency * 8 bytes (64-bit) * Channels / 1000 = GB/s
        const rawBandwidth = (d.freq * 8 * d.channels) / 1000;

        // 3. GENERATION EFFICIENCY
        // Newer gens have internal improvements (prefetch buffers, bank groups)
        const genMultipliers = {
            'DDR1': 0.8, 'DDR2': 0.85, 'DDR3': 0.9,
            'DDR4': 1.0, 'DDR5': 1.15, 'DDR6': 1.25, 'DDR7': 1.4
        };
        const efficiency = genMultipliers[d.gen] || 1.0;

        const effectiveBandwidth = rawBandwidth * efficiency;

        // 4. STABILITY CHECK (Voltage vs Frequency)
        let heatScore = (d.freq / 1000) * d.volts;
        let stability = "Stable";
        let color = "#00ff88"; // Success Green

        if (d.gen === 'DDR4' && d.volts > 1.5) { stability = "Overvolted"; color = "#ff4444"; } // Danger Red
        if (d.gen === 'DDR5' && d.volts > 1.4) { stability = "Unsafe"; color = "#ff4444"; }

        // 5. FINAL SCORE
        let score = (effectiveBandwidth * 2) + (d.size * 0.5);
        if (trueLatency < 10) score += 50;
        if (trueLatency > 15) score -= 20;

        score = Math.floor(score);

        const display = document.getElementById('ram-live-stats');
        if (display) {
            display.innerHTML = `
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Bandwidth:</span> <b style="color:var(--accent)">${effectiveBandwidth.toFixed(1)} GB/s</b></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>True Latency:</span> <b>${trueLatency.toFixed(2)} ns</b></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Efficiency:</span> <b>${(efficiency * 100).toFixed(0)}%</b></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Status:</span> <b style="color:${color}">${stability}</b></li>
                <li style="display:flex; justify-content:space-between; border-top:1px solid #444; padding-top:4px;"><span>Memory Score:</span> <b style="color:var(--accent)">${score}</b></li>
            `;
        }

        return { score, effectiveBandwidth, trueLatency, stability };
    },

    scrapeData: function () {
        const get = (id) => {
            const el = document.getElementById(id);
            if (!el) return 0;
            // Handle Dropdowns explicitly
            if (el.tagName === 'SELECT') return isNaN(Number(el.value)) ? el.value : Number(el.value);
            return parseFloat(el.value) || 0;
        };

        return {
            name: document.getElementById('ram-name').value,
            gen: document.getElementById('ram-gen').value, // Explicit string
            size: get('ram-size'),
            freq: get('ram-freq'),
            cl: get('ram-cl'),
            volts: get('ram-volts'),
            channels: get('ram-channels'),
            price: get('ram-price'),
            year: get('ram-year')
        };
    },

    // --- 4. DATABASE & SAVE LOGIC ---
    refreshLineup: function () {
        const container = document.getElementById('active-ram-list');
        if (!container || !window.sys) return;

        const db = window.sys.load();
        const activeRAM = db.inventory.filter(i => i.type === 'RAM' && i.active === true);

        if (activeRAM.length === 0) {
            container.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:#555; padding:10px;">No active Memory Modules.</div>`;
            return;
        }

        container.innerHTML = activeRAM.map(ram => {
            const specs = ram.specs || {};
            return `
            <div style="background:rgba(255,255,255,0.05); border:1px solid #333; padding:10px; border-radius:4px; display:flex; flex-direction:column; gap:5px;">
                <div style="font-weight:bold; color:var(--accent); font-size:0.9rem;">${ram.name}</div>
                <div style="font-size:0.75rem; color:#aaa;">
                    <div>${specs.Speed || 'N/A'} | ${specs.Capacity || 'N/A'}</div>
                    <div style="margin-top:2px; color:#fff;">$${ram.raw?.price || 0}</div>
                </div>
                
                <div style="display:flex; gap:5px; margin-top:5px;">
                    <button onclick="window.cloneToArchitect(${ram.id})" 
                        style="flex:1; background:rgba(0, 230, 118, 0.1); color:var(--accent-success); border:1px solid var(--accent-success); font-size:0.7rem; padding:4px; cursor:pointer; border-radius:3px;">
                        CLONE
                    </button>
                    <button onclick="window.sys.discontinue(${ram.id})" 
                        style="flex:1; background:transparent; color:#ff4444; border:1px solid #522; font-size:0.7rem; padding:4px; cursor:pointer; border-radius:3px;">
                        DISCONTINUE
                    </button>
                </div>
            </div>
            `;
        }).join('');
    },

    saveSystem: function () {
        if (!window.sys || !window.sys.saveDesign) {
            alert("Error: Save system not found!");
            return;
        }

        const data = this.scrapeData();
        const results = this.updatePhysics();

        window.sys.saveDesign('RAM', {
            name: data.name,

            // Display Specs
            specs: {
                "Type": data.gen,
                "Speed": `${data.gen}-${data.freq} CL${data.cl}`,
                "Capacity": `${data.size}GB`,
                "Bandwidth": window.sys ? window.sys.formatUnits(results.effectiveBandwidth, 'GB/s') : `${results.effectiveBandwidth.toFixed(1)} GB/s`,
                "Latency": `${results.trueLatency.toFixed(1)} ns`,
                "Score": results.score
            },

            // Raw Data
            price: data.price,
            year: data.year,
            ...data
        });

        this.refreshLineup();
    }
};