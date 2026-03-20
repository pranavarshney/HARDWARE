/* HARDWARE TYCOON: CPU ARCHITECT
 */

window.cpu = {

    // --- 1. CONFIGURATION & DATA ---
    simdInstructions: [
        { name: "MMX", year: 1996, boost: 1.05 },
        { name: "SSE", year: 1999, boost: 1.10 },
        { name: "SSE2", year: 2001, boost: 1.15 },
        { name: "SSE3", year: 2004, boost: 1.20 },
        { name: "AVX", year: 2011, boost: 1.35 },
        { name: "AVX2", year: 2013, boost: 1.45 },
        { name: "AVX-512", year: 2017, boost: 1.60 },
        { name: "AMX", year: 2022, boost: 1.80 }
    ],

    segments: {
        'Desktop': { sockets: ['LGA 1851', 'AM5', 'LGA 1700', 'AM4'], pl1: 125, pl2: 253, pCores: 8, eCores: 16, pcie: 24, ram: 2, hasIgpu: true },
        'Mobile': { sockets: ['BGA 2049', 'FP8', 'BGA 1744'], pl1: 28, pl2: 65, pCores: 4, eCores: 8, pcie: 16, ram: 2, hasIgpu: true },
        'Server': { sockets: ['SP5', 'LGA 4677', 'SP3'], pl1: 300, pl2: 400, pCores: 64, eCores: 0, pcie: 128, ram: 8, hasIgpu: false },
        'Workstation': { sockets: ['LGA 4677', 'sTR5'], pl1: 250, pl2: 350, pCores: 24, eCores: 0, pcie: 64, ram: 4, hasIgpu: false },
        'Console APU': { sockets: ['Custom BGA'], pl1: 120, pl2: 150, pCores: 8, eCores: 0, pcie: 16, ram: 4, hasIgpu: true },
        'Embedded': { sockets: ['BGA 1090', 'BGA 1310'], pl1: 10, pl2: 15, pCores: 2, eCores: 4, pcie: 8, ram: 1, hasIgpu: true }
    },

    // --- 2. UI RENDERER ---
    render: function (container) {
        if (!container) return;
        const db = window.sys ? window.sys.load() : null;
        const currentYear = (db && db.gameTime) ? db.gameTime.year : 2010;
        const defaultFab = this.estimateFab(currentYear);

        container.innerHTML = `
            <div class="architect-container">
                
                <div class="panel" style="border-color: var(--accent);">
                    <h3>Identity & Market Segment</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Market Segment</label>
                            <select id="cpu-segment" onchange="window.cpu.applySegmentDefaults()">
                                ${Object.keys(this.segments).map(s => `<option value="${s}">${s}</option>`).join('')}
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Architecture / Gen Name</label>
                            <input type="text" id="cpu-arch" value="Lion Cove" placeholder="e.g. Zen 5">
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Model Name</label>
                            <select id="cpu-name-model" onchange="window.cpu.onModelChange()">
                                <!-- Populated dynamically -->
                            </select>
                            <input type="text" id="cpu-name-model-new" placeholder="New Model Name" style="display:none; margin-top:5px;">
                        </div>
                        <div class="input-group">
                            <label>Version Name</label>
                            <input type="text" id="cpu-name-version" value="285K">
                        </div>
                    </div>
                    <div style="margin-top:10px;">
                        <label style="display:flex; align-items:center; gap:5px; font-size:0.8rem; color:#aaa; cursor:pointer;">
                            <input type="checkbox" id="cpu-hide-storefront"> Hide in Storefront
                        </label>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Socket</label>
                            <select id="cpu-socket"></select>
                        </div>
                        <div class="input-group">
                            <label>Process Node (nm)</label>
                            <input type="number" id="cpu-fab" value="${defaultFab}" min="1" step="0.5">
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>P-Cores (Performance)</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group"><label>Count</label><input type="number" id="p-core-count" value="8"></div>
                        <div class="input-group"><label>Threads (SMT/HT)</label><input type="number" id="total-threads" value="32"></div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Base (GHz)</label>
                            <input type="number" id="p-base" value="3.2" step="0.1" title="Minimum guaranteed clock">
                        </div>
                        <div class="input-group">
                            <label>All-Core (GHz)</label>
                            <input type="number" id="p-allcore" value="5.2" step="0.1" title="Sustained multicore heavy load">
                        </div>
                        <div class="input-group">
                            <label>1-Core Turbo</label>
                            <input type="number" id="p-turbo" value="6.0" step="0.1" title="Absolute max burst on 1-2 cores">
                        </div>
                    </div>
                </div>

                <div class="panel" id="panel-ecores">
                    <h3>E-Cores (Efficiency)</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group"><label>Count</label><input type="number" id="e-core-count" value="16"></div>
                        <div class="input-group"><label>Perf Ratio vs P-Core</label><input type="number" id="e-ratio" value="0.4" step="0.05" max="0.9"></div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px;">
                        <div class="input-group"><label>Base (GHz)</label><input type="number" id="e-base" value="2.4" step="0.1"></div>
                        <div class="input-group"><label>All-Core (GHz)</label><input type="number" id="e-allcore" value="4.0" step="0.1"></div>
                        <div class="input-group"><label>1-Core Turbo</label><input type="number" id="e-turbo" value="4.6" step="0.1"></div>
                    </div>
                </div>

                <div class="panel">
                    <h3>Uncore, Architecture & Power</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Mem Channels</label>
                            <select id="mem-channels"><option value="1">1</option><option value="2" selected>2</option><option value="4">4</option><option value="8">8</option><option value="12">12</option></select>
                        </div>
                        <div class="input-group">
                            <label>PCIe Lanes</label>
                            <select id="pcie-lanes"><option value="8">8</option><option value="16">16</option><option value="24" selected>24</option><option value="48">48</option><option value="64">64</option><option value="128">128</option></select>
                        </div>
                        <div class="input-group">
                            <label>L3 Cache (MB)</label>
                            <input type="number" id="l3-cache" value="36">
                        </div>
                    </div>
                    <div class="input-group">
                        <label>Target IPC Rating (Base 1.0)</label>
                        <input type="number" id="cpu-ipc" value="${((currentYear - 2000) * 0.05 + 1.2).toFixed(2)}" step="0.05">
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; border-top:1px solid #333; padding-top:10px;">
                        <div class="input-group">
                            <label>PL1 (Sustained W)</label>
                            <input type="number" id="cpu-pl1" value="125">
                        </div>
                        <div class="input-group">
                            <label>PL2 (Turbo Burst W)</label>
                            <input type="number" id="cpu-pl2" value="253">
                        </div>
                    </div>
                </div>

                <div class="panel" id="panel-igpu" style="border-color: #76b900;">
                    <h3 style="color:#76b900;">Integrated Graphics (iGPU)</h3>
                    <label style="display:flex; align-items:center; gap:8px; font-size:0.8rem; margin-bottom:15px; cursor:pointer;">
                        <input type="checkbox" id="igpu-enable" checked onchange="window.cpu.toggleIgpu()"> Enable On-Die GPU
                    </label>
                    <div id="igpu-inputs">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                            <div class="input-group"><label>Compute Units (CUs)</label><input type="number" id="igpu-cus" value="4"></div>
                            <div class="input-group"><label>Clock (GHz)</label><input type="number" id="igpu-clock" value="2.2" step="0.1"></div>
                        </div>
                    </div>
                </div>

                <div class="panel" style="border-color: #bd00ff;">
                    <h3 style="color:#bd00ff;">Neural Engine (NPU)</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group"><label>AI Cores</label><input type="number" id="npu-cores" value="4"></div>
                        <div class="input-group"><label>Clock (GHz)</label><input type="number" id="npu-clock" value="1.4" step="0.1"></div>
                    </div>
                    <div class="input-group"><label>Ops/Cycle</label><input type="number" id="npu-ops" value="16"></div>
                    <div style="margin-top:10px;">
                        <label style="display:flex; align-items:center; gap:5px; font-size:0.8rem; color:#aaa;">
                            <input type="checkbox" id="dedicated-ai"> Dedicated Hardware Silo
                        </label>
                    </div>
                </div>

                <div class="panel">
                    <h3>Instruction Sets</h3>
                    <div id="simd-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        ${this.renderSimdOptions(currentYear)}
                    </div>
                </div>

                <div class="panel" style="border-color: var(--accent-success);">
                    <h3>Release & Manufacturing</h3>

                    <div style="display:grid; grid-template-columns: 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Retail Price ($)</label>
                            <input type="number" id="cpu-price" value="599">
                        </div>
                    </div>

                    <div style="margin-top:15px; background:rgba(0,0,0,0.3); padding:12px; border-radius:6px; margin-bottom:15px; border:1px solid #333;">
                        <ul id="comp-live-stats" style="list-style:none; padding:0; margin:0; font-size:0.8rem; color:#ccc; font-family:var(--font-mono);">
                            <!-- Injected by physics engine -->
                        </ul>
                    </div>

                    <button class="btn-action" onclick="window.cpu.saveSystem()">
                        TAPE-OUT & MANUFACTURE
                    </button>
                </div>

                <div class="panel" style="grid-column: 1 / -1; border-color: #444;">
                    <h3 style="border-bottom:1px solid #444; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                        Active Lineup
                        <button onclick="window.cpu.refreshLineup()" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:0.7rem;">↻ Refresh</button>
                    </h3>
                    
                    <div id="active-lineup-list" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:12px;">
                        <div style="padding:10px; color:#555; font-style:italic;">Loading market data...</div>
                    </div>
                </div>

            </div>
        `;

        this.applySegmentDefaults();

        container.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
            input.addEventListener('change', () => this.updatePreview());
        });

        this.updatePreview();
        this.refreshLineup();
        this.populateModelList();
    },

    populateModelList: function() {
        const select = document.getElementById('cpu-name-model');
        const newModelInput = document.getElementById('cpu-name-model-new');
        if (!select || !window.sys) return;
        const db = window.sys.load();
        const models = new Set();
        db.inventory.filter(i => i.type === 'CPU').forEach(i => {
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
            document.getElementById('cpu-name-model-new').style.display = 'block';
        }
    },

    onModelChange: function() {
        const modelSelect = document.getElementById('cpu-name-model');
        const newModelInput = document.getElementById('cpu-name-model-new');
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
        
        const matches = db.inventory.filter(i => i.type === 'CPU' && i.raw && i.raw.modelName === modelName);
        if (matches.length > 0) {
            matches.sort((a,b) => b.id - a.id);
            const latest = matches[0];
            this.loadBase(latest.raw);
            // modelInput.value = modelName; // This line is no longer needed as loadBase handles setting the select
            document.getElementById('cpu-name-version').value = "";
            if (window.showToast) window.showToast(`Auto-cloned specs from ${latest.name}`, "info");
        }
    },

    estimateFab: function (year) {
        if (year < 1990) return 3000;
        if (year < 2000) return 250;
        if (year < 2010) return 45;
        if (year < 2020) return 14;
        return 3;
    },

    renderSimdOptions: function (year) {
        return this.simdInstructions.map(simd => {
            const isAvailable = year >= simd.year;
            return `
                <label style="display: flex; align-items: center; gap: 5px; opacity: ${isAvailable ? 1 : 0.5}; font-size: 0.75rem;">
                    <input type="checkbox" class="simd-check" value="${simd.name}" ${isAvailable ? 'checked' : ''} onchange="window.cpu.updatePreview()">
                    ${simd.name} <span style="color:#666; font-size:0.65rem;">(Max ${simd.boost}x)</span>
                </label>
            `;
        }).join('');
    },

    applySegmentDefaults: function () {
        const segName = document.getElementById('cpu-segment').value;
        const seg = this.segments[segName];
        if (!seg) return;

        const sockEl = document.getElementById('cpu-socket');
        sockEl.innerHTML = seg.sockets.map(s => `<option value="${s}">${s}</option>`).join('');

        document.getElementById('cpu-pl1').value = seg.pl1;
        document.getElementById('cpu-pl2').value = seg.pl2;
        document.getElementById('p-core-count').value = seg.pCores;
        document.getElementById('e-core-count').value = seg.eCores;
        document.getElementById('pcie-lanes').value = seg.pcie;
        document.getElementById('mem-channels').value = seg.ram;

        document.getElementById('igpu-enable').checked = seg.hasIgpu;
        this.toggleIgpu();

        this.updatePreview();
    },

    toggleIgpu: function () {
        const isEnabled = document.getElementById('igpu-enable').checked;
        document.getElementById('igpu-inputs').style.display = isEnabled ? 'block' : 'none';
        this.updatePreview();
    },

    loadBase: function (raw) {
        const set = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };
        const setCheck = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.checked = val; };

        const modelSelect = document.getElementById('cpu-name-model');
        const newModelInput = document.getElementById('cpu-name-model-new');
        
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

        set('cpu-name-version', raw.versionName || "");
        setCheck('cpu-hide-storefront', raw.hideStorefront);
        set('cpu-segment', raw.segment);
        set('cpu-arch', raw.arch);
        set('cpu-fab', raw.fab);
        set('p-core-count', raw.pCores);
        set('p-base', raw.pBase);
        set('p-allcore', raw.pAllCore);
        set('p-turbo', raw.pTurbo);
        set('e-core-count', raw.eCores);
        set('e-base', raw.eBase);
        set('e-allcore', raw.eAllCore);
        set('e-turbo', raw.eTurbo);
        set('e-ratio', raw.eRatio);
        set('total-threads', raw.threads);
        set('cpu-ipc', raw.ipc);
        set('l3-cache', raw.l3);
        set('cpu-pl1', raw.pl1);
        set('cpu-pl2', raw.pl2);
        set('mem-channels', raw.memChannels);
        set('pcie-lanes', raw.pcie);
        setCheck('igpu-enable', raw.igpuEnabled);
        set('igpu-cus', raw.igpuCus);
        set('igpu-clock', raw.igpuClock);
        set('npu-cores', raw.aiCores);
        set('npu-clock', raw.aiClock);
        set('npu-ops', raw.aiOps);
        setCheck('dedicated-ai', raw.dedicatedAI);
        set('cpu-price', raw.price);
        set('cpu-socket', raw.socket);

        // Simd checkboxes
        if (raw.simd) {
            document.querySelectorAll('.simd-check').forEach(cb => {
                cb.checked = raw.simd.some(s => s.name === cb.value);
            });
        }

        this.toggleIgpu();
        this.updatePreview();
    },

    getTierLabel: function (score, isMulti) {
        if (isMulti) {
            if (score < 5000) return `<span style="color:#aaa;">[Entry Level]</span>`;
            if (score < 15000) return `<span style="color:#00aaff;">[Mainstream]</span>`;
            if (score < 30000) return `<span style="color:#bd00ff;">[High-End]</span>`;
            if (score < 80000) return `<span style="color:#ffaa00;">[Enthusiast]</span>`;
            return `<span style="color:#ff4444; font-weight:bold;">[HPC / Server]</span>`;
        } else {
            if (score < 800) return `<span style="color:#aaa;">[Sluggish]</span>`;
            if (score < 1500) return `<span style="color:#00aaff;">[Capable]</span>`;
            if (score < 2200) return `<span style="color:#bd00ff;">[Gaming Tier]</span>`;
            return `<span style="color:#ffaa00; font-weight:bold;">[Flagship ST]</span>`;
        }
    },

    // --- 3. PHYSICS & BENCHMARKING (V9.1 ENGINE) ---
    scrapeData: function () {
        const getVal = (id, isFloat) => {
            const el = document.getElementById(id);
            return el ? (isFloat ? parseFloat(el.value) || 0 : parseInt(el.value) || 0) : 0;
        };
        const igpuOn = document.getElementById('igpu-enable') ? document.getElementById('igpu-enable').checked : false;

        const modelSelect = document.getElementById('cpu-name-model');
        const model = modelSelect ? (modelSelect.value === 'NEW' ? document.getElementById('cpu-name-model-new').value : modelSelect.value) : "Unknown";
        const version = document.getElementById('cpu-name-version') ? document.getElementById('cpu-name-version').value : "";

        return {
            modelName: model,
            versionName: version,
            name: (model + " " + version).trim(),
            hideStorefront: document.getElementById('cpu-hide-storefront') ? document.getElementById('cpu-hide-storefront').checked : false,
            segment: document.getElementById('cpu-segment') ? document.getElementById('cpu-segment').value : "Desktop",
            arch: document.getElementById('cpu-arch') ? document.getElementById('cpu-arch').value : "Generic",

            fab: getVal('cpu-fab', true),

            pCores: getVal('p-core-count'),
            pBase: getVal('p-base', true),
            pAllCore: getVal('p-allcore', true),
            pTurbo: getVal('p-turbo', true),

            eCores: getVal('e-core-count'),
            eBase: getVal('e-base', true),
            eAllCore: getVal('e-allcore', true),
            eTurbo: getVal('e-turbo', true),
            eRatio: getVal('e-ratio', true),

            threads: getVal('total-threads'),
            ipc: getVal('cpu-ipc', true),
            l3: getVal('l3-cache'),
            pl1: getVal('cpu-pl1'),
            pl2: getVal('cpu-pl2'),
            memChannels: getVal('mem-channels'),
            pcie: getVal('pcie-lanes'),

            igpuEnabled: igpuOn,
            igpuCus: igpuOn ? getVal('igpu-cus') : 0,
            igpuClock: igpuOn ? getVal('igpu-clock', true) : 0,

            aiCores: getVal('npu-cores'),
            aiClock: getVal('npu-clock', true),
            aiOps: getVal('npu-ops'),
            dedicatedAI: document.getElementById('dedicated-ai') ? document.getElementById('dedicated-ai').checked : false,

            price: getVal('cpu-price', true),
            socket: document.getElementById('cpu-socket') ? document.getElementById('cpu-socket').value : "Custom",

            simd: Array.from(document.querySelectorAll('.simd-check:checked')).map(cb => {
                const def = this.simdInstructions.find(s => s.name === cb.value);
                return { name: cb.value, boost: def ? def.boost : 1.0 };
            })
        };
    },

    runPhysicsSimulation: function (d) {
        const totalCores = d.pCores + d.eCores;
        if (totalCores === 0) return { singleScore: 0, multiScore: 0, aiScore: 0, igpuScore: 0, burstPwrDraw: 0, sustainedPwrDraw: 0, yieldRate: 0, estCost: 0, dieArea: 0 };

        // 1. Lithography & Area Cost Model
        const lithoFactor = Math.sqrt(14 / Math.max(d.fab, 1));
        const baseArea = (d.pCores * 4) + (d.eCores * 1.5) + (d.l3 * 0.4) + (d.igpuCus * 1.5) + (d.memChannels * 4) + (d.pcie * 0.2) + 10;
        const dieArea = baseArea / lithoFactor;

        const defectRate = dieArea / 500;
        const yieldRate = Math.exp(-defectRate);
        const waferCost = 3000 * lithoFactor;
        const chipsPerWafer = Math.floor(70000 / dieArea);
        const estCostPerChip = waferCost / Math.max(1, (chipsPerWafer * yieldRate));

        // 2. Power & Uncore
        let uncoreWatts = (10 + (totalCores * 0.4) + (d.memChannels * 1.5) + (d.pcie * 0.1)) / lithoFactor;
        if (d.igpuEnabled) uncoreWatts += (d.igpuCus * d.igpuClock * 0.5) / lithoFactor;

        // Cubic power scaling relative to clock frequency
        const pWattPerGhz = 0.12 / lithoFactor;
        const eWattPerGhz = 0.035 / lithoFactor;

        let rawSustainedPower = uncoreWatts;
        if (d.pCores > 0) rawSustainedPower += d.pCores * Math.pow(d.pAllCore, 3) * pWattPerGhz;
        if (d.eCores > 0) rawSustainedPower += d.eCores * Math.pow(d.eAllCore, 3) * eWattPerGhz;

        let rawBurstPower = uncoreWatts;
        if (d.pCores > 0) rawBurstPower += 2 * Math.pow(d.pTurbo, 3) * pWattPerGhz; // Burst usually on 1-2 cores

        // Thermal/Power Throttling
        let sustainedThrottle = d.pl1 / Math.max(rawSustainedPower, 1);
        if (sustainedThrottle > 1.0) sustainedThrottle = 1.0;

        let burstThrottle = d.pl2 / Math.max(rawBurstPower, 1);
        if (burstThrottle > 1.0) burstThrottle = 1.0;

        const multiPClock = d.pAllCore * sustainedThrottle;
        const multiEClock = d.eAllCore * sustainedThrottle;
        const singlePClock = d.pTurbo * burstThrottle;

        // 3. Memory & Scheduling Overhead
        const memBandwidth = d.memChannels * 50;
        const requiredBandwidth = (d.pCores * multiPClock + d.eCores * multiEClock) * 1.5;
        let memEfficiency = memBandwidth / Math.max(requiredBandwidth, 1);
        if (memEfficiency > 1.0) memEfficiency = 1.0;
        const memBonus = 0.5 + (0.5 * Math.pow(memEfficiency, 0.5));

        // Non-Linear Core Scaling (Diminishing returns for massive core counts)
        const coreScalingPenalty = Math.pow(totalCores, 0.85) / totalCores;

        // 4. Scoring Constants & Adjustments
        const cacheFactor = 1 + (Math.log2(d.l3 + 2) * 0.05);
        const singleCacheFactor = 1 + ((cacheFactor - 1) * 0.3);

        // FIX: SIMD uses Math.max() now, not product. Baseline is 1.0.
        const simdMax = d.simd.reduce((acc, val) => Math.max(acc, val.boost), 1.0);

        // Score Constants (Tuned for ~2500 ST / 35000 MT flagship range)
        const SC_NORM = 220;
        const MC_NORM = 250;

        // Single Core Score
        let singleScore = singlePClock * d.ipc * singleCacheFactor * simdMax * SC_NORM;

        // Multi Core Score
        let smtBonus = 1.0;
        if (d.threads > totalCores) {
            const virtualThreads = d.threads - totalCores;
            const smtRatio = virtualThreads / (d.pCores || 1);
            smtBonus = 1 + (smtRatio * 0.25);
        }

        let rawMulti = 0;
        if (d.pCores > 0) rawMulti += (d.pCores * multiPClock);
        if (d.eCores > 0) rawMulti += (d.eCores * multiEClock * d.eRatio);

        let multiScore = rawMulti * d.ipc * smtBonus * cacheFactor * simdMax * memBonus * coreScalingPenalty * MC_NORM;

        // Aux Scores
        let aiScore = (d.aiCores * d.aiOps * d.aiClock) / 10;
        if (d.dedicatedAI) aiScore *= 1.5;

        let igpuScore = d.igpuEnabled ? (d.igpuCus * d.igpuClock * 15 * (d.ipc / 1.5)) : 0;

        return {
            singleScore: Math.floor(singleScore),
            multiScore: Math.floor(multiScore),
            aiScore: aiScore.toFixed(1),
            igpuScore: Math.floor(igpuScore),
            burstPwrDraw: Math.floor(rawBurstPower),
            sustainedPwrDraw: Math.floor(rawSustainedPower),
            yieldRate: (yieldRate * 100).toFixed(1),
            estCost: estCostPerChip.toFixed(2),
            dieArea: Math.floor(dieArea)
        };
    },

    updatePreview: function () {
        const d = this.scrapeData();
        const res = this.runPhysicsSimulation(d);

        const previewList = document.getElementById('comp-live-stats');
        if (previewList) {
            const pwrPct = Math.min(100, (res.sustainedPwrDraw / d.pl1) * 100);
            const pwrColor = pwrPct > 95 ? '#ff1744' : (pwrPct > 80 ? '#ffaa00' : '#00e676');

            const effScore = d.pl1 > 0 ? (res.multiScore / d.pl1).toFixed(0) : 0;
            const margin = d.price - res.estCost;
            const marginColor = margin > 0 ? '#00e676' : '#ff1744';

            let html = `
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span>Single-Core:</span> 
                    <span><b style="color:var(--accent)">${res.singleScore}</b> ${this.getTierLabel(res.singleScore, false)}</span>
                </li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span>Multi-Core:</span> 
                    <span><b style="color:var(--accent)">${res.multiScore}</b> ${this.getTierLabel(res.multiScore, true)}</span>
                </li>
            `;

            if (d.igpuEnabled) {
                html += `<li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>iGPU Score:</span> <b style="color:#76b900">${res.igpuScore} pts</b></li>`;
            }

            html += `
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>NPU AI Perf:</span> <b style="color:#bd00ff">${res.aiScore} TOPS</b></li>
                
                <li style="margin-top:10px; border-top:1px solid #333; padding-top:10px; margin-bottom:4px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                        <span>Sustained Power:</span> <b>${res.sustainedPwrDraw}W / ${d.pl1}W (PL1)</b>
                    </div>
                    <div style="width:100%; background:#222; height:6px; border-radius:3px; overflow:hidden;">
                        <div style="width:${pwrPct}%; background:${pwrColor}; height:100%;"></div>
                    </div>
                </li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Burst Power:</span> <b>${res.burstPwrDraw}W / ${d.pl2}W (PL2)</b></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px; color:#aaa;"><span>Efficiency:</span> <b>${effScore} Pts/Watt</b></li>

                <li style="margin-top:10px; border-top:1px solid #333; padding-top:10px; display:flex; justify-content:space-between;">
                    <span>Silicon Area & Yield:</span> <b>${res.dieArea} mm² (${res.yieldRate}%)</b>
                </li>
                <li style="display:flex; justify-content:space-between;">
                    <span>Est. Cost to Mfg:</span> <b style="color:${marginColor}">$${res.estCost}</b>
                </li>
            `;

            previewList.innerHTML = html;
        }
        return res;
    },

    // --- 4. DATABASE & SAVE LOGIC ---
    refreshLineup: function () {
        const container = document.getElementById('active-lineup-list');
        if (!container || !window.sys) return;

        const db = window.sys.load();
        const activeCPUs = db.inventory.filter(i => i.type === 'CPU' && i.active === true);

        if (activeCPUs.length === 0) {
            container.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:20px;">No active CPUs currently on the market.</div>`;
            return;
        }

        container.innerHTML = activeCPUs.map(cpu => {
            const specs = cpu.specs || {};
            const scoreStr = specs.Score || "N/A";

            return `
            <div class="panel" style="padding:15px; display:flex; flex-direction:column; gap:5px;">
                <div style="font-weight:800; color:var(--accent); font-size:1rem;">${cpu.name} <span style="font-size:0.6rem; color:#888; border:1px solid #444; padding:2px 4px; border-radius:3px; margin-left:4px;">${cpu.raw?.segment || 'CPU'}</span></div>
                <div style="font-size:0.75rem; color:#aaa; font-family:var(--font-mono);">
                    <div>${specs.Clocks || (cpu.raw ? cpu.raw.pBase + '/' + cpu.raw.pTurbo + ' GHz' : 'N/A')} | ${specs['Cores/Threads'] || specs.Cores || 'N/A'}</div>
                    <div style="margin-top:4px;">${scoreStr}</div>
                    <div style="margin-top:4px; color:#fff; font-size:0.9rem;">$${cpu.raw?.price || 0}</div>
                </div>
                
                <div style="display:flex; gap:5px; margin-top:10px;">
                    <button onclick="window.cloneToArchitect(${cpu.id})" 
                        style="flex:1; background:rgba(0, 230, 118, 0.1); color:var(--accent-success); border:1px solid var(--accent-success); font-weight:bold; font-size:0.7rem; padding:8px; cursor:pointer; border-radius:4px; transition:0.2s;">
                        CLONE
                    </button>
                    ${cpu.raw && cpu.raw.hideStorefront ? 
                        `<button onclick="window.sys.toggleHide(${cpu.id})" style="flex:1; background:rgba(255, 255, 255, 0.1); color:#aaa; border:1px solid #444; font-weight:bold; font-size:0.7rem; padding:8px; cursor:pointer; border-radius:4px; transition:0.2s;">UNHIDE</button>` : 
                        `<button onclick="window.sys.toggleHide(${cpu.id})" style="flex:1; background:rgba(255, 255, 255, 0.1); color:#aaa; border:1px solid #444; font-weight:bold; font-size:0.7rem; padding:8px; cursor:pointer; border-radius:4px; transition:0.2s;">HIDE</button>`
                    }
                    <button onclick="window.sys.discontinue(${cpu.id})" 
                        style="flex:1; background:rgba(255,23,68,0.1); color:#ff1744; border:1px solid rgba(255,23,68,0.3); font-weight:bold; font-size:0.7rem; padding:8px; cursor:pointer; border-radius:4px; transition:0.2s;">
                        DISCON.
                    </button>
                </div>
            </div>
            `;
        }).join('');
    },

    saveSystem: function () {
        if (!window.sys || !window.sys.saveDesign) {
            alert("Error: Save system (save.js) not found!");
            return;
        }

        const data = this.scrapeData();
        const results = this.updatePreview();

        const finalObject = {
            name: data.name,
            specs: {
                "Segment": data.segment,
            "Clocks": `${data.pBase} / ${data.pTurbo} GHz`,
            "Cores/Threads": `${data.pCores}P + ${data.eCores}E / ${data.threads}T`,
            "Limits": `${data.pl1}W / ${data.pl2}W`,
                "Process": `${data.fab}nm`,
                "Score": `multi - ${results.multiScore} single - ${results.singleScore}`,
                "iGPU": data.igpuEnabled ? `${results.igpuScore} pts` : "None"
            },
            price: data.price,
            year: data.year,
            cost: parseFloat(results.estCost),
            benchmarks: {
                singleScore: results.singleScore,
                multiScore: results.multiScore,
                igpuScore: results.igpuScore,
                aiScore: results.aiScore
            },
            ...data
        };

        window.sys.saveDesign('CPU', finalObject);
    }
};