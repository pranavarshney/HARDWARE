/* HARDWARE TYCOON: DISPLAY ARCHITECT
 * PHYSICS ENGINE V3.0 (Color Gamut, Bandwidth Limits, Power & Subscores)
 * Optimized for Flat Structure
 */

window.display = {

    // --- 1. PRESETS ---
    // Added new fields (gamut, port, sync, curve) to existing presets so they load perfectly.
    presets: {
        'Retro CRT (1990)': { type: 'CRT', size: 19, w: 640, h: 480, hz: 60, nits: 100, contrast: 15000, resp: 0.01, bits: 8, price: 200, gamut: '70% sRGB', port: 'VGA', sync: 'None', curve: 'Flat' },
        'Office LCD (2005)': { type: 'TN', size: 24, w: 1920, h: 1080, hz: 60, nits: 250, contrast: 800, resp: 5, bits: 6, price: 150, gamut: '90% sRGB', port: 'HDMI 1.4', sync: 'None', curve: 'Flat' },
        'Pro IPS (2015)': { type: 'IPS', size: 27, w: 2560, h: 1440, hz: 60, nits: 350, contrast: 1000, resp: 4, bits: 10, price: 400, gamut: '100% sRGB', port: 'DP 1.2', sync: 'None', curve: 'Flat' },
        'Gaming Fast (2020)': { type: 'TN', size: 24, w: 1920, h: 1080, hz: 240, nits: 400, contrast: 900, resp: 1, bits: 8, price: 300, gamut: '100% sRGB', port: 'DP 1.4', sync: 'FreeSync', curve: 'Flat' },
        'OLED TV (2022)': { type: 'OLED', size: 65, w: 3840, h: 2160, hz: 120, nits: 800, contrast: 1000000, resp: 0.1, bits: 10, price: 1500, gamut: '99% DCI-P3', port: 'HDMI 2.1', sync: 'G-Sync', curve: 'Flat' },
        'Mini-LED HDR (2024)': { type: 'Mini-LED', size: 32, w: 3840, h: 2160, hz: 165, nits: 1200, contrast: 100000, resp: 3, bits: 10, price: 1200, gamut: '95% DCI-P3', port: 'DP 1.4', sync: 'FreeSync Premium', curve: '1000R' },
        'Vision VR (2025)': { type: 'Micro-OLED', size: 2, w: 3600, h: 3200, hz: 90, nits: 5000, contrast: 1000000, resp: 0.01, bits: 12, price: 3500, gamut: '90% Rec.2020', port: 'Internal', sync: 'VRR', curve: 'Flat' }
    },

    portCapacities: {
        'VGA': 2.0,
        'HDMI 1.4': 10.2,
        'HDMI 2.0': 18.0,
        'DP 1.2': 21.6,
        'DP 1.4': 32.4,
        'HDMI 2.1': 48.0,
        'DP 2.1': 80.0,
        'Internal': 999.0 // For VR/Laptops
    },

    // --- 2. UI RENDERER ---
    render: function(container) {
        if (!container) return;

        const currentYear = new Date().getFullYear();

        container.innerHTML = `
            <div class="architect-container">
                
                <div style="grid-column: 1 / -1; display:flex; gap:10px; margin-bottom:10px; flex-wrap:wrap;">
                    ${Object.keys(this.presets).map(k => 
                        `<button style="background:#333; color:#fff; border:1px solid #555; padding:5px 10px; cursor:pointer; font-size:0.8rem; border-radius:4px;" onclick="window.display.loadPreset('${k}')">${k.split(' ')[0]} ${k.split(' ')[1] || ''}</button>`
                    ).join('')}
                </div>

                <div class="panel">
                    <h3>Identity & Panel</h3>
                    <div class="input-group">
                        <label>Model Name</label>
                        <input type="text" id="disp-name" value="UltraView X1">
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Technology</label>
                            <select id="disp-type">
                                <option value="CRT">CRT (Retro)</option>
                                <option value="TN">TN (Fast/Cheap)</option>
                                <option value="IPS">IPS (Color Acc)</option>
                                <option value="VA">VA (Contrast)</option>
                                <option value="OLED">OLED (Perfect)</option>
                                <option value="Mini-LED">Mini-LED (Bright)</option>
                                <option value="Micro-OLED">Micro-OLED (VR)</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Diag Size (Inch)</label>
                            <input type="number" id="disp-size" value="27" step="0.1">
                        </div>
                    </div>
                    <div class="input-group" style="margin-top:10px;">
                        <label>Panel Curvature</label>
                        <select id="disp-curve">
                            <option value="Flat">Flat Panel</option>
                            <option value="1800R">1800R (Subtle Curve)</option>
                            <option value="1500R">1500R (Moderate Curve)</option>
                            <option value="1000R">1000R (Extreme Curve)</option>
                        </select>
                    </div>
                </div>

                <div class="panel">
                    <h3>Resolution & Speed</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Width (px)</label>
                            <input type="number" id="disp-w" value="2560">
                        </div>
                        <div class="input-group">
                            <label>Height (px)</label>
                            <input type="number" id="disp-h" value="1440">
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px;">
                        <div class="input-group">
                            <label>Refresh Rate (Hz)</label>
                            <input type="number" id="disp-hz" value="144">
                        </div>
                        <div class="input-group">
                            <label>Raw Response (ms)</label>
                            <input type="number" id="disp-resp" value="1" step="0.1" title="Note: Actual response is clamped by panel technology">
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>Color, Light & Connectivity</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Brightness (nits)</label>
                            <input type="number" id="disp-nits" value="400">
                        </div>
                        <div class="input-group">
                            <label>Contrast (:1)</label>
                            <input type="number" id="disp-contrast" value="1000">
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px;">
                        <div class="input-group">
                            <label>Color Gamut</label>
                            <select id="disp-gamut">
                                <option value="70% sRGB">70% sRGB (Basic)</option>
                                <option value="90% sRGB">90% sRGB (Office)</option>
                                <option value="100% sRGB">100% sRGB (Standard)</option>
                                <option value="95% DCI-P3">95% DCI-P3 (Creator)</option>
                                <option value="99% DCI-P3">99% DCI-P3 (Pro/Cinema)</option>
                                <option value="90% Rec.2020">90% Rec.2020 (Cutting Edge)</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Color Depth (Bit)</label>
                            <input type="number" id="disp-bits" value="10" step="2">
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px; border-top:1px solid #333; padding-top:10px;">
                        <div class="input-group">
                            <label>Primary Port</label>
                            <select id="disp-port">
                                ${Object.keys(this.portCapacities).map(p => `<option value="${p}">${p}</option>`).join('')}
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Adaptive Sync</label>
                            <select id="disp-sync">
                                <option value="None">None</option>
                                <option value="VRR">Basic VRR</option>
                                <option value="FreeSync">FreeSync</option>
                                <option value="FreeSync Premium">FreeSync Premium</option>
                                <option value="G-Sync">G-Sync Module</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="panel" style="border-color: var(--accent-success);">
                    <h3>Release & Simulation</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Launch Year</label>
                            <input type="number" id="disp-year" value="${currentYear}">
                        </div>
                        <div class="input-group">
                            <label>Price ($)</label>
                            <input type="number" id="disp-price" value="499">
                        </div>
                    </div>

                    <div style="margin-top:15px; background:rgba(0,0,0,0.3); padding:10px; border-radius:4px; margin-bottom:15px; border:1px solid #333;">
                        <ul id="disp-live-stats" style="list-style:none; padding:0; margin:0; font-size:0.8rem; color:#ccc;">
                            </ul>
                    </div>

                    <button class="btn-action" onclick="window.display.saveSystem()">
                        MANUFACTURE & RELEASE
                    </button>
                </div>

                <div class="panel" style="grid-column: 1 / -1; border-color: #444;">
                    <h3 style="border-bottom:1px solid #444; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                        Active Lineup
                        <button onclick="window.display.refreshLineup()" style="background:none; border:none; color:#888; cursor:pointer; font-size:0.7rem;">↻ Refresh</button>
                    </h3>
                    
                    <div id="active-disp-list" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:12px;">
                        <div style="padding:10px; color:#555;">Loading market data...</div>
                    </div>
                </div>

            </div>
        `;

        // Bind Events using both change and input to fix the select bug
        container.querySelectorAll('input, select').forEach(el => {
            el.addEventListener('input', () => this.updatePhysics());
            el.addEventListener('change', () => this.updatePhysics());
        });
        
        this.updatePhysics();
        this.refreshLineup();
    },

    loadPreset: function(name) {
        const p = this.presets[name];
        if(!p) return;
        
        const set = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };

        set('disp-name', name.split(' (')[0]);
        set('disp-type', p.type);
        set('disp-size', p.size);
        set('disp-w', p.w);
        set('disp-h', p.h);
        set('disp-hz', p.hz);
        set('disp-resp', p.resp);
        set('disp-nits', p.nits);
        set('disp-contrast', p.contrast);
        set('disp-bits', p.bits);
        set('disp-price', p.price);
        
        if(p.gamut) set('disp-gamut', p.gamut);
        if(p.port) set('disp-port', p.port);
        if(p.sync) set('disp-sync', p.sync);
        if(p.curve) set('disp-curve', p.curve);
        
        this.updatePhysics();
    },

    // --- 3. PHYSICS ENGINE V3.0 ---
    scrapeData: function() {
        // Safe getter that doesn't accidentally coerce strings to numbers improperly
        const getNum = (id) => { const el = document.getElementById(id); return parseFloat(el.value) || 0; };
        const getStr = (id) => { const el = document.getElementById(id); return el.value; };

        return {
            name: getStr('disp-name'),
            type: getStr('disp-type'),
            size: getNum('disp-size'),
            w: getNum('disp-w'),
            h: getNum('disp-h'),
            hz: getNum('disp-hz'),
            resp: getNum('disp-resp'),
            nits: getNum('disp-nits'),
            contrast: getNum('disp-contrast'),
            bits: getNum('disp-bits'),
            price: getNum('disp-price'),
            year: getNum('disp-year'),
            gamut: getStr('disp-gamut'),
            port: getStr('disp-port'),
            sync: getStr('disp-sync'),
            curve: getStr('disp-curve')
        };
    },

    getAspectRatio: function(w, h) {
        const ratio = w / h;
        if(ratio >= 3.5) return "32:9 Super Ultrawide";
        if(ratio >= 2.3) return "21:9 Ultrawide";
        if(ratio >= 1.7) return "16:9 Standard";
        if(ratio >= 1.5) return "16:10 Productivity";
        if(ratio >= 1.3) return "4:3 Classic";
        return "Custom Ratio";
    },

    updatePhysics: function() {
        const d = this.scrapeData();
        
        // 1. PANEL SPECIFIC OVERRIDES & CONSTRAINTS
        let actualResp = d.resp;
        let viewAngle = "178°/178°";
        let colorPenalty = 1.0;
        let powerEff = 1.0;

        if (d.type === 'OLED' || d.type === 'Micro-OLED') {
            actualResp = 0.1; // Forced floor for OLED
            powerEff = 1.2; // OLED uses more power at full white
        } else if (d.type === 'TN') {
            actualResp = Math.max(0.5, d.resp);
            viewAngle = "170°/160° (Poor)";
            colorPenalty = 0.8; // TN washes out colors
            powerEff = 0.7; // Very efficient
        } else if (d.type === 'IPS') {
            actualResp = Math.max(1.0, d.resp);
            powerEff = 0.9;
        } else if (d.type === 'VA') {
            actualResp = Math.max(2.5, d.resp); // VA smear
            viewAngle = "178°/178° (Gamma Shift)";
        } else if (d.type === 'CRT') {
            actualResp = 0.01;
            powerEff = 3.0; // Power hungry
        }

        // 2. BANDWIDTH & PORT CALCULATION
        // (W * H * Hz * Bits * 3 channels) * 1.12 Overhead / 1 billion
        const rawBandwidth = ((d.w * d.h * d.hz * d.bits * 3) * 1.12) / 1000000000;
        const portLimit = this.portCapacities[d.port] || 18.0;
        const isBottlenecked = rawBandwidth > portLimit;

        // 3. MOTION CLARITY
        const persistence = 1000 / d.hz;
        const totalBlur = persistence + (actualResp * 1.5);
        
        // 4. HDR RATING
        let hdrBadge = "SDR";
        let hdrColor = "#888";
        let hdrScore = 0;

        // FIX: Mini-LED now correctly checks contrast to hit True Black tier
        if (d.bits >= 10 && d.nits >= 400) {
            if (d.contrast >= 100000 || d.type === "OLED" || d.type === "Micro-OLED") {
                hdrBadge = "HDR True Black";
                hdrColor = "#bd00ff"; // Purple
                hdrScore = 100;
            } else if (d.nits >= 1000 && d.contrast >= 5000) {
                hdrBadge = "HDR 1000";
                hdrColor = "#ff4444"; // Red
                hdrScore = 90;
            } else if (d.nits >= 600) {
                hdrBadge = "HDR 600";
                hdrColor = "#ffaa00"; // Orange
                hdrScore = 60;
            } else {
                hdrBadge = "HDR 400";
                hdrColor = "#00e676"; // Green
                hdrScore = 30;
            }
        }

        // 5. POWER CONSUMPTION MODEL
        // Formula: Proportional to Size^2 * Nits * Panel Efficiency Constant
        let watts = ((d.size * d.size) * (d.nits / 100) * powerEff) / 15;
        if(watts < 10) watts = 10;

        // 6. SUBSCORES (Gaming, Creative, Office)
        const ppi = Math.sqrt(d.w*d.w + d.h*d.h) / Math.max(d.size, 1);
        const aspect = this.getAspectRatio(d.w, d.h);

        // Gamut multiplier
        let gamutMult = 1.0;
        if(d.gamut.includes('DCI-P3')) gamutMult = 1.5;
        if(d.gamut.includes('Rec.2020')) gamutMult = 2.0;
        if(d.gamut.includes('70%')) gamutMult = 0.5;

        // A. Gaming Score
        let syncBonus = d.sync !== 'None' ? 200 : 0;
        let gamingScore = (d.hz * 10) + (2000 / Math.max(totalBlur, 0.1)) + syncBonus;
        if(d.curve !== 'Flat') gamingScore += 100; // Gamers like curves
        if(isBottlenecked) gamingScore *= 0.5; // Huge penalty if port limits refresh rate

        // B. Creative Score
        let creativeScore = (ppi * 5) + (hdrScore * 5) + (Math.log10(Math.max(1, d.contrast)) * 100);
        creativeScore *= gamutMult * colorPenalty;
        if(d.bits >= 10) creativeScore *= 1.2;

        // C. Office/General Score
        let officeScore = (ppi * 8) + (d.nits * 0.5);
        if(d.size >= 27 && d.size <= 34) officeScore += 500; // Sweet spot for productivity
        if(watts > 100) officeScore -= (watts - 100) * 2; // Penalty for power hogs

        // Combine for legacy visual score (weighted)
        let compositeScore = Math.floor((gamingScore * 0.4) + (creativeScore * 0.4) + (officeScore * 0.2));

        // UI Updates
        const display = document.getElementById('disp-live-stats');
        if (display) {
            let bwHtml = `<b>${rawBandwidth.toFixed(1)} Gbps</b> / <span style="color:#aaa;">${portLimit} Gbps (${d.port})</span>`;
            if(isBottlenecked) bwHtml = `<b style="color:#ff1744;">${rawBandwidth.toFixed(1)} Gbps (PORT BOTTLENECK!)</b>`;

            display.innerHTML = `
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Aspect / PPI:</span> <b>${aspect} | ${Math.floor(ppi)} PPI</b></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Viewing Angle:</span> <b style="color:#aaa">${viewAngle}</b></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Real Response:</span> <b>${actualResp.toFixed(2)} ms</b></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>HDR Tier:</span> <b style="color:${hdrColor}">${hdrBadge}</b></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Bandwidth Use:</span> ${bwHtml}</li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Est. Power Draw:</span> <b style="color:#ffaa00">${Math.floor(watts)}W</b></li>
                
                <li style="border-top:1px solid #333; margin-top:8px; padding-top:8px; display:flex; justify-content:space-between;">
                    <span style="color:#00e676;">[Gaming: ${Math.floor(gamingScore)}]</span>
                    <span style="color:#bd00ff;">[Creative: ${Math.floor(creativeScore)}]</span>
                    <span style="color:#00aaff;">[Office: ${Math.floor(officeScore)}]</span>
                </li>
            `;
        }
        
        return { compositeScore, gamingScore, creativeScore, officeScore, hdrBadge, isBottlenecked };
    },

    // --- 4. DATABASE & SAVE LOGIC ---
    refreshLineup: function() {
        const container = document.getElementById('active-disp-list');
        if(!container || !window.sys) return;

        const db = window.sys.load();
        const activeDisp = db.inventory.filter(i => i.type === 'Display' && i.active === true);

        if(activeDisp.length === 0) {
            container.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:20px;">No active Displays on the market.</div>`;
            return;
        }

        container.innerHTML = activeDisp.map(disp => {
            const specs = disp.specs || {};
            return `
            <div class="panel" style="padding:15px; display:flex; flex-direction:column; gap:5px;">
                <div style="font-weight:800; color:var(--accent); font-size:1rem;">${disp.name}</div>
                <div style="font-size:0.75rem; color:#aaa; font-family:var(--font-mono);">
                    <div>${specs.Panel || 'N/A'}</div>
                    <div style="margin-top:2px;">${specs.Resolution || 'N/A'} | ${specs.Refresh || 'N/A'}</div>
                    <div style="margin-top:2px;">${specs.HDR || 'SDR'} | ${specs.Sync || 'No Sync'}</div>
                    <div style="margin-top:6px; color:#fff; font-size:0.9rem;">$${disp.raw?.price || disp.price || 0}</div>
                </div>
                
                <button onclick="window.sys.discontinue(${disp.id})" 
                    style="margin-top:10px; background:rgba(255,23,68,0.1); color:#ff1744; border:1px solid rgba(255,23,68,0.3); font-weight:bold; font-size:0.7rem; padding:8px; cursor:pointer; border-radius:4px; transition:0.2s;">
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

        if (results.isBottlenecked && !confirm("WARNING: The selected port cannot support this bandwidth! The display will be severely bottlenecked. Manufacture anyway?")) {
            return;
        }

        window.sys.saveDesign('Display', {
            name: data.name,
            
            // Display Specs for Storefront
            specs: {
                "Panel": `${data.size}" ${data.type} (${data.curve})`,
                "Resolution": `${data.w} x ${data.h}`,
                "Refresh": `${data.hz}Hz`,
                "Color": `${data.gamut} (${data.bits}-bit)`,
                "HDR": results.hdrBadge,
                "Sync": data.sync,
                "Score": results.compositeScore
            },
            
            // Raw Data & Subscores
            price: data.price,
            year: data.year,
            benchmarks: {
                gaming: results.gamingScore,
                creative: results.creativeScore,
                office: results.officeScore
            },
            ...data
        });

        this.refreshLineup();
    }
};