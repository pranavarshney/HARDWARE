/* HARDWARE TYCOON: SERVER & SUPERCOMPUTER ARCHITECT
 * PHYSICS ENGINE V3.0 (Contracts, U-Space, OpEx & Deep Cooling)
 */

window.server = {

    // --- 1. INFRASTRUCTURE & MARKET DATA ---
    rack_types: {
        'Standard 42U': { u: 42, cost: 500, airflow: 1.0 },
        'Open Compute (OCP)': { u: 48, cost: 800, airflow: 1.2 },
        'High-Density Blade': { u: 60, cost: 1500, airflow: 0.8 },
        'Immersion Tank': { u: 40, cost: 5000, airflow: 5.0 }
    },

    cooling_infra: {
        'CRAC (raised floor)': { pue: 1.6, costPerKw: 200, limit: 15000 },
        'In-Row Cooling': { pue: 1.3, costPerKw: 400, limit: 30000 },
        'Rear Door Heat Exchanger': { pue: 1.15, costPerKw: 600, limit: 60000 },
        'Direct Liquid (DLC)': { pue: 1.05, costPerKw: 1000, limit: 120000 },
        'Two-Phase Immersion': { pue: 1.02, costPerKw: 2500, limit: 999999 }
    },

    network_topology: {
        'Daisy Chain': { efficiency: 0.4, costPerNode: 10, latency: 'High' },
        'Tor (Top of Rack)': { efficiency: 0.7, costPerNode: 50, latency: 'Medium' },
        'Leaf-Spine': { efficiency: 0.95, costPerNode: 200, latency: 'Low' },
        'Dragonfly Mesh': { efficiency: 0.98, costPerNode: 400, latency: 'Ultra Low' },
        'Torus 6D (Super)': { efficiency: 0.99, costPerNode: 800, latency: 'Near Zero' }
    },

    nic_types: {
        '1GbE Base-T': { cost: 50, watts: 5, eff: 0.5 },
        '10GbE SFP+': { cost: 150, watts: 10, eff: 0.75 },
        '100GbE QSFP28': { cost: 600, watts: 25, eff: 0.9 },
        'InfiniBand HDR 200G': { cost: 1500, watts: 40, eff: 1.0 }
    },

    psu_types: {
        '80+ Gold (1000W)': { wattage: 1000, cost: 150, eff: 0.89, rel: 99.0 },
        '80+ Platinum (1600W)': { wattage: 1600, cost: 250, eff: 0.92, rel: 99.5 },
        '80+ Titanium (2400W)': { wattage: 2400, cost: 400, eff: 0.96, rel: 99.9 }
    },

    terminalLogs: ["> System Initialized.", "> Awaiting benchmark commands..."],

    // --- 2. RENDER UI ---
    render: function (container) {
        if (!container) return;
        const currentYear = new Date().getFullYear();

        container.innerHTML = `
            <div class="architect-container">
                
                <div class="panel">
                    <h3>System Identity & Market</h3>
                    <div class="input-group">
                        <label>Server Class</label>
                        <select id="srv-class" onchange="window.server.updateUI()" style="border-color:var(--accent);">
                            <option value="Prebuilt">Prebuilt Enterprise Server</option>
                            <option value="Supercomputer">Supercomputer Cluster</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>System Designation</label>
                        <input type="text" id="srv-name" value="Titan Cluster A1">
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Commission Year</label>
                            <input type="number" id="srv-year" value="${currentYear}">
                        </div>
                        <div class="input-group" id="group-price">
                            <label>Retail Price ($)</label>
                            <input type="number" id="srv-price" value="9999">
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>Node Configuration</h3>
                    
                    <div style="display:grid; grid-template-columns: 1fr 2fr; gap:10px;">
                        <div class="input-group">
                            <label>Sockets</label>
                            <select id="srv-cpu-qty"><option value="1">1x CPU</option><option value="2" selected>2x CPU</option><option value="4">4x CPU</option></select>
                        </div>
                        <div class="input-group"><label>CPU Model</label><select id="srv-cpu" class="part-selector"></select></div>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 2fr; gap:10px; margin-top:5px;">
                        <div class="input-group">
                            <label>Accelerators</label>
                            <select id="srv-gpu-qty"><option value="0">None</option><option value="1">1x GPU</option><option value="2">2x GPU</option><option value="4">4x GPU</option><option value="8">8x SXM</option></select>
                        </div>
                        <div class="input-group"><label>GPU Model</label><select id="srv-gpu" class="part-selector"></select></div>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 2fr; gap:10px; margin-top:5px;">
                        <div class="input-group">
                            <label>DIMMs</label>
                            <select id="srv-ram-qty"><option value="4">4x DIMM</option><option value="8">8x DIMM</option><option value="16" selected>16x DIMM</option><option value="32">32x DIMM</option><option value="64">64x DIMM</option></select>
                        </div>
                        <div class="input-group"><label>Memory</label><select id="srv-ram" class="part-selector"></select></div>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 2fr; gap:10px; margin-top:5px;">
                        <div class="input-group">
                            <label>Drive Bays</label>
                            <select id="srv-sto-qty"><option value="2">2x Drives</option><option value="4">4x Drives</option><option value="8">8x Drives</option><option value="24">24x Drives</option></select>
                        </div>
                        <div class="input-group"><label>Storage</label><select id="srv-storage" class="part-selector"></select></div>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px; border-top:1px solid #333; padding-top:10px;">
                        <div class="input-group">
                            <label>Networking (NIC)</label>
                            <select id="srv-nic">${this.renderOptions(this.nic_types)}</select>
                        </div>
                        <div class="input-group">
                            <label>Power Supply</label>
                            <select id="srv-psu">${this.renderOptions(this.psu_types)}</select>
                        </div>
                    </div>

                    <div style="margin-top:10px; background:rgba(255,255,255,0.05); padding:10px; border-radius:4px;">
                        <label style="font-size:0.8rem; font-weight:bold; margin-bottom:5px; display:block;">Redundancy & Failover</label>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px; font-size:0.75rem;">
                            <label><input type="checkbox" id="srv-red-psu"> Redundant PSU (A/B)</label>
                            <label><input type="checkbox" id="srv-red-nic"> Dual NIC Failover</label>
                            <label><input type="checkbox" id="srv-red-raid"> Storage RAID 1/10</label>
                        </div>
                    </div>
                </div>

                <div class="panel" id="panel-scale" style="display:none;">
                    <h3>Scale & Infra</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Nodes per Rack</label>
                            <input type="number" id="srv-density" value="20" min="1" max="100">
                        </div>
                        <div class="input-group">
                            <label>Total Racks</label>
                            <input type="number" id="srv-racks" value="4" min="1" max="5000">
                        </div>
                    </div>
                    
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:5px;">
                        <div class="input-group">
                            <label>Rack Cabinet</label>
                            <select id="srv-rack">${this.renderOptions(this.rack_types)}</select>
                        </div>
                        <div class="input-group">
                            <label>Cooling Tech</label>
                            <select id="srv-cool">${this.renderOptions(this.cooling_infra)}</select>
                        </div>
                    </div>
                    <div class="input-group" style="margin-top:5px;">
                        <label>Network Topology</label>
                        <select id="srv-net">${this.renderOptions(this.network_topology)}</select>
                    </div>

                    <div id="rack-visualizer" style="height:40px; margin-top:15px; background:#111; border:1px solid #333; border-radius:4px; display:flex; padding:2px; gap:2px; overflow:hidden;">
                        <!-- Filled by renderPhysics -->
                    </div>
                    <div style="font-size:0.7rem; text-align:center; color:#888; margin-top:4px;">Rack U-Space Layout</div>
                </div>

                <div class="panel" style="border-color: var(--accent);">
                    <h3>Diagnostics & Benchmarks</h3>
                    <div id="bench-terminal" style="background:#000; color:#00ff88; font-family:var(--font-mono); padding:10px; height:100px; overflow-y:auto; border:1px solid var(--border-light); font-size:0.8rem; margin-bottom:10px; border-radius:4px;">
                        ${this.terminalLogs.join('<br>')}
                    </div>
                    
                    <div style="display:flex; gap:10px;">
                        <button class="btn-action" style="flex:1; padding:8px; font-size:0.75rem;" onclick="window.server.runBenchmark('LINPACK')">LINPACK (FP64)</button>
                        <button class="btn-action" style="flex:1; padding:8px; font-size:0.75rem;" onclick="window.server.runBenchmark('MLPerf')">MLPerf (AI)</button>
                        <button class="btn-action" style="flex:1; padding:8px; font-size:0.75rem;" onclick="window.server.runBenchmark('IO500')">IO500 (Storage)</button>
                    </div>
                </div>

                <div class="panel" style="border-color: var(--accent-success);">
                    <h3>Financials & Deployment</h3>

                    <div style="margin-top:5px; background:rgba(0,0,0,0.3); padding:12px; border-radius:6px; margin-bottom:15px; border:1px solid var(--border-dim);">
                        <ul id="srv-live-stats" style="list-style:none; padding:0; margin:0; font-size:0.8rem; color:#ccc;">
                            <li>Initializing physics...</li>
                        </ul>
                    </div>

                    <button id="btn-deploy" class="btn-action" onclick="window.server.saveSystem()">
                        RELEASE TO MARKET
                    </button>
                </div>

                <div class="panel" style="grid-column: 1 / -1; border-color: var(--border-light);">
                    <h3 style="border-bottom:1px solid var(--border-dim); margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                        Active Deployments
                        <button onclick="window.server.refreshLineup()" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:0.7rem;">↻ Refresh</button>
                    </h3>
                    <div id="active-server-list" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:12px;"></div>
                </div>

                <div class="panel" style="grid-column: 1 / -1; border-color: gold;">
                    <h3 style="border-bottom:1px solid var(--border-dim); margin-bottom:10px; color:gold;">
                        🏆 Global Top 10 Supercomputers
                    </h3>
                    <div id="top-supercomputers-list" style="display:flex; flex-direction:column; gap:8px;"></div>
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

    updateUI: function () {
        const srvClass = document.getElementById('srv-class').value;
        const panelScale = document.getElementById('panel-scale');
        const groupPrice = document.getElementById('group-price');

        if (srvClass === 'Prebuilt') {
            if (panelScale) panelScale.style.display = 'none';
            if (groupPrice) groupPrice.style.display = 'block';
        } else {
            if (panelScale) panelScale.style.display = 'block';
            if (groupPrice) groupPrice.style.display = 'none';
        }
        this.updatePhysics();
    },

    loadBase: function (raw) {
        const set = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };
        const setCheck = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.checked = val; };

        set('srv-class', raw.srvClass || 'Prebuilt');
        set('srv-name', raw.name);
        set('srv-year', raw.year);
        set('srv-price', raw.price);

        set('srv-cpu-qty', raw.cpuQty);
        set('srv-cpu', raw.cpu);
        set('srv-gpu-qty', raw.gpuQty);
        set('srv-gpu', raw.gpu);
        set('srv-ram-qty', raw.ramQty);
        set('srv-ram', raw.ram);
        set('srv-sto-qty', raw.stoQty);
        set('srv-storage', raw.sto);
        set('srv-nic', raw.nic);
        set('srv-psu', raw.psu);
        setCheck('srv-red-psu', raw.isRedPsu);
        setCheck('srv-red-nic', raw.isRedNic);
        setCheck('srv-red-raid', raw.isRaid);

        if (raw.srvClass === 'Supercomputer') {
            set('srv-density', raw.nodesPerRack);
            set('srv-racks', raw.rackCount);
            set('srv-rack', raw.rack);
            set('srv-cool', raw.cooling);
            set('srv-net', raw.topology);
        }

        this.updateUI();
    },

    renderOptions: function (obj) {
        return Object.keys(obj).map(k => `<option value="${k}">${k}</option>`).join('');
    },

    populatePartDropdowns: function () {
        if (!window.sys) return;
        const db = window.sys.load();

        const fill = (id, type) => {
            const el = document.getElementById(id);
            if (!el) return;
            const parts = db.inventory.filter(i => i.type.toLowerCase() === type.toLowerCase());

            if (parts.length === 0) {
                el.innerHTML = `<option value="">No ${type}s available</option>`;
            } else {
                el.innerHTML = parts.map(p => {
                    const status = p.active ? "" : " (Archived)";
                    let extra = "";
                    if (type === 'RAM' || type === 'Storage') extra = ` | ${p.specs.Capacity || ''}`;
                    return `<option value="${p.id}">${p.name}${status}${extra} ($${p.raw?.price || Math.floor(p.price) || 0})</option>`;
                }).join('');

                const activeParts = parts.filter(p => p.active);
                if (activeParts.length > 0) {
                    el.value = activeParts[activeParts.length - 1].id;
                } else {
                    el.value = parts[parts.length - 1].id;
                }
            }
        };

        fill('srv-cpu', 'CPU');
        fill('srv-gpu', 'GPU');
        fill('srv-ram', 'RAM');
        fill('srv-storage', 'Storage');
    },

    // --- 3. PHYSICS & FINANCIAL ENGINE REFACTOR ---

    getPartScore: function (part) {
        if (!part) return 0;
        if (part.raw && part.raw.benchmarks) {
            return part.raw.benchmarks.multiScore || part.raw.benchmarks.score || part.score || 0;
        }
        return part.score || 0;
    },

    updatePhysics: function () {
        if (!window.sys) return;

        // 1. Compute
        const stats = this.calculatePhysics();
        if (!stats) return;

        // 2. Validate
        const errors = this.validatePhysics(stats);

        // 3. Render
        this.renderPhysics(stats, errors);

        return { stats, errors };
    },

    calculatePhysics: function () {
        const db = window.sys.load();
        const getPart = (id) => {
            const val = document.getElementById(id)?.value;
            return val ? db.inventory.find(i => i.id == val) : null;
        };

        const inputs = {
            srvClass: document.getElementById('srv-class')?.value || 'Prebuilt',
            price: parseFloat(document.getElementById('srv-price')?.value || 9999),
            cpu: getPart('srv-cpu'),
            gpu: getPart('srv-gpu'),
            ram: getPart('srv-ram'),
            sto: getPart('srv-storage'),
            cpuQty: parseInt(document.getElementById('srv-cpu-qty')?.value || 1),
            gpuQty: parseInt(document.getElementById('srv-gpu-qty')?.value || 0),
            ramQty: parseInt(document.getElementById('srv-ram-qty')?.value || 4),
            stoQty: parseInt(document.getElementById('srv-sto-qty')?.value || 2),
            nodesPerRack: parseInt(document.getElementById('srv-density')?.value || 20),
            rackCount: parseInt(document.getElementById('srv-racks')?.value || 4),
            rackDef: this.rack_types[document.getElementById('srv-rack')?.value],
            cooling: this.cooling_infra[document.getElementById('srv-cool')?.value],
            topology: this.network_topology[document.getElementById('srv-net')?.value],
            nicDef: this.nic_types[document.getElementById('srv-nic')?.value],
            psuDef: this.psu_types[document.getElementById('srv-psu')?.value],
            isRedPsu: document.getElementById('srv-red-psu')?.checked || false,
            isRedNic: document.getElementById('srv-red-nic')?.checked || false,
            isRaid: document.getElementById('srv-red-raid')?.checked || false
        };

        if (!inputs.rackDef) return null;

        const totalNodes = inputs.srvClass === 'Prebuilt' ? 1 : inputs.nodesPerRack * inputs.rackCount;

        // Space Calc
        let nodeU = 1;
        if (inputs.gpuQty >= 2) nodeU += Math.ceil(inputs.gpuQty / 2);
        if (inputs.stoQty > 8) nodeU += 1;
        if (inputs.isRedPsu || inputs.isRedNic) nodeU += 0.5;
        nodeU = Math.ceil(nodeU);

        const usedU = inputs.nodesPerRack * nodeU;
        const rackFloorArea = 1.8; // m^2 per rack incl aisles
        const facilityArea = rackFloorArea * inputs.rackCount;

        // Power Calc
        const cpuWatts = inputs.cpu ? (inputs.cpu.raw.tdp || 100) : 100;
        const gpuWatts = inputs.gpu ? (inputs.gpu.raw.tdp || 250) : 250;
        const rawNodeWatts = (cpuWatts * inputs.cpuQty) + (gpuWatts * inputs.gpuQty) +
            (4 * inputs.ramQty) + (6 * inputs.stoQty) +
            (inputs.isRedNic ? inputs.nicDef.watts * 2 : inputs.nicDef.watts);

        // PSU Load & Efficiency Curve (Drops if load > 80%)
        const psuWattage = inputs.psuDef.wattage || 1000;
        const psuLoadStr = rawNodeWatts / (inputs.isRedPsu ? psuWattage * 1.5 : psuWattage);
        let effDrop = 0;
        if (psuLoadStr > 0.8) effDrop = (psuLoadStr - 0.8) * 0.15; // Max ~3% drop at 100%
        const finalPsuEff = Math.max(0.5, inputs.psuDef.eff - effDrop);

        const realNodeWatts = rawNodeWatts / finalPsuEff;
        const rackWatts = realNodeWatts * inputs.nodesPerRack;
        const clusterRawWatts = rackWatts * inputs.rackCount;

        // Cooling Limits
        const effectiveCoolLimit = inputs.cooling.limit * inputs.rackDef.airflow;
        let throttle = 1.0;
        let thermalStatus = "Optimal";
        let heatColor = "#00e676";

        if (rackWatts > effectiveCoolLimit) {
            throttle = effectiveCoolLimit / rackWatts;
            thermalStatus = `MELTDOWN (-${((1 - throttle) * 100).toFixed(0)}%)`;
            heatColor = "#ff1744";
        } else if (rackWatts > effectiveCoolLimit * 0.85) {
            thermalStatus = "Hot / Warning";
            heatColor = "#ffaa00";
        }

        const totalFacWatts = clusterRawWatts * inputs.cooling.pue;

        // Performance & Roofline TFLOPS
        let cpuScore = this.getPartScore(inputs.cpu);
        let gpuScore = this.getPartScore(inputs.gpu);

        // Compute memory bandwidth ceiling
        const maxChannelsPerSocket = 8;
        const requestedChannels = inputs.ramQty / inputs.cpuQty;
        const actualChannels = Math.min(maxChannelsPerSocket, requestedChannels);

        const ramSpeed = inputs.ram ? (inputs.ram.raw.speed || 3200) : 3200;
        const memBandwidthBg = (actualChannels * ramSpeed * 8) / 1000; // GB/s approx
        const bandwidthBonus = Math.min(2.0, memBandwidthBg / 100);

        const rawFlops = ((cpuScore * inputs.cpuQty * 0.05) + (gpuScore * inputs.gpuQty * 0.4));
        const rooflineFlops = rawFlops * bandwidthBonus * throttle;
        const nodeTflops = rooflineFlops / 100;

        // Topology Network Penalty Curve
        let netEfficieny = inputs.topology.efficiency * inputs.nicDef.eff;
        const nodePenalty = Math.max(0, (totalNodes - 200) * 0.0001); // -10% per 1000 nodes
        let scaleFactor = Math.max(0.1, netEfficieny - nodePenalty);

        const clusterTFLOPS = nodeTflops * totalNodes * scaleFactor;

        let ranking = "Unranked";
        if (clusterTFLOPS > 100000) ranking = "#1 Global Supercomputer 🏆";
        else if (clusterTFLOPS > 50000) ranking = "Top 10 Global HPC 🏅";
        else if (clusterTFLOPS > 10000) ranking = "Top 500 Entry 🎖️";
        else if (clusterTFLOPS > 1000) ranking = "Regional Leader";

        // Uptime SLA Math (Chain MTBF)
        // Assume baseline reliability of parts. E.g., CPU 99.9%, RAM 99.8%. 
        // We simulate a simplified chain probability.
        const rCPU = 0.9995;
        const rRAM = 0.998;
        const rSTO = inputs.isRaid ? 0.9999 : 0.995;
        const rNIC = inputs.isRedNic ? 0.999 : 0.99;
        const rPSU = inputs.isRedPsu ? 1.0 - Math.pow(1.0 - (inputs.psuDef.rel / 100), 2) : inputs.psuDef.rel / 100;

        // Multiply components to get node uptime
        let nodeUptimePct = (rCPU * rRAM * rSTO * rNIC * rPSU);
        // Multiply by topology latency reliability hit
        if (inputs.topology.latency === 'High') nodeUptimePct *= 0.98;
        else if (inputs.topology.latency === 'Medium') nodeUptimePct *= 0.995;

        // Cluster uptime is often limited by the weakest node link in HPC
        // But for simplicity of gameplay, we'll give the cluster an uptime score based on node uptime, scaled slightly.
        let uptime = nodeUptimePct * 100;

        // Financials (OpEx Model)
        const cpuCost = inputs.cpu ? (inputs.cpu.raw.price || 0) : 0;
        const gpuCost = inputs.gpu ? (inputs.gpu.raw.price || 0) : 0;
        const ramCost = inputs.ram ? (inputs.ram.raw.price || 0) : 0;
        const stoCost = inputs.sto ? (inputs.sto.raw.price || 0) : 0;

        const psuCostSum = inputs.isRedPsu ? inputs.psuDef.cost * 2 : inputs.psuDef.cost;
        const nicCostSum = inputs.isRedNic ? inputs.nicDef.cost * 2 : inputs.nicDef.cost;

        const nodePartsCost = (cpuCost * inputs.cpuQty) + (gpuCost * inputs.gpuQty) + (ramCost * inputs.ramQty) + (stoCost * inputs.stoQty) + nicCostSum + psuCostSum;

        const totalInfraCost = (inputs.rackDef.cost * inputs.rackCount) + (inputs.cooling.costPerKw * (clusterRawWatts / 1000)) + (inputs.topology.costPerNode * totalNodes);

        const totalProjectCost = inputs.srvClass === 'Prebuilt' ? nodePartsCost : Math.ceil((nodePartsCost * totalNodes) + totalInfraCost);

        const margin = inputs.srvClass === 'Prebuilt' ? inputs.price - nodePartsCost : 0;

        return {
            inputs,
            totalNodes, nodeU, usedU, facilityArea,
            rawNodeWatts, realNodeWatts, rackWatts, totalFacWatts, clusterRawWatts,
            finalPsuEff, psuLoadStr, throttle, thermalStatus, heatColor,
            nodeTflops, clusterTFLOPS, scaleFactor, ranking,
            uptime, requestedChannels, maxChannelsPerSocket,
            nodePartsCost, totalInfraCost, totalProjectCost, margin
        };
    },

    validatePhysics: function (stats) {
        let errors = [];
        const { inputs, usedU, psuLoadStr, uptime, clusterTFLOPS, totalProjectCost, requestedChannels, maxChannelsPerSocket } = stats;

        if (!inputs.cpu) errors.push("Missing CPU");
        if (!inputs.ram) errors.push("Missing RAM");
        if (!inputs.sto) errors.push("Missing Storage");

        if (inputs.srvClass === 'Supercomputer' && usedU > inputs.rackDef.u) errors.push(`Rack Overfilled: ${usedU}U / ${inputs.rackDef.u}U`);
        if (psuLoadStr > 1.0) errors.push(`PSU Overload: Node draws ${(stats.rawNodeWatts).toFixed(0)}W, exceeds PSU Rating`);

        if (requestedChannels > maxChannelsPerSocket * 2) errors.push(`Memory Config Invalid: Max 16 DIMMs per CPU Socket supported.`);

        return errors;
    },

    renderPhysics: function (stats, errors) {
        const display = document.getElementById('srv-live-stats');
        const btnDeploy = document.getElementById('btn-deploy');
        const visualizer = document.getElementById('rack-visualizer');

        // Render Rack Visualizer
        if (visualizer && stats.inputs.rackDef) {
            let vizHtml = '';
            const numBlocks = Math.min(60, stats.inputs.rackDef.u);
            for (let i = 0; i < numBlocks; i++) {
                if (i < stats.usedU) {
                    vizHtml += `<div style="flex:1; background:var(--accent); border-radius:1px; opacity:0.8;"></div>`;
                } else {
                    vizHtml += `<div style="flex:1; background:#333; border-radius:1px;"></div>`;
                }
            }
            visualizer.innerHTML = vizHtml;
        }

        if (errors.length > 0) {
            btnDeploy.disabled = true;
            btnDeploy.innerText = "REQUIREMENTS NOT MET";
            display.innerHTML = errors.map(e => `<li style="color:#ff1744; font-weight:bold;">❌ ${e}</li>`).join('');
            if (stats.inputs.srvClass === 'Supercomputer' && stats.usedU > stats.inputs.rackDef.u) {
                display.innerHTML += `<li style="margin-top:10px; color:#aaa;">Each node is ${stats.nodeU}U. Reduce Nodes per Rack.</li>`;
            }
        } else {
            btnDeploy.disabled = false;
            btnDeploy.innerText = stats.inputs.srvClass === 'Prebuilt' ? "RELEASE TO MARKET" : "COMMISSION SUPERCOMPUTER";

            let perfLabel = stats.clusterTFLOPS > 1000 ? (stats.clusterTFLOPS / 1000).toFixed(2) + " PFLOPS" : stats.clusterTFLOPS.toFixed(1) + " TFLOPS";

            if (stats.inputs.srvClass === 'Prebuilt') {
                const margin = stats.inputs.price - stats.nodePartsCost;
                const marginColor = margin > 0 ? '#00e676' : '#ff1744';

                display.innerHTML = `
                    <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Compute:</span> <b style="color:var(--accent)">${perfLabel}</b></li>
                    <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Power Draw:</span> <b>${stats.rawNodeWatts.toFixed(0)} W</b></li>
                    <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Node Uptime:</span> <b style="color:#00e676">${stats.uptime.toFixed(3)}%</b></li>
                    <li style="border-top:1px solid #333; margin-top:6px; padding-top:6px; display:flex; justify-content:space-between;">
                        <span>Mfg Cost:</span> <span style="color:#ffaa00">$${stats.nodePartsCost.toFixed(2)}</span>
                    </li>
                    <li style="display:flex; justify-content:space-between; font-size:0.9rem;">
                        <span>Retail Price:</span> <b>$${stats.inputs.price.toFixed(2)}</b>
                    </li>
                    <li style="display:flex; justify-content:space-between; font-size:0.9rem; color:${marginColor}">
                        <span>Profit Margin:</span> <b>$${margin.toFixed(2)}</b>
                    </li>
                `;
            } else {
                display.innerHTML = `
                    <li style="display:flex; justify-content:space-between; margin-bottom:4px; font-weight:bold; color:gold;"><span>Ranking:</span> <span>${stats.ranking}</span></li>
                    <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>U-Space:</span> <b style="color:${stats.usedU === stats.inputs.rackDef.u ? '#ffaa00' : '#fff'}">${stats.usedU}U / ${stats.inputs.rackDef.u}U</b></li>
                    <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Floor Space:</span> <b>${stats.facilityArea.toFixed(1)} m²</b></li>
                    <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Uptime SLA:</span> <b style="color:#00e676">${stats.uptime.toFixed(3)}%</b></li>
                    <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Compute:</span> <b style="color:var(--accent)">${perfLabel}</b></li>
                    <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Rack Target:</span> <b style="color:${stats.heatColor}">${(stats.rackWatts / 1000).toFixed(1)} kW</b> <span style="font-size:0.7rem">(${stats.thermalStatus})</span></li>
                    <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Facility Peak:</span> <b>${(stats.totalFacWatts / 1000000).toFixed(2)} MW</b> <span style="font-size:0.7rem">(PUE ${stats.inputs.cooling.pue})</span></li>
                    
                    <li style="border-top:1px solid #333; margin-top:6px; padding-top:6px; display:flex; justify-content:space-between; font-size:1.1rem;">
                        <span>CapEx Cost:</span> <span style="color:#ff1744">-$${(stats.totalProjectCost / 1000000).toFixed(2)}M</span>
                    </li>
                `;
            }
        }
    },

    scrapeData: function () {
        const get = (id) => document.getElementById(id)?.value || '';
        return {
            name: document.getElementById('srv-name').value,
            year: parseFloat(document.getElementById('srv-year').value),
            price: parseFloat(document.getElementById('srv-price').value || 9999),
            srvClass: document.getElementById('srv-class').value,
            cpuQty: get('srv-cpu-qty'), cpu: get('srv-cpu'),
            gpuQty: get('srv-gpu-qty'), gpu: get('srv-gpu'),
            ramQty: get('srv-ram-qty'), ram: get('srv-ram'),
            stoQty: get('srv-sto-qty'), sto: get('srv-storage'),
            nic: get('srv-nic'), psu: get('srv-psu'),
            isRedPsu: document.getElementById('srv-red-psu').checked,
            isRedNic: document.getElementById('srv-red-nic').checked,
            isRaid: document.getElementById('srv-red-raid').checked,
            nodesPerRack: get('srv-density'),
            rackCount: get('srv-racks'),
            rack: get('srv-rack'),
            cooling: get('srv-cool'),
            topology: get('srv-net')
        };
    },

    // --- 4. DEEP BENCHMARKS ---
    runBenchmark: function (type) {
        const term = document.getElementById('bench-terminal');
        const result = this.updatePhysics();
        if (!result || !result.stats) return;

        const stats = result.stats;

        if (!stats.inputs.cpu) {
            this.terminalLogs.push(`<span style="color:#ff1744">> Error: Hardware missing.</span>`);
            this.flushTerminal();
            return;
        }

        this.terminalLogs.push(`> Executing ${type} workload...`);
        this.flushTerminal();

        setTimeout(() => {
            let score = 0;
            let unit = "";
            let randomVar = (Math.random() * 0.05) + 0.97;

            if (type === 'LINPACK') {
                const gpuCount = stats.inputs.gpuQty;
                const gpuMulti = gpuCount > 0 ? 1.5 : 0.5;
                score = stats.clusterTFLOPS * gpuMulti * randomVar;
                unit = "TFLOPS (FP64)";
            } else if (type === 'MLPerf') {
                const gpuCount = stats.inputs.gpuQty;
                if (gpuCount === 0) {
                    score = 0;
                    unit = "Failed (No Accelerators)";
                } else {
                    score = (stats.clusterTFLOPS * 40) * stats.scaleFactor * randomVar;
                    unit = "Images/sec";
                }
            } else if (type === 'IO500') {
                // Incorporate actual drive capacity/speed logic if possible.
                // Fallback to simple multiplier based on Drive class (assumed NVMe vs SATA by price).
                const pricePerDrive = stats.inputs.sto ? stats.inputs.sto.raw.price || 50 : 50;
                const driveBaseSpeed = pricePerDrive > 200 ? 7.0 : 1.5; // NVMe ~7GB/s, SATA ~1.5GB/s
                const raidMulti = stats.inputs.isRaid ? 1.5 : 1.0; // RAID gives stripe speed bonus
                score = (stats.inputs.stoQty * driveBaseSpeed * stats.totalNodes * raidMulti) * stats.scaleFactor * randomVar;
                unit = "GB/s";
            }

            this.terminalLogs.push(`> Result: <b style="color:#fff">${score.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${unit}</b>`);
            this.flushTerminal();
        }, 800);
    },

    flushTerminal: function () {
        const term = document.getElementById('bench-terminal');
        if (!term) return;
        // Keep last 20 logs
        if (this.terminalLogs.length > 20) this.terminalLogs = this.terminalLogs.slice(this.terminalLogs.length - 20);
        term.innerHTML = this.terminalLogs.join('<br>');
        term.scrollTop = term.scrollHeight;
    },

    // --- 5. SAVE & LINEUP ---
    refreshLineup: function () {
        const container = document.getElementById('active-server-list');
        if (!container || !window.sys) return;

        const db = window.sys.load();
        const active = db.inventory.filter(i => i.type === 'Server' && i.active === true);

        if (active.length === 0) {
            container.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:20px;">No active deployments globally.</div>`;
            return;
        }

        container.innerHTML = active.map(s => {
            const specs = s.specs || {};

            // Simulate random uptime events
            const events = ["SLA OK", "Optimal", "High Load", "Thermals Nominal"];
            const badEvents = ["Disk Failed - Rebuilding", "Network Jitter Detected", "PSU Offline"];
            let currentStatus = events[Math.floor(Math.random() * events.length)];
            let statusColor = "#00e676";

            // Random chance for mild degradation event in UI
            if (Math.random() > 0.8) {
                currentStatus = badEvents[Math.floor(Math.random() * badEvents.length)];
                statusColor = "#ffaa00";
            }

            return `
            <div class="panel" style="padding:15px; display:flex; flex-direction:column; gap:8px;">
                <div style="font-weight:800; color:var(--accent); font-size:1rem; border-bottom:1px solid #333; padding-bottom:5px;">${s.name} <span style="font-size:0.6rem; color:#888;">${specs.Class}</span></div>
                <div style="font-size:0.75rem; color:#aaa; font-family:var(--font-mono); margin-bottom:5px;">
                    <div>${specs.Compute}</div>
                    <div style="margin-top:4px;">${specs.Ranking !== "N/A" ? specs.Ranking : "Price: $" + (s.raw?.price || 0)}</div>
                    <div style="margin-top:4px; padding-top:4px; border-top:1px dashed #444; color:${statusColor}">Status: ${currentStatus}</div>
                </div>
                <div style="display:flex; gap:5px; margin-top:10px;">
                    <button onclick="window.cloneToArchitect(${s.id})" 
                        style="flex:1; background:rgba(0, 230, 118, 0.1); color:var(--accent-success); border:1px solid var(--accent-success); font-weight:bold; font-size:0.7rem; padding:8px; cursor:pointer; border-radius:4px; transition:0.2s;">
                        CLONE
                    </button>
                    <button onclick="window.sys.discontinue(${s.id})" 
                        style="flex:1; background:rgba(255,23,68,0.1); color:#ff1744; border:1px solid rgba(255,23,68,0.3); font-weight:bold; font-size:0.7rem; padding:8px; cursor:pointer; border-radius:4px; transition:0.2s;">
                        DECOMMISSION
                    </button>
                </div>
            </div>
            `;
        }).join('');

        const topContainer = document.getElementById('top-supercomputers-list');
        if (topContainer) {
            const supers = db.inventory.filter(i => i.type === 'Server' && i.raw?.srvClass === 'Supercomputer');
            if (supers.length === 0) {
                topContainer.innerHTML = `<div style="text-align:center; color:#555; font-size:0.8rem; padding:10px;">No Supercomputers built yet.</div>`;
            } else {
                supers.sort((a, b) => (b.raw?.score || 0) - (a.raw?.score || 0));
                const top10 = supers.slice(0, 10);

                topContainer.innerHTML = top10.map((s, idx) => {
                    const tflops = s.raw?.score || 0;
                    let perfLabel = tflops > 1000 ? (tflops / 1000).toFixed(2) + " PFLOPS" : tflops.toFixed(1) + " TFLOPS";
                    let rankColor = idx === 0 ? "gold" : (idx === 1 ? "silver" : (idx === 2 ? "#cd7f32" : "#888"));
                    return `
                    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.3); padding:8px 12px; border-left:3px solid ${rankColor}; border-radius:3px;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <span style="color:${rankColor}; font-weight:bold; font-size:1.1rem; width:25px;">#${idx + 1}</span>
                            <div>
                                <div style="font-weight:bold; color:#fff;">${s.name}</div>
                                <div style="font-size:0.7rem; color:#aaa;">${s.year || ''} | ${s.specs?.Compute || ''} - ${s.specs?.Draw || ''}</div>
                            </div>
                        </div>
                        <div style="font-weight:bold; color:var(--accent); font-family:var(--font-mono);">${perfLabel}</div>
                    </div>
                    `;
                }).join('');
            }
        }
    },

    saveSystem: function () {
        const result = this.updatePhysics();
        if (!result || !result.stats) return;

        const stats = result.stats;
        const meta = this.scrapeData();

        if (result.errors.length > 0) return;

        let perfLabel = stats.clusterTFLOPS > 1000 ? (stats.clusterTFLOPS / 1000).toFixed(2) + " PFLOPS" : stats.clusterTFLOPS.toFixed(1) + " TFLOPS";

        const specs = {
            "Class": stats.inputs.srvClass,
            "Compute": perfLabel,
            "Draw": stats.inputs.srvClass === 'Supercomputer' ? `${(stats.totalFacWatts / 1000000).toFixed(2)} MW` : `${stats.rawNodeWatts.toFixed(0)} W`,
            "Ranking": stats.inputs.srvClass === 'Supercomputer' ? stats.ranking : "N/A"
        };

        window.sys.saveDesign('Server', {
            name: meta.name,
            year: meta.year,
            price: stats.inputs.srvClass === 'Prebuilt' ? stats.inputs.price : 0,
            specs: specs,
            ...meta,
            rawCost: stats.inputs.srvClass === 'Prebuilt' ? stats.nodePartsCost : stats.totalProjectCost,
            score: stats.clusterTFLOPS
        });

        this.refreshLineup();
    }
};
