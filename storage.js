/* HARDWARE TYCOON: STORAGE ARCHITECT
 * PHYSICS ENGINE V1.0 (Throughput, Seek Time & Interface Bottlenecks)
 * Optimized for Flat Structure
 */

window.storage = {

    // --- 1. PRESETS ---
    presets: {
        'Retro HDD (1990)': { type: 'HDD', form: '3.5"', inter: 'IDE', cap: 0.5, speed: 10, rpm: 5400, cache: 2, price: 150 },
        'Standard HDD (2005)': { type: 'HDD', form: '3.5"', inter: 'SATA2', cap: 500, speed: 80, rpm: 7200, cache: 32, price: 60 },
        'VelociRaptor (2010)': { type: 'HDD', form: '3.5"', inter: 'SATA3', cap: 1000, speed: 150, rpm: 10000, cache: 64, price: 120 },
        'Early SSD (2012)': { type: 'SSD', form: '2.5"', inter: 'SATA3', cap: 128, speed: 450, cell: 'MLC', cache: 256, price: 100 },
        'NVMe Gen3 (2018)': { type: 'SSD', form: 'M.2', inter: 'Gen3', cap: 1000, speed: 3500, cell: 'TLC', cache: 1024, price: 130 },
        'NVMe Gen5 (2024)': { type: 'SSD', form: 'M.2', inter: 'Gen5', cap: 4000, speed: 12000, cell: 'TLC', cache: 4096, price: 300 },
        'Holo-Glass (2040)': { type: 'SSD', form: 'Crystal', inter: 'Optic', cap: 50000, speed: 100000, cell: 'SLC', cache: 16384, price: 2500 }
    },

    // --- 2. INTERFACE LIMITS (The Physics of Cables) ---
    // Max theoretical speed in MB/s
    interfaces: {
        'IDE': 133,
        'SATA1': 150, 'SATA2': 300, 'SATA3': 600,
        'SAS': 1200,
        'Gen3': 3500, 'Gen4': 7500, 'Gen5': 14000,
        'Gen6': 28000, 'Optic': 999999
    },

    // --- 3. UI RENDERER ---
    render: function(container) {
        if (!container) return;

        // Default year
        const currentYear = new Date().getFullYear();

        container.innerHTML = `
            <div class="architect-container">
                
                <div style="grid-column: 1 / -1; display:flex; gap:10px; margin-bottom:10px; flex-wrap:wrap;">
                    ${Object.keys(this.presets).map(k => 
                        `<button style="background:#333; color:#fff; border:1px solid #555; padding:5px 10px; cursor:pointer; font-size:0.8rem;" onclick="window.storage.loadPreset('${k}')">${k}</button>`
                    ).join('')}
                </div>

                <div class="panel">
                    <h3>Identity & Type</h3>
                    <div class="input-group">
                        <label>Model Name</label>
                        <input type="text" id="sto-name" value="Barracuda X">
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Technology</label>
                            <select id="sto-type" onchange="window.storage.toggleInputs()">
                                <option value="HDD">HDD (Mechanical)</option>
                                <option value="SSD">SSD (Flash)</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Interface (Cable)</label>
                            <select id="sto-inter">
                                <option value="IDE">IDE (Ribbon)</option>
                                <option value="SATA1">SATA I</option>
                                <option value="SATA2">SATA II</option>
                                <option value="SATA3">SATA III</option>
                                <option value="Gen3">PCIe Gen 3</option>
                                <option value="Gen4">PCIe Gen 4</option>
                                <option value="Gen5">PCIe Gen 5</option>
                                <option value="Gen6">PCIe Gen 6</option>
                                <option value="Optic">Optical Crystal</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>Performance Specs</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Capacity (GB)</label>
                            <input type="number" id="sto-cap" value="1000">
                        </div>
                        <div class="input-group">
                            <label>Max Read (MB/s)</label>
                            <input type="number" id="sto-speed" value="150">
                        </div>
                    </div>
                    <div class="input-group" style="margin-top:10px;">
                        <label>DRAM Cache (MB)</label>
                        <input type="number" id="sto-cache" value="64">
                    </div>
                </div>

                <div class="panel" id="tech-specific-panel">
                    <div id="mech-box">
                        <h3>Mechanical (HDD)</h3>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                            <div class="input-group">
                                <label>RPM Speed</label>
                                <select id="sto-rpm">
                                    <option value="5400">5400 RPM</option>
                                    <option value="7200" selected>7200 RPM</option>
                                    <option value="10000">10,000 RPM</option>
                                    <option value="15000">15,000 RPM (Server)</option>
                                </select>
                            </div>
                            <div class="input-group">
                                <label>Noise Level</label>
                                <input type="text" disabled value="Audible" id="sto-noise" style="border:none; background:transparent; color:var(--accent);">
                            </div>
                        </div>
                    </div>

                    <div id="flash-box" style="display:none;">
                        <h3>Flash (SSD)</h3>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                            <div class="input-group">
                                <label>Cell Type</label>
                                <select id="sto-cell">
                                    <option value="SLC">SLC (Fastest/$$$)</option>
                                    <option value="MLC">MLC (Pro)</option>
                                    <option value="TLC" selected>TLC (Standard)</option>
                                    <option value="QLC">QLC (Slow/Cheap)</option>
                                    <option value="DNA">DNA Helix (Future)</option>
                                </select>
                            </div>
                            <div class="input-group">
                                <label>Endurance</label>
                                <input type="text" disabled value="High" id="sto-life" style="border:none; background:transparent; color:var(--accent);">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="panel" style="border-color: var(--accent-success);">
                    <h3>Release & Pricing</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Launch Year</label>
                            <input type="number" id="sto-year" value="${currentYear}">
                        </div>
                        <div class="input-group">
                            <label>Price ($)</label>
                            <input type="number" id="sto-price" value="89">
                        </div>
                    </div>

                    <div style="margin-top:15px; background:rgba(0,0,0,0.3); padding:10px; border-radius:4px; margin-bottom:15px;">
                        <ul id="sto-live-stats" style="list-style:none; padding:0; margin:0; font-size:0.8rem; color:#ccc;">
                            </ul>
                    </div>

                    <button class="btn-action" onclick="window.storage.saveSystem()">
                        MANUFACTURE & RELEASE
                    </button>
                </div>

                <div class="panel" style="grid-column: 1 / -1; border-color: #444;">
                    <h3 style="border-bottom:1px solid #444; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                        Active Lineup
                        <button onclick="window.storage.refreshLineup()" style="background:none; border:none; color:#888; cursor:pointer; font-size:0.7rem;">↻ Refresh</button>
                    </h3>
                    
                    <div id="active-storage-list" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap:10px;">
                        <div style="padding:10px; color:#555;">Loading market data...</div>
                    </div>
                </div>

            </div>
        `;

        // Listeners
        container.querySelectorAll('input, select').forEach(el => {
            el.addEventListener('input', () => this.updatePhysics());
        });
        
        this.toggleInputs(); // Initial Toggle
        this.updatePhysics();
        this.refreshLineup();
    },

    toggleInputs: function() {
        const type = document.getElementById('sto-type').value;
        const hddBox = document.getElementById('mech-box');
        const ssdBox = document.getElementById('flash-box');

        if(type === 'HDD') {
            hddBox.style.display = 'block';
            ssdBox.style.display = 'none';
        } else {
            hddBox.style.display = 'none';
            ssdBox.style.display = 'block';
        }
        this.updatePhysics();
    },

    loadPreset: function(name) {
        const p = this.presets[name];
        if(!p) return;
        const set = (id, val) => { 
            const el = document.getElementById(id); 
            if(el) el.value = val; 
        };

        set('sto-name', name);
        set('sto-type', p.type);
        set('sto-inter', p.inter);
        set('sto-cap', p.cap);
        set('sto-speed', p.speed);
        set('sto-cache', p.cache);
        set('sto-price', p.price);

        if(p.type === 'HDD') set('sto-rpm', p.rpm);
        if(p.type === 'SSD') set('sto-cell', p.cell);

        this.toggleInputs();
    },

    // --- 4. PHYSICS ENGINE ---
    updatePhysics: function() {
        const d = this.scrapeData();
        
        // 1. INTERFACE BOTTLENECK
        // Example: Plugging a 5000MB/s SSD into a SATA (600MB/s) port.
        const maxInterfaceSpeed = this.interfaces[d.inter] || 999999;
        let realSpeed = Math.min(d.speed, maxInterfaceSpeed);
        
        let bottleneck = false;
        if (d.speed > maxInterfaceSpeed) bottleneck = true;

        // 2. SEEK TIME (Latency)
        let seekTime = 0;
        let iops = 0; 

        if (d.type === 'HDD') {
            const rpm = parseInt(document.getElementById('sto-rpm').value);
            // Physics: Higher RPM = Lower Latency
            seekTime = (60000 / rpm) / 2 + 2; 
            iops = (rpm / 60) * 1.5; 
            
            const noiseEl = document.getElementById('sto-noise');
            if(noiseEl) noiseEl.value = rpm > 7200 ? "Loud Whine" : "Humming";
        } else {
            // SSD Physics
            seekTime = 0.05; // 50 microseconds
            iops = (realSpeed * 10) + (d.cache * 5);
            
            const cell = document.getElementById('sto-cell').value;
            const lifeMap = { 'SLC': 'Unlimited', 'MLC': 'Very High', 'TLC': 'Good', 'QLC': 'Low', 'DNA': 'Eternal' };
            const lifeEl = document.getElementById('sto-life');
            if(lifeEl) lifeEl.value = lifeMap[cell] || 'Average';
        }

        // 3. GAME LOADING SCORE
        let loadScore = (realSpeed * 0.5) + (iops * 0.1);
        if (d.type === 'HDD') loadScore /= 10; 

        // 4. PRICE EFFICIENCY
        const pricePerGB = d.price / d.cap;

        // 5. RENDER STATS
        const display = document.getElementById('sto-live-stats');
        if (display) {
            const bottleColor = bottleneck ? '#ff4444' : '#00ff88';
            const bottleText = bottleneck ? `CAPPED by ${d.inter}` : 'Unrestricted';

            display.innerHTML = `
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Real Speed:</span> <b style="color:${bottleColor}">${realSpeed.toFixed(0)} MB/s</b></li>
                <li style="text-align:right; font-size:0.7em; color:${bottleColor}; margin-top:-4px; margin-bottom:5px;">${bottleText}</li>
                
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Seek Latency:</span> <b>${seekTime.toFixed(2)} ms</b></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>IOPS:</span> <b>${Math.floor(iops).toLocaleString()}</b></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Value:</span> <b>$${pricePerGB.toFixed(2)} / GB</b></li>
                <li style="display:flex; justify-content:space-between; border-top:1px solid #444; padding-top:4px;"><span>Storage Score:</span> <b style="color:var(--accent)">${Math.floor(loadScore)}</b></li>
            `;
        }

        return { realSpeed, loadScore, bottleneck, capacity: d.cap };
    },

    scrapeData: function() {
        const get = (id) => {
            const el = document.getElementById(id);
            if (!el) return 0;
            if (el.tagName === 'SELECT') return isNaN(Number(el.value)) ? el.value : Number(el.value);
            return parseFloat(el.value) || 0;
        };

        return {
            name: document.getElementById('sto-name').value,
            type: document.getElementById('sto-type').value,
            inter: document.getElementById('sto-inter').value,
            cap: get('sto-cap'),
            speed: get('sto-speed'),
            cache: get('sto-cache'),
            price: get('sto-price'),
            year: get('sto-year')
        };
    },

    // --- 5. DATABASE & SAVE LOGIC ---
    refreshLineup: function() {
        const container = document.getElementById('active-storage-list');
        if(!container || !window.sys) return;

        const db = window.sys.load();
        const activeStorage = db.inventory.filter(i => i.type === 'Storage' && i.active === true);

        if(activeStorage.length === 0) {
            container.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:#555; padding:10px;">No active Storage Drives.</div>`;
            return;
        }

        container.innerHTML = activeStorage.map(drive => {
            const specs = drive.specs || {};
            return `
            <div style="background:rgba(255,255,255,0.05); border:1px solid #333; padding:10px; border-radius:4px; display:flex; flex-direction:column; gap:5px;">
                <div style="font-weight:bold; color:var(--accent); font-size:0.9rem;">${drive.name}</div>
                <div style="font-size:0.75rem; color:#aaa;">
                    <div>${specs.Capacity || 'N/A'} | ${specs.Speed || 'N/A'}</div>
                    <div style="margin-top:2px; color:#fff;">$${drive.raw?.price || 0}</div>
                </div>
                
                <button onclick="window.sys.discontinue(${drive.id})" 
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
        
        // Format Capacity Label
        const capLabel = data.cap >= 1000 ? (data.cap/1000).toFixed(1) + " TB" : data.cap + " GB";

        window.sys.saveDesign('Storage', {
            name: data.name,
            
            // Display Specs
            specs: {
                "Type": `${data.type} (${data.inter})`,
                "Capacity": capLabel,
                "Speed": `${results.realSpeed} MB/s`,
                "Bottleneck": results.bottleneck ? "YES" : "NO",
                "Score": Math.floor(results.loadScore)
            },
            
            // Raw Data
            price: data.price,
            year: data.year,
            ...data
        });

        this.refreshLineup();
    }
};