/* HARDWARE TYCOON: CAMERA ARCHITECT
 * PHYSICS ENGINE V4.0 (ISPs, Optics, Subscores & Video Data Rates)
 * Optimized for Flat Structure
 */

window.camera = {

    // --- 1. INTERNAL STATE ---
    lenses: [],

    // --- 2. PRESETS ---
    presets: {
        'Budget Saver': { segment: 'Smartphone', aspect: '4:3', mp: 12, size: 6, f: 2.2, bits: 8, vid: '1080p', fps: 60, fmp: 8, fap: 2.4, isp: 'Basic', ois: false, readout: 30, af: 'CDAF', flash: 'Single LED', coating: 'None', lenses: [], price: 50 },
        'Mid-Range Balanced': { segment: 'Smartphone', aspect: '4:3', mp: 48, size: 9, f: 1.8, bits: 10, vid: '4K', fps: 120, fmp: 16, fap: 2.2, isp: 'Advanced', ois: true, readout: 15, af: 'PDAF', flash: 'Dual Tone', coating: 'Single', lenses: [{type:'Ultrawide', mp:8, f:2.4, mm:13}], price: 150 },
        'Flagship 2026': { segment: 'Smartphone', aspect: '4:3', mp: 50, size: 16, f: 1.4, bits: 14, vid: '8K', fps: 240, fmp: 32, fap: 2.0, isp: 'AI-Enhanced', ois: true, readout: 8, af: 'Laser AF', flash: 'Dual Tone', coating: 'Multi-Layer', lenses: [{type:'Ultrawide', mp:48, f:2.2, mm:12}, {type:'Telephoto', mp:12, f:2.8, mm:70}], price: 400 },
        'Pro Photography': { segment: 'Smartphone', aspect: '3:2', mp: 200, size: 16, f: 1.7, bits: 16, vid: '8K', fps: 480, fmp: 40, fap: 1.8, isp: 'AI-Enhanced', ois: true, readout: 5, af: 'Laser AF', flash: 'Xenon', coating: 'Nano Coating', lenses: [{type:'Ultrawide', mp:50, f:2.0, mm:13}, {type:'Periscope', mp:64, f:3.5, mm:120}], price: 800 },
        'Action Cam': { segment: 'Action Cam', aspect: '16:9', mp: 24, size: 11, f: 2.8, bits: 10, vid: '4K', fps: 240, fmp: 0, fap: 0, isp: 'Advanced', ois: false, readout: 5, af: 'Fixed Focus', flash: 'None', coating: 'Nano Coating', lenses: [], price: 300 },
        'Full Frame Mirrorless': { segment: 'Mirrorless', aspect: '3:2', mp: 45, size: 43.2, f: 1.2, bits: 16, vid: '8K', fps: 60, fmp: 0, fap: 0, isp: 'Advanced', ois: true, readout: 10, af: 'PDAF', flash: 'None', coating: 'Nano Coating', lenses: [], price: 2500 }
    },

    // --- 3. UI RENDERER ---
    render: function(container) {
        if (!container) return;

        // Reset state on render so lenses don't persist across navigation
        this.lenses = []; 

        const currentYear = new Date().getFullYear();

        container.innerHTML = `
            <div class="architect-container">
                
                <div style="grid-column: 1 / -1; display:flex; gap:10px; margin-bottom:10px; flex-wrap:wrap;">
                    ${Object.keys(this.presets).map(k => 
                        `<button style="background:#333; color:#fff; border:1px solid #555; padding:5px 10px; cursor:pointer; font-size:0.8rem; border-radius:4px;" onclick="window.camera.loadPreset('${k}')">${k}</button>`
                    ).join('')}
                </div>

                <div class="panel">
                    <h3>Sensor & Identity</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Segment</label>
                            <select id="cam-segment">
                                <option value="Smartphone">Smartphone</option>
                                <option value="Webcam">Webcam</option>
                                <option value="Action Cam">Action Cam</option>
                                <option value="Security">Security / Dashcam</option>
                                <option value="Mirrorless">Mirrorless / DSLR</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>System Name</label>
                            <input type="text" id="cam-name" value="OmniVision X-Pro">
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Aspect Ratio</label>
                            <select id="cam-aspect">
                                <option value="4:3">4:3 (Standard)</option>
                                <option value="3:2">3:2 (Pro Photo)</option>
                                <option value="16:9">16:9 (Video)</option>
                                <option value="1:1">1:1 (Square)</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Diag Size (mm)</label>
                            <input type="number" id="cam-sensor" value="12" step="0.1">
                        </div>
                        <div class="input-group">
                            <label>Resolution (MP)</label>
                            <input type="number" id="cam-mp" value="50">
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px; border-top:1px solid #333; padding-top:10px;">
                        <div class="input-group">
                            <label>Sensor Readout (ms)</label>
                            <input type="number" id="cam-readout" value="15" step="1" title="Lower = less rolling shutter">
                        </div>
                        <div class="input-group">
                            <label>Color Depth (Bit)</label>
                            <input type="number" id="cam-bits" value="10" step="2">
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>Optics & Processing</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Base FL (mm)</label>
                            <input type="number" id="cam-mm" value="24" title="35mm equivalent focal length">
                        </div>
                        <div class="input-group">
                            <label>Aperture (f/)</label>
                            <input type="number" id="cam-f" value="1.8" step="0.1">
                        </div>
                        <div class="input-group" style="display:flex; align-items:center; justify-content:center; padding-top:15px;">
                            <label style="display:flex; align-items:center; gap:5px; cursor:pointer;">
                                <input type="checkbox" id="cam-ois" checked> OIS
                            </label>
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px;">
                        <div class="input-group">
                            <label>Autofocus (AF)</label>
                            <select id="cam-af">
                                <option value="Fixed Focus">Fixed Focus</option>
                                <option value="CDAF">CDAF (Contrast)</option>
                                <option value="PDAF">PDAF (Phase)</option>
                                <option value="Laser AF">Laser + PDAF</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Lens Coating</label>
                            <select id="cam-coating">
                                <option value="None">None</option>
                                <option value="Single">Single Layer</option>
                                <option value="Multi-Layer">Multi-Layer</option>
                                <option value="Nano Coating">Nano / Zeiss</option>
                            </select>
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px; border-top:1px solid #333; padding-top:10px;">
                        <div class="input-group">
                            <label>Image Processor (ISP)</label>
                            <select id="cam-isp">
                                <option value="Basic">Basic</option>
                                <option value="Advanced">Advanced HDR</option>
                                <option value="AI-Enhanced">AI-Enhanced</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Flash Unit</label>
                            <select id="cam-flash">
                                <option value="None">None</option>
                                <option value="Single LED">Single LED</option>
                                <option value="Dual Tone">Dual Tone LED</option>
                                <option value="Xenon">Xenon Strobe</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h3>Video & Auxiliary</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Video Resolution</label>
                            <select id="cam-vid">
                                <option value="1080p">1080p FHD</option>
                                <option value="4K">4K UHD</option>
                                <option value="8K">8K UHD</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Video Framerate (FPS)</label>
                            <input type="number" id="cam-fps" value="60" step="30">
                        </div>
                    </div>
                    <div class="input-group" style="margin-top:10px;">
                        <label>Selfie Camera (MP / f-stop)</label>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                            <input type="number" id="cam-fmp" value="12" placeholder="MP">
                            <input type="number" id="cam-fap" value="2.2" step="0.1" placeholder="f/">
                        </div>
                    </div>

                    <h4 style="margin-top:20px; color:var(--text-muted); font-size:0.8rem; border-bottom:1px solid #333; padding-bottom:5px;">Auxiliary Lenses</h4>
                    <div id="lens-container" style="min-height:40px;"></div>
                    <div style="display:flex; gap:5px; margin-top:10px;">
                        <button style="flex:1; background:#333; color:#fff; border:1px solid #555; cursor:pointer; font-size:0.75rem;" onclick="window.camera.addLens('Ultrawide')">+ Ultra</button>
                        <button style="flex:1; background:#333; color:#fff; border:1px solid #555; cursor:pointer; font-size:0.75rem;" onclick="window.camera.addLens('Telephoto')">+ Tele</button>
                        <button style="flex:1; background:#333; color:#fff; border:1px solid #555; cursor:pointer; font-size:0.75rem;" onclick="window.camera.addLens('Periscope')">+ Zoom</button>
                    </div>
                </div>

                <div class="panel" style="border-color: var(--accent-secondary);">
                    <h3>Optics & Compute Diagnostics</h3>
                    <ul id="cam-live-stats" style="list-style:none; padding:0; margin:0; font-size:0.8rem; color:#ccc;">
                        <li>Calculating...</li>
                    </ul>
                    <div style="margin-top:15px; height:80px; background:#000; border:1px dashed #444; display:flex; align-items:center; justify-content:center; position:relative;">
                        <div id="viz-sensor" style="border:1px solid var(--accent); background:rgba(255,255,255,0.1);"></div>
                        <span style="position:absolute; bottom:2px; right:4px; font-size:9px; color:#555;">1:1 Scale (Ref 40mm)</span>
                    </div>
                </div>

                <div class="panel" style="border-color: var(--accent-success);">
                    <h3>Release & Pricing</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="input-group">
                            <label>Launch Year</label>
                            <input type="number" id="cam-year" value="${currentYear}">
                        </div>
                        <div class="input-group">
                            <label>Cost ($)</label>
                            <input type="number" id="cam-price" value="150">
                        </div>
                    </div>

                    <button class="btn-action" onclick="window.camera.saveSystem()" style="margin-top:20px;">
                        MANUFACTURE & RELEASE
                    </button>
                </div>

                <div class="panel" style="grid-column: 1 / -1; border-color: #444;">
                    <h3 style="border-bottom:1px solid #444; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                        Active Lineup
                        <button onclick="window.camera.refreshLineup()" style="background:none; border:none; color:#888; cursor:pointer; font-size:0.7rem;">↻ Refresh</button>
                    </h3>
                    
                    <div id="active-cam-list" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:12px;">
                        <div style="padding:10px; color:#555;">Loading market data...</div>
                    </div>
                </div>

            </div>
        `;

        // Bind Events
        container.querySelectorAll('input, select').forEach(el => {
            el.addEventListener('input', () => this.updatePhysics());
            el.addEventListener('change', () => this.updatePhysics());
        });
        
        // Init
        this.renderLenses();
        this.updatePhysics();
        this.refreshLineup();
    },

    // --- 4. LENS MANAGEMENT ---
    addLens: function(type) {
        let defaultMm = 24;
        if(type === 'Ultrawide') defaultMm = 13;
        if(type === 'Telephoto') defaultMm = 70;
        if(type === 'Periscope') defaultMm = 120;

        this.lenses.push({ type: type, mp: 12, f: 2.4, mm: defaultMm });
        this.renderLenses();
        this.updatePhysics();
    },

    removeLens: function(index) {
        this.lenses.splice(index, 1);
        this.renderLenses();
        this.updatePhysics();
    },

    renderLenses: function() {
        const con = document.getElementById('lens-container');
        if(!con) return;
        
        con.innerHTML = this.lenses.map((l, i) => `
            <div style="display:flex; gap:5px; margin-bottom:5px; align-items:center; background:rgba(255,255,255,0.05); padding:5px; border-radius:4px;">
                <span style="font-size:0.7rem; flex:1; color:#ccc;">${l.type}</span>
                <input type="number" value="${l.mp}" style="width:40px; background:#111; border:1px solid #333; color:#fff; padding:2px; font-size:0.7rem;" oninput="window.camera.updateLens(${i}, 'mp', this.value)"> <span style="font-size:0.6rem; color:#888;">MP</span>
                <input type="number" value="${l.f}" style="width:35px; background:#111; border:1px solid #333; color:#fff; padding:2px; font-size:0.7rem;" oninput="window.camera.updateLens(${i}, 'f', this.value)"> <span style="font-size:0.6rem; color:#888;">f/</span>
                <input type="number" value="${l.mm}" style="width:35px; background:#111; border:1px solid #333; color:#fff; padding:2px; font-size:0.7rem;" oninput="window.camera.updateLens(${i}, 'mm', this.value)"> <span style="font-size:0.6rem; color:#888;">mm</span>
                <button style="width:20px; height:20px; padding:0; background:none; color:#f55; border:none; cursor:pointer;" onclick="window.camera.removeLens(${i})">×</button>
            </div>
        `).join('');
    },

    updateLens: function(i, key, val) {
        this.lenses[i][key] = parseFloat(val);
        this.updatePhysics();
    },

    loadPreset: function(name) {
        const p = this.presets[name];
        if(!p) return;
        
        const set = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };
        const setCheck = (id, val) => { const el = document.getElementById(id); if(el) el.checked = val; };

        set('cam-name', name);
        set('cam-segment', p.segment);
        set('cam-aspect', p.aspect);
        set('cam-mp', p.mp);
        set('cam-sensor', p.size);
        set('cam-readout', p.readout);
        set('cam-f', p.f);
        setCheck('cam-ois', p.ois);
        set('cam-af', p.af);
        set('cam-coating', p.coating);
        set('cam-isp', p.isp);
        set('cam-flash', p.flash);
        set('cam-bits', p.bits);
        set('cam-vid', p.vid);
        set('cam-fps', p.fps);
        set('cam-fmp', p.fmp);
        set('cam-fap', p.fap);
        set('cam-price', p.price || 150);
        
        // Deep copy lenses
        this.lenses = JSON.parse(JSON.stringify(p.lenses || []));
        
        this.renderLenses();
        this.updatePhysics();
    },

    // --- 5. PHYSICS ENGINE V4.0 ---
    getSensorName: function(diagMm) {
        if(diagMm >= 43) return "Full Frame";
        if(diagMm >= 28) return "APS-C";
        if(diagMm >= 21) return "Four Thirds";
        if(diagMm >= 15) return "1-inch";
        if(diagMm >= 11) return "1/1.3\"";
        if(diagMm >= 9) return "1/1.7\"";
        if(diagMm >= 7) return "1/2.3\"";
        if(diagMm >= 5) return "1/3.2\"";
        return "Small Mobile";
    },

    scrapeData: function() {
        const get = (id) => {
            const el = document.getElementById(id);
            if (!el) return 0;
            if (el.tagName === 'SELECT') return isNaN(Number(el.value)) ? el.value : Number(el.value);
            return parseFloat(el.value) || 0;
        };

        return {
            name: document.getElementById('cam-name').value,
            segment: document.getElementById('cam-segment').value,
            aspect: document.getElementById('cam-aspect').value,
            mp: get('cam-mp'),
            mm: get('cam-sensor'),
            readout: get('cam-readout'),
            baseMm: get('cam-mm') || 24,
            f: get('cam-f'),
            ois: document.getElementById('cam-ois').checked,
            af: document.getElementById('cam-af').value,
            coating: document.getElementById('cam-coating').value,
            isp: document.getElementById('cam-isp').value,
            flash: document.getElementById('cam-flash').value,
            bits: get('cam-bits'),
            vid: document.getElementById('cam-vid').value,
            fps: get('cam-fps'),
            fmp: get('cam-fmp'),
            fap: get('cam-fap'),
            year: get('cam-year'),
            price: get('cam-price')
        };
    },

    updatePhysics: function() {
        const d = this.scrapeData();

        // 1. SENSOR GEOMETRY (Aspect Ratio aware)
        // diag^2 = w^2 + h^2. If w = r*h, diag^2 = h^2(r^2 + 1)
        let r = 4/3;
        if(d.aspect === '3:2') r = 1.5;
        if(d.aspect === '16:9') r = 16/9;
        if(d.aspect === '1:1') r = 1;

        const h = Math.sqrt((d.mm * d.mm) / ((r * r) + 1));
        const w = r * h;
        const area = w * h; 

        const formatName = this.getSensorName(d.mm);

        // 2. PIXEL PITCH & LOW LIGHT (ISO)
        const totalPixels = Math.max(d.mp, 1) * 1000000;
        const pitch = Math.sqrt(area / totalPixels) * 1000; // in micrometers
        const pixelArea = pitch * pitch;
        
        // Usable ISO is derived from photon gathering capacity (pixel area + aperture + OIS + ISP)
        let sensorGain = 100; // Base sensitivity
        if(d.isp === 'Advanced') sensorGain *= 1.5;
        if(d.isp === 'AI-Enhanced') sensorGain *= 2.5;
        if(d.ois) sensorGain *= 1.5; // OIS allows slower shutter, simulating higher usable ISO

        const usableISO = Math.floor(pixelArea * sensorGain * (1 / (d.f * d.f)) * 50);

        // 3. DIFFRACTION LIMIT (Fix: airyDisk < pitch * 0.7 for soft)
        const airyDisk = 1.22 * 0.55 * d.f;
        let diffStatus = "Sharp";
        let diffColor = "#00e676"; // Green
        
        if (airyDisk > pitch) {
            diffStatus = "Diffraction Soft";
            diffColor = "#ff1744"; // Red
        } else if (airyDisk > pitch * 0.7) {
            diffStatus = "Limit Reached";
            diffColor = "#ffaa00"; // Orange
        }

        // 4. VIDEO DATA RATE & THERMALS
        let vidW = 1920, vidH = 1080;
        if(d.vid === '4K') { vidW = 3840; vidH = 2160; }
        if(d.vid === '8K') { vidW = 7680; vidH = 4320; }

        // Bitrate (Mbps) = W * H * FPS * bits * compression_factor
        const bitrate = (vidW * vidH * d.fps * d.bits * 0.05) / 1000000;
        const storageSpeed = bitrate / 8; // MB/s
        
        // Thermal Limit (minutes)
        const thermalBudget = (d.segment === 'Action Cam' || d.segment === 'Mirrorless') ? 500 : 150;
        const vidPower = (vidW * vidH * d.fps) / 10000000;
        let recLimit = Math.floor(thermalBudget / Math.max(vidPower, 0.1));
        if(recLimit > 120) recLimit = "Unlimited";
        else recLimit += " mins";

        // 5. COMPUTATIONAL FEATURES
        const compFeatures = [];
        if (d.isp === 'Advanced' || d.isp === 'AI-Enhanced') {
            compFeatures.push('HDR+');
            compFeatures.push('Night Mode');
        }
        if (d.isp === 'AI-Enhanced') {
            compFeatures.push('Super-res Zoom');
            compFeatures.push('Astro Mode');
        }
        if (compFeatures.length === 0) compFeatures.push('Basic Processing');

        // 6. SUBSCORES
        // A. Photo Score
        let photoScore = (d.mp * 2) + (area * 3) + (d.bits * 10);
        if(d.coating !== 'None') photoScore *= 1.1;
        if(d.coating === 'Nano Coating') photoScore *= 1.2;
        if(d.af.includes('PDAF')) photoScore += 20;
        if(d.af === 'Laser AF') photoScore += 40;
        if(d.isp === 'AI-Enhanced') photoScore *= 1.3;

        // B. Low-Light Score
        let lowLightScore = (usableISO / 10) + (d.ois ? 50 : 0);
        if(d.flash === 'Dual Tone') lowLightScore += 20;
        if(d.flash === 'Xenon') lowLightScore += 50;
        if(d.isp === 'AI-Enhanced') lowLightScore *= 1.4;

        // C. Video Score
        let videoScore = (vidW * vidH * d.fps) / 500000;
        if(d.ois) videoScore += 40;
        if(d.readout <= 10) videoScore *= 1.2; // Fast readout = no rolling shutter
        if(d.readout > 25) videoScore *= 0.7; // Jello effect
        if(recLimit !== "Unlimited" && parseInt(recLimit) < 10) videoScore *= 0.5; // Overheats too fast

        // D. Zoom Range Score
        let maxMm = d.baseMm;
        this.lenses.forEach(l => { if(l.mm > maxMm) maxMm = l.mm; });
        let zoomRatio = maxMm / Math.max(d.baseMm, 1);
        let zoomScore = (zoomRatio * 20) + (this.lenses.length * 15);
        if(d.isp === 'AI-Enhanced') zoomScore += 30; // Super-res zoom

        // E. Selfie Score
        let selfieScore = (d.fmp * 5) + (d.fap > 0 ? (10 / d.fap) : 0);

        // Overall Image Quality Score
        let totalScore = Math.floor((photoScore * 0.4) + (lowLightScore * 0.3) + (videoScore * 0.2) + (zoomScore * 0.1));

        // UI UPDATES
        const display = document.getElementById('cam-live-stats');
        const viz = document.getElementById('viz-sensor');
        
        if (viz) {
            // Scale: 80px container represents 40mm width (Full frame ref)
            const scale = 80 / 40; 
            viz.style.width = (w * scale) + "px";
            viz.style.height = (h * scale) + "px";
        }

        if (display) {
            display.innerHTML = `
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Sensor Class:</span> <b>${formatName} (${d.aspect})</b></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Pixel Pitch:</span> <b style="color:${diffColor}">${pitch.toFixed(2)} µm</b></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Usable ISO Eq.:</span> <b>ISO ${usableISO}</b></li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Optics:</span> <b style="color:${diffColor}">${diffStatus}</b></li>
                
                <li style="border-top:1px solid #333; margin-top:6px; padding-top:6px; display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span>Video Bitrate:</span> <b style="color:#ffaa00">${bitrate.toFixed(0)} Mbps (${storageSpeed.toFixed(1)} MB/s)</b>
                </li>
                <li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Thermal Limit:</span> <b>${recLimit}</b></li>
                
                <li style="border-top:1px solid #333; margin-top:6px; padding-top:6px; font-size:0.7rem; color:#aaa; margin-bottom:4px;">
                    AI/ISP Features: ${compFeatures.join(', ')}
                </li>

                <li style="border-top:1px solid #333; margin-top:6px; padding-top:8px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:5px;">
                    <span style="color:#00e676;">[Photo: ${Math.floor(photoScore)}]</span>
                    <span style="color:#bd00ff;">[Low-Light: ${Math.floor(lowLightScore)}]</span>
                    <span style="color:#00aaff;">[Video: ${Math.floor(videoScore)}]</span>
                    <span style="color:#ffaa00;">[Zoom: ${Math.floor(zoomScore)}]</span>
                </li>
                <li style="display:flex; justify-content:space-between; border-top:1px dashed #444; margin-top:6px; padding-top:6px; font-size:0.9rem;">
                    <span>Overall IQ Score:</span> <b style="color:var(--accent)">${totalScore}</b>
                </li>
            `;
        }
        
        return { 
            totalScore, photoScore, lowLightScore, videoScore, zoomScore, selfieScore, 
            setup: 1 + this.lenses.length, formatName 
        };
    },

    // --- 6. DATABASE & SAVE LOGIC ---
    refreshLineup: function() {
        const container = document.getElementById('active-cam-list');
        if(!container || !window.sys) return;

        const db = window.sys.load();
        const activeCams = db.inventory.filter(i => i.type === 'Camera' && i.active === true);

        if(activeCams.length === 0) {
            container.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:20px;">No active Camera Systems.</div>`;
            return;
        }

        container.innerHTML = activeCams.map(cam => {
            const specs = cam.specs || {};
            return `
            <div class="panel" style="padding:15px; display:flex; flex-direction:column; gap:5px;">
                <div style="font-weight:800; color:var(--accent); font-size:1rem;">${cam.name} <span style="font-size:0.6rem; color:#888; border:1px solid #444; padding:2px 4px; border-radius:3px; margin-left:4px;">${cam.raw?.segment||'Cam'}</span></div>
                <div style="font-size:0.75rem; color:#aaa; font-family:var(--font-mono);">
                    <div>${specs.Main} | ${specs.Video}</div>
                    <div style="margin-top:2px;">${specs.Setup} | ${specs.IQ}</div>
                    <div style="margin-top:6px; color:#fff; font-size:0.9rem;">$${cam.raw?.price || cam.price || 0}</div>
                </div>
                
                <button onclick="window.sys.discontinue(${cam.id})" 
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

        window.sys.saveDesign('Camera', {
            name: data.name,
            
            // Specs for Storefront
            specs: {
                "Main": `${data.mp}MP ${results.formatName}`,
                "Aperture": `f/${data.f}`,
                "Video": `${data.vid} @ ${data.fps}fps`,
                "Setup": `${results.setup} Cameras`,
                "IQ": `Score: ${results.totalScore}`
            },
            
            // Raw Data & Subscores
            price: data.price,
            year: data.year,
            lenses: this.lenses, // Save secondary lenses
            benchmarks: {
                photo: results.photoScore,
                lowLight: results.lowLightScore,
                video: results.videoScore,
                zoom: results.zoomScore,
                selfie: results.selfieScore
            },
            ...data
        });

        this.refreshLineup();
    }
};