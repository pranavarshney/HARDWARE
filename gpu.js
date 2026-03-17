/* HARDWARE TYCOON: GPU ARCHITECT
 * PHYSICS ENGINE V3.0 (Advanced Bottlenecks & Thermal Curves)
 * Optimized for Flat Structure
 */

window.gpu = {

    // --- 1. PRESETS ---
    presets: {
        'Entry 1080p': { sh: 1280, clk: 1.8, ipc: 1.0, node: 7, vram: 4, bus: 96, mclk: 12000, tmus: 64, rops: 32, rt: 0, ten: 0, cool: 100, tdp: 120, volt: 0.9, price: 199, res: '1080p', cache: 16, driver: 90, bin: 95 },
        'Mid 1440p': { sh: 3584, clk: 2.1, ipc: 1.2, node: 5, vram: 12, bus: 192, mclk: 16000, tmus: 112, rops: 64, rt: 28, ten: 112, cool: 200, tdp: 200, volt: 1.0, price: 499, res: '1440p', cache: 48, driver: 95, bin: 100 },
        'High 4K': { sh: 8192, clk: 2.5, ipc: 1.3, node: 4, vram: 16, bus: 256, mclk: 20000, tmus: 256, rops: 96, rt: 72, ten: 288, cool: 350, tdp: 320, volt: 1.05, price: 999, res: '4K', cache: 64, driver: 100, bin: 105 },
        'Flagship AI': { sh: 16384, clk: 2.6, ipc: 1.5, node: 3, vram: 24, bus: 384, mclk: 24000, tmus: 512, rops: 192, rt: 128, ten: 512, cool: 450, tdp: 450, volt: 1.1, price: 1999, res: '8K', cache: 96, driver: 105, bin: 110 }
    },

    // --- 2. UI RENDERER ---
    render: function (container) {
        if (!container) return;

        // Default year
        const db = window.sys ? window.sys.load() : null;
        const currentYear = (db && db.gameTime) ? db.gameTime.year : 2010;

        container.innerHTML = `
            <div class="architect-container">
                
                <div style="grid-column: 1 / -1; display:flex; gap:10px; margin-bottom:10px; flex-wrap:wrap;">
                    ${Object.keys(this.presets).map(k =>
            `<button style="background:#333; color:#fff; border:1px solid #555; padding:5px 10px; cursor:pointer; font-size:0.8rem;" onclick="window.gpu.loadPreset('${k}')">${k}</button>`
        ).join('')}
                </div>

                <div class="panel">
                    <h3>Identity & Process</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Model Name</label>
                            <select id="gpu-name-model" onchange="window.gpu.onModelChange()">
                                <!-- Populated dynamically -->
                            </select>
                            <input type="text" id="gpu-name-model-new" placeholder="New Model Name" style="display:none; margin-top:5px;">
                        </div>
                        <div class="input-group">
                            <label>Version Name</label>
                            <input type="text" id="gpu-name-version" value="1080 Ti">
                        </div>
                    </div>
                    <div style="margin-top:10px;">
                        <label style="display:flex; align-items:center; gap:5px; font-size:0.8rem; color:#aaa; cursor:pointer;">
                            <input type="checkbox" id="gpu-hide-storefront"> Hide in Storefront
                        </label>
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
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px;">
                        <div class="input-group">
                            <label>Mem Clock (MHz)</label>
                            <input type="number" id="gpu-mclk" value="11000" step="100">
                        </div>
                        <div class="input-group">
                            <label>L2/Infinity Cache (MB)</label>
                            <input type="number" id="gpu-cache" value="16">
                        </div>
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
                    <div style="display:grid; grid-template-columns: 1fr; gap:10px;">
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
        this.populateModelList();
    },

    populateModelList: function() {
        const select = document.getElementById('gpu-name-model');
        const newModelInput = document.getElementById('gpu-name-model-new');
        if (!select || !window.sys) return;
        const db = window.sys.load();
        const models = new Set();
        db.inventory.filter(i => i.type === 'GPU').forEach(i => {
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
            newModelInput.style.display = 'block';
            newModelInput.focus();
        } else {
            select.value = Array.from(models).sort()[0]; // Select the first model alphabetically
            newModelInput.style.display = 'none';
        }
    },

    onModelChange: function() {
        const modelSelect = document.getElementById('gpu-name-model');
        const newModelInput = document.getElementById('gpu-name-model-new');
        if (!modelSelect || !window.sys) return;
        
        const modelName = modelSelect.value;
        
        if (modelName === "NEW") {
            newModelInput.style.display = 'block';
            newModelInput.focus();
            // Clear version name when creating a new model
            document.getElementById('gpu-name-version').value = "";
            return;
        } else {
            newModelInput.style.display = 'none';
        }
        
        const db = window.sys.load();
        
        const matches = db.inventory.filter(i => i.type === 'GPU' && i.raw && i.raw.modelName === modelName);
        if (matches.length > 0) {
            matches.sort((a,b) => b.id - a.id);
            const latest = matches[0];
            this.loadBase(latest.raw);
            // The loadBase function will set the model and version names
            if (window.showToast) window.showToast(`Auto-cloned specs from ${latest.name}`, "info");
        }
    },

    loadPreset: function (name) {
        const p = this.presets[name];
        if (!p) return;

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };

        // When loading a preset, it's usually for a new design, so set model to NEW
        const modelSelect = document.getElementById('gpu-name-model');
        const newModelInput = document.getElementById('gpu-name-model-new');
        if (modelSelect) modelSelect.value = "NEW";
        if (newModelInput) {
            newModelInput.style.display = 'block';
            newModelInput.value = name; // Suggest preset name as new model name
        }
        set('gpu-name-version', "Edition"); // Default version for presets

        set('gpu-shaders', p.sh); set('gpu-clock', p.clk); set('gpu-ipc', p.ipc);
        set('gpu-node', p.node); set('gpu-vram', p.vram); set('gpu-bus', p.bus);
        set('gpu-mclk', p.mclk); set('gpu-tmus', p.tmus); set('gpu-rops', p.rops);
        set('gpu-rt', p.rt); set('gpu-tensor', p.ten);
        set('gpu-cool', p.cool); set('gpu-tdp', p.tdp); set('gpu-volt', p.volt);
        set('gpu-price', p.price);
        set('gpu-res', p.res || '1440p'); set('gpu-cache', p.cache !== undefined ? p.cache : 16);
        set('gpu-driver', p.driver || 100); set('gpu-bin', p.bin || 100);

        this.updatePreview();
    },

    loadBase: function (raw) {
        const set = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };
        const setCheck = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.checked = val; };

        const modelSelect = document.getElementById('gpu-name-model');
        const newModelInput = document.getElementById('gpu-name-model-new');
        
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
                // Model name from raw data doesn't exist in the select options
                modelSelect.value = "NEW";
                newModelInput.style.display = 'block';
                newModelInput.value = raw.modelName;
            }
        } else {
            // No modelName in raw data, treat as new
            modelSelect.value = "NEW";
            newModelInput.style.display = 'block';
            newModelInput.value = raw.name; // Use full name as suggested new model name
        }

        set('gpu-name-version', raw.versionName || "");
        setCheck('gpu-hide-storefront', raw.hideStorefront);
        set('gpu-node', raw.node);
        set('gpu-price', raw.price);
        set('gpu-shaders', raw.sh);
        set('gpu-clock', raw.clk);
        set('gpu-ipc', raw.ipc);
        set('gpu-volt', raw.volt);
        set('gpu-vram', raw.vram);
        set('gpu-bus', raw.bus);
        set('gpu-mclk', raw.mclk);
        set('gpu-tmus', raw.tmus);
        set('gpu-rops', raw.rops);
        set('gpu-rt', raw.rt);
        set('gpu-tensor', raw.ten);
        set('gpu-cool', raw.cool);
        set('gpu-tdp', raw.tdp);
        set('gpu-res', raw.res || '1440p');
        set('gpu-cache', raw.cache !== undefined ? raw.cache : 16);
        set('gpu-driver', raw.driver || 100);
        set('gpu-bin', raw.bin || 100);

        this.updatePreview();
    },

    // --- 3. PHYSICS ENGINE V3 ---
    updatePreview: function () {
        const d = this.scrapeData();

        // --- 14. Bin Quality ---
        const binQuality = (d.bin || 100) / 100;

        // --- 11. Driver Quality ---
        const driverEff = (d.driver || 100) / 100;

        // --- 8. Frequency Scaling Curve ---
        let boostClock = d.clk * (1 + (d.volt - 1.0) * 0.5) * binQuality;

        // --- A. HARDWARE SYNERGY & BOTTLENECKS (Physics & Ratio Driven) ---
        
        // 1. Raw Compute Baseline (TFLOPS)
        const rawCompute = (d.sh * boostClock * 2 * (d.ipc || 1.0)) / 1000;
        const safeCompute = rawCompute > 0 ? rawCompute : 0.0001;

        // 2. Effective Bandwidth (Bus + Cache)
        const rawBandwidth = (d.bus * d.mclk) / 8000;
        const cacheMB = d.cache || 0;
        // Cache massively reduces reliance on raw memory bus (e.g., Infinity Cache effect)
        const cacheMultiplier = 1 + (cacheMB / 32); 
        const effectiveBandwidth = rawBandwidth * cacheMultiplier;

        // 3. Bandwidth Bottleneck (Does the memory feed the cores fast enough?)
        // Real-world physics: ~15 GB/s is needed to comfortably feed 1 TFLOP of compute.
        const requiredBandwidth = safeCompute * 15;
        const bandwidthEfficiency = Math.min(1.0, effectiveBandwidth / requiredBandwidth);

        // 4. VRAM Capacity Bottleneck (Driven by Compute, not the Year!)
        // A high-TFLOP card processes heavier textures and larger framebuffers.
        // Roughly 0.55GB of VRAM is needed per TFLOP for balanced rendering.
        const requiredVram = Math.max(1.0, safeCompute * 0.55);
        let vramPenalty = 1.0;
        if (d.vram < requiredVram) {
            vramPenalty = Math.max(0.4, d.vram / requiredVram); // Punish severe choking
        }

        // 5. Pipeline Bottleneck (ROPs & TMUs vs Cores)
        // Standard architecture ratios: ~1 ROP per 64 shaders, ~1 TMU per 16 shaders.
        const requiredRops = d.sh / 64;
        const requiredTmus = d.sh / 16;
        const ropEfficiency = Math.min(1.0, d.rops / Math.max(1, requiredRops));
        const tmuEfficiency = Math.min(1.0, d.tmus / Math.max(1, requiredTmus));
        const pipelineEfficiency = (ropEfficiency * 0.6) + (tmuEfficiency * 0.4);

        // 6. Overall Hardware Synergy
        const hardwareSynergy = bandwidthEfficiency * vramPenalty * pipelineEfficiency;
        
        // Ensure bandwidth variable is still exported for the UI to use later
        const bandwidth = rawBandwidth;

        // --- C. POWER, THERMALS & SILICON MODEL ---
        // --- 9. Node Scaling Split ---
        const densityFactor = Math.sqrt(14 / Math.max(d.node, 1)); 
        const efficiencyFactor = 14 / Math.max(d.node, 1);         
        const costFactor = Math.pow(14 / Math.max(d.node, 1), 1.5);

        const baseArea = (d.sh * 0.02) + (d.vram * 2) + (d.bus * 0.1) + (d.rt * 0.5) + (d.ten * 0.1) + (cacheMB * 1.5) + 20;
        const dieArea = baseArea / densityFactor;
        const defectRate = dieArea / 500;
        const baseYieldRate = Math.exp(-defectRate);
        const yieldRate = Math.max(0.01, Math.min(0.99, baseYieldRate * (2 - binQuality)));
        const waferCost = 3000 * costFactor;
        const chipsPerWafer = Math.floor(70000 / dieArea);
        const estCostPerChip = waferCost / Math.max(1, (chipsPerWafer * yieldRate));

        // --- Effective capacitance (Sub-linear scaling for core clustering) ---
        // Flattened shader impact prevents massive bloat in late-game architectures
        const coreCapacitance = Math.pow(d.sh, 0.45) * 4.5;
        const capacitance = coreCapacitance + (d.cache * 0.6) + (d.bus * 0.15) + 15;

        // --- Activity factor ---
        const activity = 0.6; // Stabilized base activity

        // --- Node scaling (efficiency) ---
        // Normalized around 28nm, steep efficiency curve for extreme nodes
        const nodeFactor = Math.pow(d.node / 28, 0.85);

        // --- Dynamic power (core dominated) ---
        // Retained physical V^2 scaling
        const dynamicPower = 
            activity * capacitance * Math.pow(d.volt, 2) * Math.pow(d.clk, 1.5) * nodeFactor * 0.9;

        // --- Memory power ---
        const memoryPower = (d.vram * 0.5) + (bandwidth * 0.12);

        // --- Leakage ---
        // Kept your quantum tunneling penalty for small nodes
        const leakage = capacitance * (d.node <= 5 ? 0.06 : 0.025);

        // --- Total ---
        // Increased base board power, lowered multiplier to balance massive cards
        const totalTDP = (dynamicPower + memoryPower + leakage + 25) * 1.08;
        const totalPwr = totalTDP;

        // --- 7. Thermal Mass ---
        const ambient = 30;
        const heatDissipationRate = d.cool || 250;
        const loadRatio = totalPwr / Math.max(1, heatDissipationRate);
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

        if (temp > 80) { boostClock *= 0.9; } // Soft thermal limit

        if (temp > 95) {
            const thermalThrottle = 95 / temp;
            if (thermalThrottle < throttle) {
                throttle = thermalThrottle;
                statusColor = "#ff4444"; // Danger Red
            }
            temp = 95;
        }

        // --- D. PIPELINE & WORKLOAD SCORING ---
        const effectiveClock = boostClock * throttle;
        const tflops = (d.sh * effectiveClock * 2) / 1000;
        const pixelOps = d.rops * effectiveClock; 
        const texOps = d.tmus * effectiveClock;  

        // --- 10. RT & Tensor Scaling ---
        const rtGenEfficiency = d.year >= 2018 ? Math.max(1, (d.year - 2017) * 0.5) * densityFactor : 0.1;
        const tensorGenEfficiency = d.year >= 2017 ? Math.max(1, (d.year - 2016) * 1.0) * densityFactor : 0.1;

        const rtOps = d.rt > 0 ? d.rt * effectiveClock * rtGenEfficiency : 0; 
        const tensorOps = d.ten > 0 ? d.ten * effectiveClock * tensorGenEfficiency : 0;

        // --- 1. IPC Oversimplified ---
        let utilization = 0.95 - (d.sh / 50000);
        utilization = Math.max(0.6, Math.min(0.95, utilization));
        const baseArch = 1.0 + Math.max(0, d.year - 2010) * 0.05;
        const archEff = baseArch * d.ipc * utilization;

        // --- 2. Parallel Efficiency ---
        let parallelEff = 1 - Math.max(0, Math.log2(Math.max(1, d.sh / 1024))) * 0.05;
        parallelEff = Math.max(0.7, parallelEff);

        // --- 15. Power Delivery Limits ---
        let instabilityPenalty = 1.0;
        if (d.volt > 1.1 && d.sh > 8000) {
            instabilityPenalty = 0.9;
        }

        // --- 13. Bottleneck Stacking ---
        // Combine our new architectural synergy with driver and stability factors
        const totalPenalty = hardwareSynergy * parallelEff * instabilityPenalty * driverEff;

        // --- 12. Workload Types ---
        const rasterScore = Math.floor(((tflops * 100 * archEff) + (pixelOps * 0.5) + (texOps * 0.2)) * totalPenalty);
        const rayTracingScore = Math.floor((rasterScore * 0.5) + ((rtOps * 50) * totalPenalty));
        const aiScore = Math.floor((tflops * 20) + ((tensorOps * 80) * totalPenalty));
        const computeScore = Math.floor((tflops * 150 * parallelEff * archEff) * totalPenalty);

        const score = Math.floor(rasterScore > rayTracingScore ? rasterScore : (rasterScore * 0.8 + rayTracingScore * 0.2));

        // UI Updates
        const display = document.getElementById('gpu-live-stats');
        if (display) {
            // Dynamic Diagnostic System
            let bottleneckText = "Architecture Balanced";
            let bottleneckColor = "#00e676"; // Green
            
            if (hardwareSynergy < 0.95) {
                bottleneckColor = "#ff4444"; // Red
                // Find the worst offender to report to the player
                const minEff = Math.min(bandwidthEfficiency, vramPenalty, pipelineEfficiency);
                if (minEff === bandwidthEfficiency) bottleneckText = "Memory Bus/Cache Choked";
                else if (minEff === vramPenalty) bottleneckText = "VRAM Capacity Limited";
                else bottleneckText = "Pipeline Choked (Needs ROPs/TMUs)";
            }

            const formattedTflops = window.sys ? window.sys.formatUnits(tflops, 'TFLOPS') : `${tflops.toFixed(2)} TFLOPS`;
            const margin = d.price - estCostPerChip;
            const marginColor = margin > 0 ? '#00e676' : '#ff1744';

            display.innerHTML = `
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Performance:</span> <b style="color:var(--accent)">${formattedTflops}</b></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Bandwidth & VRAM:</span> <b>${window.sys ? window.sys.formatUnits(bandwidth, 'GB/s') : bandwidth.toFixed(0) + ' GB/s'} | ${d.vram}GB</b> <span style="font-size:0.7em; color:${bottleneckColor}">${bottleneckText}</span></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Sys. Power Draw:</span> <b>${totalPwr.toFixed(0)}W</b> <span style="font-size:0.7em">/ ${window.sys ? window.sys.formatUnits(d.tdp, 'W') : d.tdp + ' W'} Cooler Limit</span></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Temp:</span> <b style="color:${statusColor}">${temp.toFixed(0)}°C</b></li>
                <li style="border-top:1px solid #444; margin-top:4px; padding-top:4px; display:flex; justify-content:space-between; font-size:0.8em; color:#888;"><span>Die Area & Yield:</span> <b>${dieArea.toFixed(0)} mm² (${(yieldRate * 100).toFixed(1)}%)</b></li>
                <li style="display:flex; justify-content:space-between; font-size:0.8em; color:#888; margin-bottom:4px;"><span>Est. Mfg Cost:</span> <b style="color:${marginColor}">$${estCostPerChip.toFixed(2)}</b></li>
                <li style="display:grid; grid-template-columns: 1fr 1fr; gap:5px; border-top:1px solid #444; padding-top:4px; margin-top:4px; font-size:0.85em;">
                    <span style="color:#aaa;">Raster: <b style="color:var(--accent)">${rasterScore}</b></span>
                    <span style="color:#aaa;">Compute: <b style="color:var(--accent)">${computeScore}</b></span>
                    <span style="color:#aaa;">RT: <b style="color:var(--accent)">${rayTracingScore}</b></span>
                    <span style="color:#aaa;">AI/Tensor: <b style="color:var(--accent)">${aiScore}</b></span>
                </li>
            `;
        }

        return { score, rasterScore, rayTracingScore, aiScore, computeScore, tflops, temp, bandwidth, pixelOps, texOps, rtOps, tensorOps, dieArea, yieldRate: (yieldRate * 100).toFixed(1), estCost: estCostPerChip.toFixed(2) };
    },

    scrapeData: function () {
        const get = (id) => {
            const el = document.getElementById(id);
            return el ? (parseFloat(el.value) || 0) : 0;
        };
        const modelSelect = document.getElementById('gpu-name-model');
        const model = modelSelect ? (modelSelect.value === 'NEW' ? document.getElementById('gpu-name-model-new').value : modelSelect.value) : "Unknown";
        const version = document.getElementById('gpu-name-version') ? document.getElementById('gpu-name-version').value : "";
        const db = window.sys ? window.sys.load() : null;
        const currentYear = (db && db.gameTime) ? db.gameTime.year : 2010;

        return {
            modelName: model,
            versionName: version,
            name: (model + " " + version).trim(),
            hideStorefront: document.getElementById('gpu-hide-storefront') ? document.getElementById('gpu-hide-storefront').checked : false,
            node: get('gpu-node'),
            price: get('gpu-price'),
            year: currentYear,
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
            tdp: get('gpu-tdp'),
            res: document.getElementById('gpu-res') ? document.getElementById('gpu-res').value : '1440p',
            cache: get('gpu-cache'),
            driver: get('gpu-driver'),
            bin: get('gpu-bin')
        };
    },

    // --- 4. DATABASE & SAVE LOGIC ---
    refreshLineup: function () {
        const container = document.getElementById('active-gpu-list');
        if (!container || !window.sys) return;

        const db = window.sys.load();
        const activeGPUs = db.inventory.filter(i => i.type === 'GPU' && i.active === true);

        if (activeGPUs.length === 0) {
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
                
                <div style="display:flex; gap:5px; margin-top:5px;">
                    <button onclick="window.cloneToArchitect(${gpu.id})" 
                        style="flex:1; background:rgba(0, 230, 118, 0.1); color:var(--accent-success); border:1px solid var(--accent-success); font-size:0.7rem; padding:4px; cursor:pointer; border-radius:3px;">
                        CLONE
                    </button>
                    ${gpu.raw && gpu.raw.hideStorefront ? 
                        `<button onclick="window.sys.toggleHide(${gpu.id})" style="flex:1; background:rgba(255, 255, 255, 0.1); color:#aaa; border:1px solid #444; font-size:0.7rem; padding:4px; cursor:pointer; border-radius:3px;">UNHIDE</button>` : 
                        `<button onclick="window.sys.toggleHide(${gpu.id})" style="flex:1; background:rgba(255, 255, 255, 0.1); color:#aaa; border:1px solid #444; font-size:0.7rem; padding:4px; cursor:pointer; border-radius:3px;">HIDE</button>`
                    }
                    <button onclick="window.sys.discontinue(${gpu.id})" 
                        style="flex:1; background:transparent; color:#ff4444; border:1px solid #522; font-size:0.7rem; padding:4px; cursor:pointer; border-radius:3px;">
                        DISCON.
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
        const results = this.updatePreview();

        window.sys.saveDesign('GPU', {
            name: data.name,

            // Display Specs
            specs: {
                "VRAM": `${data.vram}GB ${data.bus}-bit`,
                "Clock": `${data.clk} GHz`,
                "Config": `${data.sh} Cores`,
                "TDP": window.sys ? window.sys.formatUnits(data.tdp, 'W') : `${data.tdp} W`,
                "Score": window.sys ? window.sys.formatUnits(results.tflops, 'TFLOPS') : `${results.tflops.toFixed(1)} TFLOPS`
            },

            // Stats
            benchmarks: {
                raster: results.rasterScore,
                compute: results.computeScore,
                rt: results.rayTracingScore,
                ai: results.aiScore,
                pixelOps: results.pixelOps,
                texOps: results.texOps,
                rtOps: results.rtOps,
                tensorOps: results.tensorOps
            },

            // Raw Data
            price: data.price,
            year: data.year,
            ...data
        });

        this.refreshLineup();
    }
};