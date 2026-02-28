/* HARDWARE TYCOON: GPU ARCHITECT
 * PHYSICS ENGINE V3.0 (Advanced Bottlenecks & Thermal Curves)
 * Optimized for Flat Structure
 */

window.gpu = {
    
    // --- 1. PRESETS ---
    presets: {
        'Entry 1080p': { sh: 1280, clk: 1.8, ipc: 1.0, node: 7, vram: 4, bus: 96, mclk: 12000, tmus: 64, rops: 32, rt: 0, ten: 0, cool: 100, tdp: 120, volt: 0.9, price: 199 },
        'Mid 1440p': { sh: 3584, clk: 2.1, ipc: 1.2, node: 5, vram: 12, bus: 192, mclk: 16000, tmus: 112, rops: 64, rt: 28, ten: 112, cool: 200, tdp: 200, volt: 1.0, price: 499 },
        'High 4K': { sh: 8192, clk: 2.5, ipc: 1.3, node: 4, vram: 16, bus: 256, mclk: 20000, tmus: 256, rops: 96, rt: 72, ten: 288, cool: 350, tdp: 320, volt: 1.05, price: 999 },
        'Flagship AI': { sh: 16384, clk: 2.6, ipc: 1.5, node: 3, vram: 24, bus: 384, mclk: 24000, tmus: 512, rops: 192, rt: 128, ten: 512, cool: 450, tdp: 450, volt: 1.1, price: 1999 }
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
                        `<button style="background:#333; color:#fff; border:1px solid #555; padding:5px 10px; cursor:pointer; font-size:0.8rem;" onclick="window.gpu.loadPreset('${k}')">${k}</button>`
                    ).join('')}
                </div>

                <div class="panel">
                    <h3>Identity & Process</h3>
                    <div class="input-group">
                        <label>Model Name</label>
                        <input type="text" id="gpu-name" value="GTX 1080 Ti">
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Process (nm)</label>
                            <input type="number" id="gpu-node" value="16" min="1">
                        </div>
                        <div class="input-group">
                            <label>Voltage (V)</label>
                            <input type="number" id="gpu-volt" value="1.0" step="0.05">
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>Compute Cluster</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>FP32 Cores</label>
                            <input type="number" id="gpu-shaders" value="3584">
                        </div>
                        <div class="input-group">
                            <label>Clock (GHz)</label>
                            <input type="number" id="gpu-clock" value="1.6" step="0.1">
                        </div>
                    </div>
                    <div class="input-group" style="margin-top:10px;">
                        <label>IPC (Instr/Clock)</label>
                        <input type="number" id="gpu-ipc" value="1.0" step="0.1">
                    </div>
                </div>

                <div class="panel">
                    <h3>Memory System</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>VRAM (GB)</label>
                            <input type="number" id="gpu-vram" value="11">
                        </div>
                        <div class="input-group">
                            <label>Bus Width (bits)</label>
                            <input type="number" id="gpu-bus" value="352" step="32">
                        </div>
                    </div>
                    <div class="input-group" style="margin-top:10px;">
                        <label>Mem Clock (MHz)</label>
                        <input type="number" id="gpu-mclk" value="11000" step="100">
                    </div>
                </div>

                <div class="panel">
                    <h3>Pipeline</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>TMUs</label>
                            <input type="number" id="gpu-tmus" value="224">
                        </div>
                        <div class="input-group">
                            <label>ROPs</label>
                            <input type="number" id="gpu-rops" value="88">
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px;">
                        <div class="input-group">
                            <label>RT Cores</label>
                            <input type="number" id="gpu-rt" value="0">
                        </div>
                        <div class="input-group">
                            <label>Tensor Cores</label>
                            <input type="number" id="gpu-tensor" value="0">
                        </div>
                    </div>
                </div>

                <div class="panel" style="border-color: var(--accent-secondary);">
                    <h3>Thermal Solution</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Cooler Cap (W)</label>
                            <input type="number" id="gpu-cool" value="250">
                        </div>
                        <div class="input-group">
                            <label>TDP Target (W)</label>
                            <input type="number" id="gpu-tdp" value="250">
                        </div>
                    </div>
                </div>

                <div class="panel" style="border-color: var(--accent-success);">
                    <h3>Release & Pricing</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Launch Year</label>
                            <input type="number" id="gpu-year" value="${currentYear}">
                        </div>
                        <div class="input-group">
                            <label>Price ($)</label>
                            <input type="number" id="gpu-price" value="699">
                        </div>
                    </div>

                    <div style="margin-top:15px; background:rgba(0,0,0,0.3); padding:10px; border-radius:4px; margin-bottom:15px;">
                        <ul id="gpu-live-stats" style="list-style:none; padding:0; margin:0; font-size:0.8rem; color:#ccc;">
                            </ul>
                    </div>

                    <button class="btn-action" onclick="window.gpu.saveSystem()">
                        MANUFACTURE & RELEASE
                    </button>
                </div>

                <div class="panel" style="grid-column: 1 / -1; border-color: #444;">
                    <h3 style="border-bottom:1px solid #444; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                        Active Lineup
                        <button onclick="window.gpu.refreshLineup()" style="background:none; border:none; color:#888; cursor:pointer; font-size:0.7rem;">↻ Refresh</button>
                    </h3>
                    
                    <div id="active-gpu-list" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap:10px;">
                        <div style="padding:10px; color:#555;">Loading market data...</div>
                    </div>
                </div>

            </div>
        `;

        // Bind Events
        container.querySelectorAll('input').forEach(el => {
            el.addEventListener('input', () => this.updatePreview());
        });
        
        this.updatePreview();
        this.refreshLineup();
    },

    loadPreset: function(name) {
        const p = this.presets[name];
        if(!p) return;
        
        const set = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };

        set('gpu-name', name + " Edition");
        set('gpu-shaders', p.sh); set('gpu-clock', p.clk); set('gpu-ipc', p.ipc);
        set('gpu-node', p.node); set('gpu-vram', p.vram); set('gpu-bus', p.bus);
        set('gpu-mclk', p.mclk); set('gpu-tmus', p.tmus); set('gpu-rops', p.rops);
        set('gpu-rt', p.rt); set('gpu-tensor', p.ten);
        set('gpu-cool', p.cool); set('gpu-tdp', p.tdp); set('gpu-volt', p.volt);
        set('gpu-price', p.price);
        
        this.updatePreview();
    },

    // --- 3. PHYSICS ENGINE V3 ---
    updatePreview: function() {
        const d = this.scrapeData();
        
        // --- A. MEMORY BOTTLENECK ---
        // Formula: (Bus Width * Memory Clock) / 8 bits = MB/s -> /1000 = GB/s
        const bandwidth = (d.bus * d.mclk) / 8000; 
        
        // Core Compute Potential (Raw TFLOPS * IPC)
        // FIXED: Don't floor this at 1.0, or small GPUs break the ratio
        const rawCompute = (d.sh * d.clk * 2 * d.ipc) / 1000;
        const safeCompute = rawCompute > 0 ? rawCompute : 0.0001; // Avoid divide by zero
        
        // Feed Ratio: GB/s per TFLOP. 
        // Modern GPUs (RTX 4090) are around 12.0 ratio. Older were 30+.
        // ADJUSTED: Threshold lowered from 20 to 12 to reflect modern efficiency.
        const feedRatio = bandwidth / safeCompute;
        let memPenalty = 1.0;
        
        if (feedRatio < 12) {
            // Smoother curve, less punishing immediately
            memPenalty = Math.max(0.6, feedRatio / 12); 
        }

        // --- B. VRAM PENALTY ---
        // If VRAM is too low for the Compute Power, punish performance.
        let vramPenalty = 1.0;
        const requiredVram = rawCompute > 20 ? 12 : (rawCompute > 10 ? 8 : 4);
        
        if (d.vram < requiredVram) {
            vramPenalty = 1.0 - ((requiredVram - d.vram) * 0.05);
            vramPenalty = Math.max(0.5, vramPenalty);
        }

        // --- C. POWER & THERMALS ---
        const effFactor = Math.sqrt(14 / d.node); 
        
        // Base Power Components
        const corePwr = (d.sh * d.clk * Math.pow(d.volt, 2) * 0.004) / effFactor;
        const memPwr = (d.vram * 0.5) + (bandwidth * 0.1); 
        const socPwr = 25; 
        
        const totalPwr = corePwr + memPwr + socPwr;
        
        // Thermal Curve
        const ambient = 30;
        const loadRatio = totalPwr / d.cool;
        let thermalDelta = 0;

        if (loadRatio <= 0.8) {
            thermalDelta = loadRatio * 40; 
        } else {
            // Exponential at high load
            thermalDelta = 40 + Math.pow((loadRatio - 0.8) * 5, 2) * 30;
        }
        
        let temp = ambient + thermalDelta;

        // Throttling Logic
        let throttle = 1.0;
        let statusColor = "#00ff88"; // Success Green

        if (totalPwr > d.tdp) {
            throttle = d.tdp / totalPwr;
            statusColor = "#ffaa00"; // Warning Orange
        }
        
        if (temp > 90) {
            const thermalThrottle = 90 / temp;
            if (thermalThrottle < throttle) {
                throttle = thermalThrottle;
                statusColor = "#ff4444"; // Danger Red
            }
            temp = 90;
        }

        // --- D. FINAL SCORE ---
        const effectiveClock = d.clk * throttle;
        const tflops = (d.sh * effectiveClock * 2 * d.ipc) / 1000;
        
        // Gaming Score: TFLOPS + Fill Rates + Penalties
        const pixelFill = d.rops * effectiveClock;
        const texFill = d.tmus * effectiveClock;
        
        let score = (tflops * 100) + (pixelFill * 0.5) + (texFill * 0.2);
        score *= memPenalty;
        score *= vramPenalty;
        
        score = Math.floor(score);

        // UI Updates
        const display = document.getElementById('gpu-live-stats');
        if (display) {
            const memStatus = memPenalty < 0.9 ? `Bottleneck` : "Good";

            display.innerHTML = `
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Performance:</span> <b style="color:var(--accent)">${tflops.toFixed(2)} TFLOPS</b></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Bandwidth:</span> <b>${bandwidth.toFixed(0)} GB/s</b> <span style="font-size:0.7em; color:${memPenalty<0.9?'#f55':'#888'}">${memStatus}</span></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Power Draw:</span> <b>${(totalPwr * throttle).toFixed(0)}W</b> <span style="font-size:0.7em">/ ${d.tdp}W TDP</span></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Temp:</span> <b style="color:${statusColor}">${temp.toFixed(0)}°C</b></li>
                <li style="display:flex; justify-content:space-between; border-top:1px solid #444; padding-top:4px;"><span>Gaming Score:</span> <b style="color:var(--accent)">${score}</b></li>
            `;
        }
        
        return { score, tflops, temp, bandwidth };
    },

    scrapeData: function() {
        const get = (id) => {
            const el = document.getElementById(id);
            return el ? (parseFloat(el.value) || 0) : 0;
        };
        return {
            name: document.getElementById('gpu-name') ? document.getElementById('gpu-name').value : 'Unknown GPU',
            node: get('gpu-node'),
            price: get('gpu-price'),
            year: get('gpu-year'),
            sh: get('gpu-shaders'),
            clk: get('gpu-clock'),
            ipc: get('gpu-ipc'),
            volt: get('gpu-volt'),
            vram: get('gpu-vram'),
            bus: get('gpu-bus'),
            mclk: get('gpu-mclk'),
            tmus: get('gpu-tmus'),
            rops: get('gpu-rops'),
            rt: get('gpu-rt'),
            ten: get('gpu-tensor'),
            cool: get('gpu-cool'),
            tdp: get('gpu-tdp')
        };
    },

    // --- 4. DATABASE & SAVE LOGIC ---
    refreshLineup: function() {
        const container = document.getElementById('active-gpu-list');
        if(!container || !window.sys) return;

        const db = window.sys.load();
        const activeGPUs = db.inventory.filter(i => i.type === 'GPU' && i.active === true);

        if(activeGPUs.length === 0) {
            container.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:#555; padding:10px;">No active GPUs.</div>`;
            return;
        }

        container.innerHTML = activeGPUs.map(gpu => {
            const specs = gpu.specs || {};
            return `
            <div style="background:rgba(255,255,255,0.05); border:1px solid #333; padding:10px; border-radius:4px; display:flex; flex-direction:column; gap:5px;">
                <div style="font-weight:bold; color:var(--accent); font-size:0.9rem;">${gpu.name}</div>
                <div style="font-size:0.75rem; color:#aaa;">
                    <div>${specs.VRAM || 'N/A'} | ${specs.Clock || 'N/A'}</div>
                    <div style="margin-top:2px; color:#fff;">$${gpu.raw?.price || 0}</div>
                </div>
                
                <button onclick="window.sys.discontinue(${gpu.id})" 
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
        const results = this.updatePreview();

        window.sys.saveDesign('GPU', {
            name: data.name,
            
            // Display Specs
            specs: {
                "VRAM": `${data.vram}GB ${data.bus}-bit`,
                "Clock": `${data.clk} GHz`,
                "Config": `${data.sh} Cores`,
                "TDP": `${data.tdp}W`,
                "Perf": `${results.tflops.toFixed(1)} TFLOPS`,
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