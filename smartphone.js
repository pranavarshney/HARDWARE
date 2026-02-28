/* HARDWARE TYCOON: SMARTPHONE ARCHITECT
 * PHYSICS ENGINE V2.0 (Deep Integration, Thermals, Form Factors & UX)
 */

window.smartphone = {

    // --- 1. GENERIC COMPONENTS ---
    chassis_opts: {
        'Plastic Unibody': { mat: 'Plastic', thermals: 1.0, cost: 10, weight: 30, repair: +2, durability: 'Medium' },
        'Aluminum Sandwich': { mat: 'Alu+Glass', thermals: 1.5, cost: 30, weight: 50, repair: 0, durability: 'Low' },
        'Stainless Steel Pro': { mat: 'Steel+Glass', thermals: 1.2, cost: 50, weight: 80, repair: -1, durability: 'High' },
        'Titanium Grade 5': { mat: 'Titanium', thermals: 1.4, cost: 80, weight: 55, repair: -1, durability: 'Very High' },
        'Ceramic Ultra': { mat: 'Ceramic', thermals: 1.3, cost: 100, weight: 90, repair: -2, durability: 'Extreme' }
    },

    battery_tech: {
        'Li-Po Standard': { density: 1.0, costPerAh: 5, deg: 0.8 }, // 80% capacity after 2 years
        'Li-Ion High Cap': { density: 1.2, costPerAh: 8, deg: 0.85 },
        'Si-Carbon (NextGen)': { density: 1.5, costPerAh: 15, deg: 0.9 },
        'Graphene Solid': { density: 2.0, costPerAh: 40, deg: 0.95 }
    },

    charge_opts: {
        '15W Basic': { watts: 15, cost: 2, heat: 1, batPenalty: 0 },
        '25W Fast': { watts: 25, cost: 5, heat: 2, batPenalty: 0.02 },
        '65W SuperDart': { watts: 65, cost: 12, heat: 4, batPenalty: 0.05 },
        '120W HyperCharge': { watts: 120, cost: 25, heat: 7, batPenalty: 0.08 },
        '240W Ultra': { watts: 240, cost: 40, heat: 10, batPenalty: 0.12 }
    },

    features_opts: {
        'Basic': { modem: '4G', ip: 'None', cost: 10, pwr: 1, repair: +1 },
        'Standard': { modem: '5G', ip: 'IP67', cost: 30, pwr: 2, repair: -1 },
        'Flagship': { modem: '5G mmWave', ip: 'IP68', cost: 60, pwr: 3, repair: -2 },
        'Future': { modem: '6G Sat', ip: 'IP69K', cost: 120, pwr: 5, repair: -3 }
    },

    ram_opts: {
        'LPDDR4X': { speedMult: 1.0, pwrMult: 1.0, cost: 10 },
        'LPDDR5': { speedMult: 1.2, pwrMult: 0.85, cost: 25 },
        'LPDDR5X': { speedMult: 1.35, pwrMult: 0.75, cost: 45 }
    },

    storage_opts: {
        'UFS 2.2': { speed: 1000, cost: 5 },
        'UFS 3.1': { speed: 2100, cost: 15 },
        'UFS 4.0': { speed: 4200, cost: 35 },
        'NVMe (Apple style)': { speed: 5000, cost: 60 }
    },

    os_opts: {
        'Bloated Carrier UI': { perf: 0.85, battery: 0.9, cost: -20 }, // Carriers pay you
        'Heavy Custom UI': { perf: 0.9, battery: 0.95, cost: 10 },
        'Clean Stock OS': { perf: 1.0, battery: 1.0, cost: 0 },
        'Ultra-Optimized OS': { perf: 1.15, battery: 1.2, cost: 40 } // Like iOS/Custom Kernel
    },

    // --- 2. RENDER UI ---
    render: function(container) {
        if (!container) return;
        const currentYear = new Date().getFullYear();

        container.innerHTML = `
            <div class="architect-container">
                
                <div class="panel" style="border-color: var(--accent);">
                    <h3>Device Identity & Form</h3>
                    <div class="input-group">
                        <label>Product Name</label>
                        <input type="text" id="phone-name" value="Galaxy X-1">
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Form Factor</label>
                            <select id="phone-form" onchange="window.smartphone.updatePhysics()">
                                <option value="Candybar">Standard Bar</option>
                                <option value="Foldable">Foldable (Book)</option>
                                <option value="Flip">Flip Phone</option>
                                <option value="Gaming">Gaming (Trigger+RGB)</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Launch Year</label>
                            <input type="number" id="phone-year" value="${currentYear}">
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>Compute & Memory</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Processor (SoC)</label>
                            <select id="phone-cpu" class="part-selector"></select>
                        </div>
                        <div class="input-group">
                            <label>Graphics (GPU)</label>
                            <select id="phone-gpu" class="part-selector"></select>
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px;">
                        <div class="input-group">
                            <label>Memory Module</label>
                            <select id="phone-ram" class="part-selector"></select>
                        </div>
                        <div class="input-group">
                            <label>RAM Generation</label>
                            <select id="phone-ram-gen" onchange="window.smartphone.updatePhysics()">
                                ${this.renderOptions(this.ram_opts)}
                            </select>
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px;">
                        <div class="input-group">
                            <label>Storage Drive</label>
                            <select id="phone-storage" class="part-selector"></select>
                        </div>
                        <div class="input-group">
                            <label>Storage Standard</label>
                            <select id="phone-storage-gen" onchange="window.smartphone.updatePhysics()">
                                ${this.renderOptions(this.storage_opts)}
                            </select>
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>Visual & Camera</h3>
                    <div class="input-group">
                        <label>Display Panel</label>
                        <select id="phone-display" class="part-selector"></select>
                    </div>
                    <div class="input-group" style="margin-top:10px;">
                        <label>Camera System</label>
                        <select id="phone-camera" class="part-selector"></select>
                    </div>
                </div>

                <div class="panel">
                    <h3>Power, Build & Thermals</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Chassis Material</label>
                            <select id="phone-chassis" onchange="window.smartphone.updatePhysics()">
                                ${this.renderOptions(this.chassis_opts)}
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Battery Size (mAh)</label>
                            <input type="number" id="phone-bat-cap" value="5000" step="100">
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px;">
                        <div class="input-group">
                            <label>Battery Tech</label>
                            <select id="phone-bat-tech" onchange="window.smartphone.updatePhysics()">
                                ${this.renderOptions(this.battery_tech)}
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Wired Charging</label>
                            <select id="phone-charge" onchange="window.smartphone.updatePhysics()">
                                ${this.renderOptions(this.charge_opts)}
                            </select>
                        </div>
                    </div>
                </div>

                <div class="panel" style="border-color: #bd00ff;">
                    <h3 style="color:#bd00ff;">Software & Ecosystem</h3>
                    <div class="input-group">
                        <label>Operating System</label>
                        <select id="phone-os" onchange="window.smartphone.updatePhysics()">
                            ${this.renderOptions(this.os_opts)}
                        </select>
                    </div>
                    <div class="input-group" style="margin-top:10px;">
                        <label>Connectivity & IP Rating</label>
                        <select id="phone-features" onchange="window.smartphone.updatePhysics()">
                            ${this.renderOptions(this.features_opts)}
                        </select>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:15px;">
                        <label style="display:flex; align-items:center; gap:5px; font-size:0.8rem; color:#aaa; cursor:pointer;">
                            <input type="checkbox" id="feat-wireless" checked onchange="window.smartphone.updatePhysics()"> Qi Wireless Charging
                        </label>
                        <label style="display:flex; align-items:center; gap:5px; font-size:0.8rem; color:#aaa; cursor:pointer;">
                            <input type="checkbox" id="feat-nfc" checked onchange="window.smartphone.updatePhysics()"> NFC (Payments)
                        </label>
                        <label style="display:flex; align-items:center; gap:5px; font-size:0.8rem; color:#aaa; cursor:pointer;">
                            <input type="checkbox" id="feat-mag" onchange="window.smartphone.updatePhysics()"> Magnetic Attach
                        </label>
                        <label style="display:flex; align-items:center; gap:5px; font-size:0.8rem; color:#aaa; cursor:pointer;">
                            <input type="checkbox" id="feat-stylus" onchange="window.smartphone.updatePhysics()"> Active Stylus
                        </label>
                    </div>
                </div>

                <div class="panel" style="border-color: var(--accent-success);">
                    <h3>Market Launch</h3>
                    <div class="input-group">
                        <label>MSRP ($)</label>
                        <input type="number" id="phone-price" value="999">
                    </div>

                    <div style="margin-top:15px; background:rgba(0,0,0,0.3); padding:10px; border-radius:4px; margin-bottom:15px; border:1px solid #333;">
                        <ul id="phone-live-stats" style="list-style:none; padding:0; margin:0; font-size:0.8rem; color:#ccc;">
                            <li>Select parts to simulate...</li>
                        </ul>
                    </div>

                    <button class="btn-action" onclick="window.smartphone.saveSystem()">
                        ASSEMBLE & SHIP
                    </button>
                </div>

                <div class="panel" style="grid-column: 1 / -1; border-color: #444;">
                    <h3 style="border-bottom:1px solid #444; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                        Active Smartphones
                        <button onclick="window.smartphone.refreshLineup()" style="background:none; border:none; color:#888; cursor:pointer; font-size:0.7rem;">↻ Refresh</button>
                    </h3>
                    <div id="active-phone-list" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:12px;"></div>
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
                el.innerHTML = `<option value="">No ${type}s</option>`;
            } else {
                el.innerHTML = parts.map(p => {
                    let extra = "";
                    if(type === 'Display') extra = ` | ${p.specs.Resolution}`;
                    if(type === 'Camera') extra = ` | ${p.specs.Main}`;
                    return `<option value="${p.id}">${p.name}${extra}</option>`;
                }).join('');
                el.value = parts[parts.length-1].id; 
            }
        };

        fill('phone-cpu', 'CPU');
        fill('phone-gpu', 'GPU');
        fill('phone-ram', 'RAM');
        fill('phone-storage', 'Storage');
        fill('phone-display', 'Display');
        fill('phone-camera', 'Camera');
    },

    // --- 3. PHYSICS ENGINE V2.0 ---
    updatePhysics: function() {
        if(!window.sys) return;
        const db = window.sys.load();
        
        const getPart = (id) => {
            const val = document.getElementById(id).value;
            if(!val) return null;
            return db.inventory.find(i => i.id == val);
        };

        // Get Parts
        const cpu = getPart('phone-cpu');
        const gpu = getPart('phone-gpu');
        const ram = getPart('phone-ram');
        const sto = getPart('phone-storage');
        const cam = getPart('phone-camera');
        const disp = getPart('phone-display');

        // Get Options
        const chassis = this.chassis_opts[document.getElementById('phone-chassis').value];
        const batTech = this.battery_tech[document.getElementById('phone-bat-tech').value];
        const charge = this.charge_opts[document.getElementById('phone-charge').value];
        const feat = this.features_opts[document.getElementById('phone-features').value];
        const ramGen = this.ram_opts[document.getElementById('phone-ram-gen').value];
        const stoGen = this.storage_opts[document.getElementById('phone-storage-gen').value];
        const os = this.os_opts[document.getElementById('phone-os').value];
        const form = document.getElementById('phone-form').value;
        const batCap = parseFloat(document.getElementById('phone-bat-cap').value) || 3000;
        const sellPrice = parseFloat(document.getElementById('phone-price').value) || 0;

        // Extras
        const hasWireless = document.getElementById('feat-wireless').checked;
        const hasNFC = document.getElementById('feat-nfc').checked;
        const hasMag = document.getElementById('feat-mag').checked;
        const hasStylus = document.getElementById('feat-stylus').checked;

        let errors = [];

        // --- A. FORM FACTOR PENALTIES & PHYSICALS ---
        let mfgCost = 20, extraWeight = 0, thickness = 7.5;
        let thermalMult = 1.0;
        let repairability = 8 + chassis.repair + feat.repair;

        if(form === 'Foldable') { 
            mfgCost += 150; extraWeight += 90; thickness = 14.5; thermalMult = 0.8; repairability -= 4; 
            if(disp && disp.raw.size < 7) errors.push("Foldable needs display > 7 inches");
        }
        if(form === 'Flip') { 
            mfgCost += 80; extraWeight += 30; thickness = 15.5; thermalMult = 0.7; repairability -= 3; 
        }
        if(form === 'Gaming') { 
            mfgCost += 30; extraWeight += 50; thickness = 9.5; thermalMult = 1.6; // Vapor chambers
        }

        // Add extra hardware weights/costs
        if(hasWireless) { extraWeight += 10; mfgCost += 10; thickness += 0.5; }
        if(hasMag) { extraWeight += 15; mfgCost += 15; }
        if(hasStylus) { extraWeight += 15; mfgCost += 25; thickness += 1.0; }

        // Final Dimensions
        const totalWeight = chassis.weight + extraWeight + (batCap * 0.015) + (disp ? disp.raw.size * 12 : 50);
        
        // --- B. THERMALS & IP RATING ---
        // IP68/69K seals the phone, trapping heat
        if(feat.ip === 'IP68') thermalMult *= 0.9;
        if(feat.ip === 'IP69K') thermalMult *= 0.85;

        // Max sustained TDP
        const maxSustainedTDP = (chassis.thermals * 5) * thermalMult;

        // --- C. POWER & BATTERY MODEL ---
        // Mobile loads are bursty. We use 80% for gaming, but average use is much lower.
        // We will calculate a "Typical Daily Load"
        const cpuTDP = cpu ? (cpu.raw?.pl1 || cpu.raw?.tdp || 10) : 10;
        const gpuTDP = gpu ? (gpu.raw?.tdp || 15) : 0;
        if (cpuTDP > 50) errors.push("CPU TDP exceeds mobile limits (Max 50W)");

        const avgCpuPwr = cpuTDP * 0.35 * ramGen.pwrMult; // Ram efficiency helps SoC
        const avgGpuPwr = gpuTDP * 0.2; 
        
        // Display Power (Adaptive brightness average ~ 20% of peak nits)
        let dispPwr = 1.0;
        if(disp) {
            const area = (disp.raw.w * disp.raw.h) / 2000000;
            // 200 nits average indoor use.
            dispPwr = area * ((disp.raw.nits * 0.2) / 200) * (disp.raw.hz / 60) * 0.8;
        }
        
        let sysPwr = (avgCpuPwr + avgGpuPwr + dispPwr + feat.pwr) / os.battery; 
        
        const wattHours = (batCap * 3.8) / 1000;
        const batteryLifeHours = wattHours / Math.max(0.5, sysPwr);

        // Charging & Degradation
        const chargeTimeMins = (wattHours / charge.watts) * 60 * 1.2; // 20% overhead for taper
        let degradation = batTech.deg - charge.batPenalty;
        if (degradation < 0.5) degradation = 0.5;

        // --- D. BOTTLENECKS ---
        let storageBottleneck = false;
        if(cam && stoGen) {
            // High MP or 8K video needs UFS 3.1 minimum
            if ((cam.raw.mp > 100 || cam.raw.vid === '8K') && stoGen.speed < 2000) {
                storageBottleneck = true;
                errors.push("Storage Speed Bottleneck: Camera requires UFS 3.1+");
            }
        }

        // --- E. PERFORMANCE SCORES ---
        let baseCpu = cpu ? (cpu.raw.benchmarks?.multiScore || 0) : 0;
        let baseGpu = gpu ? (gpu.raw.benchmarks?.gaming || gpu.specs?.Score || 0) : 0;
        let baseCam = cam ? ((cam.raw.benchmarks?.photo || 0) + (cam.raw.benchmarks?.video || 0)) : 0;
        let baseDisp = disp ? (disp.raw.benchmarks?.creative || 0) : 0;
        
        // OS & RAM Generation Multipliers
        baseCpu *= ramGen.speedMult * os.perf;
        baseGpu *= ramGen.speedMult * os.perf;
        if(storageBottleneck) baseCam *= 0.5;

        // Throttling under heavy load
        const peakTDP = cpuTDP + gpuTDP;
        let throttle = 1.0;
        if(peakTDP > maxSustainedTDP) {
            throttle = maxSustainedTDP / peakTDP;
            // Phones can burst for a minute, so we soften the penalty slightly
            throttle = Math.pow(throttle, 0.7); 
        }

        const finalPerf = (baseCpu + baseGpu) * throttle;
        
        // Dynamic Score Weighting based on Form Factor
        let wPerf = 0.3, wCam = 0.3, wDisp = 0.2, wBat = 0.2;
        if (form === 'Gaming') { wPerf = 0.5; wCam = 0.1; wDisp = 0.25; wBat = 0.15; }
        if (form === 'Foldable') { wPerf = 0.2; wCam = 0.2; wDisp = 0.4; wBat = 0.2; }

        let phoneScore = (finalPerf * wPerf) + (baseCam * wCam) + (baseDisp * wDisp * 10) + (batteryLifeHours * 200 * wBat);
        if(hasNFC) phoneScore += 200;
        if(hasStylus) phoneScore += 500;
        
        // --- F. MARKET LABEL ---
        let marketLabel = "Mid-Range";
        if (phoneScore > 20000 && sellPrice < 600) marketLabel = "Value King 👑";
        else if (phoneScore > 25000 && sellPrice >= 1000) marketLabel = "Ultra Flagship";
        else if (phoneScore > 15000) marketLabel = "Premium Flagship";
        else if (sellPrice <= 300) marketLabel = "Budget Entry";

        // --- G. COST & PROFIT ---
        const partsCost = (cpu?.raw.price||0) + (gpu?.raw.price||0) + (ram?.raw.price||0) + (sto?.raw.price||0) + (cam?.raw.price||0) + (disp?.raw.price||0);
        const batCost = (batCap / 1000) * batTech.costPerAh;
        
        const totalCost = partsCost + batCost + chassis.cost + feat.cost + charge.cost + ramGen.cost + stoGen.cost + mfgCost + os.cost;
        const profit = sellPrice - totalCost;

        // --- H. RENDER ---
        const displayUI = document.getElementById('phone-live-stats');
        if(displayUI) {
            if(errors.length > 0) {
                displayUI.innerHTML = errors.map(e => `<li style="color:#ff1744; font-weight:bold;">❌ ${e}</li>`).join('');
            } else {
                let lifeColor = batteryLifeHours > 10 ? "#00e676" : (batteryLifeHours > 6 ? "#ffaa00" : "#ff1744");
                let thermColor = throttle < 0.9 ? "#ff1744" : "#00e676";
                let repairColor = repairability > 7 ? "#00e676" : (repairability > 4 ? "#ffaa00" : "#ff1744");

                displayUI.innerHTML = `
                    <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Market Tier:</span> <b style="color:var(--accent)">${marketLabel}</b></li>
                    <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Battery Life:</span> <b style="color:${lifeColor}">${batteryLifeHours.toFixed(1)} Hours</b></li>
                    <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>0-100% Charge:</span> <b>${Math.floor(chargeTimeMins)} mins</b></li>
                    <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Thermal Peak:</span> <b style="color:${thermColor}">${throttle<0.9?'Throttling':'Optimal'} (${(throttle*100).toFixed(0)}%)</b></li>
                    <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Physicals:</span> <b>${Math.floor(totalWeight)}g | ${thickness.toFixed(1)}mm</b></li>
                    <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Repairability:</span> <b style="color:${repairColor}">${Math.max(0, repairability)}/10</b></li>
                    
                    <li style="border-top:1px solid #333; margin-top:6px; padding-top:6px; display:flex; justify-content:space-between;">
                        <span>Composite Score:</span> <b style="color:var(--accent)">${Math.floor(phoneScore)}</b>
                    </li>
                    <li style="display:flex; justify-content:space-between;">
                        <span>Bill of Materials:</span> <span style="color:#aaa">-$${Math.floor(totalCost)}</span>
                    </li>
                    <li style="border-top:1px dashed #444; margin-top:4px; padding-top:4px; display:flex; justify-content:space-between; font-size:0.9rem;">
                        <span>Net Profit:</span> <b style="color:${profit>0?'#00e676':'#ff1744'}">$${Math.floor(profit)}</b>
                    </li>
                `;
            }
        }

        return { 
            valid: errors.length === 0, 
            totalCost, phoneScore, errors, batteryLifeHours, marketLabel, osName: document.getElementById('phone-os').value, form,
            parts: {cpu, gpu, ram, sto, cam, disp}
        };
    },

    scrapeData: function() {
        return {
            name: document.getElementById('phone-name').value,
            year: parseFloat(document.getElementById('phone-year').value),
            price: parseFloat(document.getElementById('phone-price').value),
            form: document.getElementById('phone-form').value
        };
    },

    // --- 5. SAVE ---
    refreshLineup: function() {
        const container = document.getElementById('active-phone-list');
        if(!container || !window.sys) return;

        const db = window.sys.load();
        const active = db.inventory.filter(i => i.type === 'Smartphone' && i.active === true);

        if(active.length === 0) {
            container.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:20px;">No active Smartphones on the market.</div>`;
            return;
        }

        container.innerHTML = active.map(p => {
            const specs = p.specs || {};
            // Safely parse battery hours from the saved string for color formatting
            let batVal = parseFloat(specs.Battery) || 0;
            let batColor = batVal > 10 ? '#00e676' : (batVal < 6 ? '#ff1744' : '#ffaa00');

            return `
            <div class="panel" style="padding:15px; display:flex; flex-direction:column; gap:5px;">
                <div style="font-weight:800; color:var(--accent); font-size:1rem; display:flex; justify-content:space-between;">
                    ${p.name}
                    <span style="font-size:0.6rem; color:#888; border:1px solid #444; padding:2px 4px; border-radius:3px;">${p.raw?.form || 'Phone'}</span>
                </div>
                <div style="font-size:0.75rem; color:#aaa; font-family:var(--font-mono);">
                    <div style="color:#fff; margin-bottom:4px;">${specs.Market}</div>
                    <div>${specs.SoC}</div>
                    <div>${specs.Screen}</div>
                    <div style="margin-top:4px; display:flex; justify-content:space-between;">
                        <span style="color:var(--accent);">$${p.price || p.raw?.price || 0}</span>
                        <span style="color:${batColor}">${specs.Battery}</span>
                    </div>
                </div>
                <button onclick="window.sys.discontinue(${p.id})" 
                    style="margin-top:10px; background:rgba(255,23,68,0.1); color:#ff1744; border:1px solid rgba(255,23,68,0.3); font-weight:bold; font-size:0.7rem; padding:8px; cursor:pointer; border-radius:4px; transition:0.2s;">
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
            alert("CANNOT LAUNCH: Check validation errors.");
            return;
        }

        const p = physics.parts;
        const specs = {
            "Market": physics.marketLabel,
            "SoC": p.cpu ? p.cpu.name : "Generic Chip",
            "Screen": p.disp ? `${p.disp.specs.Resolution} ${p.disp.specs.Panel}` : "Generic LCD",
            "Camera": p.cam ? `${p.cam.specs.Main}` : "Basic",
            "Battery": `${physics.batteryLifeHours.toFixed(1)} Hrs`,
            "Score": Math.floor(physics.phoneScore)
        };

        window.sys.saveDesign('Smartphone', {
            name: meta.name,
            year: meta.year,
            price: meta.price, // Saving at top level to fix the price bug
            specs: specs,
            ...meta
        });

        this.refreshLineup();
    }
};