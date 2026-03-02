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
        '80+ Gold': { cost: 150, eff: 0.89, rel: 99.0 },
        '80+ Platinum': { cost: 250, eff: 0.92, rel: 99.5 },
        '80+ Titanium': { cost: 400, eff: 0.96, rel: 99.9 }
    },

    contracts: [
        { id: 'c1', name: "University HPC (Small)", reqTflops: 25, reqUptime: 99.0, budget: 1500000, type: "Scientific (HPC)" },
        { id: 'c2', name: "Local Bank DB Cluster", reqTflops: 10, reqUptime: 99.95, budget: 3000000, type: "Database" },
        { id: 'c3', name: "Regional Cloud Provider", reqTflops: 200, reqUptime: 99.5, budget: 8000000, type: "Web Hosting" },
        { id: 'c4', name: "Govt AI Research Lab", reqTflops: 2000, reqUptime: 99.9, budget: 45000000, type: "AI Training" },
        { id: 'c5', name: "Global Hyperscaler Core", reqTflops: 15000, reqUptime: 99.99, budget: 250000000, type: "Web Hosting" }
    ],

    // --- 2. RENDER UI ---
    render: function(container) {
        if (!container) return;
        const currentYear = new Date().getFullYear();

        container.innerHTML = `
            <div class="architect-container">
                
                <div class="panel">
                    <h3>System Identity & Market</h3>
                    <div class="input-group">
                        <label>Deployment Target (Contract)</label>
                        <select id="srv-contract" onchange="window.server.updatePhysics()" style="border-color:var(--accent);">
                            ${this.contracts.map(c => `<option value="${c.id}">${c.name} - $${(c.budget/1000000).toFixed(1)}M</option>`).join('')}
                        </select>
                    </div>
                    <div class="input-group">
                        <label>System Designation</label>
                        <input type="text" id="srv-name" value="Titan Cluster A1">
                    </div>
                    <div class="input-group">
                        <label>Commission Year</label>
                        <input type="number" id="srv-year" value="${currentYear}">
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
                            <select id="srv-ram-qty"><option value="4">4x DIMM</option><option value="8">8x DIMM</option><option value="16" selected>16x DIMM</option><option value="32">32x DIMM</option></select>
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
                            <label style="margin-top:6px; display:flex; gap:5px; align-items:center; color:#ccc;">
                                <input type="checkbox" id="srv-redundant-psu"> Redundant (A/B)
                            </label>
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>Scale & Infra</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Nodes per Rack</label>
                            <input type="number" id="srv-density" value="20" min="1" max="60">
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
                </div>

                <div class="panel" style="border-color: var(--accent);">
                    <h3>Diagnostics & Benchmarks</h3>
                    <div id="bench-terminal" style="background:#000; color:#00ff88; font-family:var(--font-mono); padding:10px; height:100px; overflow-y:auto; border:1px solid var(--border-light); font-size:0.8rem; margin-bottom:10px; border-radius:4px;">
                        > System Initialized.<br>> Awaiting benchmark commands...
                    </div>
                    
                    <div style="display:flex; gap:10px;">
                        <button class="btn-action" style="flex:1; padding:8px; font-size:0.75rem;" onclick="window.server.runBenchmark('LINPACK')">LINPACK (FP64)</button>
                        <button class="btn-action" style="flex:1; padding:8px; font-size:0.75rem;" onclick="window.server.runBenchmark('MLPerf')">MLPerf (AI)</button>
                        <button class="btn-action" style="flex:1; padding:8px; font-size:0.75rem;" onclick="window.server.runBenchmark('IO500')">IO500 (Storage)</button>
                    </div>
                </div>

                <div class="panel" style="border-color: var(--accent-success);">
                    <h3>Contract Fulfillment</h3>

                    <div style="margin-top:5px; background:rgba(0,0,0,0.3); padding:12px; border-radius:6px; margin-bottom:15px; border:1px solid var(--border-dim);">
                        <ul id="srv-live-stats" style="list-style:none; padding:0; margin:0; font-size:0.8rem; color:#ccc;">
                            <li>Initializing physics...</li>
                        </ul>
                    </div>

                    <button id="btn-deploy" class="btn-action" onclick="window.server.saveSystem()">
                        SIGN CONTRACT & DEPLOY
                    </button>
                </div>

                <div class="panel" style="grid-column: 1 / -1; border-color: var(--border-light);">
                    <h3 style="border-bottom:1px solid var(--border-dim); margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                        Active Deployments
                        <button onclick="window.server.refreshLineup()" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:0.7rem;">↻ Refresh</button>
                    </h3>
                    <div id="active-server-list" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:12px;"></div>
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

    populatePartDropdowns: function() {
        if(!window.sys) return;
        const db = window.sys.load();
        
        const fill = (id, type) => {
            const el = document.getElementById(id);
            if(!el) return;
            const parts = db.inventory.filter(i => i.type.toLowerCase() === type.toLowerCase());
            
            if(parts.length === 0) {
                el.innerHTML = `<option value="">No ${type}s available</option>`;
            } else {
                el.innerHTML = parts.map(p => {
                    let extra = "";
                    if(type === 'RAM' || type === 'Storage') extra = ` | ${p.specs.Capacity || ''}`;
                    return `<option value="${p.id}">${p.name}${extra}</option>`;
                }).join('');
                el.value = parts[parts.length-1].id; 
            }
        };

        fill('srv-cpu', 'CPU');
        fill('srv-gpu', 'GPU');
        fill('srv-ram', 'RAM');
        fill('srv-storage', 'Storage');
    },

    // --- 3. PHYSICS & FINANCIAL ENGINE ---
    updatePhysics: function() {
        if(!window.sys) return;
        const db = window.sys.load();
        
        const getPart = (id) => {
            const val = document.getElementById(id).value;
            if(!val) return null;
            return db.inventory.find(i => i.id == val);
        };

        // 1. GATHER INPUTS
        const cpu = getPart('srv-cpu');
        const gpu = getPart('srv-gpu');
        const ram = getPart('srv-ram');
        const sto = getPart('srv-storage');

        const cpuQty = parseInt(document.getElementById('srv-cpu-qty').value);
        const gpuQty = parseInt(document.getElementById('srv-gpu-qty').value);
        const ramQty = parseInt(document.getElementById('srv-ram-qty').value); 
        const stoQty = parseInt(document.getElementById('srv-sto-qty').value); 
        
        const nodesPerRack = parseInt(document.getElementById('srv-density').value);
        const rackCount = parseInt(document.getElementById('srv-racks').value);
        const totalNodes = nodesPerRack * rackCount;

        const rackDef = this.rack_types[document.getElementById('srv-rack').value];
        const cooling = this.cooling_infra[document.getElementById('srv-cool').value];
        const topology = this.network_topology[document.getElementById('srv-net').value];
        const nicDef = this.nic_types[document.getElementById('srv-nic').value];
        const psuDef = this.psu_types[document.getElementById('srv-psu').value];
        const isRedundant = document.getElementById('srv-redundant-psu').checked;

        const contract = this.contracts.find(c => c.id === document.getElementById('srv-contract').value);

        // 2. RACK U-SPACE CALCULATOR
        let nodeU = 1; // Base chassis
        if (gpuQty >= 2) nodeU += Math.ceil(gpuQty / 2); // 1U per 2 GPUs
        if (stoQty > 8) nodeU += 1; // Extra storage array U
        if (isRedundant) nodeU += 0.5; // Bigger chassis for dual PSUs
        nodeU = Math.ceil(nodeU);

        const usedU = nodesPerRack * nodeU;
        const uValid = usedU <= rackDef.u;

        // 3. POWER & COOLING CALCULATIONS
        const rawNodeWatts = 
            ((cpu ? cpu.raw.tdp : 100) * cpuQty) + 
            ((gpu ? gpu.raw.tdp : 250) * gpuQty) + 
            (4 * ramQty) + (6 * stoQty) + nicDef.watts;
        
        const realNodeWatts = rawNodeWatts / psuDef.eff; // PSU inefficiency adds heat
        const rackWatts = realNodeWatts * nodesPerRack;
        const clusterRawWatts = rackWatts * rackCount;

        // Cooling limit modified by rack airflow
        const effectiveCoolLimit = cooling.limit * rackDef.airflow;
        const rackHeat = rackWatts; 

        let throttle = 1.0;
        let thermalStatus = "Optimal";
        let heatColor = "#00e676";

        if (rackHeat > effectiveCoolLimit) {
            throttle = effectiveCoolLimit / rackHeat;
            thermalStatus = `MELTDOWN (-${((1-throttle)*100).toFixed(0)}%)`;
            heatColor = "#ff1744";
        } else if (rackHeat > effectiveCoolLimit * 0.85) {
            thermalStatus = "Hot / Warning";
            heatColor = "#ffaa00";
        }

        const totalFacWatts = clusterRawWatts * cooling.pue; // Datacenter draw

        // 4. PERFORMANCE & SLA CALCS
        let cpuScore = cpu ? (cpu.raw.benchmarks?.multiScore || cpu.score || 0) : 0;
        let gpuScore = gpu ? (gpu.raw.benchmarks?.score || gpu.score || 0) : 0;
        
        // Memory Bandwidth limit hack
        let memChannels = Math.min(8, ramQty / cpuQty); 
        let memBonus = 1 + (memChannels * 0.1);

        // Raw TFLOPS approximation
        const nodeTflops = (((cpuScore * cpuQty * 0.05) + (gpuScore * gpuQty * 0.4)) * memBonus * throttle) / 100;
        
        // Topology Scaling
        let scaleFactor = topology.efficiency * nicDef.eff;
        if (totalNodes > 200 && scaleFactor < 0.8) scaleFactor *= 0.5;
        if (totalNodes > 1000 && scaleFactor < 0.95) scaleFactor *= 0.6;

        const clusterTFLOPS = nodeTflops * totalNodes * scaleFactor;

        // Uptime SLA Math
        let uptime = psuDef.rel;
        if (isRedundant) uptime += (100 - uptime) * 0.9; // Redundancy covers 90% of failures
        if (topology.latency === 'High') uptime -= 0.1; // Bad network drops packets

        // 5. FINANCIALS
        const nodePartsCost = 
            ((cpu?.raw.price||0) * cpuQty) + ((gpu?.raw.price||0) * gpuQty) + 
            ((ram?.raw.price||0) * ramQty) + ((sto?.raw.price||0) * stoQty) + 
            nicDef.cost + (isRedundant ? psuDef.cost * 2 : psuDef.cost);
            
        const totalProjectCost = Math.ceil((nodePartsCost * totalNodes) * 1.10);
        const profit = contract.budget - totalProjectCost;

        // 6. VALIDATION & RENDER
        const display = document.getElementById('srv-live-stats');
        const btnDeploy = document.getElementById('btn-deploy');
        let errors = [];

        if(!cpu) errors.push("Missing CPU");
        if(!ram) errors.push("Missing RAM");
        if(!uValid) errors.push(`Rack Overfilled: ${usedU}U / ${rackDef.u}U`);
        if(clusterTFLOPS < contract.reqTflops) errors.push(`Contract Failed: Need ${contract.reqTflops} TFLOPS`);
        if(uptime < contract.reqUptime) errors.push(`Contract Failed: Need ${contract.reqUptime}% Uptime`);

        if(errors.length > 0) {
            btnDeploy.disabled = true;
            btnDeploy.innerText = "REQUIREMENTS NOT MET";
            display.innerHTML = errors.map(e => `<li style="color:#ff1744; font-weight:bold;">❌ ${e}</li>`).join('');
            
            // Still show U info if it's a U error
            if(!uValid) {
                display.innerHTML += `<li style="margin-top:10px; color:#aaa;">Each node is ${nodeU}U. Reduce Nodes per Rack.</li>`;
            }
        } else {
            btnDeploy.disabled = false;
            btnDeploy.innerText = "SIGN CONTRACT & DEPLOY";
            
            let perfLabel = clusterTFLOPS > 1000 ? (clusterTFLOPS/1000).toFixed(2) + " PFLOPS" : clusterTFLOPS.toFixed(1) + " TFLOPS";

            display.innerHTML = `
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>U-Space:</span> <b style="color:${usedU===rackDef.u?'#ffaa00':'#fff'}">${usedU}U / ${rackDef.u}U</b></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Uptime SLA:</span> <b style="color:#00e676">${uptime.toFixed(3)}%</b></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Compute:</span> <b style="color:var(--accent)">${perfLabel}</b></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Rack Density:</span> <b style="color:${heatColor}">${(rackHeat/1000).toFixed(1)} kW</b> <span style="font-size:0.7rem">(${thermalStatus})</span></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Facility Power:</span> <b>${(totalFacWatts/1000000).toFixed(2)} MW</b> <span style="font-size:0.7rem">(PUE ${cooling.pue})</span></li>
                <li style="border-top:1px solid #333; margin-top:6px; padding-top:6px; display:flex; justify-content:space-between;">
                    <span>Mfg Cost:</span> <span style="color:#aaa">-$${(totalProjectCost/1000000).toFixed(2)}M</span>
                </li>
                <li style="border-top:1px solid #333; margin-top:6px; padding-top:6px; display:flex; justify-content:space-between; font-size:0.9rem;">
                    <span>Net Profit:</span> <b style="color:${profit>0?'#00e676':'#ff1744'}">$${(profit/1000000).toFixed(2)}M</b>
                </li>
            `;
        }

        return { 
            valid: errors.length === 0, 
            profit, clusterTFLOPS, totalNodes, scaleFactor, nodeWatts: realNodeWatts,
            totalProjectCost,
            parts: {cpu, gpu, ram, sto}, contract
        };
    },

    scrapeData: function() {
        return {
            name: document.getElementById('srv-name').value,
            year: parseFloat(document.getElementById('srv-year').value)
        };
    },

    // --- 4. DEEP BENCHMARKS ---
    runBenchmark: function(type) {
        const term = document.getElementById('bench-terminal');
        const physics = this.updatePhysics();
        
        if (!physics.parts.cpu) {
            term.innerHTML += `<br><span style="color:#ff1744">> Error: Hardware missing.</span>`;
            return;
        }

        term.innerHTML += `<br>> Executing ${type} workload...`;
        term.scrollTop = term.scrollHeight;

        setTimeout(() => {
            let score = 0;
            let unit = "";
            let randomVar = (Math.random() * 0.05) + 0.97; 

            if (type === 'LINPACK') {
                // FP64 - Heavily CPU weighted unless specialized GPUs are present
                const gpuCount = parseInt(document.getElementById('srv-gpu-qty').value);
                const gpuMulti = gpuCount > 0 ? 1.5 : 0.5; 
                score = physics.clusterTFLOPS * gpuMulti * randomVar; 
                unit = "TFLOPS (FP64)";
            } else if (type === 'MLPerf') {
                // AI Training (Images/sec) - Pure GPU + Network
                const gpuCount = parseInt(document.getElementById('srv-gpu-qty').value);
                if (gpuCount === 0) {
                    score = 0; 
                    unit = "Failed (No Accelerators)";
                } else {
                    score = (physics.clusterTFLOPS * 40) * physics.scaleFactor * randomVar;
                    unit = "Images/sec";
                }
            } else if (type === 'IO500') {
                // Storage Bandwidth
                const stoQty = parseInt(document.getElementById('srv-sto-qty').value);
                const driveBaseSpeed = 3.5; // GiB/s per drive roughly
                score = (stoQty * driveBaseSpeed * physics.totalNodes) * physics.scaleFactor * randomVar;
                unit = "GB/s";
            }

            term.innerHTML += `<br>> Result: <b style="color:#fff">${score.toLocaleString(undefined, {maximumFractionDigits:2})} ${unit}</b>`;
            term.scrollTop = term.scrollHeight;
        }, 800);
    },

    // --- 5. SAVE & LINEUP ---
    refreshLineup: function() {
        const container = document.getElementById('active-server-list');
        if(!container || !window.sys) return;

        const db = window.sys.load();
        const active = db.inventory.filter(i => i.type === 'Server' && i.active === true);

        if(active.length === 0) {
            container.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:20px;">No active deployments globally.</div>`;
            return;
        }

        container.innerHTML = active.map(s => {
            const specs = s.specs || {};
            return `
            <div class="panel" style="padding:15px; display:flex; flex-direction:column; gap:8px;">
                <div style="font-weight:800; color:var(--accent); font-size:1rem; border-bottom:1px solid #333; padding-bottom:5px;">${s.name}</div>
                <div style="font-size:0.75rem; color:#aaa; font-family:var(--font-mono); margin-bottom:5px;">
                    <div>${specs.Contract}</div>
                    <div style="margin-top:4px;">${specs.Scale}</div>
                    <div style="margin-top:4px;">Net: <span style="color:${specs.Profit > 0 ? '#00e676' : '#ff1744'};">$${(specs.Profit/1000000).toFixed(1)}M</span></div>
                </div>
                <button onclick="window.sys.discontinue(${s.id})" 
                    style="margin-top:auto; background:rgba(255,23,68,0.1); color:#ff1744; border:1px solid rgba(255,23,68,0.3); font-weight:bold; font-size:0.7rem; padding:8px; cursor:pointer; border-radius:4px; transition:0.2s;">
                    DECOMMISSION
                </button>
            </div>
            `;
        }).join('');
    },

    saveSystem: function() {
        const physics = this.updatePhysics();
        const meta = this.scrapeData();

        if(!physics.valid) return;

        let perfLabel = physics.clusterTFLOPS > 1000 ? (physics.clusterTFLOPS/1000).toFixed(2) + " PFLOPS" : physics.clusterTFLOPS.toFixed(1) + " TFLOPS";

        const specs = {
            "Contract": physics.contract.name,
            "Scale": `${physics.totalNodes} Nodes`,
            "Compute": perfLabel,
            "Draw": `${(physics.nodeWatts * physics.totalNodes / 1000000).toFixed(2)} MW`,
            "Profit": physics.profit 
        };

        window.sys.saveDesign('Server', {
            name: meta.name,
            year: meta.year,
            price: physics.contract.budget,
            specs: specs,
            ...meta,
            profit: physics.profit // Fixing the profit save bug
        });

        this.refreshLineup();
    }
};
